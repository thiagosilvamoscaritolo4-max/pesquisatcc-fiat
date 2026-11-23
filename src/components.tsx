import React from 'react';
import {interpolate, spring, useCurrentFrame, useVideoConfig, Easing} from 'remotion';
import {colors, fonts} from './theme';

type SpringCfg = {damping?: number; stiffness?: number; mass?: number};

export const useSp = (delay: number, config: SpringCfg = {}) => {
  const frame = useCurrentFrame();
  const {fps} = useVideoConfig();
  return spring({frame: frame - delay, fps, config: {damping: 200, ...config}});
};

/** Text line that rises from behind a mask. */
export const Reveal: React.FC<{delay: number; children: React.ReactNode; style?: React.CSSProperties}> = ({
  delay,
  children,
  style,
}) => {
  const p = useSp(delay, {damping: 15, stiffness: 110, mass: 0.9});
  return (
    <div style={{overflow: 'hidden', whiteSpace: 'nowrap', paddingTop: 6, paddingBottom: 6, marginTop: -6, marginBottom: -6, ...style}}>
      <div style={{transform: `translateY(${(1 - p) * 115}%) skewY(${(1 - p) * 7}deg)`, transformOrigin: 'left bottom'}}>
        {children}
      </div>
    </div>
  );
};

/** Box that wipes in from the left, then text rises inside it. */
export const Highlight: React.FC<{
  delay: number;
  bg: string;
  color: string;
  children: React.ReactNode;
  padX?: number;
}> = ({delay, bg, color, children, padX = 12}) => {
  const box = useSp(delay, {damping: 22, stiffness: 160});
  const txt = useSp(delay + 6, {damping: 14, stiffness: 120});
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
        <div style={{transform: `translateY(${(1 - txt) * 115}%)`}}>{children}</div>
      </div>
    </div>
  );
};

/** Letter-spaced eyebrow label, letters typed in. */
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
        const t = frame - delay - i * 1.2;
        const o = interpolate(t, [0, 6], [0, 1], {extrapolateLeft: 'clamp', extrapolateRight: 'clamp'});
        const y = interpolate(t, [0, 8], [14, 0], {
          extrapolateLeft: 'clamp',
          extrapolateRight: 'clamp',
          easing: Easing.out(Easing.cubic),
        });
        return (
          <span key={i} style={{opacity: o, transform: `translateY(${y}px)`, display: 'inline-block'}}>
            {ch}
          </span>
        );
      })}
    </div>
  );
};

/** Body copy, word by word with blur. */
export const Words: React.FC<{text: string; delay: number; style?: React.CSSProperties; stagger?: number}> = ({
  text,
  delay,
  style,
  stagger = 1.6,
}) => {
  const frame = useCurrentFrame();
  return (
    <div style={style}>
      {text.split(' ').map((w, i) => {
        const t = frame - delay - i * stagger;
        const o = interpolate(t, [0, 8], [0, 1], {extrapolateLeft: 'clamp', extrapolateRight: 'clamp'});
        const y = interpolate(t, [0, 10], [18, 0], {
          extrapolateLeft: 'clamp',
          extrapolateRight: 'clamp',
          easing: Easing.out(Easing.cubic),
        });
        const b = interpolate(t, [0, 8], [8, 0], {extrapolateLeft: 'clamp', extrapolateRight: 'clamp'});
        return (
          <span
            key={i}
            style={{display: 'inline-block', opacity: o, transform: `translateY(${y}px)`, filter: `blur(${b}px)`}}
          >
            {w}
            {' '}
          </span>
        );
      })}
    </div>
  );
};

/** Element that slides + fades in. */
export const Enter: React.FC<{
  delay: number;
  from?: 'up' | 'left' | 'right' | 'scale';
  distance?: number;
  children: React.ReactNode;
  style?: React.CSSProperties;
}> = ({delay, from = 'up', distance = 80, children, style}) => {
  const p = useSp(delay, {damping: 17, stiffness: 120});
  const o = interpolate(p, [0, 0.4], [0, 1], {extrapolateRight: 'clamp'});
  let transform = '';
  if (from === 'up') transform = `translateY(${(1 - p) * distance}px)`;
  if (from === 'left') transform = `translateX(${-(1 - p) * distance}px)`;
  if (from === 'right') transform = `translateX(${(1 - p) * distance}px)`;
  if (from === 'scale') transform = `scale(${0.6 + 0.4 * p})`;
  return <div style={{opacity: o, transform, ...style}}>{children}</div>;
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
  children: React.ReactNode;
}> = ({index, bg, fg, muted, accent, cta, arrow = true, children}) => {
  const frame = useCurrentFrame();
  const head = useSp(2);
  const foot = useSp(24);
  const arrowX = arrow ? Math.max(0, Math.sin((frame - 30) / 5)) * 10 : 0;
  // subtle drifting glow
  const gx = 50 + Math.sin(frame / 60) * 20;
  const gy = 40 + Math.cos(frame / 75) * 15;
  const glow =
    bg === colors.dark
      ? `radial-gradient(circle at ${gx}% ${gy}%, rgba(255,106,19,0.10), rgba(0,0,0,0) 55%)`
      : `radial-gradient(circle at ${gx}% ${gy}%, rgba(255,160,80,0.35), rgba(0,0,0,0) 60%)`;
  return (
    <div style={{position: 'absolute', inset: 0, background: bg, overflow: 'hidden'}}>
      <div style={{position: 'absolute', inset: 0, background: glow}} />
      {/* header */}
      <div
        style={{
          position: 'absolute',
          top: 70,
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
        <div style={{fontFamily: fonts.display, fontWeight: 700, fontSize: 30, color: muted, letterSpacing: '0.02em'}}>
          {String(index).padStart(2, '0')} / 04
        </div>
      </div>
      {/* content */}
      <div style={{position: 'absolute', top: 168, left: 80, right: 80}}>{children}</div>
      {/* footer */}
      <div
        style={{
          position: 'absolute',
          bottom: 62,
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
        <div style={{color: accent, display: 'flex', alignItems: 'center', gap: 14}}>
          {cta}
          {arrow && <span style={{transform: `translateX(${arrowX}px)`, letterSpacing: 0}}>⟶</span>}
        </div>
      </div>
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
