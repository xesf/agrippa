
const NodeEditorActionType = {
    INIT_STORE: 'ui/editor/init-store',
    SAVE_TRANSFORM: 'ui/editor/save-transform',
    SAVE_ALL: 'ui/editor/save-all',
    SELECT: 'ui/editor/select',
    ADD_NODE: 'ui/editor/add-node',
    REMOVE_NODE: 'ui/editor/remove-node',
};

export const initStore = state => ({
    type: NodeEditorActionType.INIT_STORE,
    payload: state,
});

export const saveTransform = changes => ({
    type: NodeEditorActionType.SAVE_TRANSFORM,
    payload: changes,
});

export const saveAll = changes => ({
    type: NodeEditorActionType.SAVE_ALL,
    payload: changes,
});

export const setSelection = node => ({
    type: NodeEditorActionType.SELECT,
    payload: { node },
});

export const addNode = node => ({
    type: NodeEditorActionType.ADD_NODE,
    payload: { node },
});

export const removeNode = id => ({
    type: NodeEditorActionType.REMOVE_NODE,
    payload: { id },
});

export const nodeEditorReducer = (state = { ready: false }, action) => {
    switch (action.type) {
        case NodeEditorActionType.INIT_STORE:
            return {
                ...state,
                ready: true,
                ...action.payload,
            };
        case NodeEditorActionType.SAVE_TRANSFORM:
            return {
                ...state,
                transform: action.payload.transform,
                transformStr: action.payload.transformStr,
            };
        case NodeEditorActionType.SAVE_ALL:
            return {
                ...state,
                transform: action.payload.transform,
                transformStr: action.payload.transformStr,
                nodes: action.payload.nodes,
            };
        case NodeEditorActionType.SELECT:
            return {
                ...state,
                node: action.payload.node,
                selected: action.payload.node.id,
            };
        case NodeEditorActionType.ADD_NODE:
            return {
                ...state,
                nodes: [...state.nodes, action.payload.node],
                node: action.payload.node,
            };
        case NodeEditorActionType.REMOVE_NODE: {
            const { id } = action.payload;
            const newState = {
                ...state,
                selected: '',
                nodes: [...state.nodes.filter(n => n.id !== id)],
                links: [
                    ...state.links.filter(n =>
                        n.source !== id
                        && n.target !== id
                    ),
                    ...state.links.filter(n =>
                        n.source !== id
                        && (Array.isArray(n.target) && !n.target.includes(id))
                    )
                ],
            };
            return newState;
        }
        default:
            return state;
    }
};
