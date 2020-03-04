import React from 'react';

const Location = ({ locationDesc, rwh, rhw }) => {
    const style = {
        position: 'absolute',
        left: `${20 / rwh}`,
        bottom: `calc(50% - ${100 / rhw}px)`,
    };
    return (
        <div className="location-description location-typing" style={style}>
            <pre>{locationDesc}</pre>
        </div>
    );
};

export default Location;
