import React from 'react';

const Node = (props) => {
    const { x, y, type, name, desc } = props;
    const nodeStyle = {
        fill: 'white',
        stroke: 'orange',
        'stroke-width': 3,
        opacity: 1
    };
    const baseStyle = {
        fill: 'rgb(1, 22, 29)',
        'font-size': '10',
        'font-family':'Verdana',
    };
    const textStyle = {
        ...baseStyle,
        'font-size': '12',
    };
    const plusStyle = {
        ...baseStyle,
        'font-size': '14',
        'font-weight': 'bold'
    };
    const plusCircleStyle = {
        stroke: 'orange',
        'stroke-width': '2',
        fill: 'rgb(158, 202, 97)',
    };
    return (
        <React.Fragment>
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
        </React.Fragment>
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
    render() {
        return (
            <svg ref={this.svgRef}>
                <g ref={this.gRef}>
                    {this.state.nodes.map(n => <Node {...n} />)}
                </g>
            </svg>
        );
    }
}
