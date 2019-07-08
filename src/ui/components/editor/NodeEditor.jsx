import React from 'react';
// import * as d3 from 'd3'

const Node = (props) => {
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
                x="50" y="20"
                rx="20" ry="20"
                width="150" height="40"
                style={nodeStyle}
            />
            <text x="65" y="38" style={textStyle}>Node</text>
            <text x="65" y="50" style={baseStyle}>(video)</text>
            <circle cx="180" cy="40" r="20" style={plusCircleStyle} />
            <text x="174" y="45" style={plusStyle}>+</text>
        </React.Fragment>
    );
};

export default class NodeEditor extends React.Component {
    render() {
        return (
            <svg>
                <Node />
            </svg>
        );
    }
}
