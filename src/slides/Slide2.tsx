import React from 'react';
import {Enter, Frame, Highlight, Label, Para, Part, Reveal, headline} from '../components';
import {colors, fonts} from '../theme';

const RD = [97, 170, 219];
const rows: {t: string; d: Part[]}[] = [
  {t: 'PERGUNTA DO PRODUTO', d: ['Quer entender', {t: 'como funciona,', at: RD[0] + 26}, 'não só o preço.']},
  {t: 'TEM O PROBLEMA', d: ['O que você vende resolve algo que ele', {t: 'vive hoje.', at: RD[1] + 22}]},
  {t: 'TEM ORÇAMENTO', d: ['Consegue', {t: 'pagar', at: RD[2] + 18}, 'o que você cobra.']},
];

const Row: React.FC<{t: string; d: Part[]; delay: number; dark?: boolean}> = ({t, d, delay, dark}) => (
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
    <Para delay={delay + 4} parts={d} mark={dark ? colors.orange : colors.dark} style={{flex: 1, fontFamily: fonts.body, fontWeight: 600, fontSize: 29, lineHeight: 1.4}} />
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
        <Enter key={i} delay={RD[i]} from="right" distance={120}>
          <Row {...r} delay={RD[i]} />
        </Enter>
      ))}
      <Enter delay={251} from="scale">
        <Row t="TEM PRAZO" d={['Quer resolver', {t: 'agora,', at: 272}, 'não "um dia".']} delay={251} dark />
      </Enter>
    </div>
  </Frame>
);
