import React from 'react';
import { connect } from 'react-redux';

import Player from '../Player';

class NodePreview extends React.Component {
    constructor(props) {
        super(props);
        this.state = { };
    }

    render() {
        const { node } = this.props;
        return (
            <div className="screen-container">
                <video autoPlay loop src={`http://localhost:8080/mp4/${node.path}`} />
                {node.type === 'decision' &&
                    node.items.map(d => (
                        <div key={`${d.id}${d.type}`} className="decision-item">
                            <video loop src={`http://localhost:8080/mp4/${d.path}`} />
                        </div>
                    ))
                }
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
