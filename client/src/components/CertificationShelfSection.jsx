import { SlideInOnScroll } from "./ScrollMotion.jsx";

const areaNames = {
  it: "IT",
  poetry: "Poetry and arts",
  leadership: "Leadership",
  other: "Other",
};

export default function CertificationShelfSection({ certifications }) {
  // Nothing to show yet, so the section stays hidden until the first certification is added
  const earned = (certifications || []).filter(
    (certificate) => certificate.title,
  );
  if (earned.length === 0) return null;

  return (
    <section id="certificationShelf" className="sectionShell">
      <SlideInOnScroll as="header" className="sectionHeading">
        {/* <span className="sectionNumber">07</span> */}
        <h2>Certification/Awards</h2>
      </SlideInOnScroll>

      <div className="certificationGrid">
        {earned.map((certificate, position) => (
          <SlideInOnScroll
            as="article"
            key={`${certificate.title}-${position}`}
            className="certificationCard"
            delay={position * 90}
          >
            <div className="certificationTop">
              <span className="certificationArea">
                {areaNames[certificate.area] || areaNames.other}
              </span>
              {certificate.year && (
                <span className="workYear">{certificate.year}</span>
              )}
            </div>
            <h3>{certificate.title}</h3>
            {certificate.issuer && (
              <p className="certificationIssuer">{certificate.issuer}</p>
            )}
            {certificate.link && (
              <a
                className="workLink"
                href={certificate.link}
                target="_blank"
                rel="noreferrer"
              >
                View credential &rarr;
              </a>
            )}
          </SlideInOnScroll>
        ))}
      </div>
    </section>
  );
}
