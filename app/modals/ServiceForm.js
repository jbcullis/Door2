import React, { Component } from 'react';
import {
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
module.exports = class ServiceForm extends Component {
    constructor(props) {
        super(props);
        this.Titlebar = null;
        this.SchemaForm = null;
        this.TokenForm = null;
    };
    IsActive() {
        try {
            return Global.State.hasOwnProperty(this.props.ModelID) && Global.State[this.props.ModelID] !== null;
        } catch (ex) {
            global.Log({Message: 'ServiceForm.IsActive>>' + ex.message});
        }
    };
    async Show(Params_Value) {
        try {
            global.root.NotificationModal.Show({ NotificationTitle: 'Loading...', NotificationStyle: 'Wait' });

            let _ViewWidth = Global.ScreenX > 600 ? 600 : Global.ScreenX;

            let _Service = null;
            let _TokenList = [];
            let _SchemaList = [];
            if (Global.TokenPayload.hasOwnProperty('TokenPersonID') && Global.TokenPayload.TokenPersonID !== null) {
                _Service = await ServiceHelper.GetOne();
                _TokenList = await TokenHelper.GetList({SearchPersonID: '[api]', SearchLimit: 25});
                _SchemaList = await SchemaHelper.GetList({SearchLimit: 25});
            } else {
                _Service = ServiceHelper.Clone({
                    ServiceSecret: this.MakeID(36),
                });
            }

            //Create State
            Global.State[this.props.ModelID] = {
                PageTitle: _Service.ServiceID !== null ? 'EDIT SERVICE' : 'NEW SERVICE',
                Service: ServiceHelper.Clone(_Service),
                ServiceSnapshot: ServiceHelper.Clone(_Service),
                ServiceDirty: false,
                SaveCallback: Params_Value.hasOwnProperty('SaveCallback') ? Params_Value.SaveCallback : null,
                DeleteCallback: Params_Value.hasOwnProperty('DeleteCallback') ? Params_Value.DeleteCallback : null,
                TokenList: _TokenList,
                SchemaList: _SchemaList,
                ActiveWindow: false,
                ViewWidth: _ViewWidth,
                ViewOffset: new Animated.Value(_ViewWidth),
                FooterOffset: new Animated.Value(-70),
                FooterPadding: new Animated.Value(0)
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
            global.Log({Message: 'ServiceForm.Show>>' + ex.message, Notify: true});
        }
    };
    CheckDirty() {
        try {
            let _ServiceDirty = (JSON.stringify(Global.State[this.props.ModelID].ServiceSnapshot).trim() !== JSON.stringify(Global.State[this.props.ModelID].Service).trim());
            if (_ServiceDirty !== Global.State[this.props.ModelID].ServiceDirty) {
                Global.State[this.props.ModelID].ServiceDirty = _ServiceDirty;
                if (Global.State[this.props.ModelID] !== null && Global.State[this.props.ModelID].FooterOffset !== null) {
                    if (Global.State[this.props.ModelID].ServiceDirty) {
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
            global.Log({Message: 'ServiceForm.CheckDirty>>' + ex.message, Notify: true});
        }
    }; 
    async SaveService() {
        try {
            this.ClearFocus();
            setTimeout(async () => {
                try {

                    await global.root.NotificationModal.Show({ NotificationTitle: 'Saving...', NotificationStyle: 'Wait' });
                    let _Service = ServiceHelper.Clone(Global.State[this.props.ModelID].Service);

                    //Save the account
                    _Service = await ServiceHelper.Save(_Service);
                    if (_Service !== null) {
                        Global.State[this.props.ModelID].Service = ServiceHelper.Clone(_Service);
                        Global.State[this.props.ModelID].ServiceSnapshot = ServiceHelper.Clone(_Service);
                        this.CheckDirty();

                        //Run callbacks
                        if (Global.State[this.props.ModelID].SaveCallback !== null) {
                            Global.State[this.props.ModelID].SaveCallback(ServiceHelper.Clone(_Service));
                        }
                        
                        global.root.NotificationModal.Hide();
                    } else {
                        global.root.NotificationModal.Hide();
                        this.Hide();
                    }
                } catch (ex) {
                    global.Log({Message: 'ServiceForm.SaveService>>' + ex.message, Notify: true});
                }
            }, Platform.OS === 'macos' || Platform.OS === 'windows' ? 50 : 1);
        } catch (ex) {
            global.Log({Message: 'ServiceForm.SaveService>>' + ex.message, Notify: true});
        }
    };
    CancelService() {
        try {
            Global.State[this.props.ModelID].Service = ServiceHelper.Clone(Global.State[this.props.ModelID].ServiceSnapshot);
            this.CheckDirty();
        } catch (ex) {
            global.Log({Message: 'ServiceForm.CancelService>>' + ex.message, Notify: true});
        }
    };
    DeleteService() {
        try {
            global.root.ConfirmModal.Show('Just Checking...', 'Are you sure you want to delete this service?', 'Yes', 'No', async () => {
                try {
                    if (Global.State[this.props.ModelID].Service !== null && Global.StringHasContent(Global.State[this.props.ModelID].Service.ServiceID)) {
                        await global.root.NotificationModal.Show({ NotificationTitle: 'Deleting...', NotificationStyle: 'Wait' });
                        await ServiceHelper.Delete({ServiceID: Global.State[this.props.ModelID].Service.ServiceID});
                        global.root.NotificationModal.Hide();
                        global.root.AuthContext(null);
                        this.Hide();
                    } else {
                        this.Hide();
                    }
                } catch (ex) {
                    global.Log({Message: 'ServiceForm.DeleteService>>' + ex.message, Notify: true});
                }
            }, () => {
                //Cancel - Do Nothing
            });
        } catch (ex) {
            global.Log({Message: 'ServiceForm.DeleteService>>' + ex.message, Notify: true});
        }
    };

    MakeID(length) {
        let result = '';
        const characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
        const charactersLength = characters.length;
        let counter = 0;
        while (counter < length) {
          result += characters.charAt(Math.floor(Math.random() * charactersLength));
          counter += 1;
        }
        return result;
    }

    //Handlers
    ActiveHandler() {
        try {

            //Handle ActiveWindow state
            let _ActiveWindow = false;
            if (this.SchemaForm?.IsActive()) {
                this.SchemaForm.ActiveHandler();
            } else if (this.TokenForm?.IsActive()) {
                this.TokenForm.ActiveHandler();
            } else if (!global.GlobalModalActive) {
                _ActiveWindow = true;
            }

            //Handle ActiveWindow change
            if (_ActiveWindow !== Global.State[this.props.ModelID].ActiveWindow) {
                Global.State[this.props.ModelID].ActiveWindow = _ActiveWindow;
                this.forceUpdate();
            }

        } catch (ex) {
            global.Log({Message: 'ServiceForm.ActiveHandler>>' + ex.message});
        }
    };
    BackHandler() {
        try {
            if (this.SchemaForm?.IsActive()) {
                this.SchemaForm.BackHandler();
            } else if (this.TokenForm?.IsActive()) {
                this.TokenForm.BackHandler();
            } else {
                this.Hide();
            }
        } catch (ex) {
            global.Log({Message: 'ServiceForm.BackHandler>>' + ex.message});
        }
    };
    KeyboardHandler(action, keyboardheight) {
        try {
            if (this.SchemaForm?.IsActive()) {
                this.SchemaForm.KeyboardHandler(action, keyboardheight)
            } else if (this.TokenForm?.IsActive()) {
                this.TokenForm.KeyboardHandler(action, keyboardheight);
            } else {
                //Do Nothing
            }
        } catch (ex) {
            global.Log({Message: 'ServiceForm.KeyboardHandler>>' + ex.message});
        }
    };
    ShortcutHandler(Shortcut_Value) {
        try {
            if (this.SchemaForm?.IsActive()) {
                this.SchemaForm.ShortcutHandler(Shortcut_Value);
            } else if (this.TokenForm?.IsActive()) {
                this.TokenForm.ShortcutHandler(Shortcut_Value);
            } else {
                if (Shortcut_Value === 'Save' && Global.State[this.props.ModelID]?.ServiceDirty === true) {
                    this.SaveService();
                } else if (Shortcut_Value === 'Delete' && Global.State[this.props.ModelID]?.ServiceDirty === false) {
                    this.DeleteService();
                }
            }
        } catch (ex) {
            global.Log({Message: 'ServiceForm.ShortcutHandler>>' + ex.message});
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
            global.Log({Message: 'ServiceForm.Hide>>' + ex.message});
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
            global.Log({Message: 'ServiceForm.ClearFocus>>' + ex.message, Notify: true});
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
                        <SchemaForm ref={ele => this.SchemaForm = ele} ModelID={this.props.ModelID + '_SF7WL51X'} />
                        <TokenForm ref={ele => this.TokenForm = ele} ModelID={this.props.ModelID + '_TF1SXRZ7'} />
                    </View>
                );
            } else {
                return (<View></View>);
            }
        } catch (ex) {
            global.Log({Message: 'ServiceForm.render>>' + ex.message});
        }
    };
    renderHeader() {
        try {
            return (
                <Pressable style={{paddingTop: Global.InsetTop}} onPress={() => { this.ClearFocus() }}>
                    <View ref={ele => this.Titlebar = ele} style={{ height: 70, flexDirection:'row', padding: 10, enableFocusRing: false}}>
                        <Pressable 
                            onPress={() => {
                                if (Global.State[this.props.ModelID].ProductDirty) {
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
                            <Image source={Global.Theme.Header.Icons.Back} style={{width: 20, height: 20}} />
                        </Pressable>
                        <View style={{flex: 1, justifyContent: 'center'}}>
                            <Text style={{fontSize: 20, fontWeight: 'bold', color: Global.Theme.Header.ForegroundColor}}>{Global.State[this.props.ModelID].PageTitle}</Text>
                        </View>
                        <Pressable
                            onPress={() => this.DeleteService()}
                            style={({pressed}) => [{width: 50, height: 50, alignItems: 'center', justifyContent: 'center', opacity: pressed ? .5 : (Global.State[this.props.ModelID].Service.ServiceID !== null ? 1 : .5)}]}
                            disabled={Global.State[this.props.ModelID].Service.ServiceID === null}
                        >
                            <Image source={global.ColorScheme === 'dark' ? IMG_Trash_eeeeee : IMG_Trash_121212} style={{width: 24, height: 24}} />
                        </Pressable>
                    </View>
                </Pressable>
            );
        } catch (ex) {
            global.Log({Message: 'ServiceForm.renderHeader>>' + ex.message});
        }
    };
    renderBody() {
        try {

            //Copy ID
            let _CopyUI = null;
            if (Global.State[this.props.ModelID].PageTitle === 'EDIT SERVICE') {
                _CopyUI = (
                    <Pressable
                        onPress={async () => {
                            try {
                                if (Platform.OS === 'windows' || Platform.OS === 'macos') {
                                    await TurboModuleRegistry.get('RNClipboard').SetString(Global.State[this.props.ModelID].Service.ServiceID);
                                } else {
                                    await NativeModules.RNClipboard.setString(Global.State[this.props.ModelID].Service.ServiceID);
                                }
                                global.root.NotificationModal.Show({ NotificationTitle: 'Copied!', NotificationStyle: 'Toast' });
                            } catch (ex) {
                                global.Log({Message: 'ServiceForm.renderBody.CopyID>>' + ex.message, Notify: true});
                            }
                        }}
                        style={({pressed}) => [{width: 50, height: 50, marginTop: 4, alignItems: 'center', justifyContent: 'center', opacity: pressed ? .7 : 1}]}
                    >
                        <Image source={global.ColorScheme === 'dark' ? IMG_Copy_eeeeee : IMG_Copy_121212} style={{width: 24, height: 24}} />
                    </Pressable>
                )
            }

            return (
                <ScrollView style={{backgroundColor: Global.Theme.Body.BackgroundColor}}>

                    {/* Service Details */}
                    <View style={{flex: 1, padding: 10}}>

                        {/* Service ID */}
                        <View style={{flex: 1, flexDirection: 'row'}}>
                            <ElementControl 
                                Name={'ID'}
                                Value={Global.State[this.props.ModelID].Service.ServiceID} 
                                Changed={(Text_Value) => {
                                    Global.State[this.props.ModelID].Service.ServiceID = Text_Value;
                                    this.CheckDirty();
                                }}
                                Editable={Global.State[this.props.ModelID].ActiveWindow} 
                                Enabled={Global.State[this.props.ModelID].PageTitle === 'NEW SERVICE'}
                            />
                            {_CopyUI}
                        </View>

                        {/* Service Name */}
                        <ElementControl 
                            Name={'Name'}
                            Value={Global.State[this.props.ModelID].Service.ServiceName} 
                            Changed={(Text_Value) => {
                                Global.State[this.props.ModelID].Service.ServiceName = Text_Value;
                                this.CheckDirty();
                            }}
                            MarginTop={10} 
                            Editable={Global.State[this.props.ModelID].ActiveWindow} 
                            Enabled={true}
                            Visible={true}
                        />

                        {/* Service Domain */}
                        <ElementControl 
                            Name={'Domain Name'}
                            Value={Global.State[this.props.ModelID].Service.ServiceDomain} 
                            Changed={(Text_Value) => {
                                Global.State[this.props.ModelID].Service.ServiceDomain = Text_Value;
                                this.CheckDirty();
                            }}
                            Casing={'lower'}
                            MarginTop={10}
                            Editable={Global.State[this.props.ModelID].ActiveWindow}
                            Enabled={true}
                            Visible={true}
                        />

                        {/* Service Email */}
                        <ElementControl 
                            Name={'Email'}
                            Value={Global.State[this.props.ModelID].Service.ServiceEmail} 
                            Changed={(Text_Value) => {
                                Global.State[this.props.ModelID].Service.ServiceEmail = Text_Value;
                                this.CheckDirty();
                            }}
                            Casing={'lower'}
                            MarginTop={10}
                            Editable={Global.State[this.props.ModelID].ActiveWindow}
                            Enabled={true}
                            Visible={true}
                        />

                        {/* Service Sequence */}
                        <ElementControl 
                            Name={'Transaction Sequence'}
                            Value={Global.State[this.props.ModelID].Service.ServiceSequence.toString()} 
                            ValueType={'Integer'}
                            Changed={(Text_Value) => {
                                Global.State[this.props.ModelID].Service.ServiceSequence = Text_Value;
                                this.CheckDirty();
                            }}
                            MarginTop={10}
                            Editable={Global.State[this.props.ModelID].ActiveWindow}
                            Enabled={true}
                            Visible={true}
                        />

                        {/* Service Webhook */}
                        <ElementControl 
                            Name={'Change Webhook'}
                            Value={Global.State[this.props.ModelID].Service.ServiceWebhook} 
                            Changed={(Text_Value) => {
                                Global.State[this.props.ModelID].Service.ServiceWebhook = Text_Value;
                                this.CheckDirty();
                            }}
                            Casing={'lower'}
                            MarginTop={10}
                            Editable={Global.State[this.props.ModelID].ActiveWindow}
                            Enabled={true}
                            Visible={true}
                        />

                        {/* Service Public Key */}
                        <ElementControl 
                            Name={'Secret Key'}
                            Value={Global.State[this.props.ModelID].Service.ServiceSecret} 
                            Changed={(Text_Value) => {
                                Global.State[this.props.ModelID].Service.ServiceSecret = Text_Value;
                                this.CheckDirty();
                            }}
                            MarginTop={10}
                            Editable={Global.State[this.props.ModelID].ActiveWindow}
                            Enabled={true}
                            Visible={true}
                        />

                    </View>

                    {this.renderTokenList()}
                    {this.renderSchemaList()}

                    {/* Bottom Padding */}
                    <View style={{height: Global.InsetBottom + 20}}></View>
                    <View style={{height: Global.State[this.props.ModelID].ScrollPadding}}></View>
                    <Animated.View key={'Footer_Padding'} style={{position: 'relative', backgroundColor: 'transparent', height: Global.State[this.props.ModelID].FooterPadding}}>
                    </Animated.View>

                </ScrollView>
            );

        } catch (ex) {
            global.Log({Message: 'ServiceForm.renderBody>>' + ex.message});
        }
    };
    renderTokenList() {
        try {
            let _UI = [];
            let _Now = new Date();
            if (Global.State[this.props.ModelID].TokenList?.length > 0) {
                for (let _TokenIndex = 0; _TokenIndex < Global.State[this.props.ModelID].TokenList.length; _TokenIndex++) {
                    let _Token = Global.State[this.props.ModelID].TokenList[_TokenIndex];

                    let _LastActiveUI = null;
                    if (_Token.hasOwnProperty('TokenAccessed') !== null) {
                        let _AccessedDate = new Date(_Token.TokenAccessed + 'Z');
                        _LastActiveUI = (
                            <Text style={{color: Global.Theme.Body.ForegroundColor, opacity: .5, fontSize: 11}}>{'Last Active ' + Global.TimeSince(_AccessedDate)}</Text>
                        );
                    }

                    let _ExpiresUI = null;
                    let _BorderColor = Global.Theme.Body.ControlBackground;
                    if (_Token.hasOwnProperty('TokenExpires')) {
                        let _ExpiresDate = new Date(_Token.TokenExpires + 'Z');
                        let _CreatedDescription = Global.FormatShortDate(_ExpiresDate.getFullYear(), _ExpiresDate.getMonth() + 1, _ExpiresDate.getDate());
                        if (_ExpiresDate.getHours() < 12) {
                            _CreatedDescription += ' ' + parseInt(_ExpiresDate.getHours() + 12).toString() + ':' + _ExpiresDate.getMinutes() + ':' + _ExpiresDate.getSeconds() + 'AM';
                        } else if (_ExpiresDate.getHours() >= 12) {
                            _CreatedDescription += ' ' + parseInt(_ExpiresDate.getHours() - 12).toString() + ':' + _ExpiresDate.getMinutes() + ':' + _ExpiresDate.getSeconds() + 'PM';
                        }
                        _ExpiresUI = (
                            <Text style={{color: Global.Theme.Body.ForegroundColor, opacity: .5, fontSize: 11, marginTop: 4}}>{(_ExpiresDate > _Now ? 'Expires ' : 'Expired ') + _CreatedDescription}</Text>
                        )
                        if (_ExpiresDate > _Now) { 
                            _BorderColor = Global.Theme.Highlight.BackgroundFade;
                        }
                    }

                    let _TokenDescription = _Token.TokenID;
                    if (_Token.TokenDeviceID !== null) {
                        for (let _PersonDeviceIndex = 0; _PersonDeviceIndex < Global.State[this.props.ModelID].PersonDeviceList.length; _PersonDeviceIndex++) {
                            if (Global.State[this.props.ModelID].PersonDeviceList[_PersonDeviceIndex].PersonDeviceID === _Token.TokenDeviceID) {
                                _TokenDescription = Global.State[this.props.ModelID].PersonDeviceList[_PersonDeviceIndex].PersonDeviceName;
                            }
                        }
                    }

                    let _ThisToken = (Global.TokenPayload?.hasOwnProperty('TokenID') && Global.TokenPayload.TokenID === _Token.TokenID);

                    if (_TokenIndex > 0) {
                        _UI.push(
                            <View key={'TokenBreaker_' + _TokenIndex} style={{flex: 1, height: 1, backgroundColor: Global.Theme.Body.BackgroundFade, marginLeft: 10, marginRight: 10}}></View>
                        );
                    }

                    _UI.push(
                        <Pressable 
                        key={'TokenList_' + _TokenIndex}
                        onPress={() => {
                            try {
                                this.ClearFocus();
                                this.TokenForm.Show({
                                    TokenID: _Token.TokenID, 
                                    SaveCallback: () => {
                                        Global.State[this.props.ModelID].TokenList = Global.State[this.props.ModelID].TokenList.filter((Token) => { return (Token.TokenID !== Token_Value.TokenID) });
                                    }, DeleteCallback: (Token_Value) => {
                                        Global.State[this.props.ModelID].TokenList = Global.State[this.props.ModelID].TokenList.filter((Token) => { return (Token.TokenID !== Token_Value.TokenID) });
                                    }
                                });
                            } catch (ex) {
                                global.Log({Message: 'ServiceForm.renderTokenList.onPress>>' + ex.message, Notify: true});
                            }
                        }}
                        style={({pressed}) => [{flex: 1, flexDirection: 'row', opacity: pressed ? .7 : 1}]}
                        >
                            <View style={{width: 3, backgroundColor: _BorderColor, borderRadius: 4}}></View>
                            <View style={{flex: 1, padding: 10}}>
                                {_LastActiveUI}
                                {_ExpiresUI}
                                <Text style={{marginTop: 4, color: Global.Theme.Body.ForegroundColor, fontWeight: (_ThisToken ? 'bold' : 'normal')}}>{_TokenDescription + (_ThisToken ? ' (this session)' : '')}</Text>
                            </View>
                            <View style={{width: 50, alignItems: 'center', justifyContent: 'center'}}>
                                <Image source={Global.Theme.Body.Icons.Forward} style={{width: 20, height: 20}} />
                            </View>
                        </Pressable>
                    );

                }
            } else {
                _UI.push(
                    <View key={'TokenList_0'} style={[{flex: 1, height: 50, alignItems: 'center', justifyContent: 'center'}]}>
                        <Text style={{color: Global.Theme.Body.ForegroundFade}}>No Tokens</Text>
                    </View>
                );
            }
            return (
                <View style={{marginTop: 20, marginLeft: 10, marginRight: 10}}>
                    <View style={{flexDirection: 'row', height: 50, justifyContent: 'center'}}>
                        <View style={{flex: 1, justifyContent: 'center'}}>
                            <Text style={{fontSize: 20, fontWeight: 'bold', color: Global.Theme.Body.ForegroundColor}}>API Tokens</Text>
                        </View>
                        <Pressable
                            onPress={async () => {
                                this.ClearFocus();
                                global.root.ConfirmModal.Show('Just Checking...', 'Are you sure you want to create an api token?', 'Yes', 'No', async () => {
                                    try {

                                        //Create api token
                                        let _Token = await TokenHelper.Create({
                                            PersonID: '[api]',
                                        });

                                        //Refresh token list
                                        Global.State[this.props.ModelID].TokenList = await TokenHelper.GetList({SearchPersonID: '[api]', SearchLimit: 25});
                                        this.forceUpdate();

                                        //Copy token to clipboard
                                        global.root.ConfirmModal.Show('API Token...', 'Would you like to copy the api token to your clipboard?\n' + _Token, 'Yes', 'No', async () => {
                                            try {
                                                if (Platform.OS === 'windows' || Platform.OS === 'macos') {
                                                    await TurboModuleRegistry.get('RNClipboard').SetString(_Token);
                                                } else {
                                                    await NativeModules.RNClipboard.setString(_Token);
                                                }
                                                global.root.NotificationModal.Show({ NotificationTitle: 'Copied!', NotificationStyle: 'Toast' });
                                            } catch (ex) {
                                                global.Log({Message: 'ServiceForm.CopyToken>>' + ex.message, Notify: true});
                                            }
                                        }, () => {
                                            //Cancel - Do Nothing
                                        });
                                        
                                    } catch (ex) {
                                        global.Log({Message: 'ServiceForm.CreateToken>>' + ex.message, Notify: true});
                                    }
                                }, () => {
                                    //Cancel - Do Nothing
                                });
                            }}
                            style={({pressed}) => [{width: 50, height: 50, alignItems: 'center', justifyContent: 'center', opacity: pressed ? .5 : 1}]}
                        >
                            <Image source={global.ColorScheme === 'dark' ? IMG_Add_eeeeee : IMG_Add_121212} style={{width: 28, height: 28}} />
                        </Pressable>   
                    </View>
                    <View style={{backgroundColor: Global.Theme.Body.ControlBackground, borderRadius: 4}}>
                        {_UI}
                    </View>
                </View>
            );
        } catch (ex) {
            global.Log({Message: 'AccountForm.renderTokenList>>' + ex.message});
        }
    };
    renderSchemaList() {
        try {
            let _UI = [];
            let _Now = new Date();
            if (Global.State[this.props.ModelID].SchemaList?.length > 0) {
                for (let _SchemaIndex = 0; _SchemaIndex < Global.State[this.props.ModelID].SchemaList.length; _SchemaIndex++) {
                    let _Schema = Global.State[this.props.ModelID].SchemaList[_SchemaIndex];

                    let _PropertyCountUI = null;
                    if (_Schema.hasOwnProperty('SchemaPropertyList') !== null) {
                        _PropertyCountUI = (
                            <Text style={{color: Global.Theme.Body.ForegroundColor, opacity: .5, fontSize: 11}}>{_Schema.SchemaPropertyList.length} Properties</Text>
                        );
                    }

                    if (_SchemaIndex > 0) {
                        _UI.push(
                            <View key={'SchemaList_Spacer_' + _SchemaIndex} style={{flex: 1, height: 1, backgroundColor: Global.Theme.Body.BackgroundFade, marginLeft: 10, marginRight: 10}}></View>
                        );
                    }

                    _UI.push(
                        <Pressable 
                        key={'SchemaList_' + _SchemaIndex}
                        onPress={() => {
                            try {
                                this.ClearFocus();
                                this.SchemaForm.Show({
                                    SchemaID: _Schema.SchemaID, 
                                    SaveCallback: async (Schema_Value) => {
                                        Global.State[this.props.ModelID].SchemaList = await SchemaHelper.GetList({SearchLimit: 25});
                                        this.forceUpdate();
                                    }, DeleteCallback: async (Schema_Value) => {
                                        Global.State[this.props.ModelID].SchemaList = await SchemaHelper.GetList({SearchLimit: 25});
                                        this.forceUpdate();
                                    }
                                });
                            } catch (ex) {
                                global.Log({Message: 'ServiceForm.renderSchemaList.onPress>>' + ex.message, Notify: true});
                            }
                        }}
                        style={({pressed}) => [{flex: 1, flexDirection: 'row', opacity: pressed ? .7 : 1}]}
                        >
                            <View style={{width: 3, backgroundColor: Global.Theme.Body.BackgroundFade, borderRadius: 4}}></View>
                            <View style={{flex: 1, padding: 10}}>
                                {_PropertyCountUI}
                                <Text style={{marginTop: 4, color: Global.Theme.Body.ForegroundColor}}>{_Schema.SchemaID}</Text>
                            </View>
                            <View style={{width: 50, alignItems: 'center', justifyContent: 'center'}}>
                                <Image source={Global.Theme.Body.Icons.Forward} style={{width: 20, height: 20}} />
                            </View>
                        </Pressable>
                    );

                }
            } else {
                _UI.push(
                    <View key={'SchemaList_0'} style={[{flex: 1, height: 50, alignItems: 'center', justifyContent: 'center'}]}>
                        <Text style={{color: Global.Theme.Body.ForegroundFade}}>No Schemas</Text>
                    </View>
                );
            }
            return (
                <View style={{marginTop: 20, marginLeft: 10, marginRight: 10}}>
                    <View style={{flexDirection: 'row', height: 50, justifyContent: 'center'}}>
                        <View style={{flex: 1, justifyContent: 'center'}}>
                            <Text style={{fontSize: 20, fontWeight: 'bold', color: Global.Theme.Body.ForegroundColor}}>Data Schemas</Text>
                        </View>
                    </View>
                    <View style={{backgroundColor: Global.Theme.Body.ControlBackground, borderRadius: 4}}>
                        {_UI}
                    </View>
                </View>
            );
        } catch (ex) {
            global.Log({Message: 'AccountForm.renderSchemaList>>' + ex.message});
        }
    };
    renderFooter() {
        try {
            return (
                <Animated.View key={'Footer_Row'} style={[Styles.v3_footer_container, {bottom: Global.State[this.props.ModelID].FooterOffset}]}>
                    <View style={{position: 'absolute', top: 0, left: 10, right: 10, height: 60, backgroundColor: Global.Theme.Footer.BackgroundColor, borderRadius: 6, opacity: .5}}></View>
                    <Pressable style={({pressed}) => [{width: 150, height: 40, marginLeft: 10, backgroundColor: '#c06e6e', opacity: pressed ? .7 : 1, borderRadius: 4, alignItems: 'center', justifyContent: 'center'}]} onPress={() => this.CancelService() }>
                        <Text style={{fontWeight: 'bold', color: Global.Theme.Highlight.ForegroundColor}}>Cancel</Text>
                    </Pressable>
                    <View style={{flex: 1}}></View>
                    <Pressable style={({pressed}) => [{width: 150, height: 40, marginRight: 10, backgroundColor: Global.Theme.Highlight.BackgroundColor, opacity: pressed ? .7 : 1, borderRadius: 4, alignItems: 'center', justifyContent: 'center'}]} onPress={() => this.SaveService() }>
                        <Text style={{fontWeight: 'bold', color: Global.Theme.Highlight.ForegroundColor}}>Save</Text>
                    </Pressable>
                </Animated.View>
            );
        } catch (ex) {
            global.Log({Message: 'ServiceForm.renderFooter>>' + ex.message, Notify: true});
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
            global.Log({Message: 'ServiceForm.renderSwipeBack>>' + ex.message});
        }
    };
};