import { useEffect, useState } from "react";

const rolesForVoice = {
  developer: [
    "Software Developer",
    "Database Keeper",
    "Network Problem Solver",
    "Team Member",
  ],
  poet: ["Writer", "Spoken Word Artist", "Storyteller", "Mentor"],
};

function useTypedRole(voice) {
  const roles = rolesForVoice[voice];
  const [roleNumber, setRoleNumber] = useState(0);
  const [lettersShown, setLettersShown] = useState(0);
  const [isDeleting, setIsDeleting] = useState(false);

  useEffect(() => {
    setRoleNumber(0);
    setLettersShown(0);
    setIsDeleting(false);
  }, [voice]);

  useEffect(() => {
    const currentRole = roles[roleNumber % roles.length];
    const pause =
      !isDeleting && lettersShown === currentRole.length
        ? 1500
        : isDeleting
          ? 35
          : 75;
    const timer = setTimeout(() => {
      if (!isDeleting && lettersShown === currentRole.length) {
        setIsDeleting(true);
      } else if (isDeleting && lettersShown === 0) {
        setIsDeleting(false);
        setRoleNumber((number) => number + 1);
      } else {
        setLettersShown((count) => count + (isDeleting ? -1 : 1));
      }
    }, pause);
    return () => clearTimeout(timer);
  }, [lettersShown, isDeleting, roleNumber, roles]);

  return roles[roleNumber % roles.length].slice(0, lettersShown);
}

export default function IntroStage({ profile, voice }) {
  const typedRole = useTypedRole(voice);
  const displayName = voice === "poet" ? profile.stageName : profile.fullName;
  const tagline =
    voice === "poet" ? profile.poetTagline : profile.developerTagline;
  const initials = profile.fullName
    .split(" ")
    .map((part) => part[0])
    .join("")
    .slice(0, 2);

  return (
    <section id="introStage" className="introStage">
      <div className="introWords">
        <p className="introGreeting">Hey!</p>
        <h1 className="introName" key={displayName} aria-label={displayName}>
          {displayName.split("").map((letter, position) => (
            <span
              key={`${letter}-${position}`}
              className="introLetter"
              style={{ "--letterPosition": position }}
              aria-hidden="true"
            >
              {letter === " " ? " " : letter}
            </span>
          ))}
        </h1>
        <p className="introRole">
          <span className="introRoleTyped">{typedRole}</span>
          <span className="introCaret" aria-hidden="true" />
        </p>
        <p className="introTagline" key={tagline}>
          {tagline}
        </p>
        <div className="introButtons">
          <a className="solidButton" href="#workShelf">
            See my work
          </a>
          <a className="outlineButton" href="#reachMe">
            Get in touch
          </a>
        </div>
      </div>

      <div className="portraitFrame">
        <div className="portraitGlow" aria-hidden="true" />
        {profile.photoUrl ? (
          <img
            className="portraitPicture"
            src={profile.photoUrl}
            alt={`Portrait of ${profile.fullName}`}
          />
        ) : (
          <div
            className="portraitPlaceholder"
            aria-label="Profile picture goes here"
          >
            {initials}
          </div>
        )}
        <span className="portraitTag">{profile.location}</span>
      </div>
    </section>
  );
}
