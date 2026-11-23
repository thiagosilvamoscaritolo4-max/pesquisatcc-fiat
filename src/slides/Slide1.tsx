import React from 'react';
import {interpolate, random, useCurrentFrame, Easing} from 'remotion';
import {Frame, Highlight, Label, Para, Reveal, headline} from '../components';
import {colors, fonts} from '../theme';

const COLS = 12;
const ROWS = 5;
const BUYERS = new Set([7, 22, 30, 41, 53]);

const LeadField: React.FC = () => {
  const frame = useCurrentFrame();
  const dots = [];
  for (let r = 0; r < ROWS; r++) {
    for (let c = 0; c < COLS; c++) {
      const i = r * COLS + c;
      const appear = 95 + random(`a${i}`) * 30;
      const o = interpolate(frame, [appear, appear + 8], [0, 1], {extrapolateLeft: 'clamp', extrapolateRight: 'clamp'});
      const isBuyer = BUYERS.has(i);
      const lit = 160 + [...BUYERS].indexOf(i) * 5;
      const l = isBuyer
        ? interpolate(frame, [lit, lit + 8], [0, 1], {
            extrapolateLeft: 'clamp',
            extrapolateRight: 'clamp',
            easing: Easing.out(Easing.back(1.6)),
          })
        : 0;
      const dim = isBuyer ? 1 : interpolate(frame, [158, 175], [1, 0.35], {extrapolateLeft: 'clamp', extrapolateRight: 'clamp'});
      const ring = isBuyer ? interpolate(frame - lit, [0, 24], [0, 1], {extrapolateLeft: 'clamp', extrapolateRight: 'clamp'}) : 0;
      const showRing = isBuyer && frame > lit;
      dots.push(
        <div
          key={i}
          style={{
            position: 'absolute',
            left: c * 80 + 20,
            top: r * 80 + 20,
            width: 0,
            height: 0,
          }}
        >
          {showRing && (
            <div
              style={{
                position: 'absolute',
                left: -30,
                top: -30,
                width: 60,
                height: 60,
                borderRadius: 30,
                border: `3px solid ${colors.orange}`,
                transform: `scale(${0.4 + ring})`,
                opacity: 1 - ring,
              }}
            />
          )}
          <div
            style={{
              position: 'absolute',
              left: -9,
              top: -9,
              width: 18,
              height: 18,
              borderRadius: 9,
              background: isBuyer && l > 0 ? colors.orange : '#3b3b3b',
              opacity: o * dim,
              transform: `scale(${1 + l * 0.6})`,
            }}
          />
        </div>,
      );
    }
  }
  const caption = interpolate(frame, [180, 192], [0, 1], {extrapolateLeft: 'clamp', extrapolateRight: 'clamp'});
  return (
    <div style={{position: 'absolute', top: 560, left: 0, width: 920, height: 420}}>
      {dots}
      <div
        style={{
          position: 'absolute',
          top: 410,
          left: 0,
          fontFamily: fonts.display,
          fontWeight: 700,
          fontSize: 26,
          letterSpacing: '0.15em',
          color: colors.grey,
          opacity: caption,
        }}
      >
        60 LEADS · <span style={{color: colors.orange}}>5 COMPRADORES</span>
      </div>
    </div>
  );
};

export const Slide1: React.FC = () => (
  <Frame index={1} bg={colors.dark} fg={colors.light} muted={colors.grey} accent={colors.orange} cta="ARRASTA">
    <Label text="LEADS DE ANÚNCIO" delay={6} color={colors.orange} />
    <div style={{...headline, color: colors.light, marginTop: 28}}>
      <Reveal delay={12}>LEAD CURIOSO</Reveal>
      <div style={{display: 'flex', alignItems: 'flex-end', gap: 30, marginTop: 8}}>
        <Reveal delay={18}>OU</Reveal>
        <Highlight delay={24} bg={colors.orange} color={colors.dark}>
          COMPRADOR?
        </Highlight>
      </div>
    </div>
    <Para
      delay={86}
      mark={colors.orange}
      parts={[{t: 'Volume de lead', at: 118, kind: 'strike'}, 'não paga conta. Quem paga é o', {t: 'lead certo.', at: 192}]}
      style={{fontFamily: fonts.body, fontWeight: 600, fontSize: 38, lineHeight: 1.4, color: colors.bodyLight, marginTop: 44}}
    />
    <LeadField />
  </Frame>
);
