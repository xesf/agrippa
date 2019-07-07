import React from 'react';

import Player from './Player';

import Tab from './components/Tab';
import TabItem from './components/TabItem';

class Editor extends React.Component {
    render() {
        return (
            <React.Fragment>
                <Tab alwaysRendered>
                    <TabItem label="Editor">

                    </TabItem>
                    <TabItem label="Game">
                        <div className="canvas-container-scroll">
                            <Player />
                        </div>
                    </TabItem>
                </Tab>
            </React.Fragment>
        );
    }
}

export default Editor;
