import React, { useEffect, useState } from "react";
import api from "../../api/axios";

export default function AdminSections() {
  const [sections, setSections] = useState([]);
  const [courses, setCourses] = useState([]);

  const [form, setForm] = useState({
    course_id: "",
    name: "",
    location: "",
    schedule: "",
    capacity: ""
  });

  const load = async () => {
    const c = await api.get("courses/get_all.php");
    setCourses(c.courses || []);

    const s = await api.get("sections/get_all.php");
    setSections(s.sections || []);
  };

  useEffect(() => { load(); }, []);

  const save = async () => {
    await api.post("sections/create.php", form);
    setForm({ course_id: "", name: "", location: "", schedule: "", capacity: "" });
    load();
  };

  const remove = async (id) => {
    await api.post("sections/delete.php", { id });
    load();
  };

  return (
    <div className="p-6">

      <h2 className="text-3xl font-bold mb-4">Секции</h2>

      <div className="bg-[#0A1B3D] p-4 rounded-lg mb-8 flex flex-col gap-3">

        <select className="input" value={form.course_id}
          onChange={e => setForm({ ...form, course_id: e.target.value })}>
          <option value="">Выберите курс</option>
          {courses.map(c => (
            <option key={c.id} value={c.id}>{c.title}</option>
          ))}
        </select>

        <input className="input" placeholder="Название секции" value={form.name}
          onChange={e => setForm({ ...form, name: e.target.value })} />

        <input className="input" placeholder="Локация" value={form.location}
          onChange={e => setForm({ ...form, location: e.target.value })} />

        <input className="input" placeholder="Расписание" value={form.schedule}
          onChange={e => setForm({ ...form, schedule: e.target.value })} />

        <input className="input" placeholder="Вместимость" value={form.capacity}
          onChange={e => setForm({ ...form, capacity: e.target.value })} />

        <button onClick={save} className="btn-primary">Добавить секцию</button>
      </div>

      <div className="grid gap-4">
        {sections.map(s => (
          <div key={s.id} className="bg-[#081226] p-4 rounded-lg border border-slate-700">
            <p className="text-xl font-bold">{s.name}</p>
            <p>{s.location}</p>
            <button onClick={() => remove(s.id)} className="btn-danger mt-3">
              Удалить
            </button>
          </div>
        ))}
      </div>

    </div>
  );
}
