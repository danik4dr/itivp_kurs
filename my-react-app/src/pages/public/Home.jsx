import React, { useEffect, useState } from "react";
import api from "../../api/axios";
import TrainerCard from "../../components/TrainerCard";

export default function Home() {
  const [trainers, setTrainers] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    api.get("trainers/get_all.php")
      .then(data => {
        setTrainers(Array.isArray(data) ? data : []);
      })
      .catch(e => console.error("load trainers", e))
      .finally(() => setLoading(false));
  }, []);

  return (
    <div>
      <header className="mb-6">
        <h1 className="text-4xl font-extrabold tracking-tight">Платформа тренировок</h1>
        <p className="mt-2 text-slate-300">Найди тренера, выбери курс, запишись на секцию, развивайся!</p>
      </header>

      <section className="mb-8">
        <div className="flex justify-between items-end">
          <h2 className="text-2xl font-semibold">Тренеры</h2>
        </div>

        {loading ? (
          <div className="mt-6 text-slate-400">Загрузка...</div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 mt-6">
            {trainers.map(t => <TrainerCard key={t.id} trainer={t} />)}
          </div>
        )}
      </section>
    </div>
  );
}
