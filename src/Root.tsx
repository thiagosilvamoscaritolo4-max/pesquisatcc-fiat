import React from 'react';
import {Composition} from 'remotion';
import {Carrossel, totalDuration} from './Carrossel';
import {Frase, frases} from './Frase';
import {Tweet, tweets} from './Tweet';
import {Citacao, citacoes} from './Citacao';
import {Boleto, boletoDuration} from './boleto/Boleto';
import {Fluxo, fluxoDuration} from './fluxo/Fluxo';
import {DURATION2, Fluxo2} from './fluxo2/Fluxo2';
import {ERROS_DURATION, Erros} from './erros/Erros';
import {ErrosMobile} from './erros/mobile';
import {FraseClean, frasesClean} from './FraseClean';
import {TweetLight, tweetsLight} from './TweetLight';

export const Root: React.FC = () => (
  <>
  <Composition
    id="Reels"
    component={Carrossel}
    durationInFrames={totalDuration}
    fps={30}
    width={1080}
    height={1920}
  />
  <Composition
    id="Carrossel"
    component={Carrossel}
    durationInFrames={totalDuration}
    fps={30}
    width={1080}
    height={1350}
  />
  {frases.map((f) => (
    <Composition key={f.id} id={f.id} component={Frase} defaultProps={f.props} durationInFrames={120} fps={30} width={1080} height={1350} />
  ))}
  {tweets.map((t) => (
    <Composition key={t.id} id={t.id} component={Tweet} defaultProps={t.props} durationInFrames={1} fps={30} width={1080} height={1440} />
  ))}
  {citacoes.map((c) => (
    <Composition key={c.id} id={c.id} component={Citacao} defaultProps={c.props} durationInFrames={1} fps={30} width={1080} height={1440} />
  ))}
  <Composition id="Boleto" component={Boleto} durationInFrames={boletoDuration} fps={30} width={1080} height={1350} />
  <Composition id="Fluxo" component={Fluxo} durationInFrames={fluxoDuration} fps={30} width={1080} height={1350} />
  <Composition id="FluxoLinkedin" component={Fluxo} defaultProps={{variant: 'linkedin' as const}} durationInFrames={fluxoDuration} fps={30} width={1080} height={1350} />
  <Composition id="FluxoLinkedinV3" component={Fluxo2} defaultProps={{variant: 'linkedin' as const}} durationInFrames={DURATION2} fps={30} width={1080} height={1350} />
  <Composition id="FluxoInstagramV3" component={Fluxo2} defaultProps={{variant: 'instagram' as const}} durationInFrames={DURATION2} fps={30} width={1080} height={1350} />
  <Composition id="ErrosMetaAds" component={Erros} durationInFrames={ERROS_DURATION} fps={30} width={1080} height={1350} />
  <Composition id="ErrosMetaAdsReels" component={ErrosMobile} durationInFrames={ERROS_DURATION} fps={30} width={1080} height={1920} />
  {frasesClean.map((c) => (
    <Composition key={c.id} id={c.id} component={FraseClean} defaultProps={c.props} durationInFrames={1} fps={30} width={1080} height={1440} />
  ))}
  {tweetsLight.map((c) => (
    <Composition key={c.id} id={c.id} component={TweetLight} defaultProps={c.props} durationInFrames={1} fps={30} width={1080} height={1440} />
  ))}
  </>
);
