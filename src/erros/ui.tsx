import React from 'react';
import {Easing, interpolate, useCurrentFrame} from 'remotion';
import {colors, fonts} from '../theme';

export const INTER = "'Inter', sans-serif";
export const AM = {
  bg: '#0E0E0F', win: '#141518', row: '#18191D', rowAlt: '#1B1C21', line: '#2A2B31', text: '#ECECEC', grey: '#8B8D96', dim: '#5C5E66',
  orange: colors.orange, dark: colors.dark, green: '#3FB950', amber: '#E3A008', red: '#E5484D',
};
export const clamp = {extrapolateLeft: 'clamp', extrapolateRight: 'clamp'} as const;
export const EXPO = Easing.bezier(0.16, 1, 0.3, 1);
export const ease = (f: number, a: number, d = 12) => interpolate(f, [a, a + d], [0, 1], {...clamp, easing: EXPO});
export const brl = (v: number) => v.toLocaleString('pt-BR', {style: 'currency', currency: 'BRL'});

/** Caminho suave por pontos [frame, x, y]. */
export const pathAt = (keys: [number, number, number][], f: number) => {
  if (f <= keys[0][0]) return {x: keys[0][1], y: keys[0][2]};
  for (let i = 0; i < keys.length - 1; i++) {
    const a = keys[i];
    const b = keys[i + 1];
    if (f >= a[0] && f <= b[0]) {
      const e = Easing.inOut(Easing.cubic)((f - a[0]) / Math.max(1, b[0] - a[0]));
      return {x: a[1] + (b[1] - a[1]) * e, y: a[2] + (b[2] - a[2]) * e};
    }
  }
  const l = keys[keys.length - 1];
  return {x: l[1], y: l[2]};
};

export const Mini: React.FC<{kind: 'check' | 'x' | 'alert'; color: string; size?: number}> = ({kind, color, size = 24}) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth={3} strokeLinecap="round" strokeLinejoin="round">
    {kind === 'check' && <path d="M5 12.5l4.5 4.5L19 7.5" />}
    {kind === 'x' && <path d="M6 6l12 12M18 6L6 18" />}
    {kind === 'alert' && <><path d="M12 3L2 21h20z" /><path d="M12 10v5M12 18v.5" /></>}
  </svg>
);

export const WIN = {x: 40, y: 270, w: 1000, h: 900};

export const StatusPill: React.FC<{kind: 'learn' | 'limited' | 'active' | 'off'; label?: string}> = ({kind, label}) => {
  const f = useCurrentFrame();
  const c = kind === 'active' ? AM.green : kind === 'limited' ? AM.amber : kind === 'off' ? AM.dim : AM.grey;
  const txt = label ?? (kind === 'active' ? 'Ativo' : kind === 'limited' ? 'Aprendizado limitado' : kind === 'off' ? 'Desativado' : 'Em aprendizado');
  return (
    <span style={{display: 'inline-flex', alignItems: 'center', gap: 10, fontFamily: INTER, fontWeight: 600, fontSize: 21, color: kind === 'learn' ? AM.text : c}}>
      {kind === 'learn' ? (
        <svg width={20} height={20} style={{transform: `rotate(${f * 12}deg)`}}><circle cx={10} cy={10} r={8} stroke={AM.grey} strokeWidth={3} fill="none" strokeDasharray="30 60" strokeLinecap="round" /></svg>
      ) : (
        <span style={{width: 12, height: 12, borderRadius: 6, background: c}} />
      )}
      {txt}
    </span>
  );
};

export const Toggle: React.FC<{on: boolean}> = ({on}) => (
  <span style={{display: 'inline-block', width: 46, height: 26, borderRadius: 13, background: on ? AM.orange : '#3A3B42', position: 'relative'}}>
    <span style={{position: 'absolute', top: 3, left: on ? 23 : 3, width: 20, height: 20, borderRadius: 10, background: '#fff'}} />
  </span>
);

export const Check: React.FC<{on: number; size?: number}> = ({on, size = 24}) => (
  <span style={{display: 'inline-flex', width: size, height: size, borderRadius: 6, border: `2px solid ${on > 0 ? AM.orange : AM.dim}`, background: on > 0 ? AM.orange : 'transparent', alignItems: 'center', justifyContent: 'center', boxSizing: 'border-box'}}>
    <svg width={size - 8} height={size - 8} viewBox="0 0 24 24" style={{transform: `scale(${on})`}}><path d="M5 12.5l4.5 4.5L19 7.5" stroke={AM.dark} strokeWidth={3.4} fill="none" strokeLinecap="round" strokeLinejoin="round" /></svg>
  </span>
);

/** Janela do gerenciador (cabeçalho + abas). */
export const Chrome: React.FC<{tab: 0 | 1 | 2}> = ({tab}) => {
  const tabs = ['Campanhas', 'Conjuntos de anúncios', 'Anúncios'];
  const xs = [24, 180, 436];
  return (
    <>
      <div style={{position: 'absolute', left: 0, right: 0, top: 0, height: 64, borderBottom: `2px solid ${AM.line}`, display: 'flex', alignItems: 'center', padding: '0 24px', justifyContent: 'space-between'}}>
        <div style={{display: 'flex', alignItems: 'center', gap: 14}}>
          <span style={{width: 28, height: 28, borderRadius: 7, background: AM.orange}} />
          <span style={{fontFamily: INTER, fontWeight: 700, fontSize: 25, color: AM.text}}>Gerenciador de Anúncios</span>
          <span style={{fontFamily: INTER, fontWeight: 500, fontSize: 21, color: AM.grey}}>· Empresa Exemplo</span>
        </div>
        <span style={{fontFamily: INTER, fontWeight: 600, fontSize: 20, color: AM.text, border: `2px solid ${AM.line}`, borderRadius: 10, padding: '6px 14px'}}>Últimos 7 dias</span>
      </div>
      <div style={{position: 'absolute', left: 0, right: 0, top: 64, height: 56, borderBottom: `2px solid ${AM.line}`}}>
        {tabs.map((t, i) => (
          <div key={t} style={{position: 'absolute', left: xs[i], top: 0, height: 56, display: 'flex', alignItems: 'center', fontFamily: INTER, fontWeight: i === tab ? 700 : 500, fontSize: 22, color: i === tab ? AM.text : AM.grey, borderBottom: i === tab ? `4px solid ${AM.orange}` : '4px solid transparent', boxSizing: 'border-box'}}>
            {t}
          </div>
        ))}
      </div>
    </>
  );
};
export const TAB_POS: [number, number][] = [[94, 92], [300, 92], [496, 92]];

/** Título no topo: ERRO 0X / COMO CORRIGIR. */
export const Title: React.FC<{n: number; fix: boolean; text: string; at: number; size?: number}> = ({n, fix, text, at, size = 64}) => {
  const f = useCurrentFrame();
  const p = ease(f, at, 14);
  const chip = fix ? AM.orange : AM.red;
  return (
    <div style={{position: 'absolute', left: 80, right: 80, top: 128, opacity: p, transform: `translateY(${(1 - p) * 20}px)`}}>
      <div style={{display: 'inline-flex', alignItems: 'center', gap: 10, padding: '6px 16px', borderRadius: 10, background: chip, color: fix ? AM.dark : '#fff', fontFamily: fonts.display, fontWeight: 800, fontSize: 30, letterSpacing: '0.1em'}}>
        <Mini kind={fix ? 'check' : 'x'} color={fix ? AM.dark : '#fff'} />
        {fix ? 'COMO CORRIGIR' : `ERRO 0${n}`}
      </div>
      <div style={{fontFamily: fonts.display, fontWeight: 900, fontSize: size, lineHeight: 1, color: AM.text, marginTop: 12, whiteSpace: 'nowrap'}}>{text}</div>
    </div>
  );
};

export const Caption: React.FC<{from: number; to: number; text: string}> = ({from, to, text}) => {
  const f = useCurrentFrame();
  if (f < from || f > to + 8) return null;
  const o = Math.min(interpolate(f, [from, from + 8], [0, 1], clamp), interpolate(f, [to, to + 8], [1, 0], clamp));
  return (
    <div style={{position: 'absolute', left: 0, right: 0, top: 1194, display: 'flex', justifyContent: 'center', opacity: o, transform: `translateY(${(1 - o) * 14}px)`}}>
      <div style={{display: 'flex', alignItems: 'center', gap: 14, background: 'rgba(12,12,12,0.9)', border: `2px solid ${AM.line}`, borderRadius: 16, padding: '14px 26px'}}>
        <span style={{width: 14, height: 14, borderRadius: 7, background: AM.orange}} />
        <span style={{fontFamily: INTER, fontWeight: 600, fontSize: 32, color: AM.text}}>{text}</span>
      </div>
    </div>
  );
};

export const Toast: React.FC<{at: number; to: number; text: string; red?: boolean; x: number; y: number}> = ({at, to, text, red, x, y}) => {
  const f = useCurrentFrame();
  if (f < at || f > to + 10) return null;
  const o = Math.min(ease(f, at, 8), interpolate(f, [to, to + 10], [1, 0], clamp));
  return (
    <div style={{position: 'absolute', left: x, top: y, transform: `translateY(${(1 - o) * 16}px)`, opacity: o, display: 'flex', alignItems: 'center', gap: 12, background: red ? AM.red : AM.green, color: '#fff', borderRadius: 12, padding: '12px 18px', fontFamily: INTER, fontWeight: 600, fontSize: 22, boxShadow: '0 12px 30px rgba(0,0,0,0.5)', whiteSpace: 'nowrap'}}>
      <Mini kind={red ? 'alert' : 'check'} color="#fff" /> {text}
    </div>
  );
};
