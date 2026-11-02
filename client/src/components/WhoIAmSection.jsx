import { SlideInOnScroll, WordByWord } from "./ScrollMotion.jsx";

export default function WhoIAmSection({ profile, voice }) {
  const developerCardClass =
    voice === "developer" ? "voiceCard voiceCardSpotlight" : "voiceCard";
  const poetCardClass =
    voice === "poet" ? "voiceCard voiceCardSpotlight" : "voiceCard";

  return (
    <section id="whoIAm" className="sectionShell">
      <SlideInOnScroll as="header" className="sectionHeading">
        {/* <span className="sectionNumber">01</span> */}
        <h2>Two In One</h2>
      </SlideInOnScroll>

      <div className="voiceCardPair">
        <SlideInOnScroll as="article" className={developerCardClass} delay={0}>
          <span className="voiceCardLabel">Andrews, The developer</span>
          <WordByWord text={profile.developerBio} />
        </SlideInOnScroll>
        <SlideInOnScroll as="article" className={poetCardClass} delay={150}>
          <span className="voiceCardLabel">Nana, The Poet</span>
          <WordByWord text={profile.poetBio} />
        </SlideInOnScroll>
      </div>
    </section>
  );
}
