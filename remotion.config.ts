import {Config} from '@remotion/cli/config';
// Usa o Chromium já instalado no ambiente (sem download).
if (process.env.REMOTION_CHROME) Config.setBrowserExecutable(process.env.REMOTION_CHROME);
Config.setChromiumOpenGlRenderer('swangle');
