'use client';

import ReactPlayer from 'react-player';

const urlJ = "https://youtu.be/gV7RkJtBOjU?si=zXjqhDBQ7FLIKT59"

export default function Home() {
  return (
    <div className="grid grid-cols-3 text-center flex min-h-screen items-center justify-center bg-base-100">
      <h1 className="display-block col-span-3 text-5xl font-bold text-base-content">Juan Rey 4C</h1>
      <div className="col-span-3 items-center">
        <h2>Video 1 reactPlayer src y watch?</h2>
        <ReactPlayer className="items-center"
          src="https://www.youtube.com/watch?v=eN0jYomsO_M?si=hQqCqt5SUqt22C2W"
          controls={true}
          volume={0.5}
        // width="560"
        // height="315"
        />
      </div>
      <div className="col-span-3 items-center">
        <h2>Video 2 react-player también</h2>
        <ReactPlayer
          src="https://www.youtube.com/watch?v=gV7RkJtBOjU?si=zXjqhDBQ7FLIKT59"
          controls={true}
          volume={0.5}
        // width={"100%"}
        // height={"100%"}
        />
      </div>
      <div className="col-span-3 items-center">
        <h2>Video 3 iframe</h2>
        <iframe
          width="280"
          height="157"
          src="https://www.youtube.com/embed/eN0jYomsO_M?si=hQqCqt5SUqt22C2W"
          title="YouTube video player"
          frameBorder="0"
          allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
          referrerPolicy="strict-origin-when-cross-origin"
          allowFullScreen>
        </iframe>
      </div>
      <div className="col-span-3 items-center">
        <h2>Video 4</h2>
        <iframe
          width="560"
          height="315"
          src="https://www.youtube.com/embed/gV7RkJtBOjU?si=zXjqhDBQ7FLIKT59"
          title="YouTube video player"
          frameBorder="50"
          allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
          referrerPolicy="strict-origin-when-cross-origin"
          allowFullScreen>
        </iframe>
      </div>
    </div>

  );
}
