import React, { Component } from 'react';
import {
    View,
    Text,
    Image,
    RefreshControl,
    FlatList,
    Keyboard,
    Pressable,
    Platform,
} from 'react-native';
import ElementControl from '../controls/ElementControl.js';
module.exports = class AccountSearch extends Component {
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
            global.Log({Message: 'AccountSearch.IsActive>>' + ex.message});
        }
    }; 
    async Show() {
        try {
            global.root.NotificationModal.Show({ NotificationTitle: 'Loading...', NotificationStyle: 'Wait' });
            let _AccountFilter = await Global.GetAccountFilter();

            let _Params = {
                SearchText: _AccountFilter.SearchText,
                SearchSubscriptionID: _AccountFilter.SearchSubscriptionID,
                SearchLimit: 25,
                SearchOffset: 0
            };

            Global.State[this.props.ModelID] = {
                SearchID: null,
                SearchTimeout: null,
                SearchText: _AccountFilter.SearchText,
                SearchSubscriptionID: _AccountFilter.SearchSubscriptionID,
                SearchLimit: 25,
                SearchOffset: 0,
                SearchCount: await AccountHelper.GetCount(_Params),
                AccountList: await AccountHelper.GetList(_Params),
                LazyLoadEnabled: false
            }
            this.forceUpdate();
            global.root.ActiveHandler();
            global.root.NotificationModal.Hide();
        } catch (ex) {
            Global.State[this.props.ModelID] = null;
            global.Log({Message: 'AccountSearch.Show>>' + ex.message, Notify: true});
        }
    };
    Hide() {
        try {
            if (Global.State[this.props.ModelID] !== null) {
                Global.State[this.props.ModelID] = null;
            }
        } catch (ex) {
            global.Log({Message: 'AccountSearch.Show>>' + ex.message});
        }
    };
   
    async Search(SearchID_Value) {
        try {
            Global.State[this.props.ModelID].SearchOffset = 0;
            let _Params = {
                SearchText: Global.State[this.props.ModelID].SearchText,
                SearchSubscriptionID: Global.State[this.props.ModelID].SearchSubscriptionID,
                SearchLimit: Global.State[this.props.ModelID].SearchLimit,
                SearchOffset: Global.State[this.props.ModelID].SearchOffset
            };
            let _AccountList = await AccountHelper.GetList(_Params);
            if (SearchID_Value === null || Global.State[this.props.ModelID].SearchID === SearchID_Value) {
                Global.State[this.props.ModelID].SearchCount = await AccountHelper.GetCount(_Params);
                Global.State[this.props.ModelID].AccountList = _AccountList;
                this.forceUpdate();
                Global.SetAccountFilter({                    
                    SearchText: Global.State[this.props.ModelID].SearchText,
                    SearchSubscriptionID: Global.State[this.props.ModelID].SearchSubscriptionID,
                })
            }
            this.forceUpdate();
        } catch (ex) {
            global.Log({Message: 'AccountSearch.Search>>' + ex.message, Notify: true});
        }
    };
    async Update(Account_Value) {
        try {
            let _Updated = false;
            for (let _AccountIndex = Global.State[this.props.ModelID].AccountList.length - 1; _AccountIndex >= 0; _AccountIndex--) {
                let _Account = Global.State[this.props.ModelID].AccountList[_AccountIndex];
                if (_Account.AccountID === Account_Value.AccountID) {
                    Global.State[this.props.ModelID].AccountList.splice(_AccountIndex, 1, JSON.parse(JSON.stringify(Account_Value)));
                    _Updated = true;
                }
            }
            if (!_Updated) {
                Global.State[this.props.ModelID].AccountList.push(JSON.parse(JSON.stringify(Account_Value)));
            }
            this.forceUpdate();
        } catch (ex) {
            global.Log({Message: 'AccountSearch.Update>>' + ex.message});
        }
    };
    async Delete(AccountID_Value) {
        try {
            for (let _AccountIndex = Global.State[this.props.ModelID].AccountList.length - 1; _AccountIndex >= 0; _AccountIndex--) {
                let _Account = Global.State[this.props.ModelID].AccountList[_AccountIndex];
                if (_Account.AccountID === AccountID_Value) {
                    Global.State[this.props.ModelID].AccountList.splice(_AccountIndex, 1);
                    Global.State[this.props.ModelID].SearchCount -= 1;
                }
            }
            this.forceUpdate();
        } catch (ex) {
            global.Log({Message: 'AccountSearch.Delete>>' + ex.message});
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
            global.Log({Message: 'AccountSearch.ClearFocus>>' + ex.message});
        }
    };

    render() {
        try {
            if (this.IsActive()) {

                let _ActiveDate = new Date();
                _ActiveDate.setDate(_ActiveDate.getDate() - 60);

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
                                <Pressable style={{flex: 1, height: 50, justifyContent: 'center'}} onPress={() => this.ClearFocus()}>
                                    <Text style={{fontSize: 20, fontWeight: 'bold', color: Global.Theme.Header.ForegroundColor}}>ACCOUNTS ({Global.State[this.props.ModelID].SearchCount})</Text>
                                </Pressable>
                                <Pressable 
                                    onPress={() => {
                                        global.root.ShowAccount({
                                            AccountID: null,
                                            SaveCallback: (Account_Value) => this.Update(Account_Value),
                                            DeleteCallback: (AccountID_Value) => this.Delete(AccountID_Value)
                                        });
                                    }}
                                    style={({pressed}) => [{width: 50, height: 50, alignItems: 'center', justifyContent: 'center', opacity: pressed ? .5 : 1}]}
                                >
                                    <Image source={Global.Theme.Header.Icons.Add} style={{width: 28, height: 28}} />
                                </Pressable>
                            </View>
    
                            {/* Search */}
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
                                    Name={'Subs'}
                                    Width={100}
                                    Value={Global.State[this.props.ModelID].SearchSubscriptionID}
                                    Pressed={async () => {
                                        let _Options = [{Text: 'ALL SUBS', Value: null}];
                                        let _Service = await ServiceHelper.GetOne();
                                        if (_Service.ServiceID === 'D20220507210447751S123693') {
                                            _Options.push({Text: 'AUBVRP', Value: 'AUBVRP'});
                                            _Options.push({Text: 'USGOKI', Value: 'USGOKI'});
                                        } else if (_Service.ServiceID === 'D20220325104835886S183770') {
                                            _Options.push({Text: 'LIVESTOCKED-FARM', Value: 'LIVESTOCKED-FARM'});
                                        }
                                        global.root.PickerModal.Show(_Options, false, (Selected_Value) => {
                                            Global.State[this.props.ModelID].SearchSubscriptionID = Selected_Value;
                                            this.forceUpdate();
                                            clearTimeout(Global.State[this.props.ModelID].SearchTimeout);
                                            Global.State[this.props.ModelID].SearchTimeout = setTimeout(() => {
                                                let _SearchID = Math.random();
                                                Global.State[this.props.ModelID].SearchID = _SearchID;
                                                this.Search(_SearchID);
                                            }, 400);
                                        })
                                    }}
                                    Editable={this.props.ActiveWindow} 
                                />                                    
                            </View>
    
                        </View>

                        <FlatList 
                        style={{flex: 1, backgroundColor: Global.Theme.Body.BackgroundColor}} 
                        data={Global.State[this.props.ModelID].AccountList}
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
                                    global.Log({Message: 'AccountSearch.IsActive>>' + ex.message, Notify: true});
                                    this.setState({Refreshing: false});
                                }
                            }} />
                        }
                        onEndReached={() => {
                            try {                        
                                if (Global.State[this.props.ModelID].LazyLoadEnabled) {
                                    Global.State[this.props.ModelID].SearchOffset += Global.State[this.props.ModelID].SearchLimit;                
                                    AccountHelper.GetList({
                                        SearchText: Global.State[this.props.ModelID].SearchText,
                                        SearchSubscriptionID: Global.State[this.props.ModelID].SearchSubscriptionID,
                                        SearchLimit: Global.State[this.props.ModelID].SearchLimit,
                                        SearchOffset: Global.State[this.props.ModelID].SearchOffset
                                    }).then((AccountList_Value) => {
                                        Global.State[this.props.ModelID].AccountList = [...Global.State[this.props.ModelID].AccountList, ...AccountList_Value];
                                        this.forceUpdate();
                                    }).catch((ex) => {
                                        global.Log({Message: 'AccountSearch.render>>' + ex.message, Notify: true});
                                    });
                                }
                            } catch (ex) {
                                global.Log({Message: 'AccountSearch.render>>' + ex.message, Notify: true});
                            }
                        }}
                        renderItem={({item, index, separators}) => {
                            let _Account = Global.State[this.props.ModelID].AccountList[index];
                            let _ActivityDate = new Date(_Account.AccountActivity);
                            let _LastActive = null;
                            if (_ActivityDate > _ActiveDate) {
                                _LastActive = (
                                    <Text style={{color: Global.Theme.Body.ForegroundFade, fontSize: 11}}>Active on {Global.FormatShortDate(_ActivityDate.getFullYear(), parseInt(_ActivityDate.getMonth() + 1), _ActivityDate.getDate())}</Text>                                    
                                )
                            }                            
                            return (
                                <Pressable 
                                    key={'AccountList_' + index}
                                    onPress={() => global.root.ShowAccount({
                                        AccountID: _Account.AccountID,
                                        SaveCallback: (Account_Value) => this.Update(Account_Value),
                                        DeleteCallback: (AccountID_Value) => this.Delete(AccountID_Value)
                                    })}
                                    style={({pressed}) => [{flex: 1, flexDirection: 'row', opacity: pressed ? .7 : 1, backgroundColor: Global.Theme.Body.ControlBackground, borderRadius: 4, minHeight: 50, marginTop: 10, marginLeft: 10, marginRight: 10}]}
                                >
                                    <View style={{width: 3, backgroundColor: _LastActive !== null ? Global.Theme.Highlight.BackgroundColor : Global.Theme.Body.BackgroundFade, borderRadius: 4, opacity: .5}}></View>
                                    <View style={{flex: 1, justifyContent: 'center', padding: 10}}>
                                        {_LastActive}
                                        <Text style={{marginTop: 4, color: Global.Theme.Body.ForegroundColor}}>{_Account.AccountName !== null ? _Account.AccountName : _Account.AccountID}</Text>
                                    </View>
                                    <View style={{width: 50, alignItems: 'center', justifyContent: 'center'}}>
                                        <Image source={Global.Theme.Body.Icons.Forward} style={{width: 20, height: 20}} />
                                    </View>
                                </Pressable>
                            );
                        }} 
                        keyExtractor={item => item.AccountID} 
                        ListEmptyComponent={() => {
                            return (
                                <View key={'No_Accounts_Found'} style={{flex: 1, height: 50, margin: 10, backgroundColor: Global.Theme.Body.ControlBackground, borderRadius: 4, alignItems: 'center', justifyContent: 'center'}}>
                                    <Text style={{color: Global.Theme.Body.ForegroundFade}}>No Accounts Found</Text>
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
            global.Log({Message: 'AccountSearch.render>>' + ex.message});
        }
    };
};