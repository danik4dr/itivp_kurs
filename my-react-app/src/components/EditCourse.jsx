import React, { useState, useEffect } from "react";
import api from "../api/axios";

export default function EditCourse({ id, onBack }) {
  const [course, setCourse] = useState(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [err, setErr] = useState("");

  useEffect(() => {
    let mounted = true;
    setLoading(true);

    api.get(`courses/get_one.php?id=${id}`)
      .then(res => {
        let c = null;

        if (!res) c = null;
        else if (res.course) c = res.course;
        else if (res.data && res.data.course) c = res.data.course;
        else if (Array.isArray(res) && res[0]) c = res[0]; 
        else if (res.id) c = res;

        if (mounted) setCourse(c);
      })
      .catch(e => {
        console.error("load course:", e);
        setErr("Ошибка загрузки курса");
      })
      .finally(() => mounted && setLoading(false));

    return () => { mounted = false; };
  }, [id]);

  const save = async () => {
    if (!course) return;

    if (!course.title || course.title.trim() === "") {
      setErr("Поле 'Название' не может быть пустым");
      return;
    }

    setSaving(true);
    setErr("");

    try {
      const payload = {
        id: course.id,
        title: course.title,
        description: course.description,
        price: course.price
      };

      const res = await api.post("courses/update.php", payload);
      if (res.success) {
        alert("Изменения сохранены");
        onBack && onBack();
      } else {
        setErr(res.error || "Ошибка сохранения");
      }
    } catch (e) {
      console.error(e);
      setErr(e.message || "Ошибка сервера");
    } finally {
      setSaving(false);
    }
  };

  if (loading) return <div className="p-6">Загрузка...</div>;
  if (!course) return <div className="p-6 text-red-400">Курс не найден</div>;

  return (
    <div className="max-w-lg mx-auto bg-[#071429] p-6 rounded-2xl border border-slate-700">
      <h2 className="text-2xl font-bold mb-4">Редактировать курс</h2>

      <div className="flex flex-col gap-3">
        <input value={course.title || ""}
          onChange={e => setCourse({...course, title: e.target.value})}
          className="p-2 rounded bg-[#081226]" placeholder="Название" />

        <textarea value={course.description || ""} rows={3}
          onChange={e => setCourse({...course, description: e.target.value})}
          className="p-2 rounded bg-[#081226]" placeholder="Описание" />
          
        <input type="number" value={course.price !== null && course.price !== undefined ? course.price : ""}
          onChange={e => { const val = e.target.value; if (val === "" || Number(val) >= 0) { setCourse({ ...course, price: val === "" ? "" : Number(val) }); }}}
          className="p-2 rounded bg-[#081226]"
          placeholder="Цена"
        />
        {err && <div className="text-red-400">{err}</div>}

        <div className="flex gap-2">
          <button onClick={save} disabled={saving}
            className="bg-emerald-600 px-4 py-2 rounded">
            {saving ? "Сохранение..." : "Сохранить"}
          </button>

          <button onClick={onBack} className="bg-slate-600 px-4 py-2 rounded">
            Назад
          </button>
        </div>
      </div>
    </div>
  );
}
