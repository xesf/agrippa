import React from 'react';

const Hotspots = ({ items, onClick, editor, rwh, rhw }) => {
    const handleOnClick = (h) => {
        if (onClick) {
            onClick(h);
        }
    };
    return (
        items && items.map((h) => {
            // bars offset
            const stylePos = {
                position: 'absolute',
                left: (h.x1 / rwh) + (20 / rwh),
                top: (h.y1 / rhw) + (100 / rhw),
                width: ((h.x2 / rwh) - (h.x1 / rwh)),
                height: ((h.y2 / rhw) - (h.y1 / rhw)),
                border: (editor) ? '1px dashed gray' : '',
            };
            return (<div
                key={`${h.type}${h.unk1}`}
                className="hotspot-item"
                style={stylePos}
                onClick={() => handleOnClick(h)}
            />);
        })
    );
};

export default Hotspots;
