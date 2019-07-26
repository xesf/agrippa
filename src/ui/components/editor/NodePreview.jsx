import React from 'react';
import { connect } from 'react-redux';

class NodePreview extends React.Component {
    constructor(props) {
        super(props);
        this.state = { };
    }

    render() {
        const { node } = this.props;
        return (
            <div className="screen-container">
                <div>
                    <video autoPlay loop src={`http://localhost:8080/mp4/${node.path}`} className="screen-video" />
                    <div className="ui grid container equal width decision-container">
                        <div className="column decision-item-container" />
                        <div className="column decision-item-container" />
                        {node.type === 'decision' &&
                            node.items.map(d => (
                                <div
                                    id="decision-container"
                                    key={`${d.id}${d.type}`}
                                    className="column decision-item-container"
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
                            ))
                        }
                        <div className="column decision-item-container" />
                        <div className="column decision-item-container" />
                    </div>
                </div>
            </div>
        );
    }
}

const mapStateToProps = state => ({
    node: state.editor.node,
});

export default connect(
    mapStateToProps,
)(NodePreview);
