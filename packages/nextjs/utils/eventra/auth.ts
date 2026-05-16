export type UserRole = "user" | "company";

export type EventraUser = {
  username: string;
  email: string;
  password: string;
  role: UserRole;
  createdAt: number;
  company?: {
    name: string;
    phone: string;
    wallet: string;
  };
};

export type SessionUser = Omit<EventraUser, "password">;

const USERS_KEY = "eventra:users";
const SESSION_KEY = "eventra:session";
const REMEMBER_KEY = "eventra:remember";

const isBrowser = () => typeof window !== "undefined";

const readUsers = (): EventraUser[] => {
  if (!isBrowser()) return [];
  try {
    const raw = localStorage.getItem(USERS_KEY);
    return raw ? (JSON.parse(raw) as EventraUser[]) : [];
  } catch {
    return [];
  }
};

const writeUsers = (users: EventraUser[]) => {
  if (!isBrowser()) return;
  localStorage.setItem(USERS_KEY, JSON.stringify(users));
};

const toSession = (user: EventraUser): SessionUser => {
  const { password: _password, ...rest } = user;
  return rest;
};

export type RegisterInput = {
  username: string;
  email: string;
  password: string;
  confirmPassword: string;
  asCompany: boolean;
  company?: {
    name: string;
    phone: string;
    wallet: string;
  };
  acceptedTerms: boolean;
  acceptedPrivacy: boolean;
};

export type AuthResult<T> = { ok: true; data: T } | { ok: false; error: string };

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
const WALLET_RE = /^0x[a-fA-F0-9]{40}$/;

export const registerUser = (input: RegisterInput): AuthResult<SessionUser> => {
  const username = input.username.trim();
  const email = input.email.trim().toLowerCase();

  if (!username) return { ok: false, error: "El nombre de usuario es obligatorio." };
  if (username.length < 3) return { ok: false, error: "El nombre de usuario debe tener al menos 3 caracteres." };
  if (!EMAIL_RE.test(email)) return { ok: false, error: "Introduce un correo electrónico válido." };
  if (input.password.length < 6) return { ok: false, error: "La contraseña debe tener al menos 6 caracteres." };
  if (input.password !== input.confirmPassword) return { ok: false, error: "Las contraseñas no coinciden." };
  if (!input.acceptedTerms) return { ok: false, error: "Debes aceptar los Términos y Condiciones." };
  if (!input.acceptedPrivacy) return { ok: false, error: "Debes aceptar la Política de Privacidad." };

  if (input.asCompany) {
    const company = input.company;
    if (!company?.name?.trim()) return { ok: false, error: "Introduce el nombre de la empresa." };
    if (!company?.phone?.trim()) return { ok: false, error: "Introduce un teléfono de contacto." };
    if (!WALLET_RE.test(company?.wallet ?? "")) {
      return { ok: false, error: "La dirección de wallet no es válida (debe ser 0x + 40 hex)." };
    }
  }

  const users = readUsers();
  if (users.some(u => u.email === email)) {
    return { ok: false, error: "Ya existe una cuenta con ese correo electrónico." };
  }
  if (users.some(u => u.username.toLowerCase() === username.toLowerCase())) {
    return { ok: false, error: "Ese nombre de usuario ya está en uso." };
  }

  const newUser: EventraUser = {
    username,
    email,
    password: input.password,
    role: input.asCompany ? "company" : "user",
    createdAt: Date.now(),
    ...(input.asCompany && input.company
      ? {
          company: {
            name: input.company.name.trim(),
            phone: input.company.phone.trim(),
            wallet: input.company.wallet.trim(),
          },
        }
      : {}),
  };

  users.push(newUser);
  writeUsers(users);
  const session = toSession(newUser);
  setSession(session, false);
  return { ok: true, data: session };
};

export const loginUser = (identifier: string, password: string, remember: boolean): AuthResult<SessionUser> => {
  const id = identifier.trim().toLowerCase();
  if (!id) return { ok: false, error: "Introduce tu email o nombre de usuario." };
  if (!password) return { ok: false, error: "Introduce tu contraseña." };

  const users = readUsers();
  const user = users.find(u => u.email === id || u.username.toLowerCase() === id);
  if (!user || user.password !== password) {
    return { ok: false, error: "Credenciales incorrectas." };
  }

  const session = toSession(user);
  setSession(session, remember);
  return { ok: true, data: session };
};

export const setSession = (session: SessionUser, remember: boolean) => {
  if (!isBrowser()) return;
  localStorage.setItem(SESSION_KEY, JSON.stringify(session));
  if (remember) {
    localStorage.setItem(REMEMBER_KEY, "1");
  } else {
    localStorage.removeItem(REMEMBER_KEY);
  }
};

export const getSession = (): SessionUser | null => {
  if (!isBrowser()) return null;
  try {
    const raw = localStorage.getItem(SESSION_KEY);
    return raw ? (JSON.parse(raw) as SessionUser) : null;
  } catch {
    return null;
  }
};

export const logout = () => {
  if (!isBrowser()) return;
  localStorage.removeItem(SESSION_KEY);
  localStorage.removeItem(REMEMBER_KEY);
};
