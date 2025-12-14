import React from "react";
import api from "../api/axios";

export default function SectionCard({ section, adminMode, user, onUpdate, onEdit }) {
  const book = async () => {
    if (!user) {
      alert("Войдите как пользователь, чтобы записаться");
      return;
    }

    try {
      await api.post("bookings/create.php", { section_id: section.id });
      alert("Вы записаны!");
      if (onUpdate) onUpdate();
    } catch (e) {
      alert(e.message || "Ошибка");
    }
  };

  const del = async () => {
    if (!confirm("Удалить секцию?")) return;

    try {
      await api.post("sections/delete.php", { id: section.id });
      if (onUpdate) onUpdate();
    } catch (e) {
      alert(e.message || "Ошибка");
    }
  };

  return (
    <div className="bg-[#071429] p-4 rounded-xl border border-slate-700 transition-all hover:scale-[1.03] hover:border-green-500">
      <h4 className="font-semibold">{section.name}</h4>
      <p className="text-slate-300 mt-1">
        {section.location} • {section.schedule}
      </p>

      <div className="mt-3 flex gap-2">
        {user?.role === "user" && !adminMode && (
          <button onClick={book} className="bg-indigo-600 px-3 py-1 rounded">Записаться</button>
        )}

        {adminMode && typeof onEdit === "function" && (
          <button onClick={() => onEdit(section.id)} className="bg-yellow-600 px-3 py-1 rounded">
            Редактировать
          </button>
        )}

        {adminMode && (
          <button onClick={del} className="ml-auto bg-red-600 px-2 py-1 rounded">Удалить</button>
        )}
      </div>
    </div>
  );
}
