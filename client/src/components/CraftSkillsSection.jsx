import { SlideInOnScroll } from "./ScrollMotion.jsx";
import { useSeenOnScreen } from "../hooks/useSeenOnScreen.js";

function SkillCard({ skill, position }) {
  const [spotRef, hasBeenSeen] = useSeenOnScreen();
  return (
    <article
      ref={spotRef}
      className={`skillCard slideIn ${hasBeenSeen ? "slideInDone" : ""}`}
      style={{ "--slideDelay": `${position * 130}ms` }}
    >
      <h3>{skill.title}</h3>
      <p>{skill.detail}</p>
      <div
        className="skillMeter"
        role="img"
        aria-label={`${skill.title} comfort level ${skill.level} percent`}
      >
        <div
          className="skillMeterFill"
          style={{ "--filledTo": `${skill.level}%` }}
        />
      </div>
    </article>
  );
}

export default function CraftSkillsSection({ skills }) {
  return (
    <section id="craftSkills" className="sectionShell">
      <SlideInOnScroll as="header" className="sectionHeading">
        {/* <span className="sectionNumber">02</span> */}
        <h2>What I Explore</h2>
      </SlideInOnScroll>
      <div className="skillCardRow">
        {skills.map((skill, position) => (
          <SkillCard
            key={`${skill.title}-${position}`}
            skill={skill}
            position={position}
          />
        ))}
      </div>
    </section>
  );
}
