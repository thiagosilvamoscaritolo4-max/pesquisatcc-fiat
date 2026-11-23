import React from 'react';
import {Enter, Frame, Highlight, Label, Reveal, Words, headline, useSp} from '../components';
import {colors, fonts} from '../theme';

const Card: React.FC<{title: string; sub: string; text: string; filled?: boolean}> = ({title, sub, text, filled}) => (
  <div
    style={{
      height: 300,
      borderRadius: 22,
      padding: '40px 32px',
      boxSizing: 'border-box',
      background: filled ? colors.orange : colors.dark,
      border: filled ? 'none' : `3px solid ${colors.cardBorder}`,
      color: filled ? colors.dark : colors.light,
    }}
  >
    <div style={{fontFamily: fonts.display, fontWeight: 900, fontSize: 84, lineHeight: 0.9}}>{title}</div>
    <div style={{fontFamily: fonts.display, fontWeight: 900, fontSize: 36, marginTop: 18}}>{sub}</div>
    <div style={{fontFamily: fonts.body, fontWeight: 600, fontSize: 29, lineHeight: 1.4, marginTop: 12}}>{text}</div>
  </div>
);

const Bridge: React.FC = () => {
  const p = useSp(60, {damping: 12, stiffness: 140});
  return (
    <div
      style={{
        position: 'absolute',
        left: '50%',
        top: 150,
        width: 64,
        height: 64,
        marginLeft: -32,
        marginTop: -32,
        borderRadius: 32,
        background: colors.light,
        color: colors.dark,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        fontSize: 34,
        fontWeight: 900,
        transform: `scale(${p}) rotate(${(1 - p) * -180}deg)`,
        boxShadow: '0 8px 30px rgba(0,0,0,0.4)',
      }}
    >
      →
    </div>
  );
};

export const Slide3: React.FC = () => (
  <Frame index={3} bg={colors.dark} fg={colors.light} muted={colors.grey} accent={colors.orange} cta="ARRASTA">
    <Label text="MQL × SQL" delay={4} color={colors.orange} />
    <div style={{...headline, color: colors.light, marginTop: 28}}>
      <Reveal delay={8}>DUAS SIGLAS,</Reveal>
      <div style={{marginTop: 8}}>
        <Highlight delay={14} bg={colors.orange} color={colors.dark}>
          DOIS MOMENTOS.
        </Highlight>
      </div>
    </div>
    <div style={{position: 'relative', display: 'flex', gap: 24, marginTop: 52}}>
      <Enter delay={32} from="left" distance={120} style={{flex: 1}}>
        <Card title="MQL" sub="MARKETING" text="Tem o perfil de quem compra." />
      </Enter>
      <Enter delay={44} from="right" distance={120} style={{flex: 1}}>
        <Card title="SQL" sub="COMERCIAL" text="Conversou e tem intenção real de compra." filled />
      </Enter>
      <Bridge />
    </div>
    <Enter delay={72} from="up" distance={60} style={{marginTop: 20}}>
      <div style={{background: colors.orange, borderRadius: 22, padding: '26px 30px', color: colors.dark}}>
        <div style={{fontFamily: fonts.display, fontWeight: 900, fontSize: 36}}>NA PRÁTICA</div>
        <Words
          delay={80}
          stagger={1.3}
          text="O anúncio entrega o MQL. O comercial transforma em SQL."
          style={{fontFamily: fonts.body, fontWeight: 600, fontSize: 30, marginTop: 6}}
        />
      </div>
    </Enter>
  </Frame>
);
