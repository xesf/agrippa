import React from 'react';

const Hotspots = ({ items, onClick, editor }) => {
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
                left: h.x1 + 20,
                top: h.y1 + 100,
                width: h.x2 - h.x1,
                height: (h.y2 - h.y1),
                border: (editor) ? '1px dashed gray' : '',
            };
            return (<div
                key={`${h.unk1}`}
                className="hotspot-item"
                style={stylePos}
                onClick={() => handleOnClick(h)}
            />);
        })
    );
};

export default Hotspots;
