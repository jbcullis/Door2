import React, { Component } from 'react';
import {
    View,
    Text,
    Image,
    RefreshControl,
    Animated,
    Platform,
    Keyboard,
    Pressable,
    ScrollView,
    TurboModuleRegistry,
    NativeModules,
} from 'react-native';
import ElementControl from '../controls/ElementControl.js';
module.exports = class AccountForm extends Component {
    constructor(props) {
        super(props);
        this.Titlebar = null;
        this.AccountPersonForm = null;
        this.AccountSubscriptionForm = null;
        this.CombinedLogSearch = null;
        this.PersonPicker = null;
        this.state = {
            Refreshing: false
        }
    };
    IsActive() {
        try {
            return Global.State.hasOwnProperty(this.props.ModelID) && Global.State[this.props.ModelID] !== null;
        } catch (ex) {
            global.Log({Message: 'AccountForm.IsActive>>' + ex.message});
        }
    };
    async Show(Params_Value) {
        try {
            global.root.NotificationModal.Show({ NotificationTitle: 'Loading...', NotificationStyle: 'Wait' });

            let _ViewWidth = Global.ScreenX > 600 ? 600 : Global.ScreenX;

            let _Account = null;
            let _TransactionList = [];
            let _AccountSubscriptionList = [];
            let _PersonList = [];
            if (Global.StringHasContent(Params_Value.AccountID)) {
                _Account = await AccountHelper.GetOne({AccountID: Params_Value.AccountID});
                _AccountSubscriptionList = await AccountSubscriptionHelper.GetList({SearchAccountID: Params_Value.AccountID});
                _TransactionList = await TransactionHelper.GetList({SearchAccountID: Params_Value.AccountID, SearchLimit: 25, SearchOffset: 0});
                _PersonList = await PersonHelper.GetList({SearchAccountID: Params_Value.AccountID});
            }

            //Create Account if null
            if (_Account === null) {
                _Account = {
                    AccountID: null,
                    AccountName: null,
                    AccountWebsite: null,
                    AccountPhone: null,
                    AccountEmail: null,
                    AccountCurrency: null,
                    AccountStreet1: null,
                    AccountStreet2: null,
                    AccountCity: null,
                    AccountState: null,
                    AccountCountry: null,
                    AccountPostCode: null,
                    AccountLatitude: null,
                    AccountLongitude: null,
                    AccountActivity: null,
                    AccountCreated: null,
                    AccountUpdated: null,
                };
            }

            //Create State
            Global.State[this.props.ModelID] = {
                PageTitle: _Account?.AccountID?.length > 0 ? 'EDIT ACCOUNT' : 'NEW ACCOUNT',
                Account: JSON.parse(JSON.stringify(_Account)),
                AccountSnapshot: JSON.parse(JSON.stringify(_Account)),
                AccountDirty: false,
                SaveCallback: Params_Value.hasOwnProperty('SaveCallback') ? Params_Value.SaveCallback : null,
                DeleteCallback: Params_Value.hasOwnProperty('DeleteCallback') ? Params_Value.DeleteCallback : null,
                AuthenticationCount: (_Account != null ? await CombinedLogHelper.GetCount({SearchType: 'authentication', SearchAccountID: _Account.AccountID}) : 0),
                ActivityCount: (_Account != null ? await CombinedLogHelper.GetCount({SearchType: 'activity', SearchAccountID: _Account.AccountID}) : 0),
                ExceptionCount: (_Account != null ? await CombinedLogHelper.GetCount({SearchType: 'exception', SearchAccountID: _Account.AccountID}) : 0),
                AccountSubscriptionList: _AccountSubscriptionList,
                Schema: await SchemaHelper.GetOne({SchemaID: 'Account'}),
                TransactionList: _TransactionList,
                PersonList: _PersonList,
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
            global.Log({Message: 'AccountForm.Show>>' + ex.message, Notify: true});
        }
    };
    CheckDirty() {
        try {
            let _AccountDirty = (JSON.stringify(Global.State[this.props.ModelID].AccountSnapshot).trim() !== JSON.stringify(Global.State[this.props.ModelID].Account).trim());
            if (_AccountDirty !== Global.State[this.props.ModelID].AccountDirty) {
                Global.State[this.props.ModelID].AccountDirty = _AccountDirty;
                if (Global.State[this.props.ModelID] !== null && Global.State[this.props.ModelID].FooterOffset !== null) {
                    if (Global.State[this.props.ModelID].AccountDirty) {
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
            global.Log({Message: 'AccountForm.CheckDirty>>' + ex.message, Notify: true});
        }
    }; 
    async SaveAccount() {
        try {
            this.ClearFocus();
            setTimeout(async () => {
                try {

                    global.root.NotificationModal.Show({ NotificationTitle: 'Loading...', NotificationStyle: 'Wait' });

                    //Change Object
                    let _Account = {
                        AccountID: Global.State[this.props.ModelID].Account.AccountID
                    }

                    //Account Name
                    if (Global.State[this.props.ModelID].Account.AccountName !== Global.State[this.props.ModelID].AccountSnapshot.AccountName) {
                        _Account.AccountName = Global.State[this.props.ModelID].Account.AccountName;
                    }

                    //Account Website
                    if (Global.State[this.props.ModelID].Account.AccountWebsite !== Global.State[this.props.ModelID].AccountSnapshot.AccountWebsite) {
                        _Account.AccountWebsite = Global.State[this.props.ModelID].Account.AccountWebsite;
                    }

                    //Account Currency
                    if (Global.State[this.props.ModelID].Account.AccountCurrency !== Global.State[this.props.ModelID].AccountSnapshot.AccountCurrency) {
                        _Account.AccountCurrency = Global.State[this.props.ModelID].Account.AccountCurrency;
                    }

                    //Account Street 1
                    if (Global.State[this.props.ModelID].Account.AccountStreet1 !== Global.State[this.props.ModelID].AccountSnapshot.AccountStreet1) {
                        _Account.AccountStreet1 = Global.State[this.props.ModelID].Account.AccountStreet1;
                    }

                    //Account Street 2
                    if (Global.State[this.props.ModelID].Account.AccountStreet2 !== Global.State[this.props.ModelID].AccountSnapshot.AccountStreet2) {
                        _Account.AccountStreet2 = Global.State[this.props.ModelID].Account.AccountStreet2;
                    }

                    //Account City
                    if (Global.State[this.props.ModelID].Account.AccountCity !== Global.State[this.props.ModelID].AccountSnapshot.AccountCity) {
                        _Account.AccountCity = Global.State[this.props.ModelID].Account.AccountCity;
                    }

                    //Account State
                    if (Global.State[this.props.ModelID].Account.AccountState !== Global.State[this.props.ModelID].AccountSnapshot.AccountState) {
                        _Account.AccountState = Global.State[this.props.ModelID].Account.AccountState;
                    }

                    //Account Country
                    if (Global.State[this.props.ModelID].Account.AccountCountry !== Global.State[this.props.ModelID].AccountSnapshot.AccountCountry) {
                        _Account.AccountCountry = Global.State[this.props.ModelID].Account.AccountCountry;
                    }

                    //Account Post Code
                    if (Global.State[this.props.ModelID].Account.AccountPostCode !== Global.State[this.props.ModelID].AccountSnapshot.AccountPostCode) {
                        _Account.AccountPostCode = Global.State[this.props.ModelID].Account.AccountPostCode;
                    }

                    //Check for change on the extended properties
                    if (Global.State[this.props.ModelID].Schema?.SchemaPropertyList?.length > 0) {
                        for (let _SchemaPropertyIndex = 0; _SchemaPropertyIndex < Global.State[this.props.ModelID].Schema.SchemaPropertyList.length; _SchemaPropertyIndex++) {
                            let _SchemaProperty = Global.State[this.props.ModelID].Schema.SchemaPropertyList[_SchemaPropertyIndex];

                            if (Global.State[this.props.ModelID].Account.hasOwnProperty(_SchemaProperty.SchemaPropertyID)
                            && Global.State[this.props.ModelID].Account[_SchemaProperty.SchemaPropertyID] !== Global.State[this.props.ModelID].AccountSnapshot[_SchemaProperty.SchemaPropertyID]) {
                                _Account[_SchemaProperty.SchemaPropertyID] = Global.State[this.props.ModelID].Account[_SchemaProperty.SchemaPropertyID];
                            }

                        }
                    }

                    //Save the account
                    _Account = await AccountHelper.Save(_Account);
                    if (_Account !== null) {

                        //Update the account object
                        Global.State[this.props.ModelID].Account = JSON.parse(JSON.stringify(_Account));
                        Global.State[this.props.ModelID].AccountSnapshot = JSON.parse(JSON.stringify(_Account));
                        this.CheckDirty();

                        //Run callbacks
                        if (Global.State[this.props.ModelID].SaveCallback !== null) {
                            Global.State[this.props.ModelID].SaveCallback(JSON.parse(JSON.stringify(_Account)));
                        }
                        
                        global.root.NotificationModal.Hide();
                    } else {
                        global.root.NotificationModal.Hide();
                        this.Hide();
                    }

                } catch (ex) {
                    global.Log({Message: 'AccountForm.SaveAccount>>' + ex.message, Notify: true});
                }
            }, Platform.OS === 'macos' || Platform.OS === 'windows' ? 50 : 1);
        } catch (ex) {
            global.Log({Message: 'AccountForm.SaveAccount>>' + ex.message, Notify: true});
        }
    };
    CancelAccount() {
        try {
            Global.State[this.props.ModelID].Account = JSON.parse(JSON.stringify(Global.State[this.props.ModelID].AccountSnapshot));
            this.CheckDirty();
        } catch (ex) {
            global.Log({Message: 'AccountForm.CancelAccount>>' + ex.message, Notify: true});
        }
    };
    DeleteAccount() {
        try {
            global.root.ConfirmModal.Show('Just Checking...', 'Are you sure you want to delete this account?', 'Yes', 'No', async () => {
                try {
                    if (Global.State[this.props.ModelID].Account !== null && Global.StringHasContent(Global.State[this.props.ModelID].Account.AccountID)) {
                        global.root.NotificationModal.Show({ NotificationTitle: 'Deleting...', NotificationStyle: 'Wait' });
                        await AccountHelper.Delete({AccountID: Global.State[this.props.ModelID].Account.AccountID});

                        //Run callbacks
                        if (Global.State[this.props.ModelID].DeleteCallback !== null) {                            
                            Global.State[this.props.ModelID].DeleteCallback(Global.State[this.props.ModelID].Account.AccountID);
                        }

                        global.root.NotificationModal.Hide();
                        this.Hide();
                    } else {
                        this.Hide();
                    }
                } catch (ex) {
                    global.Log({Message: 'AccountForm.DeleteAccount>>' + ex.message, Notify: true});
                }
            }, () => {
                //Cancel - Do Nothing
            });
        } catch (ex) {
            global.Log({Message: 'AccountForm.DeleteAccount>>' + ex.message, Notify: true});
        }
    };

    //Handlers
    ActiveHandler() {
        try {

            //Handle ActiveWindow state
            let _ActiveWindow = false;
            if (this.AccountPersonForm?.IsActive()) {
                this.AccountPersonForm.ActiveHandler();
            } else if (this.AccountSubscriptionForm?.IsActive()) {
                this.AccountSubscriptionForm.ActiveHandler();                
            } else if (this.CombinedLogSearch?.IsActive()) {
                this.CombinedLogSearch.ActiveHandler();
            } else if (this.PersonPicker?.IsActive()) {
                this.PersonPicker.ActiveHandler();
            } else if (!global.GlobalModalActive) {
                _ActiveWindow = true;
            }

            //Handle ActiveWindow change
            if (_ActiveWindow !== Global.State[this.props.ModelID].ActiveWindow) {
                Global.State[this.props.ModelID].ActiveWindow = _ActiveWindow;
                this.forceUpdate();
            }

        } catch (ex) {
            global.Log({Message: 'AccountForm.ActiveHandler>>' + ex.message});
        }
    };
    BackHandler() {
        try {
            if (this.AccountPersonForm?.IsActive()) {
                this.AccountPersonForm.BackHandler();
            } else if (this.AccountSubscriptionForm?.IsActive()) {
                this.AccountSubscriptionForm.BackHandler();                
            } else if (this.CombinedLogSearch?.IsActive()) {
                this.CombinedLogSearch.BackHandler();
            } else if (this.PersonPicker?.IsActive()) {
                this.PersonPicker.BackHandler();
            } else {
                this.Hide();
            }
        } catch (ex) {
            global.Log({Message: 'AccountForm.BackHandler>>' + ex.message});
        }
    };
    KeyboardHandler(action, keyboardheight) {
        try {
            if (this.AccountPersonForm?.IsActive()) {
                this.AccountPersonForm.KeyboardHandler(action, keyboardheight);
            } else if (this.AccountSubscriptionForm?.IsActive()) {
                this.AccountSubscriptionForm.KeyboardHandler(action, keyboardheight);                
            } else if (this.CombinedLogSearch?.IsActive()) {
                this.CombinedLogSearch.KeyboardHandler(action, keyboardheight);
            } else if (this.PersonPicker?.IsActive()) {
                this.PersonPicker.KeyboardHandler(action, keyboardheight);
            } else {
                //Do Nothing
            }
        } catch (ex) {
            global.Log({Message: 'AccountForm.KeyboardHandler>>' + ex.message});
        }
    };
    ShortcutHandler(Shortcut_Value) {
        try {
            if (this.AccountPersonForm?.IsActive()) {
                this.AccountPersonForm.ShortcutHandler(Shortcut_Value);
            } else if (this.AccountSubscriptionForm?.IsActive()) {
                this.AccountSubscriptionForm.ShortcutHandler(Shortcut_Value);                
            } else if (this.CombinedLogSearch?.IsActive()) {
                this.CombinedLogSearch.ShortcutHandler(Shortcut_Value);
            } else if (this.PersonPicker?.IsActive()) {
                this.PersonPicker.ShortcutHandler(Shortcut_Value);
            } else {
                //Do Nothing
            }
        } catch (ex) {
            global.Log({Message: 'AccountForm.ShortcutHandler>>' + ex.message});
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
            global.Log({Message: 'AccountForm.Hide>>' + ex.message});
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
            global.Log({Message: 'AccountForm.ClearFocus>>' + ex.message, Notify: true});
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
                        <AccountPersonForm ref={ele => this.AccountPersonForm = ele} ModelID={this.props.ModelID + '_APF14SX8'} />
                        <CombinedLogSearch ref={ele => this.CombinedLogSearch = ele} ModelID={this.props.ModelID + '_XRPOSE1Y'} />
                        <PersonPicker ref={ele => this.PersonPicker = ele} ModelID={this.props.ModelID + '_PP5RM21Z'} />
                        <AccountSubscriptionForm ref={ele => this.AccountSubscriptionForm = ele} ModelID={this.props.ModelID + '_SF8RZ15R'} />
                    </View>
                );
            } else {
                return (<View></View>);
            }
        } catch (ex) {
            global.Log({Message: 'AccountForm.render>>' + ex.message});
        }
    };
    renderHeader() {
        try {
            return (
                <Pressable style={{paddingTop: Global.InsetTop}} onPress={() => { this.ClearFocus() }}>
                    <View ref={ele => this.Titlebar = ele} style={{ height: 70, flexDirection:'row', padding: 10, enableFocusRing: false}}>
                        <Pressable 
                            onPress={() => {
                                if (Global.State[this.props.ModelID].AccountDirty) {
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
                            <Text style={{fontSize: 20, fontWeight: 'bold', color: (global.ColorScheme === 'dark' ? '#eeeeee' : '#121212')}}>{Global.State[this.props.ModelID].PageTitle}</Text>
                        </View>
                        <Pressable
                            onPress={() => this.DeleteAccount()}
                            style={({pressed}) => [{width: 50, height: 50, alignItems: 'center', justifyContent: 'center', opacity: pressed ? .5 : 1}]}
                        >
                            <Image source={global.ColorScheme === 'dark' ? IMG_Trash_eeeeee : IMG_Trash_121212} style={{width: 24, height: 24}} />
                        </Pressable>
                    </View>                    
                </Pressable>
            );
        } catch (ex) {
            global.Log({Message: 'AccountForm.renderHeader>>' + ex.message});
        }
    };
    renderBody() {
        try {

            let _LastActivityDescription = null;
            if (Global.State[this.props.ModelID].Account.AccountActivity !== null) {
                let _LastActivityDate = new Date(Global.State[this.props.ModelID].Account.AccountActivity + 'Z');
                _LastActivityDescription = Global.TimeSince(_LastActivityDate);
            }            

            let _CreatedDescription = null;
            if (Global.State[this.props.ModelID].Account.AccountCreated !== null) {
                let _CreatedDate = new Date(Global.State[this.props.ModelID].Account.AccountCreated);
                _CreatedDescription = Global.FormatShortDate(_CreatedDate.getFullYear(), _CreatedDate.getMonth() + 1, _CreatedDate.getDate());
                if (_CreatedDate.getHours() < 12) {
                    _CreatedDescription += ' ' + parseInt(_CreatedDate.getHours() + 12).toString() + ':' + _CreatedDate.getMinutes() + ':' + _CreatedDate.getSeconds() + 'AM';
                } else if (_CreatedDate.getHours() >= 12) {
                    _CreatedDescription += ' ' + parseInt(_CreatedDate.getHours() - 12).toString() + ':' + _CreatedDate.getMinutes() + ':' + _CreatedDate.getSeconds() + 'PM';
                }
            }

            //Copy ID
            let _CopyUI = null;
            if (Global.State[this.props.ModelID].PageTitle === 'EDIT ACCOUNT') {
                _CopyUI = (
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
                                global.Log({Message: 'AccountForm.renderBody.CopyID>>' + ex.message, Notify: true});
                            }
                        }}
                        style={({pressed}) => [{width: 50, height: 50, marginTop: 4, alignItems: 'center', justifyContent: 'center', opacity: pressed ? .5 : 1}]}
                    >
                        <Image source={global.ColorScheme === 'dark' ? IMG_Copy_eeeeee : IMG_Copy_121212} style={{width: 24, height: 24}} />
                    </Pressable>
                );
            }

            return (
                <ScrollView 
                style={{backgroundColor: Global.Theme.Body.BackgroundColor}}
                refreshControl={
                    <RefreshControl refreshing={this.state.Refreshing} onRefresh={async () => {
                        try {
                            this.setState({Refreshing: true});
                            let _Account = await AccountHelper.GetOne({AccountID: Global.State[this.props.ModelID].Account.AccountID});
                            Global.State[this.props.ModelID].Account = JSON.parse(JSON.stringify(_Account));
                            Global.State[this.props.ModelID].AccountSnapshot = JSON.parse(JSON.stringify(_Account));
                            Global.State[this.props.ModelID].AuthenticationCount = await CombinedLogHelper.GetCount({SearchType: 'authentication', SearchAccountID: Global.State[this.props.ModelID].Account.AccountID});
                            Global.State[this.props.ModelID].ActivityCount = await CombinedLogHelper.GetCount({SearchType: 'activity', SearchAccountID: Global.State[this.props.ModelID].Account.AccountID});
                            Global.State[this.props.ModelID].ExceptionCount = await CombinedLogHelper.GetCount({SearchType: 'exception', SearchAccountID: Global.State[this.props.ModelID].Account.AccountID});
                            Global.State[this.props.ModelID].AccountSubscriptionList = await SubscriptionHelper.GetList({SearchAccountID: Global.State[this.props.ModelID].Account.AccountID});
                            Global.State[this.props.ModelID].TransactionList = await TransactionHelper.GetList({SearchAccountID: Global.State[this.props.ModelID].Account.AccountID, SearchLimit: 25});
                            Global.State[this.props.ModelID].PersonList = await PersonHelper.GetList({SearchAccountID: Global.State[this.props.ModelID].Account.AccountID});
                            this.setState({Refreshing: false});
                        } catch (ex) {
                            global.Log({Message: 'AccountForm.renderBody.RefreshControl>>' + ex.message, Notify: true});
                        }
                    }} />
                }>

                    {/* Account Details */}
                    <View style={{flex: 1, padding: 10}}>

                        {/* Account ID */}
                        <View style={{flex: 1, flexDirection: 'row'}}>
                            <ElementControl 
                                Name={'ID'}
                                Value={Global.State[this.props.ModelID].Account.AccountID} 
                                Changed={(Text_Value) => {
                                    Global.State[this.props.ModelID].Account.AccountID = Text_Value;
                                    this.CheckDirty();
                                }}
                                Editable={Global.State[this.props.ModelID].ActiveWindow} 
                                Enabled={Global.State[this.props.ModelID].PageTitle === 'NEW ACCOUNT'}
                            />
                            {_CopyUI}
                        </View>

                        {/* Account Name */}
                        <ElementControl 
                            Name={'Name'}
                            Value={Global.State[this.props.ModelID].Account.AccountName} 
                            Changed={(Text_Value) => {
                                Global.State[this.props.ModelID].Account.AccountName = Text_Value;
                                this.CheckDirty();
                            }}
                            MarginTop={10}
                            Editable={Global.State[this.props.ModelID].ActiveWindow} 
                        />

                        {/* Account Website */}
                        <ElementControl 
                            Name={'Website'}
                            Value={Global.State[this.props.ModelID].Account.AccountWebsite} 
                            Changed={(Text_Value) => {
                                Global.State[this.props.ModelID].Account.AccountWebsite = Text_Value;
                                this.CheckDirty();
                            }}
                            MarginTop={10}
                            Editable={Global.State[this.props.ModelID].ActiveWindow} 
                        />

                        {/* Account Phone */}
                        <ElementControl 
                            Name={'Phone'}
                            Value={Global.State[this.props.ModelID].Account.AccountPhone} 
                            Changed={(Text_Value) => {
                                Global.State[this.props.ModelID].Account.AccountPhone = Text_Value;
                                this.CheckDirty();
                            }}
                            MarginTop={10}
                            Editable={Global.State[this.props.ModelID].ActiveWindow} 
                        />

                        {/* Account Email */}
                        <ElementControl 
                            Name={'Email'}
                            Value={Global.State[this.props.ModelID].Account.AccountEmail} 
                            Changed={(Text_Value) => {
                                Global.State[this.props.ModelID].Account.AccountEmail = Text_Value;
                                this.CheckDirty();
                            }}
                            MarginTop={10}
                            Editable={Global.State[this.props.ModelID].ActiveWindow} 
                        />

                        {/* Account Currency */}
                        <ElementControl 
                            Name={'Currency'}
                            Value={Global.StringHasContent(Global.State[this.props.ModelID].Account.AccountCurrency) ? Global.State[this.props.ModelID].Account.AccountCurrency.toUpperCase() : null} 
                            Pressed={() => {
                                global.root.PickerModal.Show([
                                    {Value: 'aud', Text: 'AUD'},
                                    {Value: 'cad', Text: 'CAD'},
                                    {Value: 'nzd', Text: 'NZD'},
                                    {Value: 'usd', Text: 'USD'}
                                ], false, (Selected_Value) => {
                                    Global.State[this.props.ModelID].Account.AccountCurrency = Selected_Value;
                                    this.CheckDirty();
                                });
                            }}
                            MarginTop={10}
                            Editable={Global.State[this.props.ModelID].ActiveWindow} 
                        />

                        {/* Extended Properties */}
                        {this.renderProperties()}

                        {/* Log Counts */}
                        <View style={{flex: 1, flexDirection: 'row', marginTop: 10, backgroundColor: Global.Theme.Highlight.BackgroundColor, borderRadius: 4}}>
                            <Pressable style={({pressed}) => [{flex: 1, height: 50, opacity: pressed ? .5 : 1}]} onPress={async () => {
                                this.CombinedLogSearch.Show({
                                    SearchType: 'authentication',
                                    SearchAccountID: Global.State[this.props.ModelID].Account.AccountID
                                });
                            }}>
                                <View style={{flex: 1, alignItems: 'center', justifyContent: 'center'}}>
                                    <Image source={Global.Theme.Highlight.Icons.Lock} style={{width: 22, height: 22}} />
                                    <Text style={{color: Global.Theme.Highlight.ForegroundColor}}>{Global.State[this.props.ModelID].AuthenticationCount}</Text>
                                </View>
                            </Pressable>
                            <View style={{width: 1, backgroundColor: Global.Theme.Body.BackgroundColor, marginTop: 4, marginBottom: 4, opacity: .2}}></View>
                            <Pressable style={({pressed}) => [{flex: 1, height: 50, opacity: pressed ? .5 : 1}]} onPress={async () => {
                                this.CombinedLogSearch.Show({
                                    SearchType: 'activity',
                                    SearchAccountID: Global.State[this.props.ModelID].Account.AccountID
                                });
                            }}>
                                <View style={{flex: 1, alignItems: 'center', justifyContent: 'center'}}>
                                    <Image source={Global.Theme.Highlight.Icons.Activity} style={{width: 22, height: 22}} />
                                    <Text style={{color: Global.Theme.Highlight.ForegroundColor}}>{Global.State[this.props.ModelID].ActivityCount}</Text>
                                </View>
                            </Pressable>
                            <View style={{width: 1, backgroundColor: Global.Theme.Body.BackgroundColor, marginTop: 4, marginBottom: 4, opacity: .2}}></View>
                            <Pressable style={({pressed}) => [{flex: 1, height: 50, opacity: pressed ? .5 : 1}]} onPress={async () => {
                                this.CombinedLogSearch.Show({
                                    SearchType: 'exception',
                                    SearchAccountID: Global.State[this.props.ModelID].Account.AccountID
                                });
                            }}>
                                <View style={{flex: 1, alignItems: 'center', justifyContent: 'center'}}>
                                    <Image source={IMG_Warning_121212} style={{width: 22, height: 22}} />
                                    <Text style={{color: Global.Theme.Highlight.ForegroundColor}}>{Global.State[this.props.ModelID].ExceptionCount}</Text>
                                </View>
                            </Pressable>
                        </View>

                        {/* Account Created / Last Active */}
                        <View style={{flex: 1, flexDirection: 'row', marginTop: 10}}>
                            <ElementControl 
                                Name={'Created On'}
                                Value={_CreatedDescription}                                  
                                Enabled={false} 
                            />
                            <View style={{width: 10}}></View>
                            <ElementControl 
                                Name={'Last Active'}
                                Value={_LastActivityDescription} 
                                Enabled={false} 
                            />   
                        </View>

                        <View style={{flex: 1, height: 50, marginTop: 20, justifyContent: 'center'}}>
                            <Text style={{fontSize: 20, fontWeight: 'bold', color: (global.ColorScheme === 'dark' ? '#eeeeee' : '#121212')}}>Address</Text>
                        </View>

                        {/* Account Street 1 */}
                        <ElementControl 
                            Name={'Street 1'}
                            Value={Global.State[this.props.ModelID].Account.AccountStreet1} 
                            Changed={(Text_Value) => {
                                try {
                                    Global.State[this.props.ModelID].Account.AccountStreet1 = Text_Value;
                                    this.CheckDirty();
                                } catch (ex) {
                                    global.Log({Message: 'AccountForm.renderBody>>' + ex.message});
                                }
                            }}
                            Casing={'upper'}
                            Editable={Global.State[this.props.ModelID].ActiveWindow} 
                        /> 

                        {/* Account Street 2 */}
                        <ElementControl 
                            Name={'Street 2'}
                            Value={Global.State[this.props.ModelID].Account.AccountStreet2} 
                            Changed={(Text_Value) => {
                                try {
                                    Global.State[this.props.ModelID].Account.AccountStreet2 = Text_Value;
                                    this.CheckDirty();
                                } catch (ex) {
                                    global.Log({Message: 'AccountForm.renderBody>>' + ex.message, Notify: true});
                                }
                            }}
                            Casing={'upper'}
                            MarginTop={10}
                            Editable={Global.State[this.props.ModelID].ActiveWindow} 
                        />

                        {/* Account City */}
                        <View style={{flex: 1, flexDirection: 'row', marginTop: 10}}>
                            <ElementControl 
                                Name={'City'}
                                Value={Global.State[this.props.ModelID].Account.AccountCity} 
                                Changed={(Text_Value) => {
                                    Global.State[this.props.ModelID].Account.AccountCity = Text_Value;
                                    this.CheckDirty();
                                }}
                                Casing={'upper'}
                                Editable={Global.State[this.props.ModelID].ActiveWindow} 
                            />
                            <View style={{width: 10}}></View>
                            <ElementControl 
                                Name={'State'}
                                Pressed={() => {
                                    global.root.PickerModal.Show(Global.Lookup_StateTypes(Global.State[this.props.ModelID].Account.AccountCountry), false, (selectedvalue) => {
                                        Global.State[this.props.ModelID].Account.AccountState = selectedvalue;
                                        this.CheckDirty();
                                    })
                                }} 
                                Value={Global.State[this.props.ModelID].Account.AccountState}
                                Editable={Global.State[this.props.ModelID].ActiveWindow}
                            />
                        </View>

                        {/* Account Country */}
                        <View style={{flex: 1, flexDirection: 'row', marginTop: 10}}>
                            <ElementControl 
                                Name={'Country'}
                                Pressed={() => {
                                    global.root.PickerModal.Show(Global.Lookup_CountryTypes(), false, (selectedvalue) => {
                                        Global.State[this.props.ModelID].Account.AccountCountry = selectedvalue;
                                        Global.State[this.props.ModelID].Account.AccountState = null;
                                        this.CheckDirty();
                                    })
                                }}             
                                Value={Global.State[this.props.ModelID].Account.AccountCountry} 
                            />
                            <View style={{width: 10}}></View>
                            <ElementControl 
                                Name={'Post Code'}
                                Value={Global.State[this.props.ModelID].Account.AccountPostCode} 
                                Changed={(Text_Value) => {
                                    Global.State[this.props.ModelID].Account.AccountPostCode = Text_Value;
                                    this.CheckDirty();
                                }}
                                Casing={'upper'}                              
                                Editable={Global.State[this.props.ModelID].ActiveWindow} 
                            />
                        </View>

                        {/* Account Coordinates */}
                        <View style={{flex: 1, flexDirection: 'row', marginTop: 10}}>
                            <ElementControl 
                                Name={'Latitude'}
                                Value={Global.State[this.props.ModelID].Account.AccountLatitude?.toString()} 
                                Enabled={false} 
                            />
                            <View style={{width: 10}}></View>
                            <ElementControl 
                                Name={'Longitude'}
                                Value={Global.State[this.props.ModelID].Account.AccountLongitude?.toString()} 
                                Casing={'upper'}                               
                                Enabled={false} 
                            />
                        </View>

                    </View>

                    {this.renderAccountSubscriptionList()}
                    {this.renderTransactionList()}
                    {this.renderPersonList()}

                    {/* Bottom Padding */}
                    <View style={{height: Global.InsetBottom + 20}}></View>
                    <View style={{height: Global.State[this.props.ModelID].ScrollPadding}}></View>
                    <Animated.View key={'Footer_Padding'} style={{position: 'relative', backgroundColor: 'transparent', height: Global.State[this.props.ModelID].FooterPadding}}>
                    </Animated.View>

                </ScrollView>
            );

        } catch (ex) {
            global.Log({Message: 'AccountForm.renderBody>>' + ex.message});
        }
    };
    renderProperties() {
        try {
            let _UI = [];
            if (Global.State[this.props.ModelID].Schema?.SchemaPropertyList?.length > 0) {
                for (let _SchemaPropertyIndex = 0; _SchemaPropertyIndex < Global.State[this.props.ModelID].Schema.SchemaPropertyList.length; _SchemaPropertyIndex++) {
                    let _SchemaProperty = Global.State[this.props.ModelID].Schema.SchemaPropertyList[_SchemaPropertyIndex];
                    _UI.push(
                        <ElementControl
                            key={'SchemaProperty_' + _SchemaPropertyIndex}
                            Name={_SchemaProperty.SchemaPropertyName}
                            Value={Global.State[this.props.ModelID].Account[_SchemaProperty.SchemaPropertyID]}
                            Changed={(Text_Value) => {
                                Global.State[this.props.ModelID].Account[_SchemaProperty.SchemaPropertyID] = Text_Value;
                                this.CheckDirty();
                            }}
                            MarginTop={10}
                            Editable={Global.State[this.props.ModelID].ActiveWindow}
                        />
                    );
                }
                return _UI;
            }
        } catch (ex) {
            global.Log({Message: 'AccountForm.renderProperties>>' + ex.message});
        }
    };
    renderAccountSubscriptionList() {
        try {
            let _UI = [];
            if (Global.State[this.props.ModelID].AccountSubscriptionList?.length > 0) {
                for (let _AccountSubscriptionIndex = 0; _AccountSubscriptionIndex < Global.State[this.props.ModelID].AccountSubscriptionList.length; _AccountSubscriptionIndex++) {
                    let _AccountSubscription = Global.State[this.props.ModelID].AccountSubscriptionList[_AccountSubscriptionIndex];

                    let _BorderColor = Global.Theme.Body.BackgroundFade;
                    let _Expiry = new Date(_AccountSubscription.AccountSubscriptionExpiry + 'Z');
                    if (_Expiry > new Date()) {
                        _BorderColor = Global.Theme.Highlight.BackgroundFade;
                    } else {
                        _BorderColor = Global.Theme.Highlight.BackgroundFade;
                    }
                    if (_AccountSubscriptionIndex > 0) {
                        _UI.push(
                            <View key={'AccountSubscriptionBreaker_' + _AccountSubscriptionIndex} style={{flex: 1, height: 1, backgroundColor: Global.Theme.Body.BackgroundFade, marginLeft: 10, marginRight: 10}}></View>
                        );
                    }

                    _UI.push(
                        <Pressable 
                            key={'AccountSubscriptionList_' + _AccountSubscriptionIndex}
                            onPress={() => this.AccountSubscriptionForm.Show({
                                AccountID: Global.State[this.props.ModelID].Account.AccountID,
                                AccountSubscriptionID: _AccountSubscription.AccountSubscriptionID,
                                SaveCallback: async () => {
                                    try {
                                        Global.State[this.props.ModelID].AccountSubscriptionList = await AccountSubscriptionHelper.GetList({ SearchAccountID: Global.State[this.props.ModelID].Account.AccountID});
                                        this.forceUpdate();
                                    } catch (ex) {
                                        global.Log({Message: 'AccountForm.SaveAccountSubscription>>' + ex.message, Notify: true});
                                    }
                                },
                                DeleteCallback: async () => {
                                    try {
                                        Global.State[this.props.ModelID].AccountSubscriptionList = await AccountSubscriptionHelper.GetList({ SearchAccountID: Global.State[this.props.ModelID].Account.AccountID});
                                        this.forceUpdate();
                                    } catch (ex) {
                                        global.Log({Message: 'AccountForm.DeleteAccountSubscription>>' + ex.message, Notify: true});
                                    }
                                },
                            })}
                            style={({pressed}) => [{flex: 1, opacity: pressed ? .7 : 1}]}
                        >
                            <View style={{flex: 1, flexDirection: 'row'}}>
                                <View style={{width: 3, backgroundColor: _BorderColor, borderTopLeftRadius: 4, borderBottomLeftRadius: 4}}></View>
                                <View style={{flex: 1, padding: 10}}>
                                    <Text style={{color: Global.Theme.Body.ForegroundFade, fontSize: 11}}>{_AccountSubscription.AccountSubscriptionExpiry !== null ? Global.FormatShortDate(_Expiry.getFullYear(), _Expiry.getMonth() + 1, _Expiry.getDate()) : 'No Expiry'}</Text>
                                    <Text style={{color: Global.Theme.Body.ForegroundFade, fontSize: 11}}>{_AccountSubscription.AccountSubscriptionProductName?.length > 0 ? _AccountSubscription.AccountSubscriptionProductName : 'No Product'}</Text>
                                    <Text style={{marginTop: 4, color: Global.Theme.Body.ForegroundColor}}>{_AccountSubscription.AccountSubscriptionID}</Text>
                                </View>
                                <View style={{width: 50, alignItems: 'center', justifyContent: 'center'}}>
                                    <Image source={Global.Theme.Body.Icons.Forward} style={{width: 20, height: 20}} />
                                </View>
                            </View>
                        </Pressable>
                    );

                }
            } else {
                _UI.push(
                    <View key={'AccountSubscriptionList_Empty'} style={{flex: 1, height: 50, alignItems: 'center', justifyContent: 'center'}}>
                        <Text style={{color: Global.Theme.Body.ForegroundColor, opacity: .5}}>No Subscriptions</Text>
                    </View>
                );
            }
            return (
                <View style={{marginTop: 20, marginLeft: 10, marginRight: 10}}>
                    <View style={{flex: 1, height: 50, flexDirection: 'row'}}>
                        <View style={{flex: 1, justifyContent: 'center'}}>
                            <Text style={{fontSize: 20, fontWeight: 'bold', color: Global.Theme.Body.ForegroundColor}}>Subscriptions</Text>
                        </View>
                        <Pressable
                            onPress={() => {
                                this.AccountSubscriptionForm.Show({
                                    AccountID: Global.State[this.props.ModelID].Account.AccountID,
                                    AccountSubscriptionID: null,
                                    SaveCallback: async (AccountSubscription_Value) => {
                                        try {
                                            Global.State[this.props.ModelID].AccountSubscriptionList = await AccountSubscriptionHelper.GetList({ SearchAccountID: Global.State[this.props.ModelID].Account.AccountID });
                                            this.forceUpdate();
                                        } catch (ex) {
                                            global.Log({Message: 'AccountForm.>>' + ex.message, Notify: true});
                                        }
                                    }
                                });
                            }}
                            style={({pressed}) => [{width: 50, height: 50, alignItems: 'center', justifyContent: 'center', opacity: pressed ? .5 : 1}]}
                        >
                            <Image source={Global.Theme.Body.Icons.Add} style={{width: 28, height: 28}} />
                        </Pressable>
                    </View>
                    <View style={{backgroundColor: Global.Theme.Body.ControlBackground, borderRadius: 4}}>
                        {_UI}
                    </View>
                </View>
            );
        } catch (ex) {
            global.Log({Message: 'AccountForm.renderAccountSubscriptionList>>' + ex.message});
        }
    };
    renderTransactionList() {
        try {
            let _UI = [];
            if (Global.State[this.props.ModelID].TransactionList !== null && Global.State[this.props.ModelID].TransactionList.length > 0) {
                for (let _TransactionIndex = 0; _TransactionIndex < Global.State[this.props.ModelID].TransactionList.length; _TransactionIndex++) {
                    let _Transaction = Global.State[this.props.ModelID].TransactionList[_TransactionIndex];

                    let _BorderColor = Global.Theme.Body.BackgroundFade;
                    if (_Transaction.TransactionPaymentType === 'unpaid') {
                        _BorderColor = '#ff392e'
                    } else {
                        _BorderColor = Global.Theme.Highlight.BackgroundFade;
                    }

                    let _TransactionDate = new Date(_Transaction.TransactionDate);
                    
                    if (_TransactionIndex > 0) {
                        _UI.push(
                            <View key={'TransactionBreaker_' + _TransactionIndex} style={{flex: 1, height: 1, backgroundColor: Global.Theme.Body.BackgroundFade, marginLeft: 10, marginRight: 10}}></View>
                        );
                    }

                    _UI.push(
                        <Pressable 
                            key={'TransactionList_' + _TransactionIndex}
                            onPress={() => global.root.ShowTransaction({
                                TransactionID: _Transaction.TransactionID,
                                SaveCallback: async () => {
                                    try {
                                        Global.State[this.props.ModelID].TransactionList = await TransactionHelper.GetList({SearchAccountID: Params_Value.AccountID, SearchLimit: 25, SearchOffset: 0});
                                        this.forceUpdate();
                                    } catch (ex) {
                                        global.Log({Message: 'AccountForm.DeleteTransaction>>' + ex.message, Notify: true});
                                    }
                                },
                                DeleteCallback: async () => {
                                    try {
                                        Global.State[this.props.ModelID].TransactionList = await TransactionHelper.GetList({SearchAccountID: Params_Value.AccountID, SearchLimit: 25, SearchOffset: 0});
                                        this.forceUpdate();
                                    } catch (ex) {
                                        global.Log({Message: 'AccountForm.DeleteTransaction>>' + ex.message, Notify: true});
                                    }
                                },
                            })}
                            style={({pressed}) => [{flex: 1, opacity: pressed ? .7 : 1}]}
                        >
                            <View style={{flex: 1, flexDirection: 'row'}}>
                                <View style={{width: 3, backgroundColor: _BorderColor, borderRadius: 4}}></View>
                                <View style={{flex: 1, padding: 10}}>
                                    <Text style={{color: Global.Theme.Body.ForegroundColor, opacity: .5, fontSize: 11, marginTop: 4}}>${Global.FormatNumber(_Transaction.TransactionTotal, 2, '.' , ',')} on {Global.FormatShortDate(_TransactionDate.getFullYear(), _TransactionDate.getMonth() + 1, _TransactionDate.getDate()) + ' (' + (_Transaction.TransactionPaymentType === 'unpaid' ? 'Unpaid' : 'Paid') + ')'}</Text>
                                    <Text style={{marginTop: 4, color: Global.Theme.Body.ForegroundColor}}>{_Transaction.TransactionNumber}</Text>
                                </View>
                                <View style={{width: 50, alignItems: 'center', justifyContent: 'center'}}>
                                    <Image source={global.ColorScheme === 'dark' ? IMG_Next_eeeeee : IMG_Next_121212} style={{width: 20, height: 20}} />
                                </View>
                            </View>
                        </Pressable>
                    );

                }
            } else {
                _UI.push(
                    <View key={'TransactionList_No_Transactions'} style={{flex: 1, height: 50, alignItems: 'center', justifyContent: 'center'}}>
                        <Text style={{color: Global.Theme.Body.ForegroundColor, opacity: .5}}>No Transactions</Text>
                    </View>
                );
            }
            return (
                <View style={{marginTop: 20, marginLeft: 10, marginRight: 10}}>
                    <View style={{flex: 1, height: 50, justifyContent: 'center'}}>
                        <Text style={{fontSize: 20, fontWeight: 'bold', color: Global.Theme.Body.ForegroundColor}}>Transactions</Text>
                    </View>
                    <View style={{backgroundColor: Global.Theme.Body.ControlBackground, borderRadius: 4}}>
                        {_UI}
                    </View>
                </View>
            );
        } catch (ex) {
            global.Log({Message: 'AccountForm.renderTransactionList>>' + ex.message});
        }
    };
    renderPersonList() {
        try {
            let _UI = [];
            if (Global.State[this.props.ModelID].PersonList !== null && Global.State[this.props.ModelID].PersonList.length > 0) {

                let _ActiveDate = new Date();
                _ActiveDate.setDate(_ActiveDate.getDate() - 60);  

                for (let _PersonIndex = 0; _PersonIndex < Global.State[this.props.ModelID].PersonList.length; _PersonIndex++) {
                    
                    let _Person = Global.State[this.props.ModelID].PersonList[_PersonIndex];
                    let _ActivityDate = new Date(_Person.PersonActivity);
                    let _LastActive = null;
                    if (_ActivityDate > _ActiveDate) {
                        _LastActive = (
                            <Text style={{color: Global.Theme.Body.ForegroundColor, opacity: .5, fontSize: 11}}>Active on {Global.FormatShortDate(_ActivityDate.getFullYear(), parseInt(_ActivityDate.getMonth() + 1), _ActivityDate.getDate())}</Text>                                    
                        );
                    }
                    
                    if (_PersonIndex > 0) {
                        _UI.push(
                            <View key={'PersonBreaker_' + _PersonIndex} style={{flex: 1, height: 1, backgroundColor: Global.Theme.Body.BackgroundFade, marginLeft: 10, marginRight: 10}}></View>
                        );
                    }

                    _UI.push(
                        <Pressable 
                        key={'PersonList_' + _PersonIndex}
                        onPress={() => {
                            this.AccountPersonForm.Show({
                                AccountID: Global.State[this.props.ModelID].Account.AccountID,
                                AccountPersonID: _Person.PersonID,
                                SaveCallback: async () => {
                                    try {
                                        Global.State[this.props.ModelID].PersonList = await PersonHelper.GetList({SearchAccountID: Global.State[this.props.ModelID].Account.AccountID});
                                        this.forceUpdate();
                                    } catch (ex) {
                                        global.Log({Message: 'AccountForm.DeleteTransaction>>' + ex.message, Notify: true});
                                    }
                                },
                                DeleteCallback: async () => {
                                    try {
                                        Global.State[this.props.ModelID].PersonList = await PersonHelper.GetList({SearchAccountID: Global.State[this.props.ModelID].Account.AccountID});
                                        this.forceUpdate();
                                    } catch (ex) {
                                        global.Log({Message: 'AccountForm.DeleteTransaction>>' + ex.message, Notify: true});
                                    }
                                },
                            });
                        }}
                        style={({pressed}) => [{flex: 1, opacity: pressed ? .5 : 1}]}
                        >
                            <View style={{flex: 1, flexDirection: 'row'}}>
                                <View style={{width: 3, backgroundColor: _LastActive !== null ? Global.Theme.Highlight.BackgroundColor : Global.Theme.Body.BackgroundFade, borderRadius: 4, opacity: .5}}></View>
                                <View style={{flex: 1, padding: 10}}>
                                    {_LastActive}
                                    <Text style={{color: Global.Theme.Body.ForegroundColor, opacity: .5, fontSize: 11, marginTop: 4}}>{_Person.PersonEmail}</Text>
                                    <Text style={{marginTop: 4, color: Global.Theme.Body.ForegroundColor}}>{_Person.PersonName}</Text>
                                </View>
                                <View style={{width: 50, alignItems: 'center', justifyContent: 'center'}}>
                                    <Image source={global.ColorScheme === 'dark' ? IMG_Next_eeeeee : IMG_Next_121212} style={{width: 20, height: 20}} />
                                </View>
                            </View>
                        </Pressable>
                    );

                }

            } else {
                _UI.push(
                    <View key={'PersonList_No_People'} style={{flex: 1, height: 50, alignItems: 'center', justifyContent: 'center'}}>
                        <Text style={{color: Global.Theme.Body.ForegroundColor, opacity: .5}}>No People</Text>
                    </View>
                );
            }
            return (
                <View style={{marginTop: 20, marginLeft: 10, marginRight: 10}}>
                    <View style={{flex: 1, height: 50, flexDirection: 'row'}}>
                        <View style={{flex: 1, justifyContent: 'center'}}>
                            <Text style={{fontSize: 20, fontWeight: 'bold', color: Global.Theme.Body.ForegroundColor}}>People</Text>
                        </View>
                        <Pressable
                            onPress={() => {
                                this.PersonPicker.Show({
                                    SelectCallback: async (Person_Value) => {
                                        try {
                                            await AccountPersonHelper.Save({
                                                AccountID: Global.State[this.props.ModelID].Account.AccountID,
                                                AccountPersonID: Person_Value.PersonID,
                                            });
                                            Global.State[this.props.ModelID].PersonList = await PersonHelper.GetList({SearchAccountID: Global.State[this.props.ModelID].Account.AccountID});
                                            this.forceUpdate();
                                        } catch (ex) {
                                            global.Log({Message: 'AccountForm.SaveAccountPerson>>' + ex.message, Notify: true});
                                        }
                                    }
                                });
                            }}
                            style={({pressed}) => [{width: 50, height: 50, alignItems: 'center', justifyContent: 'center', opacity: pressed ? .5 : 1}]}
                        >
                            <Image source={Global.Theme.Body.Icons.Add} style={{width: 28, height: 28}} />
                        </Pressable>
                    </View>
                    <View style={{backgroundColor: Global.Theme.Body.ControlBackground, borderRadius: 4}}>
                        {_UI}
                    </View>
                </View>
            );
        } catch (ex) {
            global.Log({Message: 'AccountForm.renderPersonList>>' + ex.message});
        }
    };
    renderFooter() {
        try {
            return (
                <Animated.View key={'Footer_Row'} style={[Styles.v3_footer_container, {bottom: Global.State[this.props.ModelID].FooterOffset}]}>
                    <View style={{position: 'absolute', top: 0, left: 10, right: 10, height: 60, backgroundColor: Global.Theme.Footer.BackgroundColor, borderRadius: 6, opacity: .5}}></View>
                    <Pressable style={({pressed}) => [{width: 150, height: 40, marginLeft: 10, backgroundColor: '#c06e6e', opacity: pressed ? .7 : 1, borderRadius: 4, alignItems: 'center', justifyContent: 'center'}]} onPress={() => this.CancelAccount() }>
                        <Text style={{fontWeight: 'bold', color: Global.Theme.Highlight.ForegroundColor}}>Cancel</Text>
                    </Pressable>
                    <View style={{flex: 1}}></View>
                    <Pressable style={({pressed}) => [{width: 150, height: 40, marginRight: 10, backgroundColor: Global.Theme.Highlight.BackgroundColor, opacity: pressed ? .7 : 1, borderRadius: 4, alignItems: 'center', justifyContent: 'center'}]} onPress={() => this.SaveAccount() }>
                        <Text style={{fontWeight: 'bold', color: Global.Theme.Highlight.ForegroundColor}}>Save</Text>
                    </Pressable>
                </Animated.View>
            );
        } catch (ex) {
            global.Log({Message: 'AccountForm.renderFooter>>' + ex.message, Notify: true});
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
            global.Log({Message: 'AccountForm.renderSwipeBack>>' + ex.message});
        }
    };
};