import React from 'react';
import {Composition} from 'remotion';
import {Carrossel, totalDuration} from './Carrossel';

export const Root: React.FC = () => (
  <>
  <Composition
    id="Reels"
    component={Carrossel}
    durationInFrames={totalDuration}
    fps={30}
    width={1080}
    height={1920}
  />
  <Composition
    id="Carrossel"
    component={Carrossel}
    durationInFrames={totalDuration}
    fps={30}
    width={1080}
    height={1350}
  />
  </>
);
