import React from 'react';
import * as d3 from 'd3';

const baseStyle = {
    fill: 'rgb(1, 22, 29)',
    fontSize: '10',
    fontFamily: 'Verdana',
};

const textStyle = {
    ...baseStyle,
    fontSize: '12',
};

const lineStyle = {
    fill: 'none',
    stroke: 'white',
    strokeWidth: '3',
};

const decisionLineStyle = {
    ...lineStyle,
    strokeDasharray: '10',
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
        this.linkRef = React.createRef();
        this.offset = {
            drag: false,
        };
        this.handleClick = this.handleClick.bind(this, null);
        this.targetNodes = [];
        this.sourceNodes = [];

        const linkTarget = this.props.links.filter(l => l.source === this.props.id);
        const linkSource = this.props.links.filter((l) => {
            if (Array.isArray(l.target)) {
                return l.target.includes(this.props.id);
            }
            return l.target === this.props.id;
        });

        if (linkTarget) {
            linkTarget.forEach((t) => {
                if (Array.isArray(t.target)) {
                    t.target.forEach((tt) => {
                        const tn = this.props.nodes.find(n => n.id === tt);
                        if (tn) {
                            this.targetNodes.push(tn);
                        }
                    });
                } else {
                    const tn = this.props.nodes.find(n => n.id === t.target);
                    if (tn) {
                        this.targetNodes.push(tn);
                    }
                }
            });
        }
        if (linkSource) {
            linkSource.forEach((t) => {
                const tn = this.props.nodes.find(n => n.id === t.source);
                if (tn) {
                    this.sourceNodes.push(tn);
                }
            });
        }
    }

    componentDidMount() {
        const that = this;
        // TODO: remove dependency to d3 library
        const node = d3.select(this.gRef.current);
        node.on('click', this.handleClick);
        const drag = d3.drag()
            .clickDistance(16)
            .on('start', () => {
                node.raise().classed('cursor-grabbing', true);
                that.offset = {
                    x: d3.event.x - 75,
                    y: d3.event.y - 20,
                    drag: false,
                };
                d3.event
                    .on('drag', () => {
                        that.offset = {
                            x: that.offset.x + d3.event.dx,
                            y: that.offset.y + d3.event.dy,
                            drag: true,
                        };
                        node.attr('transform', `translate(${that.offset.x},${that.offset.y})`);
                        if (this.targetNodes) {
                            this.targetNodes.forEach(((n) => {
                                const svgLineTarget = d3.select(`#node-line-${that.props.id}-${n.id}`);
                                svgLineTarget
                                    .attr('x1', d3.event.x + (that.props.type === 'decision' ? -5 : 55))
                                    .attr('y1', d3.event.y);
                            }));
                        }
                        if (this.sourceNodes) {
                            this.sourceNodes.forEach(((n) => {
                                const svgLineSource = d3.select(`#node-line-${n.id}-${that.props.id}`);
                                svgLineSource
                                    .attr('x2', d3.event.x - 45)
                                    .attr('y2', d3.event.y);
                            }));
                        }
                    })
                    .on('end', () => {
                        node.classed('cursor-grabbing', false);
                        if (that.offset.drag && that.props.onDragEnd) {
                            that.props.onDragEnd(that.props.id, that.offset);
                        }
                    });
            });

        node.call(drag);
    }

    handleClick() {
        const { onClick, onDragEnd, links, nodes, selected, ...rest } = this.props;
        if (onClick) {
            onClick({
                ...rest,
            });
        }
    }

    render() {
        const { x, y, type, path, desc, selected, id } = this.props;
        return (
            <React.Fragment>
                {this.targetNodes && this.targetNodes.map(n =>
                    <line
                        key={`${id}${n.id}`}
                        id={`node-line-${id}-${n.id}`}
                        x1={x + (type === 'decision' ? 70 : 130)}
                        y1={y + 20}
                        x2={n.x + 30}
                        y2={n.y + 20}
                        style={type === 'decision' ? decisionLineStyle : lineStyle}
                    />
                )}
                <g
                    ref={this.gRef}
                    className="node-group"
                    transform={`translate(${x},${y})`}
                >
                    <rect
                        x={0}
                        y={0}
                        rx="20"
                        ry="20"

                        className={`node ${type} ${selected ? 'selected' : ''}`}
                    >
                        <title>{desc}</title>
                    </rect>
                    <text x={15} y={18} style={textStyle}>
                        <title>{desc}</title>
                        {path}
                    </text>
                    <text x={15} y={30} style={baseStyle}>({type})</text>
                    {/* <circle cx={130} cy={20} r="20" style={plusCircleStyle}>
                        <title>Link node</title>
                    </circle>
                    <text x={125} y={25} style={plusStyle}>+</text> */}
                </g>
            </React.Fragment>
        );
    }
}
