import { useEffect, useRef } from "react";
import gsap from "gsap";
import { Flame } from "lucide-react";

const items = [
  "Whey Protein", "Creatina", "BCAA", "Pré-Treino", "Vitaminas",
  "Halteres", "Yoga", "Resistência", "Massageador", "Aromaterapia",
  "Hidratação", "Performance", "Recuperação", "Bem-estar", "Energia",
];

export const MarqueeTicker = () => {
  const trackRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const track = trackRef.current;
    if (!track) return;

    const totalWidth = track.scrollWidth / 2;
    const tween = gsap.to(track, {
      x: -totalWidth,
      duration: 25,
      ease: "none",
      repeat: -1,
    });

    return () => { tween.kill(); };
  }, []);

  const doubled = [...items, ...items];

  return (
    <div className="py-4 overflow-hidden border-y border-border/20 bg-primary/5 backdrop-blur-sm">
      <div ref={trackRef} className="flex gap-8 whitespace-nowrap w-max">
        {doubled.map((item, i) => (
          <span
            key={i}
            className="flex items-center gap-2 text-sm font-semibold text-primary/80 uppercase tracking-widest"
          >
            <Flame className="h-3.5 w-3.5 flex-shrink-0" />
            {item}
          </span>
        ))}
      </div>
    </div>
  );
};
