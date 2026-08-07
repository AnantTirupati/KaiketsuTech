export default function Marquee({ items }: { items: string[] }) {
  const loop = [...items, ...items];
  return (
    <div className="overflow-hidden border-y border-marketing-border py-4">
      <div className="flex w-max animate-marketing-marquee gap-10 font-marketing-mono text-sm uppercase tracking-[0.14em] text-marketing-muted-dim">
        {loop.map((item, i) => (
          <span key={i} className="flex items-center gap-10">
            {item}
            <span className="text-marketing-accent">/</span>
          </span>
        ))}
      </div>
    </div>
  );
}
