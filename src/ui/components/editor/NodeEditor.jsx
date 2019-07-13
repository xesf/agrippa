import React from 'react';
import * as d3 from 'd3';

import { nodes } from './nodes.json';

const gStyle = {
    cursor: 'pointer',
};
const nodeStyle = {
    fill: 'white',
    stroke: 'orange',
    'strokeWidth': 3,
    opacity: 1
};
const baseStyle = {
    fill: 'rgb(1, 22, 29)',
    'fontSize': '10',
    'fontFamily':'Verdana',
};
const textStyle = {
    ...baseStyle,
    'fontSize': '12',
};
const plusStyle = {
    ...baseStyle,
    'fontSize': '14',
    'fontWeight': 'bold'
};
const plusCircleStyle = {
    stroke: 'orange',
    'strokeWidth': '2',
    fill: 'rgb(158, 202, 97)',
};

class Node extends React.Component {
    constructor(props) {
        super(props);
        this.gRef = React.createRef();
        this.offset = null;
    }

    componentDidMount() {
        const that = this;
        // TODO: remove dependency to d3 library
        const node = d3.select(this.gRef.current);
        const drag = d3.drag()
            .on("start", () => {
                node.raise().classed("cursor-grabbing", true);
                that.offset = {
                    x: d3.event.x - 75,
                    y: d3.event.y - 20,
                };
            })
            .on("drag", () => {
                that.offset = {
                    x: that.offset.x + d3.event.dx,
                    y: that.offset.y + d3.event.dy,
                };
                node.attr("transform", "translate(" + (that.offset.x) + "," + (that.offset.y) + ")");
              })
            .on("end", () => {
                node.classed("cursor-grabbing", false);
                if (that.props.onDragEnd) {
                    that.props.onDragEnd(that.props.id, that.offset);
                }
            });

        node.call(drag);
    }

    render() {
        const { x, y, type, name, desc } = this.props;
        return (
            <g ref={this.gRef} style={{ ...gStyle}} transform={`translate(${x},${y})`}>
                <rect
                    x={0} y={0}
                    rx="20" ry="20"
                    width="150" height="40"
                    style={nodeStyle}
                >
                    <title>{desc}</title>
                </rect>
                <text x={15} y={18} style={textStyle}>
                    <title>{desc}</title>
                    {name}
                </text>
                <text x={15} y={30} style={baseStyle}>({type})</text>
                <circle cx={130} cy={20} r="20" style={plusCircleStyle}>
                    <title>Link node</title>
                </circle>
                <text x={125} y={25} style={plusStyle}>+</text>
            </g>
        );
    }
};

export default class NodeEditor extends React.Component {
    constructor(props) {
        super(props);
        this.svgRef = React.createRef();
        this.gRef = React.createRef();
        this.state = {
            nodes: nodes,
        };
        this.saveNodes = this.saveNodes.bind(this, null);
        this.handleNodeOnDragEnd = this.handleNodeOnDragEnd.bind(this, null);
    }

    componentWillMount() {
        this.setState({
            transform: JSON.parse(window.localStorage.getItem('nodes-transform')),
            transformStr: window.localStorage.getItem('nodes-transform-string'),
        });
        const nodes = window.localStorage.getItem('nodes');
        if (nodes) {
            this.setState({
                nodes: JSON.parse(window.localStorage.getItem('nodes')),
            }); 
        }
    }

    componentDidMount() {
        const that = this;
        // TODO: remove dependency to d3 library
        const svg = d3.select(this.svgRef.current);
        const zoom = d3.zoom()
            .scaleExtent([0.5, 2])
            .on("start", () => {
                svg.raise().classed("cursor-grabbing", true);
            })
            .on("zoom", () => {
                if (d3.event.transform) {
                    that.setState({
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
        if (that.state.transform) {
            const { k, x, y } = that.state.transform;
            const t = d3.zoomIdentity.translate(x, y).scale(k);
            svg.call(zoom.transform, t);
        }
    }

    saveNodes() {
        if (this.state.transform) {
            window.localStorage.setItem('nodes-transform', JSON.stringify(this.state.transform));
            window.localStorage.setItem('nodes-transform-string', this.state.transformStr);
            window.localStorage.setItem('nodes', JSON.stringify(this.state.nodes));
        }
    }

    componentWillUnmount() {
        this.saveNodes();
    }

    handleNodeOnDragEnd(e, id, offset) {
        const node = this.state.nodes.find(n => n.id === id);
        if (node) {
            node.x = offset.x;
            node.y = offset.y;
        }
        this.saveNodes();
    }

    render() {
        return (
            <svg ref={this.svgRef} className="cursor-grab">
                <defs>
                    <pattern id="smallGrid" width="10" height="10" patternUnits="userSpaceOnUse">
                        <path d="M 10 0 L 0 0 0 10" fill="none" stroke="gray" strokeWidth="0.5"/>
                    </pattern>
                    <pattern id="grid" width="100" height="100" patternUnits="userSpaceOnUse" patternTransform={this.state.transformStr}>
                        <rect width="100" height="100" fill="url(#smallGrid)"/>
                        <path d="M 100 0 L 0 0 0 100" fill="none" stroke="gray" strokeWidth="1"/>
                    </pattern>
                </defs>
                <rect width="100%" height="100%" fill="url(#grid)" />
                <g ref={this.gRef} transform={this.state.transformStr}>
                    {this.state.nodes.map(n =>
                        <Node
                            key={n.id}
                            {...n}
                            onDragEnd={this.handleNodeOnDragEnd}
                        />
                    )}
                </g>
            </svg>
        );
    }
}
