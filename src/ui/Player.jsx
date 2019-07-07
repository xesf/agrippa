import React from 'react';

import { init } from './media';

import Canvas, { canvas } from './Canvas';
import Video, { player } from './Video';

class Player extends React.Component {
    componentDidMount() {
        init(canvas, player, { width: 640, height: 480 });
    }

    render() {
        return (
            <Canvas width="2700" height="1920">
                <Video hidden />
            </Canvas>
        );
    }
}

export default Player;
