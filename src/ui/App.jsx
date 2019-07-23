import React from 'react';

import { loadParams } from './params';
import Game from './Game';
import Editor from './Editor';

export default class App extends React.Component {
    constructor(props) {
        super(props);
        const params = loadParams();
        params.editor = true;
        this.state = {
            params,
        };
    }

    render() {
        return (
            <React.Fragment>
                {this.state.params.editor ? <Editor /> : <Game />}
            </React.Fragment>
        );
    }
}
