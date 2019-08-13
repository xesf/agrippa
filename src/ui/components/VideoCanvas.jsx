import React from 'react';

export default class VideoCanvas extends React.Component {
    constructor(props) {
        super(props);
        this.state = {};
        this.canvasRef = React.createRef();
        this.videoRef = React.createRef();

        // this.handleOnPlaying = this.handleOnPlaying.bind(this, null);
        // this.handleCanPlayThrough = this.handleCanPlayThrough.bind(this, null);
        this.handleOnEnded = this.handleOnEnded.bind(this, null);
    }

    componentDidMount() {
        this.context = this.canvasRef.current.getContext('2d');

        // this.videoRef.current.addEventListener('playing', this.handleOnPlaying);
        // this.videoRef.current.addEventListener('canplaythrough', this.handleCanPlayThrough);
        this.videoRef.current.addEventListener('ended', this.handleOnEnded);
    }

    componentWillUnmount() {
        this.videoRef.current.removeEventListener('ended', this.handleOnEnded);
        // this.videoRef.current.removeEventListener('canplaythrough', this.handleCanPlayThrough);
        // this.videoRef.current.removeEventListener('playing', this.handleOnPlaying);
    }

    // handleOnPlaying() {
    // }

    // handleCanPlayThrough() {
    // }

    handleOnEnded() {
        if (this.props.onEnded) {
            this.props.onEnded();
        }
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
        if (this.context) {
            this.context.drawImage(this.videoRef.current, 20, 100);
        }
        return false;
    }

    render() {
        const {
            width,
            height,
            node,
            onEnded,
            onClick,
            onDoubleClick,
            ...rest
        } = this.props;
        return (
            <div className="video-preview-container">
                <canvas
                    ref={this.canvasRef}
                    width={width}
                    height={height}
                    onClick={onClick}
                    onDoubleClick={onDoubleClick}
                />
                <video
                    ref={this.videoRef}
                    style={{ display: 'none' }}
                    {...rest}
                >
                    <source
                        src={`http://localhost:8080/mp4/${node.path}`}
                    />
                    {node.subtitles &&
                        <track
                            label="English"
                            kind="subtitles"
                            srcLang="en"
                            src={`http://localhost:8080/vtt/${node.path}`}
                            default
                        />
                    }
                </video>
            </div>
        );
    }
}
