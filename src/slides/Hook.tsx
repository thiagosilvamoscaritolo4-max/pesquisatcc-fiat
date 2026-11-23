import React from 'react';
import {Easing, interpolate, useCurrentFrame} from 'remotion';
import {Enter, Frame, Highlight, Mark, Reveal, headline} from '../components';
import {colors, fonts} from '../theme';

const Stat: React.FC<{label: string; value: number; filled?: boolean; shake?: number}> = ({label, value, filled, shake = 0}) => (
  <div
    style={{
      flex: 1,
      height: 250,
      borderRadius: 22,
      padding: '30px 32px',
      boxSizing: 'border-box',
      background: filled ? colors.orange : colors.dark,
      border: filled ? 'none' : `3px solid ${colors.cardBorder}`,
      color: filled ? colors.dark : colors.light,
      transform: `translateX(${shake}px)`,
    }}
  >
    <div style={{fontFamily: fonts.display, fontWeight: 700, fontSize: 30, letterSpacing: '0.17em'}}>{label}</div>
    <div style={{fontFamily: fonts.display, fontWeight: 900, fontSize: 150, lineHeight: 1, marginTop: 14, fontVariantNumeric: 'tabular-nums'}}>
      {value}
    </div>
  </div>
);

export const Hook: React.FC = () => {
  const frame = useCurrentFrame();
  const leads = Math.round(
    interpolate(frame, [18, 60], [0, 127], {extrapolateLeft: 'clamp', extrapolateRight: 'clamp', easing: Easing.out(Easing.cubic)}),
  );
  const shakeT = frame - 52;
  const shake = shakeT > 0 && shakeT < 16 ? Math.sin(shakeT * 2.2) * 12 * (1 - shakeT / 16) : 0;
  const nuncaShake = 0;
  return (
    <Frame index={0} showCounter={false} bg={colors.dark} fg={colors.light} muted={colors.grey} accent={colors.orange} cta="ARRASTA">
      <div style={{...headline, color: colors.light}}>
        <Reveal delay={0}>VOCÊ TÁ <Mark at={12} color={colors.orange} thickness={10}>PAGANDO</Mark></Reveal>
        <Reveal delay={4}>POR LEAD QUE</Reveal>
        <div style={{marginTop: 8, transform: `translateX(${nuncaShake}px)`}}>
          <Highlight delay={10} bg={colors.orange} color={colors.dark}>
            NUNCA
          </Highlight>
        </div>
        <Reveal delay={16} style={{marginTop: 8}}>VAI COMPRAR.</Reveal>
      </div>
      <div style={{display: 'flex', gap: 24, marginTop: 56}}>
        <Enter delay={20} from="left" distance={100} style={{flex: 1, display: 'flex'}}>
          <Stat label="LEADS" value={leads} />
        </Enter>
        <Enter delay={26} from="right" distance={100} style={{flex: 1, display: 'flex'}}>
          <Stat label="VENDAS" value={3} filled shake={shake} />
        </Enter>
      </div>
    </Frame>
  );
};
