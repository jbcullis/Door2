import React, { Component } from 'react';
import {
  View,
  Text,
  Pressable,
  Animated,
} from 'react-native';
module.exports = class ConfirmModal extends Component {
    constructor(props) {
        super(props);
    };
    IsActive() {
        try {
            return Global.State.hasOwnProperty(this.props.ModelID) && Global.State[this.props.ModelID] !== null;
        } catch (ex) {
            global.Log({Message: 'CalendarModal.IsActive>>' + ex.message});
        }
    };
    async Show(title, message, confirmtext, canceltext, confirmcallback, cancelcallback) {
        try {

            //Load model
            Global.State[this.props.ModelID] = {
                Title: (Global.StringHasContent(title) ? title : 'Just Checking...'),
                Message: message,
                ConfirmText: confirmtext,
                CancelText: canceltext,
                ConfirmCallback: confirmcallback,
                CancelCallback: cancelcallback,
                ViewOpacity: Global.State.hasOwnProperty(this.props.ModelID) && Global.State[this.props.ModelID] !== null ? Global.State[this.props.ModelID].ViewOpacity : new Animated.Value(0)
            };

            //ActiveHandler must be called after forceUpdate
            this.forceUpdate();
            global.root.ActiveHandler();
            
            //Run animation
            if (Global.State[this.props.ModelID] !== null && Global.State[this.props.ModelID].ViewOpacity !== null && Global.State[this.props.ModelID].ViewOpacity._value < 1) {
                Animated.timing(Global.State[this.props.ModelID].ViewOpacity, {duration: 100, toValue: 1, useNativeDriver: Global.NativeAnimationDriver}).start();
            }
            
        } catch (ex) {
            global.Log({Message: 'CalendarModal.Show>>' + ex.message});
        }
    };

    //Event Handlers
    BackHandler() {
        try {
            this.Hide(false);
        } catch (ex) {
            global.Log({Message: 'CalendarModal.BackHandler>>' + ex.message});
        }
    };
    ShortcutHandler(Shortcut_Value) {
        try {
            if (Shortcut_Value === 'Enter') {
                this.Hide(true);
            } else if (Shortcut_Value === 'Escape') {
                this.Hide(false);
            }
        } catch (ex) {
            global.Log({Message: 'TicketForm.BackHandler>>' + ex.message});
        }
    };
    
    Hide(Confirm_Value) {
        try {
            if (Global.State[this.props.ModelID] !== null) {
                Animated.timing(Global.State[this.props.ModelID].ViewOpacity, { duration: 100, toValue: 0, useNativeDriver: Global.NativeAnimationDriver}).start(() => {
                    if (Confirm_Value) { 
                        if (Global.State[this.props.ModelID].ConfirmCallback !== null) { Global.State[this.props.ModelID].ConfirmCallback(); }
                    } else {
                        if (Global.State[this.props.ModelID].CancelCallback !== null) { Global.State[this.props.ModelID].CancelCallback(); }
                    }
                    Global.State[this.props.ModelID] = null;
                    global.root.ActiveHandler();
                    this.forceUpdate();
                });
            }
        } catch (ex) {
            global.Log({Message: 'CalendarModal.Hide>>' + ex.message});
        }
    };
    render() {
        try {
            if (Global.State.hasOwnProperty(this.props.ModelID) && Global.State[this.props.ModelID] !== null) {

                let _Message = null;
                if (Global.StringHasContent(Global.State[this.props.ModelID].Message)) {
                    _Message = (
                        <View style={{alignItems:'center'}}>
                            <Text style={{color: global.ColorScheme === 'dark' ? '#eeeeee' : '#121212'}}>{Global.State[this.props.ModelID].Message}</Text>
                        </View>
                    );
                }
    
                let _CancelButton = null;
                if (Global.StringHasContent(Global.State[this.props.ModelID].CancelText)) {
                    _CancelButton = (
                        <Pressable style={({pressed}) => [{width: 120, height: 40, backgroundColor: '#c06e6e', borderRadius: 4, alignItems: 'center', justifyContent: 'center', opacity: pressed ? .7 : 1}]} onPress={() => this.Hide(false)}>
                            <Text style={{fontWeight: 'bold', color: '#121212'}}>{Global.State[this.props.ModelID].CancelText}</Text>
                        </Pressable>
                    );
                }
    
                let _ConfirmButton = null;
                if (Global.StringHasContent(Global.State[this.props.ModelID].ConfirmText)) {
                    _ConfirmButton = (
                        <Pressable style={({pressed}) => [{width: 120, alignItems: 'center', justifyContent: 'center', backgroundColor: Global.Theme.Highlight.BackgroundColor, borderRadius: 4, opacity: pressed ? .7 : 1}]} onPress={() => this.Hide(true)}>
                            <Text style={{fontWeight: 'bold', color: Global.Theme.Highlight.ForegroundColor}}>{Global.State[this.props.ModelID].ConfirmText}</Text>
                        </Pressable>
                    );
                }
    
                return (
                    <Animated.View style={{position: 'absolute', top: 0, bottom:0, right: 0, left: 0, backgroundColor: 'rgba(51,51,51,.4)', justifyContent:'center', opacity: Global.State[this.props.ModelID].ViewOpacity}}>
                        <View style={{flexDirection: 'row'}}>
                            <View style={{flex: 1}}></View>
                            <View style={{backgroundColor: (global.ColorScheme === 'dark' ? '#121212' : '#eeeeee'), minWidth: 300, padding: 10, borderRadius: 5}}>
                                <View style={{height: 50, alignItems: 'center', justifyContent: 'center'}}>
                                    <Text style={{fontSize: 22, color: (global.ColorScheme === 'dark' ? '#eeeeee' : '#121212'), fontWeight: 'bold'}}>{Global.State[this.props.ModelID].Title}</Text>
                                </View>
                                {_Message}
                                <View style={{flexDirection:'row', marginTop:20}}>
                                    {_CancelButton}
                                    <Text style={{flex:1}}></Text>
                                    {_ConfirmButton}
                                </View>
                            </View>
                            <View style={{flex: 1}}></View>
                        </View>
                    </Animated.View>
                );
            } else {
                return (<View></View>);
            }
        } catch (ex) {
            global.Log({Message: 'CalendarModal.render>>' + ex.message});
        }
    };
};