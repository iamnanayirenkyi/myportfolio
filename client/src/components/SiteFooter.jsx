import {
  InstagramIcon,
  XIcon,
  YoutubeIcon,
  GithubIcon,
} from "./SocialIcons.jsx";

const socialPlatforms = [
  { key: "instagram", label: "Instagram", Icon: InstagramIcon },
  { key: "x", label: "X", Icon: XIcon },
  { key: "youtube", label: "YouTube", Icon: YoutubeIcon },
  { key: "github", label: "GitHub", Icon: GithubIcon },
];

export default function SiteFooter({ profile, socials }) {
  return (
    <footer id="reachMe" className="siteFooter">
      <div className="footerMessage">
        <h2>We Can Make Impact Together</h2>
        <p>Want to Connect? Say hello!.</p>
        {profile.email && (
          <a className="footerEmail" href={`mailto:${profile.email}`}>
            {profile.email}
          </a>
        )}
      </div>

      <ul className="socialIconRow" aria-label="Find me online">
        {socialPlatforms.map(({ key, label, Icon }) =>
          socials[key] ? (
            <li key={key}>
              <a
                className="socialIconLink"
                href={socials[key]}
                target="_blank"
                rel="noreferrer"
                aria-label={label}
                title={label}
              >
                <Icon />
              </a>
            </li>
          ) : null,
        )}
      </ul>

      <p className="footerSmallPrint">
        &copy; {new Date().getFullYear()} {profile.fullName} &middot;{" "}
        {profile.stageName}
        <a className="footerAdminDoor" href="/admin/login">
          Admin
        </a>
      </p>
    </footer>
  );
}
