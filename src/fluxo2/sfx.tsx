import React from 'react';
import {Audio, Sequence, staticFile} from 'remotion';
import {S} from './flow';

type Cue = [number, string, number]; // frame, som, volume

const cues: Cue[] = [];
const add = (frames: number[], name: string, vol: number) => frames.forEach((f) => cues.push([Math.round(f), name, vol]));

// câmera
add([2], 'whoosh', 0.3);
add([60], 'impact', 0.6);
add([150, 306, 348, 440, 652, 684, 822, 900, 1042, 1130, S(1320), S(1452), S(1568), S(1608), S(1802), S(1880)], 'whoosh', 0.32);
// janelas abrindo / fechando
add([180, 480, 718, 938, 1168, S(1348), S(1482), S(1648)], 'open', 0.5);
add([290, 650, 820, 1040, S(1318), S(1450), S(1566), S(1800)], 'close', 0.32);
// mouse
add([252, 570, 630], 'click', 0.7);
// digitação: "API WhatsApp" (12 letras) e a mensagem pronta
for (let i = 0; i < 12; i++) cues.push([Math.round(578 + i * 1.6), `key${i % 3}`, 0.32]);
for (let f = 730; f <= 786; f += 2) cues.push([f, `key${(f / 2) % 3}`, 0.26]);
// blocos concluindo
add([298, 344, 384, 478, 682, 716, 856, 936, 1078, 1166, S(1606), S(1646)], 'ding', 0.32);
// checks e listas
add([258, 390, 398, 636, 858, 864, 870, 876, 968, 976, 984, 992, 1084, 1090, 1096, S(1640), S(1646), S(1652)], 'tick', 0.32);
// erro e aprovação
add([406], 'error', 0.5);
add([494], 'error', 0.3);
add([952], 'success', 0.5);
// WhatsApp
add([1182, 1200, 1222, 1240, S(1348) + 12, S(1348) + 28, S(1348) + 46, S(1348) + 66, S(1348) + 84, S(1482) + 12, S(1482) + 28, S(1648) + 12, S(1648) + 56, S(1648) + 100], 'sent', 0.4);
add([1304], 'received', 0.5);
// final
add([S(1915)], 'final', 0.45);

export const Sfx: React.FC = () => (
  <>
    {cues.map(([f, name, vol], i) => (
      <Sequence key={i} from={f} durationInFrames={60} layout="none">
        <Audio src={staticFile(`sfx/${name}.wav`)} volume={vol} />
      </Sequence>
    ))}
  </>
);
