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

        this.state = {
            game: {},
            script: null,
            width: 640,
            height: 480,
            rwh: 1,
            rhw: 1,
        };
        this.player = null;

        this.drawVideoFrame = this.drawVideoFrame.bind(this, null);
    }

    setNodeScriptObject() {
        let script = null;
        if (this.props.node.script !== undefined) {
            script = Function('"use strict"; ' + this.props.node.script + '')(); // eslint-disable-line
            this.setState({ script }); // eslint-disable-line
        }
        return script;
    }

    componentDidMount() {
        window.addEventListener('resize', this.handleResize);

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
            }
        };
        mainloop();

        if (this.props.node.type === 'navigation'
            && this.props.node.seek !== undefined) {
            this.player.seek(this.props.node.seek);
        }

        const script = this.setNodeScriptObject();
        if (script && script.onMount) {
            const state = { gameflag: {} };
            script.onMount(state);
        }
        this.handleResize();
    }

    componentWillUmount() {
        if (this.state.script && this.state.script.onMount) {
            this.state.script.onUmount();
        }
        window.cancelAnimationFrame(this.frameId);
        window.removeEventListener('resize', this.handleResize);
    }

    componentDidUpdate(prevProps) {
        if (prevProps.node.id !== this.props.node.id) {
            this.setState({ script: null }); // eslint-disable-line
            const script = this.setNodeScriptObject();
            if (script && script.onMount) {
                const state = { gameflag: {} };
                script.onMount(state);
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

    handleResize() {
        if (this.props.editor) {
            return;
        }
        let cw = 0;
        let ch = 0;
        const rw = 640;
        const rh = 480;
        const wh = window.innerHeight - 40;
        const ww = window.innerWidth;
        const rwh = rw / rh;
        const rhw = rh / rw;

        if (wh * rwh < ww) {
            ch = wh;
            cw = wh * rwh;
        } else {
            ch = ww * rhw;
            cw = ww;
        }

        this.setState({ width: cw, height: ch, rwh: (640 / cw), rhw: (480 / ch), });
    }

    drawVideoFrame(_tick, _elapsed) {
        return this.player.drawVideoFrame(_tick, _elapsed);
    }

    setNode(id = null) {
        if (id) {
            const node = this.props.nodes.find(n => n.id === id);
            this.props.setNodeProperties(node);
        } else {
            this.linkNode();
        }
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
        this.setNode(d.option);
    }

    handleHotspotsOnClick(h) {
        this.setNode(h.option);
    }

    handleOnClick() {
        if (this.props.editor && this.props.node.seek === undefined) {
            this.player.togglePlay();
        }
    }

    handleOnDoubleClick() {
        this.setNode();
    }

    handleOnEnded() {
        if (this.state.script && this.state.script.onEnded) {
            const state = {
                game: this.state.game,
                setNode: id => this.setNode(id),
            };
            this.state.script.onEnded(state);
        } else {
            this.setNode();
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
        const style = {
            zIndex: '0',
            width: `${this.state.width}px`,
            height: `${this.state.height}px`,
        };
        return (
            <div className="screen-container" style={style}>
                <VideoCanvas
                    ref={(player) => { this.player = player; }}
                    key={`player-${node.id}`}
                    node={node}
                    width={this.state.width}
                    height={this.state.height}
                    rwh={this.state.rwh}
                    rhw={this.state.rhw}
                    autoPlay={node.seek === undefined}
                    loop={(node.type !== 'video')}
                    className={videoClassName}
                    onEnded={() => this.handleOnEnded()}
                    onClick={() => this.handleOnClick()}
                    onDoubleClick={() => this.handleOnDoubleClick()}
                    onLoadedData={() => this.handleLoadedData()}
                />
                {node.annotations
                        && <Location
                            locationDesc={node.annotations.locationDesc}
                            rwh={this.state.rwh}
                            rhw={this.state.rhw}
                        />
                }
                {node.annotations
                    && node.annotations.hotspots
                    && <Hotspots
                        items={node.annotations.hotspots}
                        onClick={h => this.handleHotspotsOnClick(h)}
                        editor={editor}
                        rwh={this.state.rwh}
                        rhw={this.state.rhw}
                    />
                }
                {node.type === 'decision'
                && <Decision
                    items={node.items}
                    onClick={d => this.handleDecisionOnClick(d)}
                    timeout={node.timeout}
                    defaultDecision={node.default}
                    rwh={this.state.rwh}
                    rhw={this.state.rhw}
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
