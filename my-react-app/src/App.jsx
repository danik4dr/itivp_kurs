import React, { useEffect, useState } from "react";
import { Routes, Route, Navigate } from "react-router-dom";

import Navbar from "./components/Navbar";

import Home from "./pages/public/Home";
import Login from "./pages/public/Login";
import Register from "./pages/public/Register";
import TrainerDetails from "./pages/public/TrainerDetails";
import CourseDetails from "./pages/public/CourseDetails";
import Layout from "./components/Layout";

import UserProfile from "./pages/user/UserProfile";
import UserBookings from "./pages/user/UserBookings";

import AdminDashboard from "./pages/admin/AdminDashboard";
import AdminTrainers from "./pages/admin/AdminTrainers";
import AdminCourses from "./pages/admin/AdminCourses";
import AdminSections from "./pages/admin/AdminSections";

import api from "./api/axios";

export default function App() {
  const [user, setUser] = useState(null);

  useEffect(() => {
    const check = async () => {
      try {
        const res = await api.get("auth/get_user.php"); 
        if (res?.user) setUser(res.user);
      } catch (e) {
        setUser(null);
      }
    };
    check();
  }, []);

  return (
    <div className="min-h-screen bg-slate-900 text-white">
      <Navbar user={user} setUser={setUser} />

      <div className="container mx-auto mt-6 px-4">
        <Layout>
        <Routes>

          <Route path="/" element={<Home />} />
          <Route path="/login" element={!user ? <Login setUser={setUser} /> : <Navigate to="/" />} />
          <Route path="/register" element={!user ? <Register setUser={setUser} /> : <Navigate to="/" />} />
          <Route path="/trainer/:id" element={<TrainerDetails />} />
          <Route path="/course/:id" element={<CourseDetails user={user} />} />

          <Route
            path="/profile"
            element={user ? <UserProfile user={user} setUser={setUser} /> : <Navigate to="/login" />}
          />
          <Route
            path="/my-sections"
            element={user?.role === "user" ? <UserBookings user={user} /> : <Navigate to="/" />}
          />

          <Route
            path="/admin"
            element={user?.role === "admin" ? <AdminDashboard /> : <Navigate to="/" />}
          />
          <Route
            path="/admin/trainers"
            element={user?.role === "admin" ? <AdminTrainers /> : <Navigate to="/" />}
          />
          <Route
            path="/admin/courses"
            element={user?.role === "admin" ? <AdminCourses /> : <Navigate to="/" />}
          />
          <Route
            path="/admin/sections"
            element={user?.role === "admin" ? <AdminSections /> : <Navigate to="/" />}
          />

        </Routes>
        </Layout>
      </div>
    </div>
  );
}
