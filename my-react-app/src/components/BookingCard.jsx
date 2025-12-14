export default function BookingCard({ booking }) {
  return (
    <div className="bg-[#081226] p-4 rounded-xl shadow">
      <h3 className="text-xl font-bold text-indigo-300">{booking.course_name}</h3>

      <p className="text-slate-300 mt-1">
        Секция: <span className="text-white">{booking.section_name}</span>
      </p>

      <p className="text-slate-300">
        Тренер: <span className="text-white">{booking.trainer_name}</span>
      </p>

      <p className="text-slate-400 text-sm mt-2">
        Оставшиеся места: {booking.capacity_remaining}
      </p>
    </div>
  );
}
