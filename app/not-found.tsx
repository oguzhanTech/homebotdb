import Link from "next/link";

export default function NotFound() {
  return (
    <main className="flex min-h-[60vh] flex-col items-center justify-center px-6 text-center">
      <div className="text-[11px] font-bold uppercase tracking-[0.14em] text-muted">
        404
      </div>
      <h1 className="mt-2 text-3xl font-medium tracking-tight">Unit not found</h1>
      <p className="mt-3 max-w-md text-sm text-[#565f6b]">
        This robot or page does not exist in the database.
      </p>
      <Link
        href="/"
        className="mt-6 rounded-xl bg-ink px-6 py-3 text-xs font-bold uppercase tracking-widest text-white"
      >
        Back to matrix
      </Link>
    </main>
  );
}
