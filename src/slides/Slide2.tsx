import React from 'react';
import {Enter, Frame, Highlight, Label, Reveal, headline} from '../components';
import {colors, fonts} from '../theme';

const rows = [
  {t: 'PERGUNTA DO PRODUTO', d: 'Quer entender como funciona, não só o preço.'},
  {t: 'TEM O PROBLEMA', d: 'O que você vende resolve algo que ele vive hoje.'},
  {t: 'TEM ORÇAMENTO', d: 'Consegue pagar o que você cobra.'},
];

const Row: React.FC<{t: string; d: string; dark?: boolean}> = ({t, d, dark}) => (
  <div
    style={{
      display: 'flex',
      alignItems: 'center',
      minHeight: dark ? 94 : 144,
      padding: '0 30px',
      borderRadius: 20,
      border: dark ? 'none' : `3px solid ${colors.dark}`,
      background: dark ? colors.dark : 'transparent',
      color: dark ? colors.orange : colors.dark,
    }}
  >
    <div style={{width: 284, fontFamily: fonts.display, fontWeight: 900, fontSize: 44, lineHeight: 1.05}}>{t}</div>
    <div style={{flex: 1, fontFamily: fonts.body, fontWeight: 600, fontSize: 29, lineHeight: 1.4}}>{d}</div>
  </div>
);

export const Slide2: React.FC = () => (
  <Frame index={2} bg={colors.orange} fg={colors.dark} muted="rgba(11,11,11,0.55)" accent={colors.dark} cta="ARRASTA">
    <Label text="OS SINAIS" delay={4} color={colors.dark} />
    <div style={{...headline, color: colors.dark, marginTop: 28}}>
      <Reveal delay={8}>LEAD</Reveal>
      <div style={{marginTop: 8}}>
        <Highlight delay={14} bg={colors.dark} color={colors.orange}>
          QUALIFICADO.
        </Highlight>
      </div>
    </div>
    <div style={{display: 'flex', flexDirection: 'column', gap: 18, marginTop: 52}}>
      {rows.map((r, i) => (
        <Enter key={i} delay={30 + i * 9} from="right" distance={140}>
          <Row {...r} />
        </Enter>
      ))}
      <Enter delay={64} from="scale">
        <Row t="TEM PRAZO" d={'Quer resolver agora, não "um dia".'} dark />
      </Enter>
    </div>
  </Frame>
);
