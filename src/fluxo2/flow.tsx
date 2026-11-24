import React from 'react';
import {Easing, interpolate, useCurrentFrame} from 'remotion';
import {fonts} from '../theme';
import {CFG, Icon, IconName, INTER, K, Key, NW, Pt, bez, clamp} from '../fluxo/canvas';

export const ALERT = '#E5484D';
export const NAVY_BOX = '#14306E';

/* ---------------- câmera ---------------- */
/** Desloca a linha do tempo depois do Pix + boleto (+24) e do Pix + pix (+60 no total). */
export const S = (f: number) => f + (f >= 1450 ? 60 : f >= 1318 ? 24 : 0);

const KEYS_RAW: Key[] = [
  [0, 0, 0, 1.75], [59, 0, 0, 1.92],
  [60, 1050, 290, 0.42], [150, 1050, 290, 0.44], // corte: fluxo inteiro
  [178, 0, 0, 1.6], [306, 0, 0, 1.6], // ClickUp (1ª tentativa)
  [334, 300, 0, 1.6], [348, 300, 0, 1.6],
  [376, 600, -80, 1.3], [440, 600, -80, 1.3], // confere: faltou o grupo
  [470, 900, 190, 1.6], [652, 900, 190, 1.6], // comenta erro + correção
  [676, 0, 0, 1.35], [684, 0, 0, 1.35], // volta pro gatilho (2ª tentativa)
  [706, 300, 0, 1.6], [822, 300, 0, 1.6], // mensagem pronta
  [848, 600, -80, 1.3], [900, 600, -80, 1.3], // confere: tudo ok
  [928, 900, -170, 1.6], [1042, 900, -170, 1.6], // comenta aprovação
  [1070, 1170, -330, 1.15], [1130, 1170, -330, 1.15], // forma de pagamento
  [1156, 1500, -170, 1.6], [1320, 1500, -170, 1.6], // pix + boleto
  [1346, 1500, 90, 1.6], [1452, 1500, 90, 1.6], // pix + pix
  [1480, 1500, -430, 1.6], [1568, 1500, -430, 1.6], // boleto / cartão
  [1600, 1800, -170, 1.5], [1608, 1800, -170, 1.5], // aguarda pagamento
  [1636, 2100, -170, 1.6], [1802, 2100, -170, 1.6], // follow-up
  [1850, 1050, 290, 0.42], [1880, 1050, 290, 0.42],
  [1920, 1050, 875, 1.05], [2040, 1050, 875, 1.1],
];
export const KEYS2: Key[] = KEYS_RAW.map(([f, x, y, z]) => [S(f), x, y, z]);
export const DURATION2 = S(2040);

/* ---------------- blocos ---------------- */
type W = [number, number];
export type Node2Def = {
  id: string; x: number; y: number; title: string; sub: string; icon: IconName;
  runs: W[]; trigger?: boolean; alert?: boolean; ports?: number[]; focus?: W[]; chips?: number;
};
const N2_RAW: Node2Def[] = [
  {id: 'T', x: 0, y: 0, title: 'Enviar boleto', sub: 'ClickUp Trigger', icon: 'bolt', trigger: true, runs: [[292, 298], [676, 682]]},
  {id: 'M', x: 300, y: 0, title: 'Monta mensagem', sub: 'Set', icon: 'edit', runs: [[334, 344], [706, 716]]},
  {id: 'IF', x: 600, y: 0, title: 'Confere requisitos', sub: 'IF', icon: 'split', runs: [[374, 384], [846, 856]], ports: [-38, 38]},
  {id: 'A', x: 900, y: -170, title: 'Comenta aprovação', sub: 'ClickUp', icon: 'comment', runs: [[926, 936]]},
  {id: 'E', x: 900, y: 190, title: 'Comenta erro', sub: 'ClickUp', icon: 'comment', runs: [[468, 478]], alert: true},
  {id: 'S', x: 1200, y: -170, title: 'Forma de pagamento', sub: 'Switch', icon: 'split', runs: [[1068, 1078]], ports: [-48, 0, 48]},
  {id: 'W1', x: 1500, y: -430, title: 'Boleto / cartão', sub: 'WhatsApp API', icon: 'chat', runs: [], focus: [[1470, 1580]]},
  {id: 'W2', x: 1500, y: -170, title: 'Pix + boleto', sub: 'WhatsApp API', icon: 'chat', runs: [[1156, 1166]]},
  {id: 'W3', x: 1500, y: 90, title: 'Pix + pix', sub: 'WhatsApp API', icon: 'chat', runs: [], focus: [[1336, 1462]]},
  {id: 'WT', x: 1800, y: -170, title: 'Aguarda pagamento', sub: 'Wait', icon: 'clock', runs: [[1596, 1606]]},
  {id: 'F', x: 2100, y: -170, title: 'Follow-up', sub: 'WhatsApp API', icon: 'repeat', runs: [[1634, 1646]], chips: 1640},
];
const sw = (w: W): W => [S(w[0]), S(w[1])];
export const N2: Node2Def[] = N2_RAW.map((n) => ({...n, runs: n.runs.map(sw), focus: n.focus?.map(sw), chips: n.chips === undefined ? undefined : S(n.chips)}));

type E2 = {from: string; to: string; port?: number; passes: W[]; alert?: boolean};
const E2_RAW: E2[] = [
  {from: 'T', to: 'M', passes: [[310, 334], [684, 706]]},
  {from: 'M', to: 'IF', passes: [[350, 374], [822, 846]]},
  {from: 'IF', port: 38, to: 'E', passes: [[444, 468]], alert: true},
  {from: 'IF', port: -38, to: 'A', passes: [[904, 926]]},
  {from: 'A', to: 'S', passes: [[1046, 1068]]},
  {from: 'S', port: -48, to: 'W1', passes: []},
  {from: 'S', port: 0, to: 'W2', passes: [[1134, 1156]]},
  {from: 'S', port: 48, to: 'W3', passes: []},
  {from: 'W1', to: 'WT', passes: []},
  {from: 'W2', to: 'WT', passes: [[1572, 1596]]},
  {from: 'W3', to: 'WT', passes: []},
  {from: 'WT', to: 'F', passes: [[1610, 1634]]},
];
export const E2S: E2[] = E2_RAW.map((e) => ({...e, passes: e.passes.map(sw)}));
const byId = (id: string) => N2.find((n) => n.id === id)!;

export const Wires2: React.FC = () => {
  const f = useCurrentFrame();
  return (
    <svg width={1} height={1} style={{position: 'absolute', left: 0, top: 0, overflow: 'visible'}}>
      {E2S.map((e, i) => {
        const a = byId(e.from);
        const b = byId(e.to);
        const p0 = {x: a.x + NW / 2, y: a.y + (e.port ?? 0)};
        const p1 = {x: b.x - NW / 2, y: b.y};
        const c1 = {x: p0.x + 80, y: p0.y};
        const c2 = {x: p1.x - 80, y: p1.y};
        const d = `M${p0.x},${p0.y} C${c1.x},${c1.y} ${c2.x},${c2.y} ${p1.x},${p1.y}`;
        const col = e.alert ? ALERT : K.orange;
        const fill = e.passes.length ? interpolate(f, e.passes[0], [0, 1], {...clamp, easing: Easing.inOut(Easing.quad)}) : 0;
        const trail: React.ReactNode[] = [];
        e.passes.forEach(([s0, s1], pi) => {
          if (f < s0 || f > s1 + 2) return;
          const t = interpolate(f, [s0, s1], [0, 1], {...clamp, easing: Easing.inOut(Easing.quad)});
          for (let k = 0; k < 6; k++) {
            const tt = t - k * 0.03;
            if (tt < 0) continue;
            const p: Pt = bez(p0, c1, c2, p1, tt);
            trail.push(<circle key={`${pi}-${k}`} cx={p.x} cy={p.y} r={k === 0 ? 12 : 9 - k} fill={col} opacity={1 - k * 0.16} />);
          }
        });
        return (
          <g key={i}>
            <path d={d} stroke={K.wire} strokeWidth={4} fill="none" strokeDasharray={e.passes.length ? undefined : '10 10'} />
            {e.passes.length > 0 && <path d={d} stroke={col} strokeWidth={5} fill="none" pathLength={1} strokeDasharray={1} strokeDashoffset={1 - fill} />}
            <circle cx={p0.x} cy={p0.y} r={8} fill="#4A4A4A" />
            <circle cx={p1.x} cy={p1.y} r={7} fill="#4A4A4A" />
            {trail}
          </g>
        );
      })}
    </svg>
  );
};

const inW = (f: number, ws: W[] = []) => ws.some(([a, b]) => f >= a && f < b);

export const Node2: React.FC<{n: Node2Def}> = ({n}) => {
  const f = useCurrentFrame();
  const running = inW(f, n.runs);
  const done = n.runs.length > 0 && f >= n.runs[0][1] && !running;
  const lastDone = [...n.runs].reverse().find(([, d]) => f >= d)?.[1] ?? -999;
  const burst = interpolate(f, [lastDone, lastDone + 18], [0, 1], clamp);
  const col = n.alert ? ALERT : K.orange;
  const focus = inW(f, n.focus);
  const radius = n.trigger ? `${NW / 2}px 26px 26px ${NW / 2}px` : '26px';
  const listening = n.trigger && f < n.runs[0][0];
  const ph = (f % 40) / 40;
  return (
    <div style={{position: 'absolute', left: n.x - NW / 2, top: n.y - NW / 2, width: NW, height: NW}}>
      {listening && <div style={{position: 'absolute', inset: 0, borderRadius: radius, border: `4px solid ${col}`, transform: `scale(${1 + ph * 0.35})`, opacity: 0.7 * (1 - ph)}} />}
      {done && burst < 1 && <div style={{position: 'absolute', inset: 0, borderRadius: radius, border: `5px solid ${col}`, transform: `scale(${1 + burst * 0.55})`, opacity: 1 - burst}} />}
      <div
        style={{
          position: 'absolute', inset: 0, borderRadius: radius, background: K.node, boxSizing: 'border-box',
          border: `4px ${focus && !done ? 'dashed' : 'solid'} ${done || focus ? col : K.nodeLine}`,
          display: 'flex', alignItems: 'center', justifyContent: 'center',
        }}
      >
        <Icon name={n.icon} color={done || focus || n.trigger ? col : K.light} size={78} />
      </div>
      {running && (
        <svg width={NW + 44} height={NW + 44} style={{position: 'absolute', left: -22, top: -22, transform: `rotate(${f * 14}deg)`}}>
          <circle cx={(NW + 44) / 2} cy={(NW + 44) / 2} r={(NW + 44) / 2 - 4} stroke={col} strokeWidth={5} fill="none" strokeDasharray="110 400" strokeLinecap="round" />
        </svg>
      )}
      {done && (
        <div style={{position: 'absolute', right: -16, top: -16, width: 48, height: 48, borderRadius: 24, background: col, display: 'flex', alignItems: 'center', justifyContent: 'center'}}>
          <Icon name="check" color={K.onAccent} size={34} stroke={3} />
        </div>
      )}
      {n.id === 'IF' && (
        <>
          <div style={{position: 'absolute', left: NW + 16, top: NW / 2 - 38 - 34, fontFamily: INTER, fontWeight: 600, fontSize: 21, color: f >= 856 ? K.orange : K.grey}}>true</div>
          <div style={{position: 'absolute', left: NW + 16, top: NW / 2 + 38 + 6, fontFamily: INTER, fontWeight: 600, fontSize: 21, color: f >= 384 ? ALERT : K.grey}}>false</div>
        </>
      )}
      <div style={{position: 'absolute', left: -80, right: -80, top: NW + 16, textAlign: 'center'}}>
        <div style={{fontFamily: INTER, fontWeight: 600, fontSize: 28, color: K.light}}>{n.title}</div>
        <div style={{fontFamily: INTER, fontWeight: 400, fontSize: 22, color: K.grey, marginTop: 4}}>{n.sub}</div>
        {listening && <div style={{fontFamily: INTER, fontWeight: 600, fontSize: 22, color: col, marginTop: 8, opacity: 0.6 + 0.4 * Math.sin(f / 5)}}>Aguardando evento…</div>}
        {n.chips !== undefined && (
          <div style={{display: 'flex', justifyContent: 'center', gap: 8, marginTop: 10}}>
            {['01', '02', '03'].map((x, i) => {
              const on = f >= n.chips! + i * 6;
              return (
                <span key={x} style={{fontFamily: INTER, fontWeight: 700, fontSize: 20, padding: '4px 10px', borderRadius: 8, background: on ? col : 'transparent', color: on ? K.onAccent : K.grey, border: `2px solid ${on ? col : K.nodeLine}`}}>{x}</span>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
};

/* ---------------- cartões no canvas ---------------- */
const CheckDot: React.FC<{state: 0 | 1 | -1; p: number}> = ({state, p}) => {
  const c = state === -1 ? ALERT : K.orange;
  const on = state !== 0;
  return (
    <div style={{width: 32, height: 32, borderRadius: 16, border: `2px solid ${on ? c : K.nodeLine}`, background: on ? c : 'transparent', display: 'flex', alignItems: 'center', justifyContent: 'center'}}>
      {on && (
        <div style={{transform: `scale(${p})`}}>
          {state === 1 ? <Icon name="check" color={K.onAccent} size={24} stroke={3} /> : <svg width={18} height={18} viewBox="0 0 24 24"><path d="M6 6l12 12M18 6L6 18" stroke="#fff" strokeWidth={3.4} strokeLinecap="round" /></svg>}
        </div>
      )}
    </div>
  );
};

export const IfCard2: React.FC = () => {
  const f = useCurrentFrame();
  const p = interpolate(f, [378, 392], [0, 1], {...clamp, easing: Easing.bezier(0.16, 1, 0.3, 1)});
  const items = ['Nomenclatura no padrão', 'Contato do cliente marcado', 'Grupo do WhatsApp', 'Forma de pagamento'];
  const second = f >= 820;
  return (
    <div style={{position: 'absolute', left: 600 - 240, top: -440, width: 480, padding: '24px 28px', boxSizing: 'border-box', background: K.panel, border: `2px solid ${K.panelLine}`, borderRadius: 20, opacity: p}}>
      <div style={{fontFamily: INTER, fontWeight: 700, fontSize: 28, color: K.light, marginBottom: 10}}>Requisitos</div>
      {items.map((t, i) => {
        let st: 0 | 1 | -1 = 0;
        let at = 0;
        if (!second) {
          at = 390 + i * 8;
          if (f >= at) st = i < 2 ? 1 : i === 2 ? -1 : 0;
        } else {
          at = 858 + i * 6;
          if (f >= at) st = 1;
        }
        const pp = interpolate(f, [at, at + 6], [0, 1], clamp);
        return (
          <div key={t} style={{display: 'flex', alignItems: 'center', gap: 14, height: 50}}>
            <CheckDot state={st} p={pp} />
            <span style={{fontFamily: INTER, fontWeight: 500, fontSize: 25, color: st === -1 ? ALERT : st === 1 ? K.light : K.grey}}>{t}</span>
          </div>
        );
      })}
    </div>
  );
};

export const RouteCard: React.FC = () => {
  const f = useCurrentFrame();
  const p = interpolate(f, [1074, 1088], [0, 1], {...clamp, easing: Easing.bezier(0.16, 1, 0.3, 1)});
  const rows = [
    ['Boleto / cartão', '1 mensagem + boleto'],
    ['Pix + boleto', 'Pix separado + boleto'],
    ['Pix + pix', 'um código por plataforma'],
  ];
  return (
    <div style={{position: 'absolute', left: 1110 - 300, top: -620, width: 600, padding: '24px 28px', boxSizing: 'border-box', background: K.panel, border: `2px solid ${K.panelLine}`, borderRadius: 20, opacity: p, transform: `translateY(${(1 - p) * 20}px)`}}>
      <div style={{fontFamily: INTER, fontWeight: 700, fontSize: 28, color: K.light, marginBottom: 12}}>Forma de pagamento</div>
      {rows.map(([a, b], i) => (
        <div key={a} style={{display: 'flex', alignItems: 'center', gap: 12, height: 52, opacity: interpolate(f, [1084 + i * 6, 1092 + i * 6], [0, 1], clamp)}}>
          <span style={{fontFamily: INTER, fontWeight: 700, fontSize: 24, color: K.onAccent, background: K.orange, borderRadius: 8, padding: '4px 12px', whiteSpace: 'nowrap'}}>{a}</span>
          <span style={{fontFamily: INTER, fontWeight: 500, fontSize: 24, color: K.light}}>→ {b}</span>
        </div>
      ))}
    </div>
  );
};

export const EndSticky: React.FC = () => (
  <div style={{position: 'absolute', left: 1050 - 410, top: 680, width: 820, boxSizing: 'border-box', background: K.orange === '#FF6A13' ? K.orange : NAVY_BOX, borderRadius: 22, padding: '38px 44px', color: K.onAccent}}>
    <div style={{fontFamily: INTER, fontWeight: 700, fontSize: 42, lineHeight: 1.15}}>{CFG.end.title}</div>
    <div style={{fontFamily: INTER, fontWeight: 500, fontSize: 30, marginTop: 14, opacity: 0.85}}>{CFG.end.sub}</div>
    <div style={{fontFamily: fonts.display, fontWeight: 900, fontSize: 108, lineHeight: 1, marginTop: 8}}>{CFG.end.big}</div>
  </div>
);
