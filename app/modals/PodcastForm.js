import React, { Component } from 'react';
import {
    View,
    Text,
    Image,
    Animated,
    Pressable,
    TurboModuleRegistry,
    Platform,
    Keyboard,
    PermissionsAndroid,
    ScrollView
} from 'react-native';
import ElementControl from '../controls/ElementControl.js';
module.exports = class PodcastForm extends Component {
    constructor(props) {
        super(props);
        this.Titlebar = null;
        this.AccountForm = null;
        this.PersonForm = null;
    };
    IsActive() {
        try {
            return Global.State.hasOwnProperty(this.props.ModelID) && Global.State[this.props.ModelID] !== null;
        } catch (ex) {
            global.Log({Message: 'PodcastForm.IsActive>>' + ex.message});
        }
    };
    async Show(Podcast_Value) {
        try {

            let _ViewWidth = Global.ScreenX > 600 ? 600 : Global.ScreenX;

            //Load initial model - force update before flyout
            Global.State[this.props.ModelID] = {
                Podcast: Podcast_Value,
                ActiveWindow: false,
                ViewWidth: _ViewWidth,
                ViewOffset: new Animated.Value(_ViewWidth),
                FooterOffset: new Animated.Value(-70),
                FooterPadding: new Animated.Value(0)            
            };
            
            //ActiveHandler must be called after forceUpdate
            this.forceUpdate();
            global.root.ActiveHandler();
    
            //Run flyout animation
            if (Global.State[this.props.ModelID] !== null && Global.State[this.props.ModelID].ViewOffset !== null && Global.State[this.props.ModelID].ViewOffset._value >= Global.State[this.props.ModelID].ViewWidth) {
                setTimeout(() => {
                    Animated.timing(Global.State[this.props.ModelID].ViewOffset, {duration: 200, toValue: 0, useNativeDriver: Global.NativeAnimationDriver}).start(() => {
                        global.root.NotificationModal.Hide();
                    });
                }, 1);
            }
            
        } catch (ex) {
            Global.State[this.props.ModelID] = null;
            global.Log({Message: 'PodcastForm.Show>>' + ex.message, Data: Podcast_Value, Notify: true});
        }
    };


    //Handlers
    ActiveHandler() {
        try {

            //Handle ActiveWindow state
            let _ActiveWindow = false;
            if (this.AccountForm !== null && this.AccountForm.IsActive()) {
                this.AccountForm.ActiveHandler();
            } else if (this.PersonForm !== null && this.PersonForm.IsActive()) {
                this.PersonForm.ActiveHandler();
            } else if (!global.GlobalModalActive) {
                _ActiveWindow = true;
            }

            //Handle ActiveWindow change
            if (_ActiveWindow !== Global.State[this.props.ModelID].ActiveWindow) {
                Global.State[this.props.ModelID].ActiveWindow = _ActiveWindow;
                this.forceUpdate();
            }

        } catch (ex) {
            global.Log({Message: 'PodcastForm.ActiveHandler>>' + ex.message});
        }
    };
    BackHandler() {
        try {
            this.Hide();
        } catch (ex) {
            global.Log({Message: 'PodcastForm.BackHandler>>' + ex.message});
        }
    };
    ShortcutHandler(Shortcut_Value) {
        try {
            //Do Nothing
        } catch (ex) {
            global.Log({Message: 'PodcastForm.ShortcutHandler>>' + ex.message});
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
            global.Log({Message: 'TransaPodcastFormctionForm.Hide>>' + ex.message, Notify: true});
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
            global.Log({Message: 'PodcastForm.ClearFocus>>' + ex.message});
        }
    };

    render() {
        try {
            if (this.IsActive()) {
                return (
                    <View style={{position: 'absolute', top: 0, right: 0, bottom: 0, left: 0}}>
                        <Animated.View style={{position: 'absolute', top: 0, bottom: 0, right: 0, width: Global.State[this.props.ModelID].ViewWidth, backgroundColor: 'transparent', transform: [{translateX: Global.State[this.props.ModelID].ViewOffset}]}}>
                            <View style={{position: 'absolute', top: 0, right: 0, bottom: 0, backgroundColor: Global.Theme.Header.BackgroundColor, width: Global.State[this.props.ModelID].ViewWidth}}>
                                {this.renderHeader()}
                                <View style={{flex: 1}}>

                                    <ScrollView style={{backgroundColor: Global.Theme.Body.BackgroundColor}}>
                                        <View style={{height: 300, backgroundColor: 'red', alignItems: 'center', justifyContent: 'center'}}>

                                        </View>
                                        <View style={{alignItems: 'center', justifyContent: 'center'}}>




                                            <View>
                                                <Pressable style={{width: 60, height: 60, alignItems: 'center', justifyContent: 'center', backgroundColor: 'blue', borderRadius: 30}}>
                                                    <Text>Play</Text>
                                                </Pressable>
                                            </View>


                                        </View>
                                    </ScrollView>


                                    {this.renderSwipeBack()}
                                </View>
                            </View>
                        </Animated.View>
                        <AccountForm ref={ele => this.AccountForm = ele} ModelID={this.props.ModelID + '_MQ5WN7SM'} />
                        <PersonForm ref={ele => this.PersonForm = ele} ModelID={this.props.ModelID + '_BRE5PX1R'} />
                    </View>
                );
            } else {
                return (<View></View>);
            }
        } catch (ex) {
            global.Log({Message: 'PodcastForm.render>>' + ex.message});
        }
    };
    renderHeader() {
        try {
            return (
                <Pressable style={{paddingTop: Global.InsetTop}} onPress={() => { this.ClearFocus() }}>
                    <View ref={ele => this.Titlebar = ele} style={{ height: 70, flexDirection:'row', padding: 10, enableFocusRing: false}}>
                        <Pressable 
                            onPress={() => {
                                if (Global.State[this.props.ModelID].ProductDirty) {
                                    global.root.ConfirmModal.Show('Just Checking...', 'You have unsaved changes, close anyway?', 'Yes', 'No', () => {
                                        this.Hide();
                                    }, () => {
                                        //Cancel - Do Nothing
                                    });
                                } else {
                                    this.Hide();
                                }
                            }}
                            style={({pressed}) => [{width: 50, height: 50, alignItems: 'center', justifyContent: 'center', opacity: pressed ? .5 : 1}]}
                        >
                            <Image source={global.ColorScheme === 'dark' ? IMG_Back_eeeeee : IMG_Back_121212} style={{width: 24, height: 24}} />
                        </Pressable>
                        <View style={{flex: 1, alignItems: 'center', justifyContent: 'center'}}>
                            <Text style={{fontSize: 20, fontWeight: 'bold', color: Global.Theme.Body.ForegroundColor}}>{Global.State[this.props.ModelID].Podcast.PodcastName}</Text>
                        </View>
                        <View style={{width: 50, height: 50}}>

                        </View>
                    </View>
                </Pressable>             
            );
        } catch (ex) {
            global.Log({Message: 'PodcastForm.renderHeader>>' + ex.message});
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
            global.Log({Message: 'PodcastForm.renderSwipeBack>>' + ex.message});
        }
    };
};