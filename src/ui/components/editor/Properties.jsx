import React from 'react';
import { connect } from 'react-redux'
import { Input, Label } from 'semantic-ui-react';
import Player from '../Player';

const skipKeys = ['selected'];

const inputStyle = {
    width: '100%',
    paddingBottom: '0.5em',
};

class Properties extends React.Component {
    render() {
        const { node } = this.props;
        return (
            <div className="layout-border layout-properties">
                {node &&
                    <React.Fragment>
                        {Object.keys(node).map((key, i) => {
                            if (skipKeys.includes(key)) {
                                return null;
                            }
                            return (
                                <Input
                                    key={`${key}${node[key]}`}
                                    size='mini'
                                    label={key}
                                    placeholder={key}
                                    defaultValue={node[key]}
                                    style={inputStyle}
                                />
                            );
                        })}
                        {node['type'] === 'video' &&
                            <video controls src={`http://localhost:2349/mp4/${node['id']}`} />
                        }
                    </React.Fragment>
                }
            </div>
        );
    }
};

const mapStateToProps = (state) => ({
    node: state.properties.node,
});

// const mapDispatchToProps = dispatch => {
//     return {
//         setNodeProperties: (node) => dispatch(setProperties(node)),
//     };
// }

export default connect(
    mapStateToProps,
    // mapDispatchToProps
)(Properties);
