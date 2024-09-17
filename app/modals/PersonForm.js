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
module.exports = class PersonForm extends Component {
    constructor(props) {
        super(props);
        this.Titlebar = null;
        this.AccountForm = null;
        this.AccountPersonForm = null;
        this.CombinedLogSearch = null;
        this.TokenForm = null;
        this.PersonDeviceForm = null;
        this.state = {
            Refreshing: false
        }
    };
    IsActive() {
        try {
            return Global.State.hasOwnProperty(this.props.ModelID) && Global.State[this.props.ModelID] !== null;
        } catch (ex) {
            global.Log({Message: 'PersonForm.IsActive>>' + ex.message});
        }
    };
    async Show(Params_Value) {
        try {
            global.root.NotificationModal.Show({ NotificationTitle: 'Loading...', NotificationStyle: 'Wait' });

            let _ViewWidth = Global.ScreenX > 600 ? 600 : Global.ScreenX;

            let _Person = null;
            let _AccountList = [];
            let _TokenList = [];
            let _PersonDeviceList = [];
            if (Global.StringHasContent(Params_Value.PersonID)) {
                _Person = await PersonHelper.GetOne({ PersonID: Params_Value.PersonID });
                _AccountList = await AccountHelper.GetList({ SearchPersonID: Params_Value.PersonID });
                _TokenList = await TokenHelper.GetList({ SearchPersonID: Params_Value.PersonID, SearchExpired: false, SearchLimit: 25 });
                _PersonDeviceList = await PersonDeviceHelper.GetList({ SearchPersonID: Params_Value.PersonID });
            }

            //Create new person if not found
            if (_Person === null) {
                _Person = {
                    PersonID: null,
                    PersonGivenName: null,
                    PersonFamilyName: null,
                    PersonEmail: null,
                    PersonPhone: null,
                    PersonStreet1: null,
                    PersonStreet2: null,
                    PersonCity: null,
                    PersonState: null,
                    PersonCountry: null,
                    PersonPostCode: null,
                    PersonRoles: null,
                    PersonMarketing: null,
                    PersonActivity: null,
                    PersonCreated: null,
                    PersonUpdated: null,
                }
            }

            //Create State
            Global.State[this.props.ModelID] = {
                PageTitle: _Person?.PersonID?.length > 0 ? 'EDIT PERSON' : 'NEW PERSON',
                Person: JSON.parse(JSON.stringify(_Person)),
                PersonSnapshot: JSON.parse(JSON.stringify(_Person)),
                PersonDirty: false,
                SaveCallback: Params_Value.hasOwnProperty('SaveCallback') ? Params_Value.SaveCallback : null,
                DeleteCallback: Params_Value.hasOwnProperty('DeleteCallback') ? Params_Value.DeleteCallback : null,
                Schema: await SchemaHelper.GetOne({SchemaID: 'Person'}),
                AuthenticationCount: (_Person != null ? await CombinedLogHelper.GetCount({SearchType: 'authentication', SearchPersonID: _Person.PersonID}) : 0),
                ActivityCount: (_Person != null ? await CombinedLogHelper.GetCount({SearchType: 'activity', SearchPersonID: _Person.PersonID}) : 0),
                EmailCount: (_Person != null ? await CombinedLogHelper.GetCount({SearchType: 'email', SearchPersonID: _Person.PersonID}) : 0),
                ExceptionCount: (_Person != null ? await CombinedLogHelper.GetCount({SearchType: 'exception', SearchPersonID: _Person.PersonID}) : 0),
                AllowChat: Params_Value.hasOwnProperty('AllowChat') ? Params_Value.AllowChat : false,
                AccountList: _AccountList,
                TokenList: _TokenList,
                PersonDeviceList: _PersonDeviceList,
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
            global.Log({Message: 'PersonForm.Show>>' + ex.message, Notify: true});
        }
    };
    CheckDirty() {
        try {
            let _PersonDirty = (JSON.stringify(Global.State[this.props.ModelID].PersonSnapshot).trim() !== JSON.stringify(Global.State[this.props.ModelID].Person).trim());
            if (_PersonDirty !== Global.State[this.props.ModelID].PersonDirty) {
                Global.State[this.props.ModelID].PersonDirty = _PersonDirty;
                if (Global.State[this.props.ModelID] !== null && Global.State[this.props.ModelID].FooterOffset !== null) {
                    if (Global.State[this.props.ModelID].PersonDirty) {
                        Animated.timing(Global.State[this.props.ModelID].FooterOffset, {duration: 200, toValue: Global.InsetBottom, useNativeDriver: false}).start();
                        Animated.timing(Global.State[this.props.ModelID].FooterPadding, {duration: 200, toValue: 70, useNativeDriver: false}).start();
                    } else {
                        let _ScrollToBottom = false;
                        Animated.timing(Global.State[this.props.ModelID].FooterOffset, { duration: 200, toValue: -70, useNativeDriver: false}).start();
                        Animated.timing(Global.State[this.props.ModelID].FooterPadding, { duration: 200, toValue: 0, useNativeDriver: false}).start();
                    }
                }
            }
            this.forceUpdate();
        } catch (ex) {
            global.Log({Message: 'PersonForm.CheckDirty>>' + ex.message, Notify: true});
        }
    };
    async SavePerson() {
        try {
            this.ClearFocus();
            setTimeout(async () => {
                try {

                    global.root.NotificationModal.Show({ NotificationTitle: 'Loading...', NotificationStyle: 'Wait' });

                    //Change Object
                    let _Change = {
                        PersonID: Global.State[this.props.ModelID].Person.PersonID
                    }

                    //Person Given Name
                    if (Global.State[this.props.ModelID].Person.PersonGivenName !== Global.State[this.props.ModelID].PersonSnapshot.PersonGivenName) {
                        _Change.PersonGivenName = Global.State[this.props.ModelID].Person.PersonGivenName;
                    }

                    //Person Family Name
                    if (Global.State[this.props.ModelID].Person.PersonFamilyName !== Global.State[this.props.ModelID].PersonSnapshot.PersonFamilyName) {
                        _Change.PersonFamilyName = Global.State[this.props.ModelID].Person.PersonFamilyName;
                    }

                    //Person Email
                    if (Global.State[this.props.ModelID].Person.PersonEmail !== Global.State[this.props.ModelID].PersonSnapshot.PersonEmail) {
                        _Change.PersonEmail = Global.State[this.props.ModelID].Person.PersonEmail;
                    }

                    //Person Phone
                    if (Global.State[this.props.ModelID].Person.PersonPhone !== Global.State[this.props.ModelID].PersonSnapshot.PersonPhone) {
                        _Change.PersonPhone = Global.State[this.props.ModelID].Person.PersonPhone;
                    }

                    //Person Street 1
                    if (Global.State[this.props.ModelID].Person.PersonStreet1 !== Global.State[this.props.ModelID].PersonSnapshot.PersonStreet1) {
                        _Change.PersonStreet1 = Global.State[this.props.ModelID].Person.PersonStreet1;
                    }

                    //Person Street 2
                    if (Global.State[this.props.ModelID].Person.PersonStreet2 !== Global.State[this.props.ModelID].PersonSnapshot.PersonStreet2) {
                        _Change.PersonStreet2 = Global.State[this.props.ModelID].Person.PersonStreet2;
                    }

                    //Person City
                    if (Global.State[this.props.ModelID].Person.PersonCity !== Global.State[this.props.ModelID].PersonSnapshot.PersonCity) {
                        _Change.PersonCity = Global.State[this.props.ModelID].Person.PersonCity;
                    }

                    //Person State
                    if (Global.State[this.props.ModelID].Person.PersonState !== Global.State[this.props.ModelID].PersonSnapshot.PersonState) {
                        _Change.PersonState = Global.State[this.props.ModelID].Person.PersonState;
                    }

                    //Person Country
                    if (Global.State[this.props.ModelID].Person.PersonCountry !== Global.State[this.props.ModelID].PersonSnapshot.PersonCountry) {
                        _Change.PersonCountry = Global.State[this.props.ModelID].Person.PersonCountry;
                    }

                    //Person Post Code
                    if (Global.State[this.props.ModelID].Person.PersonPostCode !== Global.State[this.props.ModelID].PersonSnapshot.PersonPostCode) {
                        _Change.PersonPostCode = Global.State[this.props.ModelID].Person.PersonPostCode;
                    }

                    //Person Roles
                    if (Global.State[this.props.ModelID].Person.PersonRoles !== Global.State[this.props.ModelID].PersonSnapshot.PersonRoles) {
                        _Change.PersonRoles = Global.State[this.props.ModelID].Person.PersonRoles;
                    }

                    //Person Marketing
                    if (Global.State[this.props.ModelID].Person.PersonMarketing !== Global.State[this.props.ModelID].PersonSnapshot.PersonMarketing) {
                        _Change.PersonMarketing = Global.State[this.props.ModelID].Person.PersonMarketing;
                    }

                    //Check for change on the extended properties
                    if (Global.State[this.props.ModelID].Schema?.SchemaPropertyList?.length > 0) {
                        for (let _SchemaPropertyIndex = 0; _SchemaPropertyIndex < Global.State[this.props.ModelID].Schema.SchemaPropertyList.length; _SchemaPropertyIndex++) {
                            let _SchemaProperty = Global.State[this.props.ModelID].Schema.SchemaPropertyList[_SchemaPropertyIndex];

                            if (Global.State[this.props.ModelID].Person.hasOwnProperty(_SchemaProperty.SchemaPropertyID)
                            && Global.State[this.props.ModelID].Person[_SchemaProperty.SchemaPropertyID] !== Global.State[this.props.ModelID].PersonSnapshot[_SchemaProperty.SchemaPropertyID]) {
                                _Change[_SchemaProperty.SchemaPropertyID] = Global.State[this.props.ModelID].Person[_SchemaProperty.SchemaPropertyID];
                            }

                        }
                    }

                    //Save the person
                    _Change = await PersonHelper.Save(_Change);
                    if (_Change !== null) {

                        //Update the person object
                        Global.State[this.props.ModelID].Person = JSON.parse(JSON.stringify(_Change));
                        Global.State[this.props.ModelID].PersonSnapshot = JSON.parse(JSON.stringify(_Change));
                        this.CheckDirty();

                        //Run callbacks
                        if (Global.State[this.props.ModelID].SaveCallback !== null) {
                            Global.State[this.props.ModelID].SaveCallback(Global.State[this.props.ModelID].Person);
                        }
                        
                        global.root.NotificationModal.Hide();
                    } else {
                        global.root.NotificationModal.Hide();
                        this.Hide();
                    }

                } catch (ex) {
                    global.Log({Message: 'PersonForm.SavePerson>>' + ex.message, Notify: true});
                }
            }, Platform.OS === 'macos' || Platform.OS === 'windows' ? 50 : 1);
        } catch (ex) {
            global.Log({Message: 'PersonForm.SavePerson>>' + ex.message, Notify: true});
        }
    };
    CancelPerson() {
        try {
            this.ClearFocus();
            setTimeout(async () => {
                try {
                    Global.State[this.props.ModelID].Person = JSON.parse(JSON.stringify(Global.State[this.props.ModelID].PersonSnapshot));
                    this.CheckDirty();
                } catch (ex) {
                    global.Log({Message: 'PersonForm.CancelPerson>>' + ex.message, Notify: true});
                }
            }, Platform.OS === 'macos' || Platform.OS === 'windows' ? 50 : 1);
        } catch (ex) {
            global.Log({Message: 'PersonForm.CancelPerson>>' + ex.message, Notify: true});
        }
    };
    DeletePerson() {
        try {
            this.ClearFocus();
            global.root.ConfirmModal.Show('Just Checking...', 'Are you sure you want to delete this person?', 'Yes', 'No', async () => {
                try {
                    if (Global.State[this.props.ModelID].Person !== null && Global.State[this.props.ModelID].Person.PersonID !== null) {
                        await global.root.NotificationModal.Show({ NotificationTitle: 'Deleting...', NotificationStyle: 'Wait' });
                        await PersonHelper.Delete({PersonID: Global.State[this.props.ModelID].Person.PersonID});
                        if (Global.State[this.props.ModelID].DeleteCallback !== null) {
                            Global.State[this.props.ModelID].DeleteCallback(Global.State[this.props.ModelID].Person.PersonID);
                        }
                        global.root.NotificationModal.Hide();
                        this.Hide();
                    } else {
                        this.Hide();
                    }
                } catch (ex) {
                    global.Log({Message: 'PersonForm.DeletePerson>>' + ex.message, Notify: true});
                }
            }, () => {
                //Cancel - Do Nothing
            });
        } catch (ex) {
            global.Log({Message: 'PersonForm.DeletePerson>>' + ex.message, Notify: true});
        }
    };
    
    async LoadChat() {
        try {
            global.root.NotificationModal.Show({ NotificationTitle: 'Loading...', NotificationStyle: 'Wait' });
            let _Thread = await ThreadHelper.GetOne({ThreadID: 'SUPPORT-' + Global.State[this.props.ModelID].Person.PersonID});
            if (_Thread === null) {
                _Thread = await ThreadHelper.Save({
                    ThreadID: 'SUPPORT-' + Global.State[this.props.ModelID].Person.PersonID,
                    ThreadPersonList: [
                        {ThreadPersonID: '@support'},
                        {ThreadPersonID: Global.State[this.props.ModelID].Person.PersonID},
                    ],
                    ThreadStatus: 'active',
                })
            }
            global.root.ShowThread({Thread: _Thread, PersonID: Global.State[this.props.ModelID].Person.PersonID,
            DeleteCallback: (ThreadID_Value) => {
                this.forceUpdate();
            },
            ReadCallback: () => {
                this.forceUpdate();
            }});
        } catch (ex) {
            global.Log({Message: 'PersonForm.LoadChat>>' + ex.message, Notify: true});
        }
    };
    async LoadEmail() {
        try {
            global.root.NotificationModal.Show({ NotificationTitle: 'Loading...', NotificationStyle: 'Wait' });
            global.root.ShowEmail({EmailType: 'PERSON', EmailPersonID: Global.State[this.props.ModelID].Person.PersonID});
        } catch (ex) {
            global.Log({Message: 'PersonForm.LoadEmail>>' + ex.message, Notify: true});
        }
    };    

    //Handlers
    ActiveHandler() {
        try {

            //Handle ActiveWindow state
            let _ActiveWindow = false;
            if (this.AccountForm?.IsActive()) {
                this.AccountForm.ActiveHandler();
            } else if (this.AccountPersonForm?.IsActive()) {
                this.AccountPersonForm.ActiveHandler();
            } else if (this.CombinedLogSearch?.IsActive()) {
                this.CombinedLogSearch.ActiveHandler();
            } else if (this.PersonDeviceForm?.IsActive()) {
                this.PersonDeviceForm.ActiveHandler();
            } else if (this.TokenForm !== null && this.TokenForm.IsActive()) {
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
            global.Log({Message: 'PersonForm.ActiveHandler>>' + ex.message});
        }
    };
    BackHandler() {
        try {
            if (this.AccountForm?.IsActive()) {
                this.AccountForm.BackHandler();
            } else if (this.AccountPersonForm?.IsActive()) {
                this.AccountPersonForm.BackHandler();
            } else if (this.CombinedLogSearch?.IsActive()) {
                this.CombinedLogSearch.BackHandler();
            } else if (this.PersonDeviceForm?.IsActive()) {
                this.PersonDeviceForm.BackHandler();
            } else if (this.TokenForm?.IsActive()) {
                this.TokenForm.BackHandler();
            } else {
                this.Hide();
            }
        } catch (ex) {
            global.Log({Message: 'PersonForm.BackHandler>>' + ex.message});
        }
    };
    KeyboardHandler(action, keyboardheight) {
        try {
            if (this.AccountForm?.IsActive()) {
                this.AccountForm.KeyboardHandler(action, keyboardheight);
            } else if (this.AccountPersonForm?.IsActive()) {
                this.AccountPersonForm.KeyboardHandler(action, keyboardheight);
            } else if (this.CombinedLogSearch?.IsActive()) {
                this.CombinedLogSearch.KeyboardHandler(action, keyboardheight);
            } else if (this.PersonDeviceForm?.IsActive()) {
                this.PersonDeviceForm.KeyboardHandler(action, keyboardheight);
            } else if (this.TokenForm?.IsActive()) {
                this.TokenForm.KeyboardHandler(action, keyboardheight);
            } else {
                //Do Nothing
            }
        } catch (ex) {
            global.Log({Message: 'PersonForm.KeyboardHandler>>' + ex.message});
        }
    };
    ShortcutHandler(Shortcut_Value) {
        try {
            if (this.AccountForm?.IsActive()) {
                this.AccountForm.ShortcutHandler(Shortcut_Value);
            } else if (this.AccountPersonForm?.IsActive()) {
                this.AccountPersonForm.ShortcutHandler(Shortcut_Value);
            } else if (this.CombinedLogSearch?.IsActive()) {
                this.CombinedLogSearch.ShortcutHandler(Shortcut_Value);
            } else if (this.PersonDeviceForm?.IsActive()) {
                this.PersonDeviceForm.ShortcutHandler(Shortcut_Value);
            } else if (this.TokenForm.IsActive()) {
                this.TokenForm.ShortcutHandler(Shortcut_Value);
            } else {
                if (Shortcut_Value === 'Save' && Global.State[this.props.ModelID]?.PersonDirty === true) {
                    this.SavePerson();
                } else if (Shortcut_Value === 'Delete' && Global.State[this.props.ModelID]?.PersonDirty === false) {
                    this.DeletePerson();
                }
            }
        } catch (ex) {
            global.Log({Message: 'PersonForm.ShortcutHandler>>' + ex.message});
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
            global.Log({Message: 'PersonForm.Hide>>' + ex.message});
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
            global.Log({Message: 'PersonForm.ClearFocus>>' + ex.message, Notify: true});
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
                        <AccountForm ref={ele => this.AccountForm = ele} ModelID={this.props.ModelID + '_AFA5B998'} />
                        <AccountPersonForm ref={ele => this.AccountPersonForm = ele} ModelID={this.props.ModelID + '_APF4G0T1'} />
                        <CombinedLogSearch ref={ele => this.CombinedLogSearch = ele} ModelID={this.props.ModelID + '_CLSOSE1Y'} />
                        <PersonDeviceForm ref={ele => this.PersonDeviceForm = ele} ModelID={this.props.ModelID + '_PD1O4RZ0'} />
                        <TokenForm ref={ele => this.TokenForm = ele} ModelID={this.props.ModelID + '_TF1O4RZ0'} />
                    </View>
                );
            } else {
                return (<View></View>);
            }
        } catch (ex) {
            global.Log({Message: 'PersonForm.render>>' + ex.message});
        }
    };
    renderHeader() {
        try {
            return (
                <Pressable style={{paddingTop: Global.InsetTop}} onPress={() => { this.ClearFocus() }}>
                    <View ref={ele => this.Titlebar = ele} style={{ height: 70, flexDirection:'row', padding: 10, enableFocusRing: false}}>
                        <Pressable 
                            onPress={() => {
                                if (Global.State[this.props.ModelID].PersonDirty) {
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
                            onPress={() => this.LoadChat()}
                            style={({pressed}) => [{width: 50, height: 50, alignItems: 'center', justifyContent: 'center', opacity: pressed ? .5 : (Global.State[this.props.ModelID].AllowChat && Global.State[this.props.ModelID].Person.PersonID !== null ? 1 : .5)}]}
                            disabled={!(Global.State[this.props.ModelID].AllowChat && Global.State[this.props.ModelID].Person.PersonID !== null)}
                        >
                            <Image source={global.ColorScheme === 'dark' ? IMG_Comment_eeeeee : IMG_Comment_121212} style={{width: 24, height: 24}} />
                        </Pressable>
                        <Pressable
                            onPress={() => this.LoadEmail()}
                            style={({pressed}) => [{width: 50, height: 50, alignItems: 'center', justifyContent: 'center', opacity: pressed ? .5 : (Global.State[this.props.ModelID].AllowChat && Global.State[this.props.ModelID].Person.PersonID !== null ? 1 : .5)}]}
                            disabled={!(Global.State[this.props.ModelID].AllowChat && Global.State[this.props.ModelID].Person.PersonID !== null)}
                        >
                            <Image source={global.ColorScheme === 'dark' ? IMG_Email_eeeeee : IMG_Email_121212} style={{width: 24, height: 24}} />
                        </Pressable>
                        <Pressable
                            onPress={() => this.DeletePerson()}
                            style={({pressed}) => [{width: 50, height: 50, alignItems: 'center', justifyContent: 'center', opacity: pressed ? .5 : 1}]}
                        >
                            <Image source={global.ColorScheme === 'dark' ? IMG_Trash_eeeeee : IMG_Trash_121212} style={{width: 24, height: 24}} />
                        </Pressable>
                    </View>                    
                </Pressable>
            );
        } catch (ex) {
            global.Log({Message: 'PersonForm.renderHeader>>' + ex.message});
        }
    };
    renderBody() {
        try {            

            let _LastActivityDescription = null;
            if (Global.State[this.props.ModelID].Person.PersonActivity !== null) {
                let _LastActivityDate = new Date(Global.State[this.props.ModelID].Person.PersonActivity + 'Z');
                _LastActivityDescription = Global.TimeSince(_LastActivityDate);
            }

            let _CreatedDescription = null;
            if (Global.State[this.props.ModelID].Person.PersonCreated !== null) {
                let _CreatedDate = new Date(Global.State[this.props.ModelID].Person.PersonCreated);
                _CreatedDescription = Global.FormatShortDate(_CreatedDate.getFullYear(), _CreatedDate.getMonth() + 1, _CreatedDate.getDate());
                if (_CreatedDate.getHours() < 12) {
                    _CreatedDescription += ' ' + parseInt(_CreatedDate.getHours() + 12).toString() + ':' + _CreatedDate.getMinutes() + ':' + _CreatedDate.getSeconds() + 'AM';
                } else if (_CreatedDate.getHours() >= 12) {
                    _CreatedDescription += ' ' + parseInt(_CreatedDate.getHours() - 12).toString() + ':' + _CreatedDate.getMinutes() + ':' + _CreatedDate.getSeconds() + 'PM';
                }
            }

            //Copy ID
            let _CopyUI = null;
            if (Global.State[this.props.ModelID].PageTitle === 'EDIT PERSON') {
                _CopyUI = (
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
                                global.Log({Message: 'PersonForm.renderBody.CopyID>>' + ex.message, Notify: true});
                            }
                        }}
                        style={({pressed}) => [{width: 50, height: 50, marginTop: 4, alignItems: 'center', justifyContent: 'center', opacity: pressed ? .7 : 1}]}
                    >
                        <Image source={global.ColorScheme === 'dark' ? IMG_Copy_eeeeee : IMG_Copy_121212} style={{width: 24, height: 24}} />
                    </Pressable>
                )
            }

            return (
                <ScrollView 
                style={{flex: 1, backgroundColor: Global.Theme.Body.BackgroundColor}}
                refreshControl={
                    <RefreshControl refreshing={this.state.Refreshing} onRefresh={async () => {
                        try {
                            this.setState({Refreshing: true});
                            Global.State[this.props.ModelID].Person = await PersonHelper.GetOne({PersonID: Global.State[this.props.ModelID].Person.PersonID});
                            Global.State[this.props.ModelID].AccountList = await AccountHelper.GetList({SearchPersonID: Global.State[this.props.ModelID].Person.PersonID});
                            Global.State[this.props.ModelID].TokenList = await TokenHelper.GetList({SearchPersonID: Global.State[this.props.ModelID].Person.PersonID, SearchExpired: false, SearchLimit: 25});
                            Global.State[this.props.ModelID].AuthenticationCount = await CombinedLogHelper.GetCount({SearchType: 'authentication', SearchPersonID: Global.State[this.props.ModelID].Person.PersonID});
                            Global.State[this.props.ModelID].ActivityCount = await CombinedLogHelper.GetCount({SearchType: 'activity', SearchPersonID: Global.State[this.props.ModelID].Person.PersonID});
                            Global.State[this.props.ModelID].EmailCount = await CombinedLogHelper.GetCount({SearchType: 'email', SearchPersonID: Global.State[this.props.ModelID].Person.PersonID});
                            Global.State[this.props.ModelID].ExceptionCount = await CombinedLogHelper.GetCount({SearchType: 'exception', SearchPersonID: Global.State[this.props.ModelID].Person.PersonID});
                            this.setState({Refreshing: false});
                        } catch (ex) {
                            global.Log({Message: 'PersonForm.renderBody.RefreshControl>>' + ex.message, Notify: true});
                        }
                    }} />
                }>

                    {/* Person Details */}
                    <View style={{flex: 1, padding: 10}}>

                        {/* Person ID */}
                        <View style={{flex: 1, flexDirection: 'row'}}>
                            <View style={{flex: 1, flexDirection: 'row'}}>
                                <ElementControl
                                    Name={'ID'}
                                    Value={Global.State[this.props.ModelID].Person.PersonID}
                                    Changed={(Text_Value) => {
                                        Global.State[this.props.ModelID].Person.PersonID = Text_Value;
                                        this.CheckDirty();
                                    }}
                                    MarginTop={10}
                                    Editable={Global.State[this.props.ModelID].ActiveWindow}
                                    Enabled={Global.State[this.props.ModelID].PageTitle === 'NEW PERSON'}
                                />
                            </View>
                            {_CopyUI}
                        </View>

                        {/* Person Given Name */}
                        <View style={{flex: 1, flexDirection: 'row', marginTop: 10}}>
                            <ElementControl
                                Name={'First Name'}
                                Value={Global.State[this.props.ModelID].Person.PersonGivenName}
                                Changed={(Text_Value) => {
                                    Global.State[this.props.ModelID].Person.PersonGivenName = Text_Value;
                                    this.CheckDirty();
                                }}
                                Editable={Global.State[this.props.ModelID].ActiveWindow}
                            />
                            <View style={{width: 10}}></View>
                            <ElementControl
                                Name={'Surname'}
                                Value={Global.State[this.props.ModelID].Person.PersonFamilyName}
                                Changed={(Text_Value) => {
                                    Global.State[this.props.ModelID].Person.PersonFamilyName = Text_Value;
                                    this.CheckDirty();
                                }}
                                Editable={Global.State[this.props.ModelID].ActiveWindow}
                            />
                        </View>

                        {/* Person Email */}
                        <ElementControl
                            Name={'Email'}
                            Value={Global.State[this.props.ModelID].Person.PersonEmail}
                            Changed={(Text_Value) => {
                                Global.State[this.props.ModelID].Person.PersonEmail = Text_Value;
                                this.CheckDirty();
                            }}
                            MarginTop={10}
                            Editable={Global.State[this.props.ModelID].ActiveWindow}
                        />

                        {/* Person Phone */}
                        <ElementControl
                            Name={'Phone'}
                            Value={Global.State[this.props.ModelID].Person.PersonPhone}
                            Changed={(Text_Value) => {
                                Global.State[this.props.ModelID].Person.PersonPhone = Text_Value;
                                this.CheckDirty();
                            }}
                            MarginTop={10}
                            Editable={Global.State[this.props.ModelID].ActiveWindow}
                        />

                        {/* Person Roles */}
                        <ElementControl
                            Name={'Roles'}
                            Value={Global.State[this.props.ModelID].Person.PersonRoles}
                            Pressed={() => {
                                global.root.PickerModal.Show([
                                    {Text: 'Admin', Value: '[admin]'},
                                    {Text: 'Support', Value: '[support]'},
                                ], false, (Selected_Value) => {                                    
                                    Global.State[this.props.ModelID].Person.PersonRoles = Selected_Value;
                                    this.CheckDirty();
                                });
                            }}                            
                            MarginTop={10}
                            Editable={Global.State[this.props.ModelID].ActiveWindow}
                        />

                        {/* Person Marketing */}
                        <ElementControl
                            Name={'Marketing'}
                            Value={Global.State[this.props.ModelID].Person.PersonMarketing}
                            Pressed={() => {
                                global.root.PickerModal.Show([
                                    {Text: 'Requested', Value: 'requested'},
                                    {Text: 'Subscribed', Value: 'subscribed'},
                                    {Text: 'Unsubscribed', Value: 'unsubscribed'},
                                ], false, (selectedvalue) => {
                                    Global.State[this.props.ModelID].Person.PersonMarketing = selectedvalue;
                                    this.CheckDirty();
                                })
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
                                    SearchPersonID: Global.State[this.props.ModelID].Person.PersonID
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
                                    SearchPersonID: Global.State[this.props.ModelID].Person.PersonID
                                });
                            }}>
                                <View style={{flex: 1, alignItems: 'center', justifyContent: 'center'}}>
                                    <Image source={Global.Theme.Highlight.Icons.Activity} style={{width: 24, height: 24}} />
                                    <Text style={{color: Global.Theme.Highlight.ForegroundColor}}>{Global.State[this.props.ModelID].ActivityCount}</Text>
                                </View>
                            </Pressable>
                            <View style={{width: 1, backgroundColor: Global.Theme.Body.BackgroundColor, marginTop: 4, marginBottom: 4, opacity: .2}}></View>
                            <Pressable style={({pressed}) => [{flex: 1, height: 50, opacity: pressed ? .5 : 1}]} onPress={async () => {
                                this.CombinedLogSearch.Show({
                                    SearchType: 'email',
                                    SearchPersonID: Global.State[this.props.ModelID].Person.PersonID
                                });
                            }}>
                                <View style={{flex: 1, alignItems: 'center', justifyContent: 'center'}}>
                                    <Image source={IMG_Email_121212} style={{width: 22, height: 22}} />
                                    <Text style={{color: Global.Theme.Highlight.ForegroundColor}}>{Global.State[this.props.ModelID].EmailCount}</Text>
                                </View>
                            </Pressable>
                            <View style={{width: 1, backgroundColor: Global.Theme.Body.BackgroundColor, marginTop: 4, marginBottom: 4, opacity: .2}}></View>
                            <Pressable style={({pressed}) => [{flex: 1, height: 50, opacity: pressed ? .5 : 1}]} onPress={async () => {
                                this.CombinedLogSearch.Show({
                                    SearchType: 'exception',
                                    SearchPersonID: Global.State[this.props.ModelID].Person.PersonID
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
                            <ElementControl
                                Name={'Last Active'}
                                Value={_LastActivityDescription}
                                Enabled={false}
                            />
                        </View>                        

                        <View style={{flex: 1, height: 50, marginTop: 20, justifyContent: 'center'}}>
                            <Text style={{fontSize: 20, fontWeight: 'bold', color: (global.ColorScheme === 'dark' ? '#eeeeee' : '#121212')}}>Address</Text>
                        </View>

                        {/* Person Street 1 */}
                        <ElementControl
                            Name={'Street 1'}
                            Value={Global.State[this.props.ModelID].Person.PersonStreet1}
                            Changed={(Text_Value) => {
                                Global.State[this.props.ModelID].Person.PersonStreet1 = Text_Value;
                                this.CheckDirty();
                            }}
                            MarginTop={10}
                            Editable={Global.State[this.props.ModelID].ActiveWindow}
                        />

                        {/* Person Street 2 */}
                        <ElementControl
                            Name={'Street 2'}
                            Value={Global.State[this.props.ModelID].Person.PersonStreet2}
                            Changed={(Text_Value) => {
                                Global.State[this.props.ModelID].Person.PersonStreet2 = Text_Value;
                                this.CheckDirty();
                            }}
                            MarginTop={10}
                            Editable={Global.State[this.props.ModelID].ActiveWindow}
                        />

                        {/* Person City */}
                        <View style={{flex: 1, flexDirection: 'row'}}>
                            <ElementControl
                                Name={'City'}
                                Value={Global.State[this.props.ModelID].Person.PersonCity}
                                Changed={(Text_Value) => {
                                    Global.State[this.props.ModelID].Person.PersonCity = Text_Value;
                                    this.CheckDirty();
                                }}
                                MarginTop={10}
                                Editable={Global.State[this.props.ModelID].ActiveWindow}
                            />
                            <View style={{width: 10}}></View>
                            <ElementControl
                                Name={'State'}
                                Pressed={() => {
                                    global.root.PickerModal.Show(Global.Lookup_StateTypes(Global.State[this.props.ModelID].Person.PersonCountry), false, (selectedvalue) => {
                                        Global.State[this.props.ModelID].Person.PersonState = selectedvalue;
                                        this.CheckDirty();
                                    })
                                }}
                                Value={Global.State[this.props.ModelID].Person.PersonState}
                                MarginTop={10}
                                Editable={Global.State[this.props.ModelID].ActiveWindow}
                            />
                        </View>

                        {/* Person Country */}
                        <View style={{flex: 1, flexDirection: 'row', marginTop: 10}}>
                            <ElementControl
                                Name={'Country'}
                                Pressed={() => {
                                    global.root.PickerModal.Show(Global.Lookup_CountryTypes(), false, (selectedvalue) => {
                                        Global.State[this.props.ModelID].Person.PersonCountry = selectedvalue;
                                        Global.State[this.props.ModelID].Person.PersonState = null;
                                        this.CheckDirty();
                                    })
                                }}
                                Value={Global.State[this.props.ModelID].Person.PersonCountry}
                            />
                            <View style={{width: 10}}></View>
                            <ElementControl
                                Name={'Post Code'}
                                Value={Global.State[this.props.ModelID].Person.PersonPostCode}
                                Changed={(Text_Value) => {
                                    Global.State[this.props.ModelID].Person.PersonPostCode = Text_Value;
                                    this.CheckDirty();
                                }}
                                Casing={'upper'}
                                Editable={Global.State[this.props.ModelID].ActiveWindow}
                            />
                        </View>

                    </View>                    

                    {this.renderAccountList()}

                    {this.renderTokenList()}

                    {this.renderPersonDeviceList()}

                    {/* Bottom Padding */}
                    <View style={{height: Global.InsetBottom + 20}}></View>
                    <View style={{height: Global.State[this.props.ModelID].ScrollPadding}}></View>
                    <Animated.View key={'Footer_Padding'} style={{position: 'relative', backgroundColor: 'transparent', height: Global.State[this.props.ModelID].FooterPadding}}>
                    </Animated.View>

                </ScrollView>
            );

        } catch (ex) {
            global.Log({Message: 'PersonForm.renderBody>>' + ex.message});
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
                            Value={Global.State[this.props.ModelID].Person[_SchemaProperty.SchemaPropertyID]}
                            Changed={(Text_Value) => {
                                Global.State[this.props.ModelID].Person[_SchemaProperty.SchemaPropertyID] = Text_Value;
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
            global.Log({Message: 'PersonForm.renderProperties>>' + ex.message});
        }
    };
    renderAccountList() {
        try {
            let _UI = [];
            if (Global.State[this.props.ModelID].AccountList?.length > 0) {
                
                let _ActiveDate = new Date();
                _ActiveDate.setDate(_ActiveDate.getDate() - 60);

                for (let _AccountIndex = 0; _AccountIndex < Global.State[this.props.ModelID].AccountList.length; _AccountIndex++) {
                    let _Account = Global.State[this.props.ModelID].AccountList[_AccountIndex];
                    
                    let _ActivityDate = new Date(_Account.AccountActivity);
                    let _LastActive = (
                        <Text style={{color: Global.Theme.Body.ForegroundFade, fontSize: 11}}>Active on {Global.FormatShortDate(_ActivityDate.getFullYear(), parseInt(_ActivityDate.getMonth() + 1), _ActivityDate.getDate())}</Text>
                    );
                    let _BorderColor = Global.Theme.Body.ControlBackground;
                    if (_ActivityDate > _ActiveDate) {
                        _BorderColor = Global.Theme.Highlight.BackgroundFade;
                    }

                    if (_AccountIndex > 0) {
                        _UI.push(
                            <View key={'AccountBreaker_' + _AccountIndex} style={{flex: 1, height: 1, backgroundColor: Global.Theme.Body.BackgroundFade, marginLeft: 10, marginRight: 10}}></View>
                        );
                    }

                    _UI.push(
                        <Pressable 
                        key={'AccountList_' + _AccountIndex}
                        onPress={() => {
                            this.AccountPersonForm.Show({
                                AccountID: _Account.AccountID,
                                AccountPersonID: Global.State[this.props.ModelID].Person.PersonID,
                                SaveCallback: async () => {
                                    try {
                                        Global.State[this.props.ModelID].AccountList = await AccountHelper.GetList({ SearchPersonID: Global.State[this.props.ModelID].Person.PersonID })
                                        this.forceUpdate();
                                    } catch (ex) {
                                        global.Log({Message: 'PersonForm.renderAccountList.SaveCallback>>' + ex.message});
                                    }
                                },
                                DeleteCallback: async () => {
                                    try {
                                        Global.State[this.props.ModelID].AccountList = await AccountHelper.GetList({ SearchPersonID: Global.State[this.props.ModelID].Person.PersonID })
                                        this.forceUpdate();
                                    } catch (ex) {
                                        global.Log({Message: 'PersonForm.renderAccountList.SaveCallback>>' + ex.message});
                                    }
                                },
                            });
                        }}
                        onLongPress={() => {
                            this.AccountForm.Show({
                                AccountID: _Account.AccountID,
                                SaveCallback: null,
                                DeleteCallback: null
                            });
                        }}
                        style={({pressed}) => [{flex: 1, flexDirection: 'row', opacity: pressed ? .7 : 1}]}
                        >
                            <View style={{width: 3, backgroundColor: _BorderColor, borderRadius: 4}}></View>
                            <View style={{flex: 1, padding: 10}}>
                                {_LastActive}
                                <Text style={{marginTop: 4, color: Global.Theme.Body.ForegroundColor}}>{_Account.AccountName}</Text>
                            </View>
                            <View style={{width: 50, alignItems: 'center', justifyContent: 'center'}}>
                                <Image source={Global.Theme.Body.Icons.Forward} style={{width: 20, height: 20}} />
                            </View>
                        </Pressable>
                    );

                }

            } else {
                _UI.push(
                    <View key={'LogList_0'} style={[{flex: 1, height: 50, alignItems: 'center', justifyContent: 'center'}]}>
                        <Text style={{color: Global.Theme.Body.ForegroundFade}}>No Linked Accounts</Text>
                    </View>
                );
            }
            return (
                <View style={{marginTop: 20, marginLeft: 10, marginRight: 10}}>
                    <View style={{flex: 1, height: 50, justifyContent: 'center'}}>
                        <Text style={{fontSize: 20, fontWeight: 'bold', color: Global.Theme.Body.ForegroundColor}}>Accounts</Text>
                    </View>
                    <View style={{backgroundColor: Global.Theme.Body.ControlBackground, borderRadius: 4}}>
                        {_UI}
                    </View>
                </View>
            );
        } catch (ex) {
            global.Log({Message: 'PersonForm.renderAccountList>>' + ex.message});
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
                                global.Log({Message: 'PersonForm.renderTokenList.onPress>>' + ex.message, Notify: true});
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
                    <View style={{flex: 1, height: 50, justifyContent: 'center'}}>
                        <Text style={{fontSize: 20, fontWeight: 'bold', color: Global.Theme.Body.ForegroundColor}}>Tokens</Text>
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
    renderPersonDeviceList() {
        try {
            let _UI = [];
            if (Global.State[this.props.ModelID].PersonDeviceList?.length > 0) {
                for (let _PersonDeviceIndex = 0; _PersonDeviceIndex < Global.State[this.props.ModelID].PersonDeviceList.length; _PersonDeviceIndex++) {
                    let _PersonDevice = Global.State[this.props.ModelID].PersonDeviceList[_PersonDeviceIndex];

                    if (_PersonDeviceIndex > 0) {
                        _UI.push(
                            <View key={'PersonDeviceBreaker_' + _PersonDeviceIndex} style={{flex: 1, height: 1, backgroundColor: Global.Theme.Body.BackgroundFade, marginLeft: 10, marginRight: 10}}></View>
                        );
                    }

                    let _LastActiveUI = null;
                    let _BorderColor = Global.Theme.Body.BackgroundFade;
                    if (_PersonDevice.hasOwnProperty('PersonDeviceActivity') !== null) {
                        let _ActivityDate = new Date(_PersonDevice.PersonDeviceActivity + 'Z');
                        if (_ActivityDate > new Date().setDate(new Date().getDate() - 28)) {
                            _BorderColor = Global.Theme.Highlight.BackgroundFade;
                        }
                        _LastActiveUI = (
                            <Text style={{color: Global.Theme.Body.ForegroundFade, fontSize: 11}}>{'Last Active ' + Global.TimeSince(_ActivityDate)}</Text>
                        );
                    }

                    _UI.push(
                        <Pressable 
                            key={'PersonDeviceList_' + _PersonDeviceIndex}
                            onPress={() => {
                                this.ClearFocus();
                                this.PersonDeviceForm.Show({
                                    PersonID: Global.State[this.props.ModelID].Person.PersonID,
                                    PersonDeviceID: _PersonDevice.PersonDeviceID, 
                                    SaveCallback: (PersonDevice_Value) => {
                                        try {
                                            //Loop through the list and update the device
                                            for (let _PersonDeviceIndex = 0; _PersonDeviceIndex < Global.State[this.props.ModelID].PersonDeviceList.length; _PersonDeviceIndex++) {
                                                if (Global.State[this.props.ModelID].PersonDeviceList[_PersonDeviceIndex].PersonDeviceID === PersonDevice_Value.PersonDeviceID) {
                                                    Global.State[this.props.ModelID].PersonDeviceList[_PersonDeviceIndex] = PersonDevice_Value;
                                                }
                                            }
                                        } catch (ex) {
                                            global.Log({Message: 'PersonForm.renderPersonDeviceList.SaveCallback>>' + ex.message, Notify: true});
                                        }
                                    }, DeleteCallback: (PersonDevice_Value) => {
                                        Global.State[this.props.ModelID].PersonDeviceList = Global.State[this.props.ModelID].PersonDeviceList.filter((PersonDevice) => { return (PersonDevice.PersonDeviceID !== PersonDevice_Value.PersonDeviceID) });
                                    }
                                });
                            }}
                            style={({pressed}) => [{flex: 1, flexDirection: 'row', justifyContent: 'center', opacity: pressed ? .7 : 1}]}
                        >
                            <View style={{width: 3, backgroundColor: _BorderColor, borderRadius: 4}}></View>
                            <View style={{flex: 1, minHeight: 50, padding: 10}}>
                                {_LastActiveUI}
                                <Text style={{marginTop: 4, color: Global.Theme.Body.ForegroundColor}}>{_PersonDevice.PersonDeviceName}</Text>
                            </View>
                            <View style={{width: 50, alignItems: 'center', justifyContent: 'center'}}>
                                <Image source={Global.Theme.Body.Icons.Forward} style={{width: 20, height: 20}} />
                            </View>
                        </Pressable>
                    );

                }
            } else {
                _UI.push(
                    <View key={'PersonDeviceList_0'} style={{flex: 1, height: 50, alignItems: 'center', justifyContent: 'center'}}>
                        <Text style={{color: Global.Theme.Body.ForegroundFade}}>No Devices</Text>
                    </View>
                );
            }
            return (
                <View style={{marginTop: 20, marginLeft: 10, marginRight: 10}}>
                    <View style={{flex: 1, height: 50, justifyContent: 'center'}}>
                        <Text style={{fontSize: 20, fontWeight: 'bold', color: Global.Theme.Body.ForegroundColor}}>Devices</Text>
                    </View>
                    <View style={{backgroundColor: Global.Theme.Body.ControlBackground, borderRadius: 4}}>
                        {_UI}
                    </View>
                </View>
            );            
        } catch (ex) {
            global.Log({Message: 'AccountForm.renderPersonDeviceList>>' + ex.message});
        }
    };
    renderFooter() {
        try {
            return (
                <Animated.View key={'Footer_Row'} style={[Styles.v3_footer_container, {bottom: Global.State[this.props.ModelID].FooterOffset}]}>
                    <View style={{position: 'absolute', top: 0, left: 10, right: 10, height: 60, backgroundColor: Global.Theme.Footer.BackgroundColor, borderRadius: 6, opacity: .5}}></View>
                    <Pressable style={({pressed}) => [{width: 150, height: 40, marginLeft: 10, backgroundColor: '#c06e6e', opacity: pressed ? .7 : 1, borderRadius: 4, alignItems: 'center', justifyContent: 'center'}]} onPress={() => this.CancelPerson() }>
                        <Text style={{fontWeight: 'bold', color: Global.Theme.Highlight.ForegroundColor}}>Cancel</Text>
                    </Pressable>
                    <View style={{flex: 1}}></View>
                    <Pressable style={({pressed}) => [{width: 150, height: 40, marginRight: 10, backgroundColor: Global.Theme.Highlight.BackgroundColor, opacity: pressed ? .7 : 1, borderRadius: 4, alignItems: 'center', justifyContent: 'center'}]} onPress={() => this.SavePerson() }>
                        <Text style={{fontWeight: 'bold', color: Global.Theme.Highlight.ForegroundColor}}>Save</Text>
                    </Pressable>
                </Animated.View>
            );
        } catch (ex) {
            global.Log({Message: 'PersonForm.renderFooter>>' + ex.message, Notify: true});
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
            global.Log({Message: 'PersonForm.renderSwipeBack>>' + ex.message});
        }
    };
};