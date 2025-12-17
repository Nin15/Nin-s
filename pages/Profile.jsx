import React, { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Loader, Camera, Sparkles } from "lucide-react";
import { apiFetch } from "../src/services/api";

export default function Profile() {
  const navigate = useNavigate();

  const [user, setUser] = useState(null);
  const [loadingPage, setLoadingPage] = useState(true);
  const [uploading, setUploading] = useState(false);

  /* ---------------- DATA ---------------- */

  const loadUser = async () => {
    try {
      const data = await apiFetch("/auth/current-user");
      setUser(data);
    } catch {
      navigate("/sign-in");
    } finally {
      setLoadingPage(false);
    }
  };

  useEffect(() => {
    loadUser();
  }, []);

  /* ---------------- ACTIONS ---------------- */

  const handleAvatarUpload = async (e) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setUploading(true);

    const formData = new FormData();
    formData.append("avatar", file);

    try {
      await apiFetch("/users", {
        method: "PUT",
        body: formData,
      });
      await loadUser();
    } finally {
      setUploading(false);
    }
  };

  /* ---------------- UI ---------------- */

  if (loadingPage) {
    return (
      <div className="h-[100dvh] grid place-items-center bg-gradient-to-br from-rose-100 via-pink-100 to-lilac-100">
        <Loader className="animate-spin text-rose-400" size={56} />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-rose-50 via-pink-50 to-lilac-100 px-6 py-10 flex flex-col items-center font-['Playfair_Display']">
      {/* BACK */}
      <Link
        to="/Homepage"
        className="self-start mb-8 text-sm text-rose-400 hover:underline"
      >
        ← back to home
      </Link>

      {/* PROFILE CARD */}
      <div className="relative bg-white/85 backdrop-blur-xl rounded-[3rem] px-10 py-12 shadow-[0_25px_60px_rgba(255,182,193,0.4)] border border-pink-200 flex flex-col items-center gap-6 w-full max-w-md">
        <Sparkles className="absolute -top-4 -right-4 text-pink-300" />

        {/* AVATAR */}
        <div className="relative group">
          <img
            src={user?.avatar || "/vite.svg"}
            alt="user"
            className="w-[160px] h-[160px] rounded-full object-cover border-4 border-rose-200 shadow-lg"
          />

          <label
            htmlFor="avatar"
            className="absolute inset-0 rounded-full bg-black/40 opacity-0 group-hover:opacity-100 transition flex flex-col items-center justify-center text-white cursor-pointer"
          >
            <Camera size={22} />
            <span className="text-xs mt-1">
              {uploading ? "uploading…" : "change avatar"}
            </span>
          </label>
        </div>

        <input
          id="avatar"
          type="file"
          className="hidden"
          onChange={handleAvatarUpload}
        />

        {/* INFO */}
        <div className="text-center space-y-2">
          <h1 className="text-2xl text-rose-500 tracking-wide">
            {user?.fullName || "soft soul"}
          </h1>
          <p className="text-sm text-gray-600 italic">{user?.email}</p>
        </div>

        {/* DETAILS */}
        <div className="w-full mt-4 space-y-3 text-sm">
          <div className="flex justify-between bg-rose-50 rounded-full px-5 py-2">
            <span className="text-gray-500">Full name</span>
            <span className="text-rose-500">{user?.fullName}</span>
          </div>
          <div className="flex justify-between bg-rose-50 rounded-full px-5 py-2">
            <span className="text-gray-500">Email</span>
            <span className="text-rose-500">{user?.email}</span>
          </div>
        </div>
      </div>
    </div>
  );
}
