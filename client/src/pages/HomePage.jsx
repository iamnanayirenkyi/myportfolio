import { Component, useCallback, useEffect, useState } from "react";
import { fetchSiteContent } from "../api.js";
import NavigationBar from "../components/NavigationBar.jsx";
import IntroStage from "../components/IntroStage.jsx";
import WhoIAmSection from "../components/WhoIAmSection.jsx";
import CraftSkillsSection from "../components/CraftSkillsSection.jsx";
import StagesPlayedSection from "../components/StagesPlayedSection.jsx";
import WatchAndListenSection from "../components/WatchAndListenSection.jsx";
import WorkShelfSection from "../components/WorkShelfSection.jsx";
import ComingUpSection from "../components/ComingUpSection.jsx";
import CertificationShelfSection from "../components/CertificationShelfSection.jsx";
import MentorCornerSection from "../components/MentorCornerSection.jsx";
import SiteFooter from "../components/SiteFooter.jsx";

const VOICE_STORAGE_KEY = "portfolio:voice";
const DEFAULT_VOICE = "developer";

function readStoredVoice() {
  try {
    return window.localStorage.getItem(VOICE_STORAGE_KEY) || DEFAULT_VOICE;
  } catch {
    return DEFAULT_VOICE;
  }
}

function storeVoice(voice) {
  try {
    window.localStorage.setItem(VOICE_STORAGE_KEY, voice);
  } catch {
    // Storage can be blocked (private mode, etc.). Ignore.
  }
}

// Lets one broken section fail alone instead of taking down the whole page.
class SectionBoundary extends Component {
  state = { failed: false };

  static getDerivedStateFromError() {
    return { failed: true };
  }

  componentDidCatch(error) {
    console.error(`Section "${this.props.name}" failed to render:`, error);
  }

  render() {
    if (this.state.failed) return null;
    return this.props.children;
  }
}

export default function HomePage() {
  const [content, setContent] = useState(null);
  const [loadProblem, setLoadProblem] = useState("");
  const [attempt, setAttempt] = useState(0);
  const [voice, setVoice] = useState(readStoredVoice);

  useEffect(() => {
    document.documentElement.dataset.voice = voice;
    storeVoice(voice);
  }, [voice]);

  useEffect(() => {
    let cancelled = false;
    setLoadProblem("");

    fetchSiteContent()
      .then((data) => {
        if (!cancelled) setContent(data);
      })
      .catch((problem) => {
        if (!cancelled) {
          setLoadProblem(
            problem?.message || "Something went wrong while loading the site.",
          );
        }
      });

    return () => {
      cancelled = true;
    };
  }, [attempt]);

  const retry = useCallback(() => setAttempt((n) => n + 1), []);

  if (loadProblem) {
    return (
      <main className="statusScreen" role="alert">
        <h1>The page could not load</h1>
        <p>{loadProblem}</p>
        <button type="button" className="solidButton" onClick={retry}>
          Try again
        </button>
      </main>
    );
  }

  if (!content) {
    return (
      <main className="statusScreen" role="status" aria-live="polite">
        <span className="loadingPulse" aria-hidden="true" />
        <p>Setting the stage...</p>
      </main>
    );
  }

  const profile = content.profile ?? {};
  const socials = content.socials ?? {};

  return (
    <>
      <NavigationBar
        cvUrl={profile.cvUrl}
        voice={voice}
        onVoiceChange={setVoice}
      />
      <main>
        <SectionBoundary name="intro">
          <IntroStage profile={profile} voice={voice} />
        </SectionBoundary>

        <SectionBoundary name="who-i-am">
          <WhoIAmSection profile={profile} voice={voice} />
        </SectionBoundary>

        <SectionBoundary name="craft-skills">
          <CraftSkillsSection skills={content.skills ?? []} />
        </SectionBoundary>

        <SectionBoundary name="stages-played">
          <StagesPlayedSection stages={content.performanceStages ?? []} />
        </SectionBoundary>

        <SectionBoundary name="watch-and-listen">
          <WatchAndListenSection
            videos={content.videos ?? []}
            youtubeUrl={socials.youtube}
          />
        </SectionBoundary>

        <SectionBoundary name="work-shelf">
          <WorkShelfSection works={content.pastWorks ?? []} />
        </SectionBoundary>

        <SectionBoundary name="coming-up">
          <ComingUpSection upcomingWorks={content.upcomingWorks ?? []} />
        </SectionBoundary>

        <SectionBoundary name="certifications">
          <CertificationShelfSection
            certifications={content.certifications ?? []}
          />
        </SectionBoundary>

        <SectionBoundary name="mentoring">
          <MentorCornerSection mentoring={content.mentoring} />
        </SectionBoundary>
      </main>
      <SiteFooter profile={profile} socials={socials} />
    </>
  );
}
