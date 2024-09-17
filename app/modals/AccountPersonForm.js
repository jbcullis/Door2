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
module.exports = class AccountPersonForm extends Component {
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
            global.Log({Message: 'AccountPersonForm.IsActive>>' + ex.message});
        }
    };
    async Show(Params_Value) {
        try {
            global.root.NotificationModal.Show({ NotificationTitle: 'Loading...', NotificationStyle: 'Wait' });

            let _ViewWidth = Global.ScreenX > 600 ? 600 : Global.ScreenX;

            let _AccountPerson = await AccountPersonHelper.GetOne({
                AccountID: Params_Value.AccountID,
                AccountPersonID: Params_Value.AccountPersonID,
            });

            //Create State
            Global.State[this.props.ModelID] = {
                PageTitle: 'Account Person',
                Account: await AccountHelper.GetOne({ AccountID: Params_Value.AccountID }),
                Person: await PersonHelper.GetOne({ PersonID: Params_Value.AccountPersonID }),
                AccountPerson: AccountPersonHelper.Clone(_AccountPerson),
                AccountPersonSnapshot: AccountPersonHelper.Clone(_AccountPerson),
                AccountPersonDirty: false,
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
            global.Log({Message: 'AccountPersonForm.Show>>' + ex.message, Notify: true});
        }
    };
    CheckDirty() {
        try {
            let _AccountPersonDirty = (JSON.stringify(Global.State[this.props.ModelID].AccountPersonSnapshot).trim() !== JSON.stringify(Global.State[this.props.ModelID].AccountPerson).trim());
            if (_AccountPersonDirty !== Global.State[this.props.ModelID].AccountPersonDirty) {
                Global.State[this.props.ModelID].AccountPersonDirty = _AccountPersonDirty;
                if (Global.State[this.props.ModelID] !== null && Global.State[this.props.ModelID].FooterOffset !== null) {
                    if (Global.State[this.props.ModelID].AccountPersonDirty) {
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
            global.Log({Message: 'AccountPersonForm.CheckDirty>>' + ex.message, Notify: true});
        }
    };
    Save() {
        try {
            this.ClearFocus();
            setTimeout(async () => {
                try {

                    global.root.NotificationModal.Show({ NotificationTitle: 'Saving...', NotificationStyle: 'Wait' });
                    let _AccountPerson = await AccountPersonHelper.Save(Global.State[this.props.ModelID].AccountPerson);
                    if (_AccountPerson !== null) {
                        Global.State[this.props.ModelID].AccountPerson = AccountPersonHelper.Clone(_AccountPerson);
                        Global.State[this.props.ModelID].AccountPersonSnapshot = AccountPersonHelper.Clone(_AccountPerson);

                        //Run callback
                        if (Global.State[this.props.ModelID].SaveCallback !== null) {
                            Global.State[this.props.ModelID].SaveCallback(AccountPersonHelper.Clone(Global.State[this.props.ModelID].AccountPerson));
                        }

                    }

                    this.CheckDirty();
                    global.root.NotificationModal.Hide();

                } catch (ex) {
                    global.Log({Message: 'AccountPersonForm.Save>>' + ex.message, Notify: true});
                }
            }, Platform.OS === 'macos' || Platform.OS === 'windows' ? 50 : 1);
        } catch (ex) {
            global.Log({Message: 'AccountPersonForm.Save>>' + ex.message, Notify: true});
        }
    };
    CancelAccountPerson() {
        try {
            this.ClearFocus();
            setTimeout(async () => {
                try {
                    Global.State[this.props.ModelID].AccountPerson = AccountPersonHelper.Clone(Global.State[this.props.ModelID].AccountPersonSnapshot);
                    this.CheckDirty();
                } catch (ex) {
                    global.Log({Message: 'AccountPersonForm.CancelAccountPerson>>' + ex.message, Notify: true});
                }
            }, Platform.OS === 'macos' || Platform.OS === 'windows' ? 50 : 1);
        } catch (ex) {
            global.Log({Message: 'AccountPersonForm.CancelAccountPerson>>' + ex.message, Notify: true});
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
            global.Log({Message: 'AccountPersonForm.ActiveHandler>>' + ex.message});
        }
    };
    BackHandler() {
        try {
            this.Hide();
        } catch (ex) {
            global.Log({Message: 'AccountPersonForm.BackHandler>>' + ex.message});
        }
    };
    KeyboardHandler(action, keyboardheight) {
        try {
            //Do Nothing
        } catch (ex) {
            global.Log({Message: 'AccountPersonForm.KeyboardHandler>>' + ex.message});
        }
    };
    ShortcutHandler(Shortcut_Value) {
        try {
            //Do Nothing
        } catch (ex) {
            global.Log({Message: 'AccountPersonForm.ShortcutHandler>>' + ex.message});
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
            global.Log({Message: 'AccountPersonForm.Hide>>' + ex.message});
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
            global.Log({Message: 'AccountPersonForm.ClearFocus>>' + ex.message, Notify: true});
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
            global.Log({Message: 'AccountPersonForm.render>>' + ex.message});
        }
    };
    renderHeader() {
        try {
            return (
                <Pressable style={{paddingTop: Global.InsetTop}} onPress={() => { this.ClearFocus() }}>
                    <View ref={ele => this.Titlebar = ele} style={{ height: 70, flexDirection:'row', padding: 10, enableFocusRing: false}}>
                        <Pressable
                            onPress={() => {
                                if (Global.State[this.props.ModelID].AccountPersonDirty) {
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
                            onPress={async () => {
                                try {
                                    this.ClearFocus();
                                    global.root.ConfirmModal.Show('Just Checking...', 'Are you sure you want to delete this account person?', 'Yes', 'No', async () => {
                                        try {
                                            if (Global.State[this.props.ModelID].AccountPerson !== null
                                            && Global.State[this.props.ModelID].AccountPerson.AccountPersonID !== null) {
                                                global.root.NotificationModal.Show({ NotificationTitle: 'Deleting...', NotificationStyle: 'Wait' });
                                                await AccountPersonHelper.Delete({ 
                                                    AccountID: Global.State[this.props.ModelID].AccountPerson.AccountID, 
                                                    AccountPersonID: Global.State[this.props.ModelID].AccountPerson.AccountPersonID
                                                });
                                                if (Global.State[this.props.ModelID].DeleteCallback !== null) {
                                                    Global.State[this.props.ModelID].DeleteCallback(Global.State[this.props.ModelID].AccountPerson);
                                                }
                                                global.root.NotificationModal.Hide();
                                                this.Hide();
                                            } else {
                                                this.Hide();
                                            }
                                        } catch (ex) {
                                            global.Log({Message: 'AccountPersonForm.DeleteAccountPerson>>' + ex.message, Notify: true});
                                        }
                                    }, () => {
                                        //Cancel - Do Nothing
                                    });
                                } catch (ex) {
                                    global.Log({Message: 'AccountPersonForm.DeleteAccountPerson>>' + ex.message, Notify: true});
                                }
                            }}
                            style={({pressed}) => [{width: 50, height: 50, alignItems: 'center', justifyContent: 'center', opacity: pressed ? .5 : 1}]}
                        >
                            <Image source={Global.Theme.Header.Icons.Trash} style={{width: 24, height: 24}} />
                        </Pressable>
                    </View>
                </Pressable>
            );
        } catch (ex) {
            global.Log({Message: 'AccountPersonForm.renderHeader>>' + ex.message});
        }
    };
    renderBody() {
        try {

            let _CreatedDescription = null;
            if (Global.State[this.props.ModelID].AccountPerson.AccountPersonCreated !== null) {
                let _CreatedDate = new Date(Global.State[this.props.ModelID].AccountPerson.AccountPersonCreated);
                _CreatedDescription = Global.FormatShortDate(_CreatedDate.getFullYear(), _CreatedDate.getMonth() + 1, _CreatedDate.getDate());
                if (_CreatedDate.getHours() < 12) {
                    _CreatedDescription += ' ' + parseInt(_CreatedDate.getHours() + 12).toString() + ':' + _CreatedDate.getMinutes() + ':' + _CreatedDate.getSeconds() + 'AM';
                } else if (_CreatedDate.getHours() >= 12) {
                    _CreatedDescription += ' ' + parseInt(_CreatedDate.getHours() - 12).toString() + ':' + _CreatedDate.getMinutes() + ':' + _CreatedDate.getSeconds() + 'PM';
                }
            }

            let _LastActivityDescription = null;
            if (Global.State[this.props.ModelID].AccountPerson.AccountPersonActivity !== null) {
                let _LastActivityDate = new Date(Global.State[this.props.ModelID].AccountPerson.AccountPersonActivity + 'Z');
                _LastActivityDescription = Global.TimeSince(_LastActivityDate);
            }

            return (
                <ScrollView 
                style={{flex: 1, backgroundColor: Global.Theme.Body.BackgroundColor}}
                refreshControl={
                    <RefreshControl refreshing={this.state.Refreshing} onRefresh={async () => {
                        try {
                            this.setState({Refreshing: true});
                            Global.State[this.props.ModelID].Person = await PersonHelper.GetOne({ PersonID: Global.State[this.props.ModelID].PersonID });
                            Global.State[this.props.ModelID].AccountPerson = await AccountPersonHelper.GetOne({ PersonID: Global.State[this.props.ModelID].PersonID, AccountPersonID: Global.State[this.props.ModelID].AccountPerson.AccountPersonID });
                            this.setState({Refreshing: false});
                        } catch (ex) {
                            global.Log({Message: 'AccountPersonForm.renderBody.RefreshControl>>' + ex.message, Notify: true});
                        }
                    }} />
                }>

                    {/* Account Person Details */}
                    <View style={{flex: 1, padding: 10}}>

                        {/* Account */}
                        <View style={{flexDirection: 'row'}}>
                            <InputControl
                                Name={'Account'}
                                Value={Global.State[this.props.ModelID].Account.AccountName}
                                MarginTop={10}
                                Editable={Global.State[this.props.ModelID].ActiveWindow}
                                Enabled={false}
                            />
                            <Pressable
                                onPress={async () => {
                                    try {
                                        if (Platform.OS === 'windows' || Platform.OS === 'macos') {
                                            await TurboModuleRegistry.get('RNClipboard').SetString(Global.State[this.props.ModelID].Account.AccountID);
                                        } else {
                                            await NativeModules.RNClipboard.setString(Global.State[this.props.ModelID].Account.AccountID);
                                        }
                                        global.root.NotificationModal.Show({ NotificationTitle: 'Copied!', NotificationStyle: 'Toast' });
                                    } catch (ex) {
                                        global.Log({Message: 'AccountPersonForm.renderBody.CopyAccountID>>' + ex.message, Notify: true});
                                    }
                                }}
                                style={({pressed}) => [{width: 50, height: 50, marginTop: 4, alignItems: 'center', justifyContent: 'center', opacity: pressed ? .5 : 1}]}
                            >
                                <Image source={global.ColorScheme === 'dark' ? IMG_Copy_eeeeee : IMG_Copy_121212} style={{width: 24, height: 24}} />
                            </Pressable>
                        </View>                       

                        {/* Account Person */}
                        <View style={{flexDirection: 'row'}}>
                            <InputControl
                                Name={'Person'}
                                Value={Global.State[this.props.ModelID].Person.PersonName}
                                MarginTop={10}
                                Editable={Global.State[this.props.ModelID].ActiveWindow}
                                Enabled={false}
                            />
                            <Pressable
                                onPress={async () => {
                                    try {
                                        if (Platform.OS === 'windows' || Platform.OS === 'macos') {
                                            await TurboModuleRegistry.get('RNClipboard').SetString(Global.State[this.props.ModelID].Person.PersonID);
                                        } else {
                                            await NativeModules.RNClipboard.setString(Global.State[this.props.ModelID].Person.PersonID);
                                        }
                                        global.root.NotificationModal.Show({ NotificationTitle: 'Copied!', NotificationStyle: 'Toast' });
                                    } catch (ex) {
                                        global.Log({Message: 'AccountPersonForm.renderBody.CopyPersonID>>' + ex.message, Notify: true});
                                    }
                                }}
                                style={({pressed}) => [{width: 50, height: 50, marginTop: 4, alignItems: 'center', justifyContent: 'center', opacity: pressed ? .5 : 1}]}
                            >
                                <Image source={global.ColorScheme === 'dark' ? IMG_Copy_eeeeee : IMG_Copy_121212} style={{width: 24, height: 24}} />
                            </Pressable>
                        </View>

                        {/* Person Name */}
                        <InputControl
                            Name={'Person Email'}
                            Value={Global.State[this.props.ModelID].Person.PersonEmail}
                            MarginTop={10}
                            Editable={Global.State[this.props.ModelID].ActiveWindow}
                            Enabled={false}
                        />                        

                        {/* Account Person Roles - Overrides Person Roles when token is scoped */}
                        <InputControl
                            Name={'Person Roles'}
                            Value={Global.State[this.props.ModelID].AccountPerson.AccountPersonRoles}
                            MarginTop={10}
                            Editable={Global.State[this.props.ModelID].ActiveWindow}
                            Enabled={false}
                        />                        

                        {/* Account Person Created / Activity */}
                        <View style={{flexDirection: 'row'}}>
                            <InputControl
                                Name={'Created'}
                                Value={_CreatedDescription}
                                MarginTop={10}
                                Editable={false}
                                Enabled={false}
                            />
                            <View style={{width: 10}}></View>
                            <InputControl
                                Name={'Last Active'}
                                Value={_LastActivityDescription}
                                MarginTop={10}
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
            global.Log({Message: 'AccountPersonForm.renderBody>>' + ex.message});
        }
    };
    renderFooter() {
        try {
            return (
                <Animated.View key={'Footer_Row'} style={[Styles.v3_footer_container, {bottom: Global.State[this.props.ModelID].FooterOffset}]}>
                    <View style={{position: 'absolute', top: 0, left: 0, right: 0, bottom: 0, backgroundColor: '#262626', opacity: .4}}></View>
                    <Pressable style={[Styles.form_delete_button, {width: 150}]} onPress={() => this.CancelAccountPerson() }>
                        <Text style={Styles.form_button_text}>Cancel</Text>
                    </Pressable>
                    <View style={{flex: 1}}></View>
                    <Pressable style={[Styles.form_button, {width: 150}]} onPress={() => this.Save() }>
                        <Text style={Styles.form_button_text}>Save</Text>
                    </Pressable>
                </Animated.View>
            );
        } catch (ex) {
            global.Log({Message: 'AccountPersonForm.renderFooter>>' + ex.message, Notify: true});
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
            global.Log({Message: 'AccountPersonForm.renderSwipeBack>>' + ex.message});
        }
    };
};