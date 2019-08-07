import React from 'react';
import { connect } from 'react-redux';
import classNames from 'classnames';

import { setSelection } from '../redux/editor/nodeeditor';
import Video from './Video';

import Decision from './gameplay/Decision';
import Location from './gameplay/Location';

class Game extends React.Component {
    constructor(props) {
        super(props);
        this.state = { };
        this.player = null;
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
        const videoClassName = classNames({
            'screen-video': !(node && node.annotations && node.annotations.keepRatio),
            'screen-video-intro': (node && node.annotations && node.annotations.keepRatio),
            'screen-video-ingame': !(node && node.annotations && node.annotations.isIntro)
        });

        return (node
            ?
            (<div className="screen-container">
                <Video
                    ref={(player) => { this.player = player; }}
                    key={`player-${node.id}`}
                    autoPlay
                    loop={(node.type === 'decision')}
                    className={videoClassName}
                    onEnded={() => this.handleOnEnded()}
                    onClick={() => this.handleOnClick()}
                    onDoubleClick={() => this.handleOnDoubleClick()}
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
                </Video>
                {node.annotations && <Location node={node} />}
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
