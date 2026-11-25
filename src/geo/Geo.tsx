import '../fonts';
import '@fontsource/inter/400.css';
import '@fontsource/inter/500.css';
import '@fontsource/inter/600.css';
import '@fontsource/inter/700.css';
import React from 'react';
import {AbsoluteFill, Audio, Easing, Sequence, interpolate, staticFile, useCurrentFrame} from 'remotion';
import {Grain, Highlight, Reveal, headline} from '../components';
import {fonts} from '../theme';
import {Caption, setErrosTheme} from '../erros/ui';

export const GEO_DURATION = 1320;

const C = {
  bg: '#0E0F12', win: '#15171C', panel: '#1C1F26', line: '#2A2D35', text: '#ECECEC', grey: '#8B8D96', dim: '#5C5E66',
  blue: '#2F5FCC', navy: '#1B3F8F', amber: '#E3A008', green: '#3FB950', white: '#FFFFFF',
};
const INTER = "'Inter', sans-serif";
const clamp = {extrapolateLeft: 'clamp', extrapolateRight: 'clamp'} as const;
const EXPO = Easing.bezier(0.16, 1, 0.3, 1);
const ease = (f: number, a: number, d = 12) => interpolate(f, [a, a + d], [0, 1], {...clamp, easing: EXPO});
const fadeOut = (f: number, a: number, d = 10) => interpolate(f, [a, a + d], [1, 0], clamp);

const Icon: React.FC<{d: string[]; color: string; size: number; sw?: number}> = ({d, color, size, sw = 2}) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth={sw} strokeLinecap="round" strokeLinejoin="round">
    {d.map((p, i) => <path key={i} d={p} />)}
  </svg>
);
const I = {
  spark: ['M12 3l1.8 5.2L19 10l-5.2 1.8L12 17l-1.8-5.2L5 10l5.2-1.8z', 'M19 15l.8 2.2L22 18l-2.2.8L19 21l-.8-2.2L16 18l2.2-.8z'],
  send: ['M5 12h13', 'M13 6l6 6-6 6'],
  coin: ['M12 3a9 9 0 1 0 0 18 9 9 0 0 0 0-18z', 'M14.5 9.5c-.5-1-1.5-1.5-2.5-1.5-1.5 0-2.5.8-2.5 2s1 1.6 2.5 2 2.5.8 2.5 2-1 2-2.5 2c-1 0-2-.5-2.5-1.5', 'M12 6.5v1.5M12 16v1.5'],
  page: ['M14 3H7a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h10a2 2 0 0 0 2-2V8z', 'M14 3v5h5', 'M9 13h6M9 17h4'],
  check: ['M5 12.5l4.5 4.5L19 7.5'],
  star: ['M12 3l2.7 5.6 6.1.9-4.4 4.3 1 6.1L12 17l-5.4 2.9 1-6.1L3.2 9.5l6.1-.9z'],
};

/* ===================== Gancho ===================== */
const Hook: React.FC = () => {
  const f = useCurrentFrame();
  const o = fadeOut(f, 84, 12);
  if (o <= 0) return null;
  return (
    <div style={{position: 'absolute', left: 80, right: 80, top: 330, opacity: o, ...headline, fontSize: 122, color: C.text}}>
      <Reveal delay={2}>COMO A SUA LOJA</Reveal>
      <Reveal delay={6}>APARECE NO</Reveal>
      <div style={{marginTop: 10}}>
        <Highlight delay={12} bg={C.navy} color={C.white}>CHATGPT?</Highlight>
      </div>
    </div>
  );
};

/* ===================== Chat ===================== */
const Q = 'loja de roupa barata';
type Seg = {t: string; b?: boolean};
const ANSWER: Seg[][] = [
  [{t: 'Aqui estão algumas opções com preços acessíveis:'}],
  [{t: '1. Loja Exemplo', b: true}, {t: ' · peças a partir de R$ 39, frete grátis acima de R$ 150 e nota 4,8 nas avaliações.'}],
  [{t: '2. Moda Fictícia', b: true}, {t: ' · liquidação toda semana e troca fácil.'}],
  [{t: '3. Brechó Modelo', b: true}, {t: ' · roupas seminovas com preço baixo.'}],
];
const TOTAL_CHARS = ANSWER.flat().reduce((a, s) => a + s.t.length, 0);

const Chat: React.FC = () => {
  const f = useCurrentFrame();
  const show = ease(f, 0, 14) * fadeOut(f, 418, 14);
  if (f > 434) return null;
  const typed = Math.floor(interpolate(f, [100, 148], [0, Q.length], clamp));
  const sent = f >= 156;
  const thinking = f >= 166 && f < 190;
  let n = Math.floor(interpolate(f, [190, 190 + TOTAL_CHARS / 3], [0, TOTAL_CHARS], clamp));
  const ad = ease(f, 306, 14);
  const lab = ease(f, 330, 12);
  return (
    <div style={{position: 'absolute', left: 40, top: 230, width: 1000, height: 920, borderRadius: 26, background: C.win, border: `2px solid ${C.line}`, overflow: 'hidden', opacity: show, boxShadow: '0 30px 80px rgba(0,0,0,0.5)'}}>
      {/* cabeçalho */}
      <div style={{position: 'absolute', left: 0, right: 0, top: 0, height: 84, borderBottom: `2px solid ${C.line}`, display: 'flex', alignItems: 'center', padding: '0 28px', gap: 14}}>
        <span style={{width: 44, height: 44, borderRadius: 22, background: C.blue, display: 'inline-flex', alignItems: 'center', justifyContent: 'center'}}><Icon d={I.spark} color="#fff" size={26} /></span>
        <span style={{fontFamily: INTER, fontWeight: 700, fontSize: 28, color: C.text}}>Assistente de IA</span>
        <span style={{marginLeft: 'auto', fontFamily: INTER, fontWeight: 600, fontSize: 19, color: C.grey, border: `2px solid ${C.line}`, borderRadius: 999, padding: '4px 14px'}}>simulação</span>
      </div>
      {/* pergunta */}
      {sent && (
        <div style={{position: 'absolute', right: 28, top: 112, padding: '16px 24px', borderRadius: '22px 22px 6px 22px', background: '#2A2D35', fontFamily: INTER, fontWeight: 500, fontSize: 30, color: C.text, opacity: ease(f, 156, 8), transform: `translateY(${(1 - ease(f, 156, 8)) * 16}px)`}}>
          {Q}
        </div>
      )}
      {/* resposta */}
      {f >= 166 && (
        <div style={{position: 'absolute', left: 28, top: 206, display: 'flex', gap: 18}}>
          <span style={{width: 40, height: 40, borderRadius: 20, background: C.blue, display: 'inline-flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0}}><Icon d={I.spark} color="#fff" size={22} /></span>
          {thinking ? (
            <span style={{fontFamily: INTER, fontWeight: 700, fontSize: 34, color: C.grey, letterSpacing: '0.2em', marginTop: -4}}>
              {'•••'.split('').map((d, i) => <span key={i} style={{opacity: 0.3 + 0.7 * Math.max(0, Math.sin((f - i * 4) / 4))}}>{d}</span>)}
            </span>
          ) : (
            <div style={{width: 860}}>
              {ANSWER.map((p, pi) => (
                <p key={pi} style={{margin: pi ? '14px 0 0' : 0, fontFamily: INTER, fontWeight: 400, fontSize: 28, lineHeight: 1.45, color: C.text}}>
                  {p.map((s, si) => {
                    const take = Math.max(0, Math.min(s.t.length, n));
                    n -= s.t.length;
                    return <span key={si} style={{fontWeight: s.b ? 700 : 400}}>{s.t.slice(0, take)}<span style={{visibility: 'hidden'}}>{s.t.slice(take)}</span></span>;
                  })}
                </p>
              ))}
            </div>
          )}
        </div>
      )}
      {/* patrocinado */}
      {f >= 306 && (
        <div style={{position: 'absolute', left: 86, right: 28, top: 486, opacity: ad, transform: `translateY(${(1 - ad) * 24}px)`}}>
          <div style={{fontFamily: INTER, fontWeight: 600, fontSize: 20, color: C.grey, marginBottom: 10}}>Patrocinado</div>
          <div style={{display: 'flex', alignItems: 'center', gap: 20, background: C.panel, border: `2px solid ${C.line}`, borderRadius: 18, padding: 18}}>
            <div style={{width: 92, height: 92, borderRadius: 14, background: 'linear-gradient(135deg, #3B4A6B, #1B2A4A)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontFamily: INTER, fontWeight: 800, fontSize: 24, color: '#fff'}}>-50%</div>
            <div>
              <div style={{fontFamily: INTER, fontWeight: 700, fontSize: 28, color: C.text}}>Outlet Demonstração</div>
              <div style={{fontFamily: INTER, fontWeight: 500, fontSize: 23, color: C.grey, marginTop: 4}}>Até 50% off em roupas</div>
            </div>
            <div style={{marginLeft: 'auto', fontFamily: INTER, fontWeight: 700, fontSize: 22, color: '#fff', background: C.blue, borderRadius: 999, padding: '10px 22px'}}>Ver loja</div>
          </div>
        </div>
      )}
      {/* etiquetas */}
      {lab > 0 && (
        <>
          <div style={{position: 'absolute', left: 74, top: 194, width: 900, height: 256, border: `4px solid ${C.blue}`, borderRadius: 18, opacity: lab}}>
            <span style={{position: 'absolute', right: 16, top: -18, background: C.blue, color: '#fff', fontFamily: INTER, fontWeight: 700, fontSize: 20, padding: '6px 14px', borderRadius: 8}}>ORGÂNICO · site preparado</span>
          </div>
          <div style={{position: 'absolute', left: 74, top: 474, width: 900, height: 160, border: `4px solid ${C.amber}`, borderRadius: 18, opacity: ease(f, 340, 12)}}>
            <span style={{position: 'absolute', right: 16, top: -18, background: C.amber, color: '#111', fontFamily: INTER, fontWeight: 700, fontSize: 20, padding: '6px 14px', borderRadius: 8}}>ANÚNCIO · pago por clique</span>
          </div>
        </>
      )}
      {/* campo de mensagem */}
      <div style={{position: 'absolute', left: 28, right: 28, bottom: 28, height: 84, borderRadius: 42, background: C.panel, border: `2px solid ${f >= 96 && f < 156 ? C.blue : C.line}`, display: 'flex', alignItems: 'center', padding: '0 14px 0 30px', gap: 14}}>
        <span style={{flex: 1, fontFamily: INTER, fontWeight: 500, fontSize: 28, color: typed > 0 && !sent ? C.text : C.dim}}>
          {sent ? 'Pergunte qualquer coisa' : typed > 0 ? Q.slice(0, typed) : 'Pergunte qualquer coisa'}
          {!sent && f >= 96 && Math.floor(f / 7) % 2 === 0 && <span style={{display: 'inline-block', width: 3, height: 30, background: C.blue, marginLeft: 3, verticalAlign: 'middle'}} />}
        </span>
        <span style={{width: 58, height: 58, borderRadius: 29, background: typed > 0 && !sent ? C.blue : C.line, display: 'inline-flex', alignItems: 'center', justifyContent: 'center', transform: `scale(${f >= 150 && f < 156 ? 0.9 : 1})`}}><Icon d={I.send} color="#fff" size={28} sw={2.6} /></span>
      </div>
      <div style={{position: 'absolute', left: 30, bottom: 122, fontFamily: INTER, fontSize: 18, color: C.dim, opacity: ease(f, 300, 10)}}>*simulação ilustrativa · lojas fictícias</div>
    </div>
  );
};

/* ===================== Comparação ===================== */
const ROWS: [string, string, string][] = [
  ['VELOCIDADE', 'Aparece rápido', 'Leva tempo'],
  ['CUSTO', 'Paga por clique', 'Sem custo por clique'],
  ['DURAÇÃO', 'Para quando a verba acaba', 'O resultado acumula'],
  ['ONDE APARECE', 'Abaixo da resposta, como patrocinado', 'Dentro da resposta, como recomendação'],
  ['QUEM VÊ', 'Usuários dos planos gratuito e Go', 'Qualquer usuário'],
];
const Compare: React.FC = () => {
  const f = useCurrentFrame();
  const A = 424;
  if (f < A || f > 732) return null;
  const o = ease(f, A, 14) * fadeOut(f, 716, 14);
  return (
    <AbsoluteFill style={{opacity: o}}>
      <div style={{position: 'absolute', left: 80, right: 80, top: 150, ...headline, fontSize: 84, color: C.text}}>
        <Reveal delay={A + 2}>ANÚNCIO OU</Reveal>
        <div style={{marginTop: 8}}><Highlight delay={A + 8} bg={C.navy} color={C.white}>SITE PREPARADO?</Highlight></div>
      </div>
      {[
        {x: 40, title: 'Anúncio no ChatGPT', icon: I.coin, c: C.amber},
        {x: 550, title: 'Site preparado (GEO)', icon: I.page, c: C.blue},
      ].map((h, i) => {
        const p = ease(f, A + 22 + i * 6, 14);
        return (
          <div key={h.title} style={{position: 'absolute', left: h.x, top: 368, width: 490, height: 84, borderRadius: 18, background: C.panel, border: `3px solid ${h.c}`, display: 'flex', alignItems: 'center', gap: 14, padding: '0 22px', boxSizing: 'border-box', opacity: p, transform: `translateY(${(1 - p) * 20}px)`}}>
            <Icon d={h.icon} color={h.c} size={40} />
            <span style={{fontFamily: INTER, fontWeight: 700, fontSize: 28, color: C.text}}>{h.title}</span>
          </div>
        );
      })}
      {ROWS.map(([l, a, b], i) => {
        const at = A + 52 + i * 38;
        const p = ease(f, at, 14);
        const y = 476 + i * 146;
        return (
          <div key={l} style={{opacity: p, transform: `translateY(${(1 - p) * 24}px)`}}>
            <div style={{position: 'absolute', left: 44, top: y, fontFamily: INTER, fontWeight: 700, fontSize: 19, letterSpacing: '0.12em', color: C.grey}}>{l}</div>
            {[a, b].map((t, k) => (
              <div key={k} style={{position: 'absolute', left: k ? 550 : 40, top: y + 32, width: 490, height: 98, borderRadius: 16, background: C.win, border: `2px solid ${C.line}`, display: 'flex', alignItems: 'center', padding: '0 22px', boxSizing: 'border-box', fontFamily: INTER, fontWeight: 600, fontSize: 26, lineHeight: 1.3, color: C.text}}>{t}</div>
            ))}
          </div>
        );
      })}
    </AbsoluteFill>
  );
};

/* ===================== Checklist ===================== */
const Mini: React.FC<{k: number; lf: number}> = ({k, lf}) => {
  const chip = (t: string, at: number, on = true) => (
    <span key={t} style={{display: 'inline-flex', alignItems: 'center', gap: 6, fontFamily: INTER, fontWeight: 600, fontSize: 19, color: C.text, background: C.panel, border: `2px solid ${on ? C.blue : C.line}`, borderRadius: 10, padding: '5px 10px', opacity: ease(lf, at, 8)}}>{t}</span>
  );
  if (k === 0) return <div style={{display: 'flex', flexWrap: 'wrap', gap: 8}}>{['R$ 59,90', 'P · M · G', 'Em estoque', 'Frete grátis'].map((t, i) => chip(t, 14 + i * 6))}</div>;
  if (k === 1)
    return (
      <div style={{display: 'flex', flexDirection: 'column', gap: 8}}>
        {chip('Tem tamanho G? Sim', 14)}
        {chip('Prazo de entrega: 3 dias', 22)}
      </div>
    );
  if (k === 2) {
    const fill = interpolate(lf, [12, 40], [0, 4.8], clamp);
    return (
      <div>
        <div style={{display: 'flex', gap: 4}}>
          {[0, 1, 2, 3, 4].map((i) => (
            <div key={i} style={{position: 'relative', width: 34, height: 34}}>
              <Icon d={I.star} color={C.dim} size={34} />
              <div style={{position: 'absolute', inset: 0, width: `${Math.max(0, Math.min(1, fill - i)) * 100}%`, overflow: 'hidden'}}>
                <svg width={34} height={34} viewBox="0 0 24 24"><path d={I.star[0]} fill={C.amber} /></svg>
              </div>
            </div>
          ))}
        </div>
        <div style={{fontFamily: INTER, fontWeight: 600, fontSize: 19, color: C.grey, marginTop: 6}}>{fill.toFixed(1).replace('.', ',')} · 1.240 avaliações</div>
      </div>
    );
  }
  if (k === 3) return <div style={{display: 'flex', flexWrap: 'wrap', gap: 8}}>{['blog de moda', 'marketplace', 'guia local'].map((t, i) => chip(t, 14 + i * 7))}</div>;
  return (
    <div style={{display: 'flex', gap: 8}}>
      {['Site', 'Marketplace', 'Google'].map((t, i) => (
        <div key={t} style={{background: C.panel, border: `2px solid ${C.line}`, borderRadius: 10, padding: '6px 10px', textAlign: 'center', opacity: ease(lf, 14 + i * 6, 8)}}>
          <div style={{fontFamily: INTER, fontWeight: 600, fontSize: 16, color: C.grey}}>{t}</div>
          <div style={{fontFamily: INTER, fontWeight: 700, fontSize: 19, color: C.text}}>R$ 59,90</div>
        </div>
      ))}
    </div>
  );
};
const ITEMS: [string, string][] = [
  ['Dados completos do produto', 'preço, tamanhos, estoque e frete bem descritos'],
  ['Respostas a perguntas reais', 'o que o cliente pergunta antes de comprar'],
  ['Avaliações de clientes', 'prova de que a loja é confiável'],
  ['Menções em outros sites', 'a IA confia no que consegue confirmar'],
  ['Dados iguais em todo lugar', 'mesmo preço e informação no site e fora dele'],
];
const Checklist: React.FC = () => {
  const f = useCurrentFrame();
  const A = 734;
  if (f < A || f > 1124) return null;
  const o = ease(f, A, 14) * fadeOut(f, 1108, 14);
  return (
    <AbsoluteFill style={{opacity: o}}>
      <div style={{position: 'absolute', left: 80, right: 80, top: 150, ...headline, fontSize: 84, color: C.text}}>
        <Reveal delay={A + 2}>O QUE FAZER</Reveal>
        <div style={{marginTop: 8}}><Highlight delay={A + 8} bg={C.navy} color={C.white}>NO SITE.</Highlight></div>
      </div>
      {ITEMS.map(([t, s], i) => {
        const at = A + 30 + i * 64;
        const p = ease(f, at, 14);
        const on = ease(f, at + 30, 8);
        return (
          <div key={t} style={{position: 'absolute', left: 40, right: 40, top: 370 + i * 156, height: 140, borderRadius: 20, background: C.win, border: `2px solid ${on > 0.5 ? C.blue : C.line}`, opacity: p, transform: `translateX(${(1 - p) * -40}px)`}}>
            <div style={{position: 'absolute', left: 24, top: 40, width: 58, height: 58, borderRadius: 29, background: on > 0 ? C.blue : C.panel, border: `2px solid ${on > 0 ? C.blue : C.line}`, display: 'flex', alignItems: 'center', justifyContent: 'center'}}>
              {on > 0 ? <div style={{transform: `scale(${on})`}}><Icon d={I.check} color="#fff" size={32} sw={3} /></div> : <span style={{fontFamily: INTER, fontWeight: 700, fontSize: 24, color: C.grey}}>{i + 1}</span>}
            </div>
            <div style={{position: 'absolute', left: 104, top: 28, width: 440}}>
              <div style={{fontFamily: INTER, fontWeight: 700, fontSize: 26, color: C.text, whiteSpace: 'nowrap'}}>{t}</div>
              <div style={{fontFamily: INTER, fontWeight: 500, fontSize: 21, color: C.grey, marginTop: 6, lineHeight: 1.35}}>{s}</div>
            </div>
            <div style={{position: 'absolute', left: 560, right: 20, top: 0, bottom: 0, display: 'flex', alignItems: 'center'}}>
              <Mini k={i} lf={f - at} />
            </div>
          </div>
        );
      })}
    </AbsoluteFill>
  );
};

/* ===================== Final ===================== */
const Final: React.FC = () => {
  const f = useCurrentFrame();
  const A = 1126;
  if (f < A) return null;
  return (
    <div style={{position: 'absolute', left: 80, right: 80, top: 300, ...headline, fontSize: 98, color: C.text}}>
      <Reveal delay={A + 2}>ANÚNCIO TRAZ</Reveal>
      <Reveal delay={A + 6}>VISIBILIDADE AGORA.</Reveal>
      <Reveal delay={A + 22} style={{marginTop: 30}}>SITE PREPARADO TRAZ</Reveal>
      <div style={{marginTop: 8}}><Highlight delay={A + 28} bg={C.navy} color={C.white}>RECOMENDAÇÃO SEMPRE.</Highlight></div>
      <div style={{fontFamily: INTER, fontWeight: 600, fontSize: 38, color: C.grey, textTransform: 'none', letterSpacing: 0, marginTop: 50, opacity: ease(f, A + 50, 12)}}>O ideal é usar os dois.</div>
      <div style={{fontFamily: fonts.display, fontWeight: 700, fontSize: 40, letterSpacing: '0.06em', color: C.text, textTransform: 'none', marginTop: 40, opacity: ease(f, A + 64, 12)}}>Thiago Silva · Paid Media Analyst</div>
    </div>
  );
};

/* ===================== Sons ===================== */
type Cue = [number, string, number];
const cues: Cue[] = [];
const add = (fs: number[], n: string, v: number) => fs.forEach((x) => cues.push([x, n, v]));
add([0], 'impact', 0.5);
add([88, 420, 730, 1110], 'whoosh', 0.3);
for (let x = 100, k = 0; x <= 148; x += 3, k++) cues.push([x, `key${k % 3}`, 0.25]);
add([152], 'click', 0.6);
add([156], 'sent', 0.4);
for (let x = 190; x <= 290; x += 6) cues.push([x, 'tick', 0.08]);
add([306], 'open', 0.45);
add([330, 340], 'tick', 0.35);
add([446, 452], 'tick', 0.3);
add([476, 514, 552, 590, 628], 'ding', 0.22);
add([794, 858, 922, 986, 1050], 'tick', 0.35);
add([1160], 'success', 0.4);
add([1190], 'final', 0.4);
const Sfx: React.FC = () => (
  <>
    {cues.map(([x, n, v], i) => (
      <Sequence key={i} from={x} durationInFrames={60} layout="none">
        <Audio src={staticFile(`sfx/${n}.wav`)} volume={v} />
      </Sequence>
    ))}
  </>
);

const CAPS: [number, number, string][] = [
  [160, 300, 'Alguém pergunta para a IA onde comprar'],
  [334, 414, 'Dois jeitos de aparecer: na resposta ou no anúncio'],
  [640, 712, 'Um compra visibilidade. O outro constrói recomendação.'],
  [1060, 1104, 'A IA recomenda quem ela consegue entender e confirmar'],
];

export const Geo: React.FC = () => {
  setErrosTheme(true);
  const f = useCurrentFrame();
  const dim = interpolate(f, [80, 96], [0.65, 0], clamp);
  return (
    <AbsoluteFill style={{background: C.bg}}>
      <Chat />
      <div style={{position: 'absolute', inset: 0, background: '#000', opacity: f < 96 ? dim : 0}} />
      <Hook />
      <Compare />
      <Checklist />
      <Final />
      {CAPS.map(([a, b, t]) => <Caption key={a} from={a} to={b} text={t} top={1200} />)}
      <div style={{position: 'absolute', top: 58, left: 80, fontFamily: fonts.display, fontWeight: 700, fontSize: 32, letterSpacing: '0.04em', color: C.text}}>Thiago Silva</div>
      <Grain opacity={0.06} />
      <Sfx />
      <Audio src={staticFile('music/trilha-leve-44.wav')} volume={0.26} />
    </AbsoluteFill>
  );
};
