import React from 'react';

import { init } from './media';

import Canvas, { canvas } from './Canvas';
import Video, { player } from './Video';

class MediaCanvas extends React.Component {
    // constructor(props) {
    //     super(props);
    //     this.state = {
    //         videoRef: React.createRef(),
    //         canvasRef: React.createRef(),
    //     };
    // }

    componentDidMount() {
        // init(this.state.canvasRef.current, this.state.videoRef.current, { width: 640, height: 480 });
        init(canvas, player, { width: 640, height: 480 });
    }

    render() {
        return (
            // <div>
            //     <video ref={this.state.videoRef} src='data/XV/56003.mp4' autoPlay />
            //     <canvas ref={this.state.canvasRef} width="640" height="480" />
            // </div>
            <div className="canvas-container">
                <Canvas width="2700" height="1920">
                    <Video hidden />
                </Canvas>
            </div>
        );
    }
}

export default MediaCanvas;
