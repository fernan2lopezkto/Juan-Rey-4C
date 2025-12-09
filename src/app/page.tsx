'use client';

import ReactPlayer from 'react-player';

export default function Home() {
  return (
    <div className="flex min-h-screen items-center justify-center bg-base-100">
      <h1 className="display-block text-5xl font-bold text-base-content">Juan Rey 4C</h1>
      <div>
        <ReactPlayer
          url="https://youtu.be/gV7RkJtBOjU?si=zXjqhDBQ7FLIKT59"
          controls={true}
          volume={0.5}
          width={"100%"}
          height={"100%"}
        />
      </div>
<div><iframe width="560" height="315" src="https://www.youtube.com/embed/eN0jYomsO_M?si=hQqCqt5SUqt22C2W" title="YouTube video player" frameborder="0" allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share" referrerpolicy="strict-origin-when-cross-origin" allowfullscreen></iframe>
</div>

    </div>

  );
}
