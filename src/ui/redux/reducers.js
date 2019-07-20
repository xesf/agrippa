import { combineReducers } from 'redux'

import { propertiesReducer } from './editor/properties';
import { nodesReducer } from './editor/nodes';

export default combineReducers({
    editor: nodesReducer,
    properties: propertiesReducer,
});
