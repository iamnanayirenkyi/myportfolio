import { SlideInOnScroll } from "./ScrollMotion.jsx";

export default function StagesPlayedSection({ stages }) {
  return (
    <section id="stagesPlayed" className="sectionShell">
      <SlideInOnScroll as="header" className="sectionHeading">
        {/* <span className="sectionNumber">03</span> */}
        <h2>Stages I have stood on</h2>
      </SlideInOnScroll>

      <ol className="stageTimeline">
        {stages.map((stage, position) => (
          <SlideInOnScroll
            as="li"
            key={`${stage.name}-${position}`}
            className="stageEntry"
            delay={position * 80}
          >
            <span className="stageYear">{stage.year}</span>
            <div className="stageDetails">
              <h3>{stage.name}</h3>
              <p>{stage.place}</p>
            </div>
            <span
              className={
                stage.scope === "international"
                  ? "stageBadge stageBadgeAbroad"
                  : "stageBadge"
              }
            >
              {stage.scope === "international" ? "International" : "Local"}
            </span>
          </SlideInOnScroll>
        ))}
      </ol>
    </section>
  );
}
