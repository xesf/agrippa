import React from 'react';

const Location = ({ node }) =>
    (
        <div className="location-description location-typing">
            <pre>{node.annotations.locationDesc}</pre>
        </div>
    );

export default Location;
