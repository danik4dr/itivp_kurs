import React, { useState, useEffect } from "react";
import api from "../api/axios";

export default function EditSection({ id, onBack }) {
  const [section, setSection] = useState(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [err, setErr] = useState("");

  useEffect(() => {
    let mounted = true;
    setLoading(true);

    api.get(`sections/get_one.php?id=${id}`)
      .then(res => {
        let s = null;

        if (!res) s = null;
        else if (res.section) s = res.section;
        else if (res.data && res.data.section) s = res.data.section;
        else if (Array.isArray(res) && res[0]) s = res[0];
        else if (res.id) s = res;

        if (mounted) setSection(s);
      })
      .catch(e => {
        console.error("load section:", e);
        setErr("Ошибка загрузки секции");
      })
      .finally(() => mounted && setLoading(false));

    return () => { mounted = false; };
  }, [id]);

  const save = async () => {
    if (!section) return;

    if (!section.name || section.name.trim() === "") {
      setErr("Поле 'Название' не может быть пустым");
      return;
    }

    setSaving(true);
    setErr("");

    try {
      const payload = {
        id: section.id,
        name: section.name,
        location: section.location,
        schedule: section.schedule,
        capacity: section.capacity
      };

      const res = await api.post("sections/update.php", payload);
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
  if (!section) return <div className="p-6 text-red-400">Секция не найдена</div>;

  return (
    <div className="max-w-lg mx-auto bg-[#071429] p-6 rounded-2xl border border-slate-700">
      <h2 className="text-2xl font-bold mb-4">Редактировать секцию</h2>

      <div className="flex flex-col gap-3">
        
        <input value={section.name || ""}
          onChange={e => setSection({...section, name: e.target.value})}
          className="p-2 rounded bg-[#081226]" placeholder="Название секции" />

        <input value={section.location || ""}
          onChange={e => setSection({...section, location: e.target.value})}
          className="p-2 rounded bg-[#081226]" placeholder="Локация" />
        
        <input value={section.schedule || ""}
          onChange={e => setSection({...section, schedule: e.target.value})}
          className="p-2 rounded bg-[#081226]" placeholder="Расписание" />
        
        <input type="number" value={section.capacity !== null && section.capacity !== undefined ? section.capacity : ""}
          onChange={e => { const val = e.target.value; if (val === "" || Number(val) >= 0) { setSection({ ...section, capacity: val === "" ? "" : Number(val) }); }}}
          className="p-2 rounded bg-[#081226]"
          placeholder="Количество мест"
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
