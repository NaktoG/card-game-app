export function LoadingState({ label }: { label: string }) {
  return (
    <div
      className="flex items-center justify-center gap-3 rounded-[2rem] border border-lime-300/20 bg-lime-300/10 p-6 text-lime-100"
      role="status"
      aria-busy="true"
      aria-live="polite"
    >
      <span className="h-3 w-3 animate-ping rounded-full bg-lime-300" aria-hidden="true" />
      <span className="text-sm font-bold uppercase tracking-[0.25em]">{label}</span>
    </div>
  );
}
