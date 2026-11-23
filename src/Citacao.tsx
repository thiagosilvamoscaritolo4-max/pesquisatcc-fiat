import './fonts';
import '@fontsource/barlow-condensed/400.css';
import React from 'react';
import {AbsoluteFill} from 'remotion';
import {Grain} from './components';
import {colors, fonts} from './theme';

export type CitacaoProps = {text: string; author: string; size: number; theme: 'orange' | 'dark'};

/** Frase de impacto minimalista: fundo chapado, frase grande, assinatura. */
export const Citacao: React.FC<CitacaoProps> = ({text, author, size, theme}) => {
  const orange = theme === 'orange';
  const fg = orange ? colors.dark : colors.light;
  return (
    <AbsoluteFill style={{background: orange ? colors.orange : colors.dark, justifyContent: 'center', padding: '0 96px'}}>
      <div
        style={{
          fontFamily: fonts.display, fontWeight: 900, fontSize: size, lineHeight: 0.98, letterSpacing: '-0.005em',
          textTransform: 'uppercase', color: fg,
        }}
      >
        {text}
      </div>
      <div
        style={{
          fontFamily: fonts.display, fontWeight: 400, fontSize: 44, letterSpacing: '0.02em', textTransform: 'uppercase',
          color: orange ? 'rgba(11,11,11,0.7)' : colors.orange, marginTop: 22,
        }}
      >
        {author}
      </div>
      <Grain opacity={orange ? 0.12 : 0.08} />
    </AbsoluteFill>
  );
};

const author = 'Thiago Silva';
export const citacoes: {id: string; props: CitacaoProps}[] = [
  {id: 'Citacao1', props: {author, theme: 'orange', size: 118, text: 'Seu cliente não sumiu. Ele comprou de quem respondeu primeiro.'}},
  {id: 'Citacao2', props: {author, theme: 'orange', size: 150, text: 'Não falta lead. Falta follow-up.'}},
  {id: 'Citacao3', props: {author, theme: 'orange', size: 112, text: 'Lead esquecido no WhatsApp é dinheiro que você pagou pra jogar fora.'}},
  {id: 'Motivacao', props: {author, theme: 'orange', size: 112, text: 'Ninguém vê os dias em que você continuou sem vontade. Mas todo mundo vai ver o resultado.'}},
  {id: 'Biblia', props: {author: 'Gálatas 6:9', theme: 'orange', size: 106, text: 'E não nos cansemos de fazer o bem, pois no tempo próprio colheremos, se não\u00A0desanimarmos.'}},
];
