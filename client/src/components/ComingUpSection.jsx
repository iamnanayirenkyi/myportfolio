import { SlideInOnScroll } from "./ScrollMotion.jsx";

export default function ComingUpSection({ upcomingWorks }) {
  return (
    <section id="comingUp" className="sectionShell">
      <SlideInOnScroll as="header" className="sectionHeading">
        {/* <span className="sectionNumber">06</span> */}
        <h2>Coming up</h2>
      </SlideInOnScroll>

      <div className="comingUpList">
        {upcomingWorks.map((item, position) => (
          <SlideInOnScroll
            as="article"
            key={`${item.title}-${position}`}
            className="comingUpCard"
            delay={position * 100}
          >
            <div className="comingUpDate">{item.date}</div>
            <div className="comingUpBody">
              <h3>{item.title}</h3>
              <p className="comingUpPlace">{item.place}</p>
              <p>{item.summary}</p>
            </div>
            <span
              className={
                item.kind === "poetry"
                  ? "workKind workKindPoetry"
                  : "workKind workKindSoftware"
              }
            >
              {item.kind === "poetry" ? "Poetry" : "Software"}
            </span>
          </SlideInOnScroll>
        ))}
      </div>
    </section>
  );
}
