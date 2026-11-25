import React from 'react';
import {interpolate, useCurrentFrame} from 'remotion';
import {AM, Check, INTER, StatusPill, Toast, Toggle, brl, clamp, ease} from './ui';

const H: React.CSSProperties = {fontFamily: INTER, fontWeight: 600, fontSize: 19, color: AM.grey, letterSpacing: '0.02em'};
const T: React.CSSProperties = {fontFamily: INTER, fontWeight: 600, fontSize: 23, color: AM.text};
const Foot: React.FC<{children?: React.ReactNode}> = ({children}) => (
  <div style={{position: 'absolute', left: 24, right: 24, bottom: 18, display: 'flex', justifyContent: 'space-between', fontFamily: INTER, fontSize: 18, color: AM.dim}}>
    <span>{children}</span>
    <span>*valores ilustrativos</span>
  </div>
);

/* ===================== Campanhas (gancho) ===================== */
export const ViewCampaigns: React.FC<{f: number}> = ({f}) => {
  const spent = interpolate(f, [4, 84], [0, 1237.9], {...clamp, easing: (t) => t * t});
  const pulse = 0.5 + 0.5 * Math.sin(f / 3);
  const rows = [
    {n: '[VENDAS] Black Friday', on: true, r: '0', c: '—', v: brl(spent), hot: true},
    {n: '[LEADS] Formulário', on: true, r: '12', c: brl(18.4), v: brl(220.8)},
    {n: '[TRÁFEGO] Perfil', on: false, r: '0', c: '—', v: brl(0)},
    {n: '[ENGAJAMENTO] Reels', on: true, r: '340', c: brl(0.35), v: brl(119)},
  ];
  const cols = [64, 430, 560, 700, 840];
  return (
    <>
      <div style={{position: 'absolute', left: 0, right: 0, top: 136, height: 48, borderBottom: `2px solid ${AM.line}`}}>
        {['Campanha', 'Status', 'Resultados', 'Custo/result.', 'Valor usado'].map((h, i) => <span key={h} style={{...H, position: 'absolute', left: cols[i], top: 14}}>{h}</span>)}
      </div>
      {rows.map((r, i) => (
        <div key={r.n} style={{position: 'absolute', left: 0, right: 0, top: 184 + i * 72, height: 72, borderBottom: `2px solid ${AM.line}`, background: r.hot ? `rgba(229,72,77,${0.08 + 0.1 * pulse * (f < 90 ? 1 : 0)})` : i % 2 ? AM.rowAlt : AM.row}}>
          <span style={{position: 'absolute', left: 24, top: 24}}><Check on={0} /></span>
          <span style={{...T, position: 'absolute', left: cols[0], top: 22}}>{r.n}</span>
          <span style={{position: 'absolute', left: cols[1], top: 23}}><Toggle on={r.on} /></span>
          <span style={{...T, position: 'absolute', left: cols[2], top: 22, color: r.hot ? AM.red : AM.text}}>{r.r}</span>
          <span style={{...T, position: 'absolute', left: cols[3], top: 22}}>{r.c}</span>
          <span style={{...T, position: 'absolute', left: cols[4], top: 22, color: r.hot ? AM.orange : AM.text, fontVariantNumeric: 'tabular-nums'}}>{r.v}</span>
        </div>
      ))}
      <Foot>4 campanhas</Foot>
    </>
  );
};

/* ===================== Erro 01 · anúncios ===================== */
type Kind = 'sim' | 'depo' | 'antes' | 'oferta' | 'bast' | 'perg';
const Thumb: React.FC<{kind: Kind; i: number}> = ({kind, i}) => {
  const box: React.CSSProperties = {width: 84, height: 104, borderRadius: 10, overflow: 'hidden', position: 'relative', flexShrink: 0, fontFamily: INTER};
  if (kind === 'sim') {
    const hues = ['#FF6A13', '#FF7A1F', '#FF6A13', '#F2641A', '#FF7413'];
    return (
      <div style={{...box, background: '#26272D'}}>
        <div style={{position: 'absolute', left: 14 + (i % 2) * 2, top: 14, width: 56, height: 46, borderRadius: 6, background: hues[i]}} />
        <div style={{position: 'absolute', left: 14, top: 68, width: 56, height: 7, borderRadius: 3, background: '#ECECEC'}} />
        <div style={{position: 'absolute', left: 14, top: 82, width: 36 + i, height: 7, borderRadius: 3, background: '#8B8D96'}} />
      </div>
    );
  }
  if (kind === 'depo') {
    return (
      <div style={{...box, background: '#2B2440'}}>
        <div style={{position: 'absolute', left: 26, top: 14, width: 32, height: 32, borderRadius: 16, background: '#C9B8FF'}} />
        <div style={{position: 'absolute', left: 10, top: 52, fontSize: 34, color: '#fff', fontWeight: 700, lineHeight: 1}}>“</div>
        <div style={{position: 'absolute', left: 28, top: 60, width: 46, height: 6, borderRadius: 3, background: '#fff'}} />
        <div style={{position: 'absolute', left: 28, top: 72, width: 36, height: 6, borderRadius: 3, background: '#bbb'}} />
      </div>
    );
  }
  if (kind === 'antes') {
    return (
      <div style={{...box, display: 'flex'}}>
        <div style={{flex: 1, background: '#4A4B52', color: '#ddd', fontSize: 11, fontWeight: 700, display: 'flex', alignItems: 'flex-end', justifyContent: 'center', paddingBottom: 8}}>ANTES</div>
        <div style={{flex: 1, background: '#FF6A13', color: '#111', fontSize: 11, fontWeight: 700, display: 'flex', alignItems: 'flex-end', justifyContent: 'center', paddingBottom: 8}}>DEPOIS</div>
      </div>
    );
  }
  if (kind === 'oferta') {
    return (
      <div style={{...box, background: '#F4D35E', color: '#111', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center'}}>
        <div style={{fontSize: 30, fontWeight: 800, lineHeight: 1}}>-30%</div>
        <div style={{fontSize: 12, fontWeight: 700, marginTop: 6}}>SÓ HOJE</div>
      </div>
    );
  }
  if (kind === 'bast') {
    return (
      <div style={{...box, background: '#1F3A34', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', gap: 6}}>
        <svg width={40} height={30} viewBox="0 0 24 18"><rect x="1" y="3" width="16" height="13" rx="3" stroke="#9FE3C8" strokeWidth={2} fill="none" /><path d="M17 8l6-4v11l-6-4z" fill="#9FE3C8" /></svg>
        <div style={{fontSize: 10, fontWeight: 700, color: '#9FE3C8'}}>BASTIDORES</div>
      </div>
    );
  }
  return (
    <div style={{...box, background: '#1E3A6E', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 58, fontWeight: 800, color: '#fff'}}>?</div>
  );
};

const SPLIT_A = [92, 2, 2, 2, 2];
const SPLIT_B = [31, 24, 19, 15, 11];
const RES_A = [9, 0, 0, 0, 0];
const RES_B = [11, 8, 6, 4, 3];
const DIVERSE: {k: Kind; n: string}[] = [
  {k: 'depo', n: 'Depoimento'}, {k: 'antes', n: 'Antes e depois'}, {k: 'oferta', n: 'Oferta direta'}, {k: 'bast', n: 'Bastidores'}, {k: 'perg', n: 'Pergunta'},
];
const TOTAL = 432.9;

export const ViewAds: React.FC<{lf: number; fixAt: number}> = ({lf, fixAt}) => {
  const fx = interpolate(lf, [fixAt + 24, fixAt + 90], [0, 1], {...clamp, easing: (t) => 1 - (1 - t) ** 3});
  const grow = ease(lf, 8, 30);
  const bracket = ease(lf, 52, 10) * (lf < fixAt ? 1 : 1 - ease(lf, fixAt, 8));
  const totalRes = Math.round(9 + (32 - 9) * fx);
  return (
    <>
      <div style={{position: 'absolute', left: 24, top: 132, fontFamily: INTER, fontWeight: 500, fontSize: 19, color: AM.grey}}>[VENDAS] Black Friday  ›  Conjunto 01 · Público aberto</div>
      <div style={{position: 'absolute', left: 0, right: 0, top: 168, height: 46, borderBottom: `2px solid ${AM.line}`}}>
        {[['Anúncio', 24], ['Parte da verba', 420], ['Resultados', 700], ['Custo/result.', 840]].map(([h, x]) => <span key={h as string} style={{...H, position: 'absolute', left: x as number, top: 13}}>{h}</span>)}
      </div>
      {SPLIT_A.map((a, i) => {
        const flipAt = fixAt + i * 6;
        const flip = interpolate(lf, [flipAt, flipAt + 10], [0, 1], clamp);
        const showB = flip >= 0.5;
        const sy = Math.abs(1 - 2 * flip);
        const share = a + (SPLIT_B[i] - a) * fx;
        const res = Math.round(RES_A[i] + (RES_B[i] - RES_A[i]) * fx);
        const spend = (TOTAL * share) / 100;
        const cost = res > 0 ? brl(spend / res) : '—';
        return (
          <div key={i} style={{position: 'absolute', left: 0, right: 0, top: 216 + i * 120, height: 120, borderBottom: `2px solid ${AM.line}`, background: i % 2 ? AM.rowAlt : AM.row}}>
            <div style={{position: 'absolute', left: 24, top: 8, display: 'flex', alignItems: 'center', gap: 18, transform: `scaleY(${lf >= flipAt && flip < 1 ? Math.max(0.05, sy) : 1})`}}>
              <Thumb kind={showB ? DIVERSE[i].k : 'sim'} i={i} />
              <div>
                <div style={{...T}}>{showB ? DIVERSE[i].n : `Criativo v${i + 1}`}</div>
                <div style={{fontFamily: INTER, fontWeight: 500, fontSize: 18, color: AM.grey, marginTop: 4}}>{showB ? 'ângulo diferente' : 'mesma imagem, cor trocada'}</div>
              </div>
            </div>
            <div style={{position: 'absolute', left: 420, top: 44, width: 200, height: 14, borderRadius: 7, background: '#2A2B31'}}>
              <div style={{width: `${share * grow}%`, height: '100%', borderRadius: 7, background: i === 0 && fx === 0 ? AM.red : AM.orange}} />
            </div>
            <span style={{...T, position: 'absolute', left: 630, top: 38, fontSize: 21, fontVariantNumeric: 'tabular-nums'}}>{Math.round(share * grow)}%</span>
            <span style={{...T, position: 'absolute', left: 700, top: 40, fontVariantNumeric: 'tabular-nums'}}>{res}</span>
            <span style={{...T, position: 'absolute', left: 840, top: 40, fontVariantNumeric: 'tabular-nums'}}>{cost}</span>
          </div>
        );
      })}
      {bracket > 0 && (
        <div style={{position: 'absolute', left: 14, top: 222, width: 104, height: 588, border: `4px solid ${AM.red}`, borderRadius: 14, opacity: bracket}}>
          <span style={{position: 'absolute', left: 116, top: -8, transform: 'translateY(-100%)', whiteSpace: 'nowrap', background: AM.red, color: '#fff', fontFamily: INTER, fontWeight: 700, fontSize: 18, padding: '4px 10px', borderRadius: 8}}>QUASE IGUAIS</span>
        </div>
      )}
      <Foot>Total: {totalRes} resultados · {brl(TOTAL / totalRes)} por resultado</Foot>
    </>
  );
};

/* ===================== Erro 02 · aprendizado ===================== */
export const ViewLearning: React.FC<{lf: number}> = ({lf}) => {
  // dia 1: 0→18 · edita · reinicia | dia 2: 0→15 · edita · reinicia | correção: 7 dias sem mexer → 50
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
  const typed1 = '80'.slice(0, Math.floor(interpolate(lf, [90, 100], [0, 2], clamp)));
  const typed2 = '120'.slice(0, Math.floor(interpolate(lf, [176, 188], [0, 3], clamp)));
  const histOut = 1 - ease(lf, 220, 10);
  const flash = (a: number) => (lf >= a && lf < a + 14 ? 1 - (lf - a) / 14 : 0);
  const red = Math.max(flash(108), flash(194));
  return (
    <>
      <div style={{position: 'absolute', left: 24, top: 132, fontFamily: INTER, fontWeight: 500, fontSize: 19, color: AM.grey}}>[VENDAS] Black Friday  ›  Conjuntos</div>
      <div style={{position: 'absolute', right: 24, top: 126, fontFamily: INTER, fontWeight: 700, fontSize: 22, color: AM.dark, background: AM.orange, borderRadius: 10, padding: '6px 16px'}}>DIA {day}</div>
      <div style={{position: 'absolute', left: 24, right: 24, top: 180, height: 360, background: AM.row, border: `2px solid ${red > 0 ? AM.red : AM.line}`, borderRadius: 18, boxShadow: red > 0 ? `0 0 0 ${6 * red}px rgba(229,72,77,0.25)` : 'none'}}>
        <div style={{position: 'absolute', left: 28, top: 24, display: 'flex', alignItems: 'center', gap: 24}}>
          <span style={{...T, fontSize: 28, fontWeight: 700}}>Conjunto 01 · Público aberto</span>
          <StatusPill kind={fixed ? 'active' : 'learn'} />
        </div>
        <div style={{position: 'absolute', left: 28, top: 92, ...H}}>FASE DE APRENDIZADO</div>
        <div style={{position: 'absolute', left: 28, right: 28, top: 126, height: 18, borderRadius: 9, background: '#2A2B31'}}>
          <div style={{width: `${(prog / 50) * 100}%`, height: '100%', borderRadius: 9, background: fixed ? AM.green : AM.orange}} />
        </div>
        <div style={{position: 'absolute', left: 28, top: 156, fontFamily: INTER, fontWeight: 600, fontSize: 22, color: AM.text, fontVariantNumeric: 'tabular-nums'}}>
          {Math.round(prog)} de ~50 eventos de otimização
        </div>
        {fixed && <div style={{position: 'absolute', left: 520, top: 156, fontFamily: INTER, fontWeight: 700, fontSize: 20, color: AM.green, opacity: ease(lf, 302, 8)}}>Saiu do aprendizado</div>}
        <div style={{position: 'absolute', left: 28, right: 28, top: 214, borderTop: `2px solid ${AM.line}`}} />
        <div style={{position: 'absolute', left: 28, top: 236, ...H}}>ORÇAMENTO DIÁRIO</div>
        <div style={{position: 'absolute', left: 28, top: 270, display: 'flex', alignItems: 'center', gap: 16}}>
          {editing1 || editing2 ? (
            <span style={{display: 'inline-flex', alignItems: 'center', minWidth: 220, height: 50, border: `2px solid ${AM.orange}`, borderRadius: 10, padding: '0 14px', fontFamily: INTER, fontWeight: 600, fontSize: 26, color: AM.text}}>
              R$ {editing1 ? typed1 : typed2}
              {Math.floor(lf / 7) % 2 === 0 && <span style={{display: 'inline-block', width: 3, height: 28, background: AM.orange, marginLeft: 3}} />}
            </span>
          ) : (
            <span style={{fontFamily: INTER, fontWeight: 700, fontSize: 30, color: AM.text}}>{brl(budget)}</span>
          )}
          <svg width={30} height={30} viewBox="0 0 24 24" fill="none" stroke={AM.grey} strokeWidth={2} strokeLinecap="round"><path d="M4 20h4L19 9l-4-4L4 16z" /></svg>
        </div>
        <div style={{position: 'absolute', left: 560, top: 236, ...H}}>CRIATIVOS</div>
        <div style={{position: 'absolute', left: 560, top: 272, ...T, fontSize: 26}}>5 anúncios</div>
      </div>
      {/* histórico de edições */}
      <div style={{position: 'absolute', left: 24, top: 566, ...H, opacity: histOut}}>HISTÓRICO</div>
      {[
        {at: 112, t: 'Dia 1 · Orçamento R$ 50 → R$ 80'},
        {at: 198, t: 'Dia 2 · Orçamento R$ 80 → R$ 120'},
      ].map((h, i) =>
        lf >= h.at ? (
          <div key={i} style={{position: 'absolute', left: 24, right: 24, top: 600 + i * 70, height: 58, borderRadius: 12, background: AM.row, border: `2px solid ${AM.line}`, display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '0 20px', opacity: ease(lf, h.at, 8) * histOut}}>
            <span style={{...T, fontSize: 21}}>{h.t}</span>
            <span style={{fontFamily: INTER, fontWeight: 700, fontSize: 19, color: AM.red}}>aprendizado reiniciado</span>
          </div>
        ) : null,
      )}
      <Toast at={108} to={150} red text="Edição significativa: aprendizado reiniciado" x={150} y={556} />
      <Toast at={194} to={226} red text="Edição significativa: aprendizado reiniciado" x={150} y={556} />
      <Toast at={302} to={360} text="Conjunto ativo e estável" x={290} y={556} />
      <Foot>Edições grandes: orçamento, público, criativo, lance</Foot>
    </>
  );
};
export const PENCIL = {x: 214, y: 476};

/* ===================== Erro 03 · conjuntos ===================== */
const SETS = [
  {n: 'Interesse: Marketing', r: 2}, {n: 'Interesse: Empreendedores', r: 1}, {n: 'Semelhante 1%', r: 3},
  {n: 'Interesse: Vendas', r: 0}, {n: 'Remarketing 30 dias', r: 1}, {n: 'Interesse: Negócios', r: 2},
];
export const ViewAdsets: React.FC<{lf: number}> = ({lf}) => {
  const SEL = 148;
  const MERGE = 162;
  const merge = interpolate(lf, [MERGE, MERGE + 34], [0, 1], {...clamp, easing: (t) => t * t * (3 - 2 * t)});
  const merged = lf >= MERGE + 34;
  const active = lf >= 240;
  const res = merged ? Math.round(interpolate(lf, [200, 280], [0, 27], clamp)) : 0;
  const bracket = ease(lf, 64, 10) * (1 - ease(lf, 130, 8));
  const cols = [64, 400, 660, 790, 890];
  const total = merged ? res : 9;
  return (
    <>
      <div style={{position: 'absolute', left: 24, top: 132, fontFamily: INTER, fontWeight: 500, fontSize: 19, color: AM.grey}}>[LEADS] Formulário  ›  Conjuntos</div>
      <div style={{position: 'absolute', left: 0, right: 0, top: 168, height: 46, borderBottom: `2px solid ${AM.line}`}}>
        <span style={{position: 'absolute', left: 24, top: 10}}><Check on={ease(lf, SEL, 6)} /></span>
        {['Conjunto', 'Status', 'Orçamento', 'Result.', 'Custo'].map((h, i) => <span key={h} style={{...H, position: 'absolute', left: cols[i], top: 13}}>{h}</span>)}
      </div>
      {SETS.map((s, i) => {
        const appear = ease(lf, 4 + i * 5, 10);
        const y = 216 + i * 76;
        const ty = i === 0 ? 0 : -(i * 76) * merge;
        const op = i === 0 ? appear : appear * (1 - merge);
        if (i > 0 && merged) return null;
        const first = i === 0 && merged;
        return (
          <div key={s.n} style={{position: 'absolute', left: 0, right: 0, top: y, height: 76, borderBottom: `2px solid ${AM.line}`, background: first ? 'rgba(255,106,19,0.10)' : i % 2 ? AM.rowAlt : AM.row, opacity: op, transform: `translateY(${ty}px)`, zIndex: 6 - i}}>
            <span style={{position: 'absolute', left: 24, top: 26}}><Check on={first ? 0 : ease(lf, SEL + 2 + i * 2, 6)} /></span>
            <span style={{...T, position: 'absolute', left: cols[0], top: 24, fontSize: 22}}>{first ? 'Conjunto único · Público aberto' : s.n}</span>
            <span style={{position: 'absolute', left: cols[1], top: 26}}><StatusPill kind={first ? (active ? 'active' : 'learn') : 'limited'} /></span>
            <span style={{...T, position: 'absolute', left: cols[2], top: 24, fontSize: 22}}>{first ? brl(90) : brl(15)}</span>
            <span style={{...T, position: 'absolute', left: cols[3], top: 24, fontSize: 22, fontVariantNumeric: 'tabular-nums'}}>{first ? res : s.r}</span>
            <span style={{...T, position: 'absolute', left: cols[4], top: 24, fontSize: 20, fontVariantNumeric: 'tabular-nums'}}>{first ? (res ? brl(630 / res) : '—') : s.r ? brl(105 / s.r) : '—'}</span>
          </div>
        );
      })}
      {bracket > 0 && (
        <div style={{position: 'absolute', left: cols[1] - 12, top: 220, width: 252, height: 452, border: `4px solid ${AM.amber}`, borderRadius: 14, opacity: bracket}}>
          <span style={{position: 'absolute', left: 0, top: -10, transform: 'translateY(-100%)', whiteSpace: 'nowrap', background: AM.amber, color: AM.dark, fontFamily: INTER, fontWeight: 700, fontSize: 18, padding: '4px 10px', borderRadius: 8}}>NENHUM SAI DO APRENDIZADO</span>
        </div>
      )}
      <div style={{position: 'absolute', left: 24, right: 24, top: 700, height: 64, borderRadius: 12, background: AM.row, border: `2px solid ${AM.line}`, display: 'flex', alignItems: 'center', padding: '0 20px', gap: 30, fontFamily: INTER, fontWeight: 600, fontSize: 22, color: AM.text, fontVariantNumeric: 'tabular-nums'}}>
        <span>Total {brl(90)}/dia</span>
        <span>{total} resultados</span>
        <span style={{color: merged ? AM.green : AM.text}}>{brl(630 / Math.max(1, total))} por resultado</span>
      </div>
      <Foot>{merged ? '1 conjunto ativo' : '6 conjuntos · R$ 15/dia cada'}</Foot>
    </>
  );
};
