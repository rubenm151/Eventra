"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import type { NextPage } from "next";
import { TicketIcon } from "@heroicons/react/24/outline";
import { useWallet } from "~~/hooks/eventra/useWallet";

const RegisterPage: NextPage = () => {
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
      <div className="w-full max-w-md">
        <div className="mb-4 flex items-center justify-center gap-2">
          <TicketIcon className="h-7 w-7 text-[#2bb3ec]" />
          <span className="text-2xl font-bold text-[#131a2b]">Eventra</span>
        </div>

        <div className="rounded-2xl bg-white p-8 shadow-md">
          <div className="text-center">
            <h1 className="text-2xl font-bold text-[#131a2b]">Crea tu cuenta</h1>
            <p className="mt-1 text-sm text-[#6b7280]">Tu wallet es tu identidad — conéctala para empezar.</p>
          </div>

          {error && <div className="mt-4 rounded-lg bg-[#fdecec] px-3 py-2 text-sm text-[#b42424]">{error}</div>}

          <button
            onClick={handleConnect}
            disabled={submitting}
            className="mt-6 w-full cursor-pointer rounded-full bg-[#2bb3ec] py-3 font-semibold text-white shadow-md transition hover:bg-[#1ba5dd] disabled:opacity-60"
          >
            {submitting ? "Conectando..." : "Conectar wallet"}
          </button>

          <p className="mt-4 text-center text-sm text-[#6b7280]">
            ¿Ya tienes cuenta?{" "}
            <Link href="/login" className="font-semibold text-[#2bb3ec] hover:underline">
              Inicia sesión
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
};

export default RegisterPage;
