const PropertiesActionType = {
    SET: 'ui/editor/properties',
};

export const setProperties = node => ({
    type: PropertiesActionType.SET,
    payload: { node },
});

export const propertiesReducer = (state = {}, action) => {
    switch (action.type) {
        case PropertiesActionType.SET:
            return {
                ...state,
                node: action.payload.node,
                selected: action.payload.node.id,
            };
        default:
            return state;
    }
};
