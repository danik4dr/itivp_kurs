import React, { useEffect, useState } from "react";
import api from "../../api/axios";

import TrainerCard from "../../components/TrainerCard";
import CourseCard from "../../components/CourseCard";
import SectionCard from "../../components/SectionCard";

import EditTrainer from "../../components/EditTrainer";
import EditCourse from "../../components/EditCourse";
import EditSection from "../../components/EditSection";

export default function AdminDashboard({ user }) {
  const [trainers, setTrainers] = useState([]);
  const [courses, setCourses] = useState([]);
  const [sections, setSections] = useState([]);
  const [loading, setLoading] = useState(true);

  const [editMode, setEditMode] = useState(null);
  const [editId, setEditId] = useState(null);

  const [tName, setTName] = useState("");
  const [tSport, setTSport] = useState("");
  const [tExp, setTExp] = useState("");
  const [tCity, setTCity] = useState("");
  const [tDesc, setTDesc] = useState("");

  const [cTrainerId, setCTrainerId] = useState("");
  const [cTitle, setCTitle] = useState("");
  const [cDesc, setCDesc] = useState("");
  const [cPrice, setCPrice] = useState("");

  const [sCourseId, setSCourseId] = useState("");
  const [sName, setSName] = useState("");
  const [sLoc, setSLoc] = useState("");
  const [sSchedule, setSSchedule] = useState("");
  const [sCap, setSCap] = useState("");

  useEffect(() => {
    reloadAll();
  }, []);

  const reloadAll = async () => {
  setLoading(true);
  try {
    const [tres, cres, sres] = await Promise.all([
      api.get("trainers/get_all.php"),
      api.get("courses/get_all.php"),
      api.get("sections/get_all.php"),
    ]);

    setTrainers(Array.isArray(tres) ? tres : (tres?.trainers || []));
    setCourses(Array.isArray(cres) ? cres : (cres?.courses || []));
    setSections(Array.isArray(sres) ? sres : (sres?.sections || []));
  } catch (e) {
    console.error(e);
    setTrainers([]);
    setCourses([]);
    setSections([]);
  } finally {
    setLoading(false);
  }
};


  const onEdit = (type, id) => {
    setEditMode(type);
    setEditId(id);
  };

  const closeEdit = () => {
    setEditMode(null);
    setEditId(null);
    reloadAll();
  };

  const createTrainer = async () => {
    await api.post("trainers/create.php", {
      name: tName,
      sport: tSport,
      experience: tExp,
      city: tCity,
      description: tDesc,
    });
    setTName(""); setTSport(""); setTExp(""); setTCity(""); setTDesc("");
    reloadAll();
  };

  const createCourse = async () => {
    await api.post("courses/create.php", {
      trainer_id: cTrainerId,
      title: cTitle,
      description: cDesc,
      price: cPrice,
    });
    setCTrainerId(""); setCTitle(""); setCDesc(""); setCPrice("");
    reloadAll();
  };

  const createSection = async () => {
    await api.post("sections/create.php", {
      course_id: sCourseId,
      name: sName,
      location: sLoc,
      schedule: sSchedule,
      capacity: sCap
    });
    setSCourseId(""); setSName(""); setSLoc(""); setSSchedule(""); setSCap("");
    reloadAll();
  };

  if (editMode === "trainer") return <EditTrainer id={editId} onBack={closeEdit} onUpdated={reloadAll} />;
  if (editMode === "course") return <EditCourse id={editId} onBack={closeEdit} onUpdated={reloadAll} />;
  if (editMode === "section") return <EditSection id={editId} onBack={closeEdit} onUpdated={reloadAll} />;  

  const field = "w-full p-2 rounded bg-[#081226] border border-slate-700 focus:outline-none";
  const sectionBox = "mb-6 bg-[#071429] p-5 rounded-lg border border-slate-700 flex flex-col gap-4";

  return (
    <div className="text-white">
      <h2 className="text-2xl font-bold mb-6">Панель управления</h2>

      <section className={sectionBox}>
        <h3 className="font-semibold text-lg">Добавить тренера</h3>
        <input placeholder="Имя" value={tName} onChange={e => { const val = e.target.value; if (/^[A-Za-zА-Яа-яЁё\s]*$/.test(val)) setTName(val); }} className={field}/>
        <input placeholder="Спорт" value={tSport} onChange={e => setTSport(e.target.value)} className={field} />
        <input type="number" placeholder="Опыт" value={tExp} onChange={e => {const val = e.target.value; if (val === "" || Number(val) >= 0) setTExp(val); }} className={field} />
        <input placeholder="Город" value={tCity} onChange={e => setTCity(e.target.value)} className={field} />
        <textarea placeholder="Описание" value={tDesc} onChange={e => setTDesc(e.target.value)} className={field} />
        <button className="bg-indigo-600 py-2 rounded" onClick={createTrainer}>Создать</button>
      </section>

      <section className={sectionBox}>
        <h3 className="font-semibold text-lg">Добавить курс</h3>
        <select value={cTrainerId} onChange={e=>setCTrainerId(e.target.value)} className={field}>
          <option value="">Выберите тренера</option>
          {Array.isArray(trainers) && trainers.map(t => <option key={t.id} value={t.id}>{t.name}</option>)}
        </select>
        <input placeholder="Название" value={cTitle} onChange={e=>setCTitle(e.target.value)} className={field} />
        <textarea placeholder="Описание" value={cDesc} onChange={e=>setCDesc(e.target.value)} className={field} />
        <input type="number" placeholder="Цена" value={cPrice} onChange={e => { const val = e.target.value; if (val === "" || Number(val) >= 0) setCPrice(val); }} className={field} />
        <button className="bg-cyan-600 py-2 rounded" onClick={createCourse}>Создать</button>
      </section>

      <section className={sectionBox}>
        <h3 className="font-semibold text-lg">Добавить секцию</h3>
        <select value={sCourseId} onChange={e=>setSCourseId(e.target.value)} className={field}>
          <option value="">Выберите курс</option>
          {Array.isArray(courses) && courses.map(c => <option key={c.id} value={c.id}>{c.title}</option>)}
        </select>
        <input placeholder="Название" value={sName} onChange={e=>setSName(e.target.value)} className={field} />
        <input placeholder="Локация" value={sLoc} onChange={e=>setSLoc(e.target.value)} className={field} />
        <input placeholder="Расписание" value={sSchedule} onChange={e=>setSSchedule(e.target.value)} className={field} />
        <input type="number" placeholder="Вместимость" value={sCap} onChange={e => { const val = e.target.value; if (val === "" || Number(val) >= 0) setSCap(val); }} className={field} />
        <button className="bg-emerald-600 py-2 rounded" onClick={createSection}>Создать</button>
      </section>

      <h3 className="text-xl font-semibold mt-4 mb-2">Тренеры</h3>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {Array.isArray(trainers) && trainers.map(t =>
          <TrainerCard
            key={t.id}
            trainer={t}
            adminMode
            onUpdate={reloadAll}
            onEdit={() => onEdit("trainer", t.id)}
          />
        )}
      </div>

      <h3 className="text-xl font-semibold mt-8 mb-2">Курсы</h3>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {Array.isArray(courses) && courses.map(c =>
          <CourseCard
            key={c.id}
            course={c}
            adminMode
            onUpdate={reloadAll}
            onEdit={() => onEdit("course", c.id)}
          />
        )}
      </div>

      <h3 className="text-xl font-semibold mt-8 mb-2">Секции</h3>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {Array.isArray(sections) && sections.map(s =>
          <SectionCard
            key={s.id}
            section={s}
            adminMode
            onUpdate={reloadAll}
            onEdit={() => onEdit("section", s.id)}
          />
        )}
      </div>
    </div>
  );
}
