// Edge-faded auto-scroll strip (kt.css `.kt-marquee` + `@keyframes kt-slide`).
// test-project's kt.js duplicates the track's innerHTML at runtime so the
// `translateX(-50%)` loop is seamless; rendering the items array twice here
// achieves the same result without a DOM-mutation pass.
export function KtMarquee({ items, label }: { items: string[]; label: string }) {
  return (
    <section className="kt-marquee kt-u-fade-x" aria-label={label}>
      <div className="kt-marquee-track" aria-hidden="true">
        {[...items, ...items].map((s, i) => (
          <span key={i}>{s}</span>
        ))}
      </div>
    </section>
  );
}
