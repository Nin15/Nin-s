import React, { useState } from "react";
import { useForm } from "react-hook-form";
import { useNavigate } from "react-router-dom";
import { Loader, Sparkles } from "lucide-react";

export default function SignIn() {
  const navigate = useNavigate();
  const [authError, setAuthError] = useState(false);
  const [loading, setLoading] = useState(false);

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm();

  const onSubmit = async (credentials) => {
    setAuthError(false);
    setLoading(true);

    try {
      const res = await fetch(
        "https://node-hw12.vercel.app/auth/sign-in",
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(credentials),
        }
      );

      if (!res.ok) {
        throw new Error("INVALID_CREDENTIALS");
      }

      const token = await res.json();
      document.cookie = `token=${token}; path=/; max-age=86400`;
      navigate("/");
    } catch {
      setAuthError(true);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-rose-50 via-pink-50 to-lilac-100 px-6">
      <div className="flex flex-col gap-8 w-full max-w-md bg-white/90 backdrop-blur-xl rounded-[2.5rem] p-8 shadow-[0_20px_50px_rgba(255,182,193,0.35)] border border-pink-200">
        <header className="text-center space-y-2">
          <h1 className="text-3xl font-['Playfair_Display'] text-rose-500 flex items-center justify-center gap-2">
            <Sparkles size={24} /> Welcome back
          </h1>
          <p className="text-sm text-gray-600">
            Don’t have an account?{' '}
            <span
              onClick={() => navigate("/Sign-up")}
              className="cursor-pointer text-rose-400 underline hover:text-rose-500 transition"
            >
              Sign up
            </span>
          </p>
        </header>

        <form onSubmit={handleSubmit(onSubmit)} className="flex flex-col gap-4">
          <div>
            <input
              {...register("email", { required: true })}
              type="email"
              placeholder="Email"
              className="w-full h-12 px-4 rounded-2xl border border-rose-200 focus:outline-none focus:ring-2 focus:ring-rose-300 bg-rose-50 placeholder:text-rose-300"
            />
            {errors.email && <p className="text-red-500 text-xs mt-1">Email is required</p>}
          </div>

          <div>
            <input
              {...register("password", { required: true })}
              type="password"
              placeholder="Password"
              className="w-full h-12 px-4 rounded-2xl border border-rose-200 focus:outline-none focus:ring-2 focus:ring-rose-300 bg-rose-50 placeholder:text-rose-300"
            />
            {errors.password && <p className="text-red-500 text-xs mt-1">Password is required</p>}
            {authError && <p className="text-red-500 text-xs mt-1">Email or password is incorrect</p>}
          </div>

          <button
            type="submit"
            disabled={loading}
            className="h-12 rounded-2xl bg-gradient-to-r from-rose-400 via-pink-400 to-lilac-400 text-white font-medium hover:scale-[1.02] transition disabled:opacity-50"
          >
            {loading ? "Signing in…" : "Sign in"}
          </button>
        </form>

        <div className="flex items-center gap-2 text-gray-400">
          <hr className="flex-1 border-rose-200" />
          <span className="text-xs">or</span>
          <hr className="flex-1 border-rose-200" />
        </div>

        <div className="flex flex-col gap-3">
          <button className="h-12 border border-rose-200 rounded-2xl bg-rose-50 hover:bg-rose-100 transition">Continue with Google</button>
          <button className="h-12 border border-rose-200 rounded-2xl bg-rose-50 hover:bg-rose-100 transition">Continue with Apple</button>
        </div>
      </div>
    </div>
  );
}
