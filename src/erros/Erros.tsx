import '../fonts';
import '@fontsource/inter/400.css';
import '@fontsource/inter/500.css';
import '@fontsource/inter/600.css';
import '@fontsource/inter/700.css';
import React from 'react';
import {AbsoluteFill, Audio, Sequence, interpolate, staticFile, useCurrentFrame} from 'remotion';
import {Grain, Highlight, Reveal, headline} from '../components';
import {colors, fonts} from '../theme';
import {Key, camAtKeys} from '../fluxo/canvas';
import {Cursor} from '../fluxo/windows';
import {AM, Caption, Chrome, INTER, Mini, Title, WIN, clamp, ease, pathAt} from './ui';
import {PENCIL, ViewAds, ViewAdsets, ViewCampaigns, ViewLearning} from './views';

export const ERROS_DURATION = 1290;

type Fmt = 'feed' | 'reels';
const LAYOUT = {
  feed: {wm: 58, title: 128, win: {x: 40, y: 270, s: 1}, cap: 1194, hook: 330, sum: 190, cta: 720},
  // Reels: fora das áreas do Instagram (topo, legenda embaixo e ícones à direita)
  reels: {wm: 250, title: 330, win: {x: 30, y: 470, s: 0.92}, cap: 1330, hook: 560, sum: 400, cta: 930},
};
type L = (typeof LAYOUT)['feed'];

const ZOOM: Key[] = [
  [0, 640, 220, 1.35], [84, 640, 220, 1.35], [112, 500, 450, 1], [196, 500, 450, 1],
  [216, 230, 520, 1.4], [258, 230, 520, 1.4], [274, 600, 520, 1.4], [306, 600, 520, 1.4], [326, 500, 450, 1],
  [470, 500, 450, 1], [500, 420, 400, 1.3], [690, 420, 400, 1.3], [708, 500, 420, 1.1], [800, 500, 450, 1],
  [846, 500, 450, 1], [862, 510, 444, 1.3], [926, 510, 444, 1.3], [944, 500, 450, 1], [1290, 500, 450, 1],
];
const CURSOR: [number, number, number][] = [
  [96, 820, 760], [132, 496, 92], [170, 640, 640], [210, 70, 300], [250, 70, 740], [266, 540, 276], [300, 540, 276], [330, 900, 820],
  [440, 900, 820], [464, 300, 92], [520, 600, 640], [550, PENCIL.x, PENCIL.y], [600, 300, 560], [636, PENCIL.x, PENCIL.y], [700, 900, 800],
  [780, 900, 800], [794, 330, 142], [840, 860, 820], [920, 860, 820], [944, 36, 192], [1000, 700, 800],
];
const CLICKS = [136, 468, 556, 642, 798, 948];

const TITLES: [number, number, number, boolean, string, number?][] = [
  [150, 310, 1, false, 'CRIATIVOS QUASE IGUAIS'],
  [310, 470, 1, true, 'VARIE O CRIATIVO DE VERDADE'],
  [470, 690, 2, false, 'MEXER NA CAMPANHA TODO DIA'],
  [690, 800, 2, true, 'DEIXE O ALGORITMO APRENDER'],
  [800, 930, 3, false, 'VERBA PICADA EM 6 CONJUNTOS'],
  [930, 1120, 3, true, 'CONCENTRE A VERBA'],
];
const CAPS: [number, number, string][] = [
  [200, 256, 'Pro algoritmo, quase igual é o mesmo anúncio'],
  [262, 304, 'Resultado: 1 anúncio leva quase toda a verba'],
  [330, 466, 'Mude o ângulo, o formato e a mensagem'],
  [520, 600, 'Cada edição grande reinicia o aprendizado'],
  [604, 686, 'E o algoritmo volta pro zero. De novo.'],
  [700, 796, 'Espere ~50 eventos em 7 dias antes de mexer'],
  [856, 926, 'Verba picada: nenhum conjunto junta dados'],
  [940, 1116, 'Menos conjuntos, mais dados em cada um'],
];

/* ---------------- sons ---------------- */
type Cue = [number, string, number];
const cues: Cue[] = [];
const add = (fs: number[], n: string, v: number) => fs.forEach((f) => cues.push([f, n, v]));
add([0], 'impact', 0.55);
for (let f = 6; f <= 84; f += 3) cues.push([f, 'tick', 0.12]);
add([84, 196, 258, 306, 470, 690, 846, 926, 1120], 'whoosh', 0.28);
add(CLICKS, 'click', 0.7);
add([565, 570, 650, 654, 658], 'key0', 0.35);
add([576, 662], 'key1', 0.5);
add([202, 578, 664], 'error', 0.42);
add([864], 'error', 0.3);
add([315, 321, 327, 333, 339, 950, 952, 954, 956, 958, 960, 962, 1140, 1150, 1160], 'tick', 0.3);
for (let f = 700; f <= 770; f += 10) cues.push([f, 'tick', 0.25]);
add([400], 'ding', 0.35);
add([772, 1040], 'success', 0.45);
add([964], 'whoosh', 0.3);
add([1180], 'final', 0.45);
const Sfx: React.FC = () => (
  <>
    {cues.map(([f, n, v], i) => (
      <Sequence key={i} from={f} durationInFrames={60} layout="none">
        <Audio src={staticFile(`sfx/${n}.wav`)} volume={v} />
      </Sequence>
    ))}
  </>
);

/* ---------------- final ---------------- */
const Summary: React.FC<{L: L}> = ({L}) => {
  const f = useCurrentFrame();
  if (f < 1124) return null;
  const items = ['Varie o criativo de verdade', 'Espere ~50 eventos antes de mexer', 'Concentre a verba em menos conjuntos'];
  return (
    <>
      <div style={{position: 'absolute', left: 80, right: 80, top: L.sum, opacity: ease(f, 1124, 12)}}>
        <div style={{fontFamily: fonts.display, fontWeight: 800, fontSize: 32, letterSpacing: '0.16em', color: AM.orange}}>RESUMO</div>
        {items.map((t, i) => {
          const p = ease(f, 1134 + i * 10, 12);
          return (
            <div key={t} style={{display: 'flex', alignItems: 'center', gap: 22, marginTop: 26, opacity: p, transform: `translateX(${(1 - p) * -30}px)`}}>
              <span style={{width: 56, height: 56, borderRadius: 28, background: AM.orange, display: 'inline-flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0}}><Mini kind="check" color={AM.dark} size={34} /></span>
              <span style={{fontFamily: INTER, fontWeight: 700, fontSize: 40, color: AM.text}}>{t}</span>
            </div>
          );
        })}
      </div>
      <div style={{position: 'absolute', left: 80, right: 80, top: L.cta, ...headline, fontSize: 112, color: colors.light}}>
        <Reveal delay={1172}>SALVA E MANDA</Reveal>
        <div style={{marginTop: 8}}>
          <Highlight delay={1178} bg={colors.orange} color={colors.dark}>PRO SEU GESTOR.</Highlight>
        </div>
        <div style={{fontFamily: fonts.display, fontWeight: 700, fontSize: 40, letterSpacing: '0.06em', marginTop: 34, textTransform: 'none', opacity: ease(f, 1192, 12)}}>@workthiago</div>
      </div>
    </>
  );
};

const Hook: React.FC<{L: L}> = ({L}) => {
  const f = useCurrentFrame();
  const o = interpolate(f, [84, 98], [1, 0], clamp);
  if (o <= 0) return null;
  return (
    <div style={{position: 'absolute', left: 80, right: 80, top: L.hook, opacity: o, ...headline, fontSize: 128, color: colors.light}}>
      <Reveal delay={2}>3 ERROS QUE</Reveal>
      <Reveal delay={6}>QUEIMAM SEU</Reveal>
      <div style={{marginTop: 10}}>
        <Highlight delay={12} bg={colors.orange} color={colors.dark}>ORÇAMENTO</Highlight>
      </div>
      <Reveal delay={20} style={{marginTop: 10}}>NO META ADS.</Reveal>
    </div>
  );
};

export const Erros: React.FC<{format?: Fmt}> = ({format = 'feed'}) => {
  const L = LAYOUT[format];
  const f = useCurrentFrame();
  const cam = camAtKeys(ZOOM, f);
  const cur = pathAt(CURSOR, f);
  const press = CLICKS.some((c) => f >= c && f < c + 6) ? 1 : 0;
  const view = f < 150 ? 0 : f < 470 ? 1 : f < 800 ? 2 : 3;
  const start = [0, 150, 470, 800][view];
  const lf = f - start;
  const fadeIn = view === 0 ? 1 : ease(f, start, 8);
  const tab = ([0, 2, 1, 1] as const)[view];
  const dimHook = interpolate(f, [84, 100], [0.6, 0], clamp);
  const end = ease(f, 1120, 16);
  const ripple = CLICKS.map((c) => (f >= c && f < c + 16 ? {c, r: (f - c) / 16} : null)).find(Boolean);
  return (
    <AbsoluteFill style={{background: AM.bg}}>
      <div
        style={{
          position: 'absolute', left: L.win.x, top: L.win.y, width: WIN.w, height: WIN.h, borderRadius: 26, overflow: 'hidden', transformOrigin: '0 0',
          background: AM.win, border: `2px solid ${AM.line}`, boxShadow: '0 30px 80px rgba(0,0,0,0.6)',
          opacity: 1 - 0.96 * end, transform: `scale(${L.win.s * (1 - 0.06 * end)})`,
        }}
      >
        <div style={{position: 'absolute', left: 0, top: 0, width: WIN.w, height: WIN.h, transform: `translate(${WIN.w / 2 - cam.x * cam.z}px, ${WIN.h / 2 - cam.y * cam.z}px) scale(${cam.z})`, transformOrigin: '0 0'}}>
          <Chrome tab={tab} />
          <div style={{position: 'absolute', inset: 0, opacity: fadeIn}}>
            {view === 0 && <ViewCampaigns f={f} />}
            {view === 1 && <ViewAds lf={lf} fixAt={160} />}
            {view === 2 && <ViewLearning lf={lf} />}
            {view === 3 && <ViewAdsets lf={lf} />}
          </div>
          {ripple && (
            <div style={{position: 'absolute', left: pathAt(CURSOR, ripple.c).x - 50, top: pathAt(CURSOR, ripple.c).y - 50, width: 100, height: 100, borderRadius: 50, border: `4px solid ${AM.orange}`, transform: `scale(${0.2 + ripple.r})`, opacity: 1 - ripple.r}} />
          )}
          {f >= 96 && f < 1120 && <Cursor x={cur.x} y={cur.y} press={press} />}
        </div>
        <div style={{position: 'absolute', inset: 0, background: '#000', opacity: dimHook}} />
      </div>
      {TITLES.map(([a, b, n, fix, t]) => (f >= a && f < b ? <Title key={a} n={n} fix={fix} text={t} at={a} size={t.length > 24 ? 60 : 66} top={L.title} /> : null))}
      {CAPS.map(([a, b, t]) => <Caption key={a} from={a} to={b} text={t} top={L.cap} />)}
      <Hook L={L} />
      <Summary L={L} />
      <div style={{position: 'absolute', top: L.wm, left: 80, fontFamily: fonts.display, fontWeight: 700, fontSize: 32, letterSpacing: '0.04em', color: colors.light}}>@workthiago</div>
      <Grain opacity={0.06} />
      <Sfx />
    </AbsoluteFill>
  );
};
