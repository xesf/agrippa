import React from 'react';

const player = document.createElement('video');
player.className = 'video-preview';

export default class Video2 extends React.Component {
    constructor(props) {
        super(props);
        this.containerRef = React.createRef();
    }

    componentDidMount() {
        if (!this.props.hidden) {
            this.containerRef.current.appendChild(player);
        }
    }

    render() {
        return (
            <div ref={this.containerRef} className="video-preview-container" />
        );
    }
}

export { player };
