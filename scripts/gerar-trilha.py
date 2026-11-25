"""Gera uma trilha lo-fi leve (sintetizada, sem direitos autorais)."""
import sys
import wave
from pathlib import Path

import numpy as np

SR = 44100
DUR = float(sys.argv[1]) if len(sys.argv) > 1 else 44.0
OUT = Path(sys.argv[2]) if len(sys.argv) > 2 else Path(__file__).resolve().parent.parent / 'public' / 'music' / 'trilha-leve.wav'
rng = np.random.default_rng(3)

BPM = 84
BEAT = 60 / BPM
BAR = 4 * BEAT
n = int(SR * DUR)
t = np.arange(n) / SR
mix = np.zeros(n)


def midi(m):
    return 440 * 2 ** ((m - 69) / 12)


def add(sig, start):
    i = int(start * SR)
    if i >= n:
        return
    j = min(n, i + len(sig))
    mix[i:j] += sig[: j - i]


# progressão: Am - F - C - G (um acorde por compasso)
CHORDS = [[57, 60, 64], [53, 57, 60], [48, 52, 55], [55, 59, 62]]
ROOTS = [45, 41, 48, 43]

bars = int(np.ceil(DUR / BAR))
for b in range(bars):
    ch = CHORDS[b % 4]
    t0 = b * BAR
    # pad suave (ataque e soltura lentos)
    L = BAR + 0.6
    tt = np.arange(int(SR * L)) / SR
    env = np.clip(tt / 0.8, 0, 1) * np.clip((L - tt) / 0.9, 0, 1)
    pad = sum(np.sin(2 * np.pi * midi(m) * tt) + 0.5 * np.sin(2 * np.pi * midi(m) * 1.003 * tt) for m in ch)
    add(0.045 * pad * env, t0)
    # baixo (mínimas)
    for k in range(2):
        tt = np.arange(int(SR * BEAT * 2)) / SR
        env = np.clip(tt / 0.02, 0, 1) * np.exp(-tt / 0.9)
        add(0.16 * np.sin(2 * np.pi * midi(ROOTS[b % 4]) * tt) * env, t0 + k * 2 * BEAT)
    # piano dedilhado (colcheias, notas do acorde uma oitava acima)
    pattern = [0, 1, 2, 1, 0, 2, 1, 2]
    for k, idx in enumerate(pattern):
        if rng.random() < 0.18:
            continue  # respira de vez em quando
        f = midi(ch[idx] + 12)
        tt = np.arange(int(SR * 0.9)) / SR
        env = np.clip(tt / 0.004, 0, 1) * np.exp(-tt / 0.32)
        tone = np.sin(2 * np.pi * f * tt + 0.6 * np.sin(2 * np.pi * f * 2 * tt) * np.exp(-tt / 0.15))
        add(0.07 * tone * env * (0.85 + 0.3 * rng.random()), t0 + k * BEAT / 2 + rng.normal(0, 0.006))

# bateria discreta
beats = int(DUR / BEAT)
for k in range(beats):
    tb = k * BEAT
    if k % 4 in (0, 2):  # bumbo
        tt = np.arange(int(SR * 0.28)) / SR
        f = 48 + 70 * np.exp(-tt / 0.03)
        kick = np.sin(2 * np.pi * np.cumsum(f) / SR) * np.exp(-tt / 0.11)
        add(0.22 * kick, tb)
    if k % 4 in (1, 3):  # caixa abafada
        tt = np.arange(int(SR * 0.2)) / SR
        nz = rng.standard_normal(len(tt))
        nz = np.convolve(nz, np.ones(6) / 6, mode='same')
        add(0.05 * nz * np.exp(-tt / 0.05), tb)
    # chimbal nas colcheias
    for h in (0, 0.5):
        tt = np.arange(int(SR * 0.05)) / SR
        nz = rng.standard_normal(len(tt))
        nz = nz - np.convolve(nz, np.ones(4) / 4, mode='same')
        add(0.018 * nz * np.exp(-tt / 0.012), tb + h * BEAT)

# chiado leve de vinil
mix += 0.004 * np.convolve(rng.standard_normal(n), np.ones(8) / 8, mode='same')

# fades e normalização
fade_in = np.clip(t / 1.5, 0, 1)
fade_out = np.clip((DUR - t) / 2.5, 0, 1)
mix *= fade_in * fade_out
mix = mix / (np.max(np.abs(mix)) + 1e-9) * 0.8
data = (mix * 32767).astype(np.int16)
OUT.parent.mkdir(parents=True, exist_ok=True)
with wave.open(str(OUT), 'wb') as w:
    w.setnchannels(1)
    w.setsampwidth(2)
    w.setframerate(SR)
    w.writeframes(data.tobytes())
print('ok', OUT, round(DUR, 1), 's')
