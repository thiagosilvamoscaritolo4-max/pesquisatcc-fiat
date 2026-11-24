import React from 'react';
import {AbsoluteFill, interpolate, random, useCurrentFrame} from 'remotion';
import {Enter, Highlight, Label, Mark, Para, Reveal, headline, useEase} from '../components';
import {fonts} from '../theme';
import {
  Bubble, C, ChatIcon, Check, Cross, FileIcon, FlowIcon, Node, Pill, Scene, TaskIcon, Typing, Wire, clamp,
} from './ui';

const H = (size: number): React.CSSProperties => ({...headline, fontSize: size, color: C.light});
const box = (top: number): React.CSSProperties => ({position: 'absolute', left: 80, right: 80, top});

/* ================= GANCHO ================= */
const chaos = [
  {t: 'Segue o boleto', x: 70, y: 170, r: -4, d: 0},
  {t: 'Opa, mandei no grupo errado', x: 470, y: 250, r: 3, d: 5},
  {t: 'Qual é o Pix do Meta mesmo?', x: 90, y: 940, r: 2, d: 10},
  {t: 'Cadê o boleto??', x: 610, y: 1030, r: -3, d: 14},
  {t: 'Esqueci de cobrar...', x: 180, y: 1120, r: -2, d: 18},
];

export const Hook: React.FC<{dur: number}> = ({dur}) => {
  const f = useCurrentFrame();
  const dim = interpolate(f, [26, 40], [1, 0.28], clamp);
  const g = f > dur - 16 ? (random(`g${f}`) - 0.5) * 26 : 0;
  return (
    <Scene dur={dur}>
      <AbsoluteFill style={{transform: `translateX(${g}px)`}}>
        {chaos.map((m, i) => {
          const p = interpolate(f, [m.d, m.d + 8], [0, 1], clamp);
          return (
            <div key={i} style={{position: 'absolute', left: m.x, top: m.y, opacity: p * dim, transform: `rotate(${m.r}deg) scale(${0.7 + 0.3 * p})`}}>
              <div style={{background: C.panel2, color: C.light, fontFamily: fonts.body, fontWeight: 600, fontSize: 32, padding: '18px 26px', borderRadius: '24px 24px 24px 8px', whiteSpace: 'nowrap'}}>
                {m.t}
              </div>
            </div>
          );
        })}
        <div style={{...box(440), ...H(150)}}>
          <Reveal delay={18}>AINDA MANDA</Reveal>
          <Reveal delay={23}>BOLETO</Reveal>
          <div style={{marginTop: 10}}>
            <Highlight delay={30} bg={C.orange} color={C.bg}>NA MÃO?</Highlight>
          </div>
        </div>
      </AbsoluteFill>
    </Scene>
  );
};

/* ================= SOLUÇÃO ================= */
export const Intro: React.FC<{dur: number}> = ({dur}) => (
  <Scene dur={dur}>
    <div style={box(190)}>
      <Label text="A SOLUÇÃO" delay={4} color={C.orange} />
      <div style={{...H(140), marginTop: 22}}>
        <Reveal delay={8}>EU AUTOMATIZEI</Reveal>
        <div style={{marginTop: 10}}>
          <Highlight delay={14} bg={C.orange} color={C.bg}>TUDO.</Highlight>
        </div>
      </div>
    </div>
    <Wire from={{x: 330, y: 800}} to={{x: 420, y: 800}} delay={34} period={30} />
    <Wire from={{x: 660, y: 800}} to={{x: 750, y: 800}} delay={42} period={30} />
    <Node x={210} y={800} delay={24} icon={<TaskIcon />} title="CLICKUP" sub="a tarefa" />
    <Node x={540} y={800} delay={30} icon={<FlowIcon c={C.orange} />} title="N8N" sub="o cérebro" active />
    <Node x={870} y={800} delay={36} icon={<ChatIcon />} title="WHATSAPP" sub="via API" />
    <div style={{...box(980), textAlign: 'center'}}>
      <Para delay={52} mark={C.orange} parts={['Do ClickUp pro grupo do cliente,', {t: 'sem encostar no boleto.', at: 72}]}
        style={{fontFamily: fonts.body, fontWeight: 600, fontSize: 36, lineHeight: 1.4, color: C.light}} />
    </div>
  </Scene>
);

/* ================= PASSO 01 · CLICKUP ================= */
const Row: React.FC<{label: string; tag?: string; delay: number; children: React.ReactNode}> = ({label, tag, delay, children}) => (
  <Enter delay={delay} from="up" distance={30}>
    <div style={{display: 'flex', alignItems: 'center', minHeight: 104, borderTop: `2px solid ${C.line}`}}>
      <div style={{width: 330}}>
        <div style={{fontFamily: fonts.display, fontWeight: 700, fontSize: 28, letterSpacing: '0.12em', color: C.grey}}>{label}</div>
        {tag && <div style={{fontFamily: fonts.body, fontWeight: 600, fontSize: 20, color: C.orange, marginTop: 2}}>{tag}</div>}
      </div>
      <div style={{flex: 1, fontFamily: fonts.body, fontWeight: 600, fontSize: 34, color: C.light}}>{children}</div>
    </div>
  </Enter>
);

export const Step1: React.FC<{dur: number}> = ({dur}) => {
  const f = useCurrentFrame();
  const toast = useEase(132, 14);
  return (
    <Scene dur={dur}>
      <div style={box(180)}>
        <div style={H(120)}>
          <Reveal delay={4}>TUDO COMEÇA</Reveal>
          <div style={{marginTop: 8}}>
            <Highlight delay={10} bg={C.orange} color={C.bg}>NO CLICKUP.</Highlight>
          </div>
        </div>
      </div>
      <Enter delay={20} from="up" distance={60} style={{...box(520)}}>
        <div style={{background: C.panel, border: `3px solid ${C.line}`, borderRadius: 30, padding: '30px 40px 10px'}}>
          <div style={{display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 24}}>
            <div style={{display: 'flex', alignItems: 'center', gap: 18}}>
              <TaskIcon c={C.orange} s={48} />
              <div style={{fontFamily: fonts.body, fontWeight: 700, fontSize: 38, color: C.light}}>Cobrança · Cliente Alpha</div>
            </div>
            <Pill>A ENVIAR</Pill>
          </div>
          <Row label="NOMENCLATURA" delay={34}>
            <Typing text="ALPHA_META_PIX_1125" delay={40} speed={1.1} style={{fontFamily: 'monospace', fontSize: 32}} />
          </Row>
          <Row label="RESPONSÁVEL" delay={62}>
            <span style={{display: 'inline-flex', alignItems: 'center', gap: 14}}>
              <span style={{width: 46, height: 46, borderRadius: 23, background: C.orange, color: C.bg, display: 'inline-flex', alignItems: 'center', justifyContent: 'center', fontFamily: fonts.display, fontWeight: 900, fontSize: 28}}>A</span>
              <Typing text="@ana" delay={68} speed={2} />
            </span>
          </Row>
          <Row label="GRUPO WHATSAPP" tag="campo personalizado" delay={84}>
            <span style={{color: C.dim, fontStyle: 'italic', opacity: Math.floor(f / 10) % 2 ? 1 : 0.55}}>vazio</span>
          </Row>
          <Row label="PAGAMENTO" delay={104}>
            <Pill solid>PIX · META ADS</Pill>
          </Row>
        </div>
      </Enter>
      <div style={{...box(1170), display: 'flex', alignItems: 'center', gap: 14, opacity: toast, transform: `translateY(${(1 - toast) * 20}px)`}}>
        <FlowIcon c={C.orange} s={40} />
        <span style={{fontFamily: fonts.display, fontWeight: 700, fontSize: 30, letterSpacing: '0.12em', color: C.orange}}>N8N RECEBEU A TAREFA →</span>
      </div>
    </Scene>
  );
};

/* ================= PASSO 02 · A TRAVA ================= */
const checks = ['Nomenclatura no padrão', 'Responsável marcado', 'Grupo do WhatsApp', 'Tipo de pagamento'];

export const Step2: React.FC<{dur: number}> = ({dur}) => {
  const f = useCurrentFrame();
  const FIX = 178;
  const on = (d: number) => interpolate(f, [d, d + 8], [0, 1], clamp);
  const shake = f > 62 && f < 80 ? Math.sin(f * 2.4) * 14 * (1 - (f - 62) / 18) : 0;
  const stampIn = interpolate(f, [64, 70], [0, 1], clamp);
  const stampScale = interpolate(f, [64, 70], [2.2, 1], clamp);
  const fixed = f >= FIX;
  const libScale = interpolate(f, [FIX + 18, FIX + 24], [2, 1], clamp);
  return (
    <Scene dur={dur}>
      <div style={box(180)}>
        <div style={H(110)}>
          <Reveal delay={4}>O N8N CONFERE</Reveal>
          <div style={{marginTop: 8}}>
            <Highlight delay={10} bg={C.orange} color={C.bg}>ANTES DE ENVIAR.</Highlight>
          </div>
        </div>
      </div>
      <Enter delay={18} from="up" distance={50} style={{...box(480)}}>
        <div style={{position: 'relative', background: C.panel, border: `3px solid ${f > 62 && !fixed ? C.orange : C.line}`, borderRadius: 30, padding: '20px 40px', transform: `translateX(${shake}px)`}}>
          {checks.map((c, i) => {
            const d = 30 + i * 12;
            const isErr = i === 2;
            const checked = isErr ? (fixed ? on(FIX + 4) : 0) : i === 3 ? (fixed ? on(FIX + 12) : 0) : on(d);
            const err = isErr && !fixed ? on(58) : 0;
            return (
              <div key={i} style={{display: 'flex', alignItems: 'center', gap: 24, height: 92, borderTop: i ? `2px solid ${C.line}` : 'none'}}>
                {err > 0 ? <Cross on={err} /> : <Check on={checked} />}
                <span style={{fontFamily: fonts.body, fontWeight: 600, fontSize: 34, color: err > 0 ? C.orange : checked > 0 ? C.light : C.grey}}>{c}</span>
              </div>
            );
          })}
          {/* carimbo */}
          {f >= 64 && (
            <div
              style={{
                position: 'absolute', right: 34, top: 120, padding: '6px 22px', borderRadius: 10,
                background: fixed ? C.light : C.orange, color: C.bg, fontFamily: fonts.display, fontWeight: 900, fontSize: 74,
                transform: `rotate(-8deg) scale(${fixed ? libScale : stampScale})`, opacity: fixed ? interpolate(f, [FIX + 18, FIX + 22], [0, 1], clamp) : stampIn,
              }}
            >
              {fixed ? 'LIBERADO' : 'TRAVOU'}
            </div>
          )}
        </div>
      </Enter>
      {/* comentário do n8n na tarefa */}
      <Enter delay={92} from="up" distance={40} style={{...box(930)}}>
        <div style={{background: C.panel2, borderRadius: 26, padding: '26px 32px', borderLeft: `6px solid ${C.orange}`}}>
          <div style={{display: 'flex', alignItems: 'center', gap: 14, marginBottom: 12}}>
            <span style={{width: 44, height: 44, borderRadius: 10, background: C.orange, display: 'inline-flex', alignItems: 'center', justifyContent: 'center'}}>
              <FlowIcon c={C.bg} s={30} />
            </span>
            <span style={{fontFamily: fonts.body, fontWeight: 700, fontSize: 28, color: C.light}}>n8n</span>
            <span style={{fontFamily: fonts.body, fontWeight: 500, fontSize: 26, color: C.grey}}>comentou na tarefa</span>
          </div>
          <Para delay={100} mark={C.orange} stagger={0.6}
            parts={['Não enviei: o campo Grupo WhatsApp está vazio. Preencha o ID do grupo', {t: 'e eu envio de novo.', at: 140}]}
            style={{fontFamily: fonts.body, fontWeight: 500, fontSize: 31, lineHeight: 1.4, color: C.light}} />
        </div>
      </Enter>
    </Scene>
  );
};

/* ================= PASSO 03 · ROTAS ================= */
const Col: React.FC<{x: number; chip: string; delay: number; children: React.ReactNode}> = ({x, chip, delay, children}) => (
  <Enter delay={delay} from="up" distance={40} style={{position: 'absolute', left: x, top: 640, width: 445}}>
    <div style={{textAlign: 'center', marginBottom: 18}}>
      <Pill solid>{chip}</Pill>
    </div>
    <div style={{background: C.panel, border: `3px solid ${C.line}`, borderRadius: 30, padding: 22, minHeight: 450, boxSizing: 'border-box'}}>
      <div style={{display: 'flex', alignItems: 'center', gap: 12, paddingBottom: 16, marginBottom: 18, borderBottom: `2px solid ${C.line}`}}>
        <ChatIcon c={C.grey} s={34} />
        <span style={{fontFamily: fonts.body, fontWeight: 700, fontSize: 24, color: C.grey}}>Alpha · Financeiro</span>
      </div>
      <div style={{display: 'flex', flexDirection: 'column', gap: 14}}>{children}</div>
    </div>
  </Enter>
);

const at = <span style={{color: C.orange, fontWeight: 700}}>@ana</span>;

export const Step3: React.FC<{dur: number}> = ({dur}) => (
  <Scene dur={dur}>
    <div style={box(170)}>
      <div style={H(104)}>
        <Reveal delay={4}>MENSAGEM CERTA,</Reveal>
        <div style={{marginTop: 8}}>
          <Highlight delay={10} bg={C.orange} color={C.bg}>NO GRUPO CERTO.</Highlight>
        </div>
      </div>
    </div>
    <Wire from={{x: 470, y: 520}} to={{x: 292, y: 630}} delay={34} vertical period={36} />
    <Wire from={{x: 610, y: 520}} to={{x: 788, y: 630}} delay={34} vertical period={36} />
    <Node x={540} y={480} w={520} h={100} row delay={24} icon={<FlowIcon c={C.orange} s={46} />} title="TIPO DE PAGAMENTO?" active />
    <Col x={70} chip="CARTÃO / BOLETO" delay={50}>
      <Bubble delay={70}>
        Olá, {at}! Segue o boleto da conta de anúncios. Vence dia 28.
      </Bubble>
      <Bubble delay={86} style={{display: 'flex', alignItems: 'center', gap: 14}}>
        <FileIcon c={C.orange} /> <span style={{fontWeight: 600}}>boleto_alpha.pdf</span>
      </Bubble>
    </Col>
    <Col x={565} chip="PIX" delay={58}>
      <Bubble delay={100}>
        Olá, {at}! Pix da conta de anúncios:{' '}
        <span style={{display: 'inline-block', marginTop: 8}}><Pill solid>META ADS</Pill></span>
      </Bubble>
      <Bubble delay={124} style={{fontFamily: 'monospace', fontSize: 23, wordBreak: 'break-all', color: C.light}}>
        00020126580014BR.GOV.BCB.PIX0136a1f4c9e2-7b31...
        <div style={{fontFamily: fonts.display, fontWeight: 700, fontSize: 20, letterSpacing: '0.12em', color: C.orange, marginTop: 8}}>CÓDIGO SEPARADO · É SÓ COPIAR</div>
      </Bubble>
    </Col>
    <div style={{...box(1196), textAlign: 'center'}}>
      <Para delay={160} mark={C.orange} parts={['No Google Ads, o mesmo fluxo com a', {t: 'plataforma sinalizada.', at: 185}]}
        style={{fontFamily: fonts.body, fontWeight: 600, fontSize: 28, color: C.grey}} />
    </div>
  </Scene>
);

/* ================= PASSO 04 · FOLLOW-UP ================= */
const fus = [
  {t: 'FOLLOW 01', m: 'Lembrete: o boleto vence amanhã.'},
  {t: 'FOLLOW 02', m: 'Ainda não identificamos o pagamento.'},
  {t: 'FOLLOW 03', m: 'Último aviso antes dos anúncios pausarem.'},
];

export const Step4: React.FC<{dur: number}> = ({dur}) => {
  const f = useCurrentFrame();
  const Y0 = 560;
  const GAP = 210;
  const fill = interpolate(f, [30, 30 + 2 * 45], [0, 1], clamp);
  return (
    <Scene dur={dur}>
      <div style={box(180)}>
        <div style={H(120)}>
          <Reveal delay={4}>E SE NÃO PAGAR?</Reveal>
          <div style={{marginTop: 8}}>
            <Highlight delay={10} bg={C.orange} color={C.bg}>FOLLOW-UP.</Highlight>
          </div>
        </div>
      </div>
      {/* trilho */}
      <div style={{position: 'absolute', left: 147, top: Y0 + 50, width: 6, height: GAP * 2, background: C.line, borderRadius: 3}} />
      <div style={{position: 'absolute', left: 147, top: Y0 + 50, width: 6, height: GAP * 2 * fill, background: C.orange, borderRadius: 3}} />
      {fus.map((x, i) => {
        const d = 30 + i * 45;
        const lit = interpolate(f, [d, d + 8], [0, 1], clamp);
        return (
          <React.Fragment key={i}>
            <div
              style={{
                position: 'absolute', left: 100, top: Y0 + i * GAP, width: 100, height: 100, borderRadius: 50,
                background: lit ? C.orange : C.panel, border: `3px solid ${lit ? C.orange : C.line}`, boxSizing: 'border-box',
                display: 'flex', alignItems: 'center', justifyContent: 'center', transform: `scale(${1 + 0.12 * Math.sin(lit * Math.PI)})`,
                fontFamily: fonts.display, fontWeight: 900, fontSize: 40, color: lit ? C.bg : C.dim,
              }}
            >
              0{i + 1}
            </div>
            <Enter delay={d} from="left" distance={40} style={{position: 'absolute', left: 240, right: 80, top: Y0 + i * GAP - 10}}>
              <div style={{background: C.panel, border: `3px solid ${C.line}`, borderRadius: 26, padding: '20px 28px'}}>
                <div style={{fontFamily: fonts.display, fontWeight: 900, fontSize: 38, color: C.orange}}>{x.t}</div>
                <div style={{fontFamily: fonts.body, fontWeight: 600, fontSize: 30, color: C.light, marginTop: 4}}>{x.m}</div>
              </div>
            </Enter>
          </React.Fragment>
        );
      })}
      <div style={{...box(1200), textAlign: 'center', opacity: interpolate(f, [150, 162], [0, 1], clamp)}}>
        <span style={{fontFamily: fonts.display, fontWeight: 700, fontSize: 30, letterSpacing: '0.14em', color: C.grey}}>MENSAGEM PRONTA · ENVIO AUTOMÁTICO</span>
      </div>
    </Scene>
  );
};

/* ================= FINAL ================= */
export const Final: React.FC<{dur: number}> = ({dur}) => {
  const cta = useEase(70, 18);
  return (
    <Scene dur={dur}>
      <div style={box(190)}>
        <div style={H(116)}>
          <Reveal delay={4}>ZERO BOLETO</Reveal>
          <Reveal delay={8}><Mark at={30} color={C.orange} thickness={10}>ERRADO.</Mark></Reveal>
          <Reveal delay={16} style={{marginTop: 18}}>ZERO COBRANÇA</Reveal>
          <div style={{marginTop: 8}}>
            <Highlight delay={22} bg={C.orange} color={C.bg}>ESQUECIDA.</Highlight>
          </div>
        </div>
      </div>
      <div
        style={{
          ...box(850), background: C.orange, borderRadius: 34, padding: '40px 44px', color: C.bg,
          opacity: interpolate(cta, [0, 0.3], [0, 1], clamp), transform: `translateY(${(1 - cta) * 80}px)`,
        }}
      >
        <div style={{fontFamily: fonts.display, fontWeight: 900, fontSize: 56, lineHeight: 1}}>QUER ESSA AUTOMAÇÃO NO SEU NEGÓCIO?</div>
        <div style={{fontFamily: fonts.body, fontWeight: 600, fontSize: 32, marginTop: 18}}>Chama no direct:</div>
        <div style={{fontFamily: fonts.display, fontWeight: 900, fontSize: 112, lineHeight: 1, marginTop: 6}}>@workthiago</div>
      </div>
    </Scene>
  );
};
