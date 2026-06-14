// A festive, looping band of World Cup emoji — pure decoration, hover to pause.
const PARADE = [
  "⚽", "🏆", "🥅", "🎉", "🎺", "🔥", "🌎", "🙌", "🥇", "📣",
  "🇺🇸", "🇨🇦", "🇲🇽", "🫎", "🐆", "🦅",
];

export default function EmojiParade() {
  // duplicated once so the -50% translate loops seamlessly
  const row = [...PARADE, ...PARADE];
  return (
    <div
      aria-hidden
      className="marquee-track relative overflow-hidden rounded-full border border-line bg-ink-soft/60 py-2.5"
    >
      <div className="pointer-events-none absolute inset-y-0 left-0 z-10 w-12 bg-gradient-to-r from-ink to-transparent" />
      <div className="pointer-events-none absolute inset-y-0 right-0 z-10 w-12 bg-gradient-to-l from-ink to-transparent" />
      <ul className="animate-parade flex w-max items-center text-2xl">
        {/* trailing padding per item (incl. last of each copy) keeps the -50% loop seamless */}
        {row.map((e, i) => (
          <li key={i} className="pr-7 leading-none">
            {e}
          </li>
        ))}
      </ul>
    </div>
  );
}
