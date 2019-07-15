import { combineReducers } from 'redux'

import { propertiesReducer } from './editor/properties';

export default combineReducers({
    properties: propertiesReducer
});
