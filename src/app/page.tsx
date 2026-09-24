export default function Home() {
  return (
    <main className="mx-auto flex min-h-screen max-w-2xl flex-col items-center justify-center gap-4 px-6 text-center">
      <h1 className="text-4xl font-bold tracking-tight">
        Roastly<span className="text-accent">.</span>
      </h1>
      <p className="text-lg text-white/70">
        Drop your URL. Get roasted. Fix it in 10 minutes.
      </p>
      <p className="mt-8 rounded-lg border border-border bg-surface px-4 py-2 text-sm text-white/50">
        Scaffolding OK — the roast form lands in Step 3.
      </p>
    </main>
  );
}
