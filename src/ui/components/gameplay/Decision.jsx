import React from 'react';

const Decision = ({ items, onClick }) => {
    const handleOnClick = (d) => {
        if (onClick) {
            onClick(d);
        }
    };
    return (
        <div className="ui grid container equal width decision-container">
            <div className="column decision-item-container" />
            <div className="column decision-item-container" />
            {items && items.map(d => (
                <div
                    id="decision-container"
                    key={`${d.id}${d.type}`}
                    className="column decision-item-container"
                    onClick={() => handleOnClick(d)}
                    onMouseOver={() => { document.getElementById(d.type).play(); }}
                    onMouseOut={() => document.getElementById(d.type).pause()}
                    onFocus={() => {}}
                    onBlur={() => {}}
                >
                    <video
                        id={d.type}
                        loop
                        src={`http://localhost:8080/mp4/${d.path}`}
                        className="decision-video"
                    />
                    <p className="decision-item">{d.desc}</p>
                </div>
            ))}
            <div className="column decision-item-container" />
            <div className="column decision-item-container" />
        </div>
    );
};

export default Decision;
