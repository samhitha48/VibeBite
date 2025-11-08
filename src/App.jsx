const features = [
  {
    title: 'Curated Playlists',
    description: 'Fuel every gathering with playlists that match the mood and keep the vibes high.',
  },
  {
    title: 'Crowd-Sourced Favorites',
    description: 'Let your crew vote, request, and remix the soundtrack in real time.',
  },
  {
    title: 'Instant Ambience',
    description: 'Pair food, lighting, and music recommendations tuned for your venue.',
  },
];

export default function App() {
  return (
    <div>
      <main className="mx-auto flex max-w-4xl flex-col gap-12 px-6 py-16">
        <section className="space-y-6 text-center">
          <h1 className="text-4xl font-semibold md:text-5xl">
            Hello World!
          </h1>
          <p className="mx-auto max-w-2xl text-lg">
            This is VibeBite.
          </p>
        </section>
      </main>
    </div>
  );
}

