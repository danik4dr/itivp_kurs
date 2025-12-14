import React, { useState } from "react";
import api from "../../api/axios";
import { useNavigate } from "react-router-dom";

export default function Register({ setUser }) {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [role, setRole] = useState("user");
  const [err, setErr] = useState("");

  const nav = useNavigate();

  const validateEmail = (value) =>
    /^[\w.-]+@(gmail|yahoo|mail|yandex|outlook)\.(com|ru|net|org|by)$/i.test(value);

  const validatePassword = (value) =>
    value.length >= 4 && !/\s/.test(value);

  const submit = async (e) => {
    e.preventDefault();
    setErr("");

    if (!validateEmail(email)) {
      setErr("Введите корректный email");
      return;
    }
    if (!validatePassword(password)) {
      setErr("Пароль должен быть не меньше 4 символов и без пробелов");
      return;
    }

    try {
      const res = await api.post("auth/register.php", {
        name, email, password, role
      });

      if (res.success) {
        setUser(res.user);
        nav("/profile");
      } else {
        setErr(res.error || "Ошибка регистрации");
      }
    } catch (e) {
      setErr(e.message || "Ошибка сервера");
    }
  };

  return (
    <div className="max-w-md mx-auto bg-[#071429] p-6 rounded-2xl">
      <h2 className="text-2xl font-bold mb-4">Регистрация</h2>

      <form onSubmit={submit} className="flex flex-col gap-3">
        
        <input
          value={name}
          onChange={e=>setName(e.target.value)}
          placeholder="Имя (необязательно)"
          className="p-2 rounded bg-[#081226]"
        />

        <input
          value={email}
          onChange={e=>setEmail(e.target.value)}
          placeholder="Email"
          className="p-2 rounded bg-[#081226]"
        />
        {!validateEmail(email) && email.length > 0 && (
          <p className="text-red-400 text-sm">Формат email неверный</p>
        )}

        <input
          value={password}
          onChange={e=>setPassword(e.target.value)}
          type="password"
          placeholder="Пароль"
          className="p-2 rounded bg-[#081226]"
        />
        {!validatePassword(password) && password.length > 0 && (
          <p className="text-red-400 text-sm">
            Пароль должен быть больше 4 символов, без пробелов
          </p>
        )}

        <select
          value={role}
          onChange={e=>setRole(e.target.value)}
          className="p-2 rounded bg-[#081226]"
        >
          <option value="user">Пользователь</option>
          <option value="admin">Админ</option>
        </select>

        <button className="bg-gradient-to-r from-emerald-600 to-teal-500 py-2 rounded">
          Зарегистрироваться
        </button>
      </form>

      {err && <div className="mt-3 text-red-400">{err}</div>}
    </div>
  );
}
