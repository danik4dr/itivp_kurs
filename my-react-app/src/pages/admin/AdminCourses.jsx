import React, { useEffect, useState } from "react";
import api from "../../api/axios";

export default function AdminCourses() {
  const [courses, setCourses] = useState([]);
  const [trainers, setTrainers] = useState([]);

  const [form, setForm] = useState({
    trainer_id: "",
    title: "",
    price: "",
    description: ""
  });

  const load = async () => {
    const trainersData = await api.get("trainers/get_all.php");
    setTrainers(trainersData.trainers || []);

    const coursesData = await api.get("courses/get_all.php");
    setCourses(coursesData.courses || []);
  };

  useEffect(() => { load(); }, []);

  const save = async () => {
    await api.post("courses/create.php", form);
    setForm({ trainer_id: "", title: "", price: "", description: "" });
    load();
  };

  const remove = async (id) => {
    await api.post("courses/delete.php", { id });
    load();
  };

  return (
    <div className="p-6">

      <h2 className="text-3xl font-bold mb-4">Курсы</h2>

      <div className="bg-[#0A1B3D] p-4 rounded-lg mb-8 flex flex-col gap-3">

        <select className="input" value={form.trainer_id}
          onChange={e => setForm({ ...form, trainer_id: e.target.value })}>
          <option value="">Выберите тренера</option>
          {trainers.map(t => (
            <option key={t.id} value={t.id}>{t.name}</option>
          ))}
        </select>

        <input className="input" placeholder="Название" value={form.title}
          onChange={e => setForm({ ...form, title: e.target.value })} />

        <input className="input" placeholder="Цена" value={form.price}
          onChange={e => setForm({ ...form, price: e.target.value })} />

        <textarea className="input" placeholder="Описание" value={form.description}
          onChange={e => setForm({ ...form, description: e.target.value })}></textarea>

        <button onClick={save} className="btn-primary">Добавить курс</button>
      </div>

      <div className="grid gap-4">
        {courses.map(c => (
          <div key={c.id} className="bg-[#081226] p-4 rounded-lg border border-slate-700">
            <p className="text-xl font-bold">{c.title}</p>
            <p>Цена: {c.price} BYN</p>
            <button onClick={() => remove(c.id)} className="btn-danger mt-3">
              Удалить
            </button>
          </div>
        ))}
      </div>

    </div>
  );
}
