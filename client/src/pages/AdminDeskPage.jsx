import { useEffect, useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { onAuthStateChanged, signOut } from "firebase/auth";
import { ownerAuth } from "../firebase.js";
import { fetchSiteContent, saveSiteContent, sendFileToServer } from "../api.js";
import { TextField, ListEditor } from "../components/EditorFields.jsx";

const kindChoices = [
  { value: "software", label: "Software" },
  { value: "poetry", label: "Poetry" },
];

export default function AdminDeskPage() {
  const goTo = useNavigate();
  const [owner, setOwner] = useState(null);
  const [authChecked, setAuthChecked] = useState(false);
  const [content, setContent] = useState(null);
  const [message, setMessage] = useState({ text: "", good: true });
  const [isSaving, setIsSaving] = useState(false);

  useEffect(() => {
    if (!ownerAuth) {
      goTo("/admin/login");
      return undefined;
    }
    return onAuthStateChanged(ownerAuth, (person) => {
      setAuthChecked(true);
      if (!person) goTo("/admin/login");
      else setOwner(person);
    });
  }, [goTo]);

  useEffect(() => {
    if (!owner) return;
    fetchSiteContent()
      .then(setContent)
      .catch((problem) => setMessage({ text: problem.message, good: false }));
  }, [owner]);

  function showMessage(text, good = true) {
    setMessage({ text, good });
  }

  function changeSection(section, newValue) {
    setContent((current) => ({ ...current, [section]: newValue }));
  }
  function changeProfile(key, newValue) {
    changeSection("profile", { ...content.profile, [key]: newValue });
  }
  function changeSocial(key, newValue) {
    changeSection("socials", { ...content.socials, [key]: newValue });
  }
  function changeMentoring(key, newValue) {
    changeSection("mentoring", { ...content.mentoring, [key]: newValue });
  }

  async function saveEverything() {
    setIsSaving(true);
    try {
      const token = await owner.getIdToken();
      await saveSiteContent(content, token);
      showMessage("Saved. The live page now shows your changes.");
    } catch (problem) {
      showMessage(problem.message, false);
    } finally {
      setIsSaving(false);
    }
  }

  async function uploadAndStore(kind, file, profileKey) {
    if (!file) return;
    showMessage("Uploading...");
    try {
      const token = await owner.getIdToken();
      const { url } = await sendFileToServer(kind, file, token);
      const updatedProfile = { ...content.profile, [profileKey]: url };
      const updatedContent = { ...content, profile: updatedProfile };
      setContent(updatedContent);
      await saveSiteContent(updatedContent, token);
      showMessage("Uploaded and saved.");
    } catch (problem) {
      showMessage(problem.message, false);
    }
  }

  if (!authChecked || (owner && !content && message.good)) {
    return (
      <main className="statusScreen">
        <span className="loadingPulse" aria-hidden="true" />
        <p>Opening your desk...</p>
      </main>
    );
  }
  if (!owner) return null;
  if (!content) {
    return (
      <main className="statusScreen">
        <p className="messageBar messageBad">{message.text}</p>
        <Link className="outlineButton" to="/">
          Back to the site
        </Link>
      </main>
    );
  }

  return (
    <main className="adminDesk">
      <div className="adminDeskTop">
        <h1>Admin desk</h1>
        <div className="adminDeskButtons">
          <Link className="smallButton" to="/">
            View site
          </Link>
          <button
            type="button"
            className="smallButton"
            onClick={() => signOut(ownerAuth)}
          >
            Sign out
          </button>
          <button
            type="button"
            className="solidButton"
            onClick={saveEverything}
            disabled={isSaving}
          >
            {isSaving ? "Saving..." : "Save changes"}
          </button>
        </div>
      </div>

      {message.text && (
        <p
          className={`messageBar ${message.good ? "messageGood" : "messageBad"}`}
        >
          {message.text}
        </p>
      )}

      <section className="editorPanel">
        <h2>Profile picture and CV</h2>
        <div className="fieldGroup">
          <label>Profile picture (JPG, PNG or WebP, up to 8 MB)</label>
          <div className="uploadRow">
            {content.profile.photoUrl && (
              <img
                className="uploadPreview"
                src={content.profile.photoUrl}
                alt="Current profile"
              />
            )}
            <input
              type="file"
              accept="image/jpeg,image/png,image/webp"
              onChange={(e) =>
                uploadAndStore("photo", e.target.files[0], "photoUrl")
              }
            />
          </div>
        </div>
        <div className="fieldGroup">
          <label>CV (PDF or Word, up to 8 MB)</label>
          <div className="uploadRow">
            {content.profile.cvUrl && (
              <a
                className="smallButton"
                href={content.profile.cvUrl}
                target="_blank"
                rel="noreferrer"
              >
                View current CV
              </a>
            )}
            <input
              type="file"
              accept=".pdf,.doc,.docx"
              onChange={(e) => uploadAndStore("cv", e.target.files[0], "cvUrl")}
            />
          </div>
        </div>
      </section>

      <section className="editorPanel">
        <h2>About you</h2>
        <div className="fieldPair">
          <TextField
            label="Full name"
            value={content.profile.fullName}
            onChange={(v) => changeProfile("fullName", v)}
          />
          <TextField
            label="Stage name"
            value={content.profile.stageName}
            onChange={(v) => changeProfile("stageName", v)}
          />
          <TextField
            label="Location"
            value={content.profile.location}
            onChange={(v) => changeProfile("location", v)}
          />
          <TextField
            label="Contact email"
            type="email"
            value={content.profile.email}
            onChange={(v) => changeProfile("email", v)}
          />
        </div>
        <TextField
          label="Developer tagline"
          value={content.profile.developerTagline}
          onChange={(v) => changeProfile("developerTagline", v)}
        />
        <TextField
          label="Poet tagline"
          value={content.profile.poetTagline}
          onChange={(v) => changeProfile("poetTagline", v)}
        />
        <TextField
          label="Developer bio"
          multiline
          value={content.profile.developerBio}
          onChange={(v) => changeProfile("developerBio", v)}
        />
        <TextField
          label="Poet bio"
          multiline
          value={content.profile.poetBio}
          onChange={(v) => changeProfile("poetBio", v)}
        />
      </section>

      <section className="editorPanel">
        <h2>IT skills</h2>
        <ListEditor
          itemName="Skill"
          items={content.skills}
          onChange={(v) => changeSection("skills", v)}
          blankItem={{ title: "", detail: "", level: 70 }}
          fields={[
            { key: "title", label: "Skill name" },
            { key: "detail", label: "Short description", multiline: true },
            { key: "level", label: "Comfort level (0 to 100)", type: "number" },
          ]}
        />
      </section>

      <section className="editorPanel">
        <h2>Certifications/Awards</h2>
        <ListEditor
          itemName="Certification"
          items={content.certifications || []}
          onChange={(v) => changeSection("certifications", v)}
          blankItem={{ title: "", issuer: "", year: "", area: "it", link: "" }}
          fields={[
            { key: "title", label: "Certification name" },
            { key: "issuer", label: "Issued by (organisation)" },
            { key: "year", label: "Year" },
            {
              key: "area",
              label: "Area",
              choices: [
                { value: "it", label: "IT" },
                { value: "poetry", label: "Poetry" },
                { value: "leadership", label: "Leadership" },
                { value: "other", label: "Other" },
              ],
            },
            {
              key: "link",
              label: "Credential link (optional)",
              placeholder: "https://...",
            },
          ]}
        />
      </section>

      <section className="editorPanel">
        <h2>Stages performed</h2>
        <ListEditor
          itemName="Stage"
          items={content.performanceStages}
          onChange={(v) => changeSection("performanceStages", v)}
          blankItem={{ name: "", place: "", year: "", scope: "local" }}
          fields={[
            { key: "name", label: "Event or stage name" },
            { key: "place", label: "City, country" },
            { key: "year", label: "Year" },
            {
              key: "scope",
              label: "Where",
              choices: [
                { value: "local", label: "Local" },
                { value: "international", label: "International" },
              ],
            },
          ]}
        />
      </section>

      <section className="editorPanel">
        <h2>YouTube videos</h2>
        <ListEditor
          itemName="Video"
          items={content.videos}
          onChange={(v) => changeSection("videos", v)}
          blankItem={{ youtube: "", title: "", note: "" }}
          fields={[
            {
              key: "youtube",
              label: "YouTube link or video id",
              placeholder: "https://www.youtube.com/watch?v=...",
            },
            { key: "title", label: "Title" },
            { key: "note", label: "Short note (optional)" },
          ]}
        />
      </section>

      <section className="editorPanel">
        <h2>Past work</h2>
        <ListEditor
          itemName="Work"
          items={content.pastWorks}
          onChange={(v) => changeSection("pastWorks", v)}
          blankItem={{
            title: "",
            kind: "software",
            year: "",
            summary: "",
            link: "",
          }}
          fields={[
            { key: "title", label: "Title" },
            { key: "kind", label: "Type", choices: kindChoices },
            { key: "year", label: "Year" },
            { key: "summary", label: "Summary", multiline: true },
            { key: "link", label: "Link (optional)" },
          ]}
        />
      </section>

      <section className="editorPanel">
        <h2>Coming up</h2>
        <ListEditor
          itemName="Event"
          items={content.upcomingWorks}
          onChange={(v) => changeSection("upcomingWorks", v)}
          blankItem={{
            title: "",
            kind: "poetry",
            date: "",
            place: "",
            summary: "",
          }}
          fields={[
            { key: "title", label: "Title" },
            { key: "kind", label: "Type", choices: kindChoices },
            { key: "date", label: "Date" },
            { key: "place", label: "Venue or online" },
            { key: "summary", label: "What to expect", multiline: true },
          ]}
        />
      </section>

      <section className="editorPanel">
        <h2>Mentorship</h2>
        <TextField
          label="Heading"
          value={content.mentoring.heading}
          onChange={(v) => changeMentoring("heading", v)}
        />
        <TextField
          label="Text"
          multiline
          value={content.mentoring.text}
          onChange={(v) => changeMentoring("text", v)}
        />
        <ListEditor
          itemName="Figure"
          items={content.mentoring.figures || []}
          onChange={(v) => changeMentoring("figures", v)}
          blankItem={{ number: "", label: "" }}
          fields={[
            { key: "number", label: "Number, for example 25+" },
            { key: "label", label: "Label" },
          ]}
        />
      </section>

      <section className="editorPanel">
        <h2>Social links (full web addresses)</h2>
        <TextField
          label="Instagram"
          value={content.socials.instagram}
          onChange={(v) => changeSocial("instagram", v)}
        />
        <TextField
          label="X"
          value={content.socials.x}
          onChange={(v) => changeSocial("x", v)}
        />
        <TextField
          label="YouTube channel"
          value={content.socials.youtube}
          onChange={(v) => changeSocial("youtube", v)}
        />
        <TextField
          label="GitHub"
          value={content.socials.github}
          onChange={(v) => changeSocial("github", v)}
        />
      </section>
    </main>
  );
}
