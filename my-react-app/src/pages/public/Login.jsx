import React, { useState } from "react";
import api from "../../api/axios";
import { useNavigate } from "react-router-dom";

export default function Login({ setUser }) {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
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
      setErr("Некорректный email");
      return;
    }
    if (!validatePassword(password)) {
      setErr("Пароль не должен содержать пробелы и быть длиной до 4 символов");
      return;
    }

    try {
      const res = await api.post("auth/login.php", { email, password });
      if (res.success) {
        setUser(res.user);
        nav("/");
      } else {
        setErr(res.error || "Ошибка входа");
      }
    } catch (e) {
      setErr(e.message || "Ошибка сервера");
    }
  };

  return (
    <div className="max-w-md mx-auto bg-[#071429] p-6 rounded-2xl">
      <h2 className="text-2xl font-bold mb-4">Вход</h2>

      <form onSubmit={submit} className="flex flex-col gap-3">
        <input
          value={email}
          onChange={e=>setEmail(e.target.value)}
          placeholder="Email"
          className="p-2 rounded bg-[#081226]"
        />
        {!validateEmail(email) && email.length > 0 && (
          <p className="text-red-400 text-sm">Неверный формат email</p>
        )}

        <input
          type="password"
          value={password}
          onChange={e=>setPassword(e.target.value)}
          placeholder="Пароль"
          className="p-2 rounded bg-[#081226]"
        />
        {!validatePassword(password) && password.length > 0 && (
          <p className="text-red-400 text-sm">
            Пароль должен быть не меньше 4 символов, без пробелов
          </p>
        )}

        <button className="bg-gradient-to-r from-indigo-600 to-purple-600 py-2 rounded">
          Войти
        </button>
      </form>

      {err && <div className="mt-3 text-red-400">{err}</div>}
    </div>
  );
}
