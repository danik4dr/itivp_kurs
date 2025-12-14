import React, { useEffect, useState } from "react";
import api from "../../api/axios";
import TrainerCard from "../../components/TrainerCard";
import CreateTrainer from "../../components/CreateTrainer";
import EditTrainer from "../../components/EditTrainer";

export default function AdminTrainers() {
    const [trainers, setTrainers] = useState([]);
    const [loading, setLoading] = useState(false);
    const [createOpen, setCreateOpen] = useState(false);
    const [editTrainer, setEditTrainer] = useState(null);

    const loadTrainers = async () => {
        setLoading(true);
        try {
            const res = await api.get("trainers/get_all.php");

            if (res.success) {
                setTrainers(res.trainers);
            } else {
                alert("Ошибка загрузки");
            }
        } catch (err) {
            alert("Ошибка: " + err.message);
        }
        setLoading(false);
    };

    useEffect(() => {
        loadTrainers();
    }, []);

    const openEdit = (trainer) => setEditTrainer(trainer);
    const closeEdit = () => setEditTrainer(null);

    const handleTrainerCreated = () => {
        setCreateOpen(false);
        loadTrainers();
    };

    const handleTrainerUpdated = () => {
        closeEdit();
        loadTrainers();
    };

    return (
        <div className="p-6">
            <div className="flex justify-between items-center mb-4">
                <h1 className="text-2xl font-semibold">Тренеры</h1>

                <button
                    onClick={() => setCreateOpen(true)}
                    className="px-4 py-2 rounded bg-blue-600 hover:bg-blue-700 text-white"
                >
                    Добавить тренера
                </button>
            </div>

            {loading && <p className="text-gray-500">Загрузка...</p>}

            {!loading && trainers.length === 0 && (
                <p className="text-gray-400">Нет тренеров</p>
            )}

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {trainers.map(t => (
                    <TrainerCard
                        key={t.id}
                        trainer={t}
                        onEdit={() => openEdit(t)}
                    />
                ))}
            </div>

            {createOpen && (
                <CreateTrainer
                    onClose={() => setCreateOpen(false)}
                    onCreated={handleTrainerCreated}
                />
            )}

            {editTrainer && (
                <EditTrainer
                    trainer={editTrainer}
                    onClose={closeEdit}
                    onUpdated={handleTrainerUpdated}
                />
            )}
        </div>
    );
}
