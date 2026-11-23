import React from 'react';
import {AbsoluteFill} from 'remotion';
import type {TransitionPresentation, TransitionPresentationComponentProps} from '@remotion/transitions';

type Props = {edge: string};

/** Cortina: o próximo slide é revelado da esquerda pra direita, com uma linha marcando a borda. */
const WipeComp: React.FC<TransitionPresentationComponentProps<Props>> = ({
  children,
  presentationDirection,
  presentationProgress: p,
  passedProps,
}) => {
  if (presentationDirection === 'exiting') {
    return <AbsoluteFill style={{transform: `translateX(${-p * 90}px)`}}>{children}</AbsoluteFill>;
  }
  return (
    <AbsoluteFill>
      <AbsoluteFill style={{clipPath: `inset(0 ${(1 - p) * 100}% 0 0)`}}>{children}</AbsoluteFill>
      {p > 0 && p < 1 && (
        <div style={{position: 'absolute', top: 0, bottom: 0, left: `calc(${p * 100}% - 6px)`, width: 12, background: passedProps.edge}} />
      )}
    </AbsoluteFill>
  );
};

export const wipe = (props: Props): TransitionPresentation<Props> => ({component: WipeComp, props});
