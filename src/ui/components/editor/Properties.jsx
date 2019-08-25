import React from 'react';
import { isEqual } from 'lodash';
import { connect } from 'react-redux';
import { Input } from 'semantic-ui-react';

import PropertiesDecision from './PropertiesDecision';
import PropertiesAnnotation from './PropertiesAnnotation';

import { updateNode } from '../../redux/editor/nodeeditor';

const skipKeys = [
    'selected',
    'items',
    'links',
    'nodes',
    'annotations',
    'script',
];

const inputStyle = {
    width: '100%',
    paddingBottom: '0.5em',
};

class Properties extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            node: this.props.node,
        };
        this.timer = null;
    }

    componentDidUpdate(prevProps) {
        // Typical usage (don't forget to compare props):
        if (!isEqual(this.props.node, prevProps.node)) {
            this.setState({ node: this.props.node }); // eslint-disable-line
        }
    }

    onChangeField(key, value) {
        if (this.timer) {
            clearTimeout(this.timer);
        }
        const float = parseFloat(value);
        if (!isNaN(float)) {
            value = float;
        }
        this.timer = setTimeout(() => {
            const oldId = this.props.node.id;
            const node = { ...this.state.node };
            node[key] = value;
            this.setState({ node });
            this.props.updateNode(oldId, node);
        }, 500);
    }

    render() {
        const { node } = this.state;
        return (
            <div className="layout-border layout-properties">
                {node &&
                    <React.Fragment>
                        {Object.keys(node).map((key) => {
                            if (skipKeys.includes(key)) {
                                return null;
                            }
                            return (
                                <Input
                                    key={`${key}${node[key]}`}
                                    size="mini"
                                    label={key}
                                    placeholder={key}
                                    defaultValue={node[key]}
                                    style={inputStyle}
                                    onChange={e => this.onChangeField(key, e.target.value)}
                                />
                            );
                        })}
                        <video controls src={`http://localhost:8080/mp4/${node.path}`} />
                        {node.annotations &&
                            <PropertiesAnnotation
                                annotations={node.annotations}
                                style={inputStyle}
                            />
                        }
                        <PropertiesDecision node={node} />
                    </React.Fragment>
                }
            </div>
        );
    }
}

const mapStateToProps = state => ({
    node: state.editor.node,
});
const mapDispatchToProps = dispatch => ({
    updateNode: (id, node) => dispatch(updateNode(id, node)),
});

export default connect(
    mapStateToProps,
    mapDispatchToProps,
)(Properties);
