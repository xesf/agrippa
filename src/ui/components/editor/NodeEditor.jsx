import React from 'react';
import { connect } from 'react-redux';
import * as d3 from 'd3';

import Node from './Node';

import { saveTransform, saveAll, setSelection, addNode, removeNode } from '../../redux/editor/nodeeditor';

const getRandomInt = (min, max) => {
    min = Math.ceil(min);
    max = Math.floor(max);
    return Math.floor(Math.random() * (max - min)) + min;
};

class NodeEditor extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            shift: false,
            backspace: false,
        };
        this.svgRef = React.createRef();
        this.gRef = React.createRef();
        this.saveNodes = this.saveNodes.bind(this, null);
        this.handleNodeOnDragEnd = this.handleNodeOnDragEnd.bind(this, null);
        this.handleClick = this.handleClick.bind(this, null);
    }

    componentDidMount() {
        const that = this;
        // TODO: remove dependency to d3 library
        const svg = d3.select(this.svgRef.current);
        const zoom = d3.zoom()
            .clickDistance(4)
            .scaleExtent([0.5, 3])
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
        svg.on('click', () => {
            const clip = that.svgRef.current.getBoundingClientRect();
            const g = d3.select(that.gRef.current);
            const svgEl = svg.node();
            let pt = svgEl.createSVGPoint();
            pt.x = d3.event.x - clip.left;
            pt.y = d3.event.y - clip.top;
            pt = pt.matrixTransform(g.node().getCTM().inverse());
            that.handleClick(pt.x, pt.y);
        });
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

    handleKeyUp(e) {
        if (this.state.shift && this.state.backspace) {
            this.props.removeNode(this.props.selected);
        }
        if (e.keyCode === 16 || e.key === 'Shift') {
            this.setState({ shift: false });
        }
        if (e.keyCode === 8 || e.key === 'Backspace') {
            this.setState({ backspace: false });
        }
    }

    handleKeyDown(e) {
        if (e.keyCode === 16 || e.key === 'Shift') {
            this.setState({ shift: true });
        }
        if (e.keyCode === 8 || e.key === 'Backspace') {
            this.setState({ backspace: true });
        }
    }

    handleClick(e, x, y) {
        if (this.state.shift) {
            this.props.addNode({
                id: getRandomInt(99999, 1000000),
                type: 'video',
                x: (x - 75),
                y: (y - 15),
                path: 'XN/56182', // temp path
                desc: 'New Node'
            });
        }
    }

    render() {
        const { selected, setNodeProperties, transformStr, nodes, links } = this.props;
        return (
            <svg
                ref={this.svgRef}
                className="cursor-grab"
                tabIndex="0" // eslint-disable-line
                onKeyDown={e => this.handleKeyDown(e)}
                onKeyUp={e => this.handleKeyUp(e)}
            >
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
                            links={links}
                            nodes={nodes}
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
    addNode: node => dispatch(addNode(node)),
    removeNode: id => dispatch(removeNode(id)),
});

export default connect(
    mapStateToProps,
    mapDispatchToProps
)(NodeEditor);
