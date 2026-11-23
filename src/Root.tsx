import React from 'react';
import {Composition} from 'remotion';
import {Carrossel, totalDuration} from './Carrossel';
import {Frase, frases} from './Frase';

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
  {frases.map((f) => (
    <Composition key={f.id} id={f.id} component={Frase} defaultProps={f.props} durationInFrames={120} fps={30} width={1080} height={1350} />
  ))}
  </>
);
