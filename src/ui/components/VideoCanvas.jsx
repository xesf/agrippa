import React from 'react';

export default class VideoCanvas extends React.Component {
    constructor(props) {
        super(props);
        this.state = {};
        this.canvasRef = React.createRef();
        this.videoRef = React.createRef();
        this.subtitlesRef = React.createRef();
        this.subtitles = null;

        this.drawVideoFrame = this.drawVideoFrame.bind(this, null);
        // this.handleOnPlaying = this.handleOnPlaying.bind(this, null);
        // this.handleCanPlayThrough = this.handleCanPlayThrough.bind(this, null);
        this.handleOnEnded = this.handleOnEnded.bind(this, null);
        console.log('video canvas constructor');
    }

    componentDidMount() {
        console.log('video canvas mount');
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

    getCanvasImage() {
        // const { node } = this.props;
        // const video = document.createElement('video');
        // video.src = `http://localhost:8080/mp4/${node.path}`;
        // const video = this.videoRef.current;
        const canvas = document.createElement('canvas');
        canvas.width = 600;
        canvas.height = 240;
        const context = canvas.getContext('2d');
        // context.drawImage(video, 0, 0);
        let x = 20;
        let y = 100;
        if (this.props.node.keepRatio) {
            x = 0;
            y = 0;
        }
        context.drawImage(this.canvasRef.current, x, y, 640, 480, 0, 0, 600, 240);
        canvas.width = 100;
        canvas.height = 40;
        return canvas.toDataURL();
    }

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
        // try {
        const video = this.videoRef.current;
        const { width, height } = this.canvasRef.current;

        let x = 20;
        let y = 100;
        if (this.props.node.keepRatio) {
            x = 0;
            y = 0;
        }

        // Draw video frame
        this.context.drawImage(video, x, y);

        // Draw subtitles on screen
        const textTracks = video.textTracks;
        if (textTracks && textTracks.length > 0) {
            const activeCues = textTracks[0].activeCues;
            const clearSubtitlesClipArea = () => {
                this.context.fillStyle = '#000';
                this.context.fillRect(
                    0,
                    (height - 130),
                    width, 110
                );
            };
            if (!this.subtitles) {
                clearSubtitlesClipArea();
            }
            if (activeCues && activeCues.length > 0) {
                const text = activeCues[0].text;
                if (this.subtitles !== text) {
                    this.subtitles = text;
                    clearSubtitlesClipArea();
                    this.context.textAlign = 'center';
                    this.context.fillStyle = '#ffff00';
                    this.context.font = '16px Arial';
                    this.context.fillText(
                        text,
                        (width / 2),
                        (height - 110)
                    );
                }
            } else {
                this.subtitles = null;
            }
        }
        return false;
        // } catch (e) {
        //     console.log('cavnas', e);
        //     return false;
        // }
    }

    render() {
        console.log('video canvas render');
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
