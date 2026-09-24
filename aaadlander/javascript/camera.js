const video = document.getElementById("gopro-video");
//gopro url
const streamUrl = "http://aaad02.avans.nl:8081/hls/gp267.m3u8";
//const streamUrl =
   // "http://aaad02.avans.nl:8081/hls/cubesat2.m3u8";


if (Hls.isSupported()) {

    const hls = new Hls();

    hls.loadSource(streamUrl);

    hls.attachMedia(video);

    hls.on(Hls.Events.MANIFEST_PARSED, () => {

        console.log("Stream loaded");

        video.play();
    });

}
else if (video.canPlayType("application/vnd.apple.mpegurl")) {

    video.src = streamUrl;

    video.addEventListener("loadedmetadata", () => {

        video.play();
    });
}