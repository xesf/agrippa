import React from 'react';
import * as d3 from 'd3';

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
        this.offset = {
            drag: false,
        };
        this.handleClick = this.handleClick.bind(this, null);
    }

    componentDidMount() {
        const that = this;
        // TODO: remove dependency to d3 library
        const node = d3.select(this.gRef.current);
        node.on('click', this.handleClick);
        const drag = d3.drag()
            .clickDistance(16)
            .on("start", () => {
                node.raise().classed("cursor-grabbing", true);
                that.offset = {
                    x: d3.event.x - 75,
                    y: d3.event.y - 20,
                    drag: false,
                };
                d3.event
                .on("drag", () => {
                    that.offset = {
                        x: that.offset.x + d3.event.dx,
                        y: that.offset.y + d3.event.dy,
                        drag: true,
                    };
                    node.attr("transform", "translate(" + (that.offset.x) + "," + (that.offset.y) + ")");
                  })
                .on("end", () => {
                    node.classed("cursor-grabbing", false);
                    if (that.offset.drag && that.props.onDragEnd) {
                        that.props.onDragEnd(that.props.id, that.offset);
                    }
                })
            });

        node.call(drag);
    }

    handleClick(e) {
        const { onClick, onDragEnd, ...rest } = this.props;
        if (onClick) {
            onClick({
                ...rest,
            });
        }
    }

    render() {
        const { x, y, type, name, desc, selected } = this.props;
        return (
            <g
                ref={this.gRef}
                className="node-group"
                transform={`translate(${x},${y})`}
            >
                <rect
                    x={0} y={0}
                    rx="20" ry="20"
                    width="150" height="40"
                    className={`node${selected ? ' selected' : ''}`}
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
