import React from 'react';

import { init } from './media';

import Canvas, { canvas } from './Canvas';
import Video, { player } from './Video';

class Player extends React.Component {
    constructor(props) {
        super(props);
        this.state = {

        };
        this.load = this.load.bind(this, null);
    }
    componentDidMount() {
        this.setState(init(canvas, player, { width: 640, height: 480 }));
        if (this.state.player && this.props.src) {
            this.state.player.load(this.props.src);
        }
    }

    load(src) {
        this.state.player.load(src);
    }

    render() {
        return (
            <Canvas width="2700" height="1480">
                <Video hidden />
            </Canvas>
        );
    }
}

export default Player;
