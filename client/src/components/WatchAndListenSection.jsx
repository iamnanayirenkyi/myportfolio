import { useState } from "react";
import { SlideInOnScroll } from "./ScrollMotion.jsx";
import { pullYoutubeId } from "../api.js";

function VideoPreviewCard({ video, position }) {
  const [isPlaying, setIsPlaying] = useState(false);
  const videoId = pullYoutubeId(video.youtube);
  if (!videoId) return null;

  return (
    <SlideInOnScroll
      as="article"
      className="videoPreviewCard"
      delay={position * 110}
    >
      <div className="videoScreen">
        {isPlaying ? (
          <iframe
            src={`https://www.youtube-nocookie.com/embed/${videoId}?autoplay=1&rel=0`}
            title={video.title}
            allow="autoplay; encrypted-media; picture-in-picture"
            allowFullScreen
          />
        ) : (
          <button
            type="button"
            className="videoPlayTrigger"
            onClick={() => setIsPlaying(true)}
            aria-label={`Play ${video.title}`}
          >
            <img
              src={`https://img.youtube.com/vi/${videoId}/hqdefault.jpg`}
              alt=""
              loading="lazy"
            />
            <span className="videoPlayDisc" aria-hidden="true">
              <svg
                viewBox="0 0 24 24"
                width="26"
                height="26"
                fill="currentColor"
              >
                <path d="M8 5v14l11-7z" />
              </svg>
            </span>
          </button>
        )}
      </div>
      <h3>{video.title}</h3>
      {video.note && <p>{video.note}</p>}
    </SlideInOnScroll>
  );
}

export default function WatchAndListenSection({ videos, youtubeUrl }) {
  const playable = videos.filter((video) => pullYoutubeId(video.youtube));
  return (
    <section id="watchAndListen" className="sectionShell">
      <SlideInOnScroll as="header" className="sectionHeading">
        {/* <span className="sectionNumber">04</span> */}
        <h2>Watch and listen</h2>
      </SlideInOnScroll>

      {playable.length === 0 ? (
        <p className="quietNote">
          Performance videos are on their way. Check back soon.
        </p>
      ) : (
        <div className="videoPreviewGrid">
          {playable.map((video, position) => (
            <VideoPreviewCard
              key={`${video.youtube}-${position}`}
              video={video}
              position={position}
            />
          ))}
        </div>
      )}

      {youtubeUrl && (
        <SlideInOnScroll className="sectionFootLink">
          <a
            className="outlineButton"
            href={youtubeUrl}
            target="_blank"
            rel="noreferrer"
          >
            More on YouTube
          </a>
        </SlideInOnScroll>
      )}
    </section>
  );
}
