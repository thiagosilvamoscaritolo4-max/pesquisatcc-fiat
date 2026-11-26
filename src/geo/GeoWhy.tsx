import '../fonts';
import React from 'react';
import {AbsoluteFill, Audio, Sequence, interpolate, staticFile, useCurrentFrame} from 'remotion';
import {Grain} from '../components';
import {C, GEO_STYLE, H, INTER, M, Scene, Spark, Tag, clamp, ease, setGeoStyle} from './GeoMin';
import {fonts} from '../theme';

export const GEOWHY_DURATION = 1455; // sincronizado com public/narracao-ia.mp3
const RED = '#E5484D';

const Line: React.FC<{text: React.ReactNode; color: string; top: number; at: number}> = ({text, color, top, at}) => {
  const f = useCurrentFrame();
  return <div style={{position: 'absolute', left: M, right: M, top, fontFamily: INTER, fontWeight: 600, fontSize: 28, color, opacity: ease(f, at, 14)}}>{text}</div>;
};

/* ---------- 1. comportamento ---------- */
const Intro: React.FC = () => {
  const f = useCurrentFrame();
  return (
    <Scene from={0} to={136}>
      <div style={{position: 'absolute', left: M, right: M, top: 520, fontFamily: INTER, fontWeight: 500, fontSize: 40, color: C.grey, letterSpacing: '-0.02em', opacity: ease(f, 2)}}>
        Muita gente já não pesquisa só no Google.
      </div>
      {GEO_STYLE.ig ? (
        <div style={{position: 'absolute', left: M, right: M, top: 600, fontFamily: fonts.display, fontWeight: 900, fontSize: 104, lineHeight: 0.95, textTransform: 'uppercase', color: C.text, opacity: ease(f, 88)}}>
          Pergunta direto<br />para a <span style={{background: C.blue, color: '#0B0B0B', padding: '0 10px', borderRadius: 8}}>IA.</span>
        </div>
      ) : (
        <div style={{position: 'absolute', left: M, right: M, top: 600, fontFamily: INTER, fontWeight: 600, fontSize: 64, color: C.text, letterSpacing: '-0.03em', lineHeight: 1.1, opacity: ease(f, 88)}}>
          Pergunta direto<br />para a <span style={{color: C.blue}}>IA</span>.
        </div>
      )}
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
  const A = 144;
  const B = 386; // troca para "sem presença" ("No segundo...")
  const TAG = A + 86;
  const LIST = A + 88;
  const HL = A + 141;
  const CONS_A = A + 184;
  const typed = Math.floor(interpolate(f, [A + 12, A + 60], [0, Q.length], clamp));
  const sent = f >= A + 64;
  const showA = f < B;
  const listP = (i: number, base: number) => ease(f, base + i * 16, 12);
  const swap = ease(f, B, 14);
  return (
    <Scene from={A} to={566}>
      <H top={160} size={40}><span style={{color: C.grey, fontWeight: 500}}>A mesma pergunta, dois finais:</span></H>
      <div style={{position: 'absolute', left: M, right: M, top: 250, height: 680, borderRadius: 28, background: C.card, border: `1px solid ${C.line}`}}>
        {/* qual final */}
        <div style={{position: 'absolute', left: 32, top: 30}}>
          {f >= TAG && (showA ? <Tag c={C.blue} o={ease(f, TAG)}>Com presença forte</Tag> : <Tag c={RED} o={swap}>Sem presença</Tag>)}
        </div>
        {sent && <div style={{position: 'absolute', right: 32, top: 24, padding: '12px 20px', borderRadius: '20px 20px 6px 20px', background: C.soft, fontFamily: INTER, fontWeight: 500, fontSize: 26, color: C.text}}>{Q}</div>}
        {f >= TAG && (
          <div style={{position: 'absolute', left: 32, right: 32, top: 120}}>
            <div style={{display: 'flex', alignItems: 'center', gap: 12}}>
              <span style={{width: 34, height: 34, borderRadius: 17, background: C.blue, display: 'inline-flex', alignItems: 'center', justifyContent: 'center'}}><Spark s={18} /></span>
              <span style={{fontFamily: INTER, fontWeight: 500, fontSize: 24, color: C.grey}}>Algumas opções com preço acessível:</span>
            </div>
            {showA
              ? WITH.map(([n, d, mine], i) => {
                  const p = listP(i, LIST);
                  const hl = mine ? ease(f, HL, 14) : 0;
                  return (
                    <div key={n} style={{marginTop: 16, padding: '16px 18px', borderRadius: 16, background: hl ? `rgba(76,123,232,${0.14 * hl})` : 'transparent', border: `1.5px solid ${hl ? C.blue : 'transparent'}`, opacity: p, display: 'flex', alignItems: 'center'}}>
                      <span style={{fontFamily: INTER, fontWeight: 600, fontSize: 26, color: C.text}}>{i + 1}. {n}</span>
                      <span style={{fontFamily: INTER, fontSize: 23, color: C.grey}}>  ·  {d}</span>
                      {mine && <span style={{marginLeft: 'auto', fontFamily: INTER, fontWeight: 700, fontSize: 18, color: '#fff', background: C.blue, borderRadius: 8, padding: '4px 10px', opacity: hl}}>SUA LOJA</span>}
                    </div>
                  );
                })
              : WITHOUT.map(([n, d], i) => {
                  const p = listP(i, B + 27);
                  return (
                    <div key={n} style={{marginTop: 16, padding: '16px 18px', opacity: p}}>
                      <span style={{fontFamily: INTER, fontWeight: 600, fontSize: 26, color: C.text}}>{i + 1}. {n}</span>
                      <span style={{fontFamily: INTER, fontSize: 23, color: C.grey}}>  ·  {d}</span>
                    </div>
                  );
                })}
            {!showA && (
              <div style={{marginTop: 22, height: 70, borderRadius: 16, border: `2px dashed ${RED}`, display: 'flex', alignItems: 'center', justifyContent: 'center', fontFamily: INTER, fontWeight: 600, fontSize: 24, color: RED, opacity: ease(f, B + 79, 14)}}>
                Sua loja não aparece
              </div>
            )}
          </div>
        )}
        {/* consequência */}
        <div style={{position: 'absolute', left: 32, right: 32, bottom: 40}}>
          <div style={{height: 1, background: C.line, marginBottom: 26}} />
          {showA ? (
            <div style={{fontFamily: INTER, fontWeight: 600, fontSize: 28, color: C.blue, opacity: ease(f, CONS_A, 14)}}>→ o cliente clica e compra de você</div>
          ) : (
            <div style={{fontFamily: INTER, fontWeight: 600, fontSize: 28, color: RED, opacity: ease(f, B + 102, 14)}}>→ o cliente nem fica sabendo que você existe</div>
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
  const A = 578;
  const CH = [824, 852, 878, 910, 935, 957]; // cada fonte entra quando é falada
  const NODE = 690;
  const node = {x: 790, y: 660};
  const outP = ease(f, 962, 14);
  return (
    <Scene from={A} to={984}>
      <H top={170} size={52}>Por que a IA indica<br />uma loja e não outra?</H>
      <svg width={1080} height={1350} style={{position: 'absolute', left: 0, top: 0}}>
        {SOURCES.map((_, i) => {
          const y = 430 + i * 92 + 32;
          const x0 = M + 360;
          const p = ease(f, CH[i] + 6, 20);
          const d = `M${x0},${y} C${x0 + 120},${y} ${node.x - 160},${node.y} ${node.x - 72},${node.y}`;
          const t = ((f - (CH[i] + 10)) % 40) / 40;
          return (
            <g key={i} opacity={p}>
              <path d={d} stroke={C.line} strokeWidth={2} fill="none" />
              <path d={d} stroke={C.blue} strokeWidth={2} fill="none" pathLength={1} strokeDasharray={1} strokeDashoffset={1 - p} opacity={0.6} />
              {f > CH[i] + 10 && f < 984 && (() => {
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
        const p = ease(f, CH[i], 14);
        return (
          <div key={s} style={{position: 'absolute', left: M, top: 430 + i * 92, width: 360, height: 64, borderRadius: 16, background: C.card, border: `1px solid ${C.line}`, display: 'flex', alignItems: 'center', padding: '0 22px', boxSizing: 'border-box', fontFamily: INTER, fontWeight: 600, fontSize: 25, color: C.text, opacity: p, transform: `translateX(${(1 - p) * -20}px)`}}>
            {s}
          </div>
        );
      })}
      <div style={{position: 'absolute', left: node.x - 70, top: node.y - 70, width: 140, height: 140, borderRadius: 70, background: C.blue, display: 'flex', alignItems: 'center', justifyContent: 'center', opacity: ease(f, NODE, 14), transform: `scale(${0.8 + 0.2 * ease(f, NODE, 14)})`, boxShadow: `0 0 0 ${10 + 6 * Math.sin(f / 8)}px rgba(76,123,232,0.12)`}}>
        <Spark s={58} />
      </div>
      <div style={{position: 'absolute', left: 600, right: M, top: node.y + 110, padding: '16px 20px', borderRadius: '20px 20px 20px 6px', background: C.soft, fontFamily: INTER, fontWeight: 600, fontSize: 24, color: C.text, opacity: outP, transform: `translateY(${(1 - outP) * 14}px)`}}>
        Recomendo a <span style={{color: C.blue}}>Loja Exemplo</span>
      </div>
      <Line at={NODE + 10} top={1030} color={C.grey} text="Ela indica quem consegue entender e confirmar em vários lugares, não só no site." />
    </Scene>
  );
};

/* ---------- 4. o problema ---------- */
const PROBLEMS = ['O cliente compra do concorrente', 'Você depende só de anúncio e paga por cada clique', 'Quando a verba acaba, você some'];
const Problem: React.FC = () => {
  const f = useCurrentFrame();
  const A = 989;
  const ROW = [1058, 1118, 1204];
  return (
    <Scene from={A} to={1240}>
      <H top={380} size={52}>Quando a sua loja<br /><span style={{color: RED}}>não é recomendada</span>:</H>
      <div style={{position: 'absolute', left: M, right: M, top: 610}}>
        {PROBLEMS.map((t, i) => {
          const p = ease(f, ROW[i]);
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
  const A = 1249;
  if (f < A) return null;
  return (
    <AbsoluteFill>
      <H top={430} size={58}>
        <div style={{opacity: ease(f, A, 16)}}>Anúncio aluga<br />a atenção.</div>
        <div style={{opacity: ease(f, A + 70, 16), color: C.blue, marginTop: 26}}>Presença forte faz<br />a IA indicar você.</div>
      </H>
      {GEO_STYLE.ig ? (
        <div style={{position: 'absolute', left: M, right: M, top: 900, opacity: ease(f, A + 172), transform: `translateY(${(1 - ease(f, A + 172)) * 20}px)`}}>
          <div style={{background: C.blue, borderRadius: 24, padding: '30px 34px', color: '#0B0B0B'}}>
            <div style={{fontFamily: fonts.display, fontWeight: 900, fontSize: 52, lineHeight: 1, textTransform: 'uppercase'}}>Quer que a IA indique a sua loja?</div>
            <div style={{fontFamily: INTER, fontWeight: 600, fontSize: 28, marginTop: 14}}>Chama no direct:</div>
            <div style={{fontFamily: fonts.display, fontWeight: 900, fontSize: 84, lineHeight: 1, marginTop: 4}}>@workthiago</div>
          </div>
        </div>
      ) : (
        <div style={{position: 'absolute', left: M, top: 860, fontFamily: INTER, fontWeight: 600, fontSize: 24, color: C.text, opacity: ease(f, A + 122)}}>
          Thiago Silva <span style={{color: C.dim, fontWeight: 500}}>· Paid Media Analyst</span>
        </div>
      )}
    </AbsoluteFill>
  );
};

/* ---------- sons ---------- */
type Cue = [number, string, number];
const cues: Cue[] = [];
const add = (fs: number[], n: string, v: number) => fs.forEach((x) => cues.push([x, n, v]));
for (let x = 156, k = 0; x <= 204; x += 4, k++) cues.push([x, `key${k % 3}`, 0.16]);
add([208], 'sent', 0.25);
add([285], 'ding', 0.25);
add([386, 578, 989, 1249], 'whoosh', 0.14);
add([465], 'error', 0.2);
add([824, 852, 878, 910, 935, 957], 'tick', 0.16);
add([962], 'open', 0.22);
add([1058, 1118, 1204], 'tick', 0.18);
add([1325], 'final', 0.24);
const Sfx: React.FC = () => (
  <>
    {cues.map(([x, n, v], i) => (
      <Sequence key={i} from={x} durationInFrames={60} layout="none">
        <Audio src={staticFile(`sfx/${n}.wav`)} volume={v} />
      </Sequence>
    ))}
  </>
);

const Content: React.FC<{watermark: boolean}> = ({watermark}) => (
  <>
    <Intro />
    <Outcomes />
    <Sources />
    <Problem />
    <End />
    {watermark && <div style={{position: 'absolute', top: 64, left: M, fontFamily: INTER, fontWeight: 600, fontSize: 22, color: C.grey}}>Thiago Silva</div>}
  </>
);
const Sound: React.FC = () => (
  <>
    <Sfx />
    <Audio src={staticFile('narracao-ia.mp3')} volume={1} />
    <Audio src={staticFile('music/trilha-leve-48.wav')} volume={0.12} />
  </>
);

export const GeoWhy: React.FC = () => {
  setGeoStyle(false);
  return (
    <AbsoluteFill style={{background: C.bg}}>
      <Content watermark />
      <Grain opacity={0.04} />
      <Sound />
    </AbsoluteFill>
  );
};

/** Reels do @workthiago: tela cheia 9:16, conteúdo dentro da área segura do Instagram. */
export const GEOWHY_REELS_DURATION = 1530;
export const GeoWhyReels: React.FC = () => {
  setGeoStyle(true);
  return (
    <AbsoluteFill style={{background: C.bg}}>
      {/* área segura: topo 269 px, embaixo 672 px (35%), laterais 65 px e ícones à direita */}
      <div style={{position: 'absolute', left: -10, top: 190, width: 1080, height: 1350, transform: 'scale(0.92)', transformOrigin: 'top left'}}>
        <Content watermark={false} />
      </div>
      <div style={{position: 'absolute', top: 272, left: 78, fontFamily: fonts.display, fontWeight: 700, fontSize: 30, letterSpacing: '0.04em', color: C.text}}>@workthiago</div>
      <Grain opacity={0.06} />
      <Sound />
    </AbsoluteFill>
  );
};

/** Feed 4:5 do @workthiago (mesma comunicação do Reels). */
export const GeoWhyIgFeed: React.FC = () => {
  setGeoStyle(true);
  return (
    <AbsoluteFill style={{background: C.bg}}>
      <Content watermark={false} />
      <div style={{position: 'absolute', top: 58, left: M, fontFamily: fonts.display, fontWeight: 700, fontSize: 32, letterSpacing: '0.04em', color: C.text}}>@workthiago</div>
      <Grain opacity={0.06} />
      <Sound />
    </AbsoluteFill>
  );
};
