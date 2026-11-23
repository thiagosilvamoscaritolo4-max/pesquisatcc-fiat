import React from 'react';
import {interpolate, spring, useCurrentFrame, useVideoConfig, Easing} from 'remotion';

export const useIsReels = () => useVideoConfig().height > 1500;
import {colors, fonts} from './theme';

type SpringCfg = {damping?: number; stiffness?: number; mass?: number};

export const useSp = (delay: number, config: SpringCfg = {}) => {
  const frame = useCurrentFrame();
  const {fps} = useVideoConfig();
  return spring({frame: frame - delay, fps, config: {damping: 200, ...config}});
};

export const EXPO = Easing.bezier(0.16, 1, 0.3, 1);

/** 0→1 com easing editorial (rápido no início, assenta suave). */
export const useEase = (delay: number, dur = 16) => {
  const frame = useCurrentFrame();
  return interpolate(frame, [delay, delay + dur], [0, 1], {extrapolateLeft: 'clamp', extrapolateRight: 'clamp', easing: EXPO});
};

/** Linha de título que sobe por trás de uma máscara. */
export const Reveal: React.FC<{delay: number; children: React.ReactNode; style?: React.CSSProperties}> = ({
  delay,
  children,
  style,
}) => {
  const p = useEase(delay, 18);
  return (
    <div style={{overflow: 'hidden', whiteSpace: 'nowrap', paddingTop: 6, paddingBottom: 14, marginTop: -6, marginBottom: -14, ...style}}>
      <div style={{transform: `translateY(${(1 - p) * 105}%)`}}>{children}</div>
    </div>
  );
};

/** Caixa que varre da esquerda; depois o texto sobe dentro dela. */
export const Highlight: React.FC<{
  delay: number;
  bg: string;
  color: string;
  children: React.ReactNode;
  padX?: number;
}> = ({delay, bg, color, children, padX = 12}) => {
  const box = useEase(delay, 14);
  const txt = useEase(delay + 5, 16);
  return (
    <div style={{position: 'relative', display: 'inline-block', padding: `10px ${padX}px 0`}}>
      <div
        style={{
          position: 'absolute',
          inset: 0,
          background: bg,
          borderRadius: 7,
          transform: `scaleX(${box})`,
          transformOrigin: 'left center',
        }}
      />
      <div style={{position: 'relative', overflow: 'hidden', color}}>
        <div style={{transform: `translateY(${(1 - txt) * 105}%)`}}>{children}</div>
      </div>
    </div>
  );
};

/** Rastro na palavra-chave: traço que corre por baixo (ou risca) no momento em que é falada. */
export const Mark: React.FC<{
  at: number;
  color: string;
  kind?: 'under' | 'strike';
  thickness?: number;
  children: React.ReactNode;
}> = ({at, color, kind = 'under', thickness, children}) => {
  const p = useEase(at, 12);
  const strike = kind === 'strike';
  const h = thickness ?? (strike ? 5 : 7);
  return (
    <span style={{position: 'relative', display: 'inline-block', opacity: strike ? 1 - 0.45 * p : 1}}>
      {children}
      <span
        style={{
          position: 'absolute',
          left: -3,
          right: -3,
          height: h,
          bottom: strike ? '42%' : -h * 0.6,
          background: color,
          borderRadius: 1,
          transform: `scaleX(${p})`,
          transformOrigin: 'left center',
        }}
      />
    </span>
  );
};

/** Rótulo espaçado, letras entrando em sequência. */
export const Label: React.FC<{text: string; delay: number; color: string; size?: number}> = ({
  text,
  delay,
  color,
  size = 31,
}) => {
  const frame = useCurrentFrame();
  return (
    <div
      style={{
        fontFamily: fonts.display,
        fontWeight: 700,
        fontSize: size,
        letterSpacing: '0.17em',
        color,
        display: 'flex',
        whiteSpace: 'pre',
      }}
    >
      {text.split('').map((ch, i) => {
        const t = frame - delay - i * 1;
        const o = t >= 0 ? 1 : 0;
        return (
          <span key={i} style={{opacity: o, display: 'inline-block'}}>
            {ch}
          </span>
        );
      })}
    </div>
  );
};

export type Part = string | {t: string; at: number; kind?: 'under' | 'strike'};

/** Texto corrido: cada palavra sobe por trás de máscara; trechos marcados ganham rastro. */
export const Para: React.FC<{
  parts: Part[];
  delay: number;
  mark: string;
  style?: React.CSSProperties;
  stagger?: number;
}> = ({parts, delay, mark, style, stagger = 1}) => {
  const frame = useCurrentFrame();
  const units: {node: React.ReactNode; key: string}[] = [];
  parts.forEach((part, pi) => {
    if (typeof part === 'string') {
      part.split(' ').filter(Boolean).forEach((w, wi) => units.push({node: w, key: `${pi}-${wi}`}));
    } else {
      units.push({
        node: (
          <Mark at={part.at} color={mark} kind={part.kind}>
            {part.t}
          </Mark>
        ),
        key: `${pi}-m`,
      });
    }
  });
  return (
    <div style={style}>
      {units.map((u, i) => {
        const p = interpolate(frame - delay - i * stagger, [0, 14], [0, 1], {
          extrapolateLeft: 'clamp',
          extrapolateRight: 'clamp',
          easing: EXPO,
        });
        return (
          <span key={u.key} style={{display: 'inline-block', overflow: 'hidden', verticalAlign: 'top', paddingBottom: 8, marginBottom: -8}}>
            <span style={{display: 'inline-block', transform: `translateY(${(1 - p) * 105}%)`}}>
              {u.node}
              {'\u00A0'}
            </span>
          </span>
        );
      })}
    </div>
  );
};

/** Elemento que entra deslizando. */
export const Enter: React.FC<{
  delay: number;
  from?: 'up' | 'left' | 'right' | 'scale';
  distance?: number;
  children: React.ReactNode;
  style?: React.CSSProperties;
}> = ({delay, from = 'up', distance = 80, children, style}) => {
  const p = useEase(delay, 18);
  const o = interpolate(p, [0, 0.25], [0, 1], {extrapolateRight: 'clamp'});
  let transform = '';
  if (from === 'up') transform = `translateY(${(1 - p) * distance}px)`;
  if (from === 'left') transform = `translateX(${-(1 - p) * distance}px)`;
  if (from === 'right') transform = `translateX(${(1 - p) * distance}px)`;
  if (from === 'scale') transform = `scale(${0.92 + 0.08 * p})`;
  return <div style={{opacity: o, transform, ...style}}>{children}</div>;
};

/** Grão de filme sutil (tira o aspecto "digital limpo demais"). */
export const Grain: React.FC<{opacity?: number}> = ({opacity = 0.07}) => {
  const frame = useCurrentFrame();
  const seed = Math.floor(frame / 2) % 50;
  return (
    <svg style={{position: 'absolute', inset: 0, width: '100%', height: '100%', opacity, mixBlendMode: 'overlay', pointerEvents: 'none'}}>
      <filter id={`g${seed}`}>
        <feTurbulence type="fractalNoise" baseFrequency="0.9" numOctaves="2" seed={seed} stitchTiles="stitch" />
        <feColorMatrix type="saturate" values="0" />
      </filter>
      <rect width="100%" height="100%" filter={`url(#g${seed})`} />
    </svg>
  );
};

/** Slide chrome: logo, counter, hashtag and CTA. */
export const Frame: React.FC<{
  index: number;
  bg: string;
  fg: string;
  muted: string;
  accent: string;
  cta: string;
  arrow?: boolean;
  showCounter?: boolean;
  ctaPulseAt?: number;
  children: React.ReactNode;
}> = ({index, bg, fg, muted, accent, cta, arrow = true, showCounter = true, ctaPulseAt, children}) => {
  const frame = useCurrentFrame();
  const reels = useIsReels();
  // Reels: respeita as áreas cobertas pela interface do Instagram
  const L = reels ? {head: 270, content: 460, foot: 390} : {head: 70, content: 168, foot: 62};
  const showCta = !reels || !arrow;
  const head = useEase(0, 14);
  const bump = useSp(ctaPulseAt ?? 99999, {damping: 8, stiffness: 180});
  const ctaScale = ctaPulseAt !== undefined && frame >= ctaPulseAt ? 1 + 0.18 * Math.sin(Math.min(bump, 1) * Math.PI) + 0.04 * bump : 1;
  const foot = useEase(10, 14);
  const arrowX = arrow ? Math.max(0, Math.sin((frame - 30) / 5)) * 10 : 0;
  return (
    <div style={{position: 'absolute', inset: 0, background: bg, overflow: 'hidden'}}>
      {/* header */}
      <div
        style={{
          position: 'absolute',
          top: L.head,
          left: 80,
          right: 80,
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          opacity: head,
          transform: `translateY(${(1 - head) * -20}px)`,
        }}
      >
        <div style={{fontFamily: fonts.display, fontWeight: 900, fontSize: 32, color: fg, letterSpacing: '-0.02em'}}>
          ts<sup style={{fontSize: 20, fontWeight: 700}}>↗</sup>
        </div>
        <div style={{fontFamily: fonts.display, fontWeight: 700, fontSize: 30, color: muted, letterSpacing: '0.02em', opacity: showCounter ? 1 : 0}}>
          {String(index).padStart(2, '0')} / 04
        </div>
      </div>
      {/* content */}
      <div style={{position: 'absolute', top: L.content, left: 80, right: 80}}>{children}</div>
      {/* footer */}
      <div
        style={{
          position: 'absolute',
          bottom: L.foot,
          left: 80,
          right: 80,
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          fontFamily: fonts.display,
          fontWeight: 700,
          fontSize: 31,
          letterSpacing: '0.17em',
          opacity: foot,
          transform: `translateY(${(1 - foot) * 20}px)`,
        }}
      >
        <div style={{color: muted}}>#LEADS</div>
        <div style={{color: accent, display: showCta ? 'flex' : 'none', alignItems: 'center', gap: 14, transform: `scale(${ctaScale})`, transformOrigin: 'right center'}}>
          {cta}
          {arrow && <span style={{transform: `translateX(${arrowX}px)`, letterSpacing: 0}}>⟶</span>}
        </div>
      </div>
      <Grain opacity={bg === colors.dark ? 0.1 : 0.14} />
    </div>
  );
};

export const headline: React.CSSProperties = {
  fontFamily: fonts.display,
  fontWeight: 900,
  fontSize: 134,
  lineHeight: 0.9,
  letterSpacing: '-0.005em',
  textTransform: 'uppercase',
};
