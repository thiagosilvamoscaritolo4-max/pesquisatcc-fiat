import './fonts';
import React from 'react';
import {AbsoluteFill} from 'remotion';
import {TransitionSeries, springTiming} from '@remotion/transitions';
import {slide} from '@remotion/transitions/slide';
import {Slide1} from './slides/Slide1';
import {Slide2} from './slides/Slide2';
import {Slide3} from './slides/Slide3';
import {Slide4} from './slides/Slide4';

// Duração de cada slide em frames (30 fps). Ajustar aqui para casar com o áudio.
export const durations = [150, 165, 165, 190];
const T = 20;
const timing = springTiming({config: {damping: 200}, durationInFrames: T});

export const totalDuration = durations.reduce((a, b) => a + b, 0) - T * (durations.length - 1);

const slides = [Slide1, Slide2, Slide3, Slide4];

export const Carrossel: React.FC = () => (
  <AbsoluteFill style={{background: '#0B0B0B'}}>
    <TransitionSeries>
      {slides.map((S, i) => (
        <React.Fragment key={i}>
          <TransitionSeries.Sequence durationInFrames={durations[i]}>
            <S />
          </TransitionSeries.Sequence>
          {i < slides.length - 1 && (
            <TransitionSeries.Transition presentation={slide({direction: 'from-right'})} timing={timing} />
          )}
        </React.Fragment>
      ))}
    </TransitionSeries>
  </AbsoluteFill>
);
