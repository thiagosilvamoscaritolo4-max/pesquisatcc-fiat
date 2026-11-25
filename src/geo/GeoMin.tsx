import '../fonts';
import '@fontsource/inter/400.css';
import '@fontsource/inter/500.css';
import '@fontsource/inter/600.css';
import '@fontsource/inter/700.css';
import React from 'react';
import {AbsoluteFill, Audio, Easing, Sequence, interpolate, staticFile, useCurrentFrame} from 'remotion';
import {Grain} from '../components';

export const GEOMIN_DURATION = 930;

const C = {bg: '#0E0F12', card: '#15171C', soft: '#1C1F26', line: '#262931', text: '#ECECEC', grey: '#8B8D96', dim: '#5C5E66', blue: '#4C7BE8', amber: '#E3A008'};
const INTER = "'Inter', sans-serif";
const clamp = {extrapolateLeft: 'clamp', extrapolateRight: 'clamp'} as const;
const EXPO = Easing.bezier(0.16, 1, 0.3, 1);
const ease = (f: number, a: number, d = 14) => interpolate(f, [a, a + d], [0, 1], {...clamp, easing: EXPO});
const out = (f: number, a: number, d = 12) => interpolate(f, [a, a + d], [1, 0], clamp);
const M = 96; // margem

/** Bloco que entra subindo de leve e some no fim da cena. */
const Scene: React.FC<{from: number; to: number; children: React.ReactNode}> = ({from, to, children}) => {
  const f = useCurrentFrame();
  if (f < from || f > to + 12) return null;
  const o = ease(f, from, 16) * out(f, to);
  return <AbsoluteFill style={{opacity: o, transform: `translateY(${(1 - ease(f, from, 16)) * 16}px)`}}>{children}</AbsoluteFill>;
};
const H: React.FC<{children: React.ReactNode; top: number; size?: number}> = ({children, top, size = 58}) => (
  <div style={{position: 'absolute', left: M, right: M, top, fontFamily: INTER, fontWeight: 600, fontSize: size, lineHeight: 1.15, letterSpacing: '-0.025em', color: C.text}}>{children}</div>
);
const Spark: React.FC<{s: number}> = ({s}) => (
  <svg width={s} height={s} viewBox="0 0 24 24" fill="none" stroke="#fff" strokeWidth={2} strokeLinejoin="round"><path d="M12 3l1.8 5.2L19 10l-5.2 1.8L12 17l-1.8-5.2L5 10l5.2-1.8z" /></svg>
);
const Tag: React.FC<{c: string; children: React.ReactNode; o: number}> = ({c, children, o}) => (
  <span style={{display: 'inline-flex', alignItems: 'center', gap: 8, fontFamily: INTER, fontWeight: 600, fontSize: 19, color: c, border: `1.5px solid ${c}`, borderRadius: 999, padding: '4px 12px', opacity: o}}>
    <span style={{width: 7, height: 7, borderRadius: 4, background: c}} />
    {children}
  </span>
);

/* ---------- 1. pergunta ---------- */
const Intro: React.FC = () => (
  <Scene from={0} to={66}>
    <H top={560} size={62}>
      Como a sua loja aparece<br />no <span style={{color: C.blue}}>ChatGPT</span>?
    </H>
  </Scene>
);

/* ---------- 2. chat ---------- */
const Q = 'loja de roupa barata';
const ANS: [string, string][] = [
  ['Loja Exemplo', 'peças a partir de R$ 39 e nota 4,8'],
  ['Moda Fictícia', 'liquidação toda semana'],
  ['Brechó Modelo', 'seminovos com preço baixo'],
];
const Chat: React.FC = () => {
  const f = useCurrentFrame();
  const A = 72;
  const typed = Math.floor(interpolate(f, [A + 14, A + 50], [0, Q.length], clamp));
  const sent = f >= A + 56;
  const thinking = f >= A + 64 && f < A + 84;
  const tagO = ease(f, A + 190, 14);
  return (
    <Scene from={A} to={384}>
      <H top={150} size={40}>
        <span style={{color: C.grey, fontWeight: 500}}>Alguém pergunta para a IA:</span>
      </H>
      <div style={{position: 'absolute', left: M, right: M, top: 240, height: 860, borderRadius: 28, background: C.card, border: `1px solid ${C.line}`}}>
        {/* pergunta */}
        {sent && (
          <div style={{position: 'absolute', right: 32, top: 36, padding: '12px 20px', borderRadius: '20px 20px 6px 20px', background: C.soft, fontFamily: INTER, fontWeight: 500, fontSize: 26, color: C.text, opacity: ease(f, A + 56, 8)}}>{Q}</div>
        )}
        {/* resposta */}
        {f >= A + 64 && (
          <div style={{position: 'absolute', left: 32, right: 32, top: 128}}>
            <div style={{display: 'flex', alignItems: 'center', gap: 12}}>
              <span style={{width: 34, height: 34, borderRadius: 17, background: C.blue, display: 'inline-flex', alignItems: 'center', justifyContent: 'center'}}><Spark s={18} /></span>
              {thinking ? (
                <span style={{fontFamily: INTER, fontSize: 28, color: C.grey, letterSpacing: '0.2em'}}>
                  {[0, 1, 2].map((i) => <span key={i} style={{opacity: 0.3 + 0.7 * Math.max(0, Math.sin((f - i * 4) / 4))}}>•</span>)}
                </span>
              ) : (
                <span style={{fontFamily: INTER, fontWeight: 500, fontSize: 24, color: C.grey, opacity: ease(f, A + 84, 10)}}>Algumas opções com preço acessível:</span>
              )}
              <span style={{marginLeft: 'auto'}}><Tag c={C.blue} o={tagO}>Orgânico</Tag></span>
            </div>
            {!thinking &&
              ANS.map(([n, d], i) => {
                const p = ease(f, A + 96 + i * 16, 12);
                return (
                  <div key={n} style={{marginTop: i ? 18 : 26, paddingLeft: 46, opacity: p, transform: `translateY(${(1 - p) * 10}px)`}}>
                    <span style={{fontFamily: INTER, fontWeight: 600, fontSize: 26, color: C.text}}>{n}</span>
                    <span style={{fontFamily: INTER, fontWeight: 400, fontSize: 24, color: C.grey}}>  ·  {d}</span>
                  </div>
                );
              })}
          </div>
        )}
        {/* anúncio */}
        {f >= A + 160 && (
          <div style={{position: 'absolute', left: 32, right: 32, top: 470, opacity: ease(f, A + 160, 14), transform: `translateY(${(1 - ease(f, A + 160, 14)) * 14}px)`}}>
            <div style={{display: 'flex', alignItems: 'center', marginBottom: 12}}>
              <span style={{fontFamily: INTER, fontWeight: 500, fontSize: 19, color: C.dim}}>Patrocinado</span>
              <span style={{marginLeft: 'auto'}}><Tag c={C.amber} o={ease(f, A + 200, 14)}>Anúncio</Tag></span>
            </div>
            <div style={{display: 'flex', alignItems: 'center', gap: 18, background: C.soft, borderRadius: 18, padding: 16}}>
              <div style={{width: 64, height: 64, borderRadius: 12, background: '#2B3550', display: 'flex', alignItems: 'center', justifyContent: 'center', fontFamily: INTER, fontWeight: 700, fontSize: 19, color: '#fff'}}>-50%</div>
              <div>
                <div style={{fontFamily: INTER, fontWeight: 600, fontSize: 24, color: C.text}}>Outlet Demonstração</div>
                <div style={{fontFamily: INTER, fontWeight: 400, fontSize: 20, color: C.grey, marginTop: 2}}>Até 50% off em roupas</div>
              </div>
              <span style={{marginLeft: 'auto', fontFamily: INTER, fontWeight: 600, fontSize: 19, color: C.text, border: `1.5px solid ${C.line}`, borderRadius: 999, padding: '8px 16px'}}>Ver loja</span>
            </div>
          </div>
        )}
        {/* legenda das etiquetas */}
        <div style={{position: 'absolute', left: 32, right: 32, top: 660, opacity: ease(f, A + 220, 16)}}>
          <div style={{height: 1, background: C.line, marginBottom: 26}} />
          <div style={{display: 'flex', gap: 40, fontFamily: INTER, fontSize: 22, color: C.grey}}>
            <span><b style={{color: C.blue, fontWeight: 600}}>Orgânico</b> · dentro da resposta</span>
            <span><b style={{color: C.amber, fontWeight: 600}}>Anúncio</b> · abaixo, pago por clique</span>
          </div>
        </div>
        {/* campo */}
        <div style={{position: 'absolute', left: 32, right: 32, bottom: 28, height: 64, borderRadius: 32, border: `1px solid ${f >= A + 10 && !sent ? C.blue : C.line}`, display: 'flex', alignItems: 'center', padding: '0 24px', fontFamily: INTER, fontSize: 24, color: typed && !sent ? C.text : C.dim}}>
          {sent || !typed ? 'Pergunte qualquer coisa' : Q.slice(0, typed)}
          {!sent && f >= A + 10 && Math.floor(f / 7) % 2 === 0 && <span style={{display: 'inline-block', width: 2, height: 26, background: C.blue, marginLeft: 3}} />}
        </div>
      </div>
      <div style={{position: 'absolute', left: M, top: 1124, fontFamily: INTER, fontSize: 18, color: C.dim}}>*simulação ilustrativa · lojas fictícias</div>
    </Scene>
  );
};

/* ---------- 3. diferença ---------- */
const ROWS: [string, string, string][] = [
  ['Onde aparece', 'Abaixo da resposta', 'Dentro da resposta'],
  ['Custo', 'Paga por clique', 'Sem custo por clique'],
  ['Duração', 'Para quando a verba acaba', 'O resultado acumula'],
];
const Diff: React.FC = () => {
  const f = useCurrentFrame();
  const A = 398;
  return (
    <Scene from={A} to={646}>
      <H top={300}>A diferença</H>
      <div style={{position: 'absolute', left: M, right: M, top: 440}}>
        <div style={{display: 'flex', fontFamily: INTER, fontWeight: 600, fontSize: 26, color: C.text, paddingBottom: 22, borderBottom: `1px solid ${C.line}`, opacity: ease(f, A + 14)}}>
          <span style={{width: 220}} />
          <span style={{flex: 1, display: 'flex', alignItems: 'center', gap: 10}}><span style={{width: 10, height: 10, borderRadius: 5, background: C.amber}} />Anúncio</span>
          <span style={{flex: 1, display: 'flex', alignItems: 'center', gap: 10}}><span style={{width: 10, height: 10, borderRadius: 5, background: C.blue}} />Site preparado</span>
        </div>
        {ROWS.map(([l, a, b], i) => {
          const p = ease(f, A + 34 + i * 26);
          return (
            <div key={l} style={{display: 'flex', alignItems: 'center', minHeight: 120, borderBottom: `1px solid ${C.line}`, opacity: p, transform: `translateY(${(1 - p) * 10}px)`}}>
              <span style={{width: 220, fontFamily: INTER, fontWeight: 500, fontSize: 22, color: C.dim}}>{l}</span>
              <span style={{flex: 1, fontFamily: INTER, fontWeight: 500, fontSize: 27, color: C.text, paddingRight: 20}}>{a}</span>
              <span style={{flex: 1, fontFamily: INTER, fontWeight: 500, fontSize: 27, color: C.text}}>{b}</span>
            </div>
          );
        })}
      </div>
    </Scene>
  );
};

/* ---------- 4. o que faz a IA recomendar ---------- */
const ITEMS = ['Dados completos do produto', 'Avaliações de clientes', 'Menções em outros sites'];
const Recs: React.FC = () => {
  const f = useCurrentFrame();
  const A = 660;
  return (
    <Scene from={A} to={800}>
      <H top={360}>
        O que faz a IA<br />recomendar a sua loja
      </H>
      <div style={{position: 'absolute', left: M, right: M, top: 600}}>
        {ITEMS.map((t, i) => {
          const p = ease(f, A + 26 + i * 18);
          return (
            <div key={t} style={{display: 'flex', alignItems: 'center', gap: 22, height: 96, borderBottom: `1px solid ${C.line}`, opacity: p, transform: `translateX(${(1 - p) * -16}px)`}}>
              <svg width={30} height={30} viewBox="0 0 24 24" fill="none" stroke={C.blue} strokeWidth={2.6} strokeLinecap="round" strokeLinejoin="round"><path d="M5 12.5l4.5 4.5L19 7.5" /></svg>
              <span style={{fontFamily: INTER, fontWeight: 500, fontSize: 32, color: C.text}}>{t}</span>
            </div>
          );
        })}
      </div>
    </Scene>
  );
};

/* ---------- 5. fechamento ---------- */
const End: React.FC = () => {
  const f = useCurrentFrame();
  const A = 814;
  if (f < A) return null;
  return (
    <AbsoluteFill>
      <H top={400} size={56}>
        <div style={{opacity: ease(f, A, 16)}}>Anúncio traz<br />visibilidade agora.</div>
        <div style={{opacity: ease(f, A + 14, 16), color: C.blue, marginTop: 26}}>Site preparado traz<br />recomendação sempre.</div>
      </H>
      <div style={{position: 'absolute', left: M, top: 760, fontFamily: INTER, fontWeight: 500, fontSize: 30, color: C.grey, opacity: ease(f, A + 34)}}>O ideal é usar os dois.</div>
      <div style={{position: 'absolute', left: M, top: 880, fontFamily: INTER, fontWeight: 600, fontSize: 24, color: C.text, opacity: ease(f, A + 48)}}>
        Thiago Silva <span style={{color: C.dim, fontWeight: 500}}>· Paid Media Analyst</span>
      </div>
    </AbsoluteFill>
  );
};

/* ---------- sons ---------- */
type Cue = [number, string, number];
const cues: Cue[] = [];
const add = (fs: number[], n: string, v: number) => fs.forEach((x) => cues.push([x, n, v]));
for (let x = 86, k = 0; x <= 122; x += 3, k++) cues.push([x, `key${k % 3}`, 0.2]);
add([126], 'click', 0.45);
add([128], 'sent', 0.3);
add([168, 184, 200], 'tick', 0.18);
add([232], 'open', 0.32);
add([262, 272], 'tick', 0.25);
add([398, 660, 814], 'whoosh', 0.18);
add([432, 458, 484, 686, 704, 722], 'tick', 0.22);
add([830], 'final', 0.32);
const Sfx: React.FC = () => (
  <>
    {cues.map(([x, n, v], i) => (
      <Sequence key={i} from={x} durationInFrames={60} layout="none">
        <Audio src={staticFile(`sfx/${n}.wav`)} volume={v} />
      </Sequence>
    ))}
  </>
);

export const GeoMin: React.FC = () => (
  <AbsoluteFill style={{background: C.bg}}>
    <Intro />
    <Chat />
    <Diff />
    <Recs />
    <End />
    <div style={{position: 'absolute', top: 64, left: M, fontFamily: INTER, fontWeight: 600, fontSize: 22, color: C.grey}}>Thiago Silva</div>
    <Grain opacity={0.04} />
    <Sfx />
    <Audio src={staticFile('music/trilha-leve-31.wav')} volume={0.24} />
  </AbsoluteFill>
);
