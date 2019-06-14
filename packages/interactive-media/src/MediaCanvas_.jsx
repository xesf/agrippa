import React, { createRef } from 'react';

import { init } from './media';

class MediaCanvas extends React.Component {
    constructor(props) {
        super(props);
        this.canvasRef = createRef();
        init(this.canvasRef.current, { width: 640, height: 480 });
    }

    render() {
        return (<b>test</b>);
    }
}

export default MediaCanvas;
