"""Melhora a foto do avatar: recorte, fundo desfocado (efeito retrato), contraste/nitidez e espelhamento."""
import sys

import numpy as np
from PIL import Image, ImageEnhance, ImageFilter, ImageOps

src, out = sys.argv[1], sys.argv[2]
im = Image.open(src).convert('RGB')
# recorte quadrado em volta da cabeça (coordenadas da foto original 1717x2576)
x0, y0, s = 515, 360, 830
im = im.crop((x0, y0, x0 + s, y0 + s)).resize((900, 900), Image.LANCZOS)

# realce do rosto
face = ImageEnhance.Contrast(im).enhance(1.10)
face = ImageEnhance.Color(face).enhance(1.06)
face = ImageEnhance.Brightness(face).enhance(1.04)
face = face.filter(ImageFilter.UnsharpMask(radius=2, percent=70, threshold=2))
# leve tom quente
arr = np.asarray(face).astype(np.float32)
arr[..., 0] *= 1.03
arr[..., 2] *= 0.97
face = Image.fromarray(np.clip(arr, 0, 255).astype(np.uint8))

# fundo: desfocado, menos saturado e um pouco mais escuro
bg = im.filter(ImageFilter.GaussianBlur(16))
bg = ImageEnhance.Color(bg).enhance(0.6)
bg = ImageEnhance.Brightness(bg).enhance(0.86)

# máscara elíptica suave em volta da cabeça e do pescoço
h, w = 900, 900
yy, xx = np.mgrid[0:h, 0:w]
cx, cy, rx, ry = 0.52 * w, 0.50 * h, 0.33 * w, 0.47 * h
d = ((xx - cx) / rx) ** 2 + ((yy - cy) / ry) ** 2
mask = np.clip((1.35 - d) / 0.55, 0, 1)
mask = Image.fromarray((mask * 255).astype(np.uint8)).filter(ImageFilter.GaussianBlur(20))

final = Image.composite(face, bg, mask)
final = ImageOps.mirror(final)  # olha para o lado do texto
final.save(out, quality=94)
print('ok', final.size)
