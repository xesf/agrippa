import React from 'react';
import { connect } from 'react-redux';
import classNames from 'classnames';

import { setSelection } from '../redux/editor/nodeeditor';
import VideoCanvas from './VideoCanvas';

import Decision from './gameplay/Decision';
import Location from './gameplay/Location';
import Hotspots from './gameplay/Hotspots';

let tick = null;
let prevTick = Date.now();
let elapsed = null;
const fps = 1000 / 60;

window.requestAnimationFrame = window.requestAnimationFrame
    // @ts-ignore
    || window.mozRequestAnimationFrame
    || window.webkitRequestAnimationFrame
    // @ts-ignore
    || window.msRequestAnimationFrame
    || (f => setTimeout(f, 1000 / 60));

class Game extends React.Component {
    constructor(props) {
        super(props);
        this.state = { };
        this.player = null;
    }

    componentDidMount() {
        const mainloop = () => {
            this.frameId = window.requestAnimationFrame(mainloop);

            tick = Date.now();
            elapsed = tick - prevTick;

            if (elapsed > fps) {
                prevTick = tick - (elapsed % fps);
            }

            if (this.drawVideoFrame(tick, elapsed)) {
                window.cancelAnimationFrame(this.frameId);
            }
        };
        mainloop();

        if (this.props.node.type === 'navigation') {
            this.player.seek(this.props.node.seek);
        }
    }

    componentDidUpdate(prevProps) {
        if (
            prevProps.node.id !== this.props.node.id
            && this.props.node.type === 'navigation'
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
            setNodeProperties(targetNode);
        }
    }

    handleDecisionOnClick(d) {
        const node = this.props.nodes.find(n => n.id === d.option);
        this.props.setNodeProperties(node);
    }

    handleHotspotsOnClick(h) {
        console.log(h);
    }

    handleOnClick() {
        this.player.togglePlay();
    }

    handleOnDoubleClick() {
        this.linkNode();
    }

    handleOnEnded() {
        this.linkNode();
    }

    render() {
        const { node, editor } = this.props;
        const videoClassName = classNames({
            'screen-video': !(node && node.annotations && node.annotations.keepRatio),
            'screen-video-intro': (node && node.annotations && node.annotations.keepRatio),
            'screen-video-ingame': !(node && node.annotations && node.annotations.isIntro)
        });

        return (node
            ?
            (<div className="screen-container">
                <VideoCanvas
                    ref={(player) => { this.player = player; }}
                    key={`player-${node.id}`}
                    node={node}
                    width="640"
                    height="480"
                    autoPlay={node.type !== 'navigation'}
                    loop={(node.type === 'decision')}
                    className={videoClassName}
                    onEnded={() => this.handleOnEnded()}
                    onClick={() => this.handleOnClick()}
                    onDoubleClick={() => this.handleOnDoubleClick()}
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
                {node.type === 'decision' && <Decision items={node.items} onClick={d => this.handleDecisionOnClick(d)} />}
            </div>) : null
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
});

export default connect(
    mapStateToProps,
    mapDispatchToProps
)(Game);
