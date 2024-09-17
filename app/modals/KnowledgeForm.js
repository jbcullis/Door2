import React, { Component } from 'react';
import {
    RefreshControl,
    View,
    Text,
    Image,
    Animated,
    Platform,
    Keyboard,
    Pressable,
    ScrollView,
} from 'react-native';
import InputControl from '../controls/InputControl.js';
module.exports = class KnowledgeForm extends Component {
    constructor(props) {
        super(props);
        this.Titlebar = null;
        this.state = {
            Refreshing: false
        }
    };
    IsActive() {
        try {
            return Global.State.hasOwnProperty(this.props.ModelID) && Global.State[this.props.ModelID] !== null;
        } catch (ex) {
            global.Log({Message: 'KnowledgeForm.IsActive>>' + ex.message});
        }
    };
    async Show(Params_Value) {
        try {
            global.root.NotificationModal.Show({ NotificationTitle: 'Loading...', NotificationStyle: 'Wait' });

            let _ViewWidth = Global.ScreenX > 600 ? 600 : Global.ScreenX;

            let _Knowledge = (Params_Value.KnowledgeID !== null ? await KnowledgeHelper.GetOne({ KnowledgeID: Params_Value.KnowledgeID }) : null);

            //Create State
            Global.State[this.props.ModelID] = {
                PageTitle: _Knowledge !== null ? 'EDIT KNOWLEDGE' : 'NEW KNOWLEDGE',
                Knowledge: KnowledgeHelper.Clone(_Knowledge),
                KnowledgeSnapshot: KnowledgeHelper.Clone(_Knowledge),
                KnowledgeDirty: false,
                SaveCallback: Params_Value.hasOwnProperty('SaveCallback') ? Params_Value.SaveCallback : null,
                DeleteCallback: Params_Value.hasOwnProperty('DeleteCallback') ? Params_Value.DeleteCallback : null,
                ActiveWindow: false,
                ViewWidth: _ViewWidth,
                ViewOffset: new Animated.Value(_ViewWidth),
                FooterOffset: new Animated.Value(-70),
                FooterPadding: new Animated.Value(0),
            };

            //ActiveHandler must be called after forceUpdate
            this.forceUpdate();
            global.root.ActiveHandler();

            if (Global.State[this.props.ModelID] !== null && Global.State[this.props.ModelID].ViewOffset !== null && Global.State[this.props.ModelID].ViewOffset._value >= Global.State[this.props.ModelID].ViewWidth) {
                setTimeout(() => {
                    Animated.timing(Global.State[this.props.ModelID].ViewOffset, {duration: 200, toValue: 0, useNativeDriver: Global.NativeAnimationDriver}).start(() => {
                        global.root.NotificationModal.Hide();
                    });
                }, 1);
            }

        } catch (ex) {
            Global.State[this.props.ModelID] = null;
            global.Log({Message: 'KnowledgeForm.Show>>' + ex.message, Notify: true});
        }
    };
    CheckDirty() {
        try {
            let _KnowledgeDirty = (JSON.stringify(Global.State[this.props.ModelID].KnowledgeSnapshot).trim() !== JSON.stringify(Global.State[this.props.ModelID].Knowledge).trim());
            if (_KnowledgeDirty !== Global.State[this.props.ModelID].KnowledgeDirty) {
                Global.State[this.props.ModelID].KnowledgeDirty = _KnowledgeDirty;
                if (Global.State[this.props.ModelID] !== null && Global.State[this.props.ModelID].FooterOffset !== null) {
                    if (Global.State[this.props.ModelID].KnowledgeDirty) {
                        Animated.timing(Global.State[this.props.ModelID].FooterOffset, {duration: 200, toValue: Global.InsetBottom, useNativeDriver: false}).start();
                        Animated.timing(Global.State[this.props.ModelID].FooterPadding, {duration: 200, toValue: 70, useNativeDriver: false}).start();
                    } else {
                        Animated.timing(Global.State[this.props.ModelID].FooterOffset, { duration: 200, toValue: -70, useNativeDriver: false}).start();
                        Animated.timing(Global.State[this.props.ModelID].FooterPadding, { duration: 200, toValue: 0, useNativeDriver: false}).start();
                    }
                }
            }
            this.forceUpdate();
        } catch (ex) {
            global.Log({Message: 'KnowledgeForm.CheckDirty>>' + ex.message, Notify: true});
        }
    };
    SaveKnowledge() {
        try {
            this.ClearFocus();
            setTimeout(async () => {
                try {

                    await global.root.NotificationModal.Show({ NotificationTitle: 'Saving...', NotificationStyle: 'Wait' });
                    let _Knowledge = KnowledgeHelper.Clone(Global.State[this.props.ModelID].Knowledge);

                    //Save the knowledge
                    _Knowledge = await KnowledgeHelper.Save(_Knowledge);
                    if (_Knowledge !== null) {
                        Global.State[this.props.ModelID].Knowledge = KnowledgeHelper.Clone(_Knowledge);
                        Global.State[this.props.ModelID].KnowledgeSnapshot = KnowledgeHelper.Clone(_Knowledge);
                    }

                    //Run callback
                    if (Global.State[this.props.ModelID].SaveCallback !== null) {
                        Global.State[this.props.ModelID].SaveCallback(KnowledgeHelper.Clone(Global.State[this.props.ModelID].Knowledge));
                    }

                    this.CheckDirty();
                    global.root.NotificationModal.Hide();

                } catch (ex) {
                    global.Log({Message: 'KnowledgeForm.SaveKnowledge>>' + ex.message, Notify: true});
                }
            }, Platform.OS === 'macos' || Platform.OS === 'windows' ? 50 : 1);
        } catch (ex) {
            global.Log({Message: 'KnowledgeForm.SaveKnowledge>>' + ex.message, Notify: true});
        }
    };
    CancelKnowledge() {
        try {
            this.ClearFocus();
            setTimeout(async () => {
                try {
                    Global.State[this.props.ModelID].Knowledge = KnowledgeHelper.Clone(Global.State[this.props.ModelID].KnowledgeSnapshot);
                    this.CheckDirty();
                } catch (ex) {
                    global.Log({Message: 'KnowledgeForm.CancelKnowledge>>' + ex.message, Notify: true});
                }
            }, Platform.OS === 'macos' || Platform.OS === 'windows' ? 50 : 1);
        } catch (ex) {
            global.Log({Message: 'KnowledgeForm.CancelKnowledge>>' + ex.message, Notify: true});
        }
    };
    DeleteKnowledge() {
        try {
            this.ClearFocus();
            global.root.ConfirmModal.Show('Just Checking...', 'Are you sure you want to delete this knowledge?', 'Yes', 'No', async () => {
                try {
                    if (Global.State[this.props.ModelID].Knowledge !== null
                    && Global.State[this.props.ModelID].Knowledge.KnowledgeID !== null) {
                        await global.root.NotificationModal.Show({ NotificationTitle: 'Deleting...', NotificationStyle: 'Wait' });
                        await KnowledgeHelper.Delete({ KnowledgeID: Global.State[this.props.ModelID].Knowledge.KnowledgeID });
                        if (Global.State[this.props.ModelID].DeleteCallback !== null) {
                            Global.State[this.props.ModelID].DeleteCallback(Global.State[this.props.ModelID].Knowledge);
                        }
                        global.root.NotificationModal.Hide();
                        this.Hide();
                    } else {
                        this.Hide();
                    }
                } catch (ex) {
                    global.Log({Message: 'KnowledgeForm.DeleteKnowledge>>' + ex.message, Notify: true});
                }
            }, () => {
                //Cancel - Do Nothing
            });
        } catch (ex) {
            global.Log({Message: 'KnowledgeForm.DeleteKnowledge>>' + ex.message, Notify: true});
        }
    };
    
    //Handlers
    ActiveHandler() {
        try {

            //Handle ActiveWindow state
            let _ActiveWindow = false;
            if (!global.GlobalModalActive) {
                _ActiveWindow = true;
            }

            //Handle ActiveWindow change
            if (_ActiveWindow !== Global.State[this.props.ModelID].ActiveWindow) {
                Global.State[this.props.ModelID].ActiveWindow = _ActiveWindow;
                this.forceUpdate();
            }

        } catch (ex) {
            global.Log({Message: 'KnowledgeForm.ActiveHandler>>' + ex.message});
        }
    };
    BackHandler() {
        try {
            this.Hide();
        } catch (ex) {
            global.Log({Message: 'KnowledgeForm.BackHandler>>' + ex.message});
        }
    };
    KeyboardHandler(action, keyboardheight) {
        try {
            //Do Nothing
        } catch (ex) {
            global.Log({Message: 'KnowledgeForm.KeyboardHandler>>' + ex.message});
        }
    };
    ShortcutHandler(Shortcut_Value) {
        try {
            //Do Nothing
        } catch (ex) {
            global.Log({Message: 'KnowledgeForm.ShortcutHandler>>' + ex.message});
        }
    };

    Hide() {
        try {
            Animated.timing(Global.State[this.props.ModelID].ViewOffset, { duration: 200, toValue: Global.State[this.props.ModelID].ViewWidth, useNativeDriver: Global.NativeAnimationDriver}).start(() => {
                Global.State[this.props.ModelID] = null;
                global.root.ActiveHandler();
                this.forceUpdate();
            });
        } catch (ex) {
            global.Log({Message: 'KnowledgeForm.Hide>>' + ex.message});
        }
    };
    ClearFocus() {
        try {
            if (Platform.OS === 'macos') {
                this.Titlebar.focus();
                this.Titlebar.blur();
            } else {
                Keyboard.dismiss();
            }
        } catch (ex) {
            global.Log({Message: 'KnowledgeForm.ClearFocus>>' + ex.message, Notify: true});
        }
    };

    render() {
        try {
            if (this.IsActive()) {
                return (
                    <View style={{position: 'absolute', top: 0, right: 0, bottom: 0, left: 0}}>
                        <Animated.View style={{position: 'absolute', top: 0, bottom: 0, right: 0, width: Global.State[this.props.ModelID].ViewWidth, backgroundColor: 'transparent', transform: [{translateX: Global.State[this.props.ModelID].ViewOffset}]}}>
                            <View style={{position: 'absolute', top: 0, right: 0, bottom: 0, backgroundColor: Global.Theme.Header.BackgroundColor, width: Global.State[this.props.ModelID].ViewWidth}}>
                                {this.renderHeader()}
                                <View style={{flex: 1}}>
                                    {this.renderBody()}
                                    {this.renderFooter()}
                                    {this.renderSwipeBack()}
                                </View>
                            </View>
                        </Animated.View>
                    </View>
                );
            } else {
                return (<View></View>);
            }
        } catch (ex) {
            global.Log({Message: 'KnowledgeForm.render>>' + ex.message});
        }
    };
    renderHeader() {
        try {
            return (
                <Pressable style={{paddingTop: Global.InsetTop}} onPress={() => { this.ClearFocus() }}>
                    <View ref={ele => this.Titlebar = ele} style={{ height: 70, flexDirection:'row', padding: 10, enableFocusRing: false}}>
                        <Pressable
                            onPress={() => {
                                if (Global.State[this.props.ModelID].KnowledgeDirty) {
                                    global.root.ConfirmModal.Show('Just Checking...', 'You have unsaved changes, close anyway?', 'Yes', 'No', () => {
                                        this.Hide();
                                    }, () => {
                                        //Cancel - Do Nothing
                                    });
                                } else {
                                    this.Hide();
                                }
                            }}
                            style={({pressed}) => [{width: 50, height: 50, alignItems: 'center', justifyContent: 'center', opacity: pressed ? .5 : 1}]}
                        >
                            <Image source={global.ColorScheme === 'dark' ? IMG_Back_eeeeee : IMG_Back_121212} style={{width: 24, height: 24}} />
                        </Pressable>
                        <View style={{flex: 1, justifyContent: 'center'}}>
                            <Text style={{fontSize: 20, fontWeight: 'bold', color: global.ColorScheme === 'dark' ? '#eeeeee' : '#121212'}}>{Global.State[this.props.ModelID].PageTitle}</Text>
                        </View>
                        <Pressable
                            onPress={() => this.DeleteKnowledge()}
                            style={({pressed}) => [{width: 50, height: 50, alignItems: 'center', justifyContent: 'center', opacity: pressed ? .5 : 1}]}
                        >
                            <Image source={global.ColorScheme === 'dark' ? IMG_Trash_eeeeee : IMG_Trash_121212} style={{width: 24, height: 24}} />
                        </Pressable>
                    </View>
                </Pressable>
            );
        } catch (ex) {
            global.Log({Message: 'KnowledgeForm.renderHeader>>' + ex.message});
        }
    };
    renderBody() {
        try {
            return (
                <ScrollView style={{flex: 1, backgroundColor: Global.Theme.Body.BackgroundColor}}
                refreshControl={
                    <RefreshControl refreshing={this.state.Refreshing} onRefresh={async () => {
                        try {
                            this.setState({Refreshing: true});
                            Global.State[this.props.ModelID].Knowledge = await KnowledgeHelper.GetOne({ KnowledgeID: Global.State[this.props.ModelID].Knowledge.KnowledgeID });
                            this.setState({Refreshing: false});
                        } catch (ex) {
                            global.Log({Message: 'KnowledgeForm.renderBody.RefreshControl>>' + ex.message, Notify: true});
                        }
                    }} />
                }>

                    {/* Knowledge Details */}
                    <View style={{flex: 1, padding: 10}}>

                        {/* Knowledge ID */}
                        <InputControl
                            Name={'ID'}
                            Value={Global.State[this.props.ModelID].Knowledge.KnowledgeID}
                            Changed={(Text_Value) => {
                                Global.State[this.props.ModelID].Knowledge.KnowledgeID = Text_Value;
                                this.CheckDirty();
                            }}
                            MarginTop={10}
                            Editable={Global.State[this.props.ModelID].ActiveWindow}
                            Enabled={Global.State[this.props.ModelID].PageTitle === 'NEW KNOWLEDGE'}
                        />

                        {/* Knowledge Question */}
                        <InputControl
                            Name={'Question'}
                            Value={Global.State[this.props.ModelID].Knowledge.KnowledgeQuestion}
                            Changed={(Text_Value) => {
                                Global.State[this.props.ModelID].Knowledge.KnowledgeQuestion = Text_Value;
                                this.CheckDirty();
                            }}
                            MarginTop={10}
                            Multiline={true}
                            Editable={Global.State[this.props.ModelID].ActiveWindow}
                            Enabled={true}
                        />

                        {/* Knowledge Answer */}
                        <InputControl
                            Name={'Answer'}
                            Value={Global.State[this.props.ModelID].Knowledge.KnowledgeAnswer}
                            Changed={(Text_Value) => {
                                Global.State[this.props.ModelID].Knowledge.KnowledgeAnswer = Text_Value;
                                this.CheckDirty();
                            }}
                            MarginTop={10}
                            Multiline={true}
                            Editable={Global.State[this.props.ModelID].ActiveWindow}
                            Enabled={true}
                        />                        

                        {/* Knowledge Created */}
                        <InputControl
                            Name={'Created'}
                            Value={Global.State[this.props.ModelID].Knowledge.KnowledgeCreated}
                            MarginTop={10}
                            Editable={false}
                            Enabled={false}
                        />

                        {/* Knowledge Updated */}
                        <InputControl
                            Name={'Updated'}
                            Value={Global.State[this.props.ModelID].Knowledge.KnowledgeUpdated}
                            MarginTop={10}
                            Editable={false}
                            Enabled={false}
                        />                        

                    </View>

                    {/* Bottom Padding */}
                    <View style={{height: Global.InsetBottom + 20}}></View>
                    <View style={{height: Global.State[this.props.ModelID].ScrollPadding}}></View>
                    <Animated.View key={'Footer_Padding'} style={{position: 'relative', backgroundColor: 'transparent', height: Global.State[this.props.ModelID].FooterPadding}}>
                    </Animated.View>

                </ScrollView>
            );
        } catch (ex) {
            global.Log({Message: 'KnowledgeForm.renderBody>>' + ex.message});
        }
    };
    renderFooter() {
        try {
            return (
                <Animated.View key={'Footer_Row'} style={[Styles.v3_footer_container, {bottom: Global.State[this.props.ModelID].FooterOffset}]}>
                    <View style={{position: 'absolute', top: 0, left: 10, right: 10, height: 60, backgroundColor: Global.Theme.Footer.BackgroundColor, borderRadius: 6, opacity: .5}}></View>
                    <Pressable style={({pressed}) => [{width: 150, height: 40, marginLeft: 10, backgroundColor: '#c06e6e', opacity: pressed ? .7 : 1, borderRadius: 4, alignItems: 'center', justifyContent: 'center'}]} onPress={() => this.CancelKnowledge() }>
                        <Text style={{fontWeight: 'bold', color: Global.Theme.Highlight.ForegroundColor}}>Cancel</Text>
                    </Pressable>
                    <View style={{flex: 1}}></View>
                    <Pressable style={({pressed}) => [{width: 150, height: 40, marginRight: 10, backgroundColor: Global.Theme.Highlight.BackgroundColor, opacity: pressed ? .7 : 1, borderRadius: 4, alignItems: 'center', justifyContent: 'center'}]} onPress={() => this.SaveKnowledge() }>
                        <Text style={{fontWeight: 'bold', color: Global.Theme.Highlight.ForegroundColor}}>Save</Text>
                    </Pressable>
                </Animated.View>
            );
        } catch (ex) {
            global.Log({Message: 'KnowledgeForm.renderFooter>>' + ex.message, Notify: true});
        }
    };
    renderSwipeBack() {
        try {
            if (Platform.OS === 'ios') {
                return (
                    <View style={{position: 'absolute', top: 0, left: 0, bottom: 0, width: 15, backgroundColor: 'transparent', marginTop: 0}} onStartShouldSetResponder={() => true}
                        onResponderMove={(event) => {
                            let _Move = parseInt(event.nativeEvent.locationX);
                            if (_Move > 0 && _Move > parseInt(Global.ScreenX / 3)) {
                                Animated.timing(Global.State[this.props.ModelID].ViewOffset, {duration: 200, toValue: event.nativeEvent.locationX, useNativeDriver: Global.NativeAnimationDriver}).start();
                            }
                        }} onResponderRelease={(event) => {
                            if (event.nativeEvent.locationX > parseInt(Global.ScreenX / 3)) {
                                this.Hide();
                            } else {
                                Animated.timing(Global.State[this.props.ModelID].ViewOffset, {duration: 0, toValue: 0, useNativeDriver: Global.NativeAnimationDriver}).start();
                            }
                        }}
                    ></View>
                )
            }
        } catch (ex) {
            global.Log({Message: 'KnowledgeForm.renderSwipeBack>>' + ex.message});
        }
    };
};