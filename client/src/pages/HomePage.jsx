import { useEffect, useState } from 'react';
import { fetchSiteContent } from '../api.js';
import NavigationBar from '../components/NavigationBar.jsx';
import IntroStage from '../components/IntroStage.jsx';
import WhoIAmSection from '../components/WhoIAmSection.jsx';
import CraftSkillsSection from '../components/CraftSkillsSection.jsx';
import StagesPlayedSection from '../components/StagesPlayedSection.jsx';
import WatchAndListenSection from '../components/WatchAndListenSection.jsx';
import WorkShelfSection from '../components/WorkShelfSection.jsx';
import ComingUpSection from '../components/ComingUpSection.jsx';
import CertificationShelfSection from '../components/CertificationShelfSection.jsx';
import MentorCornerSection from '../components/MentorCornerSection.jsx';
import SiteFooter from '../components/SiteFooter.jsx';

export default function HomePage() {
  const [content, setContent] = useState(null);
  const [loadProblem, setLoadProblem] = useState('');
  const [voice, setVoice] = useState('developer');

  useEffect(() => {
    document.documentElement.dataset.voice = voice;
  }, [voice]);

  useEffect(() => {
    fetchSiteContent()
      .then(setContent)
      .catch((problem) => setLoadProblem(problem.message));
  }, []);

  if (loadProblem) {
    return (
      <main className="statusScreen">
        <h1>The page could not load</h1>
        <p>{loadProblem}</p>
        <button type="button" className="solidButton" onClick={() => window.location.reload()}>Try again</button>
      </main>
    );
  }

  if (!content) {
    return (
      <main className="statusScreen">
        <span className="loadingPulse" aria-hidden="true" />
        <p>Setting the stage...</p>
      </main>
    );
  }

  return (
    <>
      <NavigationBar cvUrl={content.profile.cvUrl} voice={voice} onVoiceChange={setVoice} />
      <main>
        <IntroStage profile={content.profile} voice={voice} />
        <WhoIAmSection profile={content.profile} voice={voice} />
        <CraftSkillsSection skills={content.skills} />
        <StagesPlayedSection stages={content.performanceStages} />
        <WatchAndListenSection videos={content.videos} youtubeUrl={content.socials.youtube} />
        <WorkShelfSection works={content.pastWorks} />
        <ComingUpSection upcomingWorks={content.upcomingWorks} />
        <CertificationShelfSection certifications={content.certifications} />
        <MentorCornerSection mentoring={content.mentoring} />
      </main>
      <SiteFooter profile={content.profile} socials={content.socials} />
    </>
  );
}
