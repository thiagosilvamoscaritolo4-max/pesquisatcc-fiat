import './fonts';
import React from 'react';
import {AbsoluteFill, Audio, interpolate, staticFile, useCurrentFrame, useVideoConfig} from 'remotion';
import {colors} from './theme';
import {TransitionSeries, linearTiming} from '@remotion/transitions';
import {Easing} from 'remotion';
import {wipe} from './wipe';
import {Hook} from './slides/Hook';
import {Slide1} from './slides/Slide1';
import {Slide2} from './slides/Slide2';
import {Slide3} from './slides/Slide3';
import {Slide4} from './slides/Slide4';

// Duração de cada slide em frames (30 fps). Ajustar aqui para casar com o áudio.
// Tempos sincronizados com a narração (public/narracao.mp3, cortando 3,3s de silêncio inicial).
// Frame (30fps) em que começa a transição para cada slide + frame final:
const X = [68, 284, 614, 1135];
const END = 1668;
const T0 = 18;
export const durations = [X[0] + T0, ...X.slice(1).map((x, i) => x - X[i] + T0), END - X[3]]; // gancho + 4 slides
const T = T0;
const timing = linearTiming({durationInFrames: T, easing: Easing.bezier(0.7, 0, 0.2, 1)});
const edges = [colors.orange, colors.light, colors.light, colors.light];

export const totalDuration = durations.reduce((a, b) => a + b, 0) - T * (durations.length - 1);

const slides = [Hook, Slide1, Slide2, Slide3, Slide4];

// início de cada slide na linha do tempo
const starts = durations.map((_, i) => durations.slice(0, i).reduce((a, b) => a + b, 0) - i * T);
const darkSlide = [true, true, false, true, false];

/** Barra de progresso em 4 segmentos (só no Reels). */
const Progress: React.FC = () => {
  const frame = useCurrentFrame();
  const current = starts.filter((s) => frame >= s + T / 2).length - 1;
  const fill = darkSlide[Math.max(0, current)] ? colors.orange : colors.dark;
  return (
    <div style={{position: 'absolute', top: 360, left: 80, right: 80, display: 'flex', gap: 10}}>
      {durations.slice(1).map((d, k) => {
        const i = k + 1; // pula o gancho
        const p = interpolate(frame, [starts[i], starts[i] + d - (i < durations.length - 1 ? T : 0)], [0, 1], {
          extrapolateLeft: 'clamp',
          extrapolateRight: 'clamp',
        });
        return (
          <div key={i} style={{flex: 1, height: 6, borderRadius: 3, background: 'rgba(128,128,128,0.35)', overflow: 'hidden'}}>
            <div style={{width: `${p * 100}%`, height: '100%', background: fill}} />
          </div>
        );
      })}
    </div>
  );
};

export const Carrossel: React.FC = () => {
  const reels = useVideoConfig().height > 1500;
  return (
  <AbsoluteFill style={{background: '#0B0B0B'}}>
    <TransitionSeries>
      {slides.map((S, i) => (
        <React.Fragment key={i}>
          <TransitionSeries.Sequence durationInFrames={durations[i]}>
            <S />
          </TransitionSeries.Sequence>
          {i < slides.length - 1 && (
            <TransitionSeries.Transition presentation={wipe({edge: edges[i]})} timing={timing} />
          )}
        </React.Fragment>
      ))}
    </TransitionSeries>
    {reels && <Progress />}
    <Audio src={staticFile('narracao.mp3')} trimBefore={99} />
  </AbsoluteFill>
  );
};
