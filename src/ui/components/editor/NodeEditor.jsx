import React from 'react';
import * as d3 from 'd3';

const Node = (props) => {
    const { x, y, type, name, desc } = props;
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
    return (
        <g style={gStyle}>
            <rect
                x={x} y={y}
                rx="20" ry="20"
                width="150" height="40"
                style={nodeStyle}
            >
                <title>{desc}</title>
            </rect>
            <text x={x+15} y={y+18} style={textStyle}>
                <title>{desc}</title>
                {name}
            </text>
            <text x={x+15} y={y+30} style={baseStyle}>({type})</text>
            <circle cx={x+130} cy={y+20} r="20" style={plusCircleStyle}>
                <title>Link node</title>
            </circle>
            <text x={x+125} y={y+25} style={plusStyle}>+</text>
        </g>
    );
};

export default class NodeEditor extends React.Component {
    constructor(props) {
        super(props);
        this.svgRef = React.createRef();
        this.gRef = React.createRef();
        this.state = {
            nodes: [
                { id: '19812', type: 'video', name: 'xv/19812', x: 50, y: 80, desc: 'Willmore Entering Office' },
                { id: '19814', type: 'video', name: 'xv/19814', x: 250, y: 10, desc: '[Emotion Funny] Willmore Entering Office' },
                { id: '19816', type: 'video', name: 'xv/19816', x: 250, y: 60, desc: '[Emotion Indifferent] Willmore Entering Office' },
                { id: '19818', type: 'video', name: 'xv/19818', x: 250, y: 110, desc: '[Emotion Paranoid] Willmore Entering Office' },
                { id: '19820', type: 'video', name: 'xv/19820', x: 250, y: 160, desc: '[default] Willmore Entering Office' },
            ]
        };
    }

    componentDidMount() {
        const svg = d3.select(this.svgRef.current);
        const zoom = d3.zoom()
            .scaleExtent([0.5, 2])
            .on("zoom", () => {
                d3.select(this.gRef.current)
                    .attr('transform', d3.event.transform)
                d3.select("#grid")
                    .attr('patternTransform', d3.event.transform);
            });
        svg.call(zoom);
    }

    render() {
        return (
            <svg ref={this.svgRef}>
                <defs>
                    <pattern id="smallGrid" width="10" height="10" patternUnits="userSpaceOnUse">
                        <path d="M 10 0 L 0 0 0 10" fill="none" stroke="gray" strokeWidth="0.5"/>
                    </pattern>
                    <pattern id="grid" width="100" height="100" patternUnits="userSpaceOnUse">
                        <rect width="100" height="100" fill="url(#smallGrid)"/>
                        <path d="M 100 0 L 0 0 0 100" fill="none" stroke="gray" strokeWidth="1"/>
                    </pattern>
                </defs>
                <rect width="100%" height="100%" fill="url(#grid)" />
                <g ref={this.gRef}>
                    {this.state.nodes.map(n => <Node key={n.id} {...n} />)}
                </g>
            </svg>
        );
    }
}
