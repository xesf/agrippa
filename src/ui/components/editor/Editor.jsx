import React from 'react';
import { connect } from 'react-redux';

// import Player from './components/Player';

import Tab from './Tab';
import TabItem from './TabItem';
import NodeEditor from './NodeEditor';
import Properties from './Properties';
// import Assets from './Assets';
import Game from '../Game';
import Scripting from './Scripting';

const Editor = ({ ready }) =>
    (
        <React.Fragment>
            <Tab selectedTabIndex={1}>
                <TabItem label="agrippa" header />
                <TabItem label="Editor" active>
                    <div className="canvas-container-scroll" style={{ margin: '1.5em 0.5em' }}>
                        <div className="ui grid two">
                            <div style={{ flex: '0 0 300px', paddingRight: '0.3em', height: '100%' }}>
                                <Tab type="top">
                                    <TabItem label="Properties">
                                        <Properties />
                                    </TabItem>
                                    {/* <TabItem label="Assets">
                                        <Assets />
                                    </TabItem> */}
                                </Tab>
                            </div>
                            <div className="layout-border" style={{ flex: '1', padding: '0px'}}>
                                {ready && (
                                    <React.Fragment>
                                        <div className="editor-screen-row">
                                            <div className="editor-screen-column" style={{ backgroundColor: 'black' }}>
                                                <Game editor />
                                            </div>
                                            <div className="editor-screen-column">
                                                <Scripting />
                                            </div>
                                        </div>
                                        <NodeEditor />
                                    </React.Fragment>
                                )}
                            </div>
                        </div>
                    </div>
                </TabItem>
                <TabItem label="Game">
                    <div className="canvas-container-scroll" style={{ backgroundColor: 'black' }}>
                        <Game />
                    </div>
                </TabItem>
            </Tab>
        </React.Fragment>
    );

const mapStateToProps = state => ({
    ready: state.editor.ready,
});

export default connect(
    mapStateToProps
)(Editor);
