import React from "react";
import { Link, useNavigate } from "react-router-dom";
import api from "../api/axios";

export default function Navbar({ user, setUser }) {
  const nav = useNavigate();
  const logout = async () => {
    try {
      await api.post("auth/logout.php"); 
    } catch (e) {
      console.error("Logout error:", e);
    }
    setUser(null);
    nav("/login");
  };

  return (
    <div className="flex items-center justify-between py-4 mb-8 px-6 bg-slate-800/30 rounded-xl backdrop-blur">
      <Link to="/" className="text-white font-bold text-xl">SportPlatform</Link>
      <div className="flex items-center gap-4">
        {user ? (
          <>
            <Link to="/profile" className="text-slate-200">Профиль</Link>
            {user && user.role === "user" && (<Link to="/my-sections" className="text-slate-200">Мои секции</Link>)}
            {user.role === 'admin' && <Link to="/admin" className="text-slate-200">Админ</Link>}
            <button onClick={logout} className="bg-red-600 px-3 py-1 rounded">Выйти</button>
          </>
        ) : (
          <>
            <Link to="/login" className="text-slate-200">Войти</Link>
            <Link to="/register" className="text-slate-200">Регистрация</Link>
          </>
        )}
      </div>
    </div>
  );
}
