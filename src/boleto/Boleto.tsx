import '../fonts';
import React from 'react';
import {AbsoluteFill, Easing, interpolate, useCurrentFrame} from 'remotion';
import {TransitionSeries, linearTiming} from '@remotion/transitions';
import {wipe} from '../wipe';
import {Grain} from '../components';
import {fonts} from '../theme';
import {C, clamp} from './ui';
import {Final, Hook, Intro, Step1, Step2, Step3, Step4} from './scenes';

const T = 16;
const scenes = [
  {C: Hook, d: 104, step: 0},
  {C: Intro, d: 120, step: 0},
  {C: Step1, d: 176, step: 1},
  {C: Step2, d: 250, step: 2},
  {C: Step3, d: 270, step: 3},
  {C: Step4, d: 196, step: 4},
  {C: Final, d: 200, step: 0},
];
export const boletoDuration = scenes.reduce((a, s) => a + s.d, 0) - T * (scenes.length - 1);
const starts = scenes.map((_, i) => scenes.slice(0, i).reduce((a, s) => a + s.d, 0) - i * T);
const timing = linearTiming({durationInFrames: T, easing: Easing.bezier(0.7, 0, 0.2, 1)});

/** Elementos fixos: @, passo atual e barra de progresso. */
const Chrome: React.FC = () => {
  const f = useCurrentFrame();
  const cur = starts.filter((s) => f >= s + T / 2).length - 1;
  const step = scenes[Math.max(0, cur)].step;
  const stepOpacity = step ? interpolate(f, [starts[cur] + T / 2, starts[cur] + T / 2 + 8], [0, 1], clamp) : 0;
  return (
    <AbsoluteFill style={{pointerEvents: 'none'}}>
      <div style={{position: 'absolute', top: 66, left: 80, fontFamily: fonts.display, fontWeight: 700, fontSize: 32, letterSpacing: '0.04em', color: C.light}}>
        @workthiago
      </div>
      <div style={{position: 'absolute', top: 68, right: 80, fontFamily: fonts.display, fontWeight: 700, fontSize: 30, letterSpacing: '0.15em', color: C.orange, opacity: stepOpacity}}>
        PASSO 0{step} / 04
      </div>
      <div style={{position: 'absolute', left: 0, bottom: 0, height: 8, width: `${(f / (boletoDuration - 1)) * 100}%`, background: C.orange}} />
    </AbsoluteFill>
  );
};

export const Boleto: React.FC = () => (
  <AbsoluteFill style={{background: C.bg}}>
    <TransitionSeries>
      {scenes.map((s, i) => (
        <React.Fragment key={i}>
          <TransitionSeries.Sequence durationInFrames={s.d}>
            <s.C dur={s.d} />
          </TransitionSeries.Sequence>
          {i < scenes.length - 1 && <TransitionSeries.Transition presentation={wipe({edge: C.orange})} timing={timing} />}
        </React.Fragment>
      ))}
    </TransitionSeries>
    <Chrome />
    <Grain opacity={0.08} />
  </AbsoluteFill>
);
