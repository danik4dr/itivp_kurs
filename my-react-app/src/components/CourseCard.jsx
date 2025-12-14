import React from "react";
import api from "../api/axios";

export default function CourseCard({ course, adminMode, onUpdate, onEdit }) {
  const del = async () => {
    if (!confirm("Удалить курс?")) return;
    try {
      await api.post("courses/delete.php", { id: course.id });
      if (onUpdate) onUpdate();
    } catch (e) { alert(e.message || "Ошибка"); }
  };

  return (
    <div className="bg-[#071429] p-4 rounded-xl border border-slate-700 transition-all hover:scale-[1.03] hover:border-indigo-300">
      <h4 className="font-semibold">{course.title}</h4>
      <p className="text-slate-300 mt-1">{course.description}</p>
      <p className="text-slate-400">{course.price} BYN</p>
      <div className="mt-3 flex items-center gap-2">

        {adminMode && typeof onEdit === "function" && (
          <button onClick={() => onEdit(course.id)} className="bg-yellow-600 px-3 py-1 rounded">
            Редактировать
          </button>
        )}

        {adminMode && (
          <button onClick={del} className="ml-auto bg-red-600 px-2 py-1 rounded text-white">Удалить</button>
        )}
      </div>
    </div>
  );
}
