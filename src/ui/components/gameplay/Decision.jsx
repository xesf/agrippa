import React, { useEffect } from 'react';

import './decision.css';

const Decision = ({ defaultDecision, timeout, items, onClick, rwh, rhw, Video }) => {
    const handleOnClick = (d) => {
        if (onClick) {
            onClick(d);
        }
    };
    useEffect(() => {
        const timer = setTimeout(() => { handleOnClick({ option: defaultDecision }); }, timeout);
        return () => clearTimeout(timer);
    });

    const style = {
        position: 'absolute',
        bottom: `${15 / rhw}`,
        maxHeight: `${80 / rhw}px`,
    };

    const columnSize = {
        width: `${(90 / rwh)}px`,
        paddingLeft: '2em',
        paddingRight: '2em',
    };

    return (
        <div className="decision-container" style={style}>
            {items && items.map(d => (
                <div
                    id="decision-container"
                    key={`${d.id}${d.type}`}
                    className="decision-item-container"
                    style={columnSize}
                    onClick={() => handleOnClick(d)}
                    onMouseOver={() => { document.getElementById(d.type).play(); }}
                    onMouseOut={() => document.getElementById(d.type).pause()}
                    onFocus={() => {}}
                    onBlur={() => {}}
                >
                    <Video
                        id={d.type}
                        loop
                        width={80 / rwh}
                        height={60 / rhw}
                        src={`mp4/${d.path}`}
                    />
                    <p className="decision-item">{d.desc}</p>
                </div>
            ))}
        </div>
    );
};

export default Decision;
