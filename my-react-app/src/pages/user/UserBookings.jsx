import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import api from "../../api/axios";

export default function UserBookings() {
  const [list, setList] = useState([]);
  const [loading, setLoading] = useState(true);

  const load = async () => {
    setLoading(true);
    try {
      const res = await api.get("bookings/user_sections.php");

      if (res.success) {
        setList(res.bookings);
      } else {
        setList([]);
      }
    } catch (e) {
      console.error("Ошибка загрузки:", e);
      setList([]);
    }
    setLoading(false);
  };

  const removeBooking = async (bookingId) => {
    if (!window.confirm("Удалить запись?")) return;

    try {
      const res = await api.post("bookings/delete.php", { id: bookingId });

      if (res.success) {
        alert("Запись удалена");
        load();
      } else {
        alert(res.error || "Ошибка удаления");
      }
    } catch (e) {
      alert(e.message || "Ошибка");
    }
  };

  useEffect(() => {
    load();
  }, []);

  if (loading) return <div className="p-6">Загрузка...</div>;

  return (
    <div className="p-6">
      <h2 className="text-3xl font-bold mb-6">Мои секции</h2>

      {list.length === 0 && (
        <p className="text-slate-400">
          Вы пока не записаны ни на одну секцию
        </p>
      )}

      <div className="grid gap-4">
        {list.map((b) => (
          <div
            key={b.id}
            className="bg-[#081226] p-4 rounded-xl border border-slate-700"
          >
            <p className="text-xl font-bold text-indigo-300">{b.section_name}</p>

            <p className="text-slate-300">
              Тренер:{" "}
              <Link
                to={`/trainer/${b.trainer_id}`}
                className="text-blue-400"
              >
                {b.trainer_name}
              </Link>
            </p>

            <p className="text-slate-300">
              Курс:{" "}
              <Link
                to={`/course/${b.course_id}`}
                className="text-blue-400"
              >
                {b.course_name}
              </Link>
            </p>

            <p className="text-slate-400 text-sm mt-1">
              Оставшиеся места: {b.capacity_remaining}
            </p>

            <div className="mt-4">
              <button
                onClick={() => removeBooking(b.id)}
                className="bg-red-600 px-3 py-1 rounded"
              >
                Удалить запись
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
