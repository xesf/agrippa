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
    videoReady: false,
};

let currentNode = -1;

window.requestAnimationFrame = window.requestAnimationFrame
    // @ts-ignore    
    || window.mozRequestAnimationFrame
    || window.webkitRequestAnimationFrame
    // @ts-ignore
    || window.msRequestAnimationFrame
    || ((f) => setTimeout(f, 1000/60));

export const init = (canvas, video, { width, height }) => {
    state.canvas = canvas;
    // state.canvas.width = width;
    // state.canvas.height = height;
    
    state.context = state.canvas.getContext("2d");
    // state.video = document.createElement("video");
    state.video = video;
    
    state.video.addEventListener("loadedmetadata", (e) => {
        state.videoWidth = state.video.videoWidth;
        state.videoHeight = state.video.videoHeight;
        state.videoX = (state.canvas.width - state.videoWidth) / 2;
        state.videoY = (state.canvas.height - state.videoHeight) / 2;
    }, false);

    const drawFrame = (tick, elapsed, x, y, width, height) => {
        if (state.videoReady) {
            state.context.drawImage(state.video, x, y, width, height);
        }
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
        state.video.type = 'application/dash+xml';
        switch (currentNode) {
            case 0:
                state.video.src = 'http://localhost:2349/dash/56003/';
                break;
            case 1:
                state.video.src = 'http://localhost:2349/dash/56002/';
                break;
            case 2:
                state.video.src = 'http://localhost:2349/dash/19668/';
                break;
            case 3:
                state.video.src = 'http://localhost:2349/dash/56001/';
                break;
            default:
                state.video.src = '';
                break;
        }
        state.context.fillRect(0, 0, state.canvas.width, state.canvas.height);
        if (currentNode < 4) {
            state.video.play();
        }
    };

    state.video.addEventListener("ended", (e) => {
        state.videoReady = false;
        nextNode();
    }, false);

    state.video.addEventListener("canplaythrough", (e) => {
        state.videoReady = true;
    }, false);

    state.video.addEventListener("error", (e) => {
        console.log(e);
    }, false);

    state.canvas.addEventListener("click", (e) => {
        state.video.pause();
        nextNode();
    }, false);

    state.video.preload = 'auto';
    state.video.loop = false;
    state.video.muted = false;
    state.video.autoplay = true;
    // nextNode();
    initApp(state.video);
    mainloop();
};


function initApp(video) {
    // Install built-in polyfills to patch browser incompatibilities.
    shaka.polyfill.installAll(); // eslint-disable-line

    // Check to see if the browser supports the basic APIs Shaka needs.
    if (shaka.Player.isBrowserSupported()) { // eslint-disable-line
        // Everything looks good!
        initPlayer(video);
    } else {
        // This browser does not have the minimum set of APIs we need.
        console.error('Browser not supported!');
    }
}

function initPlayer(video) {
    // Create a Player instance.
    // var video = document.getElementsByTagName('video')[0];
    var player = new shaka.Player(video); // eslint-disable-line

    // Attach player to the window to make it easy to access in the JS console.
    window.player = player;

    // Listen for error events.
    player.addEventListener('error', onErrorEvent);

    // Try to load a manifest.
    // This is an asynchronous process.
    player.load('http://localhost:2349/dash/19668/').then(function() {
        // This runs if the asynchronous load is successful.
        console.log('The video has now been loaded!');
    }).catch(onError);  // onError is executed if the asynchronous load fails.
    // player.play();
}

function onErrorEvent(event) {
    // Extract the shaka.util.Error object from the event.
    onError(event.detail);
}

function onError(error) {
    // Log the error.
    console.error('Error code', error.code, 'object', error);
}

// document.addEventListener('DOMContentLoaded', initApp);
