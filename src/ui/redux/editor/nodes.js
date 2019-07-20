
const NodesActionType = {
    SET: 'ui/editor/nodes',
};

export const setNodes = nodes => ({
    type: NodesActionType.SET,
    payload: { nodes },
});

export const nodesReducer = (state = {}, action) => {
    switch (action.type) {
        case NodesActionType.SET:
            return {
                ...state,
                nodes: action.payload.nodes,
            };
        default:
            return state;
    }
};
