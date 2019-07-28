import React from 'react';

export default class Video extends React.Component {
    constructor(props) {
        super(props);
        this.state = {};
        this.videoRef = React.createRef();
    }

    togglePlay() {
        if (this.videoRef.current.paused) {
            this.videoRef.current.play();
        } else {
            this.videoRef.current.pause();
        }
        return !this.videoRef.current.paused;
    }

    render() {
        const { children, ...rest } = this.props;
        return (
            <div className="video-preview-container">
                <video
                    ref={this.videoRef}
                    {...rest}
                >
                    {children}
                </video>
            </div>
        );
    }
}
