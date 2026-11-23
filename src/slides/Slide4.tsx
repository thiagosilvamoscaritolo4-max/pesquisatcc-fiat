import React from 'react';
import {interpolate, useCurrentFrame} from 'remotion';
import {Enter, Frame, Highlight, Label, Para, Reveal, headline} from '../components';
import {colors, fonts} from '../theme';

const QD = [98, 136, 206];
const qs = [
  {n: '01', t: 'POR QUE AGORA?', q: '"O que te fez procurar isso agora?"'},
  {n: '02', t: 'JÁ TENTOU?', q: '"Você já tentou resolver de outro jeito?"'},
  {n: '03', t: 'PRAZO', q: '"Pra quando você precisa disso?"'},
];

const Num: React.FC<{n: string; delay: number}> = ({n, delay}) => {
  const frame = useCurrentFrame();
  const target = parseInt(n, 10);
  const v = Math.round(interpolate(frame, [delay, delay + 14], [0, target], {extrapolateLeft: 'clamp', extrapolateRight: 'clamp'}));
  return <>{String(v).padStart(2, '0')}</>;
};

export const Slide4: React.FC = () => {
  const frame = useCurrentFrame();
  return (
    <Frame index={4} bg={colors.orange} fg={colors.dark} muted="rgba(11,11,11,0.55)" accent={colors.dark} cta="SALVA ESSE POST" arrow={false} ctaPulseAt={451}>
      <Label text="NA PRÁTICA" delay={4} color={colors.dark} />
      <div style={{...headline, color: colors.dark, marginTop: 28}}>
        <Reveal delay={8}>3 PERGUNTAS PRA</Reveal>
        <div style={{marginTop: 8}}>
          <Highlight delay={14} bg={colors.dark} color={colors.orange}>
            QUALIFICAR.
          </Highlight>
        </div>
      </div>
      <div style={{display: 'flex', flexDirection: 'column', gap: 16, marginTop: 46}}>
        {qs.map((x, i) => (
          <Enter key={i} delay={QD[i]} from="up" distance={70}>
            <div
              style={{
                display: 'flex',
                alignItems: 'center',
                height: 132,
                padding: '0 30px',
                borderRadius: 20,
                border: `3px solid ${colors.dark}`,
                color: colors.dark,
              }}
            >
              <div style={{width: 142, fontFamily: fonts.display, fontWeight: 900, fontSize: 72}}>
                <Num n={x.n} delay={QD[i]} />
              </div>
              <div>
                <div style={{fontFamily: fonts.display, fontWeight: 900, fontSize: 44}}>{x.t}</div>
                <Para
                  delay={QD[i] + 8}
                  mark={colors.dark}
                  parts={[x.q]}
                  style={{fontFamily: fonts.body, fontWeight: 600, fontSize: 29, marginTop: 2}}
                />
              </div>
            </div>
          </Enter>
        ))}
        <Enter delay={281} from="scale">
          <div style={{background: colors.dark, borderRadius: 20, padding: '26px 30px', color: colors.orange}}>
            <div style={{fontFamily: fonts.display, fontWeight: 900, fontSize: 36}}>COMO LER</div>
            <Para
              delay={289}
              mark={colors.orange}
              parts={['Resposta', {t: 'vaga', at: 300, kind: 'strike'}, 'indica curioso. Resposta com', {t: 'contexto e prazo', at: 385}, 'indica comprador.']}
              style={{fontFamily: fonts.body, fontWeight: 600, fontSize: 31, lineHeight: 1.35, marginTop: 6}}
            />
          </div>
        </Enter>
      </div>
    </Frame>
  );
};
