let tick = null;
let prevTick = Date.now();
let elapsed = null;
const fps = 1000 / 60;

const state = {
    frameId: -1,
    canvas: null,
    context: null,
    video: null,
    videoWidth: 0,
    videoHeight: 0,
};

let currentNode = 0;

window.requestAnimationFrame = window.requestAnimationFrame
    // @ts-ignore    
    || window.mozRequestAnimationFrame
    || window.webkitRequestAnimationFrame
    // @ts-ignore
    || window.msRequestAnimationFrame
    || ((f) => setTimeout(f, 1000/60));

export const init = (canvas, { width, height }) => {
    state.canvas = canvas;
    // state.canvas.width = width;
    // state.canvas.height = height;
    
    state.context = state.canvas.getContext("2d");
    state.video = document.createElement("video");
    
    state.video.addEventListener("loadedmetadata", (e) => {
        state.videoWidth = state.video.videoWidth;
        state.videoHeight = state.video.videoHeight;
        state.videoX = (640 - state.videoWidth) / 2;
        state.videoY = (480 - state.videoHeight) / 2;
    }, false);

    const drawFrame = (tick, elapsed, x, y, width, height) => {
        state.context.drawImage(state.video, x, y, width, height);
        return false;
    }
    
    const mainloop = () => {
        state.frameId = requestAnimationFrame(mainloop);
    
        tick = Date.now();
        elapsed = tick - prevTick;
    
        if (elapsed > fps) {
            prevTick = tick - (elapsed % fps);
        }
    
        if (drawFrame(tick, elapsed, state.videoX, state.videoY, state.videoWidth, state.videoHeight)) {
            cancelAnimationFrame(state.frameId);
        }
    }

    const nextNode = () => {
        currentNode += 1;
        switch (currentNode) {
            case 0:
                state.video.src = 'data/XV/56003.mp4';
                break;
            case 1:
                state.video.src = 'data/XV/56002.mp4';
                break;
            case 2:
                state.video.src = 'data/XV/19668.mp4';
                break;
            case 3:
                state.video.src = 'data/XV/56001.mp4';
                break;
            default:
                state.video.src = '';
                break;
        }
        state.context.fillRect(0, 0, 640, 480);
        if (currentNode < 4) {
            state.video.play();
        }
    };

    state.video.addEventListener("ended", (e) => {
        nextNode();
    }, false);

    state.canvas.addEventListener("click", (e) => {
        state.video.pause();
        nextNode();
    }, false);

    state.video.loop = false;
    state.video.muted = false;
    state.video.autoplay = false;
    state.video.src = 'data/XV/56003.mp4';
    state.video.play();
    mainloop();
};
