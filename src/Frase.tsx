import './fonts';
import React from 'react';
import {AbsoluteFill} from 'remotion';
import {Grain, Highlight, Mark, Reveal, useEase} from './components';
import {colors, fonts} from './theme';

export type Seg = {t: string; hl?: boolean; mk?: boolean};
export type FraseProps = {lines: Seg[][]; size: number; theme: 'dark' | 'orange'; cta: string; tag: string};

/** Criativo de frase de impacto (post 4:5). */
export const Frase: React.FC<FraseProps> = ({lines, size, theme, cta, tag}) => {
  const dark = theme === 'dark';
  const bg = dark ? colors.dark : colors.orange;
  const fg = dark ? colors.light : colors.dark;
  const acc = dark ? colors.orange : colors.dark;
  const accText = dark ? colors.dark : colors.orange;
  const muted = dark ? colors.grey : 'rgba(11,11,11,0.55)';
  const q = useEase(0, 20);
  const head = useEase(0, 14);
  const rule = useEase(6 + lines.length * 5 + 10, 20);
  const foot = useEase(6 + lines.length * 5 + 16, 16);
  return (
    <AbsoluteFill style={{background: bg}}>
      {/* topo */}
      <div
        style={{
          position: 'absolute', top: 70, left: 80, right: 80, display: 'flex', justifyContent: 'space-between',
          alignItems: 'center', opacity: head,
        }}
      >
        <div style={{fontFamily: fonts.display, fontWeight: 900, fontSize: 32, color: fg}}>
          ts<sup style={{fontSize: 20, fontWeight: 700}}>↗</sup>
        </div>
        <div style={{fontFamily: fonts.display, fontWeight: 700, fontSize: 30, letterSpacing: '0.17em', color: muted}}>{tag}</div>
      </div>

      {/* aspas + frase */}
      <div style={{position: 'absolute', left: 80, right: 80, top: 190, bottom: 260, display: 'flex', flexDirection: 'column', justifyContent: 'center'}}>
        <div
          style={{
            fontFamily: fonts.display, fontWeight: 900, fontSize: 300, lineHeight: 0.6, color: acc, height: 150,
            opacity: q, transform: `translateY(${(1 - q) * 40}px)`,
          }}
        >
          “
        </div>
        <div style={{fontFamily: fonts.display, fontWeight: 900, fontSize: size, lineHeight: 0.92, color: fg, textTransform: 'uppercase'}}>
          {lines.map((line, li) => (
            <div key={li} style={{display: 'flex', alignItems: 'flex-end', gap: size * 0.2, marginTop: li ? size * 0.06 : 0}}>
              {line.map((s, si) =>
                s.hl ? (
                  <Highlight key={si} delay={6 + li * 5 + si * 2} bg={acc} color={accText}>
                    {s.t}
                  </Highlight>
                ) : (
                  <Reveal key={si} delay={6 + li * 5 + si * 2}>
                    {s.mk ? (
                      <Mark at={6 + lines.length * 5 + 12} color={acc} thickness={Math.round(size * 0.07)}>
                        {s.t}
                      </Mark>
                    ) : (
                      s.t
                    )}
                  </Reveal>
                ),
              )}
            </div>
          ))}
        </div>
      </div>

      {/* rodapé */}
      <div style={{position: 'absolute', left: 80, right: 80, bottom: 150, height: 3, background: fg, opacity: 0.25, transform: `scaleX(${rule})`, transformOrigin: 'left'}} />
      <div
        style={{
          position: 'absolute', left: 80, right: 80, bottom: 80, display: 'flex', justifyContent: 'space-between', alignItems: 'center',
          fontFamily: fonts.display, fontWeight: 700, fontSize: 30, letterSpacing: '0.17em', opacity: foot,
          transform: `translateY(${(1 - foot) * 16}px)`,
        }}
      >
        <div style={{color: muted}}>— TS↗</div>
        <div style={{color: acc}}>{cta}</div>
      </div>
      <Grain opacity={dark ? 0.1 : 0.14} />
    </AbsoluteFill>
  );
};

export const frases: {id: string; props: FraseProps}[] = [
  {
    id: 'Frase1',
    props: {
      theme: 'dark', size: 178, tag: '#VENDAS', cta: 'MANDA PRO SEU COMERCIAL →',
      lines: [[{t: 'NÃO FALTA'}], [{t: 'LEAD.'}], [{t: 'FALTA'}], [{t: 'FOLLOW-UP.', hl: true}]],
    },
  },
  {
    id: 'Frase2',
    props: {
      theme: 'orange', size: 122, tag: '#VENDAS', cta: 'MANDA PRO SEU COMERCIAL →',
      lines: [
        [{t: 'SEU CLIENTE'}],
        [{t: 'NÃO SUMIU.', mk: true}],
        [{t: 'ELE COMPROU'}],
        [{t: 'DE QUEM'}],
        [{t: 'RESPONDEU'}],
        [{t: 'PRIMEIRO.', hl: true}],
      ],
    },
  },
  {
    id: 'Frase3',
    props: {
      theme: 'dark', size: 118, tag: '#LEADS', cta: 'MANDA PRO SEU COMERCIAL →',
      lines: [
        [{t: 'LEAD ESQUECIDO'}],
        [{t: 'NO WHATSAPP É'}],
        [{t: 'DINHEIRO', hl: true}],
        [{t: 'QUE VOCÊ PAGOU'}],
        [{t: 'PRA JOGAR FORA.', mk: true}],
      ],
    },
  },
];
