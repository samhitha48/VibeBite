import Button from "./components/Button/Button";
import Randomizer from "./components/Randomizer/Randomizer";

const features = [
  {
    title: "Curated Playlists",
    description:
      "Fuel every gathering with playlists that match the mood and keep the vibes high.",
  },
  {
    title: "Crowd-Sourced Favorites",
    description:
      "Let your crew vote, request, and remix the soundtrack in real time.",
  },
  {
    title: "Instant Ambience",
    description:
      "Pair food, lighting, and music recommendations tuned for your venue.",
  },
];

export default function App() {
  const date = new Date();
  const currentYear = date.getFullYear();
  return (
    <main className="grid grid-cols-12 gap-6 mx-auto max-w-[1440px] bg-white h-screen flex-col gap-12 rounded-lg shadow-md">
      <section className="col-span-full flex flex-col text-center h-full">
        <header className="flex justify-between items-between px-6 py-6 bg-primary-500 border-solid border-b-[8px] border-accent-brown">
          <p>Logo here</p>
        </header>
        <div className="flex-1 space-y-6 text-center py-6">
        <div id="buttons-container" className="flex gap-4 justify-center">
          <Button text="I'll pick what I want" />
          <Randomizer />    
        </div>
          <p className="mx-auto max-w-2xl text-lg">This is VibeBite.</p>
        </div>
        <footer className="flex justify-center py-4">
          &copy; {currentYear} VibeBite
        </footer>
      </section>
    </main>
  );
}
