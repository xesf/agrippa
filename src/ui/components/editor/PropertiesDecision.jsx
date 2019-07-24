import React from 'react';
import { connect } from 'react-redux';
import { Input } from 'semantic-ui-react';

const inputStyle = {
    width: '100%',
    paddingTop: '1.0em',
    paddingBottom: '0.5em',
};

class PropertiesDecision extends React.Component {
    constructor(props) {
        super(props);
        this.state = { };
    }

    render() {
        const { node } = this.props;
        return (
            <React.Fragment>
                {node && node.type === 'decision' &&
                    (
                        <React.Fragment>
                            <h4 className="ui horizontal divider header">
                                <i className="clone outline icon" />
                                Decisions
                            </h4>
                            {node.items.map(d => (
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
                            ))}
                        </React.Fragment>
                    )
                }
            </React.Fragment>
        );
    }
}

const mapStateToProps = state => ({
    node: state.editor.node,
});

export default connect(mapStateToProps)(PropertiesDecision);
