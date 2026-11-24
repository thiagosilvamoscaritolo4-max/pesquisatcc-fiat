import React from 'react';
import {Easing, interpolate, useCurrentFrame} from 'remotion';
import {colors, fonts} from '../theme';

export const INTER = "'Inter', sans-serif";
export const K = {
  bg: '#0E0E0E', node: '#1E1E1E', nodeLine: '#3A3A3A', wire: '#3A3A3A', orange: colors.orange,
  light: '#ECECEC', grey: '#8B8B8B', panel: '#1B1B1B', panelLine: '#2E2E2E',
};
export const clamp = {extrapolateLeft: 'clamp', extrapolateRight: 'clamp'} as const;
export const NW = 170; // tamanho do bloco (mundo)

/* ---------------- câmera ---------------- */
type Key = [number, number, number, number]; // frame, x, y, zoom
export const KEYS: Key[] = [
  [0, 0, 0, 1.75], [59, 0, 0, 1.92],
  [60, 990, 150, 0.44], [150, 990, 150, 0.47], // corte: mostra tudo
  [178, 0, 0, 1.6], [306, 0, 0, 1.6], // gatilho / ClickUp
  [340, 330, 0, 1.6], [496, 330, 0, 1.6], // monta mensagem
  [530, 660, -90, 1.35], [586, 660, -90, 1.35], // confere requisitos
  [614, 990, -150, 1.6], [756, 990, -150, 1.6], // comenta aprovação
  [786, 1320, -150, 1.6], [990, 1320, -150, 1.6], // WhatsApp
  [1040, 990, 150, 0.47], [1085, 990, 150, 0.47], // fluxo inteiro
  [1125, 990, 600, 1.05], [1260, 990, 600, 1.12], // nota final
];
const ease = Easing.inOut(Easing.cubic);
export const camAt = (f: number) => {
  if (f <= KEYS[0][0]) return {x: KEYS[0][1], y: KEYS[0][2], z: KEYS[0][3]};
  for (let i = 0; i < KEYS.length - 1; i++) {
    const a = KEYS[i];
    const b = KEYS[i + 1];
    if (f >= a[0] && f <= b[0]) {
      const e = ease((f - a[0]) / (b[0] - a[0]));
      return {
        x: a[1] + (b[1] - a[1]) * e,
        y: a[2] + (b[2] - a[2]) * e,
        z: Math.exp(Math.log(a[3]) + (Math.log(b[3]) - Math.log(a[3])) * e),
      };
    }
  }
  const l = KEYS[KEYS.length - 1];
  return {x: l[1], y: l[2], z: l[3]};
};
export type Cam = ReturnType<typeof camAt>;

export const Grid: React.FC<{cam: Cam}> = ({cam}) => {
  const s = 44 * cam.z;
  const r = Math.max(1.1, 2 * cam.z);
  return (
    <div
      style={{
        position: 'absolute', inset: 0, backgroundColor: K.bg,
        backgroundImage: `radial-gradient(circle, #2C2C2C ${r}px, transparent ${r + 0.8}px)`,
        backgroundSize: `${s}px ${s}px`,
        backgroundPosition: `${540 - cam.x * cam.z - s / 2}px ${675 - cam.y * cam.z - s / 2}px`,
      }}
    />
  );
};

export const World: React.FC<{cam: Cam; children: React.ReactNode}> = ({cam, children}) => (
  <div style={{position: 'absolute', left: 0, top: 0, transform: `translate(${540 - cam.x * cam.z}px, ${675 - cam.y * cam.z}px) scale(${cam.z})`, transformOrigin: '0 0'}}>
    {children}
  </div>
);

/* ---------------- ícones ---------------- */
type IconName = 'bolt' | 'edit' | 'split' | 'comment' | 'chat' | 'clock' | 'repeat' | 'flow' | 'check';
const PATHS: Record<IconName, string[]> = {
  bolt: ['M13 2L4 14h7l-1 8 9-12h-7z'],
  edit: ['M4 20h4L19 9l-4-4L4 16z', 'M14 6l4 4'],
  split: ['M3 12h6l5-6h7', 'M9 12l5 6h7', 'M18 3l3 3-3 3', 'M18 15l3 3-3 3'],
  comment: ['M4 5h16v11H9l-5 4z', 'M8 9h8M8 12h5'],
  chat: ['M20 12a8 8 0 0 1-11.6 7.1L4 20l1-4.1A8 8 0 1 1 20 12z'],
  clock: ['M12 3a9 9 0 1 0 0 18 9 9 0 0 0 0-18z', 'M12 7v5l3 2'],
  repeat: ['M4 12a8 8 0 0 1 14-5.3', 'M20 12a8 8 0 0 1-14 5.3', 'M18 3v4h-4', 'M6 21v-4h4'],
  flow: ['M5 9.4a2.6 2.6 0 1 0 0 5.2 2.6 2.6 0 0 0 0-5.2z', 'M19 3.4a2.6 2.6 0 1 0 0 5.2 2.6 2.6 0 0 0 0-5.2z', 'M19 15.4a2.6 2.6 0 1 0 0 5.2 2.6 2.6 0 0 0 0-5.2z', 'M7.6 12h3.4c1.5 0 2-1 2.6-2.6S15 6 16.4 6M11 12c1.5 0 2 1 2.6 2.6S15 18 16.4 18'],
  check: ['M6 12.5l4 4L18 8'],
};
export const Icon: React.FC<{name: IconName; color: string; size: number; stroke?: number}> = ({name, color, size, stroke = 2}) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth={stroke} strokeLinecap="round" strokeLinejoin="round">
    {PATHS[name].map((d, i) => <path key={i} d={d} />)}
  </svg>
);

/* ---------------- fluxo ---------------- */
export type NodeDef = {
  id: string; x: number; y: number; title: string; sub: string; icon: IconName;
  run: number; done: number; trigger?: boolean; dim?: boolean; ports?: boolean;
};
const NEVER = 99999;
export const NODES: NodeDef[] = [
  {id: 'T', x: 0, y: 0, title: 'Enviar boleto', sub: 'ClickUp Trigger', icon: 'bolt', run: 292, done: 298, trigger: true},
  {id: 'M', x: 330, y: 0, title: 'Monta mensagem', sub: 'Set', icon: 'edit', run: 340, done: 352},
  {id: 'IF', x: 660, y: 0, title: 'Confere requisitos', sub: 'IF', icon: 'split', run: 524, done: 534, ports: true},
  {id: 'A', x: 990, y: -150, title: 'Comenta aprovação', sub: 'ClickUp', icon: 'comment', run: 614, done: 624},
  {id: 'E', x: 990, y: 170, title: 'Comenta erro', sub: 'ClickUp', icon: 'comment', run: NEVER, done: NEVER, dim: true},
  {id: 'W', x: 1320, y: -150, title: 'Envia no grupo', sub: 'WhatsApp API', icon: 'chat', run: 786, done: 796},
  {id: 'WT', x: 1650, y: -150, title: 'Aguarda pagamento', sub: 'Wait', icon: 'clock', run: 1030, done: 1040},
  {id: 'F', x: 1980, y: -150, title: 'Follow-up', sub: 'WhatsApp API', icon: 'repeat', run: 1060, done: 1072},
];
type EdgeDef = {from: string; to: string; port?: number; start: number; end: number};
export const EDGES: EdgeDef[] = [
  {from: 'T', to: 'M', start: 316, end: 340},
  {from: 'M', to: 'IF', start: 500, end: 524},
  {from: 'IF', port: -1, to: 'A', start: 590, end: 614},
  {from: 'IF', port: 1, to: 'E', start: NEVER, end: NEVER + 1},
  {from: 'A', to: 'W', start: 762, end: 786},
  {from: 'W', to: 'WT', start: 1010, end: 1030},
  {from: 'WT', to: 'F', start: 1040, end: 1060},
];
const byId = (id: string) => NODES.find((n) => n.id === id)!;
const PORT = 38;

type Pt = {x: number; y: number};
const bez = (p0: Pt, c1: Pt, c2: Pt, p1: Pt, t: number): Pt => {
  const u = 1 - t;
  return {
    x: u * u * u * p0.x + 3 * u * u * t * c1.x + 3 * u * t * t * c2.x + t * t * t * p1.x,
    y: u * u * u * p0.y + 3 * u * u * t * c1.y + 3 * u * t * t * c2.y + t * t * t * p1.y,
  };
};

export const Wires: React.FC = () => {
  const f = useCurrentFrame();
  return (
    <svg width={1} height={1} style={{position: 'absolute', left: 0, top: 0, overflow: 'visible'}}>
      {EDGES.map((e, i) => {
        const a = byId(e.from);
        const b = byId(e.to);
        const p0 = {x: a.x + NW / 2, y: a.y + (e.port ?? 0) * PORT};
        const p1 = {x: b.x - NW / 2, y: b.y};
        const c1 = {x: p0.x + 90, y: p0.y};
        const c2 = {x: p1.x - 90, y: p1.y};
        const d = `M${p0.x},${p0.y} C${c1.x},${c1.y} ${c2.x},${c2.y} ${p1.x},${p1.y}`;
        const t = interpolate(f, [e.start, e.end], [0, 1], {...clamp, easing: Easing.inOut(Easing.quad)});
        const moving = f >= e.start && f <= e.end + 2;
        const trail = [];
        if (moving) {
          for (let k = 0; k < 6; k++) {
            const tt = t - k * 0.03;
            if (tt < 0) continue;
            const p = bez(p0, c1, c2, p1, tt);
            trail.push(<circle key={k} cx={p.x} cy={p.y} r={k === 0 ? 12 : 9 - k} fill={K.orange} opacity={1 - k * 0.16} />);
          }
        }
        const never = e.start === NEVER;
        return (
          <g key={i}>
            <path d={d} stroke={K.wire} strokeWidth={4} fill="none" strokeDasharray={never ? '10 10' : undefined} />
            {!never && <path d={d} stroke={K.orange} strokeWidth={5} fill="none" pathLength={1} strokeDasharray={1} strokeDashoffset={1 - t} />}
            <circle cx={p0.x} cy={p0.y} r={8} fill="#4A4A4A" />
            <circle cx={p1.x} cy={p1.y} r={7} fill="#4A4A4A" />
            {trail}
          </g>
        );
      })}
    </svg>
  );
};

export const Node: React.FC<{n: NodeDef}> = ({n}) => {
  const f = useCurrentFrame();
  const state = f < n.run ? 'idle' : f < n.done ? 'run' : 'done';
  const dimmed = n.dim && f > 534;
  const burst = interpolate(f, [n.done, n.done + 18], [0, 1], clamp);
  const radius = n.trigger ? `${NW / 2}px 26px 26px ${NW / 2}px` : '26px';
  const listening = n.trigger && f < n.run;
  const ph = (f % 40) / 40;
  const hasOut = EDGES.some((e) => e.from === n.id && e.start !== NEVER);
  return (
    <div style={{position: 'absolute', left: n.x - NW / 2, top: n.y - NW / 2, width: NW, height: NW, opacity: dimmed ? 0.32 : 1}}>
      {listening && (
        <div style={{position: 'absolute', inset: 0, borderRadius: radius, border: `4px solid ${K.orange}`, transform: `scale(${1 + ph * 0.35})`, opacity: 0.7 * (1 - ph)}} />
      )}
      {state === 'done' && burst < 1 && (
        <div style={{position: 'absolute', inset: 0, borderRadius: radius, border: `5px solid ${K.orange}`, transform: `scale(${1 + burst * 0.55})`, opacity: 1 - burst}} />
      )}
      <div
        style={{
          position: 'absolute', inset: 0, borderRadius: radius, background: K.node, boxSizing: 'border-box',
          border: `4px solid ${state === 'done' ? K.orange : K.nodeLine}`, display: 'flex', alignItems: 'center', justifyContent: 'center',
        }}
      >
        <Icon name={n.icon} color={state === 'done' || n.trigger ? K.orange : K.light} size={78} />
      </div>
      {state === 'run' && (
        <svg width={NW + 44} height={NW + 44} style={{position: 'absolute', left: -22, top: -22, transform: `rotate(${f * 14}deg)`}}>
          <circle cx={(NW + 44) / 2} cy={(NW + 44) / 2} r={(NW + 44) / 2 - 4} stroke={K.orange} strokeWidth={5} fill="none" strokeDasharray="110 400" strokeLinecap="round" />
        </svg>
      )}
      {state === 'done' && (
        <div style={{position: 'absolute', right: -16, top: -16, width: 48, height: 48, borderRadius: 24, background: K.orange, display: 'flex', alignItems: 'center', justifyContent: 'center', transform: `scale(${interpolate(burst, [0, 0.4], [0.3, 1], clamp)})`}}>
          <Icon name="check" color={K.bg} size={34} stroke={3} />
        </div>
      )}
      {state === 'done' && hasOut && !n.ports && (
        <div style={{position: 'absolute', left: NW + 20, top: NW / 2 - 44, fontFamily: INTER, fontWeight: 500, fontSize: 22, color: K.grey, whiteSpace: 'nowrap'}}>1 item</div>
      )}
      {n.ports && (
        <>
          <div style={{position: 'absolute', left: NW + 16, top: NW / 2 - PORT - 34, fontFamily: INTER, fontWeight: 600, fontSize: 21, color: state === 'done' ? K.orange : K.grey}}>true</div>
          <div style={{position: 'absolute', left: NW + 16, top: NW / 2 + PORT + 6, fontFamily: INTER, fontWeight: 600, fontSize: 21, color: K.grey}}>false</div>
        </>
      )}
      <div style={{position: 'absolute', left: -80, right: -80, top: NW + 16, textAlign: 'center'}}>
        <div style={{fontFamily: INTER, fontWeight: 600, fontSize: 28, color: K.light}}>{n.title}</div>
        <div style={{fontFamily: INTER, fontWeight: 400, fontSize: 22, color: K.grey, marginTop: 4}}>{n.sub}</div>
        {listening && <div style={{fontFamily: INTER, fontWeight: 600, fontSize: 22, color: K.orange, marginTop: 8, opacity: 0.6 + 0.4 * Math.sin(f / 5)}}>Aguardando evento…</div>}
        {n.id === 'F' && (
          <div style={{display: 'flex', justifyContent: 'center', gap: 8, marginTop: 10}}>
            {['01', '02', '03'].map((x, i) => {
              const on = f >= 1062 + i * 7;
              return (
                <span key={x} style={{fontFamily: INTER, fontWeight: 700, fontSize: 20, padding: '4px 10px', borderRadius: 8, background: on ? K.orange : 'transparent', color: on ? K.bg : K.grey, border: `2px solid ${on ? K.orange : K.nodeLine}`}}>
                  {x}
                </span>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
};

/** Requisitos conferidos (aparece sobre o bloco IF). */
export const IfCard: React.FC = () => {
  const f = useCurrentFrame();
  const p = interpolate(f, [526, 540], [0, 1], {...clamp, easing: Easing.bezier(0.16, 1, 0.3, 1)});
  const items = ['Nomenclatura no padrão', 'Responsável marcado', 'Grupo do WhatsApp', 'Tipo de pagamento'];
  return (
    <div
      style={{
        position: 'absolute', left: 660 - 230, top: -440, width: 460, padding: '24px 28px', boxSizing: 'border-box',
        background: K.panel, border: `2px solid ${K.panelLine}`, borderRadius: 20, opacity: p, transform: `translateY(${(1 - p) * 20}px)`,
      }}
    >
      <div style={{fontFamily: INTER, fontWeight: 700, fontSize: 28, color: K.light, marginBottom: 10}}>Requisitos</div>
      {items.map((t, i) => {
        const on = interpolate(f, [538 + i * 8, 544 + i * 8], [0, 1], clamp);
        return (
          <div key={t} style={{display: 'flex', alignItems: 'center', gap: 14, height: 50}}>
            <div style={{width: 32, height: 32, borderRadius: 16, border: `2px solid ${on ? K.orange : K.nodeLine}`, background: on ? K.orange : 'transparent', display: 'flex', alignItems: 'center', justifyContent: 'center'}}>
              <div style={{transform: `scale(${on})`}}><Icon name="check" color={K.bg} size={24} stroke={3} /></div>
            </div>
            <span style={{fontFamily: INTER, fontWeight: 500, fontSize: 25, color: on ? K.light : K.grey}}>{t}</span>
          </div>
        );
      })}
    </div>
  );
};

/** Notas fixadas no canvas. */
export const TitleSticky: React.FC = () => (
    <div style={{position: 'absolute', left: 990 - 560, top: -840, width: 1120, height: 150, boxSizing: 'border-box', background: K.panel, border: `2px solid ${K.panelLine}`, borderLeft: `10px solid ${K.orange}`, borderRadius: 18, padding: '26px 40px'}}>
      <div style={{fontFamily: INTER, fontWeight: 700, fontSize: 44, color: K.light}}>Automação de boletos</div>
      <div style={{fontFamily: INTER, fontWeight: 500, fontSize: 30, color: K.grey, marginTop: 4}}>ClickUp → n8n → WhatsApp</div>
    </div>
);

export const CtaSticky: React.FC = () => (
    <div style={{position: 'absolute', left: 990 - 410, top: 600 - 165, width: 820, height: 330, boxSizing: 'border-box', background: K.orange, borderRadius: 22, padding: '38px 44px', color: K.bg}}>
      <div style={{fontFamily: INTER, fontWeight: 700, fontSize: 42, lineHeight: 1.15}}>Quer esse fluxo no seu negócio?</div>
      <div style={{fontFamily: INTER, fontWeight: 500, fontSize: 30, marginTop: 14, opacity: 0.85}}>Chama no direct:</div>
      <div style={{fontFamily: fonts.display, fontWeight: 900, fontSize: 108, lineHeight: 1, marginTop: 8}}>@workthiago</div>
    </div>
);
