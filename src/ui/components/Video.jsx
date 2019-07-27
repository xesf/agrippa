import React from 'react';

export default class Video extends React.Component {
    constructor(props) {
        super(props);
        this.state = {};
    }

    render() {
        const { children, ...rest } = this.props;
        return (
            <div className="video-preview-container">
                <video
                    {...rest}
                >
                    {children}
                </video>
            </div>
        );
    }
}
