import '../fonts';
import '@fontsource/inter/400.css';
import '@fontsource/inter/500.css';
import '@fontsource/inter/600.css';
import '@fontsource/inter/700.css';
import React from 'react';
import {AbsoluteFill, interpolate, useCurrentFrame} from 'remotion';
import {Grain} from '../components';
import {colors, fonts} from '../theme';
import {AM, Caption, Check, INTER, StatusPill, Title, Toast, Toggle, brl, clamp, ease} from './ui';
import {DIVERSE, RES_A, RES_B, SETS, SPLIT_A, SPLIT_B, TOTAL, Thumb} from './views';
import {CAPS, CLICKS, Hook, MOBILE_LAYOUT, Sfx, Summary, TITLES} from './Erros';

/* Reels: app do gerenciador em tela cheia (gravação de tela de celular). */
const X = 40; // margem lateral
const W = 1000; // largura útil
const TOP = 600; // início da lista de cartões
const TABS = ['Campanhas', 'Conjuntos', 'Anúncios'];
const TAPS: Record<number, [number, number]> = {136: [860, 505], 468: [530, 505], 556: [250, 925], 642: [250, 925], 798: [180, 572], 948: [72, 572]};

const label: React.CSSProperties = {fontFamily: INTER, fontWeight: 600, fontSize: 21, color: AM.grey, letterSpacing: '0.02em'};
const val: React.CSSProperties = {fontFamily: INTER, fontWeight: 700, fontSize: 30, color: AM.text, fontVariantNumeric: 'tabular-nums'};
const Card: React.FC<{top: number; h: number; children: React.ReactNode; style?: React.CSSProperties}> = ({top, h, children, style}) => (
  <div style={{position: 'absolute', left: X, width: W, top, height: h, boxSizing: 'border-box', background: AM.row, border: `2px solid ${AM.line}`, borderRadius: 22, ...style}}>{children}</div>
);
const Crumb: React.FC<{children: React.ReactNode}> = ({children}) => (
  <div style={{position: 'absolute', left: X + 4, top: 556, fontFamily: INTER, fontWeight: 500, fontSize: 22, color: AM.grey}}>{children}</div>
);

/* ---------- cabeçalho do app ---------- */
const AppChrome: React.FC<{tab: number}> = ({tab}) => (
  <>
    <div style={{position: 'absolute', left: 60, right: 60, top: 26, display: 'flex', justifyContent: 'space-between', fontFamily: INTER, fontWeight: 600, fontSize: 26, color: AM.grey}}>
      <span>9:41</span>
      <span style={{letterSpacing: '0.2em'}}>●●● ▮</span>
    </div>
    <div style={{position: 'absolute', left: X, right: X, top: 96, display: 'flex', alignItems: 'center', gap: 16}}>
      <span style={{width: 40, height: 40, borderRadius: 10, background: AM.orange}} />
      <span style={{fontFamily: INTER, fontWeight: 700, fontSize: 34, color: AM.text}}>Gerenciador de Anúncios</span>
      <span style={{marginLeft: 'auto', fontFamily: INTER, fontWeight: 600, fontSize: 22, color: AM.text, border: `2px solid ${AM.line}`, borderRadius: 12, padding: '8px 14px'}}>Últimos 7 dias</span>
    </div>
    <div style={{position: 'absolute', left: X, width: W, top: 470, height: 70, borderRadius: 16, background: '#1F2026', display: 'flex', padding: 6, boxSizing: 'border-box', gap: 6}}>
      {TABS.map((t, i) => (
        <div key={t} style={{flex: 1, borderRadius: 12, background: i === tab ? AM.orange : 'transparent', color: i === tab ? AM.dark : AM.grey, display: 'flex', alignItems: 'center', justifyContent: 'center', fontFamily: INTER, fontWeight: 700, fontSize: 24}}>{t}</div>
      ))}
    </div>
  </>
);

/* ---------- campanhas (gancho) ---------- */
const MCampaigns: React.FC<{f: number}> = ({f}) => {
  const spent = interpolate(f, [4, 84], [0, 1237.9], {...clamp, easing: (t) => t * t});
  const pulse = 0.5 + 0.5 * Math.sin(f / 3);
  const rows = [
    {n: '[VENDAS] Black Friday', on: true, r: '0', c: '—', v: brl(spent), hot: true},
    {n: '[LEADS] Formulário', on: true, r: '12', c: brl(18.4), v: brl(220.8)},
    {n: '[TRÁFEGO] Perfil', on: false, r: '0', c: '—', v: brl(0)},
    {n: '[ENGAJAMENTO] Reels', on: true, r: '340', c: brl(0.35), v: brl(119)},
  ];
  return (
    <>
      <Crumb>4 campanhas · Empresa Exemplo</Crumb>
      {rows.map((r, i) => (
        <Card key={r.n} top={TOP + i * 214} h={198} style={{background: r.hot ? `rgba(229,72,77,${0.1 + 0.12 * pulse * (f < 90 ? 1 : 0)})` : AM.row}}>
          <div style={{position: 'absolute', left: 28, top: 24, fontFamily: INTER, fontWeight: 700, fontSize: 30, color: AM.text}}>{r.n}</div>
          <div style={{position: 'absolute', right: 28, top: 26}}><Toggle on={r.on} /></div>
          {[['Resultados', r.r], ['Custo/result.', r.c], ['Valor usado', r.v]].map(([l, v], k) => (
            <div key={l} style={{position: 'absolute', left: 28 + k * 320, top: 96}}>
              <div style={label}>{l}</div>
              <div style={{...val, marginTop: 6, color: r.hot && k === 0 ? AM.red : r.hot && k === 2 ? AM.orange : AM.text}}>{v}</div>
            </div>
          ))}
        </Card>
      ))}
    </>
  );
};

/* ---------- erro 01 · anúncios ---------- */
const MAds: React.FC<{lf: number; fixAt: number}> = ({lf, fixAt}) => {
  const fx = interpolate(lf, [fixAt + 24, fixAt + 90], [0, 1], {...clamp, easing: (t) => 1 - (1 - t) ** 3});
  const grow = ease(lf, 8, 30);
  const bracket = ease(lf, 52, 10) * (lf < fixAt ? 1 : 1 - ease(lf, fixAt, 8));
  const spendFocus = lf >= 108 && lf < 156 ? ease(lf, 108, 8) : 0;
  const totalRes = Math.round(9 + 23 * fx);
  return (
    <>
      <Crumb>[VENDAS] Black Friday › Conjunto 01</Crumb>
      {SPLIT_A.map((a, i) => {
        const flipAt = fixAt + i * 6;
        const flip = interpolate(lf, [flipAt, flipAt + 10], [0, 1], clamp);
        const showB = flip >= 0.5;
        const sy = Math.abs(1 - 2 * flip);
        const share = a + (SPLIT_B[i] - a) * fx;
        const res = Math.round(RES_A[i] + (RES_B[i] - RES_A[i]) * fx);
        const spend = (TOTAL * share) / 100;
        const focus = i === 0 ? spendFocus : 0;
        return (
          <Card key={i} top={TOP + i * 168} h={156} style={{border: `${focus ? 4 : 2}px solid ${focus ? AM.red : AM.line}`, transform: `scale(${1 + 0.02 * focus})`}}>
            <div style={{position: 'absolute', left: 20, top: 16, display: 'flex', gap: 20, transform: `scaleY(${lf >= flipAt && flip < 1 ? Math.max(0.05, sy) : 1})`}}>
              <div style={{transform: 'scale(1.18)', transformOrigin: 'top left'}}><Thumb kind={showB ? DIVERSE[i].k : 'sim'} i={i} /></div>
              <div style={{marginLeft: 36}}>
                <div style={{fontFamily: INTER, fontWeight: 700, fontSize: 28, color: AM.text}}>{showB ? DIVERSE[i].n : `Criativo v${i + 1}`}</div>
                <div style={{fontFamily: INTER, fontWeight: 500, fontSize: 20, color: AM.grey, marginTop: 4}}>{showB ? 'ângulo diferente' : 'mesma imagem, cor trocada'}</div>
              </div>
            </div>
            <div style={{position: 'absolute', left: 160, top: 100, width: 420, height: 16, borderRadius: 8, background: '#2A2B31'}}>
              <div style={{width: `${share * grow}%`, height: '100%', borderRadius: 8, background: i === 0 && fx === 0 ? AM.red : AM.orange}} />
            </div>
            <span style={{...val, fontSize: 24, position: 'absolute', left: 596, top: 92}}>{Math.round(share * grow)}%</span>
            <div style={{position: 'absolute', right: 24, top: 22, textAlign: 'right'}}>
              <div style={label}>Result.</div>
              <div style={{...val, marginTop: 2}}>{res}</div>
              <div style={{...val, fontSize: 22, color: AM.grey, marginTop: 6}}>{res > 0 ? brl(spend / res) : '—'}</div>
            </div>
          </Card>
        );
      })}
      {bracket > 0 && (
        <div style={{position: 'absolute', left: X + 6, top: TOP + 6, width: 140, height: 5 * 168 - 24, border: `4px solid ${AM.red}`, borderRadius: 16, opacity: bracket}}>
          <span style={{position: 'absolute', left: 0, top: -12, transform: 'translateY(-100%)', whiteSpace: 'nowrap', background: AM.red, color: '#fff', fontFamily: INTER, fontWeight: 700, fontSize: 20, padding: '4px 12px', borderRadius: 8}}>QUASE IGUAIS</span>
        </div>
      )}
      <div style={{position: 'absolute', left: X + 4, top: TOP + 5 * 168 + 4, fontFamily: INTER, fontWeight: 600, fontSize: 22, color: AM.grey}}>
        Total: {totalRes} resultados · {brl(TOTAL / totalRes)} por resultado
      </div>
    </>
  );
};

/* ---------- erro 02 · aprendizado ---------- */
const MLearning: React.FC<{lf: number}> = ({lf}) => {
  let prog = 0;
  if (lf < 108) prog = interpolate(lf, [10, 50], [0, 18], clamp);
  else if (lf < 130) prog = interpolate(lf, [108, 120], [18, 0], clamp);
  else if (lf < 194) prog = interpolate(lf, [132, 160], [0, 15], clamp);
  else if (lf < 230) prog = interpolate(lf, [194, 206], [15, 0], clamp);
  else prog = interpolate(lf, [230, 300], [0, 50], clamp);
  const fixed = lf >= 302;
  const day = lf < 130 ? 1 : lf < 220 ? 2 : Math.min(7, 1 + Math.floor((lf - 230) / 10));
  const budget = lf < 106 ? 50 : lf < 192 ? 80 : 120;
  const editing1 = lf >= 86 && lf < 106;
  const editing2 = lf >= 172 && lf < 192;
  const typed = editing1 ? '80'.slice(0, Math.floor(interpolate(lf, [90, 100], [0, 2], clamp))) : '120'.slice(0, Math.floor(interpolate(lf, [176, 188], [0, 3], clamp)));
  const histOut = 1 - ease(lf, 220, 10);
  const flash = (a: number) => (lf >= a && lf < a + 14 ? 1 - (lf - a) / 14 : 0);
  const red = Math.max(flash(108), flash(194));
  return (
    <>
      <Crumb>[VENDAS] Black Friday › Conjuntos</Crumb>
      <div style={{position: 'absolute', right: X, top: 548, fontFamily: INTER, fontWeight: 700, fontSize: 24, color: AM.dark, background: AM.orange, borderRadius: 10, padding: '6px 16px'}}>DIA {day}</div>
      <Card top={TOP} h={520} style={{border: `${red ? 4 : 2}px solid ${red ? AM.red : AM.line}`, boxShadow: red ? `0 0 0 ${8 * red}px rgba(229,72,77,0.25)` : 'none'}}>
        <div style={{position: 'absolute', left: 28, top: 26, fontFamily: INTER, fontWeight: 700, fontSize: 32, color: AM.text}}>Conjunto 01 · Público aberto</div>
        <div style={{position: 'absolute', left: 28, top: 80}}><StatusPill kind={fixed ? 'active' : 'learn'} /></div>
        <div style={{position: 'absolute', left: 28, top: 140, ...label}}>FASE DE APRENDIZADO</div>
        <div style={{position: 'absolute', left: 28, right: 28, top: 178, height: 22, borderRadius: 11, background: '#2A2B31'}}>
          <div style={{width: `${(prog / 50) * 100}%`, height: '100%', borderRadius: 11, background: fixed ? AM.green : AM.orange}} />
        </div>
        <div style={{position: 'absolute', left: 28, top: 214, fontFamily: INTER, fontWeight: 600, fontSize: 26, color: AM.text, fontVariantNumeric: 'tabular-nums'}}>{Math.round(prog)} de ~50 eventos de otimização</div>
        {fixed && <div style={{position: 'absolute', right: 28, top: 216, fontFamily: INTER, fontWeight: 700, fontSize: 24, color: AM.green, opacity: ease(lf, 302, 8)}}>Saiu do aprendizado</div>}
        <div style={{position: 'absolute', left: 28, right: 28, top: 272, borderTop: `2px solid ${AM.line}`}} />
        <div style={{position: 'absolute', left: 28, top: 298, ...label}}>ORÇAMENTO DIÁRIO</div>
        <div style={{position: 'absolute', left: 28, top: 334, display: 'flex', alignItems: 'center', gap: 18}}>
          {editing1 || editing2 ? (
            <span style={{display: 'inline-flex', alignItems: 'center', minWidth: 240, height: 60, border: `3px solid ${AM.orange}`, borderRadius: 12, padding: '0 16px', fontFamily: INTER, fontWeight: 700, fontSize: 32, color: AM.text}}>
              R$ {typed}
              {Math.floor(lf / 7) % 2 === 0 && <span style={{display: 'inline-block', width: 3, height: 34, background: AM.orange, marginLeft: 3}} />}
            </span>
          ) : (
            <span style={{fontFamily: INTER, fontWeight: 700, fontSize: 36, color: AM.text}}>{brl(budget)}</span>
          )}
          <svg width={34} height={34} viewBox="0 0 24 24" fill="none" stroke={AM.grey} strokeWidth={2} strokeLinecap="round"><path d="M4 20h4L19 9l-4-4L4 16z" /></svg>
        </div>
        <div style={{position: 'absolute', left: 28, right: 28, top: 420, borderTop: `2px solid ${AM.line}`}} />
        <div style={{position: 'absolute', left: 28, top: 444, ...label}}>CRIATIVOS</div>
        <div style={{position: 'absolute', right: 28, top: 440, ...val, fontSize: 26}}>5 anúncios</div>
      </Card>
      <div style={{position: 'absolute', left: X + 4, top: TOP + 548, ...label, opacity: histOut}}>HISTÓRICO</div>
      {[{at: 112, t: 'Dia 1 · R$ 50 → R$ 80'}, {at: 198, t: 'Dia 2 · R$ 80 → R$ 120'}].map((h, i) =>
        lf >= h.at ? (
          <Card key={i} top={TOP + 586 + i * 84} h={70} style={{display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '0 24px', opacity: ease(lf, h.at, 8) * histOut}}>
            <span style={{fontFamily: INTER, fontWeight: 600, fontSize: 24, color: AM.text}}>{h.t}</span>
            <span style={{fontFamily: INTER, fontWeight: 700, fontSize: 21, color: AM.red}}>aprendizado reiniciado</span>
          </Card>
        ) : null,
      )}
    </>
  );
};

/* ---------- erro 03 · conjuntos ---------- */
const MAdsets: React.FC<{lf: number}> = ({lf}) => {
  const SEL = 148;
  const MERGE = 162;
  const merge = interpolate(lf, [MERGE, MERGE + 34], [0, 1], {...clamp, easing: (t) => t * t * (3 - 2 * t)});
  const merged = lf >= MERGE + 34;
  const active = lf >= 240;
  const res = merged ? Math.round(interpolate(lf, [200, 280], [0, 27], clamp)) : 0;
  const bracket = ease(lf, 64, 10) * (1 - ease(lf, 130, 8));
  const total = merged ? res : 9;
  const H = 112;
  const G = 10;
  return (
    <>
      <div style={{position: 'absolute', left: X + 4, top: 552, display: 'flex', alignItems: 'center', gap: 14}}>
        <Check on={ease(lf, SEL, 6)} size={30} />
        <span style={{fontFamily: INTER, fontWeight: 500, fontSize: 22, color: AM.grey}}>[LEADS] Formulário › 6 conjuntos</span>
      </div>
      {SETS.map((st, i) => {
        if (i > 0 && merged) return null;
        const appear = ease(lf, 4 + i * 5, 10);
        const ty = i === 0 ? 0 : -(i * (H + G)) * merge;
        const op = i === 0 ? appear : appear * (1 - merge);
        const first = i === 0 && merged;
        return (
          <Card key={st.n} top={TOP + i * (H + G)} h={H} style={{opacity: op, transform: `translateY(${ty}px)`, zIndex: 6 - i, background: first ? 'rgba(255,106,19,0.10)' : AM.row, border: `2px solid ${first ? AM.orange : AM.line}`}}>
            <div style={{position: 'absolute', left: 24, top: 40}}><Check on={first ? 0 : ease(lf, SEL + 2 + i * 2, 6)} size={30} /></div>
            <div style={{position: 'absolute', left: 74, top: 16, fontFamily: INTER, fontWeight: 700, fontSize: 26, color: AM.text}}>{first ? 'Conjunto único · Público aberto' : st.n}</div>
            <div style={{position: 'absolute', left: 74, top: 62}}><StatusPill kind={first ? (active ? 'active' : 'learn') : 'limited'} /></div>
            <div style={{position: 'absolute', right: 24, top: 16, textAlign: 'right'}}>
              <div style={{...val, fontSize: 26}}>{first ? brl(90) : brl(15)}<span style={{...label, fontSize: 19}}>/dia</span></div>
              <div style={{...label, marginTop: 8}}>{first ? res : st.r} result.</div>
            </div>
          </Card>
        );
      })}
      {bracket > 0 && (
        <div style={{position: 'absolute', left: X + 56, top: TOP + 52, width: 380, height: 6 * (H + G) - G - 40, border: `4px solid ${AM.amber}`, borderRadius: 16, opacity: bracket, zIndex: 20}}>
          <span style={{position: 'absolute', left: '100%', marginLeft: 14, top: 0, whiteSpace: 'nowrap', background: AM.amber, color: AM.dark, fontFamily: INTER, fontWeight: 700, fontSize: 20, padding: '4px 12px', borderRadius: 8}}>NENHUM SAI DO APRENDIZADO</span>
        </div>
      )}
      <Card top={TOP + 6 * (H + G) + 12} h={86} style={{display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '0 26px'}}>
        <span style={{...val, fontSize: 24}}>Total {brl(90)}/dia · {total} result.</span>
        <span style={{...val, fontSize: 24, color: merged ? AM.green : AM.text}}>{brl(630 / Math.max(1, total))}/result.</span>
      </Card>
    </>
  );
};

/** Toque do dedo (estilo gravação de tela do celular). */
const Touch: React.FC = () => {
  const f = useCurrentFrame();
  const c = CLICKS.find((t) => f >= t - 12 && f < t + 14);
  if (c === undefined) return null;
  const [x, y] = TAPS[c];
  const inn = ease(f, c - 12, 8);
  const out = interpolate(f, [c + 6, c + 14], [1, 0], clamp);
  const press = f >= c && f < c + 6 ? 0.8 : 1;
  const ring = interpolate(f, [c, c + 14], [0, 1], clamp);
  return (
    <>
      <div style={{position: 'absolute', left: x - 44, top: y - 44, width: 88, height: 88, borderRadius: 44, background: 'rgba(255,255,255,0.35)', border: '3px solid rgba(255,255,255,0.8)', opacity: inn * out, transform: `scale(${press})`}} />
      {f >= c && <div style={{position: 'absolute', left: x - 60, top: y - 60, width: 120, height: 120, borderRadius: 60, border: `4px solid ${AM.orange}`, opacity: 1 - ring, transform: `scale(${0.4 + ring})`}} />}
    </>
  );
};

export const ErrosMobile: React.FC = () => {
  const L = MOBILE_LAYOUT();
  const f = useCurrentFrame();
  const view = f < 150 ? 0 : f < 470 ? 1 : f < 800 ? 2 : 3;
  const start = [0, 150, 470, 800][view];
  const lf = f - start;
  const fadeIn = view === 0 ? 1 : ease(f, start, 8);
  const tab = [0, 2, 1, 1][view];
  const dimHook = interpolate(f, [84, 100], [0.62, 0], clamp);
  const end = ease(f, 1120, 16);
  return (
    <AbsoluteFill style={{background: AM.win}}>
      <AbsoluteFill style={{opacity: 1 - 0.96 * end}}>
        <AppChrome tab={tab} />
        <AbsoluteFill style={{opacity: fadeIn, transform: `translateY(${(1 - fadeIn) * 20}px)`}}>
          {view === 0 && <MCampaigns f={f} />}
          {view === 1 && <MAds lf={lf} fixAt={160} />}
          {view === 2 && <MLearning lf={lf} />}
          {view === 3 && <MAdsets lf={lf} />}
        </AbsoluteFill>
        {view === 2 && (
          <>
            <Toast at={578} to={620} red text="Edição significativa: aprendizado reiniciado" x={170} y={1350} />
            <Toast at={664} to={696} red text="Edição significativa: aprendizado reiniciado" x={170} y={1350} />
            <Toast at={772} to={830} text="Conjunto ativo e estável" x={330} y={1350} />
          </>
        )}
        <Touch />
        <div style={{position: 'absolute', right: X + 4, top: 1452, fontFamily: INTER, fontSize: 20, color: AM.dim}}>*valores ilustrativos</div>
        {/* faixa do título */}
        <div style={{position: 'absolute', left: 0, right: 0, top: 180, height: 280, background: `linear-gradient(${AM.win}, ${AM.win} 80%, rgba(20,21,24,0))`}} />
        <div style={{position: 'absolute', inset: 0, background: '#000', opacity: dimHook}} />
      </AbsoluteFill>
      {/* fundo de baixo (área da legenda do Instagram) */}
      <div style={{position: 'absolute', left: 0, right: 0, top: 1580, bottom: 0, background: `linear-gradient(rgba(14,14,15,0), ${AM.bg} 40%)`}} />
      {TITLES.map(([a, b, n, fix, t]) => (f >= a && f < b ? <Title key={a} n={n} fix={fix} text={t} at={a} size={t.length > 24 ? 62 : 68} top={L.title} /> : null))}
      {CAPS.map(([a, b, t]) => <Caption key={a} from={a} to={b} text={t} top={L.cap} />)}
      <Hook L={L} />
      <Summary L={L} />
      <div style={{position: 'absolute', top: L.wm, left: 80, fontFamily: fonts.display, fontWeight: 700, fontSize: 32, letterSpacing: '0.04em', color: colors.light}}>@workthiago</div>
      <Grain opacity={0.06} />
      <Sfx />
    </AbsoluteFill>
  );
};
