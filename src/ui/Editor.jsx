import React from 'react';

import Player from './components/Player';

import Tab from './components/editor/Tab';
import TabItem from './components/editor/TabItem';

class Editor extends React.Component {
    render() {
        return (
            <React.Fragment>
                <Tab selectedTabIndex={1} alwaysRendered>
                    <TabItem label="agrippa" header />
                    <TabItem label="Editor" active>
                        <div className="canvas-container-scroll" style={{ padding: '1em 1em' }}>
                            <Tab type="left">
                                <TabItem label="Nodes">
                                    nodes
                                </TabItem>
                                <TabItem label="Assets">
                                    assets
                                </TabItem>
                            </Tab>
                        </div>
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
