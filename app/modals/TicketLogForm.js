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
import InputControl from '../controls/InputControl.js';
module.exports = class TicketLogForm extends Component {
    constructor(props) {
        super(props);
        this.Titlebar = null;
        this.AccountForm = null;
        this.PersonForm = null;
    };
    IsActive() {
        try {
            return Global.State.hasOwnProperty(this.props.ModelID) && Global.State[this.props.ModelID] !== null;
        } catch (ex) {
            global.Log({Message: 'TicketLogForm.IsActive>>' + ex.message});
        }
    };
    async Show(Ticket_Value, TicketLog_Value, SaveCallback_Value, DeleteCallback_Value) {
        try {
            global.root.NotificationModal.Show({ NotificationTitle: 'Loading...', NotificationStyle: 'Wait' });
            let _ViewWidth = Global.ScreenX > 600 ? 600 : Global.ScreenX;

            //Get log data if exists
            let _TicketLogDataUI = [];
            let _TicketLogData = null;
            let _TicketLogGeotag = null;
            if (TicketLog_Value !== null && TicketLog_Value.TicketLogHasData) {
                _TicketLogData = await TicketLogHelper.GetData({TicketID: Ticket_Value.TicketID, TicketLogID: TicketLog_Value.TicketLogID});
            }

            if (Global.StringHasContent(TicketLog_Value.TicketLogIP)) {
                _TicketLogGeotag = await TicketLogHelper.Geotag(TicketLog_Value.TicketLogIP);
            }

            //Create State
            Global.State[this.props.ModelID] = {
                Ticket: Ticket_Value,
                TicketLog: TicketLogHelper.Clone(TicketLog_Value),
                TicketLogSnapshot: TicketLogHelper.Clone(TicketLog_Value),
                TicketLogDirty: false,
                TicketLogData: _TicketLogData,
                TicketLogDataUI: _TicketLogDataUI,
                TicketLogGeotag: _TicketLogGeotag,
                SaveCallback: SaveCallback_Value,
                DeleteCallback: DeleteCallback_Value,
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
            global.Log({Message: 'TicketLogForm.Show>>' + ex.message, Notify: true});
        }
    };
    CheckDirty() {
        try {
            let _IsDirty = (JSON.stringify(Global.State[this.props.ModelID].TicketLogSnapshot).trim() !== JSON.stringify(Global.State[this.props.ModelID].TicketLog).trim());
            if (_IsDirty !== Global.State[this.props.ModelID].TicketLogDirty) {
                Global.State[this.props.ModelID].TicketLogDirty = _IsDirty;
                if (Global.State[this.props.ModelID] !== null && Global.State[this.props.ModelID].FooterOffset !== null) {
                    if (Global.State[this.props.ModelID].TicketLogDirty) {
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
            global.Log({Message: 'TicketLogForm.CheckDirty>>' + ex.message});
        }
    };    

    async RunWebhook(DeleteOnSuccess_Value) {
        try {
            if (!Global.TokenPayload.hasOwnProperty('ServiceSecret')) {
                let _Service = await ServiceHelper.GetOne();
                if (_Service !== null && _Service.hasOwnProperty('ServiceSecret') && Global.StringHasContent(_Service.ServiceSecret)) {
                    Global.TokenPayload.ServiceSecret = _Service.ServiceSecret;                    
                }
            }
            await global.root.NotificationModal.Show({ NotificationTitle: 'Running...', NotificationStyle: 'Wait' });
            await TicketLogHelper.RunWebhook({
                SecretKey: Global.TokenPayload.ServiceSecret,
                Url: Global.State[this.props.ModelID].Ticket.TicketWebhook,
                Packet: {
                    Ticket: Global.State[this.props.ModelID].Ticket,
                    TicketLog: Global.State[this.props.ModelID].TicketLog,
                    TicketLogData: Global.State[this.props.ModelID].TicketLogData
                },
            });
            if (DeleteOnSuccess_Value) {
                await global.root.NotificationModal.Show({ NotificationTitle: 'Deleting...', NotificationStyle: 'Wait' });
                await TicketLogHelper.Delete({
                    TicketID: Global.State[this.props.ModelID].Ticket.TicketID, 
                    TicketLogID: Global.State[this.props.ModelID].TicketLog.TicketLogID});
                if (Global.State[this.props.ModelID].DeleteCallback !== null) {
                    Global.State[this.props.ModelID].DeleteCallback(Global.State[this.props.ModelID].Ticket.TicketID, Global.State[this.props.ModelID].TicketLog.TicketLogID);
                }
                global.root.NotificationModal.Hide();
                this.Hide();
            } else {
                global.root.NotificationModal.Hide();
            }           
        } catch (ex) {
            global.Log({Message: 'TicketLogForm.RunWebhook>>' + ex.message, Notify: true});
        }
    };
    async SaveTicketLog() {
        try {
            this.ClearFocus();
            setTimeout(async () => {
                try {

                    await global.root.NotificationModal.Show({ NotificationTitle: 'Saving...', NotificationStyle: 'Wait' });
                    let _TicketLog = TicketLogHelper.Clone(Global.State[this.props.ModelID].TicketLog);

                    //Save the ticket log
                    _TicketLog = await TicketLogHelper.Save(Global.State[this.props.ModelID].Ticket.TicketID, _TicketLog);
                    if (_TicketLog !== null) {
                        Global.State[this.props.ModelID].TicketLog = TicketLogHelper.Clone(_TicketLog);
                        Global.State[this.props.ModelID].TicketLogSnapshot = TicketLogHelper.Clone(_TicketLog);
                        this.CheckDirty();
        
                        global.root.NotificationModal.Hide();
                    } else {
                        global.root.NotificationModal.Hide();
                        this.Hide();
                    }

                } catch (ex) {
                    global.Log({Message: 'TicketLogForm.SaveTicketLog>>' + ex.message, Notify: true});
                }
            }, Platform.OS === 'macos' || Platform.OS === 'windows' ? 50 : 1);
        } catch (ex) {
            global.Log({Message: 'TicketLogForm.SaveTicketLog>>' + ex.message, Notify: true});
        }
    };
    CancelTicketLog() {
        try {
            Global.State[this.props.ModelID].TicketLog = TicketLogHelper.Clone(Global.State[this.props.ModelID].TicketLogSnapshot);
            this.CheckDirty();
        } catch (ex) {
            global.Log({Message: 'TicketLogForm.CancelTicketLog>>' + ex.message, Notify: true});
        }
    };
    async DeleteTicketLog() {
        try {
            global.root.ConfirmModal.Show('Just Checking...', 'Are you sure you want to delete this log?', 'Yes', 'No', async () => {
                try {
                    global.root.NotificationModal.Show({ NotificationTitle: 'Deleting...', NotificationStyle: 'Wait' });
                    await TicketLogHelper.Delete({
                        TicketID: Global.State[this.props.ModelID].Ticket.TicketID, 
                        TicketLogID: Global.State[this.props.ModelID].TicketLog.TicketLogID});
                    if (Global.State[this.props.ModelID].DeleteCallback !== null) {
                        Global.State[this.props.ModelID].DeleteCallback(Global.State[this.props.ModelID].Ticket.TicketID, Global.State[this.props.ModelID].TicketLog.TicketLogID);
                    }
                    global.root.NotificationModal.Hide();
                    this.Hide();
                } catch (ex) {
                    global.Log({Message: 'TicketLogForm.DeleteTicketLog>>' + ex.message, Notify: true});
                }
            }, () => {
                //Cancel - Do Nothing
            });
        } catch (ex) {
            global.Log({Message: 'TicketLogForm.DeleteTicketLog>>' + ex.message});
        }
    }

    //Handlers
    ActiveHandler() {
        try {

            //Handle ActiveWindow state
            let _ActiveWindow = false;
            if (this.AccountForm !== null && this.AccountForm.IsActive()) {
                this.AccountForm.ActiveHandler();
            } else if (this.PersonForm !== null && this.PersonForm.IsActive()) {
                this.PersonForm.ActiveHandler();
            } else if (!global.GlobalModalActive) {
                _ActiveWindow = true;
            }

            //Handle ActiveWindow change
            if (_ActiveWindow !== Global.State[this.props.ModelID].ActiveWindow) {
                Global.State[this.props.ModelID].ActiveWindow = _ActiveWindow;
                this.forceUpdate();
            }

        } catch (ex) {
            global.Log({Message: 'TicketLogForm.ActiveHandler>>' + ex.message});
        }
    };
    BackHandler() {
        try {
            this.Hide();
        } catch (ex) {
            global.Log({Message: 'TicketLogForm.BackHandler>>' + ex.message});
        }
    };
    ShortcutHandler(Shortcut_Value) {
        try {
            if (Shortcut_Value === 'Save' && Global.State[this.props.ModelID]?.TicketLogDirty === true) {
                this.SaveTicketLog();
            } else if (Shortcut_Value === 'Delete' && Global.State[this.props.ModelID]?.TicketLogDirty === false) {
                this.DeleteTicketLog();
            }
        } catch (ex) {
            global.Log({Message: 'TicketLogForm.ShortcutHandler>>' + ex.message});
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
            global.Log({Message: 'TicketLogForm.Hide>>' + ex.message});
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
            global.Log({Message: 'TicketLogForm.ClearFocus>>' + ex.message, Notify: true});
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
                        <AccountForm ref={ele => this.AccountForm = ele} ModelID={this.props.ModelID + '_VZ9P2WJ8'} />
                        <PersonForm ref={ele => this.PersonForm = ele} ModelID={this.props.ModelID + '_ZZY3D4ME'} />
                    </View>
                );
            } else {
                return (<View></View>);
            }
        } catch (ex) {
            global.Log({Message: 'TicketLogForm.render>>' + ex.message});
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
                                <Image source={global.ColorScheme === 'dark' ? IMG_Back_eeeeee : IMG_Back_121212} style={{width: 24, height: 24}} />
                        </Pressable>
                        <View style={{flex: 1, justifyContent: 'center'}}>
                            <Text style={{fontSize: 20, fontWeight: 'bold', color: global.ColorScheme === 'dark' ? '#eeeeee' : '#121212'}}>TICKET LOG</Text>
                        </View>
                        <Pressable
                            onPress={() => this.DeleteTicketLog()}
                            style={({pressed}) => [{width: 50, height: 50, alignItems: 'center', justifyContent: 'center', opacity: pressed ? .5 : 1}]}
                        >
                            <Image source={global.ColorScheme === 'dark' ? IMG_Trash_eeeeee : IMG_Trash_121212} style={{width: 24, height: 24}} />
                        </Pressable>
                    </View>
                </Pressable>
            );
        } catch (ex) {
            global.Log({Message: 'TicketLogForm.renderHeader>>' + ex.message});
        }
    };
    renderBody() {
        try {

            let _ExpiryDate = null;
            if (Global.State[this.props.ModelID].TicketLog.TicketLogTimestamp !== null 
            && Global.State[this.props.ModelID].TicketLog.TicketLogRetention !== null 
            && Global.State[this.props.ModelID].TicketLog.TicketLogRetention > 0) {
                _ExpiryDate = new Date(Global.State[this.props.ModelID].TicketLog.TicketLogTimestamp);
                _ExpiryDate.setDate(_ExpiryDate.getDate() + Global.State[this.props.ModelID].TicketLog.TicketLogRetention);
            }

            return (
                <ScrollView style={{backgroundColor: Global.Theme.Body.BackgroundColor}}>

                    {/* Log Details */}
                    <View style={{flex: 1, padding: 10}}>

                        <InputControl 
                            Name={'Target'}
                            Value={Global.State[this.props.ModelID].Ticket.TicketTarget}
                            Multiline={true}
                            MarginTop={10}
                            Enabled={false}
                        />

                        <InputControl 
                            Name={Global.State[this.props.ModelID].Ticket.TicketType[0].toUpperCase() + Global.State[this.props.ModelID].Ticket.TicketType.substring(1)}
                            Value={Global.State[this.props.ModelID].Ticket.TicketDescription}
                            Multiline={true}
                            MarginTop={10}
                            Enabled={false}
                        />

                        {/* IP / OS */}
                        <View style={{flexDirection: 'row', marginTop: 10}}>
                            <InputControl 
                                Name={'IP'}
                                Value={Global.StringHasContent(Global.State[this.props.ModelID].TicketLog.TicketLogIP) ? Global.State[this.props.ModelID].TicketLog.TicketLogIP + (Global.StringHasContent(Global.State[this.props.ModelID].TicketLogGeotag) ? ' (' + Global.State[this.props.ModelID].TicketLogGeotag + ')' : '') : null}
                                Enabled={false}
                                Visible={Global.State[this.props.ModelID].Ticket.TicketType !== 'email'}
                            />
                            <View style={{width: 10}}></View>
                            <InputControl 
                                Name={'OS'}
                                Value={(Global.StringHasContent(Global.State[this.props.ModelID].TicketLog.TicketLogOS) ? Global.State[this.props.ModelID].TicketLog.TicketLogOS : '') + (Global.StringHasContent(Global.State[this.props.ModelID].TicketLog.TicketLogOSV) ? ' ' + Global.State[this.props.ModelID].TicketLog.TicketLogOSV : '')}
                                Enabled={false}
                                Visible={Global.State[this.props.ModelID].Ticket.TicketType !== 'email'}
                            />
                        </View>

                        {/* Environment / Version */}
                        <View style={{flexDirection: 'row', marginTop: 10}}>
                            <InputControl 
                                Name={'Environment'}
                                Value={Global.State[this.props.ModelID].TicketLog.TicketLogEnvironment}
                                Enabled={false}
                            />
                            <View style={{width: 10}}></View>
                            <InputControl 
                                Name={'Version'}
                                Value={Global.State[this.props.ModelID].TicketLog.TicketLogMajorVersion.toString() + '.' + Global.State[this.props.ModelID].TicketLog.TicketLogMinorVersion.toString() + '.' + Global.State[this.props.ModelID].TicketLog.TicketLogPatchVersion.toString()}
                                Enabled={false}
                                Visible={Global.State[this.props.ModelID].Ticket.TicketType !== 'email'}
                            />
                        </View>

                        <View style={{flex: 1, flexDirection: 'row', backgroundColor: Global.Theme.Body.ControlBackground, borderRadius: 4, marginTop: 10}}>
                            <InputControl
                                Name={'Account'}
                                Value={Global.State[this.props.ModelID].TicketLog.TicketLogAccount !== null ? Global.State[this.props.ModelID].TicketLog.TicketLogAccount.AccountName : null}
                                Autocomplete={(Selected_Value) => {
                                    if (Selected_Value.Match !== null) {
                                        Global.State[this.props.ModelID].TicketLog.TicketLogAccount = Selected_Value.Match;
                                    }
                                    this.CheckDirty();
                                }}
                                AutocompleteSource={'ACCOUNTS'}
                                BorderRadius={'left'}
                                Editable={Global.State[this.props.ModelID].ActiveWindow}
                            />
                            <View style={{width: 1, marginTop: 4, marginBottom: 4, backgroundColor: Global.Theme.Body.BackgroundFade}}></View>
                            <Pressable
                                style={({pressed}) => [{width: 50, height: 50, backgroundColor: Global.Theme.Body.ControlBackground, alignItems: 'center', justifyContent: 'center', opacity: pressed ? .7 : 1, marginTop: 4, borderTopRightRadius: 4, borderBottomRightRadius: 4}]}
                                onPress={() => {
                                    if (Global.State[this.props.ModelID].TicketLog.TicketLogAccount !== null) {
                                        this.AccountForm.Show({
                                            AccountID: Global.State[this.props.ModelID].TicketLog.TicketLogAccount.AccountID,
                                            SaveCallback: null,
                                            DeleteCallback: null
                                        });
                                    } else {
                                        global.Log({Message: 'TicketLogForm.ShowAccount>>No Account Selected', Notify: true});
                                    }
                                }}
                            >
                                <Image source={Global.Theme.Body.Icons.Forward} style={{width: 20, height: 20}} />
                            </Pressable>
                        </View>                        

                        <View style={{flex: 1, flexDirection: 'row', backgroundColor: Global.Theme.Body.ControlBackground, borderRadius: 4, marginTop: 10}}>
                            <InputControl
                                Name={'Person'}
                                Value={Global.State[this.props.ModelID].TicketLog.TicketLogPerson !== null ? Global.State[this.props.ModelID].TicketLog.TicketLogPerson.PersonName : null}
                                Autocomplete={(Selected_Value) => {
                                    if (Selected_Value.Match !== null) {
                                        Global.State[this.props.ModelID].TicketLog.TicketLogPerson = Selected_Value.Match;
                                    }
                                    this.CheckDirty();
                                }}
                                AutocompleteSource={'PEOPLE'}
                                BorderRadius={'left'}
                                Editable={Global.State[this.props.ModelID].ActiveWindow}
                            />
                            <View style={{width: 1, marginTop: 4, marginBottom: 4, backgroundColor: Global.Theme.Body.BackgroundFade}}></View>
                            <Pressable
                                style={({pressed}) => [{width: 50, height: 50, backgroundColor: Global.Theme.Body.ControlBackground, alignItems: 'center', justifyContent: 'center', opacity: pressed ? .7 : 1, marginTop: 4, borderTopRightRadius: 4, borderBottomRightRadius: 4}]}
                                onPress={() => {
                                    if (Global.State[this.props.ModelID].TicketLog.TicketLogPerson !== null) {
                                        this.PersonForm.Show({
                                            PersonID: Global.State[this.props.ModelID].TicketLog.TicketLogPerson.PersonID,
                                            SaveCallback: null,
                                            DeleteCallback: null
                                        });
                                    } else {
                                        global.Log({Message: 'TicketLogForm.ShowPerson>>No Person Selected', Notify: true});
                                    }
                                }}
                            >
                                <Image source={Global.Theme.Body.Icons.Forward} style={{width: 20, height: 20}} />
                            </Pressable>
                        </View> 

                        <InputControl 
                            Name={'Session'}
                            Value={Global.State[this.props.ModelID].TicketLog.TicketLogSession}
                            Changed={(Text_Value) => {
                                Global.State[this.props.ModelID].TicketLog.TicketLogSession = Text_Value;
                                this.CheckDirty();
                            }}
                            MarginTop={10}                        
                            Editable={Global.State[this.props.ModelID].ActiveWindow}
                            Visible={Global.State[this.props.ModelID].Ticket.TicketType !== 'email'}
                        />

                        {/* Timestamp / Expires */}
                        <View style={{flexDirection: 'row', marginTop: 10}}>
                            <InputControl 
                                Name={'Timestamp'}
                                Value={Global.State[this.props.ModelID].TicketLog.TicketLogTimestamp}
                                Enabled={false}
                            />
                            <View style={{width: 10}}></View>
                            <InputControl 
                                Name={'Expires'}
                                Value={_ExpiryDate !== null ? Global.FormatShortDate(_ExpiryDate.getFullYear(), _ExpiryDate.getMonth() + 1, _ExpiryDate.getDate()) : 'Never'}
                                Enabled={false}
                            />
                        </View>

                        {this.renderTicketLogTrace()}

                    </View>

                    {this.renderTicketLogData()}

                    {/* Bottom Padding */}
                    <View style={{height: Global.InsetBottom + 20}}></View>
                    <View style={{height: Global.State[this.props.ModelID].ScrollPadding}}></View>
                    <Animated.View key={'Footer_Padding'} style={{position: 'relative', backgroundColor: 'transparent', height: Global.State[this.props.ModelID].FooterPadding}}>
                    </Animated.View>

                </ScrollView>
            );

        } catch (ex) {
            global.Log({Message: 'TicketLogForm.renderBody>>' + ex.message});
        }
    };
    renderTicketLogTrace() {
        try {
            if (Global.State[this.props.ModelID].TicketLog.TicketLogTraceList !== null && Global.State[this.props.ModelID].TicketLog.TicketLogTraceList.length > 0) {

                let _UI = [];
                let _Last = null;
                let _TotalDiff = 0;
                for (let _TraceIndex = 0; _TraceIndex < Global.State[this.props.ModelID].TicketLog.TicketLogTraceList.length; _TraceIndex++) {
                    let _TicketLogTrace = Global.State[this.props.ModelID].TicketLog.TicketLogTraceList[_TraceIndex];

                    let _DiffUI = null;
                    let _Diff = 0;
                    if (_Last === null) {
                        _Last = new Date(_TicketLogTrace.TicketLogTraceTimestamp);
                    } else {
                        _Diff = new Date(_TicketLogTrace.TicketLogTraceTimestamp).getTime() - _Last.getTime();
                        _Last = new Date(_TicketLogTrace.TicketLogTraceTimestamp);
                        _TotalDiff += _Diff;
                        if (_Diff > 0) {
                            _DiffUI = (
                                <Text style={{color: '#a9a9a9', paddingLeft: (8 * _TraceIndex)}}>- {Global.FormatTimespan(_Diff)} -</Text>
                            )
                        }
                    }

                    _UI.push(
                        <View key={'Trace_' + _TraceIndex} style={{flex: 1, flexDirection: 'row'}}>
                            <View style={{flex: 1, justifyContent: 'center', paddingLeft: 8}}>
                            {_DiffUI}  
                                <Text style={[{paddingLeft: (8 * _TraceIndex)}]} numberOfLines={1}>{_TicketLogTrace.TicketLogTraceStep}</Text>
                            </View>
                        </View>
                    );
                }

                return (
                    <View style={{flex: 1, margin: 5}}>
                        <View>
                            <Text style={Styles.v3_form_header_text}>Trace ({Global.FormatTimespan(_TotalDiff)})</Text>
                        </View>
                        <View style={{paddingTop: 4}}>
                            {_UI}
                        </View>
                    </View>                    
                )
            }
        } catch (ex) {
            global.Log({Message: 'TicketLogForm.renderTicketLogData>>' + ex.message});
        }
    };
    renderTicketLogData() {
        try {
            if (Global.State[this.props.ModelID].TicketLogData !== null) {

                let _Download = null;
                let _ReRun = null;
                if (Global.StringHasContent(Global.State[this.props.ModelID].Ticket.TicketWebhook)) {
                    _Download = (
                        <Pressable
                            onPress={async () => {
                                try {
                                    if (Platform.OS === 'windows' || Platform.OS === 'macos') {
                                        await TurboModuleRegistry.get('RNClipboard').SetString(Global.State[this.props.ModelID].TicketLogData);
                                    } else {
                                        await NativeModules.RNClipboard.setString(Global.State[this.props.ModelID].TicketLogData);
                                    }
                                    global.root.NotificationModal.Show({ NotificationTitle: 'Copied!', NotificationStyle: 'Toast' });
                                } catch (ex) {
                                    global.Log({Message: 'TicketLogForm.renderTicketLogData.CopyID>>' + ex.message, Notify: true});
                                }
                            }}
                            style={({pressed}) => [{width: 50, height: 50, alignItems: 'center', justifyContent: 'center', opacity: pressed ? .7 : 1}]}
                        >
                            <Image source={global.ColorScheme === 'dark' ? IMG_Copy_eeeeee : IMG_Copy_121212} style={{width: 24, height: 24}} />
                        </Pressable>
                    );
                    _ReRun = (
                        <Pressable
                            onPress={() => this.RunWebhook(false)}
                            style={({pressed}) => [{width: 50, height: 50, alignItems: 'center', justifyContent: 'center', opacity: pressed ? .7 : 1}]}
                        >
                            <Image source={global.ColorScheme === 'dark' ? IMG_Sync_eeeeee : IMG_Sync_121212} style={{width: 24, height: 24}} />
                        </Pressable>
                    );
                }

                return (
                    <View style={{flex: 1}}>
                        <View style={{flex: 1, flexDirection: 'row', paddingLeft: 10, paddingRight: 10}}>
                            <View style={{flex: 1, height: 50, justifyContent: 'center'}}>
                                <Text style={{fontSize: 20, fontWeight: 'bold', color: Global.Theme.Body.ForegroundColor}}>Log Data</Text>
                            </View>
                            {_Download}
                            {_ReRun}
                        </View>
                        <View>
                            <JSONTree data={Global.State[this.props.ModelID].TicketLogData} />   
                        </View>
                    </View>                    
                );
            }
        } catch (ex) {
            global.Log({Message: 'TicketLogForm.renderTicketLogData>>' + ex.message});
        }
    };
    renderFooter() {
        try {
            return (
                <Animated.View key={'Footer_Row'} style={[Styles.v3_footer_container, {bottom: Global.State[this.props.ModelID].FooterOffset}]}>
                    <View style={{position: 'absolute', top: 0, left: 10, right: 10, height: 60, backgroundColor: Global.Theme.Footer.BackgroundColor, borderRadius: 6, opacity: .5}}></View>
                    <Pressable style={({pressed}) => [{width: 150, height: 40, marginLeft: 10, backgroundColor: '#c06e6e', opacity: pressed ? .7 : 1, borderRadius: 4, alignItems: 'center', justifyContent: 'center'}]} onPress={() => this.CancelTicketLog() }>
                        <Text style={{fontWeight: 'bold', color: Global.Theme.Highlight.ForegroundColor}}>Cancel</Text>
                    </Pressable>
                    <View style={{flex: 1}}></View>
                    <Pressable style={({pressed}) => [{width: 150, height: 40, marginRight: 10, backgroundColor: Global.Theme.Highlight.BackgroundColor, opacity: pressed ? .7 : 1, borderRadius: 4, alignItems: 'center', justifyContent: 'center'}]} onPress={() => this.SaveTicketLog() }>
                        <Text style={{fontWeight: 'bold', color: Global.Theme.Highlight.ForegroundColor}}>Save</Text>
                    </Pressable>
                </Animated.View>
            );
        } catch (ex) {
            global.Log({Message: 'TicketLogForm.renderFooter>>' + ex.message});
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
            global.Log({Message: 'TicketLogForm.renderSwipeBack>>' + ex.message});
        }
    };
};