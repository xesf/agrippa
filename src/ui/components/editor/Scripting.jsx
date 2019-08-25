import React from 'react';
import { connect } from 'react-redux';

import { ControlledEditor } from '@monaco-editor/react';

import { updateNode } from '../../redux/editor/nodeeditor';

// const BAD_WORD = 'eval';
// const WORNING_MESSAGE = " <- hey man, what's this?";

// const textAreaStyle = {
//     margin: '0',
//     width: '98%',
//     height: '100%',
//     color: 'rgb(176, 185, 190)',
//     backgroundColor: 'rgb(42, 56, 69)',
//     border: 0,
//     outline: 'none',
// };

class Scripting extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            // options: {
            //     selectOnLineNumbers: true,
            //     roundedSelection: true,
            //     readOnly: false,
            //     cursorStyle: 'line',
            //     automaticLayout: false,
            // },
        };
    }

    // handleEditorChange = (ev, value) => {
    //     setValue(
    //         value.includes(BAD_WORD) && !value.includes(WORNING_MESSAGE)
    //             ? value.replace(BAD_WORD, BAD_WORD + WORNING_MESSAGE)
    //             : value.includes(WORNING_MESSAGE) && !value.includes(BAD_WORD)
    //                 ? value.replace(WORNING_MESSAGE, '')
    //                 : value
    //     );
    // };

    render() {
        return (
            <div className="layout-border layout-scripting">
                <ControlledEditor
                    width="100%"
                    height="100%"
                    value={this.props.node.script}
                    // onChange={handleEditorChange}
                    language="javascript"
                    theme="dark"
                    // options={{ options: this.state.options}}
                />
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
    mapDispatchToProps
)(Scripting);
