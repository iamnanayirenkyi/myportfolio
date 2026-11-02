import { DownloadIcon } from "./SocialIcons.jsx";

const pageLinks = [
  { label: "About", target: "#whoIAm" },
  { label: "Skills", target: "#craftSkills" },
  { label: "Stages", target: "#stagesPlayed" },
  { label: "Watch", target: "#watchAndListen" },
  { label: "Work", target: "#workShelf" },
  { label: "Coming Up", target: "#comingUp" },
  { label: "Certs", target: "#certificationShelf" },
];

export default function NavigationBar({ cvUrl, voice, onVoiceChange }) {
  return (
    <header className="siteTopBar">
      <a
        className="siteSignature"
        href="#introStage"
        aria-label="Back to the top"
      >
        <span className="signatureInitials">NY</span>
        <span className="signatureNames">
          {voice === "poet" ? "Nana " : "Andrews Yirenkyi"}
        </span>
      </a>

      <nav className="topBarLinks" aria-label="Page sections">
        {pageLinks.map((link) => (
          <a key={link.target} href={link.target}>
            {link.label}
          </a>
        ))}
      </nav>

      <div className="topBarActions">
        <div
          className="voiceSwitch"
          role="group"
          aria-label="Choose which side to see"
        >
          <button
            type="button"
            className={
              voice === "developer"
                ? "voiceChoice voiceChoiceOn"
                : "voiceChoice"
            }
            onClick={() => onVoiceChange("developer")}
          >
            Dev
          </button>
          <button
            type="button"
            className={
              voice === "poet" ? "voiceChoice voiceChoiceOn" : "voiceChoice"
            }
            onClick={() => onVoiceChange("poet")}
          >
            Poet
          </button>
        </div>

        <a
          className="cvDownloadButton"
          href={cvUrl || "#reachMe"}
          download={cvUrl ? "Andrews-Yirenkyi-CV" : undefined}
          title={cvUrl ? "Download my CV" : "CV coming soon, say hello below"}
        >
          <DownloadIcon />
          <span>CV</span>
        </a>
      </div>
    </header>
  );
}
