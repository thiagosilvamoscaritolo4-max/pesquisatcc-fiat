import './fonts';
import '@fontsource/inter/400.css';
import '@fontsource/inter/500.css';
import '@fontsource/inter/700.css';
import '@fontsource/inter/800.css';
import React from 'react';
import {AbsoluteFill, Img, staticFile} from 'remotion';
import {colors} from './theme';

type Seg = {t: string; b?: boolean};
export type TweetLightProps = {paras: Seg[][]; name: string; handle: string; avatar: string};
const INTER = "'Inter', sans-serif";

const Badge: React.FC = () => (
  <svg width={46} height={46} viewBox="0 0 24 24" style={{marginLeft: 12, flexShrink: 0}}>
    <path fill={colors.orange} d="M12 1.5l2.6 2 3.3-.3.9 3.2 2.9 1.7-1.2 3.1 1.2 3.1-2.9 1.7-.9 3.2-3.3-.3-2.6 2-2.6-2-3.3.3-.9-3.2-2.9-1.7 1.2-3.1-1.2-3.1 2.9-1.7.9-3.2 3.3.3z" />
    <path d="M7.6 12.3l3 3 5.8-6.2" stroke="#fff" strokeWidth={2.4} fill="none" strokeLinecap="round" strokeLinejoin="round" />
  </svg>
);

/** Post estilo "print de tweet" claro (feed 3:4). */
export const TweetLight: React.FC<TweetLightProps> = ({paras, name, handle, avatar}) => (
  <AbsoluteFill style={{background: '#FFFFFF', justifyContent: 'center', padding: '0 96px'}}>
    <div style={{display: 'flex', alignItems: 'center'}}>
      <div style={{width: 184, height: 184, borderRadius: 92, padding: 7, boxSizing: 'border-box', background: `conic-gradient(from 200deg, ${colors.orange}, #FFB27A, ${colors.orange}, #C94A05, ${colors.orange})`, flexShrink: 0}}>
        <div style={{width: '100%', height: '100%', borderRadius: '50%', background: '#fff', padding: 6, boxSizing: 'border-box'}}>
          <Img src={staticFile(avatar)} style={{width: '100%', height: '100%', borderRadius: '50%', objectFit: 'cover', display: 'block'}} />
        </div>
      </div>
      <div style={{marginLeft: 34}}>
        <div style={{display: 'flex', alignItems: 'center', fontFamily: INTER, fontWeight: 700, fontSize: 46, color: '#0F0F0F', letterSpacing: '-0.01em'}}>
          {name}
          <Badge />
        </div>
        <div style={{fontFamily: INTER, fontWeight: 400, fontSize: 38, color: '#6B6B6B', marginTop: 4}}>{handle}</div>
      </div>
    </div>
    <div style={{marginTop: 58}}>
      {paras.map((p, i) => (
        <p key={i} style={{fontFamily: INTER, fontWeight: 400, fontSize: 60, lineHeight: 1.16, letterSpacing: '-0.015em', color: '#0F0F0F', margin: i ? '46px 0 0' : 0}}>
          {p.map((s, k) => (
            <span key={k} style={{fontWeight: s.b ? 800 : 400}}>{s.t}</span>
          ))}
        </p>
      ))}
    </div>
  </AbsoluteFill>
);

const me = {name: 'Thiago Silva', handle: '@workthiago', avatar: 'avatar.jpg'};
export const tweetsLight: {id: string; props: TweetLightProps}[] = [
  {id: 'Light1', props: {...me, paras: [
    [{t: 'Anúncio '}, {t: 'traz atenção.', b: true}],
    [{t: 'Oferta '}, {t: 'gera desejo.', b: true}],
    [{t: 'Atendimento '}, {t: 'fecha a venda.', b: true}],
    [{t: 'Quem acerta só um continua culpando o tráfego.'}],
  ]}},
  {id: 'Light2', props: {...me, paras: [
    [{t: 'Tráfego '}, {t: 'traz o lead.', b: true}],
    [{t: 'Automação '}, {t: 'não deixa ele esfriar.', b: true}],
    [{t: 'Comercial '}, {t: 'transforma em cliente.', b: true}],
    [{t: 'Sem os três, você só está pagando por curioso.'}],
  ]}},
  {id: 'Light3', props: {...me, paras: [
    [{t: 'Criativo '}, {t: 'vende o clique.', b: true}],
    [{t: 'Página '}, {t: 'vende a ideia.', b: true}],
    [{t: 'WhatsApp '}, {t: 'vende o produto.', b: true}],
    [{t: 'Se um falha, o anúncio leva a\u00A0culpa.'}],
  ]}},
  {id: 'Light4', props: {...me, paras: [
    [{t: 'Motivação '}, {t: 'te faz começar.', b: true}],
    [{t: 'Disciplina '}, {t: 'te faz continuar.', b: true}],
    [{t: 'Constância '}, {t: 'te faz chegar.', b: true}],
    [{t: 'Quem depende só da primeira desiste na segunda\u00A0semana.'}],
  ]}},
  {id: 'Light5', props: {...me, paras: [
    [{t: 'Dinheiro '}, {t: 'você recupera.', b: true}],
    [{t: 'Oportunidade '}, {t: 'às vezes volta.', b: true}],
    [{t: 'Tempo '}, {t: 'não volta nunca.', b: true}],
    [{t: 'Escolhe bem onde você gasta\u00A0o\u00A0seu.'}],
  ]}},
  {id: 'Light6', props: {...me, paras: [
    [{t: 'Fé '}, {t: 'sustenta o propósito.', b: true}],
    [{t: 'Trabalho '}, {t: 'constrói o caminho.', b: true}],
    [{t: 'Paciência '}, {t: 'espera a colheita.', b: true}],
    [{t: 'Quem tem só um dos três desanima no\u00A0meio.'}],
  ]}},
  {id: 'Light7', props: {...me, paras: [
    [{t: 'Ideia '}, {t: 'todo mundo tem.', b: true}],
    [{t: 'Execução '}, {t: 'poucos fazem.', b: true}],
    [{t: 'Constância '}, {t: 'quase ninguém aguenta.', b: true}],
    [{t: 'É por isso que o topo tem pouca\u00A0gente.'}],
  ]}},
];
