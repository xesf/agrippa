import React from 'react';

const player = document.createElement('video');

export default class Video extends React.Component {
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
            <div ref={this.containerRef} />
        );
    }
}

export { player };
