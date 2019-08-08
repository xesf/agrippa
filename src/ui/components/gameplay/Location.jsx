import React from 'react';

const Location = ({ locationDesc }) =>
    (
        <div className="location-description location-typing">
            <pre>{locationDesc}</pre>
        </div>
    );

export default Location;
