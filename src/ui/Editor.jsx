import React from 'react';

import Player from './components/Player';

import Tab from './components/editor/Tab';
import TabItem from './components/editor/TabItem';
import NodeEditor from './components/editor/NodeEditor';

class Editor extends React.Component {
    render() {
        return (
            <React.Fragment>
                <Tab selectedTabIndex={1} alwaysRendered>
                    <TabItem label="agrippa" header />
                    <TabItem label="Editor" active>
                        <div className="canvas-container-scroll" style={{ margin: '1.5em 0.5em' }}>
                            <div className="ui grid two">
                                <div style={{ flex: '0 0 300px', paddingRight: '0.3em' }}>
                                    <Tab type="top">
                                        <TabItem label="Properties">
                                            <div className="layout-border layout-properties">
                                                Properties
                                            </div>
                                        </TabItem>
                                        <TabItem label="Assets">
                                            assets area
                                        </TabItem>
                                    </Tab>
                                </div>
                                <div className="layout-border" style={{ flex: '1', padding: '0px'}}>
                                    <NodeEditor />
                                </div>
                            </div>
                            
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
