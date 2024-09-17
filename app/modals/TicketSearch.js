import React, { Component } from 'react';
import {
    View,
    Text,
    RefreshControl,
    Image,
    Keyboard,
    Pressable,
    Platform,
    FlatList,
} from 'react-native';
import ElementControl from '../controls/ElementControl.js';
module.exports = class TicketSearch extends Component {
    constructor(props) {
        super(props);
        this.Titlebar = null;
        this.state = {
            Refreshing: false
        };
    };
    IsActive() {
        try {
            return Global.State.hasOwnProperty(this.props.ModelID) && Global.State[this.props.ModelID] !== null;
        } catch (ex) {
            global.Log({Message: 'TicketSearch.IsActive>>' + ex.message});
        }
    };
    async Show() {
        try {
            global.root.NotificationModal.Show({ NotificationTitle: 'Loading...', NotificationStyle: 'Wait' });
            let _TicketFilter = await Global.GetTicketFilter();
            let _Params = {
                SearchType: _TicketFilter.SearchType,
                SearchText: _TicketFilter.SearchText,
                SearchStatus: _TicketFilter.SearchStatus,
                SearchLimit: 25,
                SearchOffset: 0,
            };
            Global.State[this.props.ModelID] = {
                SearchID: null,
                SearchTimeout: null,
                SearchType: _TicketFilter.SearchType,        
                SearchText: _TicketFilter.SearchText,
                SearchStatus: _TicketFilter.SearchStatus,
                SearchLimit: 25,
                SearchOffset: 0,
                TicketCount: await TicketHelper.GetCount(_Params),
                TicketList: await TicketHelper.GetList(_Params)
            }
            this.forceUpdate();
            global.root.ActiveHandler();
            global.root.NotificationModal.Hide();
        } catch (ex) {
            Global.State[this.props.ModelID] = null;
            global.Log({Message: 'TicketSearch.Show>>' + ex.message, Notify: true});
        }
    };
    Hide() {
        try {
            if (Global.State[this.props.ModelID] !== null) {
                Global.State[this.props.ModelID] = null;
            }
        } catch (ex) {
            global.Log({Message: 'TicketSearch.Show>>' + ex.message});
        }
    };

    async Search(SearchID_Value) {
        try {
            Global.State[this.props.ModelID].SearchOffset = 0;
            let _Params = {
                SearchText: Global.State[this.props.ModelID].SearchText,
                SearchType: Global.State[this.props.ModelID].SearchType,
                SearchStatus: Global.State[this.props.ModelID].SearchStatus,
                SearchLimit: Global.State[this.props.ModelID].SearchLimit,
                SearchOffset: Global.State[this.props.ModelID].SearchOffset,
            };
            let _TicketList = await TicketHelper.GetList(_Params);
            if (Global.State[this.props.ModelID] !== null
            && (SearchID_Value === null || Global.State[this.props.ModelID].SearchID === SearchID_Value)) {
                Global.State[this.props.ModelID].TicketCount = await TicketHelper.GetCount(_Params);
                Global.State[this.props.ModelID].TicketList = _TicketList;
                this.forceUpdate();
                Global.SetTicketFilter({
                    SearchType: Global.State[this.props.ModelID].SearchType,
                    SearchText: Global.State[this.props.ModelID].SearchText,
                    SearchStatus: Global.State[this.props.ModelID].SearchStatus,
                })
            }
            this.forceUpdate();
        } catch (ex) {
            global.Log({Message: 'TicketSearch.Search>>' + ex.message, Notify: true});
        }
    };
    async Delete(TicketID_Value) {
        try {
            for (let _TicketIndex = Global.State[this.props.ModelID].TicketList.length - 1; _TicketIndex >= 0; _TicketIndex--) {
                let _Ticket = Global.State[this.props.ModelID].TicketList[_TicketIndex];
                if (_Ticket.TicketID === TicketID_Value) {
                    Global.State[this.props.ModelID].TicketList.splice(_TicketIndex, 1);
                }
            }
            Global.State[this.props.ModelID].TicketCount--;
        } catch (ex) {
            global.Log({Message: 'TicketSearch.ClearFocus>>' + ex.message});
        }
    }
    ClearFocus() {
        try {
            if (Platform.OS === 'macos') {
                this.Titlebar.focus();
                this.Titlebar.blur();
            } else {
                Keyboard.dismiss();
            }
        } catch (ex) {
            global.Log({Message: 'TicketSearch.ClearFocus>>' + ex.message});
        }
    };

    render() {
        try {
            if (this.IsActive()) {
                let _GroupVersion = null;
                return (
                    <View style={{flex: 1, backgroundColor: Global.Theme.Header.BackgroundColor}}>
                        
                        {/* Searchbox */}
                        <View style={[
                            {
                                height: 131, 
                                padding: 10,
                            }
                        ]}>
    
                            {/* Ticket Search Header */}
                            <View style={{flexDirection: 'row', height: 50}}>
                                <Pressable 
                                    onPress={() => {
                                        global.root.NavBack();
                                    }}
                                    style={({pressed}) => [{width: 50, height: 50, alignItems: 'center', justifyContent: 'center', opacity: pressed ? .5 : 1}]}
                                >
                                    <Image source={Global.Theme.Header.Icons.Back} style={{width: 20, height: 20}} />
                                </Pressable>
                                <View style={{flex: 1, height: 50, justifyContent: 'center'}}>
                                    <Text style={{fontSize: 20, fontWeight: 'bold', color: (global.ColorScheme === 'dark' ? '#eeeeee' : '#121212')}}>TICKETS ({Global.State[this.props.ModelID].TicketCount})</Text>
                                </View>
                                <Pressable 
                                    onPress={() => global.root.ShowTicket({ TicketID: null })}
                                    style={({pressed}) => [{width: 50, height: 50, alignItems: 'center', justifyContent: 'center', opacity: pressed ? .5 : 1}]}
                                >
                                    <Image source={Global.Theme.Header.Icons.Add} style={{width: 28, height: 28}} />
                                </Pressable>
                            </View>

                            {/* Ticket Search Filter */}
                            <View style={{flexDirection: 'row', marginTop: 10, backgroundColor: Global.Theme.Body.ControlBackground, borderRadius: 4}}>
                                <ElementControl 
                                    Name={'Search'}
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
                                    Casing={'upper'}
                                    RadiusTopRight={0}
                                    RadiusBottomRight={0}
                                    Editable={this.props.ActiveWindow} 
                                />
                                <View style={{width: 1, backgroundColor: Global.Theme.Body.BackgroundFade, marginTop: 4, marginBottom: 4}}></View>
                                <ElementControl 
                                    Name={'Type'}
                                    Width={100}
                                    Value={Global.State[this.props.ModelID].SearchType}
                                    Pressed={() => {
                                        global.root.PickerModal.Show([
                                            {Text: '-- All Types --', Value: null},
                                            {Text: 'Activity', Value: 'activity'},
                                            {Text: 'Authentication', Value: 'authentication'},
                                            {Text: 'Email', Value: 'email'},
                                            {Text: 'Exception', Value: 'exception'},
                                        ], false, (Selected_Value) => {
                                            Global.State[this.props.ModelID].SearchType = Selected_Value;
                                            this.forceUpdate();
                                            this.Search(null);
                                        })
                                    }}
                                    Editable={this.props.ActiveWindow} 
                                />
                                <View style={{width: 1, backgroundColor: Global.Theme.Body.BackgroundFade, marginTop: 4, marginBottom: 4}}></View>
                                <ElementControl 
                                    Name={'Status'}
                                    Width={100}
                                    Value={Global.State[this.props.ModelID].SearchStatus}
                                    Pressed={() => {
                                        global.root.PickerModal.Show([
                                            {Value: 'open', Text: 'Open'},
                                            {Value: 'ignore', Text: 'Ignore'},
                                            {Value: 'closed', Text: 'Closed'},
                                        ], false, (Selected_Value) => {
                                            Global.State[this.props.ModelID].SearchStatus = Selected_Value;
                                            this.forceUpdate();
                                            this.Search(null);
                                        })
                                    }}
                                    Editable={this.props.ActiveWindow} 
                                />                                 
                            </View>                       
    
                        </View>
    
                        <FlatList 
                        style={{flex: 1, backgroundColor: Global.Theme.Body.BackgroundColor}} 
                        data={Global.State[this.props.ModelID].TicketList}
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
                                    global.Log({Message: 'TicketSearch.IsActive>>' + ex.message, Notify: true});
                                    this.setState({Refreshing: false});
                                }
                            }} />
                        }
                        onEndReached={() => {
                            try {                        
                                if (Global.State[this.props.ModelID].LazyLoadEnabled) {
                                    Global.State[this.props.ModelID].LazyLoadEnabled = false;
                                    Global.State[this.props.ModelID].SearchOffset += Global.State[this.props.ModelID].SearchLimit;                
                                    TicketHelper.GetList({
                                        SearchText: Global.State[this.props.ModelID].SearchText,
                                        SearchType: Global.State[this.props.ModelID].SearchType,
                                        SearchStatus: Global.State[this.props.ModelID].SearchStatus,
                                        SearchLimit: Global.State[this.props.ModelID].SearchLimit,
                                        SearchOffset: Global.State[this.props.ModelID].SearchOffset
                                    }).then((TicketList_Value) => {
                                        Global.State[this.props.ModelID].TicketList = [...Global.State[this.props.ModelID].TicketList, ...TicketList_Value];
                                        this.forceUpdate();
                                    }).catch((ex) => {
                                        global.Log({Message: 'TicketSearch.render>>' + ex.message, Notify: true});
                                    });
                                }
                            } catch (ex) {
                                global.Log({Message: 'TicketSearch.render>>' + ex.message, Notify: true});
                            }
                        }} 
                        renderItem={({item, index, separators}) => {
                            let _Ticket = Global.State[this.props.ModelID].TicketList[index];

                            let _BorderColor = '#262626';
                            if (_Ticket.TicketType === 'authentication') {
                                _BorderColor = '#77dd77';
                            } else if (_Ticket.TicketType === 'activity') {
                                _BorderColor = '#2e8cff';
                            } else if (_Ticket.TicketType === 'email') {
                                _BorderColor = '#6772e5';
                            } else if (_Ticket.TicketType === 'exception') {
                                _BorderColor = '#ff392e';
                            } else if (_Ticket.TicketType === 'task') {
                                _BorderColor = '#957dad';
                            }
        
                            //Separator
                            let _SeparatorUI = null;
                            if (_Ticket.TicketType !== 'email' && _Ticket.TicketType !== 'task') {
                                let _TicketVersion = _Ticket.TicketMajorVersion + '.' + _Ticket.TicketMinorVersion + '.' + _Ticket.TicketPatchVersion;
                                if (index === 0 || _GroupVersion !== _TicketVersion) {                                
                                    _GroupVersion = _TicketVersion;
                                    _SeparatorUI = (
                                        <View key={'GroupVersion_' + _GroupVersion} style={{flex: 1, height: 50, justifyContent: 'center', marginTop: 1, paddingLeft: 11}}>
                                            <Text style={{color: Global.Theme.Body.ForegroundFade, fontWeight: 'bold', fontSize: 20}}>{_GroupVersion}</Text>
                                        </View>
                                    );
                                }
                            }

                            //Build Target
                            let _TargetParts = (_Ticket.TicketTarget !== null ? _Ticket.TicketTarget.split('>>') : []);
                            let _TargetUI = [];
                            for (let _TargetIndex = 0; _TargetIndex < _TargetParts.length; _TargetIndex++) {
                                if (_TargetIndex > 0) {
                                    _TargetUI.push(
                                        <View key={'Target_' + _Ticket.TicketID + '_' + _TargetIndex} style={{flexDirection: 'row', paddingLeft: _TargetIndex * 8}}>
                                            <Image source={IMG_Tree_Bottom_000000} style={{width: 12, height: 5, marginTop: 3, opacity: .3, marginRight: 4}} />
                                            <Text style={{color: Global.Theme.Body.ForegroundFade, fontSize: 11}}>{_TargetParts[_TargetIndex]}</Text>
                                        </View>
                                    )
                                } else {
                                    _TargetUI.push(
                                        <Text key={'Target_' + _Ticket.TicketID + '_' + _TargetIndex} style={{color: Global.Theme.Body.ForegroundFade, fontSize: 11}}>{_TargetParts[_TargetIndex]}</Text>
                                    );
                                }
                            }

                            let _TicketUI = (
                                <Pressable 
                                    key={'TicketList_' + index}
                                    onPress={() => global.root.ShowTicket({TicketID: _Ticket.TicketID, DeleteCallback: (TicketID_Value) => this.Delete(TicketID_Value)})}
                                    style={({pressed}) => [{flex: 1, flexDirection: 'row', opacity: pressed ? .7 : 1, backgroundColor: Global.Theme.Body.ControlBackground, borderRadius: 4, minHeight: 50, marginTop: 10, marginLeft: 10, marginRight: 10}]}
                                >
                                    <View style={{width: 3, backgroundColor: _BorderColor, borderRadius: 4, opacity: .5}}></View>
                                    <View style={{flex: 1, justifyContent: 'center', padding: 10}}>
                                        <Text style={{color: Global.Theme.Body.ForegroundFade, fontSize: 11}}>{_Ticket.TicketLogCount} Occurances</Text>
                                        {_TargetUI}
                                        <Text style={{marginTop: 4, color: (global.ColorScheme === 'dark' ? '#eeeeee' : '#121212')}}>{_Ticket.TicketDescription}</Text>
                                    </View>
                                    <View style={{width: 50, alignItems: 'center', justifyContent: 'center'}}>
                                        <Image source={Global.Theme.Body.Icons.Forward} style={{width: 20, height: 20}} />
                                    </View>
                                </Pressable>
                            );

                            return (
                                <View>
                                    {_SeparatorUI}
                                    {_TicketUI}
                                </View>
                            );
                            
                        }}
                        keyExtractor={item => item.TicketID} 
                        ListEmptyComponent={() => {
                            return (
                                <View key={'No_Tickets_Found'} style={{flex: 1, height: 50, margin: 10, backgroundColor: Global.Theme.Body.ControlBackground, borderRadius: 4, alignItems: 'center', justifyContent: 'center'}}>
                                    <Text style={{color: Global.Theme.Body.ForegroundFade}}>No Tickets Found</Text>
                                </View>
                            );
                        }} />
                        
                    </View>
                );
            } else {
                return (
                    <View></View>
                )
            }
        } catch (ex) {
            global.Log({Message: 'TicketSearch.render>>' + ex.message});
        }
    };
};