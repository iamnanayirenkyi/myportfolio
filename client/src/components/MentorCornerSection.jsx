import { SlideInOnScroll, WordByWord } from "./ScrollMotion.jsx";

export default function MentorCornerSection({ mentoring }) {
  const figures = (mentoring.figures || []).filter((figure) => figure.number);
  return (
    <section id="mentorCorner" className="sectionShell">
      <SlideInOnScroll className="mentorPanel">
        <span className="voiceCardLabel">Mentorship</span>
        <h2>{mentoring.heading}</h2>
        <WordByWord text={mentoring.text} />
        {figures.length > 0 && (
          <ul className="mentorFigures">
            {figures.map((figure, position) => (
              <li key={`${figure.label}-${position}`}>
                <strong>{figure.number}</strong>
                <span>{figure.label}</span>clear
              </li>
            ))}
          </ul>
        )}
      </SlideInOnScroll>
    </section>
  );
}
