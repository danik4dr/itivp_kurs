import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import api from "../../api/axios";

export default function CourseDetails({ user }) {
  const { id } = useParams();
  const [course, setCourse] = useState(null);
  const [sections, setSections] = useState([]);
  const [loading, setLoading] = useState(true);
  const nav = useNavigate();

  useEffect(() => {
    setLoading(true);
    api.get(`courses/get_section.php?id=${id}`)
      .then(data => {
        if (data.success) {
          setCourse(data.course);
          setSections(data.sections || []);
        } else {
          console.error("Не найдено");
        }
      })
      .catch(e => console.error(e))
      .finally(()=>setLoading(false));
  }, [id]);

  const book = async (sectionId) => {
  if (!user) { alert("Войдите как пользователь, чтобы записаться"); return; }

  try {
    const res = await api.post("bookings/create.php", { section_id: sectionId });

    if (!res.success) {
      alert(res.error);
      return;
    }

    alert("Вы успешно записались!");

    setSections(prev =>
      prev.map(s =>
        s.id === sectionId ? { ...s, capacity: res.new_capacity } : s
      )
    );

  } catch (e) {
    alert(e.message || "Ошибка");
  }
};


  if (loading) return <div>Загрузка...</div>;
  if (!course) return <div>Не найдено</div>;

  return (
    <div>
      <button className="mb-4 text-slate-300 hover:underline" onClick={()=>nav(-1)}>← Назад</button>
      <h2 className="text-2xl font-bold">{course.title}</h2>
      <p className="text-slate-400">{course.description}</p>
      <div className="mt-6">
        <h3 className="font-semibold mb-2">Секции</h3>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          {sections.map(s => (
            <div key={s.id} className="bg-[#071429] p-4 rounded-xl border border-slate-700 transition-all hover:scale-[1.02]">
              <h4>{s.name}</h4>
              <div className="text-slate-400">{s.location} • {s.schedule} • {s.capacity} мест/а</div>
              <div className="mt-3 flex gap-2">
                {user?.role === "admin" ? null : (
                  <button
                    onClick={() => book(s.id)}
                    className="bg-indigo-600 px-3 py-1 rounded"
                  >
                    Записаться
                  </button>
                )}
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}