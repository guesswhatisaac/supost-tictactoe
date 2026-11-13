export default function Home() {
  return (
    <main className="flex min-h-svh items-center justify-center px-6 py-12">
      <section aria-labelledby="game-title" className="w-full max-w-xl border border-border bg-card p-8 sm:p-12">
        <p className="text-sm font-medium uppercase tracking-[0.2em] text-primary">
          Local two-player
        </p>
        <h1 id="game-title" className="mt-4 text-4xl font-bold tracking-tight sm:text-6xl">
          Tic-Tac-Toe
        </h1>
        <p className="mt-6 leading-relaxed text-muted-foreground">
          The game is under construction.
        </p>
      </section>
    </main>
  );
}
