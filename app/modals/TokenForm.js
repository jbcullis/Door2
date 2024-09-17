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
import InputControl from '../controls/InputControl.js';
module.exports = class TokenForm extends Component {
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
            global.Log({Message: 'TokenForm.IsActive>>' + ex.message});
        }
    };
    async Show(Params_Value) {
        try {
            global.root.NotificationModal.Show({ NotificationTitle: 'Loading...', NotificationStyle: 'Wait' });

            let _ViewWidth = Global.ScreenX > 600 ? 600 : Global.ScreenX;

            let _Token = await TokenHelper.GetOne({TokenID: Params_Value.TokenID});

            let _Account = null;
            if (_Token.TokenAccountID?.length > 0) {
                _Account = await AccountHelper.GetOne({AccountID: _Token.TokenAccountID});
            }

            let _Person = null;
            if (_Token.TokenPersonID?.length > 0) {
                _Person = await PersonHelper.GetOne({PersonID: _Token.TokenPersonID});
            }
            
            let _PersonDevice = null;
            if (_Token.TokenPersonID?.length > 0
            && _Token.TokenDeviceID?.length > 0) {
                _PersonDevice = await PersonDeviceHelper.GetOne({ 
                    PersonID: _Token.TokenPersonID,
                    PersonDeviceID: _Token.TokenDeviceID,
                });
            }

            //Create State
            Global.State[this.props.ModelID] = {
                PageTitle: _Token !== null ? 'EDIT TOKEN' : 'NEW TOKEN',
                Token: TokenHelper.Clone(_Token),
                TokenSnapshot: TokenHelper.Clone(_Token),
                TokenDirty: false,
                Account: _Account,
                Person: _Person,
                PersonDevice: _PersonDevice,
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
            global.Log({Message: 'TokenForm.Show>>' + ex.message, Notify: true});
        }
    };
    CheckDirty() {
        try {
            let _TokenDirty = (JSON.stringify(Global.State[this.props.ModelID].TokenSnapshot).trim() !== JSON.stringify(Global.State[this.props.ModelID].Token).trim());
            if (_TokenDirty !== Global.State[this.props.ModelID].TokenDirty) {
                Global.State[this.props.ModelID].TokenDirty = _TokenDirty;
                if (Global.State[this.props.ModelID] !== null && Global.State[this.props.ModelID].FooterOffset !== null) {
                    if (Global.State[this.props.ModelID].TokenDirty) {
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
            global.Log({Message: 'TokenForm.CheckDirty>>' + ex.message, Notify: true});
        }
    };
    SaveToken() {
        try {
            this.ClearFocus();
            setTimeout(async () => {
                try {

                    await global.root.NotificationModal.Show({ NotificationTitle: 'Saving...', NotificationStyle: 'Wait' });
                    let _Token = TokenHelper.Clone(Global.State[this.props.ModelID].Token);

                    //Save the token
                    _Token = await TokenHelper.Save(_Token);
                    if (_Token !== null) {
                        Global.State[this.props.ModelID].Token = TokenHelper.Clone(_Token);
                        Global.State[this.props.ModelID].TokenSnapshot = TokenHelper.Clone(_Token);
                    }

                    //Run callback
                    if (Global.State[this.props.ModelID].SaveCallback !== null) {
                        Global.State[this.props.ModelID].SaveCallback(TokenHelper.Clone(Global.State[this.props.ModelID].Token));
                    }

                    this.CheckDirty();
                    global.root.NotificationModal.Hide();

                } catch (ex) {
                    global.Log({Message: 'TokenForm.SaveToken>>' + ex.message, Notify: true});
                }
            }, Platform.OS === 'macos' || Platform.OS === 'windows' ? 50 : 1);
        } catch (ex) {
            global.Log({Message: 'TokenForm.SaveToken>>' + ex.message, Notify: true});
        }
    };
    CancelToken() {
        try {
            this.ClearFocus();
            setTimeout(async () => {
                try {
                    Global.State[this.props.ModelID].Token = TokenHelper.Clone(Global.State[this.props.ModelID].TokenSnapshot);
                    this.CheckDirty();
                } catch (ex) {
                    global.Log({Message: 'TokenForm.CancelToken>>' + ex.message, Notify: true});
                }
            }, Platform.OS === 'macos' || Platform.OS === 'windows' ? 50 : 1);
        } catch (ex) {
            global.Log({Message: 'TokenForm.CancelToken>>' + ex.message, Notify: true});
        }
    };
    DeleteToken() {
        try {
            this.ClearFocus();
            global.root.ConfirmModal.Show('Just Checking...', 'Are you sure you want to delete this token?', 'Yes', 'No', async () => {
                try {
                    if (Global.State[this.props.ModelID].Token !== null
                    && Global.State[this.props.ModelID].Token.TokenID !== null) {
                        await global.root.NotificationModal.Show({ NotificationTitle: 'Deleting...', NotificationStyle: 'Wait' });
                        await TokenHelper.Delete({TokenID: Global.State[this.props.ModelID].Token.TokenID});
                        if (Global.State[this.props.ModelID].DeleteCallback !== null) {
                            Global.State[this.props.ModelID].DeleteCallback(Global.State[this.props.ModelID].Token);
                        }
                        global.root.NotificationModal.Hide();
                        this.Hide();
                    } else {
                        this.Hide();
                    }
                } catch (ex) {
                    global.Log({Message: 'TokenForm.DeleteToken>>' + ex.message, Notify: true});
                }
            }, () => {
                //Cancel - Do Nothing
            });
        } catch (ex) {
            global.Log({Message: 'TokenForm.DeleteToken>>' + ex.message, Notify: true});
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
            global.Log({Message: 'TokenForm.ActiveHandler>>' + ex.message});
        }
    };
    BackHandler() {
        try {
            this.Hide();
        } catch (ex) {
            global.Log({Message: 'TokenForm.BackHandler>>' + ex.message});
        }
    };
    KeyboardHandler(action, keyboardheight) {
        try {
            //Do Nothing
        } catch (ex) {
            global.Log({Message: 'TokenForm.KeyboardHandler>>' + ex.message});
        }
    };
    ShortcutHandler(Shortcut_Value) {
        try {
            //Do Nothing
        } catch (ex) {
            global.Log({Message: 'TokenForm.ShortcutHandler>>' + ex.message});
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
            global.Log({Message: 'TokenForm.Hide>>' + ex.message});
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
            global.Log({Message: 'TokenForm.ClearFocus>>' + ex.message, Notify: true});
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
            global.Log({Message: 'TokenForm.render>>' + ex.message});
        }
    };
    renderHeader() {
        try {
            return (
                <Pressable style={{paddingTop: Global.InsetTop}} onPress={() => { this.ClearFocus() }}>
                    <View ref={ele => this.Titlebar = ele} style={{ height: 70, flexDirection:'row', padding: 10, enableFocusRing: false}}>
                        <Pressable
                            onPress={() => {
                                if (Global.State[this.props.ModelID].TokenDirty) {
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
                            onPress={() => this.DeleteToken()}
                            style={({pressed}) => [{width: 50, height: 50, alignItems: 'center', justifyContent: 'center', opacity: pressed ? .5 : 1}]}
                        >
                            <Image source={Global.Theme.Header.Icons.Trash} style={{width: 24, height: 24}} />
                        </Pressable>
                    </View>
                </Pressable>
            );
        } catch (ex) {
            global.Log({Message: 'TokenForm.renderHeader>>' + ex.message});
        }
    };
    renderBody() {
        try {

            //Copy Token ID
            let _CopyTokenID = null;
            if (Global.State[this.props.ModelID].PageTitle === 'EDIT TOKEN') {
                _CopyTokenID = (
                    <Pressable
                        onPress={async () => {
                            try {
                                await TurboModuleRegistry.get('RNClipboard').SetString(Global.State[this.props.ModelID].Token.TokenID);
                            } catch (ex) {
                                global.Log({Message: 'TokenForm.renderBody.CopyID>>' + ex.message, Notify: true});
                            }
                            global.root.NotificationModal.Show({ NotificationTitle: 'Copied!', NotificationStyle: 'Toast' });
                        }}
                        style={({pressed}) => [{width: 50, height: 50, alignItems: 'center', justifyContent: 'center', opacity: pressed ? .5 : 1}]}
                    >
                        <Image source={Global.Theme.Body.Icons.Copy} style={{width: 24, height: 24}} />
                    </Pressable>
                );
            }

            //Copy Token Device ID
            let _CopyTokenDeviceID = null;
            if (Global.State[this.props.ModelID].Token.TokenDeviceID?.length > 0) {
                _CopyTokenDeviceID = (
                    <Pressable
                        onPress={async () => {
                            try {
                                if (Platform.OS === 'windows' || Platform.OS === 'macos') {
                                    await TurboModuleRegistry.get('RNClipboard').SetString(Global.State[this.props.ModelID].Token.TokenDeviceID);
                                } else {
                                    await NativeModules.RNClipboard.setString(Global.State[this.props.ModelID].Token.TokenDeviceID);
                                }
                                global.root.NotificationModal.Show({ NotificationTitle: 'Copied!', NotificationStyle: 'Toast' });
                            } catch (ex) {
                                global.Log({Message: 'TokenForm.renderBody.CopyID>>' + ex.message, Notify: true});
                            }
                        }}
                        style={({pressed}) => [{width: 50, height: 50, alignItems: 'center', justifyContent: 'center', opacity: pressed ? .5 : 1}]}
                    >
                        <Image source={Global.Theme.Body.Icons.Copy} style={{width: 24, height: 24}} />
                    </Pressable>
                );
            }


            return (
                <ScrollView style={{flex: 1, backgroundColor: Global.Theme.Body.BackgroundColor}}
                refreshControl={
                    <RefreshControl refreshing={this.state.Refreshing} onRefresh={async () => {
                        try {
                            this.setState({Refreshing: true});
                            Global.State[this.props.ModelID].Token = await TokenHelper.GetOne({TokenID: Global.State[this.props.ModelID].Token.TokenID});
                            this.setState({Refreshing: false});
                        } catch (ex) {
                            global.Log({Message: 'TokenForm.renderBody.RefreshControl>>' + ex.message, Notify: true});
                        }
                    }} />
                }>

                    {/* Token Details */}
                    <View style={{flex: 1, padding: 10}}>

                        {/* Token ID */}
                        <View style={{flexDirection: 'row'}}>
                            <InputControl
                                Name={'ID'}
                                Value={Global.State[this.props.ModelID].Token.TokenID}
                                Changed={(Text_Value) => {
                                    Global.State[this.props.ModelID].Token.TokenID = Text_Value;
                                    this.CheckDirty();
                                }}
                                Editable={Global.State[this.props.ModelID].ActiveWindow}
                                Enabled={Global.State[this.props.ModelID].PageTitle === 'NEW TOKEN'}
                            />
                            {_CopyTokenID}
                        </View>
                        
                        <InputControl
                            Name={'AccountID'}
                            Value={Global.State[this.props.ModelID].Account !== null ? Global.State[this.props.ModelID].Account.AccountName : Global.State[this.props.ModelID].Token.TokenAccountID}
                            MarginTop={10}
                            Editable={false}
                            Enabled={false}
                        />

                        <InputControl
                            Name={'PersonID'}
                            Value={Global.State[this.props.ModelID].Person !== null ? Global.State[this.props.ModelID].Person.PersonName : Global.State[this.props.ModelID].Token.TokenPersonID}
                            MarginTop={10}
                            Editable={false}
                            Enabled={false}
                        />

                        <View style={{flexDirection: 'row'}}>                            
                            <InputControl
                                Name={'Device'}
                                Value={Global.State[this.props.ModelID].PersonDevice ? Global.State[this.props.ModelID].PersonDevice.PersonDeviceName : ''}
                                MarginTop={10}
                                Editable={false}
                                Enabled={false}
                            />
                            {_CopyTokenDeviceID}
                        </View>

                        <View style={{flexDirection: 'row', marginTop: 10}}>                            
                            <InputControl
                                Name={'Created'}
                                Value={Global.State[this.props.ModelID].Token.TokenCreated}
                                Editable={false}
                                Enabled={false}
                            />
                            <View style={{width: 10}}></View>
                            <InputControl
                                Name={'Expires'}
                                Value={Global.State[this.props.ModelID].Token.TokenExpires}
                                Editable={false}
                                Enabled={false}
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
            global.Log({Message: 'TokenForm.renderBody>>' + ex.message});
        }
    };
    renderFooter() {
        try {
            return (
                <Animated.View key={'Footer_Row'} style={[Styles.v3_footer_container, {bottom: Global.State[this.props.ModelID].FooterOffset}]}>
                    <View style={{position: 'absolute', top: 0, left: 0, right: 0, bottom: 0, backgroundColor: '#262626', opacity: .4}}></View>
                    <Pressable style={[Styles.form_delete_button, {width: 150}]} onPress={() => this.CancelToken() }>
                        <Text style={Styles.form_button_text}>Cancel</Text>
                    </Pressable>
                    <View style={{flex: 1}}></View>
                    <Pressable style={[Styles.form_button, {width: 150}]} onPress={() => this.SaveToken(false) }>
                        <Text style={Styles.form_button_text}>Save</Text>
                    </Pressable>
                </Animated.View>
            );
        } catch (ex) {
            global.Log({Message: 'TokenForm.renderFooter>>' + ex.message, Notify: true});
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
            global.Log({Message: 'TokenForm.renderSwipeBack>>' + ex.message});
        }
    };
};