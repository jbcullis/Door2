import React, { Component } from 'react';
import {
    View,
    Text,
    Image,
    ScrollView,
    Keyboard,
    Pressable,
    Platform,
} from 'react-native';
module.exports = class ActivitySearch extends Component {
    constructor(props) {
        super(props);
        this.Titlebar = null;
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
                                <View style={{flex: 1, height: 50, justifyContent: 'center'}}>
                                    <Text style={{fontSize: 20, fontWeight: 'bold', color: Global.Theme.Body.ForegroundColor}}>Door 2</Text>
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
                        <ScrollView style={{flex: 1, backgroundColor: Global.Theme.Body.BackgroundColor}}>
                            <View>
                                <Text>here</Text>
                            </View>
                        </ScrollView>
                        
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