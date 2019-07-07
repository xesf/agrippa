import React from 'react';

import Player from './components/Player';

class Game extends React.Component {
    render() {
        return (
            <div className="App">
                <div className="canvas-container">
                    <Player />
                </div>
            </div>
        );
    }
}

export default Game;
