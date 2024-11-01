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
            global.root.ActiveHandler();
            this.Search(null);

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

            let _Url = 'https://smaps01.sitemesh.com/v1/podcast/list';
            let _Response = await fetch(_Url, { body: JSON.stringify(_Params), method: 'POST', headers: Global.GetHeaders() });
            if (_Response.ok) {
                console.log(SearchID_Value)
                if (SearchID_Value === null || Global.State[this.props.ModelID]?.SearchID === SearchID_Value) {                    
                    //Global.State[this.props.ModelID].SearchCount = await TransactionHelper.GetCount(_Params);
                    Global.State[this.props.ModelID].PodcastList = await _Response.json();
                    this.forceUpdate();
                }                
            } else {
                throw Error(await _Response.text());
            }            
        } catch (ex) {
            global.Log({Message: 'PodcastSearch.Search>>' + ex.message, Notify: true});
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

    render() {
        try {
            if (this.IsActive()) {
                return (
                    <View style={{flex: 1, backgroundColor: Global.Theme.Header.BackgroundColor}}>
                        
                        {/* Searchbox */}
                        <View style={[
                            {
                                height: 70, 
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
    
                        </View>

                        <FlatList 
                            style={{flex: 1, backgroundColor: Global.Theme.Body.BackgroundColor}} 
                            data={Global.State[this.props.ModelID].PodcastList}
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
                                let _Podcast = Global.State[this.props.ModelID].PodcastList[index];
                                console.log(_Podcast);
                                let _BorderColor = '#262626';

                                let _SeparatorUI = null;

                                let _PodcastUI = (
                                    <Pressable 
                                        key={'PodcastList_' + index}
                                        onPress={() => global.root.ShowPodcast(_Podcast)}
                                        style={({pressed}) => [{flex: 1, flexDirection: 'row', opacity: pressed ? .7 : 1, backgroundColor: Global.Theme.Body.ControlBackground, borderRadius: 4, minHeight: 50, marginTop: (_SeparatorUI === null ? 10 : 0), marginLeft: 10, marginRight: 10}]}
                                    >
                                        <View style={{width: 3, backgroundColor: _BorderColor, borderRadius: 4, opacity: .5}}></View>
                                        <View style={{flex: 1, justifyContent: 'center', padding: 10}}>
                                            <Text style={{marginTop: 4, color: Global.Theme.Body.ForegroundColor}}>{_Podcast.PodcastName}</Text>
                                            <Text style={{marginTop: 4, color: Global.Theme.Body.ForegroundColor}}>{_Podcast.PodcastSummary}</Text>
                                        </View>
                                        <View style={{width: 50, alignItems: 'center', justifyContent: 'center'}}>
                                            <Image source={Global.Theme.Body.Icons.Forward} style={{width: 20, height: 20}} />
                                        </View>
                                    </Pressable>
                                );

                                return (
                                    <View>
                                        {_SeparatorUI}
                                        {_PodcastUI}
                                    </View>
                                );

                            }}
                            keyExtractor={item => item.PodcastID} 
                            ListEmptyComponent={() => {
                                return (
                                    <View key={'No_Podcasts_Found'} style={{flex: 1, height: 50, margin: 10, backgroundColor: Global.Theme.Body.ControlBackground, borderRadius: 4, alignItems: 'center', justifyContent: 'center'}}>
                                    <Text style={{color: Global.Theme.Body.ForegroundFade}}>No Recent Podcasts</Text>
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