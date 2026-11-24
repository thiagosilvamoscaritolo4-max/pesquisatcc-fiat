import React from 'react';
import {Easing, interpolate, useCurrentFrame} from 'remotion';
import {CFG, Icon, INTER, K, NW, clamp} from './canvas';

const EXPO = Easing.bezier(0.16, 1, 0.3, 1);
export const MODAL = {x: 60, y: 150, w: 960, h: 1030};

/** Janela que "abre" de dentro do bloco (câmera centralizada nele). */
export const Modal: React.FC<{open: number; close: number; z: number; bg: string; children: (lf: number) => React.ReactNode}> = ({
  open, close, z, bg, children,
}) => {
  const f = useCurrentFrame();
  if (f < open || f > close + 15) return null;
  const p = interpolate(f, [open, open + 16], [0, 1], {...clamp, easing: EXPO});
  const q = interpolate(f, [close, close + 14], [0, 1], {...clamp, easing: Easing.in(Easing.cubic)});
  const s = p * (1 - q);
  const w0 = NW * z;
  const L = (a: number, b: number) => a + (b - a) * s;
  const x = L(540 - w0 / 2, MODAL.x);
  const y = L(675 - w0 / 2, MODAL.y);
  const w = L(w0, MODAL.w);
  const h = L(w0, MODAL.h);
  const co = interpolate(s, [0.6, 1], [0, 1], clamp);
  return (
    <>
      <div style={{position: 'absolute', inset: 0, background: 'rgba(0,0,0,0.62)', opacity: s}} />
      <div style={{position: 'absolute', left: x, top: y, width: w, height: h, background: bg, borderRadius: L(26 * z, 26), overflow: 'hidden', border: '2px solid #2E2E2E', boxShadow: `0 40px 100px rgba(0,0,0,${0.6 * s})`}}>
        <div style={{position: 'absolute', left: 0, top: 0, width: MODAL.w, height: MODAL.h, transform: `scale(${w / MODAL.w}, ${h / MODAL.h})`, transformOrigin: '0 0', opacity: co}}>
          {children(f - open)}
        </div>
      </div>
    </>
  );
};

const fade = (lf: number, a: number, d = 10) => interpolate(lf, [a, a + d], [0, 1], {...clamp, easing: EXPO});

/* ======================= ClickUp ======================= */
const CU = {bg: '#17181B', panel: '#202126', line: '#2D2E34', text: '#ECECEC', grey: '#8B8D96', pill: '#3A3B42'};
const LABEL: React.CSSProperties = {fontFamily: INTER, fontWeight: 600, fontSize: 22, letterSpacing: '0.1em', color: CU.grey};

const CUHeader: React.FC<{sending: boolean}> = ({sending}) => (
  <>
    <div style={{position: 'absolute', left: 0, right: 0, top: 0, height: 72, borderBottom: `2px solid ${CU.line}`, display: 'flex', alignItems: 'center', padding: '0 32px', justifyContent: 'space-between'}}>
      <div style={{display: 'flex', alignItems: 'center', gap: 14, fontFamily: INTER, fontSize: 24}}>
        <span style={{width: 26, height: 26, borderRadius: 7, background: K.orange, display: 'inline-block'}} />
        <span style={{fontWeight: 700, color: CU.text}}>ClickUp</span>
        <span style={{fontWeight: 500, color: CU.grey}}>/ Financeiro / Cobranças</span>
      </div>
      <span style={{fontFamily: INTER, fontSize: 40, color: CU.grey, lineHeight: 1}}>×</span>
    </div>
    <div style={{position: 'absolute', left: 44, top: 100, padding: '6px 16px', borderRadius: 8, background: sending ? K.orange : CU.pill, color: sending ? K.bg : CU.text, fontFamily: INTER, fontWeight: 700, fontSize: 22, letterSpacing: '0.06em'}}>
      {sending ? 'ENVIAR BOLETO' : 'A ENVIAR'}
    </div>
    <div style={{position: 'absolute', left: 44, top: 148, fontFamily: INTER, fontWeight: 700, fontSize: 46, color: CU.text}}>Cobrança · {CFG.company}</div>
  </>
);

const Avatar: React.FC<{s?: number}> = ({s = 40}) => (
  <span style={{width: s, height: s, borderRadius: s / 2, background: K.orange, color: K.onAccent, display: 'inline-flex', alignItems: 'center', justifyContent: 'center', fontFamily: INTER, fontWeight: 700, fontSize: s * 0.5}}>A</span>
);

const Cursor: React.FC<{x: number; y: number; press: number}> = ({x, y, press}) => (
  <svg width={46} height={62} viewBox="0 0 30 42" style={{position: 'absolute', left: x, top: y, transform: `scale(${1 - 0.15 * press})`, transformOrigin: '0 0', filter: 'drop-shadow(0 4px 8px rgba(0,0,0,0.5))'}}>
    <path d="M1 1 L1 34 L9.5 26.5 L15.5 40 L21.5 37.5 L15.5 24.5 L27 24.5 Z" fill="#FFFFFF" stroke="#0B0B0B" strokeWidth={2} strokeLinejoin="round" />
  </svg>
);

/** 1) campos + clique em "Enviar boleto". */
export const ClickUpFields: React.FC<{lf: number}> = ({lf}) => {
  const CLICK = 72;
  const BTN = {x: 380, y: 736, w: 400, h: 80};
  const target = {x: BTN.x + 205, y: BTN.y + 40};
  const mv = interpolate(lf, [30, 68], [0, 1], {...clamp, easing: Easing.inOut(Easing.cubic)});
  const cx = 860 + (target.x - 860) * mv;
  const cy = 990 + (target.y - 990) * mv;
  const press = lf >= CLICK && lf < CLICK + 6 ? 1 : 0;
  const rip = interpolate(lf, [CLICK, CLICK + 16], [0, 1], clamp);
  const rows: [string, React.ReactNode][] = [
    ['Responsável', <span style={{display: 'inline-flex', alignItems: 'center', gap: 12}}><Avatar /> Ana</span>],
    ['Nomenclatura', <span style={{fontFamily: 'monospace', fontSize: 28}}>{CFG.slug}_META_BOLETO_1125</span>],
    ['Pagamento', <span style={{padding: '4px 14px', borderRadius: 8, background: CU.pill, fontSize: 26}}>Boleto</span>],
    ['Plataforma', 'Meta Ads'],
    ['Valor', 'R$ 1.500,00'],
    ['Grupo WhatsApp', <span style={{fontFamily: 'monospace', fontSize: 28}}>120363041872@g.us</span>],
  ];
  return (
    <div style={{position: 'absolute', inset: 0, background: CU.bg}}>
      <CUHeader sending={lf >= CLICK + 4} />
      <div style={{...LABEL, position: 'absolute', left: 44, top: 232}}>CAMPOS PERSONALIZADOS</div>
      {rows.map(([l, v], i) => (
        <div key={l} style={{position: 'absolute', left: 44, right: 44, top: 272 + i * 76, height: 76, borderTop: `2px solid ${CU.line}`, display: 'flex', alignItems: 'center', opacity: fade(lf, 6 + i * 3)}}>
          <span style={{width: 336, fontFamily: INTER, fontWeight: 500, fontSize: 27, color: CU.grey}}>{l}</span>
          <span style={{fontFamily: INTER, fontWeight: 600, fontSize: 29, color: CU.text}}>{v}</span>
        </div>
      ))}
      <div style={{position: 'absolute', left: 44, right: 44, top: 728, borderTop: `2px solid ${CU.line}`, opacity: fade(lf, 24)}}>
        <span style={{position: 'absolute', top: 30, fontFamily: INTER, fontWeight: 500, fontSize: 27, color: CU.grey}}>Ação</span>
      </div>
      <div
        style={{
          position: 'absolute', left: BTN.x, top: BTN.y, width: BTN.w, height: BTN.h, borderRadius: 14, background: K.orange, color: K.onAccent,
          display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 14, fontFamily: INTER, fontWeight: 700, fontSize: 32,
          opacity: fade(lf, 24), transform: `scale(${press ? 0.95 : 1})`, filter: press ? 'brightness(0.85)' : 'none',
        }}
      >
        <svg width={22} height={26} viewBox="0 0 10 12"><path d="M0 0L10 6L0 12Z" fill={K.onAccent} /></svg>
        Enviar boleto
      </div>
      {lf >= CLICK && rip < 1 && (
        <div style={{position: 'absolute', left: target.x - 70, top: target.y - 70, width: 140, height: 140, borderRadius: 70, border: `4px solid ${K.light}`, transform: `scale(${0.2 + rip})`, opacity: 1 - rip}} />
      )}
      <div style={{position: 'absolute', left: BTN.x, top: 846, display: 'flex', alignItems: 'center', gap: 12, opacity: fade(lf, CLICK + 6), transform: `translateY(${(1 - fade(lf, CLICK + 6)) * 14}px)`}}>
        <Icon name="check" color={K.orange} size={34} stroke={3} />
        <span style={{fontFamily: INTER, fontWeight: 600, fontSize: 28, color: K.orange}}>Automação disparada no n8n</span>
      </div>
      {lf >= 28 && <Cursor x={cx} y={cy} press={press} />}
    </div>
  );
};

/** 2) mensagem pronta escrita na tarefa. */
const MSG: [string, string?][] = [
  ['Olá, '], ['@Ana', K.orange], ['!\nSegue o boleto da conta de anúncios do Meta Ads.\n\nValor: R$ 1.500,00\nVencimento: 28/11\n\nQualquer dúvida, é só chamar por aqui.'],
];
const chars = MSG.flatMap(([t, c]) => t.split('').map((ch) => ({ch, c})));

export const ClickUpMessage: React.FC<{lf: number}> = ({lf}) => {
  const n = Math.floor(interpolate(lf, [14, 14 + chars.length * 0.45], [0, chars.length], clamp));
  const blink = Math.floor(lf / 8) % 2 === 0;
  return (
    <div style={{position: 'absolute', inset: 0, background: CU.bg}}>
      <CUHeader sending />
      <div style={{...LABEL, position: 'absolute', left: 44, top: 236}}>MENSAGEM PRONTA</div>
      <div style={{position: 'absolute', left: 320, top: 228, padding: '4px 14px', borderRadius: 999, border: `2px solid ${K.orange}`, color: K.orange, fontFamily: INTER, fontWeight: 600, fontSize: 20, opacity: fade(lf, 4)}}>
        gerada pelo n8n
      </div>
      <div style={{position: 'absolute', left: 44, right: 44, top: 280, height: 560, boxSizing: 'border-box', background: CU.panel, border: `2px solid ${CU.line}`, borderRadius: 18, padding: '32px 36px', opacity: fade(lf, 4)}}>
        <div style={{fontFamily: INTER, fontWeight: 500, fontSize: 34, lineHeight: 1.5, color: CU.text, whiteSpace: 'pre-wrap'}}>
          {chars.map((x, i) => (
            <React.Fragment key={i}>
              {i === n && blink && <span style={{display: 'inline-block', width: 3, height: '1.1em', background: K.orange, verticalAlign: '-0.2em'}} />}
              <span style={{color: x.c ?? CU.text, fontWeight: x.c ? 700 : 500, visibility: i < n ? 'visible' : 'hidden'}}>{x.ch}</span>
            </React.Fragment>
          ))}
        </div>
      </div>
      <div style={{position: 'absolute', left: 44, top: 872, fontFamily: INTER, fontWeight: 500, fontSize: 25, color: CU.grey, opacity: fade(lf, 10)}}>
        Responsável: Ana  ·  Grupo: {CFG.group}
      </div>
    </div>
  );
};

/** 3) aprovação no comentário da tarefa. */
export const ClickUpComment: React.FC<{lf: number}> = ({lf}) => {
  const items = ['Nomenclatura no padrão', 'Responsável marcado', 'Grupo do WhatsApp preenchido', 'Tipo de pagamento: boleto'];
  const card = fade(lf, 14, 14);
  return (
    <div style={{position: 'absolute', inset: 0, background: CU.bg}}>
      <CUHeader sending />
      <div style={{...LABEL, position: 'absolute', left: 44, top: 236}}>MENSAGEM PRONTA</div>
      <div style={{position: 'absolute', left: 44, right: 44, top: 274, height: 100, boxSizing: 'border-box', background: CU.panel, border: `2px solid ${CU.line}`, borderRadius: 14, padding: '18px 26px', fontFamily: INTER, fontWeight: 500, fontSize: 26, lineHeight: 1.45, color: CU.grey, overflow: 'hidden'}}>
        Olá, <span style={{color: K.orange, fontWeight: 700}}>@Ana</span>! Segue o boleto da conta de anúncios do Meta Ads. Valor: R$ 1.500,00…
      </div>
      <div style={{...LABEL, position: 'absolute', left: 44, top: 410}}>ATIVIDADE</div>
      <div style={{position: 'absolute', left: 44, top: 452, display: 'flex', alignItems: 'center', gap: 12, fontFamily: INTER, fontWeight: 500, fontSize: 25, color: CU.grey, opacity: fade(lf, 4)}}>
        <span style={{width: 12, height: 12, borderRadius: 6, background: CU.grey}} />
        Ana mudou o status para <b style={{color: CU.text}}>ENVIAR BOLETO</b> · agora
      </div>
      <div style={{position: 'absolute', left: 44, right: 44, top: 506, boxSizing: 'border-box', background: CU.panel, borderRadius: 18, borderLeft: `6px solid ${K.orange}`, padding: '26px 32px', opacity: card, transform: `translateY(${(1 - card) * 30}px)`}}>
        <div style={{display: 'flex', alignItems: 'center', gap: 16}}>
          <span style={{width: 56, height: 56, borderRadius: 12, background: K.orange, display: 'inline-flex', alignItems: 'center', justifyContent: 'center'}}>
            <Icon name="flow" color={K.onAccent} size={38} />
          </span>
          <span style={{fontFamily: INTER, fontWeight: 700, fontSize: 30, color: CU.text}}>n8n</span>
          <span style={{fontFamily: INTER, fontWeight: 500, fontSize: 24, color: CU.grey}}>comentou · agora</span>
        </div>
        <div style={{fontFamily: INTER, fontWeight: 600, fontSize: 30, color: CU.text, marginTop: 20}}>Mensagem aprovada. Seguiu todos os requisitos:</div>
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
        <div style={{display: 'flex', alignItems: 'center', gap: 12, marginTop: 16, fontFamily: INTER, fontWeight: 600, fontSize: 28, color: K.orange, opacity: fade(lf, 66)}}>
          → Enviando para o grupo {CFG.group}
        </div>
      </div>
    </div>
  );
};

/* ======================= WhatsApp ======================= */
const WA = {header: '#1F2C34', bg: '#0B141A', out: '#005C4B', in: '#202C33', text: '#E9EDEF', sub: '#8696A0', blue: '#53BDEB', date: '#182229', green: '#00A884', input: '#2A3942'};

const Ticks: React.FC<{blue: boolean}> = ({blue}) => (
  <svg width={26} height={16} viewBox="0 0 18 11" style={{marginLeft: 6}}>
    <path d="M1 6l3 3 6-7M7 8l1 1 6-7" stroke={blue ? WA.blue : WA.sub} strokeWidth={1.6} fill="none" strokeLinecap="round" strokeLinejoin="round" />
  </svg>
);

const Pop: React.FC<{lf: number; at: number; out?: boolean; children: React.ReactNode; style?: React.CSSProperties}> = ({lf, at, out, children, style}) => {
  const p = fade(lf, at, 10);
  if (lf < at) return null;
  return (
    <div
      style={{
        alignSelf: out ? 'flex-end' : 'flex-start', maxWidth: 680, background: out ? WA.out : WA.in, color: WA.text,
        borderRadius: out ? '18px 4px 18px 18px' : '4px 18px 18px 18px', padding: '14px 20px 10px', boxSizing: 'border-box',
        opacity: p, transform: `scale(${0.9 + 0.1 * p})`, transformOrigin: out ? 'right top' : 'left top', ...style,
      }}
    >
      {children}
    </div>
  );
};

const Meta: React.FC<{t: string; ticks?: boolean; blue?: boolean}> = ({t, ticks, blue = false}) => (
  <div style={{display: 'flex', justifyContent: 'flex-end', alignItems: 'center', fontFamily: INTER, fontSize: 20, color: WA.sub, marginTop: 4}}>
    {t}
    {ticks && <Ticks blue={blue} />}
  </div>
);

export const WhatsAppGroup: React.FC<{lf: number}> = ({lf}) => {
  const blue = lf >= 72;
  const typing = lf >= 88 && lf < 120;
  return (
    <div style={{position: 'absolute', inset: 0, background: WA.bg}}>
      {/* cabeçalho */}
      <div style={{position: 'absolute', left: 0, right: 0, top: 0, height: 124, background: WA.header, display: 'flex', alignItems: 'center', padding: '0 26px', gap: 18}}>
        <svg width={26} height={40} viewBox="0 0 10 16"><path d="M8 2L2 8l6 6" stroke={WA.text} strokeWidth={2} fill="none" strokeLinecap="round" /></svg>
        <div style={{width: 76, height: 76, borderRadius: 38, background: WA.input, display: 'flex', alignItems: 'center', justifyContent: 'center', fontFamily: INTER, fontWeight: 700, fontSize: 30, color: WA.text}}>{CFG.initials}</div>
        <div>
          <div style={{fontFamily: INTER, fontWeight: 600, fontSize: 34, color: WA.text}}>{CFG.group}</div>
          <div style={{fontFamily: INTER, fontWeight: 400, fontSize: 24, color: typing ? WA.green : WA.sub, marginTop: 2}}>{typing ? 'Ana está digitando…' : 'Ana, Bruno, Você'}</div>
        </div>
      </div>
      {/* conversa */}
      <div
        style={{
          position: 'absolute', left: 0, right: 0, top: 124, bottom: 104, padding: '24px 26px', boxSizing: 'border-box',
          display: 'flex', flexDirection: 'column', gap: 12, overflow: 'hidden',
          backgroundImage: 'radial-gradient(rgba(255,255,255,0.03) 2px, transparent 2.5px)', backgroundSize: '34px 34px',
        }}
      >
        <div style={{alignSelf: 'center', padding: '8px 18px', borderRadius: 10, background: WA.date, fontFamily: INTER, fontWeight: 500, fontSize: 22, color: WA.sub, opacity: fade(lf, 2), marginBottom: 6}}>HOJE</div>
        <Pop lf={lf} at={16} out>
          <div style={{fontFamily: INTER, fontWeight: 400, fontSize: 30, lineHeight: 1.42, whiteSpace: 'pre-wrap'}}>
            Olá, <span style={{color: WA.blue}}>@Ana</span>!{'\n'}Segue o boleto da conta de anúncios do Meta Ads.{'\n\n'}Valor: R$ 1.500,00{'\n'}Vencimento: 28/11{'\n\n'}Qualquer dúvida, é só chamar por aqui.
          </div>
          <Meta t="09:41" ticks blue={blue} />
        </Pop>
        <Pop lf={lf} at={34} out style={{padding: 10}}>
          <div style={{display: 'flex', alignItems: 'center', gap: 18, background: '#025144', borderRadius: 12, padding: '14px 18px', width: 560, boxSizing: 'border-box'}}>
            <div style={{width: 56, height: 68, borderRadius: 8, background: '#E24A3B', display: 'flex', alignItems: 'flex-end', justifyContent: 'center', paddingBottom: 8, boxSizing: 'border-box', fontFamily: INTER, fontWeight: 700, fontSize: 16, color: '#fff'}}>PDF</div>
            <div>
              <div style={{fontFamily: INTER, fontWeight: 500, fontSize: 28, color: WA.text}}>boleto_{CFG.file}_1125.pdf</div>
              <div style={{fontFamily: INTER, fontWeight: 400, fontSize: 22, color: WA.sub, marginTop: 4}}>1 página · PDF · 84 kB</div>
            </div>
          </div>
          <div style={{padding: '0 8px'}}><Meta t="09:41" ticks blue={blue} /></div>
        </Pop>
        <Pop lf={lf} at={122}>
          <div style={{fontFamily: INTER, fontWeight: 600, fontSize: 24, color: '#E6A93A'}}>Ana</div>
          <div style={{fontFamily: INTER, fontWeight: 400, fontSize: 30, marginTop: 2}}>Recebido! Vou pagar hoje.</div>
          <Meta t="09:42" />
        </Pop>
      </div>
      {/* campo de mensagem */}
      <div style={{position: 'absolute', left: 0, right: 0, bottom: 0, height: 104, display: 'flex', alignItems: 'center', padding: '0 20px', gap: 16}}>
        <div style={{flex: 1, height: 70, borderRadius: 35, background: WA.input, display: 'flex', alignItems: 'center', padding: '0 28px', fontFamily: INTER, fontSize: 28, color: WA.sub}}>Mensagem</div>
        <div style={{width: 70, height: 70, borderRadius: 35, background: WA.green}} />
      </div>
    </div>
  );
};
