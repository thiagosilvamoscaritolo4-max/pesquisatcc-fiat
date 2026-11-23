import {continueRender, delayRender} from 'remotion';
import {fonts} from './theme';

const h = delayRender('fonts');
const specs = ['500 30px', '600 30px', '700 30px'].map((s) => `${s} ${fonts.body}`)
  .concat(['700 30px', '800 30px', '900 30px'].map((s) => `${s} ${fonts.display}`));
Promise.all(specs.map((s) => document.fonts.load(s, 'ÁÇÃÊ×→abc'))).then(() => continueRender(h));
