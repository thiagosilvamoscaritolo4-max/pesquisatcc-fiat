import '../fonts';
import '@fontsource/inter/400.css';
import '@fontsource/inter/500.css';
import '@fontsource/inter/600.css';
import '@fontsource/inter/700.css';
import React from 'react';
import {AbsoluteFill, interpolate, useCurrentFrame} from 'remotion';
import {Grain, Highlight, Reveal, headline} from '../components';
import {colors, fonts} from '../theme';
import {CFG, Grid, INTER, K, Variant, World, applyVariant, camAtKeys, clamp} from '../fluxo/canvas';
import {Modal} from '../fluxo/windows';
import {E2S, EndSticky, IfCard2, KEYS2, N2, NAVY_BOX, Node2, RouteCard, S, Wires2} from './flow';
import {Sfx} from './sfx';
import {ApprovalV3, ErrorV3, FieldsV3, MessageV3, WAChat, chatBoleto, chatFollow, chatPixBoleto, chatPixPix} from './win';

export {DURATION2} from './flow';

const CAPS2: [number, number, string][] = [
  [186, 296, 'O gestor clica em Enviar boleto no ClickUp'],
  [380, 438, 'O n8n confere os requisitos antes de enviar'],
  [484, 566, 'Faltou algo? O n8n trava e explica no comentário'],
  [572, 648, 'Pedro corrige e envia de novo'],
  [720, 818, 'O n8n monta a mensagem pronta na tarefa'],
  [852, 898, 'Agora seguiu todos os requisitos'],
  [940, 1038, 'Aprovado: registra no comentário da tarefa'],
  [1076, 1128, 'Cada forma de pagamento tem sua mensagem'],
  [1170, 1340, 'Pix + boleto: print e código do Pix separados, com a plataforma'],
  [1374, 1506, 'Pix + pix: um print e um código para cada plataforma'],
  [S(1484), S(1564), 'Boleto ou cartão: uma mensagem só'],
  [S(1596), S(1640), 'Depois, aguarda o pagamento'],
  [S(1650), S(1798), 'Sem pagamento? Follow-up 01, 02 e 03 automático'],
];

const Captions: React.FC = () => {
  const f = useCurrentFrame();
  return (
    <>
      {CAPS2.map(([a, b, t]) => {
        if (f < a || f > b + 8) return null;
        const o = Math.min(interpolate(f, [a, a + 8], [0, 1], clamp), interpolate(f, [b, b + 8], [1, 0], clamp));
        return (
          <div key={a} style={{position: 'absolute', left: 0, right: 0, top: 1204, display: 'flex', justifyContent: 'center', opacity: o, transform: `translateY(${(1 - o) * 14}px)`}}>
            <div style={{display: 'flex', alignItems: 'center', gap: 14, background: 'rgba(12,12,12,0.88)', border: '2px solid #2C2C2C', borderRadius: 16, padding: '14px 26px'}}>
              <span style={{width: 14, height: 14, borderRadius: 7, background: K.orange}} />
              <span style={{fontFamily: INTER, fontWeight: 600, fontSize: 32, color: K.light}}>{t}</span>
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
  const hl = K.orange === colors.orange ? K.orange : '#1B3F8F';
  return (
    <div style={{position: 'absolute', left: 80, right: 80, top: 150, opacity: o, ...headline, fontSize: CFG.hookSize, color: colors.light}}>
      <Reveal delay={4}>{CFG.hook[0]}</Reveal>
      <div style={{marginTop: 8}}>
        <Highlight delay={10} bg={hl} color={K.onAccent}>{CFG.hook[1]}</Highlight>
      </div>
    </div>
  );
};

export const Fluxo2: React.FC<{variant?: Variant}> = ({variant = 'linkedin'}) => {
  applyVariant(variant);
  const f = useCurrentFrame();
  const cam = camAtKeys(KEYS2, f);
  void E2S;
  void NAVY_BOX;
  return (
    <AbsoluteFill style={{background: K.bg, overflow: 'hidden'}}>
      <Grid cam={cam} />
      <World cam={cam}>
        <div style={{opacity: interpolate(f, [S(1884), S(1914)], [1, 0.22], clamp)}}>
          <Wires2 />
          <IfCard2 />
          <RouteCard />
          {N2.map((n) => <Node2 key={n.id} n={n} />)}
        </div>
        <EndSticky />
      </World>
      <Modal open={180} close={290} z={1.6} bg="#17181B">{(lf) => <FieldsV3 lf={lf} />}</Modal>
      <Modal open={480} close={650} z={1.6} bg="#17181B">{(lf) => <ErrorV3 lf={lf} />}</Modal>
      <Modal open={718} close={820} z={1.6} bg="#17181B">{(lf) => <MessageV3 lf={lf} />}</Modal>
      <Modal open={938} close={1040} z={1.6} bg="#17181B">{(lf) => <ApprovalV3 lf={lf} />}</Modal>
      <Modal open={1168} close={S(1318)} z={1.6} bg="#0B141A">{(lf) => <WAChat lf={lf} items={chatPixBoleto()} blueAt={96} typing={[106, 134]} />}</Modal>
      <Modal open={S(1348)} close={S(1450)} z={1.6} bg="#0B141A">{(lf) => <WAChat lf={lf} items={chatPixPix()} blueAt={104} />}</Modal>
      <Modal open={S(1482)} close={S(1566)} z={1.6} bg="#0B141A">{(lf) => <WAChat lf={lf} items={chatBoleto()} blueAt={56} />}</Modal>
      <Modal open={S(1648)} close={S(1800)} z={1.6} bg="#0B141A">{(lf) => <WAChat lf={lf} items={chatFollow()} blueAt={140} />}</Modal>
      <Hook />
      <Captions />
      <div style={{position: 'absolute', top: 58, left: 72, fontFamily: fonts.display, fontWeight: 700, fontSize: 32, letterSpacing: '0.04em', color: colors.light}}>{CFG.watermark}</div>
      <Grain opacity={0.06} />
      <Sfx />
    </AbsoluteFill>
  );
};
