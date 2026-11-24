import React from 'react';
import {Easing, interpolate, random} from 'remotion';
import {CFG, Icon, INTER, K, clamp} from '../fluxo/canvas';
import {Avatar, CU, CUHeader, Cursor, LABEL, Meta, WA, fade} from '../fluxo/windows';
import {ALERT} from './flow';

const ease = Easing.inOut(Easing.cubic);
const move = (lf: number, a: number, b: number, from: [number, number], to: [number, number]): [number, number] => {
  const t = interpolate(lf, [a, b], [0, 1], {...clamp, easing: ease});
  return [from[0] + (to[0] - from[0]) * t, from[1] + (to[1] - from[1]) * t];
};
const Ripple: React.FC<{lf: number; at: number; x: number; y: number}> = ({lf, at, x, y}) => {
  const r = interpolate(lf, [at, at + 16], [0, 1], clamp);
  if (lf < at || r >= 1) return null;
  return <div style={{position: 'absolute', left: x - 70, top: y - 70, width: 140, height: 140, borderRadius: 70, border: `4px solid ${K.light}`, transform: `scale(${0.2 + r})`, opacity: 1 - r}} />;
};
const Button: React.FC<{x: number; y: number; lf: number; click: number; show?: number; label?: string}> = ({x, y, lf, click, show = 0, label = 'Enviar boleto'}) => {
  const press = lf >= click && lf < click + 6;
  return (
    <div
      style={{
        position: 'absolute', left: x, top: y, width: 400, height: 80, borderRadius: 14, background: K.orange, color: K.onAccent,
        display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 14, fontFamily: INTER, fontWeight: 700, fontSize: 32,
        opacity: fade(lf, show), transform: `scale(${press ? 0.95 : 1})`, filter: press ? 'brightness(0.85)' : 'none',
      }}
    >
      <svg width={22} height={26} viewBox="0 0 10 12"><path d="M0 0L10 6L0 12Z" fill={K.onAccent} /></svg>
      {label}
    </div>
  );
};
const Toast: React.FC<{lf: number; at: number; x: number; y: number; text: string}> = ({lf, at, x, y, text}) => (
  <div style={{position: 'absolute', left: x, top: y, display: 'flex', alignItems: 'center', gap: 12, opacity: fade(lf, at), transform: `translateY(${(1 - fade(lf, at)) * 14}px)`}}>
    <Icon name="check" color={K.orange} size={34} stroke={3} />
    <span style={{fontFamily: INTER, fontWeight: 600, fontSize: 28, color: K.orange}}>{text}</span>
  </div>
);
const Row: React.FC<{i: number; top: number; lf: number; label: string; children: React.ReactNode}> = ({i, top, lf, label, children}) => (
  <div style={{position: 'absolute', left: 44, right: 44, top, height: 76, borderTop: `2px solid ${CU.line}`, display: 'flex', alignItems: 'center', opacity: fade(lf, 6 + i * 3)}}>
    <span style={{width: 336, fontFamily: INTER, fontWeight: 500, fontSize: 27, color: CU.grey}}>{label}</span>
    <span style={{fontFamily: INTER, fontWeight: 600, fontSize: 29, color: CU.text}}>{children}</span>
  </div>
);
const Chip: React.FC<{children: React.ReactNode}> = ({children}) => (
  <span style={{padding: '4px 12px', borderRadius: 8, background: CU.pill, fontSize: 25, marginRight: 12}}>{children}</span>
);
const mention = (t: string) => <span style={{color: K.orange, fontWeight: 700}}>{t}</span>;

/* ---------- 1ª tentativa: Pedro clica sem preencher o grupo ---------- */
export const FieldsV3: React.FC<{lf: number}> = ({lf}) => {
  const CLICK = 72;
  const tgt: [number, number] = [585, 716];
  const [cx, cy] = move(lf, 30, 68, [860, 990], tgt);
  return (
    <div style={{position: 'absolute', inset: 0, background: CU.bg}}>
      <CUHeader sending={lf >= CLICK + 4} />
      <div style={{...LABEL, position: 'absolute', left: 44, top: 232}}>CAMPOS PERSONALIZADOS</div>
      <Row i={0} top={272} lf={lf} label="Gestor"><span style={{display: 'inline-flex', alignItems: 'center', gap: 12}}><Avatar l="P" /> Pedro</span></Row>
      <Row i={1} top={348} lf={lf} label="Contato do cliente">@Ana</Row>
      <Row i={2} top={424} lf={lf} label="Meta Ads"><Chip>Pix</Chip>R$ 1.500,00</Row>
      <Row i={3} top={500} lf={lf} label="Google Ads"><Chip>Boleto</Chip>R$ 800,00</Row>
      <Row i={4} top={576} lf={lf} label="Grupo WhatsApp"><span style={{color: '#5A5C64', fontStyle: 'italic', fontWeight: 500}}>vazio</span></Row>
      <div style={{position: 'absolute', left: 44, right: 44, top: 652, borderTop: `2px solid ${CU.line}`, opacity: fade(lf, 24)}}>
        <span style={{position: 'absolute', top: 40, fontFamily: INTER, fontWeight: 500, fontSize: 27, color: CU.grey}}>Ação</span>
      </div>
      <Button x={380} y={676} lf={lf} click={CLICK} show={24} />
      <Ripple lf={lf} at={CLICK} x={tgt[0]} y={tgt[1]} />
      <Toast lf={lf} at={CLICK + 6} x={380} y={786} text="Automação disparada no n8n" />
      {lf >= 28 && <Cursor x={cx} y={cy} press={lf >= CLICK && lf < CLICK + 6 ? 1 : 0} />}
    </div>
  );
};

/* ---------- comentário de erro + correção ---------- */
const GROUP_ID = '120363041872@g.us';
export const ErrorV3: React.FC<{lf: number}> = ({lf}) => {
  const card = fade(lf, 14, 14);
  const n = Math.floor(interpolate(lf, [98, 98 + GROUP_ID.length * 1.6], [0, GROUP_ID.length], clamp));
  let cur: [number, number] = move(lf, 72, 90, [860, 1000], [650, 712]);
  if (lf >= 128) cur = move(lf, 128, 146, [650, 712], [585, 812]);
  const focused = lf >= 92 && lf < 128;
  return (
    <div style={{position: 'absolute', inset: 0, background: CU.bg}}>
      <CUHeader sending />
      <div style={{...LABEL, position: 'absolute', left: 44, top: 232}}>ATIVIDADE</div>
      <div style={{position: 'absolute', left: 44, top: 270, display: 'flex', alignItems: 'center', gap: 12, fontFamily: INTER, fontWeight: 500, fontSize: 25, color: CU.grey, opacity: fade(lf, 4)}}>
        <span style={{width: 12, height: 12, borderRadius: 6, background: CU.grey}} />
        Pedro mudou o status para <b style={{color: CU.text}}>ENVIAR BOLETO</b> · agora
      </div>
      <div style={{position: 'absolute', left: 44, right: 44, top: 318, boxSizing: 'border-box', background: CU.panel, borderRadius: 18, borderLeft: `6px solid ${ALERT}`, padding: '24px 30px', opacity: card, transform: `translateY(${(1 - card) * 30}px)`}}>
        <div style={{display: 'flex', alignItems: 'center', gap: 16}}>
          <span style={{width: 52, height: 52, borderRadius: 12, background: K.orange, display: 'inline-flex', alignItems: 'center', justifyContent: 'center'}}><Icon name="flow" color={K.onAccent} size={36} /></span>
          <span style={{fontFamily: INTER, fontWeight: 700, fontSize: 30, color: CU.text}}>n8n</span>
          <span style={{fontFamily: INTER, fontWeight: 500, fontSize: 24, color: CU.grey}}>comentou · agora</span>
          <span style={{marginLeft: 'auto', fontFamily: INTER, fontWeight: 700, fontSize: 20, color: '#fff', background: ALERT, borderRadius: 8, padding: '4px 12px'}}>ENVIO BLOQUEADO</span>
        </div>
        <div style={{fontFamily: INTER, fontWeight: 600, fontSize: 30, color: CU.text, marginTop: 18}}>{mention('@Pedro')}, não enviei a cobrança.</div>
        <div style={{fontFamily: INTER, fontWeight: 500, fontSize: 27, lineHeight: 1.45, color: CU.text, marginTop: 12, opacity: fade(lf, 28)}}>
          <b>Motivo:</b> o campo Grupo WhatsApp está vazio.
        </div>
        <div style={{fontFamily: INTER, fontWeight: 500, fontSize: 27, lineHeight: 1.45, color: CU.text, marginTop: 8, opacity: fade(lf, 40)}}>
          <b>Como resolver:</b> preencha o ID do grupo do cliente e clique em Enviar boleto de novo.
        </div>
      </div>
      {/* correção */}
      <div style={{position: 'absolute', left: 44, top: 690, fontFamily: INTER, fontWeight: 500, fontSize: 27, color: CU.grey, opacity: fade(lf, 60)}}>Grupo WhatsApp</div>
      <div style={{position: 'absolute', left: 380, top: 676, width: 536, height: 70, boxSizing: 'border-box', borderRadius: 12, border: `2px solid ${focused ? K.orange : CU.line}`, background: CU.panel, display: 'flex', alignItems: 'center', padding: '0 20px', fontFamily: 'monospace', fontSize: 28, color: CU.text, opacity: fade(lf, 60)}}>
        {n > 0 ? GROUP_ID.slice(0, n) : <span style={{fontFamily: INTER, fontStyle: 'italic', color: '#5A5C64'}}>vazio</span>}
        {focused && Math.floor(lf / 8) % 2 === 0 && <span style={{display: 'inline-block', width: 3, height: 32, background: K.orange, marginLeft: 2}} />}
      </div>
      <Button x={380} y={772} lf={lf} click={150} show={60} />
      <Ripple lf={lf} at={90} x={650} y={712} />
      <Ripple lf={lf} at={150} x={585} y={812} />
      <Toast lf={lf} at={156} x={380} y={876} text="Disparado de novo no n8n" />
      {lf >= 70 && <Cursor x={cur[0]} y={cur[1]} press={(lf >= 90 && lf < 96) || (lf >= 150 && lf < 156) ? 1 : 0} />}
    </div>
  );
};

/* ---------- mensagem pronta (Pix + boleto) ---------- */
const MSG3: [string, string?][] = [
  ['Olá, '], ['@Ana', 'm'], ['!\nSeguem os pagamentos das contas de anúncios:\n\nMeta Ads · Pix · R$ 1.500,00\nGoogle Ads · Boleto · R$ 800,00\n\nVencimento: 28/11. O código Pix vai na próxima mensagem.'],
];
const chars3 = MSG3.flatMap(([t, c]) => t.split('').map((ch) => ({ch, c})));
export const MessageV3: React.FC<{lf: number}> = ({lf}) => {
  const n = Math.floor(interpolate(lf, [12, 12 + chars3.length * 0.3], [0, chars3.length], clamp));
  const blink = Math.floor(lf / 8) % 2 === 0;
  return (
    <div style={{position: 'absolute', inset: 0, background: CU.bg}}>
      <CUHeader sending />
      <div style={{...LABEL, position: 'absolute', left: 44, top: 236}}>MENSAGEM PRONTA</div>
      <div style={{position: 'absolute', left: 320, top: 228, padding: '4px 14px', borderRadius: 999, border: `2px solid ${K.orange}`, color: K.orange, fontFamily: INTER, fontWeight: 600, fontSize: 20, opacity: fade(lf, 4)}}>gerada pelo n8n</div>
      <div style={{position: 'absolute', left: 44, right: 44, top: 280, height: 560, boxSizing: 'border-box', background: CU.panel, border: `2px solid ${CU.line}`, borderRadius: 18, padding: '32px 36px', opacity: fade(lf, 4)}}>
        <div style={{fontFamily: INTER, fontWeight: 500, fontSize: 33, lineHeight: 1.5, color: CU.text, whiteSpace: 'pre-wrap'}}>
          {chars3.map((x, i) => (
            <React.Fragment key={i}>
              {i === n && blink && <span style={{display: 'inline-block', width: 3, height: '1.1em', background: K.orange, verticalAlign: '-0.2em'}} />}
              <span style={{color: x.c ? K.orange : CU.text, fontWeight: x.c ? 700 : 500, visibility: i < n ? 'visible' : 'hidden'}}>{x.ch}</span>
            </React.Fragment>
          ))}
        </div>
      </div>
      <div style={{position: 'absolute', left: 44, top: 872, fontFamily: INTER, fontWeight: 500, fontSize: 25, color: CU.grey, opacity: fade(lf, 10)}}>Gestor: Pedro  ·  Grupo: {CFG.group}</div>
    </div>
  );
};

/* ---------- comentário de aprovação ---------- */
export const ApprovalV3: React.FC<{lf: number}> = ({lf}) => {
  const items = ['Nomenclatura no padrão', 'Contato do cliente marcado', 'Grupo do WhatsApp preenchido', 'Forma de pagamento: Pix + boleto'];
  const card = fade(lf, 14, 14);
  const line = (t: React.ReactNode, at: number, top: number) => (
    <div style={{position: 'absolute', left: 44, top, display: 'flex', alignItems: 'center', gap: 12, fontFamily: INTER, fontWeight: 500, fontSize: 25, color: CU.grey, opacity: fade(lf, at)}}>
      <span style={{width: 12, height: 12, borderRadius: 6, background: CU.grey}} />
      {t}
    </div>
  );
  return (
    <div style={{position: 'absolute', inset: 0, background: CU.bg}}>
      <CUHeader sending />
      <div style={{...LABEL, position: 'absolute', left: 44, top: 232}}>ATIVIDADE</div>
      {line(<>Pedro preencheu <b style={{color: CU.text}}>Grupo WhatsApp</b> · agora</>, 2, 270)}
      {line(<>Pedro mudou o status para <b style={{color: CU.text}}>ENVIAR BOLETO</b> · agora</>, 4, 312)}
      <div style={{position: 'absolute', left: 44, right: 44, top: 362, boxSizing: 'border-box', background: CU.panel, borderRadius: 18, borderLeft: `6px solid ${K.orange}`, padding: '26px 32px', opacity: card, transform: `translateY(${(1 - card) * 30}px)`}}>
        <div style={{display: 'flex', alignItems: 'center', gap: 16}}>
          <span style={{width: 52, height: 52, borderRadius: 12, background: K.orange, display: 'inline-flex', alignItems: 'center', justifyContent: 'center'}}><Icon name="flow" color={K.onAccent} size={36} /></span>
          <span style={{fontFamily: INTER, fontWeight: 700, fontSize: 30, color: CU.text}}>n8n</span>
          <span style={{fontFamily: INTER, fontWeight: 500, fontSize: 24, color: CU.grey}}>comentou · agora</span>
          <span style={{marginLeft: 'auto', fontFamily: INTER, fontWeight: 700, fontSize: 20, color: K.onAccent, background: K.orange, borderRadius: 8, padding: '4px 12px'}}>APROVADO</span>
        </div>
        <div style={{fontFamily: INTER, fontWeight: 600, fontSize: 30, color: CU.text, marginTop: 18}}>{mention('@Pedro')}, mensagem aprovada. Seguiu todos os requisitos:</div>
        <div style={{marginTop: 8}}>
          {items.map((t, i) => {
            const on = interpolate(lf, [30 + i * 8, 36 + i * 8], [0, 1], clamp);
            return (
              <div key={t} style={{display: 'flex', alignItems: 'center', gap: 14, height: 52}}>
                <div style={{width: 34, height: 34, borderRadius: 17, border: `2px solid ${on ? K.orange : CU.line}`, background: on ? K.orange : 'transparent', display: 'flex', alignItems: 'center', justifyContent: 'center'}}>
                  <div style={{transform: `scale(${on})`}}><Icon name="check" color={K.onAccent} size={26} stroke={3} /></div>
                </div>
                <span style={{fontFamily: INTER, fontWeight: 500, fontSize: 28, color: on ? CU.text : CU.grey}}>{t}</span>
              </div>
            );
          })}
        </div>
        <div style={{fontFamily: INTER, fontWeight: 600, fontSize: 28, color: K.orange, marginTop: 16, opacity: fade(lf, 66)}}>→ Enviando para o grupo {CFG.group}</div>
      </div>
    </div>
  );
};

/* ---------- WhatsApp ---------- */
export type ChatItem =
  | {at: number; kind: 'date'; label: string}
  | {at: number; kind: 'text'; tag?: string; body: React.ReactNode}
  | {at: number; kind: 'pix'; platform: string; code: string}
  | {at: number; kind: 'img'; platform: string; value: string}
  | {at: number; kind: 'doc'; platform?: string; file: string}
  | {at: number; kind: 'in'; name: string; body: string; time: string};

const Grow: React.FC<{p: number; align: 'flex-start' | 'flex-end' | 'center'; children: React.ReactNode}> = ({p, align, children}) => (
  <div style={{display: 'grid', gridTemplateRows: `${p}fr`, alignSelf: 'stretch'}}>
    <div style={{overflow: 'hidden', minHeight: 0, display: 'flex', justifyContent: align}}>
      <div style={{opacity: p, transform: `scale(${0.92 + 0.08 * p})`, transformOrigin: align === 'flex-end' ? 'right bottom' : 'left bottom', padding: '6px 0'}}>{children}</div>
    </div>
  </div>
);

const Tag: React.FC<{children: React.ReactNode}> = ({children}) => (
  <div style={{display: 'inline-block', fontFamily: INTER, fontWeight: 700, fontSize: 19, letterSpacing: '0.06em', color: WA.text, background: 'rgba(0,0,0,0.28)', borderRadius: 6, padding: '4px 10px', marginBottom: 8}}>{children}</div>
);

/** "Print" ilustrativo da tela de pagamento Pix (QR code fictício). */
const QR: React.FC<{seed: string; size: number}> = ({seed, size}) => {
  const n = 25;
  const c = size / n;
  const cells: React.ReactNode[] = [];
  const finder = (x: number, y: number) => x < 7 && y < 7;
  const inFinder = (x: number, y: number) => finder(x, y) || finder(n - 1 - x, y) || finder(x, n - 1 - y);
  for (let y = 0; y < n; y++) {
    for (let x = 0; x < n; x++) {
      if (inFinder(x, y)) continue;
      if (random(`${seed}-${x}-${y}`) > 0.52) cells.push(<rect key={`${x}-${y}`} x={x * c} y={y * c} width={c + 0.3} height={c + 0.3} fill="#111" />);
    }
  }
  const F = (x: number, y: number) => (
    <g key={`f${x}${y}`}>
      <rect x={x * c} y={y * c} width={7 * c} height={7 * c} fill="#111" />
      <rect x={(x + 1) * c} y={(y + 1) * c} width={5 * c} height={5 * c} fill="#fff" />
      <rect x={(x + 2) * c} y={(y + 2) * c} width={3 * c} height={3 * c} fill="#111" />
    </g>
  );
  return (
    <svg width={size} height={size} style={{display: 'block'}}>
      <rect width={size} height={size} fill="#fff" />
      {cells}
      {F(0, 0)}
      {F(n - 7, 0)}
      {F(0, n - 7)}
    </svg>
  );
};

const PixPrint: React.FC<{platform: string; value: string}> = ({platform, value}) => (
  <div style={{width: 380, background: '#F4F5F7', borderRadius: 12, padding: '22px 24px', boxSizing: 'border-box', textAlign: 'center', fontFamily: INTER}}>
    <div style={{fontWeight: 700, fontSize: 25, color: '#111'}}>Pagamento via Pix</div>
    <div style={{fontWeight: 500, fontSize: 19, color: '#555', marginTop: 4}}>{platform === 'META ADS' ? 'Meta Ads' : 'Google Ads'} · {CFG.company}</div>
    <div style={{display: 'flex', justifyContent: 'center', margin: '16px 0'}}>
      <div style={{padding: 10, background: '#fff', borderRadius: 10, border: '2px solid #E2E4E8'}}><QR seed={platform} size={190} /></div>
    </div>
    <div style={{fontWeight: 700, fontSize: 32, color: '#111'}}>{value}</div>
    <div style={{fontWeight: 500, fontSize: 18, color: '#666', marginTop: 2}}>Vence em 28/11</div>
    <div style={{marginTop: 14, background: '#E2E4E8', borderRadius: 10, padding: '10px 0', fontWeight: 600, fontSize: 19, color: '#333'}}>Copiar código Pix</div>
  </div>
);

const outStyle: React.CSSProperties = {maxWidth: 690, background: WA.out, color: WA.text, borderRadius: '18px 4px 18px 18px', padding: '12px 18px 8px', boxSizing: 'border-box'};

export const WAChat: React.FC<{lf: number; items: ChatItem[]; blueAt: number; typing?: [number, number]}> = ({lf, items, blueAt, typing}) => {
  const blue = lf >= blueAt;
  const isTyping = typing && lf >= typing[0] && lf < typing[1];
  return (
    <div style={{position: 'absolute', inset: 0, background: WA.bg}}>
      <div style={{position: 'absolute', left: 0, right: 0, top: 0, height: 124, background: WA.header, display: 'flex', alignItems: 'center', padding: '0 26px', gap: 18, zIndex: 2}}>
        <svg width={26} height={40} viewBox="0 0 10 16"><path d="M8 2L2 8l6 6" stroke={WA.text} strokeWidth={2} fill="none" strokeLinecap="round" /></svg>
        <div style={{width: 76, height: 76, borderRadius: 38, background: WA.input, display: 'flex', alignItems: 'center', justifyContent: 'center', fontFamily: INTER, fontWeight: 700, fontSize: 30, color: WA.text}}>{CFG.initials}</div>
        <div>
          <div style={{fontFamily: INTER, fontWeight: 600, fontSize: 34, color: WA.text}}>{CFG.group}</div>
          <div style={{fontFamily: INTER, fontWeight: 400, fontSize: 24, color: isTyping ? WA.green : WA.sub, marginTop: 2}}>{isTyping ? 'Ana está digitando…' : 'Ana, Pedro, Você'}</div>
        </div>
      </div>
      <div style={{position: 'absolute', left: 0, right: 0, top: 124, bottom: 104, padding: '0 26px 18px', boxSizing: 'border-box', display: 'flex', flexDirection: 'column', justifyContent: 'flex-end', overflow: 'hidden', backgroundImage: 'radial-gradient(rgba(255,255,255,0.03) 2px, transparent 2.5px)', backgroundSize: '34px 34px'}}>
        {items.map((it, i) => {
          const p = interpolate(lf, [it.at, it.at + 10], [0, 1], {...clamp, easing: Easing.bezier(0.16, 1, 0.3, 1)});
          if (lf < it.at) return null;
          if (it.kind === 'date') {
            return (
              <Grow key={i} p={p} align="center">
                <div style={{padding: '8px 18px', borderRadius: 10, background: WA.date, fontFamily: INTER, fontWeight: 500, fontSize: 22, color: WA.sub}}>{it.label}</div>
              </Grow>
            );
          }
          if (it.kind === 'in') {
            return (
              <Grow key={i} p={p} align="flex-start">
                <div style={{maxWidth: 640, background: WA.in, color: WA.text, borderRadius: '4px 18px 18px 18px', padding: '12px 18px 8px'}}>
                  <div style={{fontFamily: INTER, fontWeight: 600, fontSize: 24, color: '#E6A93A'}}>{it.name}</div>
                  <div style={{fontFamily: INTER, fontWeight: 400, fontSize: 29, marginTop: 2}}>{it.body}</div>
                  <Meta t={it.time} />
                </div>
              </Grow>
            );
          }
          if (it.kind === 'text') {
            return (
              <Grow key={i} p={p} align="flex-end">
                <div style={outStyle}>
                  {it.tag && <Tag>{it.tag}</Tag>}
                  <div style={{fontFamily: INTER, fontWeight: 400, fontSize: 29, lineHeight: 1.4, whiteSpace: 'pre-wrap'}}>{it.body}</div>
                  <Meta t="09:41" ticks blue={blue} />
                </div>
              </Grow>
            );
          }
          if (it.kind === 'img') {
            return (
              <Grow key={i} p={p} align="flex-end">
                <div style={{...outStyle, padding: 8}}>
                  <div style={{padding: '4px 8px 0'}}><Tag>PRINT DO PIX · {it.platform}</Tag></div>
                  <PixPrint platform={it.platform} value={it.value} />
                  <div style={{padding: '0 8px'}}><Meta t="09:41" ticks blue={blue} /></div>
                </div>
              </Grow>
            );
          }
          if (it.kind === 'pix') {
            return (
              <Grow key={i} p={p} align="flex-end">
                <div style={outStyle}>
                  <Tag>PIX · {it.platform}</Tag>
                  <div style={{fontFamily: 'monospace', fontSize: 24, lineHeight: 1.35, wordBreak: 'break-all', width: 600}}>{it.code}</div>
                  <Meta t="09:41" ticks blue={blue} />
                </div>
              </Grow>
            );
          }
          return (
            <Grow key={i} p={p} align="flex-end">
              <div style={{...outStyle, padding: 10}}>
                {it.platform && <div style={{padding: '2px 8px 0'}}><Tag>BOLETO · {it.platform}</Tag></div>}
                <div style={{display: 'flex', alignItems: 'center', gap: 18, background: '#025144', borderRadius: 12, padding: '14px 18px', width: 580, boxSizing: 'border-box'}}>
                  <div style={{width: 54, height: 66, borderRadius: 8, background: '#E24A3B', display: 'flex', alignItems: 'flex-end', justifyContent: 'center', paddingBottom: 8, boxSizing: 'border-box', fontFamily: INTER, fontWeight: 700, fontSize: 16, color: '#fff'}}>PDF</div>
                  <div>
                    <div style={{fontFamily: INTER, fontWeight: 500, fontSize: 27, color: WA.text}}>{it.file}</div>
                    <div style={{fontFamily: INTER, fontWeight: 400, fontSize: 21, color: WA.sub, marginTop: 4}}>1 página · PDF · 84 kB</div>
                  </div>
                </div>
                <div style={{padding: '0 8px'}}><Meta t="09:41" ticks blue={blue} /></div>
              </div>
            </Grow>
          );
        })}
      </div>
      <div style={{position: 'absolute', left: 0, right: 0, bottom: 0, height: 104, display: 'flex', alignItems: 'center', padding: '0 20px', gap: 16, background: WA.bg}}>
        <div style={{flex: 1, height: 70, borderRadius: 35, background: WA.input, display: 'flex', alignItems: 'center', padding: '0 28px', fontFamily: INTER, fontSize: 28, color: WA.sub}}>Mensagem</div>
        <div style={{width: 70, height: 70, borderRadius: 35, background: WA.green}} />
      </div>
    </div>
  );
};

const at = <span style={{color: WA.blue}}>@Ana</span>;
const PIX_META = '00020126580014BR.GOV.BCB.PIX0136a1f4c9e2-7b31-4d2a-9c8e-52040000530398654071500.00';
const PIX_GOOGLE = '00020126580014BR.GOV.BCB.PIX01369d2e7f10-3c44-4b8f-a1d2-5204000053039865406800.00';

export const chatPixBoleto = (): ChatItem[] => [
  {at: 2, kind: 'date', label: 'HOJE'},
  {at: 14, kind: 'text', body: <>Olá, {at}!{'\n'}Seguem os pagamentos das contas de anúncios. Vencimento: 28/11.</>},
  {at: 32, kind: 'img', platform: 'META ADS', value: 'R$ 1.500,00'},
  {at: 54, kind: 'pix', platform: 'META ADS', code: PIX_META},
  {at: 72, kind: 'doc', platform: 'GOOGLE ADS', file: `boleto_google_${CFG.file}.pdf`},
  {at: 136, kind: 'in', name: 'Ana', body: 'Recebido! Pago hoje.', time: '09:43'},
];
export const chatPixPix = (): ChatItem[] => [
  {at: 2, kind: 'date', label: 'HOJE'},
  {at: 12, kind: 'text', body: <>Olá, {at}!{'\n'}Seguem os Pix das contas de anúncios. Vencimento: 28/11.</>},
  {at: 28, kind: 'img', platform: 'META ADS', value: 'R$ 1.500,00'},
  {at: 46, kind: 'pix', platform: 'META ADS', code: PIX_META},
  {at: 66, kind: 'img', platform: 'GOOGLE ADS', value: 'R$ 800,00'},
  {at: 84, kind: 'pix', platform: 'GOOGLE ADS', code: PIX_GOOGLE},
];
export const chatBoleto = (): ChatItem[] => [
  {at: 2, kind: 'date', label: 'HOJE'},
  {at: 12, kind: 'text', body: <>Olá, {at}!{'\n'}Segue o boleto da conta de anúncios do Meta Ads.{'\n'}Valor: R$ 1.500,00 · Vencimento: 28/11.</>},
  {at: 28, kind: 'doc', file: `boleto_meta_${CFG.file}.pdf`},
];
export const chatFollow = (): ChatItem[] => [
  {at: 4, kind: 'date', label: '26/11'},
  {at: 12, kind: 'text', tag: 'FOLLOW 01', body: <>Oi, {at}! Lembrete: os pagamentos das contas de anúncios vencem em 2 dias.</>},
  {at: 48, kind: 'date', label: '28/11'},
  {at: 56, kind: 'text', tag: 'FOLLOW 02', body: <>{at}, hoje é o vencimento. Precisa de ajuda com algum pagamento?</>},
  {at: 92, kind: 'date', label: '29/11'},
  {at: 100, kind: 'text', tag: 'FOLLOW 03', body: <>{at}, ainda não identificamos o pagamento. Sem saldo, os anúncios podem pausar.</>},
];
