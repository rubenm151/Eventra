"use client";

import { FormEvent, useState } from "react";
import Link from "next/link";
import type { NextPage } from "next";
import { parseEther } from "ethers";
import { ArrowLeftIcon, CheckCircleIcon, TicketIcon } from "@heroicons/react/24/outline";
import { useWallet } from "~~/hooks/eventra/useWallet";
import { getWriteContract, parseContractError } from "~~/utils/eventra/contract";

const inputClass =
  "w-full rounded-lg bg-[#ebeef3] px-4 py-3 text-[#131a2b] placeholder:text-[#9aa3af] focus:outline-none focus:ring-2 focus:ring-[#2bb3ec]";
const labelClass = "mb-1 block text-sm font-semibold text-[#131a2b]";

const short = (a: string) => `${a.slice(0, 6)}…${a.slice(-4)}`;

const CreateEventPage: NextPage = () => {
  const { address, connect } = useWallet();

  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [saleStartsAt, setSaleStartsAt] = useState("");
  const [saleEndsAt, setSaleEndsAt] = useState("");
  const [eventStartsAt, setEventStartsAt] = useState("");
  const [totalTickets, setTotalTickets] = useState("");
  const [ticketPrice, setTicketPrice] = useState("");
  const [maxTicketsPerAddress, setMaxTicketsPerAddress] = useState("");
  const [maxNumberOfOwners, setMaxNumberOfOwners] = useState("");
  const [resaleRoyaltyPercent, setResaleRoyaltyPercent] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [submitting, setSubmitting] = useState(false);
  const [createdId, setCreatedId] = useState<string | null>(null);

  if (!address) {
    return (
      <div className="flex grow items-center justify-center bg-[#f5f6f8] px-4 py-10">
        <div className="w-full max-w-md rounded-2xl bg-white p-8 text-center shadow-md">
          <h1 className="text-xl font-bold text-[#131a2b]">Conecta tu wallet</h1>
          <p className="mt-2 text-sm text-[#6b7280]">Necesitas conectar tu wallet para crear un evento.</p>
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

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setError(null);

    const royalty = Number(resaleRoyaltyPercent);
    if (royalty < 10 || royalty > 25) {
      setError("El royalty debe estar entre 10 y 25%.");
      return;
    }

    const toSec = (v: string) => Math.floor(new Date(v).getTime() / 1000);

    setSubmitting(true);
    try {
      const signer = await connect();
      const contract = getWriteContract(signer);

      const tx = await contract.createEvent(
        name,
        description,
        parseEther(ticketPrice),
        toSec(saleStartsAt),
        toSec(saleEndsAt),
        toSec(eventStartsAt),
        royalty,
        Number(totalTickets),
        Number(maxTicketsPerAddress),
        Number(maxNumberOfOwners),
        { value: parseEther("1") }, // depósito de 1 ETH que exige el contrato
      );
      await tx.wait();
      setCreatedId(tx.hash);
    } catch (err: any) {
      setError(parseContractError(err));
    } finally {
      setSubmitting(false);
    }
  };

  if (createdId) {
    return (
      <div className="flex grow items-center justify-center bg-[#f5f6f8] px-4 py-10">
        <div className="w-full max-w-md rounded-2xl bg-white p-8 text-center shadow-md">
          <CheckCircleIcon className="mx-auto h-12 w-12 text-[#2bb3ec]" strokeWidth={1.5} />
          <h1 className="mt-2 text-2xl font-bold text-[#131a2b]">¡Evento creado!</h1>
          <p className="mt-2 text-sm text-[#6b7280]">
            Evento creado on-chain. Tx: <span className="font-mono">{createdId.slice(0, 10)}…</span>
          </p>
          <div className="mt-6 flex flex-col gap-2">
            <button
              onClick={() => {
                setCreatedId(null);
                setName("");
                setDescription("");
                setSaleStartsAt("");
                setSaleEndsAt("");
                setEventStartsAt("");
                setTotalTickets("");
                setTicketPrice("");
                setMaxTicketsPerAddress("");
                setMaxNumberOfOwners("");
                setResaleRoyaltyPercent("");
              }}
              className="w-full cursor-pointer rounded-full bg-[#2bb3ec] py-3 font-semibold text-white shadow-md transition hover:bg-[#1ba5dd]"
            >
              Crear otro evento
            </button>
            <Link
              href="/"
              className="w-full rounded-full border border-[#e5e7eb] bg-white py-3 text-center font-semibold text-[#131a2b] transition hover:bg-[#f5f6f8]"
            >
              Volver al inicio
            </Link>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="flex grow flex-col items-center bg-[#f5f6f8] px-4 py-10">
      <div className="w-full max-w-xl">
        <Link
          href="/"
          className="mb-4 inline-flex items-center gap-1 text-sm font-medium text-[#6b7280] hover:text-[#131a2b]"
        >
          <ArrowLeftIcon className="h-4 w-4" />
          Volver
        </Link>

        <div className="mb-4 flex items-center justify-center gap-2">
          <TicketIcon className="h-7 w-7 text-[#2bb3ec]" />
          <span className="text-2xl font-bold text-[#131a2b]">Eventra</span>
        </div>

        <div className="rounded-2xl bg-white p-8 shadow-md">
          <div className="text-center">
            <h1 className="text-2xl font-bold text-[#131a2b]">Crear nuevo evento</h1>
            <p className="mt-1 text-sm text-[#6b7280]">
              Organizado por <span className="font-mono font-semibold">{short(address)}</span>
            </p>
          </div>

          <form className="mt-6 flex flex-col gap-4" onSubmit={handleSubmit}>
            <div>
              <label htmlFor="name" className={labelClass}>
                Nombre
              </label>
              <input
                id="name"
                type="text"
                className={inputClass}
                placeholder="Ej. Concierto de jazz en directo"
                value={name}
                onChange={e => setName(e.target.value)}
              />
            </div>

            <div>
              <label htmlFor="description" className={labelClass}>
                Descripción
              </label>
              <textarea
                id="description"
                rows={4}
                className={inputClass}
                placeholder="Cuenta de qué va tu evento"
                value={description}
                onChange={e => setDescription(e.target.value)}
              />
            </div>

            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
              <div>
                <label htmlFor="saleStartsAt" className={labelClass}>
                  Inicio de venta
                </label>
                <input
                  id="saleStartsAt"
                  type="datetime-local"
                  className={inputClass}
                  value={saleStartsAt}
                  onChange={e => setSaleStartsAt(e.target.value)}
                />
              </div>
              <div>
                <label htmlFor="saleEndsAt" className={labelClass}>
                  Fin de venta
                </label>
                <input
                  id="saleEndsAt"
                  type="datetime-local"
                  className={inputClass}
                  value={saleEndsAt}
                  onChange={e => setSaleEndsAt(e.target.value)}
                />
              </div>
            </div>

            <div>
              <label htmlFor="eventStartsAt" className={labelClass}>
                Fecha del evento
              </label>
              <input
                id="eventStartsAt"
                type="datetime-local"
                className={inputClass}
                value={eventStartsAt}
                onChange={e => setEventStartsAt(e.target.value)}
              />
            </div>

            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
              <div>
                <label htmlFor="totalTickets" className={labelClass}>
                  Número total de entradas
                </label>
                <input
                  id="totalTickets"
                  type="number"
                  min={1}
                  className={inputClass}
                  value={totalTickets}
                  onChange={e => setTotalTickets(e.target.value)}
                />
              </div>
              <div>
                <label htmlFor="ticketPrice" className={labelClass}>
                  Precio (ETH)
                </label>
                <input
                  id="ticketPrice"
                  type="text"
                  className={inputClass}
                  placeholder="0.05"
                  value={ticketPrice}
                  onChange={e => setTicketPrice(e.target.value)}
                />
              </div>
            </div>

            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
              <div>
                <label htmlFor="maxTicketsPerAddress" className={labelClass}>
                  Máx. entradas por persona
                </label>
                <input
                  id="maxTicketsPerAddress"
                  type="number"
                  min={1}
                  className={inputClass}
                  value={maxTicketsPerAddress}
                  onChange={e => setMaxTicketsPerAddress(e.target.value)}
                />
              </div>
              <div>
                <label htmlFor="maxNumberOfOwners" className={labelClass}>
                  Máx. propietarios por entrada
                </label>
                <input
                  id="maxNumberOfOwners"
                  type="number"
                  min={1}
                  className={inputClass}
                  value={maxNumberOfOwners}
                  onChange={e => setMaxNumberOfOwners(e.target.value)}
                />
              </div>
            </div>

            <div>
              <label htmlFor="resaleRoyaltyPercent" className={labelClass}>
                Royalty de reventa (%) — entre 10 y 25
              </label>
              <input
                id="resaleRoyaltyPercent"
                type="number"
                min={10}
                max={25}
                className={inputClass}
                value={resaleRoyaltyPercent}
                onChange={e => setResaleRoyaltyPercent(e.target.value)}
              />
            </div>

            {error && <div className="rounded-lg bg-[#fdecec] px-3 py-2 text-sm text-[#b42424]">{error}</div>}

            <button
              type="submit"
              disabled={submitting}
              className="mt-2 w-full cursor-pointer rounded-full bg-[#2bb3ec] py-3 font-semibold text-white shadow-md transition hover:bg-[#1ba5dd] disabled:cursor-not-allowed disabled:opacity-60"
            >
              {submitting ? "Creando..." : "Publicar evento"}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
};

export default CreateEventPage;
