import React from 'react';
import * as d3 from 'd3';

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
// const plusStyle = {
//     ...baseStyle,
//     'fontSize': '14',
//     'fontWeight': 'bold'
// };
// const plusCircleStyle = {
//     stroke: 'orange',
//     'strokeWidth': '2',
//     fill: 'rgb(158, 202, 97)',
// };

export default class Node extends React.Component {
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
                {/* <circle cx={130} cy={20} r="20" style={plusCircleStyle}>
                    <title>Link node</title>
                </circle>
                <text x={125} y={25} style={plusStyle}>+</text> */}
            </g>
        );
    }
};
