"use client";

import { FormEvent, useState } from "react";
import Link from "next/link";
import type { NextPage } from "next";
import { BuildingOffice2Icon, PlusIcon, TicketIcon, UserCircleIcon } from "@heroicons/react/24/outline";
import { useWallet } from "~~/hooks/eventra/useWallet";
import { getWriteContract } from "~~/utils/eventra/contract";

const short = (a: string) => `${a.slice(0, 6)}…${a.slice(-4)}`;

const RegisterPage: NextPage = () => {
  const { connect } = useWallet();
  const [asCompany, setAsCompany] = useState(true);
  const [companyName, setCompanyName] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [submitting, setSubmitting] = useState(false);
  const [result, setResult] = useState<{ address: string; company: boolean; name: string | null } | null>(null);

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();

    setError(null);
    if (asCompany && !companyName.trim()) {
      setError("Introduce el nombre de la empresa.");
      return;
    }

    setSubmitting(true);
    try {
      const signer = await connect();
      const addr = await signer.getAddress();
      const contract = getWriteContract(signer);

      const tx = asCompany
        ? await contract.registerCompany(companyName.trim(), addr)
        : await contract.registerUser();

      await tx.wait();
      setResult({ address: addr, company: asCompany, name: asCompany ? companyName.trim() : null }); // en vez de ir a home
    } catch (err: any) {
      setError(err?.shortMessage ?? err?.reason ?? err?.message ?? "Error al registrar.");
    } finally {
      setSubmitting(false);
    }
  };

  if (result) {
    return (
      <div className="flex grow items-center justify-center bg-[#f5f6f8] px-4 py-10">
        <div className="w-full max-w-md rounded-2xl bg-white p-6 shadow-md">
          <div className="flex items-center gap-3">
            {result.company ? (
              <BuildingOffice2Icon className="h-7 w-7 text-[#2bb3ec]" />
            ) : (
              <UserCircleIcon className="h-7 w-7 text-[#2bb3ec]" />
            )}
            <div>
              <div className="font-bold text-[#131a2b]">Wallet conectada</div>
              <div className="break-all font-mono text-sm text-[#6b7280]">{short(result.address)}</div>
            </div>
          </div>

          <div className="mt-4 rounded-xl bg-[#f5f6f8] p-3 text-sm text-[#131a2b]">
            <span className="font-semibold">Cuenta:</span> {result.company ? "Event Company" : "Usuario"}
            {result.company && result.name && (
              <div className="mt-1">
                <span className="font-semibold">Empresa:</span> {result.name}
              </div>
            )}
          </div>

          {result.company && (
            <Link
              href="/events/create"
              className="mt-5 flex w-full items-center justify-center gap-2 rounded-full bg-[#2bb3ec] py-3 font-semibold text-white shadow-md transition hover:bg-[#1ba5dd]"
            >
              <PlusIcon className="h-5 w-5" />
              Crear evento
            </Link>
          )}

          <Link
            href="/"
            className="mt-3 flex w-full items-center justify-center rounded-full border border-[#e5e7eb] bg-white py-3 font-semibold text-[#131a2b] transition hover:bg-[#f5f6f8]"
          >
            Ir al inicio
          </Link>
        </div>
      </div>
    );
  }

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

          <form className="mt-6 flex flex-col gap-3" onSubmit={handleSubmit}>
            <label className="flex cursor-pointer items-center gap-2 text-sm text-[#131a2b]">
              <input
                type="checkbox"
                checked={asCompany}
                onChange={e => setAsCompany(e.target.checked)}
                className="h-4 w-4 rounded border-[#cbd1d9] accent-[#2bb3ec]"
              />
              Registrarme como Event Company
            </label>

            {asCompany && (
              <input
                type="text"
                placeholder="Nombre de la empresa"
                value={companyName}
                onChange={e => setCompanyName(e.target.value)}
                className="w-full rounded-lg bg-[#ebeef3] px-4 py-3 text-[#131a2b] focus:outline-none focus:ring-2 focus:ring-[#2bb3ec]"
              />
            )}

            {error && <div className="rounded-lg bg-[#fdecec] px-3 py-2 text-sm text-[#b42424]">{error}</div>}

            <button
              type="submit"
              disabled={submitting}
              className="mt-2 w-full cursor-pointer rounded-full bg-[#2bb3ec] py-3 font-semibold text-white shadow-md transition hover:bg-[#1ba5dd] disabled:opacity-60"
            >
              {submitting ? "Registrando..." : "Registrarme"}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
};

export default RegisterPage;
