import '../fonts';
import React from 'react';
import {AbsoluteFill, Audio, Sequence, interpolate, staticFile, useCurrentFrame} from 'remotion';
import {Grain} from '../components';
import {C, H, INTER, M, Scene, Spark, Tag, clamp, ease} from './GeoMin';

export const GEOWHY_DURATION = 1200;
const RED = '#E5484D';

const Line: React.FC<{text: React.ReactNode; color: string; top: number; at: number}> = ({text, color, top, at}) => {
  const f = useCurrentFrame();
  return <div style={{position: 'absolute', left: M, right: M, top, fontFamily: INTER, fontWeight: 600, fontSize: 28, color, opacity: ease(f, at, 14)}}>{text}</div>;
};

/* ---------- 1. comportamento ---------- */
const Intro: React.FC = () => {
  const f = useCurrentFrame();
  return (
    <Scene from={0} to={92}>
      <div style={{position: 'absolute', left: M, right: M, top: 520, fontFamily: INTER, fontWeight: 500, fontSize: 40, color: C.grey, letterSpacing: '-0.02em', opacity: ease(f, 4)}}>
        Muita gente já não pesquisa só no Google.
      </div>
      <div style={{position: 'absolute', left: M, right: M, top: 600, fontFamily: INTER, fontWeight: 600, fontSize: 64, color: C.text, letterSpacing: '-0.03em', lineHeight: 1.1, opacity: ease(f, 22)}}>
        Pergunta direto<br />para a <span style={{color: C.blue}}>IA</span>.
      </div>
    </Scene>
  );
};

/* ---------- 2. a mesma pergunta, dois finais ---------- */
const Q = 'loja de roupa barata';
const WITH: [string, string, boolean][] = [
  ['Loja Exemplo', 'peças a partir de R$ 39 e nota 4,8', true],
  ['Moda Fictícia', 'liquidação toda semana', false],
  ['Brechó Modelo', 'seminovos com preço baixo', false],
];
const WITHOUT: [string, string][] = [
  ['Moda Fictícia', 'liquidação toda semana'],
  ['Brechó Modelo', 'seminovos com preço baixo'],
  ['Outlet Demonstração', 'até 50% off'],
];
const Outcomes: React.FC = () => {
  const f = useCurrentFrame();
  const A = 96;
  const B = 312; // troca para "sem presença"
  const typed = Math.floor(interpolate(f, [A + 18, A + 44], [0, Q.length], clamp));
  const sent = f >= A + 48;
  const showA = f < B;
  const listP = (i: number, base: number) => ease(f, base + i * 14, 12);
  const swap = ease(f, B, 14);
  return (
    <Scene from={A} to={490}>
      <H top={160} size={40}><span style={{color: C.grey, fontWeight: 500}}>A mesma pergunta, dois finais:</span></H>
      <div style={{position: 'absolute', left: M, right: M, top: 250, height: 680, borderRadius: 28, background: C.card, border: `1px solid ${C.line}`}}>
        {/* qual final */}
        <div style={{position: 'absolute', left: 32, top: 30}}>
          {f >= A + 60 && (showA ? <Tag c={C.blue} o={ease(f, A + 60)}>Com presença forte</Tag> : <Tag c={RED} o={swap}>Sem presença</Tag>)}
        </div>
        {sent && <div style={{position: 'absolute', right: 32, top: 24, padding: '12px 20px', borderRadius: '20px 20px 6px 20px', background: C.soft, fontFamily: INTER, fontWeight: 500, fontSize: 26, color: C.text}}>{Q}</div>}
        {f >= A + 60 && (
          <div style={{position: 'absolute', left: 32, right: 32, top: 120}}>
            <div style={{display: 'flex', alignItems: 'center', gap: 12}}>
              <span style={{width: 34, height: 34, borderRadius: 17, background: C.blue, display: 'inline-flex', alignItems: 'center', justifyContent: 'center'}}><Spark s={18} /></span>
              <span style={{fontFamily: INTER, fontWeight: 500, fontSize: 24, color: C.grey}}>Algumas opções com preço acessível:</span>
            </div>
            {showA
              ? WITH.map(([n, d, mine], i) => {
                  const p = listP(i, A + 70);
                  const hl = mine ? ease(f, A + 120, 14) : 0;
                  return (
                    <div key={n} style={{marginTop: 16, padding: '16px 18px', borderRadius: 16, background: hl ? `rgba(76,123,232,${0.14 * hl})` : 'transparent', border: `1.5px solid ${hl ? C.blue : 'transparent'}`, opacity: p, display: 'flex', alignItems: 'center'}}>
                      <span style={{fontFamily: INTER, fontWeight: 600, fontSize: 26, color: C.text}}>{i + 1}. {n}</span>
                      <span style={{fontFamily: INTER, fontSize: 23, color: C.grey}}>  ·  {d}</span>
                      {mine && <span style={{marginLeft: 'auto', fontFamily: INTER, fontWeight: 700, fontSize: 18, color: '#fff', background: C.blue, borderRadius: 8, padding: '4px 10px', opacity: hl}}>SUA LOJA</span>}
                    </div>
                  );
                })
              : WITHOUT.map(([n, d], i) => {
                  const p = listP(i, B + 4);
                  return (
                    <div key={n} style={{marginTop: 16, padding: '16px 18px', opacity: p}}>
                      <span style={{fontFamily: INTER, fontWeight: 600, fontSize: 26, color: C.text}}>{i + 1}. {n}</span>
                      <span style={{fontFamily: INTER, fontSize: 23, color: C.grey}}>  ·  {d}</span>
                    </div>
                  );
                })}
            {!showA && (
              <div style={{marginTop: 22, height: 70, borderRadius: 16, border: `2px dashed ${RED}`, display: 'flex', alignItems: 'center', justifyContent: 'center', fontFamily: INTER, fontWeight: 600, fontSize: 24, color: RED, opacity: ease(f, B + 60, 14)}}>
                Sua loja não aparece
              </div>
            )}
          </div>
        )}
        {/* consequência */}
        <div style={{position: 'absolute', left: 32, right: 32, bottom: 40}}>
          <div style={{height: 1, background: C.line, marginBottom: 26}} />
          {showA ? (
            <div style={{fontFamily: INTER, fontWeight: 600, fontSize: 28, color: C.blue, opacity: ease(f, A + 150, 14)}}>→ o cliente clica e compra de você</div>
          ) : (
            <div style={{fontFamily: INTER, fontWeight: 600, fontSize: 28, color: RED, opacity: ease(f, B + 84, 14)}}>→ o cliente nem fica sabendo que você existe</div>
          )}
        </div>
        {/* campo */}
        {!sent && (
          <div style={{position: 'absolute', left: 32, right: 32, top: 120, height: 64, borderRadius: 32, border: `1px solid ${C.blue}`, display: 'flex', alignItems: 'center', padding: '0 24px', fontFamily: INTER, fontSize: 24, color: C.text}}>
            {typed ? Q.slice(0, typed) : <span style={{color: C.dim}}>Pergunte qualquer coisa</span>}
            {Math.floor(f / 7) % 2 === 0 && <span style={{display: 'inline-block', width: 2, height: 26, background: C.blue, marginLeft: 3}} />}
          </div>
        )}
      </div>
      <div style={{position: 'absolute', left: M, top: 954, fontFamily: INTER, fontSize: 18, color: C.dim}}>*simulação ilustrativa · lojas fictícias</div>
    </Scene>
  );
};

/* ---------- 3. por que a IA indica uma loja ---------- */
const SOURCES = ['Site completo', 'Google', 'Avaliações', 'Marketplace', 'Instagram', 'Menções em blogs'];
const Sources: React.FC = () => {
  const f = useCurrentFrame();
  const A = 500;
  const node = {x: 790, y: 660};
  const outP = ease(f, A + 150, 14);
  return (
    <Scene from={A} to={760}>
      <H top={170} size={52}>Por que a IA indica<br />uma loja e não outra?</H>
      <svg width={1080} height={1350} style={{position: 'absolute', left: 0, top: 0}}>
        {SOURCES.map((_, i) => {
          const y = 430 + i * 92 + 32;
          const x0 = M + 360;
          const p = ease(f, A + 40 + i * 12, 20);
          const d = `M${x0},${y} C${x0 + 120},${y} ${node.x - 160},${node.y} ${node.x - 72},${node.y}`;
          const t = ((f - (A + 70 + i * 8)) % 40) / 40;
          return (
            <g key={i} opacity={p}>
              <path d={d} stroke={C.line} strokeWidth={2} fill="none" />
              <path d={d} stroke={C.blue} strokeWidth={2} fill="none" pathLength={1} strokeDasharray={1} strokeDashoffset={1 - p} opacity={0.6} />
              {f > A + 70 + i * 8 && f < A + 230 && (() => {
                // ponto andando pelo fio
                const u = 1 - t;
                const bx = u * u * u * x0 + 3 * u * u * t * (x0 + 120) + 3 * u * t * t * (node.x - 160) + t * t * t * (node.x - 72);
                const by = u * u * u * y + 3 * u * u * t * y + 3 * u * t * t * node.y + t * t * t * node.y;
                return <circle cx={bx} cy={by} r={5} fill={C.blue} />;
              })()}
            </g>
          );
        })}
      </svg>
      {SOURCES.map((s, i) => {
        const p = ease(f, A + 30 + i * 12, 14);
        return (
          <div key={s} style={{position: 'absolute', left: M, top: 430 + i * 92, width: 360, height: 64, borderRadius: 16, background: C.card, border: `1px solid ${C.line}`, display: 'flex', alignItems: 'center', padding: '0 22px', boxSizing: 'border-box', fontFamily: INTER, fontWeight: 600, fontSize: 25, color: C.text, opacity: p, transform: `translateX(${(1 - p) * -20}px)`}}>
            {s}
          </div>
        );
      })}
      <div style={{position: 'absolute', left: node.x - 70, top: node.y - 70, width: 140, height: 140, borderRadius: 70, background: C.blue, display: 'flex', alignItems: 'center', justifyContent: 'center', opacity: ease(f, A + 60, 14), transform: `scale(${0.8 + 0.2 * ease(f, A + 60, 14)})`, boxShadow: `0 0 0 ${10 + 6 * Math.sin(f / 8)}px rgba(76,123,232,0.12)`}}>
        <Spark s={58} />
      </div>
      <div style={{position: 'absolute', left: 600, right: M, top: node.y + 110, padding: '16px 20px', borderRadius: '20px 20px 20px 6px', background: C.soft, fontFamily: INTER, fontWeight: 600, fontSize: 24, color: C.text, opacity: outP, transform: `translateY(${(1 - outP) * 14}px)`}}>
        Recomendo a <span style={{color: C.blue}}>Loja Exemplo</span>
      </div>
      <Line at={A + 180} top={1030} color={C.grey} text="Ela indica quem consegue entender e confirmar em vários lugares, não só no site." />
    </Scene>
  );
};

/* ---------- 4. o problema ---------- */
const PROBLEMS = ['O cliente compra do concorrente', 'Você depende só de anúncio e paga por cada clique', 'Quando a verba acaba, você some'];
const Problem: React.FC = () => {
  const f = useCurrentFrame();
  const A = 772;
  return (
    <Scene from={A} to={1000}>
      <H top={380} size={52}>Quando a sua loja<br /><span style={{color: RED}}>não é recomendada</span>:</H>
      <div style={{position: 'absolute', left: M, right: M, top: 610}}>
        {PROBLEMS.map((t, i) => {
          const p = ease(f, A + 30 + i * 22);
          return (
            <div key={t} style={{display: 'flex', alignItems: 'center', gap: 22, minHeight: 100, borderBottom: `1px solid ${C.line}`, opacity: p, transform: `translateX(${(1 - p) * -16}px)`}}>
              <svg width={28} height={28} viewBox="0 0 24 24" fill="none" stroke={RED} strokeWidth={2.6} strokeLinecap="round"><path d="M6 6l12 12M18 6L6 18" /></svg>
              <span style={{fontFamily: INTER, fontWeight: 500, fontSize: 30, color: C.text}}>{t}</span>
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
  const A = 1012;
  if (f < A) return null;
  return (
    <AbsoluteFill>
      <H top={430} size={58}>
        <div style={{opacity: ease(f, A, 16)}}>Anúncio aluga<br />a atenção.</div>
        <div style={{opacity: ease(f, A + 16, 16), color: C.blue, marginTop: 26}}>Presença forte faz<br />a IA indicar você.</div>
      </H>
      <div style={{position: 'absolute', left: M, top: 860, fontFamily: INTER, fontWeight: 600, fontSize: 24, color: C.text, opacity: ease(f, A + 44)}}>
        Thiago Silva <span style={{color: C.dim, fontWeight: 500}}>· Paid Media Analyst</span>
      </div>
    </AbsoluteFill>
  );
};

/* ---------- sons ---------- */
type Cue = [number, string, number];
const cues: Cue[] = [];
const add = (fs: number[], n: string, v: number) => fs.forEach((x) => cues.push([x, n, v]));
for (let x = 114, k = 0; x <= 140; x += 3, k++) cues.push([x, `key${k % 3}`, 0.2]);
add([144], 'sent', 0.3);
add([166, 180, 194], 'tick', 0.18);
add([216], 'ding', 0.3);
add([312, 500, 772, 1012], 'whoosh', 0.18);
add([372], 'error', 0.28);
add([530, 542, 554, 566, 578, 590], 'tick', 0.18);
add([650], 'open', 0.3);
add([802, 824, 846], 'tick', 0.22);
add([1030], 'final', 0.32);
const Sfx: React.FC = () => (
  <>
    {cues.map(([x, n, v], i) => (
      <Sequence key={i} from={x} durationInFrames={60} layout="none">
        <Audio src={staticFile(`sfx/${n}.wav`)} volume={v} />
      </Sequence>
    ))}
  </>
);

export const GeoWhy: React.FC = () => (
  <AbsoluteFill style={{background: C.bg}}>
    <Intro />
    <Outcomes />
    <Sources />
    <Problem />
    <End />
    <div style={{position: 'absolute', top: 64, left: M, fontFamily: INTER, fontWeight: 600, fontSize: 22, color: C.grey}}>Thiago Silva</div>
    <Grain opacity={0.04} />
    <Sfx />
    <Audio src={staticFile('music/trilha-leve-40.wav')} volume={0.24} />
  </AbsoluteFill>
);
