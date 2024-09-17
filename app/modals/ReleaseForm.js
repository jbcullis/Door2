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
    TurboModuleRegistry,
    NativeModules,
} from 'react-native';
import ElementControl from '../controls/ElementControl.js';
module.exports = class ReleaseForm extends Component {
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
            global.Log({Message: 'ReleaseForm.IsActive>>' + ex.message});
        }
    };
    async Show(Params_Value) {
        try {
            global.root.NotificationModal.Show({ NotificationTitle: 'Loading...', NotificationStyle: 'Wait' });

            let _ViewWidth = Global.ScreenX > 600 ? 600 : Global.ScreenX;

            let _Release = (Params_Value.ReleaseID !== null ? await ReleaseHelper.GetOne({ReleaseID: Params_Value.ReleaseID}) : null);

            //Create new release if null
            if (_Release === null) {
                _Release = { ReleaseStatus: 'development' };
            }

            //Create State
            Global.State[this.props.ModelID] = {
                PageTitle: _Release.ReleaseID?.length > 0 ? 'EDIT RELEASE' : 'NEW RELEASE',
                Release: ReleaseHelper.Clone(_Release),
                ReleaseSnapshot: ReleaseHelper.Clone(_Release),
                ReleaseDirty: false,
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
            global.Log({Message: 'ReleaseForm.Show>>' + ex.message, Notify: true});
        }
    };
    CheckDirty() {
        try {
            let _ReleaseDirty = (JSON.stringify(Global.State[this.props.ModelID].ReleaseSnapshot).trim() !== JSON.stringify(Global.State[this.props.ModelID].Release).trim());
            if (_ReleaseDirty !== Global.State[this.props.ModelID].ReleaseDirty) {
                Global.State[this.props.ModelID].ReleaseDirty = _ReleaseDirty;
                if (Global.State[this.props.ModelID] !== null && Global.State[this.props.ModelID].FooterOffset !== null) {
                    if (Global.State[this.props.ModelID].ReleaseDirty) {
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
            global.Log({Message: 'ReleaseForm.CheckDirty>>' + ex.message, Notify: true});
        }
    };
    SaveRelease() {
        try {
            this.ClearFocus();
            setTimeout(async () => {
                try {

                    await global.root.NotificationModal.Show({ NotificationTitle: 'Saving...', NotificationStyle: 'Wait' });
                    let _Release = ReleaseHelper.Clone(Global.State[this.props.ModelID].Release);

                    //Save the release
                    _Release = await ReleaseHelper.Save(_Release);
                    if (_Release !== null) {
                        Global.State[this.props.ModelID].Release = ReleaseHelper.Clone(_Release);
                        Global.State[this.props.ModelID].ReleaseSnapshot = ReleaseHelper.Clone(_Release);
                    }

                    //Run callback
                    if (Global.State[this.props.ModelID].SaveCallback !== null) {
                        Global.State[this.props.ModelID].SaveCallback(ReleaseHelper.Clone(Global.State[this.props.ModelID].Release));
                    }

                    this.CheckDirty();
                    global.root.NotificationModal.Hide();

                } catch (ex) {
                    global.Log({Message: 'ReleaseForm.SaveRelease>>' + ex.message, Notify: true});
                }
            }, Platform.OS === 'macos' || Platform.OS === 'windows' ? 50 : 1);
        } catch (ex) {
            global.Log({Message: 'ReleaseForm.SaveRelease>>' + ex.message, Notify: true});
        }
    };
    CancelRelease() {
        try {
            this.ClearFocus();
            setTimeout(async () => {
                try {
                    Global.State[this.props.ModelID].Release = ReleaseHelper.Clone(Global.State[this.props.ModelID].ReleaseSnapshot);
                    this.CheckDirty();
                } catch (ex) {
                    global.Log({Message: 'ReleaseForm.CancelRelease>>' + ex.message, Notify: true});
                }
            }, Platform.OS === 'macos' || Platform.OS === 'windows' ? 50 : 1);
        } catch (ex) {
            global.Log({Message: 'ReleaseForm.CancelRelease>>' + ex.message, Notify: true});
        }
    };
    DeleteRelease() {
        try {
            this.ClearFocus();
            global.root.ConfirmModal.Show('Just Checking...', 'Are you sure you want to delete this release?', 'Yes', 'No', async () => {
                try {
                    if (Global.State[this.props.ModelID].Release !== null
                    && Global.State[this.props.ModelID].Release.ReleaseID !== null) {
                        await global.root.NotificationModal.Show({ NotificationTitle: 'Deleting...', NotificationStyle: 'Wait' });
                        await ReleaseHelper.Delete({ReleaseID: Global.State[this.props.ModelID].Release.ReleaseID});
                        if (Global.State[this.props.ModelID].DeleteCallback !== null) {
                            Global.State[this.props.ModelID].DeleteCallback(Global.State[this.props.ModelID].Release.ReleaseID);
                        }
                        global.root.NotificationModal.Hide();
                        this.Hide();
                    } else {
                        this.Hide();
                    }
                } catch (ex) {
                    global.Log({Message: 'ReleaseForm.DeleteRelease>>' + ex.message, Notify: true});
                }
            }, () => {
                //Cancel - Do Nothing
            });
        } catch (ex) {
            global.Log({Message: 'ReleaseForm.DeleteRelease>>' + ex.message, Notify: true});
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
            global.Log({Message: 'ReleaseForm.ActiveHandler>>' + ex.message});
        }
    };
    BackHandler() {
        try {
            this.Hide();
        } catch (ex) {
            global.Log({Message: 'ReleaseForm.BackHandler>>' + ex.message});
        }
    };
    KeyboardHandler(action, keyboardheight) {
        try {
            //Do Nothing
        } catch (ex) {
            global.Log({Message: 'ReleaseForm.KeyboardHandler>>' + ex.message});
        }
    };
    ShortcutHandler(Shortcut_Value) {
        try {
            //Do Nothing
        } catch (ex) {
            global.Log({Message: 'ReleaseForm.ShortcutHandler>>' + ex.message});
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
            global.Log({Message: 'ReleaseForm.Hide>>' + ex.message});
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
            global.Log({Message: 'ReleaseForm.ClearFocus>>' + ex.message, Notify: true});
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
            global.Log({Message: 'ReleaseForm.render>>' + ex.message});
        }
    };
    renderHeader() {
        try {
            return (
                <Pressable style={{paddingTop: Global.InsetTop}} onPress={() => { this.ClearFocus() }}>
                    <View ref={ele => this.Titlebar = ele} style={{ height: 70, flexDirection:'row', padding: 10, enableFocusRing: false}}>
                        <Pressable
                            onPress={() => {
                                if (Global.State[this.props.ModelID].ReleaseDirty) {
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
                            <Text style={{fontSize: 20, fontWeight: 'bold', color: Global.Theme.Header.ForegroundColor}}>{Global.State[this.props.ModelID].PageTitle}</Text>
                        </View>
                        <Pressable
                            onPress={() => this.DeleteRelease()}
                            style={({pressed}) => [{width: 50, height: 50, alignItems: 'center', justifyContent: 'center', opacity: pressed ? .5 : 1}]}
                        >
                            <Image source={global.ColorScheme === 'dark' ? IMG_Trash_eeeeee : IMG_Trash_121212} style={{width: 24, height: 24}} />
                        </Pressable>
                    </View>
                </Pressable>
            );
        } catch (ex) {
            global.Log({Message: 'ReleaseForm.renderHeader>>' + ex.message});
        }
    };
    renderBody() {
        try {

            //Copy ID
            let _CopyUI = null;
            if (Global.State[this.props.ModelID].PageTitle === 'EDIT RELEASE') {
                _CopyUI = (
                    <Pressable
                        onPress={async () => {
                            try {
                                if (Platform.OS === 'windows' || Platform.OS === 'macos') {
                                    await TurboModuleRegistry.get('RNClipboard').SetString(Global.State[this.props.ModelID].Release.ReleaseID);
                                } else {
                                    await NativeModules.RNClipboard.setString(Global.State[this.props.ModelID].Release.ReleaseID);
                                }
                                global.root.NotificationModal.Show({ NotificationTitle: 'Copied!', NotificationStyle: 'Toast' });
                                global.root.NotificationModal.Show({ NotificationTitle: 'Copied!', NotificationStyle: 'Toast' });
                            } catch (ex) {
                                global.Log({Message: 'ReleaseForm.renderBody.CopyID>>' + ex.message, Notify: true});
                            }
                        }}
                        style={({pressed}) => [{width: 50, height: 50, marginTop: 4, alignItems: 'center', justifyContent: 'center', opacity: pressed ? .7 : 1}]}
                    >
                        <Image source={global.ColorScheme === 'dark' ? IMG_Copy_eeeeee : IMG_Copy_121212} style={{width: 24, height: 24}} />
                    </Pressable>
                )
            }

            //Created Date
            let _CreatedDescription = null;
            if (Global.State[this.props.ModelID].Release.ReleaseCreated !== null) {
                let _CreatedDate = new Date(Global.State[this.props.ModelID].Release.ReleaseCreated);
                _CreatedDescription = Global.FormatShortDate(_CreatedDate.getFullYear(), _CreatedDate.getMonth() + 1, _CreatedDate.getDate());
                if (_CreatedDate.getHours() < 12) {
                    _CreatedDescription += ' ' + parseInt(_CreatedDate.getHours() + 12).toString() + ':' + _CreatedDate.getMinutes() + ':' + _CreatedDate.getSeconds() + 'AM';
                } else if (_CreatedDate.getHours() >= 12) {
                    _CreatedDescription += ' ' + parseInt(_CreatedDate.getHours() - 12).toString() + ':' + _CreatedDate.getMinutes() + ':' + _CreatedDate.getSeconds() + 'PM';
                }
            }

            //Updated Date
            let _UpdatedDescription = null;
            if (Global.State[this.props.ModelID].Release.ReleaseUpdated !== null) {
                let _UpdatedDate = new Date(Global.State[this.props.ModelID].Release.ReleaseUpdated);
                _UpdatedDescription = Global.FormatShortDate(_UpdatedDate.getFullYear(), _UpdatedDate.getMonth() + 1, _UpdatedDate.getDate());
                if (_UpdatedDate.getHours() < 12) {
                    _UpdatedDescription += ' ' + parseInt(_UpdatedDate.getHours() + 12).toString() + ':' + _UpdatedDate.getMinutes() + ':' + _UpdatedDate.getSeconds() + 'AM';
                } else if (_UpdatedDate.getHours() >= 12) {
                    _UpdatedDescription += ' ' + parseInt(_UpdatedDate.getHours() - 12).toString() + ':' + _UpdatedDate.getMinutes() + ':' + _UpdatedDate.getSeconds() + 'PM';
                }
            }

            return (
                <ScrollView style={{flex: 1, backgroundColor: Global.Theme.Body.BackgroundColor}}
                refreshControl={
                    <RefreshControl refreshing={this.state.Refreshing} onRefresh={async () => {
                        try {
                            this.setState({Refreshing: true});
                            Global.State[this.props.ModelID].Release = await ReleaseHelper.GetOne({ReleaseID: Global.State[this.props.ModelID].Release.ReleaseID});
                            this.setState({Refreshing: false});
                        } catch (ex) {
                            global.Log({Message: 'ReleaseForm.renderBody.RefreshControl>>' + ex.message, Notify: true});
                        }
                    }} />
                }>

                    {/* Release Details */}
                    <View style={{flex: 1, padding: 10}}>

                        {/* Release ID */}
                        <View style={{flex: 1, flexDirection: 'row'}}>
                            <ElementControl
                                Name={'ID'}
                                Value={Global.State[this.props.ModelID].Release.ReleaseID}
                                Changed={(Text_Value) => {
                                    Global.State[this.props.ModelID].Release.ReleaseID = Text_Value;
                                    this.CheckDirty();
                                }}
                                Casing={'upper'}
                                Editable={Global.State[this.props.ModelID].ActiveWindow}
                                Enabled={Global.State[this.props.ModelID].PageTitle === 'NEW RELEASE'}
                            />
                            {_CopyUI}
                        </View>

                        <ElementControl
                            Name={'Status'}
                            Value={Global.State[this.props.ModelID].Release.ReleaseStatus}
                            Pressed={() => {
                                global.root.PickerModal.Show([
                                    {Text: 'Development', Value: 'development'},
                                    {Text: 'Production', Value: 'production'},
                                ], false, (Selected_Value) => {                                    
                                    Global.State[this.props.ModelID].Release.ReleaseStatus = Selected_Value;
                                    this.CheckDirty();
                                });
                            }}
                            MarginTop={10}
                            Editable={Global.State[this.props.ModelID].ActiveWindow}
                            Enabled={true}
                            Visible={true}
                        />

                        <View style={{flexDirection: 'row', marginTop: 10}}>
                            <ElementControl
                                Name={'Created'}
                                Value={_CreatedDescription}
                                MarginTop={10}
                                Editable={false}
                                Enabled={false}
                                Visible={true}
                            />
                            <View style={{width: 10}}></View>
                            <ElementControl
                                Name={'Updated'}
                                Value={_UpdatedDescription}
                                MarginTop={10}
                                Editable={false}
                                Enabled={false}
                                Visible={true}
                            />
                        </View>                       

                    </View>

                    {/* Bottom Padding */}
                    <View style={{height: Global.InsetBottom + 20}}></View>
                    <View style={{height: Global.State[this.props.ModelID].ScrollPadding}}></View>
                    <Animated.View key={'Footer_Padding'} style={{position: 'relative', backgroundColor: 'transparent', height: Global.State[this.props.ModelID].FooterPadding}}>
                    </Animated.View>

                </ScrollView>
            );

        } catch (ex) {
            global.Log({Message: 'ReleaseForm.renderBody>>' + ex.message});
        }
    };
    renderFooter() {
        try {
            return (
                <Animated.View key={'Footer_Row'} style={[Styles.v3_footer_container, {bottom: Global.State[this.props.ModelID].FooterOffset}]}>
                    <View style={{position: 'absolute', top: 0, left: 10, right: 10, height: 60, backgroundColor: Global.Theme.Footer.BackgroundColor, borderRadius: 4, opacity: .5}}></View>
                    <Pressable style={({pressed}) => [{width: 150, height: 40, marginLeft: 10, backgroundColor: '#c06e6e', opacity: pressed ? .7 : 1, borderRadius: 4, alignItems: 'center', justifyContent: 'center'}]} onPress={() => this.CancelRelease() }>
                        <Text style={{fontWeight: 'bold', color: Global.Theme.Highlight.ForegroundColor}}>Cancel</Text>
                    </Pressable>
                    <View style={{flex: 1}}></View>
                    <Pressable style={({pressed}) => [{width: 150, height: 40, marginRight: 10, backgroundColor: Global.Theme.Highlight.BackgroundColor, opacity: pressed ? .7 : 1, borderRadius: 4, alignItems: 'center', justifyContent: 'center'}]} onPress={() => this.SaveRelease(false) }>
                        <Text style={{fontWeight: 'bold', color: Global.Theme.Highlight.ForegroundColor}}>Save</Text>
                    </Pressable>
                </Animated.View>
            );
        } catch (ex) {
            global.Log({Message: 'ReleaseForm.renderFooter>>' + ex.message, Notify: true});
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
            global.Log({Message: 'ReleaseForm.renderSwipeBack>>' + ex.message});
        }
    };
};