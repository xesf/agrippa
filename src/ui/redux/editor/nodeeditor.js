
const nodes = window.localStorage.getItem('nodes');
const initialState = {
    transform: JSON.parse(window.localStorage.getItem('nodes-transform')),
    transformStr: window.localStorage.getItem('nodes-transform-string'),
    nodes: (nodes) ? JSON.parse(nodes) : [],
};

const NodeEditorActionType = {
    SAVE_CHANGES: 'ui/editor/save-changes',
};

export const saveChanges = (changes) => ({
    type: NodeEditorActionType.SAVE_CHANGES,
    payload: changes,
});

export const nodeEditorReducer = (state = initialState, action) => {
    switch (action.type) {
        case NodeEditorActionType.SAVE_CHANGES:
            return {
                ...state,
                transform: action.payload.transform,
                transformStr: action.payload.transformStr,
            };
        default:
            return state;
    }
};
