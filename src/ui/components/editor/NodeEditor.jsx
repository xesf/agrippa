import React from 'react';
import { connect } from 'react-redux';
import * as d3 from 'd3';

import Node from './Node';

import { saveTransform, saveAll, setSelection } from '../../redux/editor/nodeeditor';

class NodeEditor extends React.Component {
    constructor(props) {
        super(props);
        this.svgRef = React.createRef();
        this.gRef = React.createRef();
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
            .on('start', () => {
                svg.raise().classed('cursor-grabbing', true);
            })
            .on('zoom', () => {
                if (d3.event.transform) {
                    that.props.saveTransform({
                        transform: {
                            k: d3.event.transform.k,
                            x: d3.event.transform.x,
                            y: d3.event.transform.y,
                        },
                        transformStr: d3.event.transform.toString(),
                    });
                }
            })
            .on('end', () => {
                svg.raise().classed('cursor-grabbing', false);
                that.saveNodes();
            });
        svg.call(zoom);
        svg.on('dblclick.zoom', null);
        if (that.props.transform) {
            const { k, x, y } = that.props.transform;
            const t = d3.zoomIdentity.translate(x, y).scale(k);
            svg.call(zoom.transform, t);
        }
    }

    saveNodes() {
        this.props.saveAll({
            transform: this.props.transform,
            transformStr: this.props.transformStr,
            nodes: this.props.nodes,
        });
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
                            id={n.id}
                            selected={selected === n.id}
                            onDragEnd={this.handleNodeOnDragEnd}
                            onClick={(node) => {
                                setNodeProperties(node);
                            }}
                            linkTarget={this.props.links.find(l => l.source === n.id)}
                            linkSource={this.props.links.find(l => l.target === n.id)}
                        />
                    )}
                </g>
            </svg>
        );
    }
}

const mapStateToProps = state => ({
    nodes: state.editor.nodes,
    links: state.editor.links,
    transform: state.editor.transform,
    transformStr: state.editor.transformStr,
    selected: state.editor.selected || '',
});

const mapDispatchToProps = dispatch => ({
    saveTransform: changes => dispatch(saveTransform(changes)),
    saveAll: changes => dispatch(saveAll(changes)),
    setNodeProperties: node => dispatch(setSelection(node)),
});

export default connect(
    mapStateToProps,
    mapDispatchToProps
)(NodeEditor);
