import { useEffect, useRef } from 'react';
import { boom, whoosh } from '@/core/audio/sfx';

const COLORS = ['#F2B01E', '#FFD166', '#FFFFFF', '#FF6B35', '#EF476F', '#06D6A0', '#4CC9F0', '#C77DFF'];
const SHOW_MS = 9000;

interface Spark { x: number; y: number; vx: number; vy: number; life: number; decay: number; color: string; size: number }
interface Rocket { x: number; y: number; vx: number; vy: number; targetY: number; color: string }

/** A full-screen firework show on a canvas. It ignores the pointer and calls onDone when the last spark fades. */
export default function Fireworks({ onDone }: { onDone?: () => void }) {
  const ref = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = ref.current!;
    const ctx = canvas.getContext('2d')!;
    const dpr = Math.min(window.devicePixelRatio || 1, 2);
    let w = 0;
    let h = 0;
    const resize = () => {
      w = window.innerWidth;
      h = window.innerHeight;
      canvas.width = w * dpr;
      canvas.height = h * dpr;
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    };
    resize();
    window.addEventListener('resize', resize);

    const rockets: Rocket[] = [];
    const sparks: Spark[] = [];
    const rand = (a: number, b: number) => a + Math.random() * (b - a);
    const pick = () => COLORS[Math.floor(Math.random() * COLORS.length)];

    const launch = () => {
      rockets.push({ x: rand(w * 0.08, w * 0.92), y: h + 20, vx: rand(-0.6, 0.6), vy: -rand(h * 0.014, h * 0.019), targetY: rand(h * 0.12, h * 0.5), color: pick() });
      whoosh();
    };

    // A little rocket: nose, body, fins and a flickering flame, tilted along its path
    const drawRocket = (r: Rocket) => {
      ctx.save();
      ctx.translate(r.x, r.y);
      ctx.rotate(Math.atan2(r.vx, -r.vy));
      const flame = 14 + Math.random() * 10;
      const g = ctx.createLinearGradient(0, 8, 0, 8 + flame);
      g.addColorStop(0, '#FFF3B0');
      g.addColorStop(0.5, '#FF9F1C');
      g.addColorStop(1, 'rgba(255,60,0,0)');
      ctx.fillStyle = g;
      ctx.beginPath();
      ctx.moveTo(-3.5, 8);
      ctx.lineTo(0, 8 + flame);
      ctx.lineTo(3.5, 8);
      ctx.fill();
      ctx.fillStyle = r.color;
      ctx.beginPath();
      ctx.moveTo(-4, 8); ctx.lineTo(-9, 12); ctx.lineTo(-4, 1); // left fin
      ctx.moveTo(4, 8); ctx.lineTo(9, 12); ctx.lineTo(4, 1); // right fin
      ctx.fill();
      ctx.fillStyle = '#F5F5F5';
      ctx.beginPath();
      ctx.roundRect(-4, -8, 8, 16, 2);
      ctx.fill();
      ctx.fillStyle = r.color;
      ctx.beginPath();
      ctx.moveTo(-4, -8); ctx.quadraticCurveTo(0, -20, 4, -8);
      ctx.fill();
      ctx.fillStyle = '#4CC9F0';
      ctx.beginPath();
      ctx.arc(0, -2, 2, 0, Math.PI * 2);
      ctx.fill();
      ctx.restore();
    };

    const explode = (x: number, y: number, color: string) => {
      boom(rand(0.6, 1));
      const count = Math.round(rand(70, 120));
      const second = pick();
      const ring = Math.random() < 0.35;
      for (let i = 0; i < count; i++) {
        const a = (i / count) * Math.PI * 2;
        const speed = ring ? 5 : rand(1.5, 6.5);
        sparks.push({
          x, y, vx: Math.cos(a) * speed, vy: Math.sin(a) * speed,
          life: 1, decay: rand(0.008, 0.016), color: i % 3 === 0 ? second : color, size: rand(1.4, 2.8),
        });
      }
    };

    const start = performance.now();
    let last = start;
    let nextLaunch = 0;
    let raf = 0;
    let done = false;
    for (let i = 0; i < 6; i++) setTimeout(launch, i * 140);

    const frame = (now: number) => {
      const dt = Math.min((now - last) / 16.67, 3);
      last = now;
      const elapsed = now - start;
      if (elapsed < SHOW_MS && now >= nextLaunch) {
        const salvo = Math.random() < 0.3 ? 3 : 1;
        for (let i = 0; i < salvo; i++) launch();
        nextLaunch = now + rand(180, 420);
      }

      // Fade the previous frame so every spark leaves a short trail
      ctx.globalCompositeOperation = 'destination-out';
      ctx.fillStyle = 'rgba(0,0,0,0.22)';
      ctx.fillRect(0, 0, w, h);
      ctx.globalCompositeOperation = 'lighter';

      for (let i = rockets.length - 1; i >= 0; i--) {
        const r = rockets[i];
        r.x += r.vx * dt;
        r.y += r.vy * dt;
        r.vy *= 0.985;
        // Exhaust sparks left behind the rocket
        sparks.push({ x: r.x, y: r.y + 12, vx: rand(-0.5, 0.5), vy: rand(0.5, 1.8), life: 0.8, decay: rand(0.03, 0.05), color: '#FFB347', size: rand(1, 1.8) });
        ctx.globalCompositeOperation = 'source-over';
        drawRocket(r);
        ctx.globalCompositeOperation = 'lighter';
        if (r.y <= r.targetY || Math.abs(r.vy) < 1.2) {
          explode(r.x, r.y, r.color);
          rockets.splice(i, 1);
        }
      }
      for (let i = sparks.length - 1; i >= 0; i--) {
        const s = sparks[i];
        s.vx *= 0.985;
        s.vy = s.vy * 0.985 + 0.06 * dt;
        s.x += s.vx * dt;
        s.y += s.vy * dt;
        s.life -= s.decay * dt;
        if (s.life <= 0) { sparks.splice(i, 1); continue; }
        ctx.globalAlpha = s.life;
        ctx.fillStyle = s.color;
        ctx.beginPath();
        ctx.arc(s.x, s.y, s.size, 0, Math.PI * 2);
        ctx.fill();
      }
      ctx.globalAlpha = 1;

      if (elapsed >= SHOW_MS && !rockets.length && !sparks.length) {
        if (!done) { done = true; onDone?.(); }
        return;
      }
      raf = requestAnimationFrame(frame);
    };
    raf = requestAnimationFrame(frame);

    return () => {
      cancelAnimationFrame(raf);
      window.removeEventListener('resize', resize);
    };
  }, [onDone]);

  return <canvas ref={ref} aria-hidden className="pointer-events-none fixed inset-0 z-[9000] w-full h-full" />;
}
