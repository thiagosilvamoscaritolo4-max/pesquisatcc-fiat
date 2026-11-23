import './fonts';
import '@fontsource/inter/400.css';
import '@fontsource/inter/500.css';
import '@fontsource/inter/700.css';
import React from 'react';
import {AbsoluteFill, Img, staticFile} from 'remotion';
import {Grain} from './components';
import {colors} from './theme';

export type TweetProps = {
  name: string;
  handle: string;
  text: string; // \n\n separa parágrafos
  avatar?: string; // arquivo em public/, ex.: 'avatar.jpg'
};

const INTER = "'Inter', sans-serif";

const Badge: React.FC = () => (
  <svg width="44" height="44" viewBox="0 0 24 24" style={{marginLeft: 10, flexShrink: 0}}>
    <path
      fill={colors.orange}
      d="M12 1.5l2.6 2 3.3-.3.9 3.2 2.9 1.7-1.2 3.1 1.2 3.1-2.9 1.7-.9 3.2-3.3-.3-2.6 2-2.6-2-3.3.3-.9-3.2-2.9-1.7 1.2-3.1-1.2-3.1 2.9-1.7.9-3.2 3.3.3z"
    />
    <path d="M7.6 12.3l3 3 5.8-6.2" stroke={colors.dark} strokeWidth="2.2" fill="none" strokeLinecap="round" strokeLinejoin="round" />
  </svg>
);

/** Post estilo "print de tweet" (feed 3:4). */
export const Tweet: React.FC<TweetProps> = ({name, handle, text, avatar}) => (
  <AbsoluteFill style={{background: colors.dark, justifyContent: 'center', padding: '0 96px'}}>
    <div style={{display: 'flex', alignItems: 'center'}}>
      <div
        style={{
          width: 132, height: 132, borderRadius: 66, overflow: 'hidden', flexShrink: 0, background: colors.orange,
          display: 'flex', alignItems: 'center', justifyContent: 'center',
        }}
      >
        {avatar ? (
          <Img src={staticFile(avatar)} style={{width: '100%', height: '100%', objectFit: 'cover'}} />
        ) : (
          <span style={{fontFamily: "'Barlow Condensed', sans-serif", fontWeight: 900, fontSize: 64, color: colors.dark}}>ts</span>
        )}
      </div>
      <div style={{marginLeft: 30}}>
        <div style={{display: 'flex', alignItems: 'center', fontFamily: INTER, fontWeight: 700, fontSize: 46, color: colors.light}}>
          {name}
          <Badge />
        </div>
        <div style={{fontFamily: INTER, fontWeight: 400, fontSize: 38, color: '#7E7E7E', marginTop: 4}}>{handle}</div>
      </div>
    </div>
    <div style={{marginTop: 56}}>
      {text.split('\n\n').map((p, i) => (
        <p key={i} style={{fontFamily: INTER, fontWeight: 500, fontSize: 72, lineHeight: 1.28, letterSpacing: '-0.015em', color: colors.light, margin: i ? '44px 0 0' : 0}}>
          {p}
        </p>
      ))}
    </div>
    <Grain opacity={0.06} />
  </AbsoluteFill>
);

const base = {name: 'Seu Nome', handle: '@seu.usuario'};
export const tweets: {id: string; props: TweetProps}[] = [
  {id: 'Tweet1', props: {...base, text: 'Seu cliente não sumiu.\n\nEle comprou de quem respondeu primeiro.'}},
  {id: 'Tweet2', props: {...base, text: 'Não falta lead.\n\nFalta follow-up.'}},
  {id: 'Tweet3', props: {...base, text: 'Lead esquecido no WhatsApp é dinheiro que você pagou pra jogar fora.'}},
];
