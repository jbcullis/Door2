import React, { Component } from 'react';
import {
    View,
    Text,
    Image,
    FlatList,
    RefreshControl,
    Keyboard,
    Pressable,
    Platform,
} from 'react-native';
import ElementControl from '../controls/ElementControl.js';
module.exports = class PersonSearch extends Component {
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
            global.Log({Message: 'PersonSearch.IsActive>>' + ex.message});
        }
    };
    async Show() {
        try {
            global.root.NotificationModal.Show({ NotificationTitle: 'Loading...', NotificationStyle: 'Wait' });
            let _PersonFilter = await Global.GetPersonFilter();

            let _Params = {
                SearchText: _PersonFilter.SearchText,
                SearchMarketing: _PersonFilter.SearchMarketing,
                SearchLimit: 25,
                SearchOffset: 0,
            };

            Global.State[this.props.ModelID] = {
                SearchID: null,
                SearchTimeout: null,            
                SearchText: _PersonFilter.SearchText,
                SearchMarketing: _PersonFilter.SearchMarketing,
                SearchLimit: 25,
                SearchOffset: 0,
                SearchCount: await PersonHelper.GetCount(_Params),
                PersonList: await PersonHelper.GetList(_Params),
                LazyLoadEnabled: false,
            };
            this.forceUpdate();
            global.root.ActiveHandler();
            global.root.NotificationModal.Hide();
        } catch (ex) {
            Global.State[this.props.ModelID] = null;
            global.Log({Message: 'PersonSearch.Show>>' + ex.message, Notify: true});
        }
    };
    Hide() {
        try {
            if (Global.State[this.props.ModelID] !== null) {
                Global.State[this.props.ModelID] = null;
            }
        } catch (ex) {
            global.Log({Message: 'PersonSearch.Show>>' + ex.message});
        }
    };
  
    async Search(SearchID_Value) {
        try {
            let _Params = {
                SearchText: Global.State[this.props.ModelID].SearchText,
                SearchMarketing: Global.State[this.props.ModelID].SearchMarketing,
                SearchLimit: Global.State[this.props.ModelID].SearchLimit,
                SearchOffset: Global.State[this.props.ModelID].SearchOffset,
            };
            let _PersonList = await PersonHelper.GetList(_Params);
            if (SearchID_Value === null || Global.State[this.props.ModelID].SearchID === SearchID_Value) {
                Global.State[this.props.ModelID].SearchCount = await PersonHelper.GetCount(_Params);
                Global.State[this.props.ModelID].PersonList = _PersonList;
                this.forceUpdate();
                Global.SetPersonFilter({
                    SearchText: Global.State[this.props.ModelID].SearchText,
                    SearchMarketing: Global.State[this.props.ModelID].SearchMarketing,
                });
            }
        } catch (ex) {
            global.Log({Message: 'PersonSearch.Search>>' + ex.message, Notify: true});
        }
    };
    async Update(Person_Value) {
        try {
            let _Updated = false;
            for (let _PersonIndex = Global.State[this.props.ModelID].PersonList.length - 1; _PersonIndex >= 0; _PersonIndex--) {
                let _Person = Global.State[this.props.ModelID].PersonList[_PersonIndex];
                if (_Person.PersonID === Person_Value.PersonID) {
                    Global.State[this.props.ModelID].PersonList.splice(_PersonIndex, 1, JSON.parse(JSON.stringify(Person_Value)));
                    _Updated = true;
                }
            }
            if (!_Updated) {
                Global.State[this.props.ModelID].PersonList.push(JSON.parse(JSON.stringify(Person_Value)));
            }
            this.forceUpdate();
        } catch (ex) {
            global.Log({Message: 'PersonSearch.Update>>' + ex.message});
        }
    };
    async Delete(PersonID_Value) {
        try {
            for (let _PersonIndex = Global.State[this.props.ModelID].PersonList.length - 1; _PersonIndex >= 0; _PersonIndex--) {
                let _Person = Global.State[this.props.ModelID].PersonList[_PersonIndex];
                if (_Person.PersonID === PersonID_Value) {
                    Global.State[this.props.ModelID].PersonList.splice(_PersonIndex, 1);
                    Global.State[this.props.ModelID].SearchCount -= 1;
                }
            }
            this.forceUpdate();
        } catch (ex) {
            global.Log({Message: 'PersonSearch.ClearFocus>>' + ex.message});
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
            global.Log({Message: 'PersonSearch.ClearFocus>>' + ex.message});
        }
    };

    render() {
        try {
            if (this.IsActive()) {

                let _ActiveDate = new Date();
                _ActiveDate.setDate(_ActiveDate.getDate() - 28);

                return (
                    <View style={{flex: 1, backgroundColor: Global.Theme.HeaderBackgroundColor}}>
                        
                        {/* Searchbox */}
                        <View style={[
                            {
                                height: 131, 
                                padding: 10,
                            }
                        ]}>
    
                            {/* Person Search Header */}
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
                                    <Text style={{fontSize: 20, fontWeight: 'bold', color: Global.Theme.Header.ForegroundColor}}>PEOPLE ({Global.State[this.props.ModelID].SearchCount})</Text>
                                </Pressable>
                                <Pressable 
                                    onPress={() => {
                                        global.root.ShowEmail({EmailType: 'LIST'});
                                    }}
                                    style={({pressed}) => [{width: 50, height: 50, alignItems: 'center', justifyContent: 'center', opacity: pressed ? .5 : 1}]}
                                >
                                    <Image source={global.ColorScheme === 'dark' ? IMG_Email_eeeeee : IMG_Email_121212} style={{width: 24, height: 24}} />
                                </Pressable>
                                <Pressable 
                                    onPress={() => {
                                        global.root.ShowPerson({
                                            PersonID: null,
                                            SaveCallback: null,
                                            DeleteCallback: null,
                                        });
                                    }}
                                    style={({pressed}) => [{width: 50, height: 50, alignItems: 'center', justifyContent: 'center', opacity: pressed ? .5 : 1}]}
                                >
                                    <Image source={global.ColorScheme === 'dark' ? IMG_Add_eeeeee : IMG_Add_121212} style={{width: 28, height: 28}} />
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
                                            Global.State[this.props.ModelID].PersonList = [];
                                            Global.State[this.props.ModelID].SearchOffset = 0;
                                            this.forceUpdate();
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
                                    Value={Global.State[this.props.ModelID].SearchMarketing}
                                    Pressed={() => {
                                        global.root.PickerModal.Show([
                                            {Text: '-- All --', Value: null},
                                            {Text: 'Requested', Value: 'requested'},
                                            {Text: 'Subscribed', Value: 'subscribed'},
                                            {Text: 'Unsubscribed', Value: 'unsubscribed'},
                                            {Text: 'Inactive', Value: 'inactive'},
                                        ], false, (Selected_Value) => {
                                            Global.State[this.props.ModelID].SearchMarketing = Selected_Value;
                                            let _SearchID = Math.random();
                                            Global.State[this.props.ModelID].SearchID = _SearchID;
                                            Global.State[this.props.ModelID].PersonList = [];
                                            Global.State[this.props.ModelID].SearchOffset = 0;
                                            this.forceUpdate();
                                            this.Search(_SearchID);
                                        })
                                    }}
                                    Editable={this.props.ActiveWindow} 
                                />                                   
                            </View>
    
                        </View>

                        {/* Person List */}
                        <FlatList 
                        style={{flex: 1, backgroundColor: Global.Theme.Body.BackgroundColor}} 
                        data={Global.State[this.props.ModelID].PersonList}
                        onScroll={() => {
                            Global.State[this.props.ModelID].LazyLoadEnabled = true;
                        }}
                        refreshControl={
                            <RefreshControl refreshing={this.state.Refreshing} onRefresh={async () => {
                                try {
                                    this.setState({Refreshing: true});
                                    Global.State[this.props.ModelID].PersonList = [];
                                    Global.State[this.props.ModelID].SearchOffset = 0;
                                    this.forceUpdate();
                                    await this.Search(null);
                                    this.setState({Refreshing: false});
                                } catch (ex) {
                                    global.Log({Message: 'PersonSearch.IsActive>>' + ex.message, Notify: true});
                                    this.setState({Refreshing: false});
                                }
                            }} />
                        }
                        onEndReached={() => {
                            try {                                
                                if (Global.State[this.props.ModelID].LazyLoadEnabled) {
                                    Global.State[this.props.ModelID].LazyLoadEnabled = false;
                                    Global.State[this.props.ModelID].SearchOffset += Global.State[this.props.ModelID].SearchLimit;
                                    PersonHelper.GetList({
                                        SearchText: Global.State[this.props.ModelID].SearchText,
                                        SearchMarketing: Global.State[this.props.ModelID].SearchMarketing,
                                        SearchLimit: Global.State[this.props.ModelID].SearchLimit,
                                        SearchOffset: Global.State[this.props.ModelID].SearchOffset,
                                    }).then((PersonList_Value) => {
                                        Global.State[this.props.ModelID].PersonList = [...Global.State[this.props.ModelID].PersonList, ...PersonList_Value];
                                        this.forceUpdate();
                                    }).catch((ex) => {
                                        global.Log({Message: 'PersonSearch.render>>' + ex.message, Notify: true});
                                    });
                                }
                            } catch (ex) {
                                global.Log({Message: 'PersonSearch.render>>' + ex.message, Notify: true});
                            }
                        }} 
                        renderItem={({item, index, separators}) => {
                            let _Person = Global.State[this.props.ModelID].PersonList[index];
                            let _ActivityDate = new Date(_Person.PersonActivity);
                            let _LastActive = null;
                            if (_ActivityDate != null) {
                                _LastActive = (
                                    <Text style={{color: Global.Theme.Body.ForegroundFade, fontSize: 11}}>Active on {Global.FormatShortDate(_ActivityDate.getFullYear(), parseInt(_ActivityDate.getMonth() + 1), _ActivityDate.getDate())}</Text>                                    
                                );
                            }

                            let _PersonEmail = null;
                            if (_Person.PersonEmail !== null && _Person.PersonEmail.length > 0) {
                                _PersonEmail = (
                                    <Text style={{color: Global.Theme.Body.ForegroundFade, fontSize: 11}}>{_Person.PersonEmail}</Text>
                                );
                            }

                            return (
                                <Pressable 
                                    key={'PersonList_' + index}
                                    onPress={() => global.root.ShowPerson({
                                        PersonID: _Person.PersonID,
                                        SaveCallback: (Person_Value) => this.Update(Person_Value),
                                        DeleteCallback: (PersonID_Value) => this.Delete(PersonID_Value),
                                        AllowChat: true
                                    })}
                                    style={({pressed}) => [{flex: 1, flexDirection: 'row', opacity: pressed ? .7 : 1, backgroundColor: Global.Theme.Body.ControlBackground, borderRadius: 4, minHeight: 50, marginTop: 10, marginLeft: 10, marginRight: 10}]}
                                >
                                    <View style={{width: 3, backgroundColor: _ActivityDate > _ActiveDate ? Global.Theme.Highlight.BackgroundColor : Global.Theme.Body.BackgroundFade, borderRadius: 4, opacity: .5}}></View>
                                    <View style={{flex: 1, justifyContent: 'center', padding: 10}}>
                                        {_LastActive}
                                        {_PersonEmail}
                                        <Text style={{marginTop: 4, color: Global.Theme.Body.ForegroundColor}}>{_Person.PersonName !== null ? _Person.PersonName : _Person.PersonID}</Text>
                                    </View>
                                    <View style={{width: 50, alignItems: 'center', justifyContent: 'center'}}>
                                        <Image source={Global.Theme.Body.Icons.Forward} style={{width: 20, height: 20}} />
                                    </View>
                                </Pressable>
                            );

                        }}
                        keyExtractor={item => item.PersonID} 
                        ListEmptyComponent={() => {
                            return (
                                <View key={'No_People_Found'} style={{flex: 1, height: 50, margin: 10, backgroundColor: Global.Theme.Body.ControlBackground, borderRadius: 4, alignItems: 'center', justifyContent: 'center'}}>
                                    <Text style={{color: Global.Theme.Body.ForegroundFade}}>No People Found</Text>
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
            global.Log({Message: 'PersonSearch.render>>' + ex.message});
        }
    };
};