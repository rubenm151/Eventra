"use client";

import { useCallback, useEffect, useState } from "react";
import Link from "next/link";
import type { NextPage } from "next";
import { formatEther } from "ethers";
import { ArrowLeftIcon, CalendarDaysIcon, PlusIcon, TicketIcon } from "@heroicons/react/24/outline";
import { useWallet } from "~~/hooks/eventra/useWallet";
import { getReadContract, getWriteContract, parseContractError } from "~~/utils/eventra/contract";

type EventView = {
  id: number;
  name: string;
  description: string;
  priceEth: string;
  eventDate: number; // ms
  ticketsSold: number;
  totalTickets: number;
  state: number;
};

const STATE_LABEL = ["Activo", "Expirado", "Agotado", "Cancelado", "Finalizado"];

const MyEventsPage: NextPage = () => {
  const { address, connect } = useWallet();
  const [events, setEvents] = useState<EventView[] | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [cancelling, setCancelling] = useState<number | null>(null);
  const [withdrawing, setWithdrawing] = useState<number | null>(null);

  const loadEvents = useCallback(async () => {
    if (!address) {
      return;
    }
    setLoading(true);
    setError(null);
    try {
      const contract = getReadContract();
      const getEvent = contract.getFunction("getEvent");
      const ids: bigint[] = await contract.getAllEvents();
      const all = await Promise.all(ids.map(id => getEvent(id)));
      setEvents(
        all
          .filter(ev => ev.organizer.toLowerCase() === address.toLowerCase())
          .map(ev => ({
            id: Number(ev.eventId),
            name: ev.eventName,
            description: ev.eventDescription,
            priceEth: formatEther(ev.ticketPrice),
            eventDate: Number(ev.eventDate) * 1000,
            ticketsSold: Number(ev.ticketsSold),
            totalTickets: Number(ev.totalTicketNumber),
            state: Number(ev.eventState),
          })),
      );
    } catch (e) {
      setError(parseContractError(e));
    } finally {
      setLoading(false);
    }
  }, [address]);

  useEffect(() => {
    loadEvents();
  }, [loadEvents]);

  const handleCancel = async (id: number) => {
    setError(null);
    setCancelling(id);
    try {
      const signer = await connect();
      const contract = getWriteContract(signer);
      const tx = await contract.cancelEvent(id);
      await tx.wait();
      await loadEvents(); // pasa a Cancelado
    } catch (e) {
      setError(parseContractError(e));
    } finally {
      setCancelling(null);
    }
  };

  const handleWithdraw = async (id: number) => {
    setError(null);
    setWithdrawing(id);
    try {
      const signer = await connect();
      const contract = getWriteContract(signer);
      const tx = await contract.withdrawCompanyFunds(id);
      await tx.wait();
      await loadEvents(); // pasa a Finalizado
    } catch (e) {
      setError(parseContractError(e));
    } finally {
      setWithdrawing(null);
    }
  }
  if (!address) {
    return (
      <div className="flex grow items-center justify-center bg-[#f5f6f8] px-4 py-10">
        <div className="w-full max-w-md rounded-2xl bg-white p-8 text-center shadow-md">
          <h1 className="text-xl font-bold text-[#131a2b]">Conecta tu wallet</h1>
          <p className="mt-2 text-sm text-[#6b7280]">Conecta tu wallet para ver tus eventos.</p>
          <button
            onClick={connect}
            className="mt-5 w-full cursor-pointer rounded-full bg-[#2bb3ec] py-3 font-semibold text-white shadow-md transition hover:bg-[#1ba5dd]"
          >
            Conectar wallet
          </button>
          <Link href="/" className="mt-3 inline-block text-sm font-medium text-[#6b7280] hover:text-[#131a2b]">
            Volver al inicio
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="flex grow flex-col items-center bg-[#f5f6f8] px-4 py-10">
      <div className="w-full max-w-2xl">
        <Link
          href="/"
          className="mb-4 inline-flex items-center gap-1 text-sm font-medium text-[#6b7280] hover:text-[#131a2b]"
        >
          <ArrowLeftIcon className="h-4 w-4" />
          Volver
        </Link>

        <div className="mb-6 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <TicketIcon className="h-7 w-7 text-[#2bb3ec]" />
            <h1 className="text-2xl font-bold text-[#131a2b]">Mis eventos</h1>
          </div>
          <Link
            href="/events/create"
            className="flex items-center gap-1 rounded-full bg-[#2bb3ec] px-4 py-2 text-sm font-semibold text-white shadow-md transition hover:bg-[#1ba5dd]"
          >
            <PlusIcon className="h-4 w-4" />
            Crear evento
          </Link>
        </div>

        {loading && <p className="text-center text-sm text-[#6b7280]">Cargando eventos…</p>}

        {error && <div className="mb-4 rounded-lg bg-[#fdecec] px-3 py-2 text-sm text-[#b42424]">{error}</div>}

        {events && events.length === 0 && (
          <div className="rounded-2xl bg-white p-10 text-center shadow-md">
            <CalendarDaysIcon className="mx-auto h-12 w-12 text-[#cbd1d9]" strokeWidth={1.5} />
            <h2 className="mt-3 text-lg font-bold text-[#131a2b]">Todavía no has creado eventos</h2>
            <p className="mt-1 text-sm text-[#6b7280]">Crea tu primer evento y aparecerá aquí.</p>
            <Link
              href="/events/create"
              className="mt-5 inline-flex items-center gap-2 rounded-full bg-[#2bb3ec] px-6 py-2.5 font-semibold text-white shadow-md transition hover:bg-[#1ba5dd]"
            >
              <PlusIcon className="h-5 w-5" />
              Crear evento
            </Link>
          </div>
        )}

        {events && events.length > 0 && (
          <div className="flex flex-col gap-4">
            {events.map(ev => (
              <div key={ev.id} className="rounded-2xl bg-white p-6 shadow-md">
                <div className="flex items-start justify-between gap-3">
                  <div>
                    <h2 className="text-lg font-bold text-[#131a2b]">{ev.name}</h2>
                    <p className="mt-1 text-sm text-[#6b7280]">{ev.description}</p>
                  </div>
                  <span
                    className={`shrink-0 rounded-full px-3 py-1 text-xs font-semibold ${ev.state === 3 ? "bg-[#fdecec] text-[#b42424]" : "bg-[#eaf7fd] text-[#2bb3ec]"
                      }`}
                  >
                    {STATE_LABEL[ev.state] ?? "—"}
                  </span>
                </div>

                <div className="mt-4 grid grid-cols-2 gap-3 text-sm text-[#131a2b] sm:grid-cols-3">
                  <div>
                    <div className="text-xs text-[#6b7280]">Fecha</div>
                    <div className="font-semibold">{new Date(ev.eventDate).toLocaleDateString()}</div>
                  </div>
                  <div>
                    <div className="text-xs text-[#6b7280]">Precio</div>
                    <div className="font-semibold">{ev.priceEth} ETH</div>
                  </div>
                  <div>
                    <div className="text-xs text-[#6b7280]">Vendidas</div>
                    <div className="font-semibold">
                      {ev.ticketsSold} / {ev.totalTickets}
                    </div>
                  </div>
                </div>

                {ev.state === 0 && (
                  <button
                    onClick={() => handleCancel(ev.id)}
                    disabled={cancelling === ev.id}
                    className="mt-5 w-full cursor-pointer rounded-full border border-[#f0c0c0] bg-white py-2.5 text-sm font-semibold text-[#b42424] transition hover:bg-[#fdecec] disabled:opacity-60"
                  >
                    {cancelling === ev.id ? "Cancelando" : "Cancelar evento"}
                  </button>
                )}

                {/* Retirar fondos solo si el evento ya pasó y no está cancelado/finalizado.
                El contrato exige además que haya pasado 1 día desde la fecha del evento. */}
               {Date.now() > ev.eventDate && ev.state !== 3 && ev.state !== 4 && (
                  <button
                    onClick={() => handleWithdraw(ev.id)}
                    disabled={withdrawing === ev.id}
                    className="mt-3 w-full cursor-pointer rounded-full bg-[#2bb3ec] py-2.5 text-sm font-semibold text-white shadow-md transition hover:bg-[#1ba5dd] disabled:opacity-60"
                  >
                    {withdrawing === ev.id ? "Retirando…" : "Retirar fondos"}
                  </button>
                )}

              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default MyEventsPage;
