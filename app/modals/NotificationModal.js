import React, { Component } from 'react';
import {
  View,
  Text,
  TouchableHighlight,
  Pressable,
  Image,
  Linking,
  Animated,
  ActivityIndicator,
} from 'react-native';
module.exports = class NotificationModal extends Component {
    constructor(props) {
        super(props);
    };
    IsActive() {
        try {
            return Global.State.hasOwnProperty(this.props.ModelID) && Global.State[this.props.ModelID] !== null;
        } catch (ex) {
            global.Log({Message: 'NotificationModal.IsActive>>' + ex.message});
        }
    };
    async Show(Params_Value) {
        try {

            //Create model
            Global.State[this.props.ModelID] = {
                NotificationTitle: Params_Value?.hasOwnProperty('NotificationTitle') ? Params_Value.NotificationTitle : 'Error', 
                NotificationMessage: Params_Value?.hasOwnProperty('NotificationMessage') ? Params_Value.NotificationMessage : null, 
                NotificationStyle: Params_Value?.hasOwnProperty('NotificationStyle') ? Params_Value.NotificationStyle : 'Wait',
                ViewOpacity: this.IsActive() ? Global.State[this.props.ModelID].ViewOpacity : new Animated.Value(0),
            };
            
            global.root.ActiveHandler();
            this.forceUpdate();

            //Show notification
            if (Global.State[this.props.ModelID].ViewOpacity !== null && Global.State[this.props.ModelID].ViewOpacity._value === 0) {
                setTimeout(() => {
                    try {
                        Animated.timing(Global.State[this.props.ModelID].ViewOpacity, {duration: 150, toValue: 1, useNativeDriver: Global.NativeAnimationDriver}).start(() => {
                            if (Global.State[this.props.ModelID]?.NotificationStyle === 'Toast') {
                                setTimeout(() => {
                                    this.Hide();
                                }, 2000);
                            }
                        });
                    } catch {
                        //Do Nothing
                    }
                }, 1);
            }

        } catch (ex) {
            global.Log({Message: 'NotificationModal.Show>>' + ex.message});
        }
    };

    //Handlers
    BackHandler() {
        try {
            if (Global.State[this.props.ModelID] !== null && Global.State[this.props.ModelID].NotificationStyle === 'Acknowledge') {
                this.Acknowledge();
            } else if (Global.State[this.props.ModelID] !== null && Global.State[this.props.ModelID].NotificationStyle !== 'Acknowledge') {
                this.Hide();
            }
        } catch (ex) {
            global.Log({Message: 'NotificationModal.BackHandler>>' + ex.message});
        }
    };
    ShortcutHandler(Shortcut_Value) {
        try {
            if (Shortcut_Value === 'Enter' && Global.State[this.props.ModelID].NotificationStyle !== 'Acknowledge') {
                this.Hide(true);
            }
        } catch (ex) {
            global.Log({Message: 'NotificationModal.ShortcutHandler>>' + ex.message});
        }
    };
    
    Acknowledge() {
        if (Global.State[this.props.ModelID] !== null) {
            Animated.timing(Global.State[this.props.ModelID].ViewOpacity, {duration: 150, toValue: 0, useNativeDriver: Global.NativeAnimationDriver}).start(() => {
                Global.State[this.props.ModelID] = null;
                global.root.ActiveHandler();
                this.forceUpdate();
            });
        };
    };    
    Hide() {
        try {
            if (this.IsActive() && Global.State[this.props.ModelID].NotificationStyle !== 'Acknowledge') {
                Animated.timing(Global.State[this.props.ModelID].ViewOpacity, {duration: 150, toValue: 0, useNativeDriver: Global.NativeAnimationDriver}).start(() => {
                    Global.State[this.props.ModelID] = null;
                    global.root.ActiveHandler();
                    this.forceUpdate();
                });
            }
        } catch (ex) {
            global.Log({Message: 'NotificationModal.Hide>>' + ex.message});
        }
    };
    render() {
        try {
            if (this.IsActive()) {
                return (
                    <Animated.View style={{position: 'absolute', top: 0, bottom:0, right: 0, left: 0, backgroundColor: 'rgba(51,51,51,.4)', alignItems: 'center', justifyContent:'center', opacity: Global.State[this.props.ModelID].ViewOpacity}}>
                        <View style={{width: Global.ScreenX - 20, maxWidth: 600, backgroundColor: Global.Theme.Body.ControlBackground, margin: 10, padding: 10, borderRadius: 4}}>
                            <View style={{flexDirection: 'row'}}>
                                <View style={{flex: 1, height: 40, alignItems: 'center', justifyContent: 'center', paddingLeft: Global.State[this.props.ModelID].NotificationStyle === 'Acknowledge' ? 50 : 0}}>
                                    <Text style={{fontSize: 22, fontWeight: 'bold', color: Global.Theme.Body.ForegroundColor}}>{Global.State[this.props.ModelID].NotificationTitle}</Text>
                                </View>
                                {this.renderAcknowledge()}
                            </View>
                            <View style={{alignItems:'center'}}>
                                {this.renderIndicator()}
                                {this.renderMessage()}
                            </View>
                        </View>
                    </Animated.View>
                );
            } else {
                return null;
            }
        } catch (ex) {
            global.Log({Message: 'NotificationModal.render>>' + ex.message});
        }
    };
    renderAcknowledge() {
        try {
            if (Global.State[this.props.ModelID].NotificationStyle === 'Acknowledge') {
                return (
                    <Pressable style={({pressed}) => [{width: 40, height: 40, borderRadius: 4, opacity: pressed ? .5 : 1, alignItems: 'center', justifyContent: 'center'}]} onPress={() => this.Acknowledge()}>
                        <Image source={global.ColorScheme === 'dark' ? IMG_Close_ffffff : IMG_Close_4169e1} style={Styles.form_header_button_image} />
                    </Pressable>
                );
            }
        } catch (ex) {
            global.Log({Message: 'NotificationModal.renderAcknowledge>>' + ex.message});
        }
    };
    renderIndicator() {
        try {
            if (Global.State[this.props.ModelID].NotificationStyle === 'Wait') {
                return (<ActivityIndicator style={{width: 50, height: 50}} size={'large'} color={Global.Theme.Body.ForegroundColor} />);
            }
        } catch (ex) {
            global.Log({Message: 'NotificationModal.renderIndicator>>' + ex.message});
        }
    };
    renderMessage() {
        try {
            if (Global.StringHasContent(Global.State[this.props.ModelID].NotificationMessage)) {
                return <Text style={{maxHeight: (Global.ScreenY - 120), color: Global.Theme.Body.ForegroundColor}}>{Global.State[this.props.ModelID].NotificationMessage}</Text>
            }
        } catch (ex) {
            global.Log({Message: 'NotificationModal.renderMessage>>' + ex.message});
        }
    };
};