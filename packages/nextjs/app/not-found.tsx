import Link from "next/link";

export default function NotFound() {
  return (
    <div className="flex flex-1 items-center justify-center bg-[#f5f6f8]">
      <div className="text-center">
        <h1 className="m-0 mb-1 text-6xl font-bold text-[#131a2b]">404</h1>
        <h2 className="m-0 text-2xl font-semibold text-[#131a2b]">Página no encontrada</h2>
        <p className="m-0 mb-4 text-[#6b7280]">La página que buscas no existe.</p>
        <Link
          href="/"
          className="inline-block rounded-full bg-[#2bb3ec] px-6 py-2.5 font-semibold text-white shadow-md transition hover:bg-[#1ba5dd]"
        >
          Volver al inicio
        </Link>
      </div>
    </div>
  );
}
