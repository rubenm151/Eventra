export type EventraEvent = {
  id: string;
  name: string;
  description: string;
  saleStartsAt: number;
  saleEndsAt: number;
  eventStartsAt: number;
  totalTickets: number;
  ticketPrice: number;
  resaleRoyaltyPercent: number;
  fundsReleaseModel: "on_event_end";
  organizerUsername: string;
  organizerWallet: string | null;
  createdAt: number;
};

export type CreateEventInput = {
  name: string;
  description: string;
  saleStartsAt: string;
  saleEndsAt: string;
  eventStartsAt: string;
  totalTickets: string;
  ticketPrice: string;
  resaleRoyaltyPercent: string;
  organizerUsername: string;
  organizerWallet: string | null;
};

export type EventResult<T> = { ok: true; data: T } | { ok: false; error: string };

const EVENTS_KEY = "eventra:events";

const isBrowser = () => typeof window !== "undefined";

const readEvents = (): EventraEvent[] => {
  if (!isBrowser()) return [];
  try {
    const raw = localStorage.getItem(EVENTS_KEY);
    return raw ? (JSON.parse(raw) as EventraEvent[]) : [];
  } catch {
    return [];
  }
};

const writeEvents = (events: EventraEvent[]) => {
  if (!isBrowser()) return;
  localStorage.setItem(EVENTS_KEY, JSON.stringify(events));
};

const generateId = () => {
  if (isBrowser() && typeof crypto !== "undefined" && "randomUUID" in crypto) {
    return crypto.randomUUID();
  }
  return `evt_${Date.now()}_${Math.random().toString(36).slice(2, 8)}`;
};

const parseDateTime = (value: string): number | null => {
  if (!value) return null;
  const t = new Date(value).getTime();
  return Number.isNaN(t) ? null : t;
};

export const createEvent = (input: CreateEventInput): EventResult<EventraEvent> => {
  const name = input.name.trim();
  const description = input.description.trim();

  if (!name) return { ok: false, error: "El nombre del evento es obligatorio." };
  if (name.length < 3) return { ok: false, error: "El nombre debe tener al menos 3 caracteres." };
  if (!description) return { ok: false, error: "La descripción es obligatoria." };

  const saleStartsAt = parseDateTime(input.saleStartsAt);
  const saleEndsAt = parseDateTime(input.saleEndsAt);
  const eventStartsAt = parseDateTime(input.eventStartsAt);

  if (saleStartsAt == null) return { ok: false, error: "Introduce una fecha de inicio de venta válida." };
  if (saleEndsAt == null) return { ok: false, error: "Introduce una fecha de fin de venta válida." };
  if (eventStartsAt == null) return { ok: false, error: "Introduce la fecha del evento." };

  if (saleEndsAt <= saleStartsAt) {
    return { ok: false, error: "La fecha de fin de venta debe ser posterior al inicio." };
  }
  if (eventStartsAt < saleEndsAt) {
    return { ok: false, error: "La fecha del evento debe ser posterior al fin de venta." };
  }

  const totalTickets = Number(input.totalTickets);
  if (!Number.isInteger(totalTickets) || totalTickets <= 0) {
    return { ok: false, error: "El número total de entradas debe ser un entero mayor que 0." };
  }

  const ticketPrice = Number(input.ticketPrice);
  if (Number.isNaN(ticketPrice) || ticketPrice < 0) {
    return { ok: false, error: "El precio de la entrada debe ser mayor o igual a 0." };
  }

  const resaleRoyaltyPercent = Number(input.resaleRoyaltyPercent);
  if (Number.isNaN(resaleRoyaltyPercent) || resaleRoyaltyPercent < 0 || resaleRoyaltyPercent > 100) {
    return { ok: false, error: "El royalty de reventa debe estar entre 0 y 100." };
  }

  const newEvent: EventraEvent = {
    id: generateId(),
    name,
    description,
    saleStartsAt,
    saleEndsAt,
    eventStartsAt,
    totalTickets,
    ticketPrice,
    resaleRoyaltyPercent,
    fundsReleaseModel: "on_event_end",
    organizerUsername: input.organizerUsername,
    organizerWallet: input.organizerWallet,
    createdAt: Date.now(),
  };

  const events = readEvents();
  events.push(newEvent);
  writeEvents(events);
  return { ok: true, data: newEvent };
};

export const listEvents = (): EventraEvent[] => readEvents();

export const listEventsByOrganizer = (username: string): EventraEvent[] =>
  readEvents().filter(e => e.organizerUsername === username);
