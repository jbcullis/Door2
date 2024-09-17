import React, { Component } from 'react';
import {
    View,
    Text,
    Image,
    FlatList,
    Keyboard,
    Pressable,
    Platform,
    RefreshControl
} from 'react-native';
module.exports = class ActivitySearch extends Component {
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
            global.Log({Message: 'ActivitySearch.IsActive>>' + ex.message});
        }
    };
    async Show() {
        try {

            //console.warn(Global.TokenPayload);
            Global.State[this.props.ModelID] = {};
            this.forceUpdate();
            global.root.ActiveHandler();
        } catch (ex) {
            global.Log({Message: 'ActivitySearch.Show>>' + ex.message, Notify: true});
        }
    };
    Hide() {
        try {
            if (Global.State[this.props.ModelID] !== null) {
                Global.State[this.props.ModelID] = null;
            }
        } catch (ex) {
            global.Log({Message: 'ActivitySearch.Show>>' + ex.message});
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
            global.Log({Message: 'ActivitySearch.ClearFocus>>' + ex.message});
        }
    };


    render() {
        try {
            if (this.IsActive()) {
                return (
                    <View style={{flex: 1}}>
                        
                        {/* Header */}
                        <View style={[
                            {
                                height: 70, 
                                padding: 10,
                            }
                        ]}>
    
                            {/* Statistic Search Header */}
                            <View style={{flex: 1, flexDirection: 'row', height: 50}}>
                                <Pressable 
                                    onPress={() => {
                                        global.root.AuthDelete();
                                    }}
                                    style={({pressed}) => [{width: 50, height: 50, alignItems: 'center', justifyContent: 'center', opacity: pressed ? .5 : 1}]}
                                >
                                    <Image source={Global.Theme.Header.Icons.Back} style={{width: 20, height: 20}} />
                                </Pressable>
                                <View style={{flex: 1, height: 50, alignItems: 'center', justifyContent: 'center'}}>
                                    <Image source={IMG_LOGO} style={{width: 166, height: 33, margin: 20}} />
                                </View>
                                <Pressable 
                                    onPress={() => {
                                        console.log('Show Settings');
                                    }}
                                    style={({pressed}) => [{width: 50, height: 50, alignItems: 'center', justifyContent: 'center', opacity: pressed ? .5 : 1}]}
                                >
                                    <Image source={global.ColorScheme === 'dark' ? IMG_Settings_eeeeee : IMG_Settings_121212} style={{width: 24, height: 24}} />
                                </Pressable>
                            </View>
    
                        </View>
    
                        {/* Statistic List */}

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
                                    <Text style={{color: Global.Theme.Body.ForegroundFade}}>No Recent Activity</Text>
                                </View>
                                );
                            }}
                        />
                        
                    </View>
                );
            } else {
                return <View></View>
            }
        } catch (ex) {
            global.Log({Message: 'ActivitySearch.render>>' + ex.message});
        }
    };
};