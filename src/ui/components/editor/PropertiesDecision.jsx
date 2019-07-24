import React from 'react';
import { connect } from 'react-redux';
import { Input } from 'semantic-ui-react';

const skipKeys = ['selected', 'items'];

const inputStyle = {
    width: '100%',
    paddingBottom: '0.5em',
};

class Properties extends React.Component {
    constructor(props) {
        super(props);
        this.state = { };
    }

    render() {
        const { node } = this.props;
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
                                />
                            );
                        })}
                        <video controls src={`http://localhost:8080/mp4/${node.path}`} />
                        {node.type === 'decision' &&
                            (
                                node.items.map(d => (
                                    <div key={`${d.id}${d.type}`}>
                                        <Input
                                            size="mini"
                                            label={d.type}
                                            placeholder={d.type}
                                            defaultValue={d.desc}
                                            style={inputStyle}
                                        />
                                        <video controls src={`http://localhost:8080/mp4/${d.path}`} />
                                    </div>
                                ))
                            )
                        }
                    </React.Fragment>
                }
            </div>
        );
    }
}

const mapStateToProps = state => ({
    node: state.editor.node,
});

export default connect(mapStateToProps)(Properties);
