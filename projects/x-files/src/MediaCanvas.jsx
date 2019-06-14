import React from 'react';

import { init } from 'interactive-media/src/media';

class MediaCanvas extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            canvasRef: React.createRef(),
        };
    }

    componentDidMount() {
        init(this.state.canvasRef.current, { width: 640, height: 480 });
    }

    render() {
        return (
            <canvas ref={this.state.canvasRef} width="640" height="480" />
        );
    }
}

export default MediaCanvas;
