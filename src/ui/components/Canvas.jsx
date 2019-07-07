import React from 'react';

const canvas = document.createElement('canvas');
// const context = canvas.getContext('2d');

export default class Canvas extends React.Component {
    constructor(props) {
        super(props);
        canvas.width = this.props.width;
        canvas.height = this.props.height;

        this.containerRef = React.createRef();
    }

    componentDidMount() {
        this.containerRef.current.appendChild(canvas);
    }

    render() {
        return (
            <div ref={this.containerRef} className="canvas-container">
                {this.props.children}
            </div>
        );
    }
}

export { canvas };
