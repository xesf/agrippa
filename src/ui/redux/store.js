import { createStore as reduxCreateStore } from 'redux';
import axios from 'axios';

import rootReducer from './reducers';
import { initStore } from './editor/nodeeditor';

let subscribeTimer = null;

export const createStore = () => {
    const store = new reduxCreateStore(rootReducer);

    // get initial state from server
    axios.get('http://localhost:2349/metadata')
        .then((res) => store.dispatch(initStore(res.data)));

    // send changes back to server
    store.subscribe((() => {
        const state = store.getState();
        if (state.editor) {
            if (subscribeTimer) {
                clearTimeout(subscribeTimer);
            }
            subscribeTimer = setTimeout(() => {
                axios.post('http://localhost:2349/metadata', {
                    transform: state.editor.transform,
                    transformStr: state.editor.transformStr,
                    nodes: state.editor.nodes,
                    selected: state.editor.selected,
                });
            }, 500);
        }
    }));

    return store;
};
