import React from 'react';
import { connect } from 'react-redux';
// import { Player, ControlBar } from 'video-react';

import { setSelection } from '../../redux/editor/nodeeditor';
import Video from '../Video';

class NodePreview extends React.Component {
    constructor(props) {
        super(props);
        this.state = { };
        this.player = null;
    }

    linkNode() {
        const { links, node, nodes, setNodeProperties } = this.props;
        const link = links.find(l => l.source === node.id);
        if (link) {
            const targetNode = nodes.find(n => n.id === link.target);
            setNodeProperties(targetNode);
        }
    }

    handleDecisionOnClick(d) {
        const node = this.props.nodes.find(n => n.id === d.option);
        this.props.setNodeProperties(node);
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
        const { node } = this.props;
        return (
            <div className="screen-container">
                <Video
                    ref={(player) => { this.player = player; }}
                    key={`player-${node.id}`}
                    autoPlay
                    loop={(node.type === 'decision')}
                    className="screen-video"
                    onEnded={() => this.handleOnEnded()}
                    onClick={() => this.handleOnClick()}
                    onDoubleClick={() => this.handleOnDoubleClick()}
                >
                    <source
                        src={`http://localhost:8080/mp4/${node.path}`}
                    />
                    <track
                        label="English"
                        kind="subtitles"
                        srcLang="en"
                        src={`http://localhost:8080/vtt/${node.path}`}
                        default
                    />
                </Video>
                {node.annotations &&
                    <div className="location-description location-typing">
                        <pre>{node.annotations.locationDesc}</pre>
                    </div>
                }
                {node.type === 'decision' &&
                    <div className="ui grid container equal width decision-container">
                        <div className="column decision-item-container" />
                        <div className="column decision-item-container" />
                        {node.items.map(d => (
                            <div
                                id="decision-container"
                                key={`${d.id}${d.type}`}
                                className="column decision-item-container"
                                onClick={() => this.handleDecisionOnClick(d)}
                                onMouseOver={() => { document.getElementById(d.type).play(); }}
                                onMouseOut={() => document.getElementById(d.type).pause()}
                                onFocus={() => {}}
                                onBlur={() => {}}
                            >
                                <video
                                    id={d.type}
                                    loop
                                    src={`http://localhost:8080/mp4/${d.path}`}
                                    className="decision-video"
                                />
                                <p className="decision-item">{d.desc}</p>
                            </div>
                        ))}
                        <div className="column decision-item-container" />
                        <div className="column decision-item-container" />
                    </div>
                }
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
});

export default connect(
    mapStateToProps,
    mapDispatchToProps
)(NodePreview);
