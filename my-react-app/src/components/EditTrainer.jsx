import React, { useEffect, useState } from "react";
import api from "../api/axios";

export default function EditTrainer({ id, onBack, onUpdated }) {
  const [form, setForm] = useState({
    name: "",
    sport: "",
    experience: "",
    city: "",
    description: "",
    photo_url: null,
  });

  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [deletingPhoto, setDeletingPhoto] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [photoFile, setPhotoFile] = useState(null);
  const [preview, setPreview] = useState(null);

  useEffect(() => {
    loadTrainer();
  }, [id]);

  const loadTrainer = () => {
    setLoading(true);
    api.get(`trainers/get_one.php?id=${id}`)
      .then(res => {
        const t = res.trainer || res;
        setForm(t);
      })
      .catch(() => setError("Ошибка загрузки тренера"))
      .finally(() => setLoading(false));
  };

  const handleChange = (field, value) =>
    setForm(prev => ({ ...prev, [field]: value }));

  const handlePhoto = e => {
    const file = e.target.files[0];
    if (!file) return;
    
    const validTypes = ['image/jpeg', 'image/png', 'image/gif', 'image/webp'];
    if (!validTypes.includes(file.type)) {
      setError("Пожалуйста, выберите файл изображения (JPG, PNG, GIF, WebP)");
      return;
    }
    
    if (file.size > 5 * 1024 * 1024) {
      setError("Файл слишком большой. Максимальный размер: 5MB");
      return;
    }
    
    setPhotoFile(file);
    setPreview(URL.createObjectURL(file));
    setError("");
  };

  const uploadPhoto = async () => {
    if (!photoFile) return;
    
    setSaving(true);
    setError("");
    
    try {
      const fd = new FormData();
      fd.append("id", id);
      fd.append("photo", photoFile);

      const res = await api.upload("trainers/upload_photo.php", fd);
      setForm(prev => ({ ...prev, photo_url: res.photo_url }));
      setPhotoFile(null);
      setPreview(null);
      setSuccess("Фотография успешно загружена");
      setTimeout(() => setSuccess(""), 3000);
      onUpdated?.(); 
    } catch (err) {
      setError(`Ошибка загрузки фото: ${err.message}`);
    } finally {
      setSaving(false);
    }
  };

  const deletePhoto = async () => {
    if (!confirm("Удалить фотографию тренера? Это действие нельзя отменить.")) return;
    
    setDeletingPhoto(true);
    setError("");
    
    try {
      await api.deleteTrainerPhoto(id);
      setForm(prev => ({ ...prev, photo_url: null }));
      setSuccess("Фотография успешно удалена");
      setTimeout(() => setSuccess(""), 3000);
      onUpdated?.(); 
    } catch (err) {
      setError(`Ошибка удаления фото: ${err.message}`);
    } finally {
      setDeletingPhoto(false);
    }
  };

  const save = async () => {
    if (!form.name.trim()) {
      setError("Имя обязательно");
      return;
    }

    setSaving(true);
    setError("");
    setSuccess("");

    try {
      await api.post("trainers/update.php", { id, ...form });
      setSuccess("Изменения успешно сохранены");
      onUpdated?.();
      setTimeout(() => setSuccess(""), 3000);
    } catch (err) {
      setError(`Ошибка сохранения: ${err.message}`);
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return <div className="p-6 text-center text-slate-400">Загрузка тренера...</div>;
  }

  const input =
    "w-full rounded-lg bg-[#081226] border border-slate-700 px-4 py-3 text-white placeholder-slate-500 focus:outline-none focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 transition";

  const label = "block mb-1 text-sm text-slate-300";

  const hasRealPhoto = form.photo_url && !form.photo_url.includes('no-photo.png');

  return (
    <div className="max-w-3xl mx-auto p-6 bg-[#071429] border border-slate-700 rounded-2xl text-white">
      <h2 className="text-2xl font-bold mb-6">Редактирование тренера</h2>

      {error && (
        <div className="mb-4 p-3 bg-red-600/30 text-red-300 rounded-lg">
          {error}
        </div>
      )}
      {success && (
        <div className="mb-4 p-3 bg-green-600/30 text-green-300 rounded-lg">
          {success}
        </div>
      )}

      <div className="mb-8">
        <label className={label}>Фотография тренера</label>
        <div className="flex flex-col md:flex-row gap-6 items-start md:items-center">
          <div className="w-32 h-32 rounded-xl overflow-hidden bg-slate-800 flex-shrink-0">
            <img
              src={
                preview ||
                (form.photo_url
                  ? api.getPhotoUrl(form.photo_url)
                  : "http://localhost:5173/no-photo.png")
              }
              alt={form.name}
              className="w-full h-full object-cover"
              onError={(e) => {
                e.target.onerror = null;
                e.target.src = "http://localhost:5173/no-photo.png";
              }}
            />
          </div>

          <div className="flex-1 space-y-3">
            <div>
              <p className="text-sm text-slate-400">
                {hasRealPhoto 
                  ? "Текущая фотография загружена" 
                  : "Фотография не загружена"}
              </p>
            </div>

            <div className="flex flex-wrap gap-2">
              <label className="inline-flex items-center gap-2 px-4 py-2 bg-indigo-600 hover:bg-indigo-700 rounded-lg cursor-pointer transition-colors">
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-8l-4-4m0 0L8 8m4-4v12" />
                </svg>
                Загрузить новую
                <input
                  type="file"
                  accept="image/*"
                  onChange={handlePhoto}
                  className="hidden"
                  disabled={saving || deletingPhoto}
                />
              </label>

              {hasRealPhoto && (
                <button
                  onClick={deletePhoto}
                  disabled={deletingPhoto || saving}
                  className="inline-flex items-center gap-2 px-4 py-2 bg-red-600 hover:bg-red-700 rounded-lg transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                  </svg>
                  {deletingPhoto ? "Удаление..." : "Удалить фото"}
                </button>
              )}

              {photoFile && (
                <button
                  onClick={uploadPhoto}
                  disabled={saving}
                  className="inline-flex items-center gap-2 px-4 py-2 bg-green-600 hover:bg-green-700 rounded-lg transition-colors disabled:opacity-50"
                >
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                  </svg>
                  {saving ? "Загрузка..." : "Сохранить фото"}
                </button>
              )}
            </div>

            {photoFile && (
              <div className="text-sm text-slate-400">
                Выбран файл: <span className="text-slate-300">{photoFile.name}</span> 
                ({(photoFile.size / 1024).toFixed(0)} KB)
              </div>
            )}
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
        <div>
          <label className={label}>Имя *</label>
          <input
            className={input}
            value={form.name}
            onChange={e => handleChange("name", e.target.value)}
            placeholder="Введите имя"
            disabled={saving}
          />
        </div>

        <div>
          <label className={label}>Вид спорта</label>
          <input
            className={input}
            value={form.sport}
            onChange={e => handleChange("sport", e.target.value)}
            placeholder="Например: Футбол"
            disabled={saving}
          />
        </div>

        <div>
          <label className={label}>Опыт (лет)</label>
          <input
            type="number"
            min="0"
            className={input}
            value={form.experience}
            onChange={e => handleChange("experience", e.target.value)}
            placeholder="0"
            disabled={saving}
          />
        </div>

        <div>
          <label className={label}>Город</label>
          <input
            className={input}
            value={form.city}
            onChange={e => handleChange("city", e.target.value)}
            placeholder="Город"
            disabled={saving}
          />
        </div>
      </div>

      <div className="mt-5">
        <label className={label}>Описание</label>
        <textarea
          rows={4}
          className={input}
          value={form.description}
          onChange={e => handleChange("description", e.target.value)}
          placeholder="Краткое описание тренера"
          disabled={saving}
        />
      </div>

      <div className="mt-8 flex gap-4">
        <button
          onClick={save}
          disabled={saving}
          className="inline-flex items-center gap-2 px-6 py-3 bg-indigo-600 rounded-xl hover:bg-indigo-700 transition disabled:opacity-60"
        >
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
          </svg>
          {saving ? "Сохранение..." : "Сохранить данные"}
        </button>

        <button
          onClick={onBack}
          disabled={saving}
          className="inline-flex items-center gap-2 px-6 py-3 bg-slate-600 rounded-xl hover:bg-slate-700 transition disabled:opacity-60"
        >
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
          </svg>
          Назад
        </button>
      </div>
    </div>
  );
}