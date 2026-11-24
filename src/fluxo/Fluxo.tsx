import '../fonts';
import '@fontsource/inter/400.css';
import '@fontsource/inter/500.css';
import '@fontsource/inter/600.css';
import '@fontsource/inter/700.css';
import React from 'react';
import {AbsoluteFill, interpolate, useCurrentFrame} from 'remotion';
import {Grain, Highlight, Reveal, headline} from '../components';
import {colors, fonts} from '../theme';
import {CFG, CtaSticky, Grid, IfCard, INTER, K, NODES, Node, Variant, Wires, World, applyVariant, camAt, clamp} from './canvas';
import {ClickUpComment, ClickUpFields, ClickUpMessage, Modal, WhatsAppGroup} from './windows';

export const fluxoDuration = 1260;


const Captions: React.FC = () => {
  const f = useCurrentFrame();
  return (
    <>
      {CFG.caps.map(([a, b, t]) => {
        if (f < a || f > b + 8) return null;
        const o = Math.min(interpolate(f, [a, a + 8], [0, 1], clamp), interpolate(f, [b, b + 8], [1, 0], clamp));
        return (
          <div key={a} style={{position: 'absolute', left: 0, right: 0, top: 1204, display: 'flex', justifyContent: 'center', opacity: o, transform: `translateY(${(1 - o) * 14}px)`}}>
            <div style={{display: 'flex', alignItems: 'center', gap: 14, background: 'rgba(12,12,12,0.88)', border: '2px solid #2C2C2C', borderRadius: 16, padding: '14px 26px'}}>
              <span style={{width: 14, height: 14, borderRadius: 7, background: K.orange}} />
              <span style={{fontFamily: INTER, fontWeight: 600, fontSize: 33, color: K.light}}>{t}</span>
            </div>
          </div>
        );
      })}
    </>
  );
};

const Hook: React.FC = () => {
  const f = useCurrentFrame();
  const o = interpolate(f, [128, 142], [1, 0], clamp);
  if (o <= 0) return null;
  return (
    <div style={{position: 'absolute', left: 80, right: 80, top: 150, opacity: o, ...headline, fontSize: CFG.hookSize, color: colors.light}}>
      <Reveal delay={4}>{CFG.hook[0]}</Reveal>
      <div style={{marginTop: 8}}>
        <Highlight delay={10} bg={K.orange === colors.orange ? K.orange : NAVY_HL} color={K.onAccent}>{CFG.hook[1]}</Highlight>
      </div>
    </div>
  );
};

const NAVY_HL = '#1B3F8F';

export const Fluxo: React.FC<{variant?: Variant}> = ({variant = 'instagram'}) => {
  applyVariant(variant);
  const f = useCurrentFrame();
  const cam = camAt(f);
  return (
    <AbsoluteFill style={{background: K.bg, overflow: 'hidden'}}>
      <Grid cam={cam} />
      <World cam={cam}>
        <div style={{opacity: interpolate(f, [1088, 1118], [1, 0.22], clamp)}}>
          <Wires />
          <IfCard />
          {NODES.map((n) => <Node key={n.id} n={n} />)}
        </div>
        <CtaSticky />
      </World>
      <Modal open={180} close={290} z={1.6} bg="#17181B">{(lf) => <ClickUpFields lf={lf} />}</Modal>
      <Modal open={354} close={480} z={1.6} bg="#17181B">{(lf) => <ClickUpMessage lf={lf} />}</Modal>
      <Modal open={626} close={742} z={1.6} bg="#17181B">{(lf) => <ClickUpComment lf={lf} />}</Modal>
      <Modal open={798} close={976} z={1.6} bg="#0B141A">{(lf) => <WhatsAppGroup lf={lf} />}</Modal>
      <Hook />
      <Captions />
      <div style={{position: 'absolute', top: 58, left: 72, fontFamily: fonts.display, fontWeight: 700, fontSize: 32, letterSpacing: '0.04em', color: colors.light}}>{CFG.watermark}</div>
      <Grain opacity={0.06} />
    </AbsoluteFill>
  );
};
