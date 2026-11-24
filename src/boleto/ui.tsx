import React from 'react';
import {AbsoluteFill, interpolate, useCurrentFrame} from 'remotion';
import {useEase} from '../components';
import {colors, fonts} from '../theme';

export const C = {
  bg: colors.dark,
  panel: '#141414',
  panel2: '#1C1C1C',
  line: '#2B2B2B',
  orange: colors.orange,
  light: colors.light,
  grey: '#8A8A8A',
  dim: '#555555',
};

export const clamp = {extrapolateLeft: 'clamp', extrapolateRight: 'clamp'} as const;

/** Fundo pontilhado que anda devagar (tipo canvas de automação). */
export const DotGrid: React.FC = () => {
  const f = useCurrentFrame();
  return (
    <AbsoluteFill
      style={{
        backgroundColor: C.bg,
        backgroundImage: 'radial-gradient(circle, #2A2A2A 2px, transparent 2.6px)',
        backgroundSize: '44px 44px',
        backgroundPosition: `${f * 0.35}px ${f * 0.2}px`,
      }}
    />
  );
};

/** Zoom lento de câmera durante a cena. */
export const Camera: React.FC<{dur: number; children: React.ReactNode}> = ({dur, children}) => {
  const f = useCurrentFrame();
  const s = interpolate(f, [0, dur], [1, 1.035], clamp);
  return <AbsoluteFill style={{transform: `scale(${s})`}}>{children}</AbsoluteFill>;
};

export const Scene: React.FC<{dur: number; children: React.ReactNode}> = ({dur, children}) => (
  <AbsoluteFill>
    <DotGrid />
    <Camera dur={dur}>{children}</Camera>
  </AbsoluteFill>
);

/* ---------- ícones ---------- */
export const TaskIcon: React.FC<{c?: string; s?: number}> = ({c = C.light, s = 64}) => (
  <svg width={s} height={s} viewBox="0 0 24 24" fill="none" stroke={c} strokeWidth={2} strokeLinecap="round" strokeLinejoin="round">
    <rect x="3" y="3" width="18" height="18" rx="4" />
    <path d="M8 12.5l2.7 2.7L16.5 9" />
  </svg>
);
export const FlowIcon: React.FC<{c?: string; s?: number}> = ({c = C.light, s = 64}) => (
  <svg width={s} height={s} viewBox="0 0 24 24" fill="none" stroke={c} strokeWidth={2} strokeLinecap="round">
    <circle cx="5" cy="12" r="2.6" />
    <circle cx="19" cy="6" r="2.6" />
    <circle cx="19" cy="18" r="2.6" />
    <path d="M7.6 12h3.4c1.5 0 2-1 2.6-2.6S15 6 16.4 6M11 12c1.5 0 2 1 2.6 2.6S15 18 16.4 18" />
  </svg>
);
export const ChatIcon: React.FC<{c?: string; s?: number}> = ({c = C.light, s = 64}) => (
  <svg width={s} height={s} viewBox="0 0 24 24" fill="none" stroke={c} strokeWidth={2} strokeLinecap="round" strokeLinejoin="round">
    <path d="M20 12a8 8 0 0 1-11.6 7.1L4 20l1-4.1A8 8 0 1 1 20 12z" />
    <path d="M9 10.5h6M9 13.5h4" />
  </svg>
);
export const FileIcon: React.FC<{c?: string; s?: number}> = ({c = C.light, s = 40}) => (
  <svg width={s} height={s} viewBox="0 0 24 24" fill="none" stroke={c} strokeWidth={2} strokeLinecap="round" strokeLinejoin="round">
    <path d="M14 3H7a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h10a2 2 0 0 0 2-2V8z" />
    <path d="M14 3v5h5M9 13h6M9 17h4" />
  </svg>
);
export const Check: React.FC<{s?: number; on: number}> = ({s = 44, on}) => (
  <svg width={s} height={s} viewBox="0 0 24 24">
    <circle cx="12" cy="12" r="11" fill={on > 0 ? C.light : 'none'} stroke={on > 0 ? C.light : C.dim} strokeWidth={2} />
    <path d="M7 12.4l3.2 3.2L17 8.8" stroke={C.bg} strokeWidth={2.6} fill="none" strokeLinecap="round" strokeLinejoin="round"
      pathLength={1} strokeDasharray={1} strokeDashoffset={1 - on} />
  </svg>
);
export const Cross: React.FC<{s?: number; on: number}> = ({s = 44, on}) => (
  <svg width={s} height={s} viewBox="0 0 24 24" style={{transform: `scale(${0.6 + 0.4 * on})`}}>
    <circle cx="12" cy="12" r="11" fill={C.orange} opacity={on} />
    <path d="M8 8l8 8M16 8l-8 8" stroke={C.bg} strokeWidth={2.8} strokeLinecap="round" opacity={on} />
  </svg>
);

/* ---------- blocos de fluxo ---------- */
export const Node: React.FC<{
  x: number; y: number; w?: number; h?: number; delay: number;
  icon?: React.ReactNode; title: string; sub?: string; active?: boolean; row?: boolean;
}> = ({x, y, w = 240, h = 240, delay, icon, title, sub, active, row}) => {
  const p = useEase(delay, 18);
  return (
    <div
      style={{
        position: 'absolute', left: x - w / 2, top: y - h / 2, width: w, height: h, borderRadius: 30,
        background: C.panel, border: `3px solid ${active ? C.orange : C.line}`, boxSizing: 'border-box',
        display: 'flex', flexDirection: row ? 'row' : 'column', alignItems: 'center', justifyContent: 'center', gap: row ? 22 : 14,
        opacity: interpolate(p, [0, 0.3], [0, 1], clamp), transform: `scale(${0.85 + 0.15 * p})`,
      }}
    >
      {icon}
      <div style={{textAlign: row ? 'left' : 'center'}}>
        <div style={{fontFamily: fonts.display, fontWeight: 900, fontSize: 40, color: C.light, lineHeight: 1}}>{title}</div>
        {sub && <div style={{fontFamily: fonts.body, fontWeight: 600, fontSize: 22, color: C.grey, marginTop: 6}}>{sub}</div>}
      </div>
    </div>
  );
};

type Pt = {x: number; y: number};
const bez = (p0: Pt, c1: Pt, c2: Pt, p1: Pt, t: number): Pt => {
  const u = 1 - t;
  return {
    x: u * u * u * p0.x + 3 * u * u * t * c1.x + 3 * u * t * t * c2.x + t * t * t * p1.x,
    y: u * u * u * p0.y + 3 * u * u * t * c1.y + 3 * u * t * t * c2.y + t * t * t * p1.y,
  };
};

/** Fio que se desenha + pacote de dados correndo por ele. */
export const Wire: React.FC<{from: Pt; to: Pt; delay: number; vertical?: boolean; period?: number; packets?: boolean}> = ({
  from, to, delay, vertical, period = 40, packets = true,
}) => {
  const f = useCurrentFrame();
  const draw = useEase(delay, 16);
  const c1 = vertical ? {x: from.x, y: (from.y + to.y) / 2} : {x: (from.x + to.x) / 2, y: from.y};
  const c2 = vertical ? {x: to.x, y: (from.y + to.y) / 2} : {x: (from.x + to.x) / 2, y: to.y};
  const d = `M${from.x},${from.y} C${c1.x},${c1.y} ${c2.x},${c2.y} ${to.x},${to.y}`;
  const t0 = f - delay - 16;
  const dots = [];
  if (packets && t0 > 0) {
    const t = (t0 % period) / period;
    for (let k = 0; k < 5; k++) {
      const tt = t - k * 0.035;
      if (tt < 0) continue;
      const pt = bez(from, c1, c2, to, tt);
      dots.push(<circle key={k} cx={pt.x} cy={pt.y} r={k === 0 ? 10 : 8 - k} fill={C.orange} opacity={1 - k * 0.2} />);
    }
  }
  return (
    <svg style={{position: 'absolute', inset: 0, width: '100%', height: '100%', overflow: 'visible'}}>
      <path d={d} stroke={C.line} strokeWidth={5} fill="none" pathLength={1} strokeDasharray={1} strokeDashoffset={1 - draw} />
      <path d={d} stroke={C.orange} strokeWidth={3} fill="none" opacity={0.5} pathLength={1} strokeDasharray="0.02 0.04"
        strokeDashoffset={-f * 0.004} style={{opacity: draw * 0.5}} />
      {dots}
    </svg>
  );
};

/** Texto sendo digitado, com cursor. */
export const Typing: React.FC<{text: string; delay: number; speed?: number; caret?: boolean; style?: React.CSSProperties}> = ({
  text, delay, speed = 1.2, caret = true, style,
}) => {
  const f = useCurrentFrame();
  const n = Math.floor(interpolate(f, [delay, delay + text.length * speed], [0, text.length], clamp));
  const typing = f >= delay && n < text.length;
  const blink = Math.floor(f / 8) % 2 === 0;
  return (
    <span style={style}>
      {text.slice(0, n)}
      {caret && (typing || (f >= delay && blink && f < delay + text.length * speed + 30)) && (
        <span style={{display: 'inline-block', width: 3, height: '1em', background: C.orange, marginLeft: 3, verticalAlign: '-0.12em'}} />
      )}
    </span>
  );
};

/** Balão de mensagem. */
export const Bubble: React.FC<{delay: number; children: React.ReactNode; style?: React.CSSProperties}> = ({delay, children, style}) => {
  const p = useEase(delay, 14);
  return (
    <div
      style={{
        background: C.panel2, borderRadius: '24px 24px 24px 8px', padding: '20px 24px', color: C.light,
        fontFamily: fonts.body, fontWeight: 500, fontSize: 28, lineHeight: 1.35,
        opacity: interpolate(p, [0, 0.3], [0, 1], clamp), transform: `translateY(${(1 - p) * 30}px) scale(${0.94 + 0.06 * p})`,
        transformOrigin: 'left bottom', ...style,
      }}
    >
      {children}
    </div>
  );
};

export const Pill: React.FC<{children: React.ReactNode; solid?: boolean; style?: React.CSSProperties}> = ({children, solid, style}) => (
  <span
    style={{
      display: 'inline-block', padding: '6px 16px', borderRadius: 999, fontFamily: fonts.display, fontWeight: 800, fontSize: 26,
      letterSpacing: '0.08em', background: solid ? C.orange : 'transparent', color: solid ? C.bg : C.orange,
      border: `2px solid ${C.orange}`, ...style,
    }}
  >
    {children}
  </span>
);
