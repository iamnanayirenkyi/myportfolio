import { useState } from "react";
import { SlideInOnScroll } from "./ScrollMotion.jsx";

const filterChoices = [
  { value: "all", label: "Everything" },
  { value: "software", label: "Software" },
  { value: "poetry", label: "Poetry" },
];

export default function WorkShelfSection({ works }) {
  const [chosenFilter, setChosenFilter] = useState("all");
  const visibleWorks = works.filter(
    (work) => chosenFilter === "all" || work.kind === chosenFilter,
  );

  return (
    <section id="workShelf" className="sectionShell">
      <SlideInOnScroll as="header" className="sectionHeading">
        {/* <span className="sectionNumber">05</span> */}
        <h2>Past work</h2>
      </SlideInOnScroll>

      <div className="filterChoices" role="group" aria-label="Filter past work">
        {filterChoices.map((choice) => (
          <button
            key={choice.value}
            type="button"
            className={
              chosenFilter === choice.value
                ? "filterChoice filterChoiceOn"
                : "filterChoice"
            }
            onClick={() => setChosenFilter(choice.value)}
          >
            {choice.label}
          </button>
        ))}
      </div>

      <div className="workCardGrid">
        {visibleWorks.map((work, position) => (
          <SlideInOnScroll
            as="article"
            key={`${work.title}-${position}`}
            className="workCard"
            delay={position * 90}
          >
            <div className="workCardTop">
              <span
                className={
                  work.kind === "poetry"
                    ? "workKind workKindPoetry"
                    : "workKind workKindSoftware"
                }
              >
                {work.kind === "poetry" ? "Poetry" : "Software"}
              </span>
              <span className="workYear">{work.year}</span>
            </div>
            <h3>{work.title}</h3>
            <p>{work.summary}</p>
            {work.link && (
              <a
                className="workLink"
                href={work.link}
                target="_blank"
                rel="noreferrer"
              >
                Take a look &rarr;
              </a>
            )}
          </SlideInOnScroll>
        ))}
      </div>
    </section>
  );
}
