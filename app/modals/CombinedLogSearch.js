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
    FlatList,
} from 'react-native';
import InputControl from '../controls/InputControl.js';
module.exports = class CombinedLogSearch extends Component {
    constructor(props) {
        super(props);
        this.Titlebar = null;
        this.TicketLogForm = null;
        this.state = {
            Refreshing: false
        }
    };
    IsActive() {
        try {
            return Global.State.hasOwnProperty(this.props.ModelID) && Global.State[this.props.ModelID] !== null;
        } catch (ex) {
            global.Log({Message: 'CombinedLogSearch.IsActive>>' + ex.message});
        }
    };
    async Show(Params_Value) {
        try {
            global.root.NotificationModal.Show({ NotificationTitle: 'Loading...', NotificationStyle: 'Wait' });

            let _ViewWidth = Global.ScreenX > 600 ? 600 : Global.ScreenX;

            let _Params = {
                SearchText: null,
                SearchType: (Params_Value !== null && Params_Value.hasOwnProperty('SearchType') ? Params_Value.SearchType : null),
                SearchTicketID: (Params_Value != null && Params_Value.hasOwnProperty('SearchTicketID') ? Params_Value.SearchTicketID : null),
                SearchAccountID: (Params_Value !== null && Params_Value.hasOwnProperty('SearchAccountID') ? Params_Value.SearchAccountID : null),
                SearchPersonID: (Params_Value !== null && Params_Value.hasOwnProperty('SearchPersonID') ? Params_Value.SearchPersonID : null),
                SearchStatus: null,
                SearchLimit: 25,
                SearchOffset: 0,
            }

            //Create State
            Global.State[this.props.ModelID] = {
                SearchText: _Params.SearchText,
                SearchType: _Params.SearchType,
                SearchTicketID: _Params.SearchTicketID,
                SearchAccountID: _Params.SearchAccountID,
                SearchPersonID: _Params.SearchPersonID,
                SearchStatus: _Params.SearchStatus,
                SearchLimit: _Params.SearchLimit,
                SearchOffset: _Params.SearchOffset,
                CombinedLogCount: await CombinedLogHelper.GetCount(_Params),
                CombinedLogList: await CombinedLogHelper.GetList(_Params),
                ActiveWindow: false,
                ViewWidth: _ViewWidth,
                ViewOffset: new Animated.Value(_ViewWidth),
                FooterOffset: new Animated.Value(-70),
                FooterPadding: new Animated.Value(0),
                LazyLoadEnabled: false,
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
            global.Log({Message: 'CombinedLogSearch.Show>>' + ex.message, Notify: true});
        }
    };

    async Search(SearchID_Value) {
        try {
            Global.State[this.props.ModelID].SearchOffset = 0;
            let _Params = {
                SearchText: Global.State[this.props.ModelID].SearchText,
                SearchType: Global.State[this.props.ModelID].SearchType,
                SearchTicketID: Global.State[this.props.ModelID].SearchTicketID,
                SearchAccountID: Global.State[this.props.ModelID].SearchAccountID,
                SearchPersonID: Global.State[this.props.ModelID].SearchPersonID,
                SearchStatus: Global.State[this.props.ModelID].SearchStatus,
                SearchLimit: Global.State[this.props.ModelID].SearchLimit,
                SearchOffset: Global.State[this.props.ModelID].SearchOffset
            };

            let _CombinedLogList = await CombinedLogHelper.GetList(_Params);
            if (Global.State[this.props.ModelID] !== null
            && (SearchID_Value === null || Global.State[this.props.ModelID].SearchID === SearchID_Value)) {
                Global.State[this.props.ModelID].CombinedLogCount = await CombinedLogHelper.GetCount(_Params);
                Global.State[this.props.ModelID].CombinedLogList = _CombinedLogList;
                this.forceUpdate();
            }
            this.forceUpdate();
        } catch (ex) {
            global.Log({Message: 'CombinedLogSearch.Search>>' + ex.message, Notify: true});
        }
    };
    ExportList() {
        try {
            console.log('Export list');
        } catch (ex) {
            global.Log({Message: 'CombinedLogSearch.ExportList>>' + ex.message, Notify: true});
        }
    };

    async DeleteTicketLog(TicketID_Value, TicketLogID_Value) {
        try {
            for (let _CombinedLogIndex = Global.State[this.props.ModelID].CombinedLogList.length - 1; _CombinedLogIndex >= 0; _CombinedLogIndex--) {
                let _CombinedLog = Global.State[this.props.ModelID].CombinedLogList[_CombinedLogIndex];
                if (_CombinedLog.Ticket.TicketID === TicketID_Value && _CombinedLog.TicketLog.TicketLogID === TicketLogID_Value) {
                    Global.State[this.props.ModelID].CombinedLogList.splice(_CombinedLogIndex, 1);
                }
            }
            this.forceUpdate();
        } catch (ex) {
            global.Log({Message: 'CombinedLogSearch.DeleteTicketLog>>' + ex.message});
        }
    };

    //Handlers
    ActiveHandler() {
        try {

            //Handle ActiveWindow state
            let _ActiveWindow = false;
            if (this.TicketLogForm !== null && this.TicketLogForm.IsActive()) {
                this.TicketLogForm.ActiveHandler();
            } else if (!global.GlobalModalActive) {
                _ActiveWindow = true;
            }

            //Handle ActiveWindow change
            if (_ActiveWindow !== Global.State[this.props.ModelID].ActiveWindow) {
                Global.State[this.props.ModelID].ActiveWindow = _ActiveWindow;
                this.forceUpdate();
            }

        } catch (ex) {
            global.Log({Message: 'CombinedLogSearch.ActiveHandler>>' + ex.message});
        }
    };
    BackHandler() {
        try {
            if (this.TicketLogForm !== null && this.TicketLogForm.IsActive()) {
                this.TicketLogForm.BackHandler();
            } else {
                this.Hide();
            }
        } catch (ex) {
            global.Log({Message: 'CombinedLogSearch.BackHandler>>' + ex.message});
        }
    };
    KeyboardHandler(action, keyboardheight) {
        try {
            if (this.TicketLogForm !== null && this.TicketLogForm.IsActive()) {

            } else {

            }
        } catch (ex) {
            global.Log({Message: 'CombinedLogSearch.KeyboardHandler>>' + ex.message});
        }
    };
    ShortcutHandler(Shortcut_Value) {
        try {
            if (this.TicketLogForm?.IsActive()) {
                this.TicketLogForm.ShortcutHandler(Shortcut_Value);
            } else {
                //Do Nothing
            }
        } catch (ex) {
            global.Log({Message: 'CombinedLogSearch.KeyboardHandler>>' + ex.message});
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
            global.Log({Message: 'CombinedLogSearch.Hide>>' + ex.message});
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
            global.Log({Message: 'CombinedLogSearch.ClearFocus>>' + ex.message, Notify: true});
        }
    };

    render() {
        try {
            if (this.IsActive()) {
                return (
                    <View style={{position: 'absolute', top: 0, right: 0, bottom: 0, left: 0}}>
                        <Animated.View style={{position: 'absolute', top: 0, bottom: 0, right: 0, backgroundColor: Global.Theme.Header.BackgroundColor, width: Global.State[this.props.ModelID].ViewWidth, transform: [{translateX: Global.State[this.props.ModelID].ViewOffset}]}}>
                            <View style={{position: 'absolute', top: 0, right: 0, bottom: 0, width: Global.State[this.props.ModelID].ViewWidth}}>
                                
                                {/* Header */}
                                <View style={{height: 131, padding: 10, marginTop: Global.InsetTop}}>
                                    <View ref={ele => this.Titlebar = ele} style={{ flexDirection:'row', enableFocusRing: false}}>
                                        <Pressable 
                                        onPress={() => {
                                            this.Hide();
                                        }}
                                        style={({pressed}) => [{width: 50, height: 50, alignItems: 'center', justifyContent: 'center', opacity: pressed ? .5 : 1}]}
                                        >
                                            <Image source={global.ColorScheme === 'dark' ? IMG_Back_eeeeee : IMG_Back_121212} style={{width: 24, height: 24}} />
                                        </Pressable>
                                        <Pressable style={{flex: 1, justifyContent: 'center'}} onPress={() => { this.ClearFocus() }}>
                                            <Text style={{fontSize: 20, fontWeight: 'bold', color: Global.Theme.Header.ForegroundColor}}>LOGS ({Global.State[this.props.ModelID].CombinedLogCount})</Text>
                                        </Pressable>
                                        <Pressable 
                                            onPress={() => {
                                                this.ExportList();
                                            }}
                                            style={({pressed}) => [{width: 50, height: 50, alignItems: 'center', justifyContent: 'center', opacity: pressed ? .5 : 1}]}
                                        >
                                                <Image source={global.ColorScheme === 'dark' ? IMG_Upload_eeeeee : IMG_Upload_121212} style={{width: 28, height: 28}} />
                                        </Pressable>

                                    </View>
                                    <View style={{flexDirection: 'row', justifyContent: 'center', marginTop: 10}}>
                                        <InputControl 
                                            Name={'Search'}
                                            PlaceholderTextColor={'#a9a9a9'} 
                                            BorderRadius={'full'}
                                            Value={Global.State[this.props.ModelID].SearchText}
                                            Changed={(Text_Value) => {
                                                Global.State[this.props.ModelID].SearchText = Text_Value;
                                                this.forceUpdate();
                                                clearTimeout(Global.State[this.props.ModelID].SearchTimeout);
                                                Global.State[this.props.ModelID].SearchTimeout = setTimeout(() => {
                                                    let _SearchID = Math.random();
                                                    Global.State[this.props.ModelID].SearchID = _SearchID;
                                                    this.Search(_SearchID);
                                                }, 400);
                                            }}
                                            Editable={this.props.ActiveWindow} 
                                        />
                                    </View>
                                </View>

                                <View style={{flex: 1}}>
                                    {this.renderBody()}
                                    {this.renderFooter()}
                                    {this.renderSwipeBack()}
                                </View>

                            </View>
                        </Animated.View>
                        <TicketLogForm ref={ele => this.TicketLogForm = ele} ModelID={this.props.ModelID + '_XRPOSE1Y'} />
                    </View>
                );
            } else {
                return (<View></View>);
            }
        } catch (ex) {
            global.Log({Message: 'CombinedLogSearch.render>>' + ex.message});
        }
    };
    renderBody() {
        try {
            let _LastDate = null;
            return (
                <FlatList style={{flex: 1, backgroundColor: Global.Theme.Body.BackgroundColor}} data={Global.State[this.props.ModelID].CombinedLogList}
                onScroll={() => {
                    Global.State[this.props.ModelID].LazyLoadEnabled = true;
                }}
                refreshControl={
                    <RefreshControl refreshing={this.state.Refreshing} onRefresh={async () => {
                        try {
                            this.setState({Refreshing: true});
                            await this.Search(null);
                            this.setState({Refreshing: false});
                        } catch (ex) {
                            global.Log({Message: 'CombinedLogSearch.IsActive>>' + ex.message, Notify: true});
                            this.setState({Refreshing: false});
                        }
                    }} />
                }
                onEndReached={() => {
                    try {                        
                        if (Global.State[this.props.ModelID].LazyLoadEnabled) {
                            Global.State[this.props.ModelID].LazyLoadEnabled = false;
                            Global.State[this.props.ModelID].SearchOffset += Global.State[this.props.ModelID].SearchLimit;                
                            CombinedLogHelper.GetList({
                                SearchText: Global.State[this.props.ModelID].SearchText,
                                SearchType: Global.State[this.props.ModelID].SearchType,
                                SearchTicketID: Global.State[this.props.ModelID].SearchTicketID,
                                SearchAccountID: Global.State[this.props.ModelID].SearchAccountID,
                                SearchPersonID: Global.State[this.props.ModelID].SearchPersonID,
                                SearchStatus: Global.State[this.props.ModelID].SearchStatus,
                                SearchLimit: Global.State[this.props.ModelID].SearchLimit,
                                SearchOffset: Global.State[this.props.ModelID].SearchOffset
                            }).then((CombinedLogList_Value) => {
                                Global.State[this.props.ModelID].CombinedLogList = [...Global.State[this.props.ModelID].CombinedLogList, ...CombinedLogList_Value];
                                this.forceUpdate();
                            }).catch((ex) => {
                                global.Log({Message: 'CombinedLogSearch.render>>' + ex.message, Notify: true});
                            });
                        }
                    } catch (ex) {
                        global.Log({Message: 'CombinedLogSearch.render>>' + ex.message, Notify: true});
                    }
                }} renderItem={({item, index, separators}) => {
                    let _CombinedLog = Global.State[this.props.ModelID].CombinedLogList[index];

                    let _BorderColor = '#a9a9a9';
                    if (_CombinedLog.Ticket.TicketType === 'authentication') {
                        _BorderColor = '#77dd77';
                    } else if (_CombinedLog.Ticket.TicketType === 'activity') {
                        _BorderColor = '#2e8cff';
                    } else if (_CombinedLog.Ticket.TicketType === 'email') {
                        _BorderColor = '#6772e5';
                    } else if (_CombinedLog.Ticket.TicketType === 'exception') {
                        _BorderColor = '#ff392e';
                    }

                    let _SeparatorUI = null;
                    let _LogDate = new Date(_CombinedLog.TicketLog.TicketLogTimestamp);
                    let _ShortDate = Global.FormatShortDate(_LogDate.getFullYear(), parseInt(_LogDate.getMonth() + 1), _LogDate.getDate());
                    if (_LastDate === null || (_LastDate !== null && _LastDate !== _ShortDate)) {
                    _LastDate = _ShortDate;
                        _SeparatorUI = (
                            <View key={'DateSeparator_' + index} style={{flex: 1, height: 50, justifyContent: 'center', marginTop: 1, paddingLeft: 11}}>
                                <Text style={{color: (global.ColorScheme === 'dark' ? '#eeeeee' : '#121212'), fontWeight: 'bold', fontSize: 20}}>{_ShortDate}</Text>
                            </View>
                        );
                    }

                    //Build Target
                    let _TargetParts = (_CombinedLog.Ticket.TicketTarget !== null ? _CombinedLog.Ticket.TicketTarget.split('>>') : []);
                    let _TargetUI = [];
                    for (let _TargetIndex = 0; _TargetIndex < _TargetParts.length; _TargetIndex++) {
                        if (_TargetIndex > 0) {
                            _TargetUI.push(
                                <View key={'Target_' + _CombinedLog.Ticket.TicketID + '_' + _TargetIndex} style={{flexDirection: 'row', paddingLeft: _TargetIndex * 8}}>
                                    <Image source={IMG_Tree_Bottom_000000} style={{width: 12, height: 5, marginTop: 3, opacity: .3, marginRight: 4}} />
                                    <Text style={{color: Global.Theme.Body.ForegroundFade, fontSize: 11}}>{_TargetParts[_TargetIndex]}</Text>
                                </View>
                            )
                        } else {
                            _TargetUI.push(
                                <Text key={'Target_' + _CombinedLog.Ticket.TicketID + '_' + _TargetIndex} style={{color: Global.Theme.Body.ForegroundFade, fontSize: 11}}>{_TargetParts[_TargetIndex]}</Text>
                            );
                        }
                    }

                    let _ActivityDescription = null;
                    if (_CombinedLog.TicketLog?.TicketLogCreated !== null) {
                        let _ActivityDate = new Date(_CombinedLog.TicketLog?.TicketLogCreated + 'Z');
                        _ActivityDescription = Global.TimeSince(_ActivityDate);
                    }

                    _CombinedLogUI = (
                        <Pressable 
                            key={'CombinedLogList_' + index}
                            onPress={() => this.TicketLogForm.Show(_CombinedLog.Ticket, _CombinedLog.TicketLog, null, (TicketID_Value, TicketLogID_Value) => this.DeleteTicketLog(TicketID_Value, TicketLogID_Value))}
                            style={({pressed}) => [{flex: 1, flexDirection: 'row', opacity: pressed ? .7 : 1, backgroundColor: Global.Theme.Body.ControlBackground, borderRadius: 4, minHeight: 50, marginTop: 10, marginLeft: 10, marginRight: 10}]}
                        >
                            <View style={{width: 3, backgroundColor: _BorderColor, borderRadius: 4, opacity: .5}}></View>
                            <View style={{flex: 1, justifyContent: 'center', padding: 10}}>
                                <Text style={{color: Global.Theme.Body.ForegroundFade, fontSize: 11}}>{_CombinedLog.TicketLog?.TicketLogPerson?.PersonName?.length > 0 ? _ActivityDescription + ' by ' + _CombinedLog.TicketLog?.TicketLogPerson?.PersonName : _ActivityDescription}</Text>                                
                                {_TargetUI}
                                <Text style={{marginTop: 4, color: Global.Theme.Body.ForegroundColor}}>{_CombinedLog.Ticket.TicketDescription}</Text>
                            </View>
                            <View style={{width: 50, alignItems: 'center', justifyContent: 'center'}}>
                                <Image source={Global.Theme.Body.Icons.Forward} style={{width: 20, height: 20}} />
                            </View>
                        </Pressable>
                    );

                    return (
                        <View>
                            {_SeparatorUI}
                            {_CombinedLogUI}
                        </View>
                    );

                }}
                ListEmptyComponent={() => {
                    return (
                        <View key={'No_Ticket_Logs_Found'} style={{flex: 1, height: 50, margin: 10, backgroundColor: Global.Theme.Body.ControlBackground, borderRadius: 4, alignItems: 'center', justifyContent: 'center'}}>
                            <Text style={{color: Global.Theme.Body.ForegroundFade}}>No Logs Found</Text>
                        </View>
                    );
                }} />
            );

        } catch (ex) {
            global.Log({Message: 'CombinedLogSearch.renderBody>>' + ex.message});
        }
    };
    renderFooter() {
        try {
            return (
                <Animated.View key={'Footer_Row'} style={[Styles.v3_footer_container, {bottom: Global.State[this.props.ModelID].FooterOffset}]}>
                    <View style={{position: 'absolute', top: 0, left: 0, right: 0, bottom: 0, backgroundColor: '#262626', opacity: .4}}></View>
                    <Pressable style={[Styles.form_delete_button, {width: 150}]} onPress={() => this.CancelPerson() }>
                        <Text style={Styles.form_button_text}>Cancel</Text>
                    </Pressable>
                    <View style={{flex: 1}}></View>
                    <Pressable style={[Styles.form_button, {width: 150}]} onPress={() => this.SavePerson(false) }>
                        <Text style={Styles.form_button_text}>Save</Text>
                    </Pressable>
                </Animated.View>
            );
        } catch (ex) {
            global.Log({Message: 'CombinedLogSearch.renderFooter>>' + ex.message, Notify: true});
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
            global.Log({Message: 'CombinedLogSearch.renderSwipeBack>>' + ex.message});
        }
    };
};