import { createStore as ReduxCreateStore } from 'redux';
import axios from 'axios';

import rootReducer from './reducers';
import { initStore } from './editor/nodeeditor';

let subscribeTimer = null;

export const createStore = () => {
    const store = new ReduxCreateStore(rootReducer);

    // get initial state from server
    axios.get('http://localhost:8080/metadata')
        .then(res => store.dispatch(initStore(res.data)));

    // send changes back to server
    store.subscribe((() => {
        const state = store.getState();
        if (state.editor.ready) {
            if (subscribeTimer) {
                clearTimeout(subscribeTimer);
            }
            subscribeTimer = setTimeout(() => {
                axios.post('http://localhost:8080/metadata', {
                    transform: state.editor.transform,
                    transformStr: state.editor.transformStr,
                    selected: state.editor.selected,
                    node: state.editor.node,
                    links: state.editor.links,
                    nodes: state.editor.nodes,
                });
            }, 500);
        }
    }));

    return store;
};
