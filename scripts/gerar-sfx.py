"""Gera os efeitos sonoros do vídeo (sintetizados, sem direitos autorais)."""
import wave
from pathlib import Path

import numpy as np

SR = 44100
OUT = Path(__file__).resolve().parent.parent / 'public' / 'sfx'
OUT.mkdir(parents=True, exist_ok=True)
rng = np.random.default_rng(7)


def t(d):
    return np.arange(int(SR * d)) / SR


def env(n, a=0.002, decay=0.1):
    x = np.arange(n) / SR
    att = np.clip(x / a, 0, 1) if a > 0 else 1
    return att * np.exp(-x / decay)


def lowpass(x, cutoff):
    """Passa-baixa de 1 polo (cutoff pode variar no tempo)."""
    cutoff = np.broadcast_to(cutoff, x.shape)
    y = np.zeros_like(x)
    prev = 0.0
    for i in range(len(x)):
        a = 1 - np.exp(-2 * np.pi * cutoff[i] / SR)
        prev += a * (x[i] - prev)
        y[i] = prev
    return y


def highpass(x, cutoff):
    return x - lowpass(x, cutoff)


def sweep(f0, f1, d):
    tt = t(d)
    f = np.geomspace(f0, f1, len(tt))
    return np.sin(2 * np.pi * np.cumsum(f) / SR)


def save(name, x, gain=0.9):
    x = x / (np.max(np.abs(x)) + 1e-9) * gain
    pad = np.zeros(int(SR * 0.02))
    x = np.concatenate([x, pad])
    data = (np.clip(x, -1, 1) * 32767).astype(np.int16)
    with wave.open(str(OUT / f'{name}.wav'), 'wb') as w:
        w.setnchannels(1)
        w.setsampwidth(2)
        w.setframerate(SR)
        w.writeframes(data.tobytes())


# clique de mouse
n = rng.standard_normal(int(SR * 0.03))
click = highpass(n, 2500) * env(len(n), 0.0005, 0.006) + 0.6 * np.sin(2 * np.pi * 3200 * t(0.03)) * env(int(SR * 0.03), 0.0005, 0.008)
save('click', click, 0.8)

# tecla (3 variações)
for k in range(3):
    n = rng.standard_normal(int(SR * 0.025))
    f = 1800 + 500 * k
    key = highpass(n, f) * env(len(n), 0.0003, 0.005) + 0.35 * np.sin(2 * np.pi * (f * 0.6) * t(0.025)) * env(int(SR * 0.025), 0.0005, 0.006)
    save(f'key{k}', key, 0.5)

# whoosh (movimento de câmera)
d = 0.45
n = rng.standard_normal(int(SR * d))
x = np.linspace(0, 1, len(n))
cut = 300 + 3200 * np.sin(np.pi * x) ** 2
w = lowpass(n, cut) * np.sin(np.pi * x) ** 1.5
save('whoosh', w, 0.55)

# impacto (corte para o plano aberto)
d = 0.6
boom = np.sin(2 * np.pi * 55 * t(d)) * env(int(SR * d), 0.002, 0.18)
n = rng.standard_normal(int(SR * d))
boom += 0.5 * lowpass(n, 900) * env(len(n), 0.001, 0.05)
save('impact', boom, 0.85)

# abrir janela (pop subindo) / fechar (descendo)
d = 0.12
save('open', sweep(320, 980, d) * env(int(SR * d), 0.003, 0.06), 0.55)
save('close', sweep(760, 260, d) * env(int(SR * d), 0.003, 0.05), 0.4)

# bloco concluído (ding curto)
d = 0.35
ding = (np.sin(2 * np.pi * 1320 * t(d)) + 0.4 * np.sin(2 * np.pi * 2640 * t(d))) * env(int(SR * d), 0.002, 0.09)
save('ding', ding, 0.45)

# check da lista
d = 0.08
save('tick', np.sin(2 * np.pi * 2100 * t(d)) * env(int(SR * d), 0.001, 0.018), 0.4)

# erro (buzz duplo)
d = 0.14
b = np.sign(np.sin(2 * np.pi * 150 * t(d))) * 0.6 + np.sin(2 * np.pi * 157 * t(d))
b = lowpass(b, 1400) * env(int(SR * d), 0.004, 0.08)
gap = np.zeros(int(SR * 0.05))
save('error', np.concatenate([b, gap, b]), 0.6)

# sucesso (arpejo de duas notas)
d = 0.5
n1 = np.sin(2 * np.pi * 880 * t(d)) * env(int(SR * d), 0.003, 0.15)
n2 = np.sin(2 * np.pi * 1318.5 * t(d)) * env(int(SR * d), 0.003, 0.22)
succ = np.zeros(int(SR * 0.62))
succ[: len(n1)] += n1
succ[int(SR * 0.1): int(SR * 0.1) + len(n2)] += n2
save('success', succ, 0.5)

# mensagem enviada
d = 0.16
sent = sweep(700, 1500, d) * env(int(SR * d), 0.002, 0.05)
save('sent', sent, 0.4)

# mensagem recebida (dois toques)
d = 0.18
a1 = np.sin(2 * np.pi * 1046 * t(d)) * env(int(SR * d), 0.002, 0.07)
a2 = np.sin(2 * np.pi * 1568 * t(d)) * env(int(SR * d), 0.002, 0.09)
rec = np.zeros(int(SR * 0.32))
rec[: len(a1)] += a1
rec[int(SR * 0.12): int(SR * 0.12) + len(a2)] += a2
save('received', rec, 0.5)

# final (acorde suave)
d = 1.6
fin = sum(np.sin(2 * np.pi * f * t(d)) for f in (523.25, 659.25, 783.99, 1046.5)) * env(int(SR * d), 0.01, 0.5)
save('final', fin, 0.5)

print('ok', sorted(p.name for p in OUT.glob('*.wav')))
