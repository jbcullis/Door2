import React, { Component } from 'react';
import {
    View,
    Text,
    Image,
    Keyboard,
    Platform,
    Animated,
    Pressable,
    ScrollView,
} from 'react-native';
import InputControl from '../controls/InputControl.js';
module.exports = class TicketForm extends Component {
    constructor(props) {
        super(props);
        this.Titlebar = null;
        this.CombinedLogSearch = null;
    };
    IsActive() {
        try {
            return Global.State.hasOwnProperty(this.props.ModelID) && Global.State[this.props.ModelID] !== null;
        } catch (ex) {
            global.Log({Message: 'TicketForm.IsActive>>' + ex.message});
        }
    };
    async Show(Params_Value) {
        try {
            global.root.NotificationModal.Show({ NotificationTitle: 'Loading...', NotificationStyle: 'Wait' });

            let _ViewWidth = Global.ScreenX > 600 ? 600 : Global.ScreenX;

            let _Ticket = null;
            if (Global.StringHasContent(Params_Value.TicketID)) {
                _Ticket = await TicketHelper.GetOne({TicketID: Params_Value.TicketID});
            }

            //Default settings on new tickets
            if (_Ticket === null) {
                _Ticket = TicketHelper.Clone({
                    TicketType: 'task',
                    TicketStatus: 'open'
                });
            }

            //Load initial model - force update before flyout
            Global.State[this.props.ModelID] = {
                Ticket: TicketHelper.Clone(_Ticket),
                TicketSnapshot: TicketHelper.Clone(_Ticket),
                TicketDirty: false,
                SaveCallback: Params_Value.hasOwnProperty('SaveCallback') ? Params_Value.SaveCallback : null,
                DeleteCallback: Params_Value.hasOwnProperty('DeleteCallback') ? Params_Value.DeleteCallback : null,
                ActiveWindow: false,
                ViewWidth: _ViewWidth,
                ViewOffset: new Animated.Value(_ViewWidth),
                FooterOffset: new Animated.Value(-70),
                FooterPadding: new Animated.Value(0)
            };
            
            //ActiveHandler must be called after forceUpdate
            this.forceUpdate();
            global.root.ActiveHandler();

            //Run flyout animation
            if (Global.State[this.props.ModelID] !== null && Global.State[this.props.ModelID].ViewOffset !== null && Global.State[this.props.ModelID].ViewOffset._value >= Global.State[this.props.ModelID].ViewWidth) {
                global.root.NotificationModal.Hide()
                setTimeout(() => {
                    Animated.timing(Global.State[this.props.ModelID].ViewOffset, {duration: 200, toValue: 0, useNativeDriver: Global.NativeAnimationDriver}).start();
                }, 1);
            }

        } catch (ex) {
            Global.State[this.props.ModelID] = null;
            global.Log({Message: 'TicketForm.Show>>' + ex.message, Notify: true});
        }
    };
    CheckDirty() {
        try {
            let _IsDirty = (JSON.stringify(Global.State[this.props.ModelID].TicketSnapshot).trim() !== JSON.stringify(Global.State[this.props.ModelID].Ticket).trim());
            if (_IsDirty !== Global.State[this.props.ModelID].TicketDirty) {
                Global.State[this.props.ModelID].TicketDirty = _IsDirty;
                if (Global.State[this.props.ModelID] !== null && Global.State[this.props.ModelID].FooterOffset !== null) {
                    if (Global.State[this.props.ModelID].TicketDirty) {
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
            global.Log({Message: 'TicketForm.CheckDirty>>' + ex.message});
        }
    };  
    CancelTicket() {
        try {
            Global.State[this.props.ModelID].Ticket = TicketHelper.Clone(Global.State[this.props.ModelID].TicketSnapshot);
            this.CheckDirty();
        } catch (ex) {
            global.Log({Message: 'TicketForm.CancelTicket>>' + ex.message, Notify: true});
        }
    }; 
    async SaveTicket() {
        try {
            this.ClearFocus();
            setTimeout(async () => {
                try {

                    await global.root.NotificationModal.Show({ NotificationTitle: 'Saving...', NotificationStyle: 'Wait' });
                    let _Ticket = TicketHelper.Clone(Global.State[this.props.ModelID].Ticket);
        
                    //Save the account
                    _Ticket = await TicketHelper.Save(_Ticket);
                    if (_Ticket !== null) {
                        Global.State[this.props.ModelID].Ticket = TicketHelper.Clone(_Ticket);
                        Global.State[this.props.ModelID].TicketSnapshot = TicketHelper.Clone(_Ticket);
                        this.CheckDirty();

                        //Run callbacks
                        if (Global.State[this.props.ModelID].SaveCallback !== null) {
                            console.warn('here');
                            Global.State[this.props.ModelID].SaveCallback(TicketHelper.Clone(_Ticket));
                        }
                        
                        global.root.NotificationModal.Hide();
                    } else {
                        global.root.NotificationModal.Hide();
                        this.Hide();
                    }
                } catch (ex) {
                    global.Log({Message: 'TicketForm.SaveTicket>>' + ex.message, Notify: true});
                }
            }, Platform.OS === 'macos' || Platform.OS === 'windows' ? 50 : 1);
        } catch (ex) {
            global.Log({Message: 'TicketForm.SaveTicket>>' + ex.message, Notify: true});
        }
    };
    async DeleteTicket() {
        try {
            global.root.ConfirmModal.Show('Just Checking...', 'Are you sure you want to delete this ticket?', 'Yes', 'No', async () => {
                try {
                    await global.root.NotificationModal.Show({ NotificationTitle: 'Deleting...', NotificationStyle: 'Wait' });
                    await TicketHelper.Delete({TicketID: Global.State[this.props.ModelID].Ticket.TicketID});
                    if (Global.State[this.props.ModelID].DeleteCallback !== null) { Global.State[this.props.ModelID].DeleteCallback(Global.State[this.props.ModelID].Ticket.TicketID); }
                    global.root.NotificationModal.Hide();
                    this.Hide();
                } catch (ex) {
                    global.Log({Message: 'TicketForm.DeleteTicket>>' + ex.message, Notify: true});
                }
            }, () => {
                //Cancel - Do Nothing
            });
        } catch (ex) {
            global.Log({Message: 'TicketForm.DeleteTicket>>' + ex.message});
        }
    };

    //Handlers
    ActiveHandler() {
        try {

            //Handle ActiveWindow state
            let _ActiveWindow = false;
            if (this.CombinedLogSearch !== null && this.CombinedLogSearch.IsActive()) {
                this.CombinedLogSearch.ActiveHandler();
            } else if (!global.GlobalModalActive) {
                _ActiveWindow = true;
            }

            //Handle ActiveWindow change
            if (_ActiveWindow !== Global.State[this.props.ModelID].ActiveWindow) {
                Global.State[this.props.ModelID].ActiveWindow = _ActiveWindow;
                this.forceUpdate();
            }

        } catch (ex) {
            global.Log({Message: 'TicketForm.ActiveHandler>>' + ex.message});
        }
    };
    BackHandler() {
        try {
            if (this.CombinedLogSearch !== null && this.CombinedLogSearch.IsActive()) {
                this.CombinedLogSearch.BackHandler();
            } else {
                this.Hide();
            }
        } catch (ex) {
            global.Log({Message: 'TicketForm.BackHandler>>' + ex.message});
        }
    };
    ShortcutHandler(Shortcut_Value) {
        try {
            if (this.CombinedLogSearch?.IsActive()) {
                this.CombinedLogSearch.ShortcutHandler(Shortcut_Value);
            } else {
                if (Shortcut_Value === 'Save' && Global.State[this.props.ModelID]?.TicketDirty === true) {
                    this.SaveTicket();
                } else if (Shortcut_Value === 'Delete' && Global.State[this.props.ModelID]?.TicketDirty === false) {
                    this.DeleteTicket();
                }
            }
        } catch (ex) {
            global.Log({Message: 'TicketForm.BackHandler>>' + ex.message});
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
            global.Log({Message: 'TicketForm.Hide>>' + ex.message});
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
            global.Log({Message: 'TicketForm.ClearFocus>>' + ex.message});
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
                        <CombinedLogSearch ref={ele => this.CombinedLogSearch = ele} ModelID={this.props.ModelID + '_L6YPYL6Z'} />
                    </View>
                );
            } else {
                return (<View></View>);
            }
        } catch (ex) {
            global.Log({Message: 'TicketForm.render>>' + ex.message});
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
                            <Text style={{fontSize: 20, fontWeight: 'bold', color: (global.ColorScheme === 'dark' ? '#eeeeee' : '#121212')}}>TICKET</Text>
                        </View>
                        <Pressable
                            onPress={() => this.DeleteTicket()}
                            style={({pressed}) => [{width: 50, height: 50, alignItems: 'center', justifyContent: 'center', opacity: pressed ? .5 : 1}]}
                        >
                            <Image source={global.ColorScheme === 'dark' ? IMG_Trash_eeeeee : IMG_Trash_121212} style={{width: 24, height: 24}} />
                        </Pressable>
                    </View>
                </Pressable>
            );
        } catch (ex) {
            global.Log({Message: 'TicketForm.renderHeader>>' + ex.message});
        }
    };
    renderBody() {
        try {

            let _ActivityDescription = null;
            if (Global.State[this.props.ModelID].Ticket.TicketActivity !== null) {
                let _ActivityDate = new Date(Global.State[this.props.ModelID].Ticket.TicketActivity + 'Z');
                _ActivityDescription = Global.TimeSince(_ActivityDate);
            }

            let _CreatedDescription = null;
            if (Global.State[this.props.ModelID].Ticket.TicketCreated !== null) {
                let _CreatedDate = new Date(Global.State[this.props.ModelID].Ticket.TicketCreated);
                _CreatedDescription = Global.FormatShortDate(_CreatedDate.getFullYear(), _CreatedDate.getMonth() + 1, _CreatedDate.getDate());
                if (_CreatedDate.getHours() < 12) {
                    _CreatedDescription += ' ' + parseInt(_CreatedDate.getHours() + 12).toString() + ':' + _CreatedDate.getMinutes() + ':' + _CreatedDate.getSeconds() + 'AM';
                } else if (_CreatedDate.getHours() >= 12) {
                    _CreatedDescription += ' ' + parseInt(_CreatedDate.getHours() - 12).toString() + ':' + _CreatedDate.getMinutes() + ':' + _CreatedDate.getSeconds() + 'PM';
                }
            }

            let _TargetParts = Global.State[this.props.ModelID].Ticket.TicketTarget !== null ? Global.State[this.props.ModelID].Ticket.TicketTarget.split('>>') : [];
            let _TargetUI = [];
            let _TargetElement = null;
            for (let _TargetIndex = 0; _TargetIndex < _TargetParts.length; _TargetIndex++) {
                if (_TargetIndex > 0) {
                    _TargetUI.push(
                        <View key={'Target_' + _TargetIndex} style={{flexDirection: 'row', paddingLeft: _TargetIndex * 8}}>
                            <Image source={IMG_Tree_Bottom_000000} style={{width: 12, height: 5, marginTop: 5, opacity: .3, marginRight: 4}} />
                            <Text style={{color: (global.ColorScheme === 'dark' ? '#eeeeee' : '#121212'), fontWeight: 'bold'}}>{_TargetParts[_TargetIndex]}</Text>
                        </View>
                    );
                } else {
                    _TargetUI.push(
                        <Text key={'Target_0'} style={{color: (global.ColorScheme === 'dark' ? '#eeeeee' : '#121212'), fontWeight: 'bold'}}>{_TargetParts[_TargetIndex]}</Text>
                    );
                }
            }
            if (_TargetUI.length > 0) {
                _TargetElement = (
                    <View style={{padding: 10}}>
                        <Text style={{color: '#a9a9a9', fontSize: 12}}>Target</Text>
                        {_TargetUI}
                    </View>
                )
            }

            let _VersionElement = null;
            if (Global.State[this.props.ModelID].Ticket.TicketMajorVersion > 0) {
                _VersionElement = (
                    <InputControl 
                        Name={'Version'}
                        MarginTop={10}
                        Value={Global.State[this.props.ModelID].Ticket.TicketMajorVersion.toString() + '.' + Global.State[this.props.ModelID].Ticket.TicketMinorVersion.toString() + '.' + Global.State[this.props.ModelID].Ticket.TicketPatchVersion.toString()}
                        Enabled={false}
                        Visible={Global.State[this.props.ModelID].Ticket.TicketType !== 'email'}
                    />                    
                )
            }

            let _LogCountElement = null;
            if (Global.State[this.props.ModelID].Ticket.TicketType !== 'task') {
                _LogCountElement = (
                    <View style={{flex: 1, flexDirection: 'row', marginTop: 10, backgroundColor: Global.Theme.Highlight.BackgroundColor, borderRadius: 4}}>
                        <Pressable style={({pressed}) => [{flex: 1, height: 50, opacity: pressed ? .5 : (Global.State[this.props.ModelID].Ticket.TicketType === 'authentication' ? 1 : .5)}]} disabled={Global.State[this.props.ModelID].Ticket.TicketType !== 'authentication'} onPress={async () => {
                            this.CombinedLogSearch.Show({
                                SearchType: 'authentication',
                                SearchTicketID: Global.State[this.props.ModelID].Ticket.TicketID
                            });
                        }}>
                            <View style={{flex: 1, alignItems: 'center', justifyContent: 'center'}}>
                                <Image source={Global.Theme.Highlight.Icons.Lock} style={{width: 22, height: 22}} />
                                <Text style={{color: Global.Theme.Highlight.ForegroundColor}}>{Global.State[this.props.ModelID].Ticket.TicketType === 'authentication' ? Global.State[this.props.ModelID].Ticket.TicketLogCount : '...'}</Text>
                            </View>
                        </Pressable>
                        <View style={{width: 1, backgroundColor: Global.Theme.Body.BackgroundColor, marginTop: 4, marginBottom: 4, opacity: .2}}></View>
                        <Pressable style={({pressed}) => [{flex: 1, height: 50, opacity: pressed ? .5 : (Global.State[this.props.ModelID].Ticket.TicketType === 'activity' ? 1 : .5)}]} disabled={Global.State[this.props.ModelID].Ticket.TicketType !== 'activity'} onPress={async () => {
                            this.CombinedLogSearch.Show({
                                SearchType: 'activity',
                                SearchTicketID: Global.State[this.props.ModelID].Ticket.TicketID
                            });
                        }}>
                            <View style={{flex: 1, alignItems: 'center', justifyContent: 'center'}}>
                                <Image source={Global.Theme.Highlight.Icons.Activity} style={{width: 24, height: 24}} />
                                <Text style={{color: Global.Theme.Highlight.ForegroundColor}}>{Global.State[this.props.ModelID].Ticket.TicketType === 'activity' ? Global.State[this.props.ModelID].Ticket.TicketLogCount : '...'}</Text>
                            </View>
                        </Pressable>
                        <View style={{width: 1, backgroundColor: Global.Theme.Body.BackgroundColor, marginTop: 4, marginBottom: 4, opacity: .2}}></View>
                        <Pressable style={({pressed}) => [{flex: 1, height: 50, opacity: pressed ? .5 : (Global.State[this.props.ModelID].Ticket.TicketType === 'email' ? 1 : .5)}]} disabled={Global.State[this.props.ModelID].Ticket.TicketType !== 'email'} onPress={async () => {
                            this.CombinedLogSearch.Show({
                                SearchType: 'email',
                                SearchTicketID: Global.State[this.props.ModelID].Ticket.TicketID
                            });
                        }}>
                            <View style={{flex: 1, alignItems: 'center', justifyContent: 'center'}}>
                                <Image source={IMG_Email_121212} style={{width: 22, height: 22}} />
                                <Text style={{color: Global.Theme.Highlight.ForegroundColor}}>{Global.State[this.props.ModelID].Ticket.TicketType === 'email' ? Global.State[this.props.ModelID].Ticket.TicketLogCount : '...'}</Text>
                            </View>
                        </Pressable>
                        <View style={{width: 1, backgroundColor: Global.Theme.Body.BackgroundColor, marginTop: 4, marginBottom: 4, opacity: .2}}></View>
                        <Pressable style={({pressed}) => [{flex: 1, height: 50, opacity: pressed ? .5 : (Global.State[this.props.ModelID].Ticket.TicketType === 'exception' ? 1 : .5)}]} disabled={Global.State[this.props.ModelID].Ticket.TicketType !== 'exception'} onPress={async () => {
                            this.CombinedLogSearch.Show({
                                SearchType: 'exception',
                                SearchTicketID: Global.State[this.props.ModelID].Ticket.TicketID
                            });
                        }}>
                            <View style={{flex: 1, alignItems: 'center', justifyContent: 'center'}}>
                                <Image source={IMG_Warning_121212} style={{width: 22, height: 22}} />
                                <Text style={{color: Global.Theme.Highlight.ForegroundColor}}>{Global.State[this.props.ModelID].Ticket.TicketType === 'exception' ? Global.State[this.props.ModelID].Ticket.TicketLogCount : '...'}</Text>
                            </View>
                        </Pressable>
                    </View>
                );                
            }

            return (
                <ScrollView key={'Body_Row'} style={{backgroundColor: Global.Theme.Body.BackgroundColor}}>

                    {/* Ticket Details */}
                    <View  style={{flex: 1, padding: 10}}>

                        {_TargetElement}
                        
                        <InputControl 
                            ref={ele => this.TicketName = ele}
                            Name={Global.StringHasContent(Global.State[this.props.ModelID].Ticket.TicketType) ? Global.State[this.props.ModelID].Ticket.TicketType[0].toUpperCase() + Global.State[this.props.ModelID].Ticket.TicketType.substring(1) : 'Description'}
                            Value={Global.State[this.props.ModelID].Ticket.TicketDescription}
                            MarginTop={10}
                            Changed={(Text_Value) => {
                                Global.State[this.props.ModelID].Ticket.TicketDescription = Text_Value;
                                this.CheckDirty();
                            }}
                            Multiline={true}
                            Enabled={Global.State[this.props.ModelID].Ticket.TicketType === 'task'}
                            Visible={Global.State[this.props.ModelID].Ticket.TicketType === 'activity' || Global.State[this.props.ModelID].Ticket.TicketType === 'email' || Global.State[this.props.ModelID].Ticket.TicketType === 'exception' || Global.State[this.props.ModelID].Ticket.TicketType === 'task'}
                        />
                      
                        {_VersionElement}

                        <InputControl 
                            Name={'Webhook Address'}
                            Value={Global.State[this.props.ModelID].Ticket.TicketWebhook}
                            MarginTop={10}
                            Changed={(Text_Value) => {
                                Global.State[this.props.ModelID].Ticket.TicketWebhook = Text_Value;
                                if (!Global.StringHasContent(Global.State[this.props.ModelID].Ticket.TicketWebhook)) {
                                    Global.State[this.props.ModelID].Ticket.TicketTrigger = null;
                                } else if (!Global.StringHasContent(Global.State[this.props.ModelID].Ticket.TicketTrigger)) {
                                    Global.State[this.props.ModelID].Ticket.TicketTrigger = 'manual';
                                }
                                this.CheckDirty();
                            }}
                            Casing={'lower'}
                            Visible={Global.State[this.props.ModelID].Ticket.TicketType === 'exception'}
                        />

                        <InputControl 
                            Name={'Webhook Trigger'}
                            Value={Global.StringHasContent(Global.State[this.props.ModelID].Ticket.TicketTrigger) ? Global.State[this.props.ModelID].Ticket.TicketTrigger[0].toUpperCase() + Global.State[this.props.ModelID].Ticket.TicketTrigger.substring(1) : null}
                            MarginTop={10}
                            Pressed={() => {
                                this.ClearFocus();
                                global.root.PickerModal.Show([
                                    {Value: 'auto', Text: 'Auto'},
                                    {Value: 'manual', Text: 'Manual'},
                                ], false, (Selected_Value) => {
                                    Global.State[this.props.ModelID].Ticket.TicketTrigger = Selected_Value;
                                    this.CheckDirty();
                                });
                            }}
                            Visible={Global.State[this.props.ModelID].Ticket.TicketType === 'exception' || Global.State[this.props.ModelID].Ticket.TicketType === 'exception'}
                            Enabled={Global.StringHasContent(Global.State[this.props.ModelID].Ticket.TicketWebhook)}
                        />

                        <InputControl 
                            Name={'Status'}
                            Value={Global.StringHasContent(Global.State[this.props.ModelID].Ticket.TicketStatus) ? Global.State[this.props.ModelID].Ticket.TicketStatus[0].toUpperCase() + Global.State[this.props.ModelID].Ticket.TicketStatus.substring(1) : null}
                            MarginTop={10}
                            Pressed={() => {
                                this.ClearFocus();
                                let _Options = [];
                                if (Global.State[this.props.ModelID].Ticket.TicketType === 'task') {
                                    _Options = [
                                        {Value: 'open', Text: 'Open'},
                                        {Value: 'closed', Text: 'Closed'},
                                    ];
                                } else if (Global.State[this.props.ModelID].Ticket.TicketType === 'exception') {
                                    _Options = [
                                        {Value: 'open', Text: 'Open'},
                                        {Value: 'ignore', Text: 'Ignore'},
                                        {Value: 'closed', Text: 'Closed'},
                                    ];
                                }
                                global.root.PickerModal.Show(_Options, false, (Selected_Value) => {
                                    Global.State[this.props.ModelID].Ticket.TicketStatus = Selected_Value;
                                    this.CheckDirty();
                                });
                            }}
                            Visible={Global.State[this.props.ModelID].Ticket.TicketType === 'exception' || Global.State[this.props.ModelID].Ticket.TicketType === 'task'}
                        />

                        {/* Log Counts */}
                        {_LogCountElement}

                        {/* Ticket Created / Active */}
                        <View style={{flex: 1, flexDirection: 'row', marginTop: 10}}>
                            <InputControl 
                                Name={'Created On'}
                                Value={_CreatedDescription} 
                                Enabled={false} 
                            />
                            <InputControl 
                                Name={'Last Activity'}
                                Value={_ActivityDescription}
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
            global.Log({Message: 'TicketForm.renderTicket>>' + ex.message});
        }
    };
    renderFooter() {
        try {
            return (
                <Animated.View key={'Footer_Row'} style={[Styles.v3_footer_container, {bottom: Global.State[this.props.ModelID].FooterOffset}]}>
                    <View style={{position: 'absolute', top: 0, left: 10, right: 10, height: 60, backgroundColor: Global.Theme.Footer.BackgroundColor, borderRadius: 4, opacity: .5}}></View>
                    <Pressable style={({pressed}) => [{width: 150, height: 40, marginLeft: 10, backgroundColor: '#c06e6e', opacity: pressed ? .7 : 1, borderRadius: 4, alignItems: 'center', justifyContent: 'center'}]} onPress={() => this.CancelTicket() }>
                        <Text style={{fontWeight: 'bold', color: Global.Theme.Highlight.ForegroundColor}}>Cancel</Text>
                    </Pressable>
                    <View style={{flex: 1}}></View>
                    <Pressable style={({pressed}) => [{width: 150, height: 40, marginRight: 10, backgroundColor: Global.Theme.Highlight.BackgroundColor, opacity: pressed ? .7 : 1, borderRadius: 4, alignItems: 'center', justifyContent: 'center'}]} onPress={() => this.SaveTicket() }>
                        <Text style={{fontWeight: 'bold', color: Global.Theme.Highlight.ForegroundColor}}>Save</Text>
                    </Pressable>
                </Animated.View>
            );
        } catch (ex) {
            global.Log({Message: 'TicketForm.renderFooter>>' + ex.message});
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
            global.Log({Message: 'TicketForm.renderSwipeBack>>' + ex.message});
        }
    };

};