"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import type { NextPage } from "next";
import { UserCircleIcon } from "@heroicons/react/24/outline";
import { useWallet } from "~~/hooks/eventra/useWallet";

const LoginPage: NextPage = () => {
  const router = useRouter();
  const { connect } = useWallet();
  const [error, setError] = useState<string | null>(null);
  const [submitting, setSubmitting] = useState(false);

  const handleConnect = async () => {
    setError(null);
    setSubmitting(true);
    try {
      await connect();
      router.push("/");
    } catch (e: any) {
      setError(e?.shortMessage ?? e?.message ?? "No se pudo conectar la wallet.");
    } finally {
      setSubmitting(false);
    }
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
          <p className="mt-2 text-sm text-[#6b7280]">Conecta tu wallet para continuar.</p>
        </div>

        {error && <div className="mt-4 rounded-lg bg-[#fdecec] px-3 py-2 text-sm text-[#b42424]">{error}</div>}

        <button
          onClick={handleConnect}
          disabled={submitting}
          className="mt-6 w-full cursor-pointer rounded-full bg-[#2bb3ec] py-3 font-semibold text-white shadow-md transition hover:bg-[#1ba5dd] disabled:cursor-not-allowed disabled:opacity-60"
        >
          {submitting ? "Conectando..." : "Conectar wallet"}
        </button>

        <p className="mt-4 text-center text-sm text-[#6b7280]">
          ¿No tienes cuenta?{" "}
          <Link href="/register" className="font-semibold text-[#2bb3ec] hover:underline">
            Crear cuenta
          </Link>
        </p>
      </div>
    </div>
  );
};

export default LoginPage;
