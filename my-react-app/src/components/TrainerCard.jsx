import React from "react";
import { Link } from "react-router-dom";
import api from "../api/axios";

export default function TrainerCard({ trainer, adminMode, onUpdate, onEdit }) {
    const handleDelete = async () => {
        if (!confirm("Удалить тренера?")) return;
        try {
            await api.post("trainers/delete.php", { id: trainer.id });
            if (onUpdate) onUpdate();
        } catch (e) {
            alert(e.message || "Ошибка");
        }
    };

    const getPhotoUrl = () => {
        if (trainer?.photo_url) {
            return api.getPhotoUrl(trainer.photo_url);
        }
        return 'http://localhost:5173/no-photo.png';
    };

    const photoUrl = getPhotoUrl();

    return (
        <div className="bg-[#071429] p-4 rounded-xl border border-slate-700 transition-all hover:scale-[1.03] hover:border-indigo-500">
            <div className="flex gap-3">
                <div className="w-16 h-16 flex-shrink-0">
                    <img 
                        src={photoUrl} 
                        alt={trainer.name}
                        className="w-full h-full object-cover rounded-lg"
                        onError={(e) => {
                            e.target.style.display = 'none';
                            e.target.parentElement.innerHTML = 
                                '<div class="w-full h-full bg-slate-800 rounded-lg flex items-center justify-center">' +
                                '<span class="text-xs text-slate-400">Нет фото</span>' +
                                '</div>';
                        }}
                    />
                </div>
                
                <div className="flex-1">
                    <h3 className="text-lg font-semibold">{trainer.name}</h3>
                    <p className="text-slate-300 text-sm">
                        {trainer.sport} • {trainer.experience} лет • {trainer.city}
                    </p>
                    
                    {trainer.description && (
                        <p className="mt-2 text-slate-400 text-sm line-clamp-2">
                            {trainer.description}
                        </p>
                    )}
                    
                    <div className="mt-3 flex gap-2">
                        {!adminMode && (
                            <Link 
                                to={`/trainer/${trainer.id}`} 
                                className="text-indigo-400 hover:underline text-sm"
                            >
                                Подробнее
                            </Link>
                        )}
                        
                        {adminMode && typeof onEdit === "function" && (
                            <button 
                                onClick={() => onEdit(trainer.id)} 
                                className="bg-yellow-600 hover:bg-yellow-700 px-3 py-1 rounded text-sm transition-colors"
                            >
                                Редактировать
                            </button>
                        )}
                        
                        {adminMode && (
                            <button 
                                onClick={handleDelete} 
                                className="ml-auto bg-red-600 hover:bg-red-700 px-3 py-1 rounded text-white text-sm transition-colors"
                            >
                                Удалить
                            </button>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
}