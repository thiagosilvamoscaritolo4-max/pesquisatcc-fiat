import './fonts';
import '@fontsource/inter/500.css';
import '@fontsource/inter/800.css';
import React from 'react';
import {AbsoluteFill} from 'remotion';
import {colors} from './theme';

export type FraseCleanProps = {parts: {t: string; accent?: boolean}[]; handle: string; dark?: boolean};

/** Frase minimalista: fundo liso, frase em negrito, trecho em destaque e @ embaixo. */
export const FraseClean: React.FC<FraseCleanProps> = ({parts, handle, dark}) => (
  <AbsoluteFill style={{background: dark ? colors.dark : '#FFFFFF', justifyContent: 'center', padding: '0 92px'}}>
    <div style={{fontFamily: "'Inter', sans-serif", fontWeight: 800, fontSize: 82, lineHeight: 1.06, letterSpacing: '-0.035em', color: dark ? '#F4F3EF' : '#0B0B0B'}}>
      {parts.map((p, i) => (
        <span key={i} style={{color: p.accent ? colors.orange : undefined}}>{p.t}</span>
      ))}
    </div>
    <div style={{fontFamily: "'Inter', sans-serif", fontWeight: 500, fontSize: 38, letterSpacing: '-0.01em', color: dark ? '#8A8A8A' : '#7A7A7A', marginTop: 44}}>{handle}</div>
  </AbsoluteFill>
);

const handle = '@workthiago';
export const frasesClean: {id: string; props: FraseCleanProps}[] = [
  {id: 'Clean1', props: {handle, parts: [{t: 'Não disputo com ninguém. '}, {t: 'Disputo com a versão de mim que quer se acomodar.', accent: true}]}},
  {id: 'Clean2', props: {handle, parts: [{t: 'Meu concorrente é quem eu fui ontem, '}, {t: 'e\u00A0eu não pretendo perder pra ele.', accent: true}]}},
  {id: 'Clean3', props: {handle, parts: [{t: 'Todo dia eu brigo comigo, '}, {t: 'porque o meu melhor ainda não chegou.', accent: true}]}},
  {id: 'Clean1Dark', props: {handle, dark: true, parts: [{t: 'Não disputo com ninguém. '}, {t: 'Disputo com a versão de mim que quer se acomodar.', accent: true}]}},
];
