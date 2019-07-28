import React from 'react';
import { connect } from 'react-redux';
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

class Node extends React.Component {
    constructor(props) {
        super(props);
        this.gRef = React.createRef();
        this.linkRef = React.createRef();
        this.offset = {
            drag: false,
        };
        this.handleClick = this.handleClick.bind(this, null);
        this.targetNode = null;
        this.sourceNode = null;
        if (this.props.linkTarget) {
            this.targetNode = this.props.nodes.find(n => n.id === this.props.linkTarget.target);
        }
        if (this.props.linkSource) {
            this.sourceNode = this.props.nodes.find(n => n.id === this.props.linkSource.source);
        }
    }

    componentDidMount() {
        const that = this;
        // TODO: remove dependency to d3 library
        const linkTarget = d3.select(this.linkRef.current);
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
                        if (this.targetNode) {
                            linkTarget
                                .attr('x1', d3.event.x)
                                .attr('y1', d3.event.y);
                        }
                        if (this.sourceNode) {
                            const linkSource = d3.select(`#node-line-${this.props.linkSource.source}`);
                            linkSource
                                .attr('x2', d3.event.x)
                                .attr('y2', d3.event.y);
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
        const { onClick, onDragEnd, ...rest } = this.props;
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
                {this.targetNode &&
                    <line
                        ref={this.linkRef}
                        id={`node-line-${id}`}
                        fill="none"
                        stroke="white"
                        x1={x + 75}
                        y1={y + 20}
                        x2={this.targetNode.x + 75}
                        y2={this.targetNode.y + 20}
                    />
                }
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

const mapStateToProps = state => ({
    nodes: state.editor.nodes,
});

export default connect(
    mapStateToProps,
)(Node);
