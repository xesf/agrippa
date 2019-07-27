import React from 'react';
import { connect } from 'react-redux';
import { Player, ControlBar } from 'video-react';

import { setSelection } from '../../redux/editor/nodeeditor';

class NodePreview extends React.Component {
    constructor(props) {
        super(props);
        this.state = { };
    }

    handleOnClick(d) {
        const node = this.props.nodes.find(n => n.id === d.option);
        this.props.setNodeProperties(node);
    }

    render() {
        const { node } = this.props;
        return (
            <div className="screen-container">
                <div>
                    <Player
                        key={`player-${node.id}`}
                        autoPlay
                        fluid={false}
                        loop={(node.type === 'decision')}
                        className="screen-video"
                    >
                        <ControlBar disableDefaultControls disableCompletely />
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
                    </Player>
                    {node.type === 'decision' &&
                        <div className="ui grid container equal width decision-container">
                            <div className="column decision-item-container" />
                            <div className="column decision-item-container" />
                            {node.items.map(d => (
                                <div
                                    id="decision-container"
                                    key={`${d.id}${d.type}`}
                                    className="column decision-item-container"
                                    onClick={() => this.handleOnClick(d)}
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
            </div>
        );
    }
}

const mapStateToProps = state => ({
    node: state.editor.node,
    nodes: state.editor.nodes,
});

const mapDispatchToProps = dispatch => ({
    setNodeProperties: node => dispatch(setSelection(node)),
});

export default connect(
    mapStateToProps,
    mapDispatchToProps
)(NodePreview);
