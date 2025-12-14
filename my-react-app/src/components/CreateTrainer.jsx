import React, { useState } from "react";
import api from "../api/axios";

export default function CreateTrainer({ onClose, onCreated }) {
    const [form, setForm] = useState({ name:"", sport:"", experience:"", city:"", description:"" });
    const [photoFile, setPhotoFile] = useState(null);
    const [loading, setLoading] = useState(false);

    const handleChange = (e) => setForm(prev=>({...prev,[e.target.name]:e.target.value}));

    const handleCreate = async (e) => {
        e.preventDefault();
        setLoading(true);
        try {
            const createRes = await api.post("trainers/create.php", form);
            if (!createRes.success) { alert(createRes.error||"Ошибка"); setLoading(false); return; }

            const trainerId = createRes.trainer_id;
            if (photoFile) {
                const fd = new FormData();
                fd.append("id", trainerId);
                fd.append("photo", photoFile);
                const uploadRes = await api.upload("trainers/upload_photo.php", fd);
                if (!uploadRes.success) alert("Тренер создан, но фото не загружено");
            }

            onCreated();
        } catch (err) { alert(err.message); }
        setLoading(false);
    };

    return (
        <div className="fixed inset-0 bg-black/50 flex justify-center items-center">
            <div className="bg-white shadow-xl rounded-lg w-full max-w-lg p-6 relative">
                <h2 className="text-xl font-bold mb-4">Создать тренера</h2>
                <form onSubmit={handleCreate} className="space-y-4">
                    {["name","sport","experience","city"].map(f=>(
                        <input key={f} name={f} placeholder={f==="name"?"Имя":f} value={form[f]} onChange={handleChange} className="w-full px-3 py-2 border rounded" type={f==="experience"?"number":"text"} required={f==="name"}/>
                    ))}
                    <textarea name="description" placeholder="Описание" value={form.description} onChange={handleChange} className="w-full px-3 py-2 border rounded" rows={3}/>

                    <div>
                        <label className="block font-medium mb-1">Фото</label>
                        <input type="file" accept="image/*" onChange={e=>setPhotoFile(e.target.files[0])}/>
                    </div>

                    <div className="flex justify-end gap-2 pt-2">
                        <button type="button" onClick={onClose} className="px-3 py-2 bg-gray-300 rounded hover:bg-gray-400">Отмена</button>
                        <button type="submit" disabled={loading} className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700">{loading?"Создание...":"Создать"}</button>
                    </div>
                </form>
            </div>
        </div>
    );
}
