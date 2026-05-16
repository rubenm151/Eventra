"use client";

import { FormEvent, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import type { NextPage } from "next";
import { EyeIcon, EyeSlashIcon, TicketIcon } from "@heroicons/react/24/outline";
import { registerUser } from "~~/utils/eventra/auth";

const RegisterPage: NextPage = () => {
  const router = useRouter();

  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);

  const [asCompany, setAsCompany] = useState(true);
  const [companyName, setCompanyName] = useState("");
  const [companyPhone, setCompanyPhone] = useState("");
  const [companyWallet, setCompanyWallet] = useState("");

  const [acceptedTerms, setAcceptedTerms] = useState(false);
  const [acceptedPrivacy, setAcceptedPrivacy] = useState(false);

  const [error, setError] = useState<string | null>(null);
  const [submitting, setSubmitting] = useState(false);

  const handleSubmit = (e: FormEvent) => {
    e.preventDefault();
    setError(null);
    setSubmitting(true);
    const result = registerUser({
      username,
      email,
      password,
      confirmPassword,
      asCompany,
      company: asCompany ? { name: companyName, phone: companyPhone, wallet: companyWallet } : undefined,
      acceptedTerms,
      acceptedPrivacy,
    });
    setSubmitting(false);
    if (!result.ok) {
      setError(result.error);
      return;
    }
    router.push("/");
  };

  const inputClass =
    "w-full rounded-lg bg-[#ebeef3] px-4 py-3 text-[#131a2b] placeholder:text-[#9aa3af] focus:outline-none focus:ring-2 focus:ring-[#2bb3ec]";

  return (
    <div className="flex grow items-center justify-center bg-[#f5f6f8] px-4 py-10">
      <div className="w-full max-w-md">
        <div className="mb-4 flex items-center justify-center gap-2">
          <TicketIcon className="h-7 w-7 text-[#2bb3ec]" />
          <span className="text-2xl font-bold text-[#131a2b]">Eventra</span>
        </div>

        <div className="rounded-2xl bg-white p-8 shadow-md">
          <div className="text-center">
            <h1 className="text-2xl font-bold text-[#131a2b]">Crea tu cuenta</h1>
            <p className="mt-1 text-sm text-[#6b7280]">Bienvenido a la comunidad</p>
          </div>

          <form className="mt-5 flex flex-col gap-3" onSubmit={handleSubmit}>
            <div>
              <label htmlFor="username" className="mb-1 block text-sm font-semibold text-[#131a2b]">
                Nombre de usuario
              </label>
              <input
                id="username"
                type="text"
                className={inputClass}
                placeholder="Introduce tu nombre de usuario"
                value={username}
                onChange={e => setUsername(e.target.value)}
                autoComplete="username"
              />
            </div>

            <div>
              <label htmlFor="email" className="mb-1 block text-sm font-semibold text-[#131a2b]">
                Correo electrónico
              </label>
              <input
                id="email"
                type="email"
                className={inputClass}
                placeholder="tu_correo@ejemplo.com"
                value={email}
                onChange={e => setEmail(e.target.value)}
                autoComplete="email"
              />
            </div>

            <div>
              <label htmlFor="password" className="mb-1 block text-sm font-semibold text-[#131a2b]">
                Contraseña
              </label>
              <div className="relative">
                <input
                  id="password"
                  type={showPassword ? "text" : "password"}
                  className={`${inputClass} pr-11`}
                  placeholder="Introduce tu contraseña"
                  value={password}
                  onChange={e => setPassword(e.target.value)}
                  autoComplete="new-password"
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

            <div>
              <label htmlFor="confirmPassword" className="mb-1 block text-sm font-semibold text-[#131a2b]">
                Confirmar contraseña
              </label>
              <div className="relative">
                <input
                  id="confirmPassword"
                  type={showConfirm ? "text" : "password"}
                  className={`${inputClass} pr-11`}
                  placeholder="Vuelve a introducir tu contraseña"
                  value={confirmPassword}
                  onChange={e => setConfirmPassword(e.target.value)}
                  autoComplete="new-password"
                />
                <button
                  type="button"
                  aria-label={showConfirm ? "Ocultar contraseña" : "Mostrar contraseña"}
                  className="absolute inset-y-0 right-3 flex items-center text-[#6b7280]"
                  onClick={() => setShowConfirm(s => !s)}
                >
                  {showConfirm ? <EyeIcon className="h-5 w-5" /> : <EyeSlashIcon className="h-5 w-5" />}
                </button>
              </div>
            </div>

            <label className="mt-1 flex cursor-pointer items-start gap-3 rounded-xl bg-[#f5f6f8] p-3">
              <input
                type="checkbox"
                className="mt-1 h-4 w-4 rounded border-[#cbd1d9] accent-[#2bb3ec]"
                checked={asCompany}
                onChange={e => setAsCompany(e.target.checked)}
              />
              <div>
                <div className="font-semibold text-[#131a2b]">Registrarme como Event Company</div>
                <div className="text-xs text-[#6b7280]">Las cuentas Event Company pueden crear eventos.</div>
              </div>
            </label>

            {asCompany && (
              <div className="flex flex-col gap-3 rounded-xl border border-dashed border-[#2bb3ec] bg-[#eaf7fd] p-4">
                <div>
                  <label htmlFor="companyName" className="mb-1 block text-sm font-semibold text-[#131a2b]">
                    Nombre de la empresa
                  </label>
                  <input
                    id="companyName"
                    type="text"
                    className={inputClass.replace("bg-[#ebeef3]", "bg-white")}
                    placeholder="Nombre legal o comercial"
                    value={companyName}
                    onChange={e => setCompanyName(e.target.value)}
                  />
                </div>

                <div>
                  <label htmlFor="companyPhone" className="mb-1 block text-sm font-semibold text-[#131a2b]">
                    Teléfono de contacto
                  </label>
                  <input
                    id="companyPhone"
                    type="tel"
                    className={inputClass.replace("bg-[#ebeef3]", "bg-white")}
                    placeholder="+34 600 000 000"
                    value={companyPhone}
                    onChange={e => setCompanyPhone(e.target.value)}
                  />
                </div>

                <div>
                  <label htmlFor="companyWallet" className="mb-1 block text-sm font-semibold text-[#131a2b]">
                    Dirección de wallet
                  </label>
                  <input
                    id="companyWallet"
                    type="text"
                    className={`${inputClass.replace("bg-[#ebeef3]", "bg-white")} font-mono text-sm`}
                    placeholder="0x..."
                    value={companyWallet}
                    onChange={e => setCompanyWallet(e.target.value)}
                  />
                </div>
              </div>
            )}

            <label className="flex cursor-pointer items-center gap-2 text-sm text-[#131a2b]">
              <input
                type="checkbox"
                className="h-4 w-4 rounded border-[#cbd1d9] accent-[#2bb3ec]"
                checked={acceptedTerms}
                onChange={e => setAcceptedTerms(e.target.checked)}
              />
              <span>
                Acepto los <a className="font-semibold text-[#2bb3ec] hover:underline">Términos y Condiciones</a>
              </span>
            </label>

            <label className="flex cursor-pointer items-center gap-2 text-sm text-[#131a2b]">
              <input
                type="checkbox"
                className="h-4 w-4 rounded border-[#cbd1d9] accent-[#2bb3ec]"
                checked={acceptedPrivacy}
                onChange={e => setAcceptedPrivacy(e.target.checked)}
              />
              <span>
                He leído la <a className="font-semibold text-[#2bb3ec] hover:underline">Política de Privacidad</a>
              </span>
            </label>

            {error && <div className="rounded-lg bg-[#fdecec] px-3 py-2 text-sm text-[#b42424]">{error}</div>}

            <button
              type="submit"
              disabled={submitting}
              className="mt-2 w-full cursor-pointer rounded-full bg-[#2bb3ec] py-3 font-semibold text-white shadow-md transition hover:bg-[#1ba5dd] disabled:opacity-60"
            >
              {submitting ? "Creando..." : "Crear Cuenta"}
            </button>

            <p className="mt-1 text-center text-sm text-[#6b7280]">
              ¿Ya tienes cuenta?{" "}
              <Link href="/login" className="font-semibold text-[#2bb3ec] hover:underline">
                Inicia sesión
              </Link>
            </p>
          </form>
        </div>
      </div>
    </div>
  );
};

export default RegisterPage;
