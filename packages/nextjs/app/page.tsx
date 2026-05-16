"use client";

import Link from "next/link";
import type { NextPage } from "next";
import {
  ArrowRightStartOnRectangleIcon,
  BuildingOffice2Icon,
  PlusIcon,
  TicketIcon,
  UserCircleIcon,
} from "@heroicons/react/24/outline";
import { useEventraSession } from "~~/hooks/eventra/useEventraSession";

const Home: NextPage = () => {
  const { session, hydrated, logout } = useEventraSession();

  return (
    <div className="flex grow flex-col items-center justify-center bg-[#f5f6f8] px-4 py-16">
      <div className="flex flex-col items-center text-center">
        <div className="flex items-center gap-3">
          <TicketIcon className="h-10 w-10 text-[#2bb3ec]" />
          <h1 className="text-4xl font-bold text-[#131a2b]">Eventra</h1>
        </div>
        <p className="mt-3 max-w-md text-[#6b7280]">
          Crea eventos, descubre experiencias y compra entradas. La plataforma para tu comunidad.
        </p>
      </div>

      <div className="mt-10 w-full max-w-md">
        {!hydrated ? null : session ? (
          <div className="rounded-2xl bg-white p-6 shadow-md">
            <div className="flex items-center gap-3">
              {session.role === "company" ? (
                <BuildingOffice2Icon className="h-7 w-7 text-[#2bb3ec]" />
              ) : (
                <UserCircleIcon className="h-7 w-7 text-[#2bb3ec]" />
              )}
              <div>
                <div className="font-bold text-[#131a2b]">¡Hola, {session.username}!</div>
                <div className="text-sm text-[#6b7280]">{session.email}</div>
              </div>
            </div>

            <div className="mt-4 rounded-xl bg-[#f5f6f8] p-3 text-sm text-[#131a2b]">
              <span className="font-semibold">Cuenta:</span> {session.role === "company" ? "Event Company" : "Usuario"}
              {session.company && (
                <div className="mt-2 space-y-0.5 text-xs text-[#374151]">
                  <div>
                    <span className="font-semibold">Empresa:</span> {session.company.name}
                  </div>
                  <div>
                    <span className="font-semibold">Teléfono:</span> {session.company.phone}
                  </div>
                  <div className="break-all">
                    <span className="font-semibold">Wallet:</span> {session.company.wallet}
                  </div>
                </div>
              )}
            </div>

            {session.role === "company" && (
              <Link
                href="/events/create"
                className="mt-5 flex w-full items-center justify-center gap-2 rounded-full bg-[#2bb3ec] py-3 font-semibold text-white shadow-md transition hover:bg-[#1ba5dd]"
              >
                <PlusIcon className="h-5 w-5" />
                Crear evento
              </Link>
            )}

            <button
              onClick={logout}
              className="mt-3 flex w-full cursor-pointer items-center justify-center gap-2 rounded-full border border-[#e5e7eb] bg-white py-3 font-semibold text-[#131a2b] transition hover:bg-[#f5f6f8]"
            >
              <ArrowRightStartOnRectangleIcon className="h-5 w-5" />
              Cerrar sesión
            </button>
          </div>
        ) : (
          <div className="flex flex-col gap-3">
            <Link
              href="/login"
              className="w-full rounded-full bg-[#2bb3ec] py-3 text-center font-semibold text-white shadow-md transition hover:bg-[#1ba5dd]"
            >
              Iniciar sesión
            </Link>
            <Link
              href="/register"
              className="w-full rounded-full cursor-pointer border border-[#2bb3ec] bg-white py-3 text-center font-semibold text-[#2bb3ec] transition hover:bg-[#eaf7fd]"
            >
              Crear cuenta
            </Link>
          </div>
        )}
      </div>
    </div>
  );
};

export default Home;
