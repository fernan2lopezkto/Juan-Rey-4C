'use client';

import ReactPlayer from 'react-player';

const urlJ = "https://youtu.be/gV7RkJtBOjU?si=zXjqhDBQ7FLIKT59"

export default function Home() {
  return (
    <div className="flex min-h-screen items-center justify-center bg-base-100">
      <h1 className="display-block text-5xl font-bold text-base-content">Juan Rey 4C</h1>
      {/* <Grid container */}
      {/* justifyContent="center" */}
      {/* alignItems="center" */}
      {/* spacing={2} */}
      {/* > */}
      {/* <Grid item xs={12} md={6}> */}
      <div>
        <h2>Video 1</h2>
        <ReactPlayer
          url="https://www.youtube.com/embed/eN0jYomsO_M?si=hQqCqt5SUqt22C2W"
          controls={true}
          volume={0.5}
          width={"100%"}
          height={"100%"}
        />
      </div>
      {/* </Grid> */}
      {/* <Grid item xs={12} md={6}> */}
      <div>
        <h2>Video 2</h2>
        <ReactPlayer
          url="https://www.youtube.com/embed/gV7RkJtBOjU?si=zXjqhDBQ7FLIKT59"
          controls={true}
          volume={0.5}
          width={"100%"}
          height={"100%"}
        />
      </div>
      {/* </Grid> */}
      {/* <Grid item xs={12}> */}
      <div>
        <h2>Video 3</h2>
        <iframe
          width="560"
          height="315"
          src="https://www.youtube.com/embed/eN0jYomsO_M?si=hQqCqt5SUqt22C2W"
          title="YouTube video player"
          frameborder="0"
          allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
          referrerpolicy="strict-origin-when-cross-origin"
          allowfullscreen>
        </iframe>
      </div>
      <div>
        <h2>Video 4</h2>
        <iframe
          width="560"
          height="315"
          src="https://www.youtube.com/embed/gV7RkJtBOjU?si=zXjqhDBQ7FLIKT59"
          title="YouTube video player"
          frameborder="0"
          allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
          referrerpolicy="strict-origin-when-cross-origin"
          allowfullscreen>
        </iframe>
      </div>
      {/* </Grid> */}
      {/* </Grid> */}
    </div>

  );
}
