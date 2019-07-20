import { combineReducers } from 'redux'

import { propertiesReducer } from './editor/properties';
import { nodeEditorReducer } from './editor/nodeeditor';

export default combineReducers({
    editor: nodeEditorReducer,
    properties: propertiesReducer,
});
