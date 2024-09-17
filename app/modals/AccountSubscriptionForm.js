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
module.exports = class AccountSubscriptionForm extends Component {
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
            global.Log({Message: 'SubscriptionForm.IsActive>>' + ex.message});
        }
    };
    async Show(Params_Value) {
        try {
            global.root.NotificationModal.Show({ NotificationTitle: 'Loading...', NotificationStyle: 'Wait' });
            let _ViewWidth = Global.ScreenX > 600 ? 600 : Global.ScreenX;

            let _AccountSubscription = null;
            if (Params_Value.hasOwnProperty('AccountID') 
            && Params_Value.hasOwnProperty('AccountSubscriptionID')) {
                _AccountSubscription = await AccountSubscriptionHelper.GetOne({
                    AccountID: Params_Value.AccountID,
                    AccountSubscriptionID: Params_Value.AccountSubscriptionID
                });
            }

            if (_AccountSubscription === null) {
                _AccountSubscription = {
                    AccountSubscriptionID: '',
                    AccountSubscriptionProductID: null,
                    AccountSubscriptionProductName: null,
                    AccountSubscriptionExpiry: null,
                    AccountSubscriptionCreated: null,
                    AccountSubscriptionUpdated: null
                }
            }

            //Create State
            Global.State[this.props.ModelID] = {
                PageTitle: _AccountSubscription?.AccountSubscriptionID?.length > 0 ? 'EDIT SUBSCRIPTION' : 'NEW SUBSCRIPTION',
                AccountID: Params_Value.hasOwnProperty('AccountID') ? Params_Value.AccountID : null,
                AccountSubscription: JSON.parse(JSON.stringify(_AccountSubscription)),
                AccountSubscriptionSnapshot: JSON.parse(JSON.stringify(_AccountSubscription)),
                AccountSubscriptionDirty: false,
                SaveCallback: Params_Value.hasOwnProperty('SaveCallback') ? Params_Value.SaveCallback : null,
                DeleteCallback: Params_Value.hasOwnProperty('DeleteCallback') ? Params_Value.DeleteCallback : null,
                Schema: await SchemaHelper.GetOne({SchemaID: 'AccountSubscription'}),
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
            global.Log({Message: 'SubscriptionForm.Show>>' + ex.message, Notify: true});
        }
    };
    CheckDirty() {
        try {
            let _AccountSubscriptionDirty = (JSON.stringify(Global.State[this.props.ModelID].AccountSubscriptionSnapshot).trim() !== JSON.stringify(Global.State[this.props.ModelID].AccountSubscription).trim());
            if (_AccountSubscriptionDirty !== Global.State[this.props.ModelID].AccountSubscriptionDirty) {
                Global.State[this.props.ModelID].AccountSubscriptionDirty = _AccountSubscriptionDirty;
                if (Global.State[this.props.ModelID] !== null && Global.State[this.props.ModelID].FooterOffset !== null) {
                    if (Global.State[this.props.ModelID].AccountSubscriptionDirty) {
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
            global.Log({Message: 'SubscriptionForm.CheckDirty>>' + ex.message, Notify: true});
        }
    };
    SaveSubscription() {
        try {
            this.ClearFocus();
            setTimeout(async () => {
                try {

                    await global.root.NotificationModal.Show({ NotificationTitle: 'Saving...', NotificationStyle: 'Wait' });

                    //Create change object
                    let _Change = {
                        AccountID: Global.State[this.props.ModelID].AccountID,
                        AccountSubscriptionID: Global.State[this.props.ModelID].AccountSubscription.AccountSubscriptionID,
                    }

                    //Include Account Subscription Product ID
                    if (Global.State[this.props.ModelID].AccountSubscription.AccountSubscriptionProductID !== Global.State[this.props.ModelID].AccountSubscriptionSnapshot.AccountSubscriptionProductID) {
                        _Change.AccountSubscriptionProductID = Global.State[this.props.ModelID].AccountSubscription.AccountSubscriptionProductID;
                    }

                    //Include Account Subscription Expiry Date
                    if (Global.State[this.props.ModelID].AccountSubscription.AccountSubscriptionExpiry !== Global.State[this.props.ModelID].AccountSubscriptionSnapshot.AccountSubscriptionExpiry) {
                        _Change.AccountSubscriptionExpiry = Global.State[this.props.ModelID].AccountSubscription.AccountSubscriptionExpiry;
                    }

                    //Check for change on the extended properties
                    if (Global.State[this.props.ModelID].Schema?.SchemaPropertyList?.length > 0) {
                        for (let _SchemaPropertyIndex = 0; _SchemaPropertyIndex < Global.State[this.props.ModelID].Schema.SchemaPropertyList.length; _SchemaPropertyIndex++) {
                            let _SchemaProperty = Global.State[this.props.ModelID].Schema.SchemaPropertyList[_SchemaPropertyIndex];

                            if (Global.State[this.props.ModelID].AccountSubscription.hasOwnProperty(_SchemaProperty.SchemaPropertyID)
                            && Global.State[this.props.ModelID].AccountSubscription[_SchemaProperty.SchemaPropertyID] !== Global.State[this.props.ModelID].AccountSubscriptionSnapshot[_SchemaProperty.SchemaPropertyID]) {
                                _Change[_SchemaProperty.SchemaPropertyID] = Global.State[this.props.ModelID].AccountSubscription[_SchemaProperty.SchemaPropertyID];                                
                            }

                        }
                    }                    

                    //Save the account subscription
                    if (Object.keys(_Change).length > 2) {

                        //Save the account subscription
                        let _AccountSubscription = await AccountSubscriptionHelper.Save(_Change);
                        if (_AccountSubscription !== null) {
                            Global.State[this.props.ModelID].AccountSubscription = JSON.parse(JSON.stringify(_AccountSubscription));
                            Global.State[this.props.ModelID].AccountSubscriptionSnapshot = JSON.parse(JSON.stringify(_AccountSubscription));
                        }
    
                        //Run callback
                        if (Global.State[this.props.ModelID].SaveCallback !== null) {
                            Global.State[this.props.ModelID].SaveCallback(AccountSubscriptionHelper.Clone(Global.State[this.props.ModelID].AccountSubscription));
                        }

                        this.CheckDirty();
                        global.root.NotificationModal.Hide();

                    } else {
                        global.root.NotificationModal.Show({ NotificationTitle: 'No Changes', NotificationStyle: 'Toast' });
                    }

                } catch (ex) {
                    global.Log({Message: 'SubscriptionForm.SaveSubscription>>' + ex.message, Notify: true});
                }
            }, Platform.OS === 'macos' || Platform.OS === 'windows' ? 50 : 1);
        } catch (ex) {
            global.Log({Message: 'SubscriptionForm.SaveSubscription>>' + ex.message, Notify: true});
        }
    };
    CancelSubscription() {
        try {
            this.ClearFocus();
            setTimeout(async () => {
                try {
                    Global.State[this.props.ModelID].AccountSubscription = AccountSubscriptionHelper.Clone(Global.State[this.props.ModelID].AccountSubscriptionSnapshot);
                    this.CheckDirty();
                } catch (ex) {
                    global.Log({Message: 'SubscriptionForm.CancelSubscription>>' + ex.message, Notify: true});
                }
            }, Platform.OS === 'macos' || Platform.OS === 'windows' ? 50 : 1);
        } catch (ex) {
            global.Log({Message: 'SubscriptionForm.CancelSubscription>>' + ex.message, Notify: true});
        }
    };
    DeleteSubscription() {
        try {
            this.ClearFocus();
            global.root.ConfirmModal.Show('Just Checking...', 'Are you sure you want to delete this account subscription?', 'Yes', 'No', async () => {
                try {
                    if (Global.State[this.props.ModelID].AccountSubscription !== null
                    && Global.State[this.props.ModelID].AccountSubscription.AccountSubscriptionID !== null) {
                        await global.root.NotificationModal.Show({ NotificationTitle: 'Deleting...', NotificationStyle: 'Wait' });
                        await AccountSubscriptionHelper.Delete({ 
                            AccountID: Global.State[this.props.ModelID].AccountID,
                            AccountSubscriptionID: Global.State[this.props.ModelID].AccountSubscription.AccountSubscriptionID
                        });
                        if (Global.State[this.props.ModelID].DeleteCallback !== null) {
                            Global.State[this.props.ModelID].DeleteCallback(Global.State[this.props.ModelID].AccountSubscription.AccountSubscriptionID);
                        }
                        global.root.NotificationModal.Hide();
                        this.Hide();
                    } else {
                        this.Hide();
                    }
                } catch (ex) {
                    global.Log({Message: 'SubscriptionForm.DeleteSubscription>>' + ex.message, Notify: true});
                }
            }, () => {
                //Cancel - Do Nothing
            });
        } catch (ex) {
            global.Log({Message: 'SubscriptionForm.DeleteSubscription>>' + ex.message, Notify: true});
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
            global.Log({Message: 'SubscriptionForm.ActiveHandler>>' + ex.message});
        }
    };
    BackHandler() {
        try {
            this.Hide();
        } catch (ex) {
            global.Log({Message: 'SubscriptionForm.BackHandler>>' + ex.message});
        }
    };
    KeyboardHandler(action, keyboardheight) {
        try {
            //Do Nothing
        } catch (ex) {
            global.Log({Message: 'SubscriptionForm.KeyboardHandler>>' + ex.message});
        }
    };
    ShortcutHandler(Shortcut_Value) {
        try {
            //Do Nothing
        } catch (ex) {
            global.Log({Message: 'SubscriptionForm.ShortcutHandler>>' + ex.message});
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
            global.Log({Message: 'SubscriptionForm.Hide>>' + ex.message});
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
            global.Log({Message: 'SubscriptionForm.ClearFocus>>' + ex.message, Notify: true});
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
            global.Log({Message: 'SubscriptionForm.render>>' + ex.message});
        }
    };
    renderHeader() {
        try {
            return (
                <Pressable style={{paddingTop: Global.InsetTop}} onPress={() => { this.ClearFocus() }}>
                    <View ref={ele => this.Titlebar = ele} style={{ height: 70, flexDirection:'row', padding: 10, enableFocusRing: false}}>
                        <Pressable
                            onPress={() => {
                                if (Global.State[this.props.ModelID].AccountSubscriptionDirty) {
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
                            onPress={() => this.DeleteSubscription()}
                            style={({pressed}) => [{width: 50, height: 50, alignItems: 'center', justifyContent: 'center', opacity: pressed ? .5 : 1}]}
                        >
                            <Image source={Global.Theme.Header.Icons.Trash} style={{width: 24, height: 24}} />
                        </Pressable>
                    </View>
                </Pressable>
            );
        } catch (ex) {
            global.Log({Message: 'SubscriptionForm.renderHeader>>' + ex.message});
        }
    };
    renderBody() {
        try {

            //Copy ID
            let _CopyUI = null;
            if (Global.State[this.props.ModelID].PageTitle === 'EDIT SUBSCRIPTION') {
                _CopyUI = (
                    <Pressable
                        onPress={async () => {
                            try {
                                if (Platform.OS === 'windows' || Platform.OS === 'macos') {
                                    await TurboModuleRegistry.get('RNClipboard').SetString(Global.State[this.props.ModelID].AccountSubscription.AccountSubscriptionID);
                                } else {
                                    await NativeModules.RNClipboard.setString(Global.State[this.props.ModelID].AccountSubscription.AccountSubscriptionID);
                                }
                                global.root.NotificationModal.Show({ NotificationTitle: 'Copied!', NotificationStyle: 'Toast' });
                            } catch (ex) {
                                global.Log({Message: 'SubscriptionForm.renderBody.CopyID>>' + ex.message, Notify: true});
                            }
                        }}
                        style={({pressed}) => [{width: 50, height: 50, marginTop: 4, alignItems: 'center', justifyContent: 'center', opacity: pressed ? .7 : 1}]}
                    >
                        <Image source={global.ColorScheme === 'dark' ? IMG_Copy_eeeeee : IMG_Copy_121212} style={{width: 24, height: 24}} />
                    </Pressable>
                );
            }

            //Expiry Date
            let _Expiry = Global.State[this.props.ModelID].AccountSubscription.AccountSubscriptionExpiry !== null ? new Date(Global.State[this.props.ModelID].AccountSubscription.AccountSubscriptionExpiry) : null;

            //Created Date
            let _CreatedDescription = null;
            if (Global.State[this.props.ModelID].AccountSubscription.AccountSubscriptionCreated !== null) {
                let _CreatedDate = new Date(Global.State[this.props.ModelID].AccountSubscription.AccountSubscriptionCreated);
                _CreatedDescription = Global.FormatShortDate(_CreatedDate.getFullYear(), _CreatedDate.getMonth() + 1, _CreatedDate.getDate());
                if (_CreatedDate.getHours() < 12) {
                    _CreatedDescription += ' ' + parseInt(_CreatedDate.getHours() + 12).toString() + ':' + _CreatedDate.getMinutes() + ':' + _CreatedDate.getSeconds() + 'AM';
                } else if (_CreatedDate.getHours() >= 12) {
                    _CreatedDescription += ' ' + parseInt(_CreatedDate.getHours() - 12).toString() + ':' + _CreatedDate.getMinutes() + ':' + _CreatedDate.getSeconds() + 'PM';
                }
            }

            
            //Updated Date
            let _UpdatedDescription = null;
            if (Global.State[this.props.ModelID].AccountSubscription.AccountSubscriptionUpdated !== null) {
                let _UpdatedDate = new Date(Global.State[this.props.ModelID].AccountSubscription.AccountSubscriptionUpdated);
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
                            Global.State[this.props.ModelID].AccountSubscription = await AccountSubscriptionHelper.GetOne({ AccountSubscriptionID: Global.State[this.props.ModelID].AccountSubscription.AccountSubscriptionID });
                            this.setState({Refreshing: false});
                        } catch (ex) {
                            global.Log({Message: 'SubscriptionForm.renderBody.RefreshControl>>' + ex.message, Notify: true});
                        }
                    }} />
                }>

                    {/* Account Subscription Details */}
                    <View style={{flex: 1, padding: 10}}>

                        {/* Account Subscription ID */}
                        <View style={{flex: 1, flexDirection: 'row'}}>
                            <ElementControl
                                Name={'ID'}
                                Value={Global.State[this.props.ModelID].AccountSubscription.AccountSubscriptionID}
                                Changed={(Text_Value) => {
                                    try {
                                        Global.State[this.props.ModelID].AccountSubscription.AccountSubscriptionID = Text_Value;
                                        this.CheckDirty();
                                    } catch (ex) {
                                        global.Log({Message: 'SubscriptionForm.renderBody.AccountSubscriptionID>>' + ex.message, Notify: true});
                                    }
                                }}
                                Casing={'upper'}
                                Editable={Global.State[this.props.ModelID].ActiveWindow}
                                Enabled={Global.State[this.props.ModelID].PageTitle === 'NEW SUBSCRIPTION'}
                            />
                            {_CopyUI}
                        </View>

                        {/* Account Subscription Product */}
                        <ElementControl
                            Name={'Product'}
                            Value={Global.State[this.props.ModelID].AccountSubscription.AccountSubscriptionProductName}
                            ValueType={'Autocomplete'}
                            Autocomplete={(Selected_Value) => {
                                try {
                                    if (Selected_Value.Match !== null) {
                                        Global.State[this.props.ModelID].AccountSubscription.AccountSubscriptionProductID = Selected_Value.Match.ProductID;
                                        Global.State[this.props.ModelID].AccountSubscription.AccountSubscriptionProductName = Selected_Value.Match.ProductName;
                                        if (Global.State[this.props.ModelID].AccountSubscription.AccountSubscriptionExpiry === null) {
                                            Global.State[this.props.ModelID].AccountSubscription.AccountSubscriptionExpiry = new Date();
                                            if (Selected_Value.Match.ProductPriceUnit === 'year') {
                                                Global.State[this.props.ModelID].AccountSubscription.AccountSubscriptionExpiry.setDate(Global.State[this.props.ModelID].AccountSubscription.AccountSubscriptionExpiry.getDate() + 365);
                                            } else if (Selected_Value.Match.ProductPriceUnit === 'month') {
                                                let _NextMonth = new Date(Global.State[this.props.ModelID].AccountSubscription.AccountSubscriptionExpiry.getFullYear(), Global.State[this.props.ModelID].AccountSubscription.AccountSubscriptionExpiry.getMonth() + 1, 1);
                                                let _LastDayOfMonth = new Date(_NextMonth.getTime() - 1);
                                                Global.State[this.props.ModelID].AccountSubscription.AccountSubscriptionExpiry.setDate(Global.State[this.props.ModelID].AccountSubscription.AccountSubscriptionExpiry.getDate() + _LastDayOfMonth.getDate());
                                            } else if (Selected_Value.Match.ProductPriceUnit === 'each') {
                                                Global.State[this.props.ModelID].AccountSubscription.AccountSubscriptionExpiry.setFullYear(9999, 11, 31);
                                            }
                                        }
                                    } else {
                                        Global.State[this.props.ModelID].AccountSubscription.AccountSubscriptionProductID = null;
                                        Global.State[this.props.ModelID].AccountSubscription.AccountSubscriptionExpiry = null;
                                    }
                                    this.CheckDirty();
                                } catch (ex) {
                                    global.Log({Message: 'SubscriptionForm.renderBody.Autocomplete>>' + ex.message, Notify: true});
                                }
                            }}
                            AutocompleteSource={'PRODUCTS'}
                            Casing={'upper'}
                            MarginTop={10}
                            Editable={Global.State[this.props.ModelID].ActiveWindow}
                            Enabled={true}
                            Visible={true}
                        />

                        {/* Account Subscription Expires */}
                        <ElementControl 
                            Name={'Subscription Expires'}
                            Value={_Expiry !== null ? Global.FormatShortDate(_Expiry.getFullYear(), _Expiry.getMonth() + 1, _Expiry.getDate()) : null} 
                            Pressed={() => {
                                try {
                                    let _SelectedDate = (_Expiry !== null ? _Expiry : new Date())
                                    global.root.CalendarModal.Show({
                                        SelectedYear: _SelectedDate.getFullYear(),
                                        SelectedMonth: parseInt(_SelectedDate.getMonth() + 1),
                                        SelectedDay: _SelectedDate.getDate(),
                                        MaximumYear: 2099,
                                        MaximumMonth: 31,
                                        MaximumDay: 31,
                                        Callback: (SelectedYear_Value, SelectedMonth_Value, SelectedDay_Value) => {
                                            try {
                                                let _Expiry = new Date(Date.UTC(SelectedYear_Value, parseInt(SelectedMonth_Value - 1), SelectedDay_Value, 23, 59, 59));
                                                if (_Expiry > new Date()) {
                                                    Global.State[this.props.ModelID].AccountSubscription.AccountSubscriptionExpiry = _Expiry;
                                                } else {
                                                    Global.State[this.props.ModelID].AccountSubscription.AccountSubscriptionExpiry = null;
                                                }
                                                this.CheckDirty();
                                            } catch (ex) {
                                                global.Log({Message: 'SubscriptionForm.renderBody.ExpiryDate>>' + ex.message, Notify: true});
                                            }
                                        }
                                    });
                                } catch (ex) {
                                    global.Log({Message: 'SubscriptionForm.renderBody.ExpiryDate>>' + ex.message, Notify: true});
                                }
                            }}
                            MarginTop={10}
                            Editable={Global.State[this.props.ModelID].ActiveWindow} 
                            Enabled={true}
                            Visible={true}
                        />

                        {this.renderProperties()}

                        {/* Account Subscription Created / Updated */}
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
            global.Log({Message: 'SubscriptionForm.renderBody>>' + ex.message});
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
                            Value={Global.State[this.props.ModelID].AccountSubscription[_SchemaProperty.SchemaPropertyID]}
                            Changed={(Text_Value) => {
                                try {
                                    Global.State[this.props.ModelID].AccountSubscription[_SchemaProperty.SchemaPropertyID] = Text_Value;
                                    this.CheckDirty();
                                } catch (ex) {
                                    global.Log({Message: 'SubscriptionForm.renderProperties.Changed>>' + ex.message, Notify: true});
                                }
                            }}
                            MarginTop={10}
                            Editable={Global.State[this.props.ModelID].ActiveWindow}
                        />
                    );
                }
                return _UI;
            }
        } catch (ex) {
            global.Log({Message: 'AccountSubscriptionForm.renderProperties>>' + ex.message});
        }
    };
    renderFooter() {
        try {
            return (
                <Animated.View key={'Footer_Row'} style={[Styles.v3_footer_container, {bottom: Global.State[this.props.ModelID].FooterOffset}]}>
                    <View style={{position: 'absolute', top: 0, left: 10, right: 10, height: 60, backgroundColor: Global.Theme.Footer.BackgroundColor, borderRadius: 6, opacity: .5}}></View>
                    <Pressable style={({pressed}) => [{width: 150, height: 40, marginLeft: 10, backgroundColor: '#c06e6e', opacity: pressed ? .7 : 1, borderRadius: 4, alignItems: 'center', justifyContent: 'center'}]} onPress={() => this.CancelSubscription() }>
                        <Text style={{fontWeight: 'bold', color: Global.Theme.Highlight.ForegroundColor}}>Cancel</Text>
                    </Pressable>
                    <View style={{flex: 1}}></View>
                    <Pressable style={({pressed}) => [{width: 150, height: 40, marginRight: 10, backgroundColor: Global.Theme.Highlight.BackgroundColor, opacity: pressed ? .7 : 1, borderRadius: 4, alignItems: 'center', justifyContent: 'center'}]} onPress={() => this.SaveSubscription() }>
                        <Text style={{fontWeight: 'bold', color: Global.Theme.Highlight.ForegroundColor}}>Save</Text>
                    </Pressable>
                </Animated.View>
            );
        } catch (ex) {
            global.Log({Message: 'SubscriptionForm.renderFooter>>' + ex.message, Notify: true});
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
            global.Log({Message: 'SubscriptionForm.renderSwipeBack>>' + ex.message});
        }
    };
};