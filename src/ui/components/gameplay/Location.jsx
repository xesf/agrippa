import React from 'react';

const Location = ({ locationDesc, rwh, rhw }) => {
    const style = {
        position: 'absolute',
        left: `${30 / rwh}`,
        top: `${260 / rhw}`,
    };
    return (
        <div className="location-description location-typing" style={style}>
            <pre>{locationDesc}</pre>
        </div>
    );
};

export default Location;
