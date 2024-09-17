import React, { Component } from 'react';
import { Buffer } from 'buffer';
import {
    View,
    Text,
    Image,
    RefreshControl,
    Keyboard,
    FlatList,
    Pressable,
    Platform,
} from 'react-native';
import ElementControl from '../controls/ElementControl.js';
module.exports = class PodcastSearch extends Component {
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
            global.Log({Message: 'PodcastSearch.IsActive>>' + ex.message});
        }
    };
    async Show() {
        try {
            global.root.NotificationModal.Show({ NotificationTitle: 'Loading...', NotificationStyle: 'Wait' });
            Global.State[this.props.ModelID] = {
                SearchID: null,
                SearchTimeout: null,
                SearchText: null,
                SearchLimit: 25,
                SearchOffset: 0,
                SearchCount: 0,
                PodcastList: [],
                LazyLoadEnabled: false,
            }
            this.forceUpdate();
            global.root.ActiveHandler();
            global.root.NotificationModal.Hide();
        } catch (ex) {
            Global.State[this.props.ModelID] = null;
            global.Log({Message: 'PodcastSearch.Show>>' + ex.message, Notify: true});
        }
    };
    Hide() {
        try {
            if (Global.State[this.props.ModelID] !== null) {
                Global.State[this.props.ModelID] = null;
            }
        } catch (ex) {
            global.Log({Message: 'PodcastSearch.Show>>' + ex.message});
        }
    };

    async Search(SearchID_Value) {
        try {
            Global.State[this.props.ModelID].SearchOffset = 0;
            let _Params = {
                SearchText: Global.State[this.props.ModelID].SearchText,
                SearchLimit: Global.State[this.props.ModelID].SearchLimit,
                SearchOffset: Global.State[this.props.ModelID].SearchOffset
            };

            let _TransactionList = await TransactionHelper.GetList(_Params);
            if (Global.State[this.props.ModelID] !== null
            && (SearchID_Value === null || Global.State[this.props.ModelID].SearchID === SearchID_Value)) {
                Global.State[this.props.ModelID].SearchCount = await TransactionHelper.GetCount(_Params);
                Global.State[this.props.ModelID].TransactionList = _TransactionList;
                this.forceUpdate();
            }
            this.forceUpdate();
        } catch (ex) {
            global.Log({Message: 'PodcastSearch.Search>>' + ex.message, Notify: true});
        }
    };
    async Update(Transaction_Value) {
        try {
            let _Updated = false;
            for (let _TransactionIndex = Global.State[this.props.ModelID].TransactionList.length - 1; _TransactionIndex >= 0; _TransactionIndex--) {
                let _Transaction = Global.State[this.props.ModelID].TransactionList[_TransactionIndex];
                if (_Transaction.TransactionID === Transaction_Value.TransactionID) {
                    Global.State[this.props.ModelID].TransactionList.splice(_TransactionIndex, 1, TransactionHelper.Clone(Transaction_Value));
                    _Updated = true;
                }
            }
            if (!_Updated) {
                Global.State[this.props.ModelID].TransactionList.push(TransactionHelper.Clone(Transaction_Value));
            }
            this.forceUpdate();
        } catch (ex) {
            global.Log({Message: 'PodcastSearch.Update>>' + ex.message});
        }
    };
    async Delete(Transaction_Value) {
        try {
            for (let _TransactionIndex = Global.State[this.props.ModelID].TransactionList.length - 1; _TransactionIndex >= 0; _TransactionIndex--) {
                let _Transaction = Global.State[this.props.ModelID].TransactionList[_TransactionIndex];
                if (_Transaction.TransactionID === Transaction_Value.TransactionID) {
                    Global.State[this.props.ModelID].TransactionList.splice(_TransactionIndex, 1);
                }
            }
            this.forceUpdate();
        } catch (ex) {
            global.Log({Message: 'PodcastSearch.Delete>>' + ex.message});
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
            global.Log({Message: 'PodcastSearch.ClearFocus>>' + ex.message});
        }
    };

    //Handlers
    ActiveHandler() {
        try {
            //Do Nothing
        } catch (ex) {
            global.Log({Message: 'PodcastSearch.ActiveHandler>>' + ex.message});
        }
    };
    BackHandler() {
        try {
            this.Hide();
        } catch (ex) {
            global.Log({Message: 'PodcastSearch.BackHandler>>' + ex.message});
        }
    };
    KeyboardHandler(action, keyboardheight) {
        try {
            //Do Nothing
        } catch (ex) {
            global.Log({Message: 'PodcastSearch.KeyboardHandler>>' + ex.message});
        }
    };
    ShortcutHandler(Shortcut_Value) {
        try {
            //Do Nothing
        } catch (ex) {
            global.Log({Message: 'PodcastSearch.KeyboardHandler>>' + ex.message});
        }
    };

    render() {
        try {
            if (this.IsActive()) {
                let _LastDate = null;
                return (
                    <View style={{flex: 1, backgroundColor: Global.Theme.Header.BackgroundColor}}>
                        
                        {/* Searchbox */}
                        <View style={[
                            {
                                height: 131, 
                                padding: 10,
                            }
                        ]}>
    

                            {/* Header */}
                            <View style={{flexDirection: 'row', height: 50}}>
                                <Pressable 
                                    onPress={() => {
                                        global.root.NavBack();
                                    }}
                                    style={({pressed}) => [{width: 50, height: 50, alignItems: 'center', justifyContent: 'center', opacity: pressed ? .5 : 1}]}
                                >
                                        <Image source={Global.Theme.Header.Icons.Back} style={{width: 20, height: 20}} />
                                </Pressable>                                  
                                <View style={{flex: 1, height: 50, alignItems: 'center', justifyContent: 'center', marginRight: 50}}>
                                    <Text style={{fontSize: 20, fontWeight: 'bold', color: (global.ColorScheme === 'dark' ? '#eeeeee' : '#121212')}} numberOfLines={1}>Podcasts</Text>
                                </View>
                            </View>
    
                            {/* Search */}
                            <View style={{flexDirection: 'row', justifyContent: 'center', marginTop: 10}}>
                                <ElementControl 
                                    Name={'Search'}
                                    Casing={'upper'}                               
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

                        <FlatList 
                            style={{flex: 1, backgroundColor: Global.Theme.Body.BackgroundColor}} 
                            data={Global.State[this.props.ModelID].TransactionList}
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
                                        global.Log({Message: 'PodcastSearch.IsActive>>' + ex.message, Notify: true});
                                        this.setState({Refreshing: false});
                                    }
                                }} />
                            }
                            onEndReached={() => {
                                try {                        
                                    if (Global.State[this.props.ModelID].LazyLoadEnabled) {
                                        Global.State[this.props.ModelID].LazyLoadEnabled = false;
                                        Global.State[this.props.ModelID].SearchOffset += Global.State[this.props.ModelID].SearchLimit;                
                                        TransactionHelper.GetList({
                                            SearchText: Global.State[this.props.ModelID].SearchText,
                                            SearchLimit: Global.State[this.props.ModelID].SearchLimit,
                                            SearchOffset: Global.State[this.props.ModelID].SearchOffset
                                        }).then((TransactionList_Value) => {
                                            Global.State[this.props.ModelID].TransactionList = [...Global.State[this.props.ModelID].TransactionList, ...TransactionList_Value];
                                            this.forceUpdate();
                                        }).catch((ex) => {
                                            global.Log({Message: 'PodcastSearch.render>>' + ex.message, Notify: true});
                                        });
                                    }
                                } catch (ex) {
                                    global.Log({Message: 'PodcastSearch.render>>' + ex.message, Notify: true});
                                }
                            }}
                            renderItem={({item, index, separators}) => {
                                let _Transaction = Global.State[this.props.ModelID].TransactionList[index];

                                let _BorderColor = '#262626';
                                if (_Transaction.TransactionPaymentType === 'unpaid') {
                                    _BorderColor = '#ff392e'
                                } else {
                                    _BorderColor = Global.Theme.Highlight.BackgroundColor;
                                }

                                let _SeparatorUI = null;
                                let _TransactionDate = new Date(_Transaction.TransactionDate);
                                let _TransactionShortDate = Global.FormatShortDate(_TransactionDate.getFullYear(), parseInt(_TransactionDate.getMonth() + 1), _TransactionDate.getDate());
                                if (_LastDate === null || (_LastDate !== null && _LastDate !== _TransactionShortDate)) {
                                    _LastDate = _TransactionShortDate;
                                    _SeparatorUI = (
                                        <View key={'DateSeparator_' + index} style={{flex: 1, height: 50, justifyContent: 'center', marginTop: 1, paddingLeft: 11}}>
                                            <Text style={{color: (global.ColorScheme === 'dark' ? '#eeeeee' : '#121212'), fontWeight: 'bold', fontSize: 20}}>{_TransactionShortDate}</Text>
                                        </View>
                                    );
                                }

                                let _TransactionUI = (
                                    <Pressable 
                                        key={'TransactionList_' + index}
                                        onPress={() => global.root.ShowTransaction({
                                            TransactionID: _Transaction.TransactionID,
                                            SaveCallback: (Transaction_Value) => this.Update(Transaction_Value),
                                            DeleteCallback: (TransactionID_Value) => this.Delete(TransactionID_Value)
                                        })}
                                        style={({pressed}) => [{flex: 1, flexDirection: 'row', opacity: pressed ? .7 : 1, backgroundColor: Global.Theme.Body.ControlBackground, borderRadius: 4, minHeight: 50, marginTop: (_SeparatorUI === null ? 10 : 0), marginLeft: 10, marginRight: 10}]}
                                    >
                                        <View style={{width: 3, backgroundColor: _BorderColor, borderRadius: 4, opacity: .5}}></View>
                                        <View style={{flex: 1, justifyContent: 'center', padding: 10}}>
                                            <Text style={{color: Global.Theme.Body.ForegroundFade, fontSize: 11}}>{_Transaction.TransactionAccount !== null ? _Transaction.TransactionAccount.AccountName : null}</Text>
                                            <Text style={{color: Global.Theme.Body.ForegroundFade, fontSize: 11, marginTop: 4}}>${Global.FormatNumber(parseFloat(_Transaction.TransactionTotal * _Transaction.TransactionExchange), 2, '.' , ',')} on {Global.FormatShortDate(_TransactionDate.getFullYear(), _TransactionDate.getMonth() + 1, _TransactionDate.getDate()) + ' (' + (_Transaction.TransactionPaymentType === 'unpaid' ? 'Unpaid' : 'Paid') + ')'}</Text>
                                            <Text style={{marginTop: 4, color: Global.Theme.Body.ForegroundColor}}>{_Transaction.TransactionNumber}</Text>
                                        </View>
                                        <View style={{width: 50, alignItems: 'center', justifyContent: 'center'}}>
                                            <Image source={Global.Theme.Body.Icons.Forward} style={{width: 20, height: 20}} />
                                        </View>
                                    </Pressable>
                                );

                                return (
                                    <View>
                                        {_SeparatorUI}
                                        {_TransactionUI}
                                    </View>
                                );

                            }}
                            keyExtractor={item => item.TransactionID} 
                            ListEmptyComponent={() => {
                                return (
                                    <View key={'No_Podcasts_Found'} style={{flex: 1, height: 50, margin: 10, backgroundColor: Global.Theme.Body.ControlBackground, borderRadius: 4, alignItems: 'center', justifyContent: 'center'}}>
                                    <Text style={{color: Global.Theme.Body.ForegroundFade}}>No Podcasts Found</Text>
                                </View>
                                );
                            }}
                        />

                    </View>
                );
            } else {
                return (
                    <View></View>
                )
            }
        } catch (ex) {
            global.Log({Message: 'PodcastSearch.render>>' + ex.message});
        }
    };
};