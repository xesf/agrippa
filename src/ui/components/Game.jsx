import React from 'react';
import { connect } from 'react-redux';
import classNames from 'classnames';

import { setSelection, updateNode } from '../redux/editor/nodeeditor';
import VideoCanvas from './VideoCanvas';

import Decision from './gameplay/Decision';
import Location from './gameplay/Location';
import Hotspots from './gameplay/Hotspots';

let tick = null;
let prevTick = Date.now();
let elapsed = null;
const fps = 1000 / 60;

window.requestAnimationFrame = window.requestAnimationFrame
    || window.mozRequestAnimationFrame
    || window.webkitRequestAnimationFrame
    || window.msRequestAnimationFrame
    || (f => setTimeout(f, 1000 / 60));

window.cancelAnimationFrame = window.cancelAnimationFrame
    || window.mozCancelAnimationFrame
    || window.webkitCancelAnimationFrame
    || window.msCancelAnimationFrame
    || (f => clearTimeout(f));

class Game extends React.Component {
    constructor(props) {
        super(props);

        this.state = { script: null };
        this.player = null;

        this.drawVideoFrame = this.drawVideoFrame.bind(this, null);
    }

    componentDidMount() {
        const mainloop = () => {
            try {
                this.frameId = window.requestAnimationFrame(mainloop);

                tick = Date.now();
                elapsed = tick - prevTick;

                if (elapsed > fps) {
                    prevTick = tick - (elapsed % fps);
                }

                if (this.drawVideoFrame(tick, elapsed)) {
                    window.cancelAnimationFrame(this.frameId);
                }
            } catch (e) {
                window.cancelAnimationFrame(this.frameId);
                console.error(e);
            }
        };
        mainloop();

        if (this.props.node.type === 'navigation'
            && this.props.node.seek !== undefined) {
            this.player.seek(this.props.node.seek);
        }

        if (this.props.node.script !== undefined) {
            const script = Function('"use strict"; ' + this.props.node.script + '')(); // eslint-disable-line
            this.setState({ script }); // eslint-disable-line

            if (script && script.onMount) {
                const state = { gameflag: {} };
                script.onMount(state);
            }
        }
    }

    componentWillUmount() {
        if (this.state.script && this.state.script.onMount) {
            this.state.script.onUmount();
        }
        window.cancelAnimationFrame(this.frameId);
    }

    componentDidUpdate(prevProps) {
        if (prevProps.node.id !== this.props.node.id) {
            if (this.props.node.script !== undefined) {
                const script = Function('"use strict"; ' + this.props.node.script + '')(); // eslint-disable-line
                this.setState({ script }); // eslint-disable-line

                if (script && script.onMount) {
                    const state = { gameflag: {} };
                    script.onMount(state);
                }
            } else {
                this.setState({ script: null }); // eslint-disable-line
            }
        }
        if (
            prevProps.node.id !== this.props.node.id
            && this.props.node.type === 'navigation'
            && this.props.node.seek !== undefined
        ) {
            this.player.seek(this.props.node.seek);
        }
    }

    drawVideoFrame(_tick, _elapsed) {
        return this.player.drawVideoFrame(_tick, _elapsed);
    }

    linkNode() {
        const { links, node, nodes, setNodeProperties } = this.props;
        const link = links.find((l) => {
            if (Array.isArray(l.source)) {
                return l.source.includes(node.id);
            }
            return l.source === node.id;
        });
        if (link) {
            const targetNode = nodes.find(n => n.id === link.target);
            if (targetNode) {
                if (this.state.script && this.state.script.onMount) {
                    this.state.script.onUmount();
                }
                setNodeProperties(targetNode);
            }
        }
    }

    handleDecisionOnClick(d) {
        const node = this.props.nodes.find(n => n.id === d.option);
        this.props.setNodeProperties(node);
    }

    handleHotspotsOnClick(h) {
        console.log(h); // eslint-disable-line
        this.handleDecisionOnClick(h);
    }

    handleOnClick() {
        if (this.props.node.seek === undefined) {
            this.player.togglePlay();
        }
    }

    handleOnDoubleClick() {
        this.linkNode();
    }

    handleOnEnded() {
        this.linkNode();
        if (this.state.script && this.state.script.onEnded) {
            const state = {
                gameflag: {
                    isFirstTime: true,
                },
                setNode: (id) => {
                    const targetNode = this.props.nodes.find(n => n.id === id);
                    if (targetNode) {
                        this.props.setNodeProperties(targetNode);
                    }
                }
            };
            this.state.script.onEnded(state);
        }
    }

    handleLoadedData() {
        // if (this.props.node.thumbnail === undefined) {
        //     const node = {
        //         ...this.props.node,
        //         thumbnail: this.player.getCanvasImage(),
        //     };
        //     console.log(node);
        //     this.props.updateNode(node.id, node);
        // }
        // if (this.state.thumbnail === undefined) {
        //     this.setState({ thumbnail: this.player.getCanvasImage() });
        // }
    }

    render() {
        const { node, editor } = this.props;
        const videoClassName = classNames({
            'screen-video': !(node && node.annotations && node.annotations.keepRatio),
            'screen-video-intro': (node && node.annotations && node.annotations.keepRatio),
            'screen-video-ingame': !(node && node.annotations && node.annotations.isIntro)
        });

        return (
            <div className="screen-container">
                <VideoCanvas
                    ref={(player) => { this.player = player; }}
                    key={`player-${node.id}`}
                    node={node}
                    width="640"
                    height="480"
                    autoPlay={node.seek === undefined}
                    loop={(node.type !== 'video')}
                    className={videoClassName}
                    onEnded={() => this.handleOnEnded()}
                    onClick={() => this.handleOnClick()}
                    onDoubleClick={() => this.handleOnDoubleClick()}
                    onLoadedData={() => this.handleLoadedData()}
                />
                {node.annotations && <Location locationDesc={node.annotations.locationDesc} />}
                {node.annotations
                    && node.annotations.hotspots
                    && <Hotspots
                        items={node.annotations.hotspots}
                        onClick={h => this.handleHotspotsOnClick(h)}
                        editor={editor}
                    />
                }
                {node.type === 'decision'
                && <Decision
                    items={node.items}
                    onClick={d => this.handleDecisionOnClick(d)}
                    timeout={node.timeout}
                    defaultDecision={node.default}
                />}
            </div>
        );
    }
}

const mapStateToProps = state => ({
    node: state.editor.node,
    nodes: state.editor.nodes,
    links: state.editor.links,
});

const mapDispatchToProps = dispatch => ({
    setNodeProperties: node => dispatch(setSelection(node)),
    updateNode: (id, node) => dispatch(updateNode(id, node)),
});

export default connect(
    mapStateToProps,
    mapDispatchToProps
)(Game);
