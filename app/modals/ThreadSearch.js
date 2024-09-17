import React, { Component } from 'react';
import {
    View,
    Text,
    Image,
    Keyboard,
    Pressable,
    Platform,
    FlatList,
    RefreshControl,
} from 'react-native';
import ElementControl from '../controls/ElementControl.js';
module.exports = class ThreadSearch extends Component {
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
            global.Log({Message: 'ThreadSearch.IsActive>>' + ex.message});
        }
    };
    async Show() {
        try {
            global.root.NotificationModal.Show({ NotificationTitle: 'Loading...', NotificationStyle: 'Wait' });
            let _ThreadFilter = await Global.GetThreadFilter();

            let _Params = {
                SearchText: _ThreadFilter.SearchText,
                SearchStatus: 'active',
                SearchLimit: 25,
                SearchOffset: 0
            };

            Global.State[this.props.ModelID] = {
                SearchID: null,
                SearchTimeout: null,
                SearchText: _Params.SearchText,
                SearchStatus: _Params.SearchStatus,
                SearchLimit: _Params.SearchLimit,
                SearchOffset: _Params.SearchOffset,                
                SearchCount: await ThreadHelper.GetCount(_Params),
                ThreadList: await ThreadHelper.GetList(_Params),
                LazyLoadEnabled: false
            }
            
            this.SortThreads();
            
            this.forceUpdate();
            global.root.ActiveHandler();
            global.root.NotificationModal.Hide();

        } catch (ex) {
            Global.State[this.props.ModelID] = null;
            global.Log({Message: 'ThreadSearch.Show>>' + ex.message, Notify: true});
        }
    };
    Hide() {
        try {
            if (Global.State[this.props.ModelID] !== null) {
                Global.State[this.props.ModelID] = null;
            }
        } catch (ex) {
            global.Log({Message: 'ThreadSearch.Show>>' + ex.message});
        }
    };
    async Search(SearchID_Value) {
        try {
            let _ThreadList = await ThreadHelper.GetList({
                SearchText: Global.State[this.props.ModelID].SearchText,
                SearchStatus: Global.State[this.props.ModelID].SearchStatus,
                SearchLimit: Global.State[this.props.ModelID].SearchLimit,
                SearchOffset: Global.State[this.props.ModelID].SearchOffset,
            });
            if (SearchID_Value === null || Global.State[this.props.ModelID].SearchID === SearchID_Value) {
                Global.State[this.props.ModelID].ThreadList = _ThreadList;
                this.forceUpdate();
                Global.SetThreadFilter({
                    SearchText: Global.State[this.props.ModelID].SearchText,
                });                
            } else {
                this.forceUpdate();
            }
        } catch (ex) {
            global.Log({Message: 'ThreadSearch.Search>>' + ex.message, Notify: true});
        }
    };
    async Delete(ThreadID_Value) {
        try {
            for (let _ThreadIndex = Global.State[this.props.ModelID].ThreadList.length - 1; _ThreadIndex >= 0; _ThreadIndex--) {
                let _Thread = Global.State[this.props.ModelID].ThreadList[_ThreadIndex];
                if (_Thread.ThreadID === ThreadID_Value) {
                    Global.State[this.props.ModelID].ThreadList.splice(_ThreadIndex, 1);
                }
            }
        } catch (ex) {
            global.Log({Message: 'ThreadSearch.Delete>>' + ex.message});
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
            global.Log({Message: 'ThreadSearch.ClearFocus>>' + ex.message});
        }
    };

    SortThreads() {
        try {
            Global.State[this.props.ModelID].ThreadList.sort((a, b) => {

                let _A_Unread = a.ThreadPersonID === '@support' && a.ThreadPersonActivity < a.ThreadActivity;
                let _B_Unread = b.ThreadPersonID === '@support' && b.ThreadPersonActivity < b.ThreadActivity;

                //First sort by unread
                if (_A_Unread < _B_Unread) return 1;
                if (_A_Unread > _B_Unread) return -1;

            });
            this.forceUpdate();
        } catch (ex) {
            global.Log({Message: 'ThreadSearch.SortThreads>>' + ex.message, Notify: true});
        }
    }
    async ReceiveMessage(ThreadMessage_Value) {
        try {            
            let _MatchedThread = false;
            for (let _ThreadIndex = Global.State[this.props.ModelID].ThreadList.length - 1; _ThreadIndex >= 0; _ThreadIndex--) {
                let _Thread = Global.State[this.props.ModelID].ThreadList[_ThreadIndex];
                if (_Thread.ThreadID === ThreadMessage_Value.ThreadID) {
                    let date = new Date();
                    let _Timestamp = date.getUTCFullYear() + '-' + date.getUTCMonth() + '-' + date.getUTCDate() + 'T' + date.getUTCHours() + ':' + date.getUTCMinutes() + ':' + date.getUTCSeconds() + '.' + date.getUTCMilliseconds();
                    _Thread.ThreadActivity = _Timestamp;
                    _MatchedThread = true;
                    if (_Thread.ThreadPersonList !== null && _Thread.ThreadPersonList.length > 0) {
                        for (let _ThreadPersonIndex = 0; _ThreadPersonIndex < _Thread.ThreadPersonList.length; _ThreadPersonIndex++) {
                            if (_Thread.ThreadPersonList[_ThreadPersonIndex].ThreadPersonID === ThreadMessage_Value.ThreadMessagePersonID) {
                                _Thread.ThreadPersonList[_ThreadPersonIndex].ThreadPersonActivity = _Timestamp;
                            }
                        }
                    }
                }
            }
            if (_MatchedThread === true) {
                this.SortThreads();
            } else {
                Global.State[this.props.ModelID].ThreadList.push(await ThreadHelper.GetOne({ThreadID: ThreadMessage_Value.ThreadID}));
                this.SortThreads();
            }
        } catch (ex) {
            global.Log({Message: 'ThreadSearch.ReceiveMessage>>' + ex.message, Notify: true});
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
                                <Pressable style={{flex: 1, height: 50, justifyContent: 'center'}} onPress={() => this.ClearFocus()}>
                                    <Text style={{fontSize: 20, fontWeight: 'bold', color: Global.Theme.Header.ForegroundColor}}>CHATS ({Global.State[this.props.ModelID].SearchCount})</Text>
                                </Pressable>
                                <Pressable 
                                    onPress={() => global.root.ShowKnowledgeSearch()}
                                    style={({pressed}) => [{width: 50, height: 50, alignItems: 'center', justifyContent: 'center', opacity: pressed ? .5 : 1}]}
                                >
                                    <Image source={global.ColorScheme === 'dark' ? IMG_Book_eeeeee : IMG_Book_121212} style={{width: 24, height: 24}} />
                                </Pressable>
                            </View>
    
                            {/* Global Search */}
                            <View style={{flexDirection: 'row', marginTop: 10, backgroundColor: Global.Theme.Body.ControlBackground, borderRadius: 4}}>
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
    
                        {/* Thread List */}
                        <FlatList 
                        style={{flex: 1, backgroundColor: Global.Theme.Body.BackgroundColor}} 
                        data={Global.State[this.props.ModelID].ThreadList}
                        onScroll={() => {
                            Global.State[this.props.ModelID].LazyLoadEnabled = true;
                        }}
                        refreshControl={
                            <RefreshControl refreshing={this.state.Refreshing} onRefresh={async () => {
                                try {
                                    this.setState({Refreshing: true});
                                    Global.State[this.props.ModelID].ThreadList = [];
                                    Global.State[this.props.ModelID].SearchOffset = 0;
                                    this.forceUpdate();
                                    await this.Search(null);
                                    this.setState({Refreshing: false});
                                } catch (ex) {
                                    this.setState({Refreshing: false});
                                    global.Log({Message: 'PersonSearch.IsActive>>' + ex.message, Notify: true});
                                }
                            }} />
                        }
                        onEndReached={() => {
                            try {
                                if (Global.State[this.props.ModelID].LazyLoadEnabled) {
                                    Global.State[this.props.ModelID].LazyLoadEnabled = false;
                                    Global.State[this.props.ModelID].SearchOffset += Global.State[this.props.ModelID].SearchLimit;
                                    ThreadHelper.GetList({
                                        SearchText: Global.State[this.props.ModelID].SearchText,
                                        SearchStatus: Global.State[this.props.ModelID].SearchStatus,
                                        SearchLimit: Global.State[this.props.ModelID].SearchLimit,
                                        SearchOffset: Global.State[this.props.ModelID].SearchOffset,
                                    }).then((ThreadList_Value) => {
                                        Global.State[this.props.ModelID].ThreadList = [...Global.State[this.props.ModelID].ThreadList, ...ThreadList_Value];
                                        this.forceUpdate();
                                    }).catch((ex) => {
                                        global.Log({Message: 'ThreadSearch.render>>' + ex.message, Notify: true});
                                    });
                                }
                            } catch (ex) {
                                global.Log({Message: 'ThreadSearch.render>>' + ex.message, Notify: true});
                            }
                        }}
                        renderItem={({item, index, separators}) => {

                            //Get the thread
                            let _Thread = Global.State[this.props.ModelID].ThreadList[index];

                            let _Description = '';
                            let _Unread = false;
                            if (_Thread.ThreadPersonList !== null && _Thread.ThreadPersonList.length > 0) {
                                for (let _ThreadPersonIndex = 0; _ThreadPersonIndex < _Thread.ThreadPersonList.length; _ThreadPersonIndex++) {
                                    if (!_Thread.ThreadPersonList[_ThreadPersonIndex].ThreadPersonID.startsWith('@')) {
                                        _Description += (_Description.length > 0 ? ', ' : '') + _Thread.ThreadPersonList[_ThreadPersonIndex].ThreadPersonName;
                                    } else if (_Thread.ThreadPersonList[_ThreadPersonIndex].ThreadPersonID === '@support' && _Thread.ThreadPersonList[_ThreadPersonIndex].ThreadPersonActivity < _Thread.ThreadActivity) {
                                        _Unread = true;
                                    }
                                }
                            }

                            let _ActivityDate = new Date(_Thread.ThreadActivity);
                            let _LastActive = null;
                            if (_ActivityDate != null) {
                                _LastActive = (
                                    <Text style={{color: Global.Theme.Body.ForegroundFade, fontSize: 11}}>Last Activity on {Global.FormatShortDate(_ActivityDate.getFullYear(), parseInt(_ActivityDate.getMonth() + 1), _ActivityDate.getDate())}</Text>
                                );
                            }

                            return (
                                <Pressable 
                                    key={'ThreadList_' + index}
                                    onPress={() => global.root.ShowThread({
                                        Thread: _Thread, 
                                        DeleteCallback: (ThreadID_Value) => this.Delete(ThreadID_Value), 
                                        ReadCallback: () => {
                                            _Thread.ThreadActivity = new Date();
                                            this.forceUpdate();
                                        }
                                    })}
                                    style={({pressed}) => [{flex: 1, flexDirection: 'row', opacity: pressed ? .7 : 1, backgroundColor: Global.Theme.Body.ControlBackground, borderRadius: 4, minHeight: 50, marginTop: 10, marginLeft: 10, marginRight: 10}]}
                                >
                                    <View style={{width: 3, backgroundColor: _Unread ? Global.Theme.Highlight.BackgroundColor : Global.Theme.Body.BackgroundFade, borderRadius: 4, opacity: .5}}></View>
                                    <View style={{flex: 1, justifyContent: 'center', padding: 10}}>
                                        {_LastActive}
                                        <Text style={{marginTop: 4, color: Global.Theme.Body.ForegroundColor}}>{_Description}</Text>
                                    </View>
                                    <View style={{width: 50, alignItems: 'center', justifyContent: 'center'}}>
                                        <Image source={Global.Theme.Body.Icons.Forward} style={{width: 20, height: 20}} />
                                    </View>
                                </Pressable>
                            );

                        }}
                        ListEmptyComponent={() => {
                            return (
                                <View key={'No_Threads_Found'} style={{flex: 1, height: 50, margin: 10, backgroundColor: Global.Theme.Body.ControlBackground, borderRadius: 4, alignItems: 'center', justifyContent: 'center'}}>
                                    <Text style={{color: Global.Theme.Body.ForegroundFade}}>No Chats Found</Text>
                                </View>
                            );
                        }} 
                        />
                        
                    </View>
                );
            } else {
                return <View></View>;
            }
        } catch (ex) {
            global.Log({Message: 'ThreadSearch.render>>' + ex.message});
        }
    };
};