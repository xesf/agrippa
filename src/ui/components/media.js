// let tick = null;
// let prevTick = Date.now();
// let elapsed = null;
// const fps = 1000 / 60;

// const state = {
//     frameId: -1,
//     canvas: null,
//     context: null,
//     video: null,
//     player: null,
//     videoWidth: 0,
//     videoHeight: 0,
//     videoReady: false,
//     currentTime: 0,
// };

// let currentNode = -1;

// window.requestAnimationFrame = window.requestAnimationFrame
//     // @ts-ignore
//     || window.mozRequestAnimationFrame
//     || window.webkitRequestAnimationFrame
//     // @ts-ignore
//     || window.msRequestAnimationFrame
//     || (f => setTimeout(f, 1000 / 60));

// export const init = (canvas, video, { width, height }) => {
//     state.canvas = canvas;
//     state.video = video;
//     console.log(width, height);
//     // state.canvas.width = width;
//     // state.canvas.height = height;

//     const nextNode = () => {
//         let src = '';
//         currentNode += 1;
//         switch (currentNode) {
//             case 0:
//                 src = 'http://localhost:8080/dash/56003/';
//                 break;
//             case 1:
//                 src = 'http://localhost:8080/dash/56002/';
//                 break;
//             case 2:
//                 src = 'http://localhost:8080/dash/19668/';
//                 break;
//             case 3:
//                 src = 'http://localhost:8080/dash/56001/';
//                 break;
//             case 4:
//                 currentNode = -1;
//                 break;
//             default:
//                 src = '';
//                 break;
//         }
//         state.videoReady = false;
//         state.video.autoplay = true;
//         if (canvas) {
//             state.context.fillRect(0, 0, state.canvas.width, state.canvas.height);
//             if (currentNode >= 0 && currentNode < 4) {
//                 state.player.load(src, state.currentTime);
//             }
//         }
//     };

//     state.video.addEventListener('ended', (e) => {
//         console.log(e);
//         state.videoReady = false;
//         nextNode();
//     }, false);

//     state.video.addEventListener('canplaythrough', (e) => {
//         console.log(e);
//         state.videoReady = true;
//     }, false);

//     state.video.addEventListener('error', (e) => {
//         console.log(e);
//     }, false);

//     state.video.preload = 'auto';
//     state.video.loop = false;
//     state.video.muted = false;
//     state.video.autoplay = false;
//     state.video.controls = false;

//     shaka.polyfill.installAll(); // eslint-disable-line
//     state.player = new shaka.Player(state.video); // eslint-disable-line

//     state.player.addEventListener('error', onErrorEvent);

//     if (canvas) {
//         state.context = state.canvas.getContext('2d');

//         state.video.addEventListener('loadedmetadata', (e) => {
//             console.log(e);
//             state.videoWidth = state.video.videoWidth;
//             state.videoHeight = state.video.videoHeight;
//             // state.canvas.width = state.videoWidth;
//             // state.canvas.height = state.videoHeight;
//             state.videoX = (state.canvas.width - state.videoWidth) / 2;
//             state.videoY = (state.canvas.height - state.videoHeight) / 2;
//             console.log('file width/height', state.videoWidth, state.videoHeight);
//             console.log('canvas pos videoX/videoY', state.videoX, state.videoY);
//         }, false);

//         const drawFrame = (tick, elapsed, x, y, width, height) => {
//             if (state.videoReady) {
//                 state.context.drawImage(state.video, x, y, width, height);
//             }
//             return false;
//         };

//         const mainloop = () => {
//             state.frameId = requestAnimationFrame(mainloop);

//             tick = Date.now();
//             elapsed = tick - prevTick;

//             if (elapsed > fps) {
//                 prevTick = tick - (elapsed % fps);
//             }

//             if (drawFrame(tick, elapsed,
//                 state.videoX, state.videoY,
//                 state.videoWidth, state.videoHeight)
//             ) {
//                 cancelAnimationFrame(state.frameId);
//             }
//         };

//         state.canvas.addEventListener('click', (e) => {
//             console.log(e);
//             state.video.pause();
//             nextNode();
//         }, false);

//         mainloop();
//     }

//     return state;
// };

// function onErrorEvent(event) {
//     onError(event.detail);
// }

// function onError(error) {
//     console.error('Error code', error.code, 'object', error);
// }
