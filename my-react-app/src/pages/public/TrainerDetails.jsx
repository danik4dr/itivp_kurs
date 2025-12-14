import React, { useEffect, useState } from "react";
import { useParams, useNavigate, Link } from "react-router-dom";
import api from "../../api/axios";

export default function TrainerDetails({ user }) {
    const { id } = useParams();
    const [trainer, setTrainer] = useState(null);
    const [courses, setCourses] = useState([]);
    const [loading, setLoading] = useState(true);
    const nav = useNavigate();

    useEffect(() => {
        setLoading(true);
        api.get(`trainers/get_course.php?id=${id}`)
            .then(data => {
                if (data.success) {
                    setTrainer(data.trainer);
                    setCourses(data.courses || []);
                } else if (data.trainer || data.courses) {
                    setTrainer(data.trainer || data);
                    setCourses(data.courses || []);
                }
            })
            .catch(console.error)
            .finally(() => setLoading(false));
    }, [id]);

    const getPhotoUrl = () => {
        if (trainer?.photo_url) {
            return api.getPhotoUrl(trainer.photo_url);
        }
        return 'http://localhost:5173/no-photo.png';
    };

    const photoUrl = getPhotoUrl();

    if (loading) return <div className="p-6">Загрузка...</div>;
    if (!trainer) return <div className="p-6 text-red-400">Тренер не найден</div>;

    return (
        <div className="p-6">
            <button className="mb-6 text-slate-300 hover:text-white flex items-center gap-2"
                onClick={() => nav(-1)}>← Назад</button>
            
            <div className="flex flex-col lg:flex-row gap-8">
                <div className="lg:w-2/5">
                    <div className="bg-[#071429] rounded-xl p-6 border border-slate-700">
                        <div className="w-full h-64 mb-6">
                            <img 
                                src={photoUrl} 
                                alt={trainer.name}
                                className="w-full h-full object-cover rounded-lg"
                                onError={(e) => {
                                    e.target.style.display = 'none';
                                    e.target.parentElement.innerHTML = 
                                        '<div class="w-full h-full bg-slate-800 rounded-lg flex items-center justify-center">' +
                                        '<span class="text-slate-400">Нет фотографии</span>' +
                                        '</div>';
                                }} 
                            />
                        </div>
                        
                        <h1 className="text-2xl font-bold mb-2">{trainer.name}</h1>
                        <div className="flex flex-wrap gap-2 mb-4">
                            {trainer.sport && <span className="px-3 py-1 bg-indigo-900/50 text-indigo-300 rounded-full text-sm">{trainer.sport}</span>}
                            {trainer.experience && <span className="px-3 py-1 bg-slate-800 text-slate-300 rounded-full text-sm">{trainer.experience} лет опыта</span>}
                            {trainer.city && <span className="px-3 py-1 bg-slate-800 text-slate-300 rounded-full text-sm">{trainer.city}</span>}
                        </div>
                        {trainer.description && <p className="text-slate-300 whitespace-pre-line">{trainer.description}</p>}
                    </div>
                </div>
                
                <div className="lg:w-3/5">
                    <h2 className="text-2xl font-bold mb-6">Курсы тренера</h2>
                    {courses.length > 0 ? (
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            {courses.map(c => (
                                <div key={c.id} className="bg-[#071429] p-4 rounded-xl border border-slate-700 transition-all hover:scale-[1.02]">
                                    <div className="flex justify-between items-start mb-3">
                                        <div><h3 className="font-semibold text-lg">{c.title}</h3>
                                            {c.price && <div className="text-indigo-400 font-bold text-xl">{c.price} BYN</div>}</div>
                                        <Link to={`/course/${c.id}`} className="px-4 py-2 bg-indigo-600 hover:bg-indigo-700 rounded-lg">Подробнее</Link>
                                    </div>
                                </div>
                            ))}
                        </div>
                    ) : (
                        <div className="bg-[#071429] p-8 rounded-xl border border-slate-700 text-center">
                            <p className="text-slate-400">У этого тренера пока нет курсов</p>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
}