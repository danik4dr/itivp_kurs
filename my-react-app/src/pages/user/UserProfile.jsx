import React, { useState, useEffect } from "react";
import api from "../../api/axios";

export default function UserProfile({ user, setUser }) {

  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [message, setMessage] = useState("");
  const [err, setErr] = useState("");

  const validateEmail = (value) =>
    /^[\w.-]+@(gmail|yahoo|mail|yandex|outlook)\.(com|ru|net|org|by)$/i.test(value);

  const validatePassword = (value) =>
    value.length >= 4 && !/\s/.test(value);

  useEffect(() => {
    if (user) {
      setName(user.name || "");
      setEmail(user.email || "");
    }
  }, [user]);

  const save = async () => {
    setMessage("");
    setErr("");

    if (!validateEmail(email)) {
      setErr("Введите корректный email");
      return;
    }

    if (password.length > 0 && !validatePassword(password)) {
      setErr("Пароль должен быть не меньше 4 символов и без пробелов");
      return;
    }

    try {
      const res = await api.post("auth/update_user.php", {
        name,
        email,
        password
      });

      if (res.success) {
        setUser(res.user);
        setMessage("Данные успешно обновлены");
        setPassword("");
      } else {
        setErr(res.error || "Ошибка обновления");
      }

    } catch (err) {
      setErr("Ошибка сервера");
    }
  };

  return (
    <div className="max-w-md mx-auto bg-[#071429] p-6 mt-6 rounded-2xl shadow-xl border border-slate-700/40">

      <h2 className="text-3xl font-bold mb-6 text-indigo-300 tracking-wide">
        Мой профиль
      </h2>

      <div className="flex flex-col gap-4">

        <input
          value={name}
          onChange={e => setName(e.target.value)}
          placeholder="Имя"
          className="bg-[#081226] border border-slate-700 rounded-lg px-4 py-3"
        />

        <input
          value={email}
          onChange={e => setEmail(e.target.value)}
          placeholder="Email"
          className="bg-[#081226] border border-slate-700 rounded-lg px-4 py-3"
        />
        {!validateEmail(email) && email.length > 0 && (
          <p className="text-red-400 text-sm">Некорректный email</p>
        )}

        <input
          value={password}
          onChange={e => setPassword(e.target.value)}
          type="password"
          placeholder="Новый пароль"
          className="bg-[#081226] border border-slate-700 rounded-lg px-4 py-3"
        />
        {password.length > 0 && !validatePassword(password) && (
          <p className="text-red-400 text-sm">
            Пароль не меньше 4 символов, нельзя пробелы
          </p>
        )}

        <button
          onClick={save}
          className="mt-2 bg-gradient-to-r from-emerald-600 to-teal-500 hover:scale-[1.02] transition text-white py-3 rounded-lg shadow-md"
        >
          Сохранить
        </button>

        {(err || message) && (
          <p className={err ? "text-red-400" : "text-green-400"}>{err || message}</p>
        )}
      </div>
    </div>
  );
}
