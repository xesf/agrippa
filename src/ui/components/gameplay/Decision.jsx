import React, { useEffect } from 'react';

import Video from '../Video';

const Decision = ({ defaultDecision, timeout, items, onClick, rwh, rhw }) => {
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
        top: `${350 / rhw}`
    };

    const columnSize = {
        width: `${(6.25 / rwh)}%`,
        paddingLeft: '2em',
        paddingRight: '2em',
    };

    return (
        <div className="ui grid container equal width decision-container" style={style}>
            <div className="column decision-item-container" style={columnSize} />
            <div className="column decision-item-container" style={columnSize} />
            {items && items.map(d => (
                <div
                    id="decision-container"
                    key={`${d.id}${d.type}`}
                    className="column decision-item-container"
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
                        src={`http://localhost:8080/mp4/${d.path}`}
                    />
                    <p className="decision-item">{d.desc}</p>
                </div>
            ))}
            <div className="column decision-item-container" style={columnSize} />
            <div className="column decision-item-container" />
        </div>
    );
};

export default Decision;
