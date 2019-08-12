import React from 'react';

export default class VideoCanvas extends React.Component {
    constructor(props) {
        super(props);
        this.state = {};
        this.canvasRef = React.createRef();
        this.videoRef = React.createRef();
    }

    componentDidMount() {
        this.context = this.canvasRef.current.getContext('2d');
    }

    togglePlay() {
        if (this.videoRef.current.paused) {
            this.videoRef.current.play();
        } else {
            this.videoRef.current.pause();
        }
        return !this.videoRef.current.paused;
    }

    seek(seconds) {
        this.videoRef.current.currentTime = seconds;
    }

    drawVideoFrame() {
        if (!this.videoRef.current.paused) {
            this.context.drawImage(this.videoRef.current, 20, 100);
        }
    }

    render() {
        const { width, height, children, onEnded, onClick, onDoubleClick, ...rest } = this.props;
        return (
            <div className="video-preview-container">
                <canvas
                    ref={this.canvasRef}
                    width={width}
                    height={height}
                    onEnded={onEnded}
                    onClick={onClick}
                    onDoubleClick={onDoubleClick}
                />
                <video
                    style={{ display: 'none' }}
                    ref={this.videoRef}
                    {...rest}
                >
                    {children}
                </video>
            </div>
        );
    }
}
