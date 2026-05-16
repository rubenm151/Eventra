"use client";

import { FormEvent, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import type { NextPage } from "next";
import { EyeIcon, EyeSlashIcon, UserCircleIcon } from "@heroicons/react/24/outline";
import { loginUser } from "~~/utils/eventra/auth";

const LoginPage: NextPage = () => {
  const router = useRouter();
  const [identifier, setIdentifier] = useState("");
  const [password, setPassword] = useState("");
  const [remember, setRemember] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [submitting, setSubmitting] = useState(false);

  const handleSubmit = (e: FormEvent) => {
    e.preventDefault();
    setError(null);
    setSubmitting(true);
    const result = loginUser(identifier, password, remember);
    setSubmitting(false);
    if (!result.ok) {
      setError(result.error);
      return;
    }
    router.push("/");
  };

  return (
    <div className="flex grow items-center justify-center bg-[#f5f6f8] px-4 py-10">
      <div className="w-full max-w-md rounded-2xl bg-white p-8 shadow-md">
        <div className="flex flex-col items-center text-center">
          <UserCircleIcon className="h-12 w-12 text-[#2bb3ec]" strokeWidth={1.5} />
          <h1 className="mt-2 text-3xl font-bold leading-tight text-[#131a2b]">
            Bienvenido de nuevo
            <br />a Eventra.
          </h1>
          <p className="mt-2 text-sm text-[#6b7280]">Inicie sesión para continuar con su cuenta.</p>
        </div>

        <form className="mt-6 flex flex-col gap-4" onSubmit={handleSubmit}>
          <div>
            <label htmlFor="identifier" className="mb-1 block text-sm font-semibold text-[#131a2b]">
              Email o Nombre de Usuario
            </label>
            <input
              id="identifier"
              type="text"
              className="w-full rounded-lg bg-[#ebeef3] px-4 py-3 text-[#131a2b] placeholder:text-[#9aa3af] focus:outline-none focus:ring-2 focus:ring-[#2bb3ec]"
              placeholder="Introduce tu correo electrónico o nombre"
              value={identifier}
              onChange={e => setIdentifier(e.target.value)}
              autoComplete="username"
            />
          </div>

          <div>
            <div className="mb-1 flex items-center justify-between">
              <label htmlFor="password" className="text-sm font-semibold text-[#131a2b]">
                Contraseña
              </label>
              <Link href="#" className="text-sm font-medium text-[#2bb3ec] hover:underline">
                ¿Olvidó su contraseña?
              </Link>
            </div>
            <div className="relative">
              <input
                id="password"
                type={showPassword ? "text" : "password"}
                className="w-full rounded-lg bg-[#ebeef3] px-4 py-3 pr-11 text-[#131a2b] placeholder:text-[#9aa3af] focus:outline-none focus:ring-2 focus:ring-[#2bb3ec]"
                value={password}
                onChange={e => setPassword(e.target.value)}
                autoComplete="current-password"
              />
              <button
                type="button"
                aria-label={showPassword ? "Ocultar contraseña" : "Mostrar contraseña"}
                className="absolute inset-y-0 right-3 flex items-center text-[#6b7280]"
                onClick={() => setShowPassword(s => !s)}
              >
                {showPassword ? <EyeIcon className="h-5 w-5" /> : <EyeSlashIcon className="h-5 w-5" />}
              </button>
            </div>
          </div>

          <label className="flex cursor-pointer items-center gap-2 text-sm text-[#131a2b]">
            <input
              type="checkbox"
              className="h-4 w-4 rounded border-[#cbd1d9] accent-[#2bb3ec]"
              checked={remember}
              onChange={e => setRemember(e.target.checked)}
            />
            Recordarme
          </label>

          {error && <div className="rounded-lg bg-[#fdecec] px-3 py-2 text-sm text-[#b42424]">{error}</div>}

          <button
            type="submit"
            disabled={submitting}
            className="w-full cursor-pointer rounded-full bg-[#2bb3ec] py-3 font-semibold text-white shadow-md transition hover:bg-[#1ba5dd] disabled:cursor-not-allowed disabled:opacity-60"
          >
            {submitting ? "Iniciando..." : "Iniciar Sesión"}
          </button>

          <p className="text-center text-sm text-[#6b7280]">
            ¿No tienes cuenta?{" "}
            <Link href="/register" className="font-semibold text-[#2bb3ec] hover:underline">
              Crear cuenta
            </Link>
          </p>
        </form>
      </div>
    </div>
  );
};

export default LoginPage;
