import { combineReducers } from 'redux'

import { nodeEditorReducer } from './editor/nodeeditor';

export default combineReducers({
    editor: nodeEditorReducer,
});
