import React, { Component } from 'react';
import {
  View,
  Text,
  TouchableHighlight,
  Pressable,
  ScrollView,
  Animated,
  Image,
} from 'react-native';
module.exports = class PickerModal extends Component {
    constructor(props) {
        super(props);
    };
    IsActive() {
        try {
            return Global.State.hasOwnProperty(this.props.ModelID) && Global.State[this.props.ModelID] !== null;
        } catch (ex) {
            global.Log({Message: 'PickerModal.IsActive>>' + ex.message, Notify: true});
        }
    };
    async Show(OptionList_Value, SelectMany_Value, SelectCallback_Value, CancelCallback_Value) {
        try {

            //Set the model
            Global.State[this.props.ModelID] = {
                OptionList: OptionList_Value,
                SelectMany: SelectMany_Value,
                SelectCallback: SelectCallback_Value,
                CancelCallback: CancelCallback_Value,
                ViewOpacity: new Animated.Value(0),
            };

            //ActiveHandler must be called after forceUpdate
            this.forceUpdate();
            global.root.ActiveHandler();

            //Animate in
            if (Global.State[this.props.ModelID] !== null && Global.State[this.props.ModelID].ViewOpacity !== null && Global.State[this.props.ModelID].ViewOpacity._value == 0) {
                Animated.timing(Global.State[this.props.ModelID].ViewOpacity, {duration: 150, toValue: 1, useNativeDriver: Global.NativeAnimationDriver}).start();
            }

        } catch (ex) {
            Global.State[this.props.ModelID] = null;
            global.Log({Message: 'PickerModal.Show>>' + ex.message, Notify: true});
        }
    };
    SelectOption(Option_Value) {
        try {
            if (Global.State[this.props.ModelID] !== null && Global.State[this.props.ModelID].SelectCallback !== null && Option_Value !== null) {
                Global.State[this.props.ModelID].SelectCallback(Option_Value.Value);
                this.Hide();
            }
        } catch (ex) {
            global.Log({Message: 'PickerModal.SelectOption>>' + ex.message, Notify: true});
        }
    };
    Apply() {
        try {
            if (Global.State[this.props.ModelID] !== null && Global.State[this.props.ModelID].SelectCallback !== null) {
                let _EventTypes = [];
                for (i = 0; i < Global.State[this.props.ModelID].OptionList.length; i++) {
                    if (Global.State[this.props.ModelID].OptionList[i].hasOwnProperty('Selected') && Global.State[this.props.ModelID].OptionList[i].Selected === true) {
                        _EventTypes.push(Global.State[this.props.ModelID].OptionList[i].Value);
                    };
                }
                Global.State[this.props.ModelID].SelectCallback(_EventTypes);
                this.Hide();
            }
        } catch (ex) {
            global.Log({Message: 'PickerModal.Apply>>' + ex.message, Notify: true});
        }
    };
    Cancel() {
        try {
            if (Global.State[this.props.ModelID] !== null && Global.State[this.props.ModelID].CancelCallback !== null && Global.State[this.props.ModelID].CancelCallback !== undefined && Global.State[this.props.ModelID].CancelCallback !== 'undefined') {
                Global.State[this.props.ModelID].CancelCallback();
                this.Hide();
            } else {
                this.Hide();
            }
        } catch (ex) {
            global.Log({Message: 'PickerModal.Cancel>>' + ex.message, Notify: true});
        }
    };

    //Handlers
    BackHandler() {
        try {
            this.Hide();
        } catch (ex) {
            global.Log({Message: 'PickerModal.Hide>>' + ex.message, Notify: true});
        }
    };

    Hide() {
        try {
            if (Global.State[this.props.ModelID] !== null) {
                Animated.timing(Global.State[this.props.ModelID].ViewOpacity, {duration: 150, toValue: 0, useNativeDriver: Global.NativeAnimationDriver}).start(() => {
                    Global.State[this.props.ModelID] = null;
                    global.root.ActiveHandler();
                    this.forceUpdate();
                });
            }
        } catch (ex) {
            global.Log({Message: 'PickerModal.Hide>>' + ex.message, Notify: true});
        }
    };
    render() {
        try {
            if (this.IsActive()) {
                return (
                    <Animated.View style={{position: 'absolute', top: 0, bottom:0, right: 0, left: 0, backgroundColor: 'rgba(51,51,51,.4)', opacity: Global.State[this.props.ModelID].ViewOpacity}}>
                        <Pressable style={{flex: 1}} onPress={() => this.Cancel()}></Pressable>
                        <View style={{flexDirection: 'row'}}>
                            <Pressable style={{flex: 1}} onPress={() => this.Cancel()}></Pressable>                            
                            <View style={{width: 300, maxHeight: (Global.ScreenY - 120), marginLeft: 'auto', marginRight: 'auto'}}>
                                <View style={{flexDirection: 'row', backgroundColor: Global.Theme.Header.BackgroundColor, borderTopRightRadius: 4, borderTopLeftRadius: 4, zIndex: 1}}>
                                    <View style={{left: 0, top: 0, right: 0, bottom: 0, borderTopLeftRadius: 4, borderTopRightRadius: 4, opacity: .9}}></View>
                                    {this.renderApply()}
                                    <View style={{flex: 1, alignItems: 'center', justifyContent: 'center', paddingLeft: Global.State[this.props.ModelID].SelectMany === true ? 0 : 50}}>
                                        <Text style={{fontSize: 20, fontWeight: 'bold', color: Global.Theme.Header.ForegroundColor}}>{Global.State[this.props.ModelID].SelectMany === true ? 'Select Any' : 'Select One'}</Text>
                                    </View>
                                    <Pressable style={({pressed}) => [{width: 50, height: 50, alignItems: 'center', justifyContent: 'center', opacity: pressed ? .7 : 1}]} onPress={() => this.Cancel() }>
                                        <Image source={Global.Theme.Header.Icons.Close} style={Styles.form_header_button_image} />
                                    </Pressable>
                                </View>
                                <ScrollView style={{backgroundColor: Global.Theme.Body.BackgroundColor, borderBottomLeftRadius: 4, borderBottomRightRadius: 4}}>
                                    {this.renderOptionList()}
                                </ScrollView>
                            </View>
                            <Pressable style={{flex: 1}} onPress={() => this.Cancel()}></Pressable>
                        </View>
                        <Pressable style={{flex: 1}} onPress={() => this.Cancel()}></Pressable>
                    </Animated.View>
                );
            } else {
                return (
                    <View></View>
                );
            }
        } catch (ex) {
            global.Log({Message: 'PickerModal.render>>' + ex.message});
        }
    };
    renderApply() {
        try {
            if (Global.State[this.props.ModelID].SelectMany === true) {
                return (
                    <TouchableHighlight style={Styles.form_header_button} onPress={() => this.Apply() }>
                        <Image source={IMG_Tick_4169e1} style={Styles.form_header_button_image} />
                    </TouchableHighlight> 
                );
            }
        } catch (ex) {
            global.Log({Message: 'PickerModal.renderApply>>' + ex.message});
        }
    };
    renderOptionList() {
        try {
            let _UI = [];
            let _Group = null;
            for (let _OptionIndex = 0; _OptionIndex < Global.State[this.props.ModelID].OptionList.length; _OptionIndex++) {
                let _Option = Global.State[this.props.ModelID].OptionList[_OptionIndex];
                if (Global.State[this.props.ModelID].SelectMany) {
                    _UI.push(
                        <View key={'OptionList_' + _OptionIndex} style={{flex:1, flexDirection:'row', borderTopWidth: _OptionIndex > 0 ? 2 : 0, borderColor: '#e1e1e1'}}>
                            <Pressable onPress={() => {
                                _Option.Selected=!_Option.Selected;
                                this.forceUpdate();
                            }}
                            style={({pressed}) => [{opacity: pressed ? .7 : 1}]}>
                                <View style={{flexDirection: 'row', height: 50, alignItems: 'center', paddingLeft: 5}}>
                                    <View style={[Styles.v3_checkbox, Global.CheckedStyle(_Option.Selected)]}></View>
                                    <Text style={{flex: 1, paddingLeft: 5, color: Global.Theme.Body.ForegroundColor}}>{_Option.Text}</Text>
                                </View>
                            </Pressable>
                        </View>
                    );
                } else {
    
                    if (_Option.hasOwnProperty('Group') && _Option.Group !== null && _Option.Group !== _Group) {
                        _Group = _Option.Group;
                        _UI.push(
                            <View key={'Group_' + _OptionIndex} style={{height: 30, justifyContent: 'center'}}>
                                <Text style={{fontWeight: 'bold', paddingLeft: 10, color: Global.Theme.Body.ForegroundFade}}>{_Option.Group}</Text>
                            </View>
                        )
                    }
    

                    if (_OptionIndex > 0) {
                        _UI.push(
                            <View style={{height: 1, backgroundColor: Global.Theme.Element.BackgroundFade, marginLeft: 10, marginRight: 10, opacity: .5}}></View>
                        );
                    }

                    _UI.push(
                        <Pressable 
                            key={'OptionList_' + _OptionIndex} 
                            style={({pressed}) => [{flex: 1, height: 50, opacity: pressed ? .7 : 1}]} 
                            onPress={() => this.SelectOption(_Option)}
                        >
                            <View style={{flex: 1, flexDirection: 'row', height: 50, alignItems: 'center'}}>
                                <Text style={{flex: 1, paddingLeft: 10, color: Global.Theme.Body.ForegroundColor}} numberOfLines={1}>{_Option.Text}</Text>
                                <View style={{width: 50, height: 50, alignItems: 'center', justifyContent: 'center'}}>
                                    <Image source={Global.Theme.Body.Icons.Forward} style={{width: 20, height: 20}} />
                                </View>
                            </View>
                        </Pressable> 
                    );
                }
            }
            return _UI;
        } catch (ex) {
            global.Log({Message: 'PickerModal.renderOptionList>>' + ex.message});
        }
    };
};