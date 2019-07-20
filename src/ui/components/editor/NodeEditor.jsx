import React from 'react';
import { connect } from 'react-redux'
import * as d3 from 'd3';

import Node from './Node';
import { nodes as nodesSample } from './nodes.json';

import { setProperties } from '../../redux/editor/properties';
import { saveChanges } from '../../redux/editor/nodeeditor';

class NodeEditor extends React.Component {
    constructor(props) {
        super(props);
        this.svgRef = React.createRef();
        this.gRef = React.createRef();
        this.state = {
            selected: null,
        };
        this.saveNodes = this.saveNodes.bind(this, null);
        this.handleNodeOnDragEnd = this.handleNodeOnDragEnd.bind(this, null);
    }

    componentDidMount() {
        const that = this;
        // TODO: remove dependency to d3 library
        const svg = d3.select(this.svgRef.current);
        const zoom = d3.zoom()
            .clickDistance(4)
            .scaleExtent([0.5, 2])
            .on("start", () => {
                svg.raise().classed("cursor-grabbing", true);
            })
            .on("zoom", () => {
                if (d3.event.transform) {
                    that.props.saveChanges({
                        transform: {
                            k: d3.event.transform.k,
                            x: d3.event.transform.x,
                            y: d3.event.transform.y,
                        },
                        transformStr: d3.event.transform,
                    });
                }
            })
            .on("end", () => {
                svg.raise().classed("cursor-grabbing", false);
                that.saveNodes();
            });
        svg.call(zoom);
        svg.on("dblclick.zoom", null);
        if (that.props.transform) {
            const { k, x, y } = that.props.transform;
            const t = d3.zoomIdentity.translate(x, y).scale(k);
            svg.call(zoom.transform, t);
        }
    }

    saveNodes() {
        if (this.props.transform) {
            window.localStorage.setItem('nodes-transform', JSON.stringify(this.props.transform));
            window.localStorage.setItem('nodes-transform-string', this.props.transformStr);
            window.localStorage.setItem('nodes', JSON.stringify(this.props.nodes));
        }
    }

    componentWillUnmount() {
        this.saveNodes();
    }

    handleNodeOnDragEnd(e, id, offset) {
        const node = this.props.nodes.find(n => n.id === id);
        if (node) {
            node.x = offset.x;
            node.y = offset.y;
        }
        this.saveNodes();
    }

    render() {
        const { selected, setNodeProperties, transformStr, nodes } = this.props;
        return (
            <svg ref={this.svgRef} className="cursor-grab">
                <defs>
                    <pattern id="smallGrid" width="10" height="10" patternUnits="userSpaceOnUse">
                        <path d="M 10 0 L 0 0 0 10" fill="none" stroke="gray" strokeWidth="0.5"/>
                    </pattern>
                    <pattern id="grid" width="100" height="100" patternUnits="userSpaceOnUse" patternTransform={transformStr}>
                        <rect width="100" height="100" fill="url(#smallGrid)"/>
                        <path d="M 100 0 L 0 0 0 100" fill="none" stroke="gray" strokeWidth="1"/>
                    </pattern>
                </defs>
                <rect width="100%" height="100%" fill="url(#grid)" />
                <g
                    ref={this.gRef}
                    transform={transformStr}
                >
                    {nodes && nodes.map(n =>
                        <Node
                            key={n.id}
                            {...n}
                            selected={selected === n.id}
                            onDragEnd={this.handleNodeOnDragEnd}
                            onClick={(node) => {
                                setNodeProperties(node);
                            }}
                        />
                    )}
                </g>
            </svg>
        );
    }
}

const mapStateToProps = (state) => ({
    nodes: state.editor.nodes || nodesSample,
    transform: state.editor.transform,
    transformStr: state.editor.transformStr,
    selected: state.properties.selected || '',
});

const mapDispatchToProps = dispatch => {
    return {
        saveChanges: (changes) => dispatch(saveChanges(changes)),
        setNodeProperties: (selected) => dispatch(setProperties(selected)),
    };
}

export default connect(
    mapStateToProps,
    mapDispatchToProps
)(NodeEditor);
