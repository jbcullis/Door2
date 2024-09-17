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
module.exports = class PersonPicker extends Component {
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
            global.Log({Message: 'PersonPicker.IsActive>>' + ex.message});
        }
    };
    async Show(Params_Value) {
        try {
            global.root.NotificationModal.Show({ NotificationTitle: 'Loading...', NotificationStyle: 'Wait' });

            let _ViewWidth = Global.ScreenX > 600 ? 600 : Global.ScreenX;

            let _Params = {
                SearchText: null,
                SearchLimit: 25,
                SearchOffset: 0,
            };

            //Create State
            Global.State[this.props.ModelID] = {
                SearchText: _Params.SearchText,
                SearchLimit: _Params.SearchLimit,
                SearchOffset: _Params.SearchOffset,
                PersonCount: await PersonHelper.GetCount(_Params),
                PersonList: await PersonHelper.GetList(_Params),
                SelectCallback: (Params_Value !== null && Params_Value.hasOwnProperty('SelectCallback') ? Params_Value.SelectCallback : null),
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
            global.Log({Message: 'PersonPicker.Show>>' + ex.message, Notify: true});
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

            let _PersonList = await PersonHelper.GetList(_Params);
            if (Global.State[this.props.ModelID] !== null
            && (SearchID_Value === null || Global.State[this.props.ModelID].SearchID === SearchID_Value)) {
                Global.State[this.props.ModelID].PersonCount = await PersonHelper.GetCount(_Params);
                Global.State[this.props.ModelID].PersonList = _PersonList;
                this.forceUpdate();
            }
            this.forceUpdate();
        } catch (ex) {
            global.Log({Message: 'PersonPicker.Search>>' + ex.message, Notify: true});
        }
    };


    //Handlers
    ActiveHandler() {
        try {

            //Handle ActiveWindow state
            let _ActiveWindow = false;
            if (!global.GlobalModalActive) {
                _ActiveWindow = true;
            }

            //Handle ActiveWindow change
            if (_ActiveWindow !== Global.State[this.props.ModelID].ActiveWindow) {
                Global.State[this.props.ModelID].ActiveWindow = _ActiveWindow;
                this.forceUpdate();
            }

        } catch (ex) {
            global.Log({Message: 'PersonPicker.ActiveHandler>>' + ex.message});
        }
    };
    BackHandler() {
        try {
            this.Hide();
        } catch (ex) {
            global.Log({Message: 'PersonPicker.BackHandler>>' + ex.message});
        }
    };
    KeyboardHandler(action, keyboardheight) {
        try {

        } catch (ex) {
            global.Log({Message: 'PersonPicker.KeyboardHandler>>' + ex.message});
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
            global.Log({Message: 'PersonPicker.Hide>>' + ex.message});
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
            global.Log({Message: 'PersonPicker.ClearFocus>>' + ex.message, Notify: true});
        }
    };

    render() {
        try {
            if (this.IsActive()) {

                let _ActiveDate = new Date();
                _ActiveDate.setDate(_ActiveDate.getDate() - 28);   

                return (
                    <View style={{position: 'absolute', top: 0, right: 0, bottom: 0, left: 0}}>
                        <Animated.View style={{position: 'absolute', top: 0, bottom: 0, right: 0, width: Global.State[this.props.ModelID].ViewWidth, backgroundColor: 'transparent', transform: [{translateX: Global.State[this.props.ModelID].ViewOffset}]}}>
                            <View style={{position: 'absolute', top: 0, right: 0, bottom: 0, backgroundColor: Global.Theme.Header.BackgroundColor, width: Global.State[this.props.ModelID].ViewWidth}}>
                                
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
                                            <Text style={{fontSize: 20, fontWeight: 'bold', color: Global.Theme.Header.ForegroundColor}} numberOfLines={1}>KNOWLEDGE BASE ({Global.State[this.props.ModelID].KnowledgeCount})</Text>
                                        </Pressable>                                   
                                    </View>
                                    <View style={{flexDirection: 'row', justifyContent: 'center', marginTop: 10}}>
                                        <InputControl 
                                            Name={'Search'}
                                            PlaceholderTextColor={Global.Theme.Header.ForegroundFade} 
                                            BorderRadius={'full'}
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

                                <View style={{flex: 1}}>
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
                                                await this.Search(null);
                                                this.setState({Refreshing: false});
                                            } catch (ex) {
                                                global.Log({Message: 'PersonPicker.IsActive>>' + ex.message, Notify: true});
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
                                                    SearchLimit: Global.State[this.props.ModelID].SearchLimit,
                                                    SearchOffset: Global.State[this.props.ModelID].SearchOffset
                                                }).then((PersonList_Value) => {
                                                    Global.State[this.props.ModelID].PersonList = [...Global.State[this.props.ModelID].PersonList, ...PersonList_Value];
                                                    this.forceUpdate();
                                                }).catch((ex) => {
                                                    global.Log({Message: 'PersonPicker.renderBody>>' + ex.message, Notify: true});
                                                });
                                            }
                                        } catch (ex) {
                                            global.Log({Message: 'PersonPicker.renderBody>>' + ex.message, Notify: true});
                                        }
                                    }}
                                    renderItem={({item, index, separators}) => {
                                        let _Person = Global.State[this.props.ModelID].PersonList[index];
                                        let _ActivityDate = new Date(_Person.PersonActivity);
                                        let _LastActive = null;
                                        if (_ActivityDate > _ActiveDate) {
                                            _LastActive = (
                                                <Text style={{color: Global.Theme.Body.ForegroundColor, opacity: .5, fontSize: 11}}>Active on {Global.FormatShortDate(_ActivityDate.getFullYear(), parseInt(_ActivityDate.getMonth() + 1), _ActivityDate.getDate())}</Text>
                                            );
                                        }

                                        let _PersonEmail = null;
                                        if (_Person.PersonEmail != null) {
                                            _PersonEmail = (
                                                <Text style={{color: Global.Theme.Body.ForegroundColor, opacity: .5, fontSize: 11, marginTop: 4}}>{_Person.PersonEmail}</Text>
                                            );
                                        }
                                        
                                        return (
                                            <Pressable 
                                                key={'PersonList_' + index}
                                                onPress={() => {
                                                    //Run select callback
                                                    if (Global.State[this.props.ModelID].SelectCallback !== null) {
                                                        Global.State[this.props.ModelID].SelectCallback(_Person);
                                                        this.Hide();
                                                    }
                                                }}
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
                                    ListEmptyComponent={() => {
                                        return (
                                            <View style={{flex:1, flexDirection:'row', height: 40, alignItems: 'center', justifyContent: 'center'}}>
                                                <Text style={{color: '#e1e1e1'}}>-- No People Found --</Text>
                                            </View>
                                        );
                                    }} />
                                    {this.renderFooter()}
                                    {this.renderSwipeBack()}
                                </View>

                            </View>
                        </Animated.View>
                    </View>
                );
            } else {
                return (<View></View>);
            }
        } catch (ex) {
            global.Log({Message: 'PersonPicker.render>>' + ex.message});
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
            global.Log({Message: 'PersonPicker.renderFooter>>' + ex.message, Notify: true});
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
            global.Log({Message: 'PersonPicker.renderSwipeBack>>' + ex.message});
        }
    };
};