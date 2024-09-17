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
    ScrollView,
    TurboModuleRegistry,
    NativeModules,
} from 'react-native';
import ElementControl from '../controls/ElementControl.js';
module.exports = class SchemaForm extends Component {
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
            global.Log({Message: 'SchemaForm.IsActive>>' + ex.message});
        }
    };
    async Show(Params_Value) {
        try {
            global.root.NotificationModal.Show({ NotificationTitle: 'Loading...', NotificationStyle: 'Wait' });

            let _ViewWidth = Global.ScreenX > 600 ? 600 : Global.ScreenX;

            let _Schema = (Params_Value.SchemaID !== null ? await SchemaHelper.GetOne({SchemaID: Params_Value.SchemaID}) : null);

            //Create State
            Global.State[this.props.ModelID] = {
                PageTitle: _Schema.SchemaID?.length > 0 ? 'EDIT SCHEMA' : 'NEW SCHEMA',
                Schema: SchemaHelper.Clone(_Schema),
                SchemaSnapshot: SchemaHelper.Clone(_Schema),
                SchemaDirty: false,
                SchemaProperty: {
                    SchemaPropertyID: null,
                    SchemaPropertyName: null,
                    SchemaPropertyType: null,
                },
                SaveCallback: Params_Value.hasOwnProperty('SaveCallback') ? Params_Value.SaveCallback : null,
                DeleteCallback: Params_Value.hasOwnProperty('DeleteCallback') ? Params_Value.DeleteCallback : null,
                ActiveWindow: false,
                ViewWidth: _ViewWidth,
                ViewOffset: new Animated.Value(_ViewWidth),
                FooterOffset: new Animated.Value(-70),
                FooterPadding: new Animated.Value(0),
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
            global.Log({Message: 'SchemaForm.Show>>' + ex.message, Notify: true});
        }
    };
    CheckDirty() {
        try {
            let _SchemaDirty = (JSON.stringify(Global.State[this.props.ModelID].SchemaSnapshot).trim() !== JSON.stringify(Global.State[this.props.ModelID].Schema).trim());
            if (_SchemaDirty !== Global.State[this.props.ModelID].SchemaDirty) {
                Global.State[this.props.ModelID].SchemaDirty = _SchemaDirty;
                if (Global.State[this.props.ModelID] !== null && Global.State[this.props.ModelID].FooterOffset !== null) {
                    if (Global.State[this.props.ModelID].SchemaDirty) {
                        Animated.timing(Global.State[this.props.ModelID].FooterOffset, {duration: 200, toValue: Global.InsetBottom, useNativeDriver: false}).start();
                        Animated.timing(Global.State[this.props.ModelID].FooterPadding, {duration: 200, toValue: 70, useNativeDriver: false}).start();
                    } else {
                        Animated.timing(Global.State[this.props.ModelID].FooterOffset, { duration: 200, toValue: -70, useNativeDriver: false}).start();
                        Animated.timing(Global.State[this.props.ModelID].FooterPadding, { duration: 200, toValue: 0, useNativeDriver: false}).start();
                    }
                }
            }
            this.forceUpdate();
        } catch (ex) {
            global.Log({Message: 'SchemaForm.CheckDirty>>' + ex.message, Notify: true});
        }
    };
    SaveSchema() {
        try {
            this.ClearFocus();
            setTimeout(async () => {
                try {

                    await global.root.NotificationModal.Show({ NotificationTitle: 'Saving...', NotificationStyle: 'Wait' });
                    let _Schema = SchemaHelper.Clone(Global.State[this.props.ModelID].Schema);

                    //Save the schema
                    _Schema = await SchemaHelper.Save(_Schema);
                    if (_Schema !== null) {
                        Global.State[this.props.ModelID].Schema = SchemaHelper.Clone(_Schema);
                        Global.State[this.props.ModelID].SchemaSnapshot = SchemaHelper.Clone(_Schema);
                    }

                    //Run callback
                    if (Global.State[this.props.ModelID].SaveCallback !== null) {
                        Global.State[this.props.ModelID].SaveCallback(SchemaHelper.Clone(Global.State[this.props.ModelID].Schema));
                    }

                    this.CheckDirty();
                    global.root.NotificationModal.Hide();

                } catch (ex) {
                    global.Log({Message: 'SchemaForm.SaveSchema>>' + ex.message, Notify: true});
                }
            }, Platform.OS === 'macos' || Platform.OS === 'windows' ? 50 : 1);
        } catch (ex) {
            global.Log({Message: 'SchemaForm.SaveSchema>>' + ex.message, Notify: true});
        }
    };
    CancelSchema() {
        try {
            this.ClearFocus();
            setTimeout(async () => {
                try {
                    Global.State[this.props.ModelID].Schema = SchemaHelper.Clone(Global.State[this.props.ModelID].SchemaSnapshot);
                    this.CheckDirty();
                } catch (ex) {
                    global.Log({Message: 'SchemaForm.CancelSchema>>' + ex.message, Notify: true});
                }
            }, Platform.OS === 'macos' || Platform.OS === 'windows' ? 50 : 1);
        } catch (ex) {
            global.Log({Message: 'SchemaForm.CancelSchema>>' + ex.message, Notify: true});
        }
    };
    DeleteSchema() {
        try {
            this.ClearFocus();
            global.root.ConfirmModal.Show('Just Checking...', 'Are you sure you want to delete this schema?', 'Yes', 'No', async () => {
                try {
                    if (Global.State[this.props.ModelID].Schema !== null
                    && Global.State[this.props.ModelID].Schema.SchemaID !== null) {
                        await global.root.NotificationModal.Show({ NotificationTitle: 'Deleting...', NotificationStyle: 'Wait' });
                        await SchemaHelper.Delete({ SchemaID: Global.State[this.props.ModelID].Schema.SchemaID });
                        if (Global.State[this.props.ModelID].DeleteCallback !== null) {
                            Global.State[this.props.ModelID].DeleteCallback(Global.State[this.props.ModelID].Schema.SchemaID);
                        }
                        global.root.NotificationModal.Hide();
                        this.Hide();
                    } else {
                        this.Hide();
                    }
                } catch (ex) {
                    global.Log({Message: 'SchemaForm.DeleteSchema>>' + ex.message, Notify: true});
                }
            }, () => {
                //Cancel - Do Nothing
            });
        } catch (ex) {
            global.Log({Message: 'SchemaForm.DeleteSchema>>' + ex.message, Notify: true});
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
            global.Log({Message: 'SchemaForm.ActiveHandler>>' + ex.message});
        }
    };
    BackHandler() {
        try {
            this.Hide();
        } catch (ex) {
            global.Log({Message: 'SchemaForm.BackHandler>>' + ex.message});
        }
    };
    KeyboardHandler(action, keyboardheight) {
        try {
            //Do Nothing
        } catch (ex) {
            global.Log({Message: 'SchemaForm.KeyboardHandler>>' + ex.message});
        }
    };
    ShortcutHandler(Shortcut_Value) {
        try {
            //Do Nothing
        } catch (ex) {
            global.Log({Message: 'SchemaForm.ShortcutHandler>>' + ex.message});
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
            global.Log({Message: 'SchemaForm.Hide>>' + ex.message});
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
            global.Log({Message: 'SchemaForm.ClearFocus>>' + ex.message, Notify: true});
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
                                    {this.renderBody()}
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
            global.Log({Message: 'SchemaForm.render>>' + ex.message});
        }
    };
    renderHeader() {
        try {
            return (
                <Pressable style={{paddingTop: Global.InsetTop}} onPress={() => { this.ClearFocus() }}>
                    <View ref={ele => this.Titlebar = ele} style={{ height: 70, flexDirection:'row', padding: 10, enableFocusRing: false}}>
                        <Pressable
                            onPress={() => {
                                if (Global.State[this.props.ModelID].SchemaDirty) {
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
                            <Image source={Global.Theme.Header.Icons.Back} style={{width: 20, height: 20}} />
                        </Pressable>
                        <View style={{flex: 1, justifyContent: 'center'}}>
                            <Text style={{fontSize: 20, fontWeight: 'bold', color: Global.Theme.Header.ForegroundColor}}>{Global.State[this.props.ModelID].PageTitle}</Text>
                        </View>
                        <Pressable
                            onPress={() => this.DeleteSchema()}
                            style={({pressed}) => [{width: 50, height: 50, alignItems: 'center', justifyContent: 'center', opacity: pressed ? .5 : 1}]}
                        >
                            <Image source={Global.Theme.Header.Icons.Trash} style={{width: 24, height: 24}} />
                        </Pressable>
                    </View>
                </Pressable>
            );
        } catch (ex) {
            global.Log({Message: 'SchemaForm.renderHeader>>' + ex.message});
        }
    };
    renderBody() {
        try {

            //Copy ID
            let _CopyUI = null;
            if (Global.State[this.props.ModelID].PageTitle === 'EDIT SCHEMA') {
                _CopyUI = (
                    <Pressable
                        onPress={async () => {
                            try {
                                if (Platform.OS === 'windows' || Platform.OS === 'macos') {
                                    await TurboModuleRegistry.get('RNClipboard').SetString(Global.State[this.props.ModelID].Schema.SchemaID);
                                } else {
                                    await NativeModules.RNClipboard.setString(Global.State[this.props.ModelID].Schema.SchemaID);
                                }
                                global.root.NotificationModal.Show({ NotificationTitle: 'Copied!', NotificationStyle: 'Toast' });
                                global.root.NotificationModal.Show({ NotificationTitle: 'Copied!', NotificationStyle: 'Toast' });
                            } catch (ex) {
                                global.Log({Message: 'SchemaForm.renderBody.CopyID>>' + ex.message, Notify: true});
                            }
                        }}
                        style={({pressed}) => [{width: 50, height: 50, marginTop: 4, alignItems: 'center', justifyContent: 'center', opacity: pressed ? .7 : 1}]}
                    >
                        <Image source={Global.Theme.Body.Icons.Copy} style={{width: 24, height: 24}} />
                    </Pressable>
                )
            }

            let _PropertyListUI = [];
            if (Global.State[this.props.ModelID].Schema?.SchemaPropertyList?.length > 0) {
                for (let _SchemaPropertyIndex = 0; _SchemaPropertyIndex < Global.State[this.props.ModelID].Schema.SchemaPropertyList.length; _SchemaPropertyIndex++) {
                    let _SchemaProperty = Global.State[this.props.ModelID].Schema.SchemaPropertyList[_SchemaPropertyIndex];
                    if (!_SchemaProperty.hasOwnProperty('SchemaPropertyDeleted')) {
                        _PropertyListUI.push(
                            <View key={'SchemaProperty_' + _SchemaPropertyIndex} style={{flexDirection: 'row', borderRadius: 4, marginTop: 10}}>
                                <ElementControl
                                    Name={'ID'}
                                    Value={_SchemaProperty.SchemaPropertyID}
                                    RadiusTopRight={0}
                                    RadiusBottomRight={0}
                                    BackgroundColor={'transparent'}
                                    Editable={Global.State[this.props.ModelID].ActiveWindow}
                                    Enabled={false}
                                />
                                <View style={{width: 1, backgroundColor: Global.Theme.Body.BackgroundFade, marginTop: 4, marginBottom: 4}}></View>
                                <ElementControl
                                    Name={'Name'}
                                    Value={_SchemaProperty.SchemaPropertyName}
                                    Changed={(Text_Value) => {
                                        try {
                                            _SchemaProperty.SchemaPropertyName = Text_Value;
                                            this.CheckDirty();
                                        } catch (ex) {
                                            global.Log({Message: 'SchemaForm.renderBody.SchemaPropertyName>>' + ex.message});
                                        }
                                    }}
                                    RadiusTopLeft={0}
                                    RadiusTopRight={0}
                                    RadiusBottomLeft={0}
                                    RadiusBottomRight={0}
                                    BackgroundColor={'transparent'}
                                    Editable={Global.State[this.props.ModelID].ActiveWindow}
                                    Enabled={true}
                                />
                                <View style={{width: 1, backgroundColor: Global.Theme.Body.BackgroundFade, marginTop: 4, marginBottom: 4}}></View>
                                <ElementControl
                                    Name={'Type'}
                                    Value={_SchemaProperty.SchemaPropertyType}
                                    RadiusTopLeft={0}
                                    RadiusBottomLeft={0}
                                    BackgroundColor={'transparent'}
                                    Width={100}
                                    Editable={Global.State[this.props.ModelID].ActiveWindow}
                                />
                                <View style={{width: 1, backgroundColor: Global.Theme.Body.BackgroundFade, marginTop: 4, marginBottom: 4}}></View>
                                <Pressable 
                                style={({pressed}) => [{width: 50, height: 50, alignItems: 'center', justifyContent: 'center', opacity: pressed ? .7 : 1}]}
                                onPress={() => {
                                    try {
                                        global.root.ConfirmModal.Show('Just Checking...', 'Are you sure you want to delete this property?', 'Yes', 'No', async () => {
                                            try {
                                                _SchemaProperty.SchemaPropertyDeleted = new Date();
                                                this.CheckDirty();
                                            } catch (ex) {
                                                global.Log({Message: 'SchemaForm.renderBody.DeleteSchemaProperty>>' + ex.message, Notify: true});
                                            }
                                        }, () => {
                                            //Cancel - Do Nothing
                                        });                                        
                                    } catch (ex) {
                                        global.Log({Message: 'SchemaForm.renderBody.DeleteSchemaProperty>>' + ex.message});
                                    }
                                }}
                                >
                                    <Image source={Global.Theme.Body.Icons.Trash} style={{width: 24, height: 24}} />
                                </Pressable>
                            </View>
                        );
                    }
                }
            }

            _PropertyListUI.push(
                <View key={'SchemaProperty_New'} style={{flexDirection: 'row', backgroundColor: Global.Theme.Element.BackgroundColor, borderRadius: 4, marginTop: 10}}>
                    <ElementControl
                        Name={'ID'}
                        Value={Global.State[this.props.ModelID].SchemaProperty.SchemaPropertyID}
                        Changed={(Text_Value) => {
                            try {
                                Global.State[this.props.ModelID].SchemaProperty.SchemaPropertyID = Text_Value;
                                this.CheckDirty();
                            } catch (ex) {
                                global.Log({Message: 'SchemaForm.renderBody.SchemaPropertyID>>' + ex.message});
                            }
                        }}
                        RadiusTopRight={0}
                        RadiusBottomRight={0}
                        BackgroundColor={'transparent'}
                        Editable={Global.State[this.props.ModelID].ActiveWindow}
                    />
                    <View style={{width: 1, backgroundColor: Global.Theme.Body.BackgroundFade, marginTop: 4, marginBottom: 4}}></View>
                    <ElementControl
                        Name={'Name'}
                        Value={Global.State[this.props.ModelID].SchemaProperty.SchemaPropertyName}
                        Changed={(Text_Value) => {
                            try {
                                Global.State[this.props.ModelID].SchemaProperty.SchemaPropertyName = Text_Value;
                                this.CheckDirty();
                            } catch (ex) {
                                global.Log({Message: 'SchemaForm.renderBody.SchemaPropertyName>>' + ex.message});
                            }
                        }}
                        RadiusTopLeft={0}
                        RadiusTopRight={0}
                        RadiusBottomLeft={0}
                        RadiusBottomRight={0}
                        BackgroundColor={'transparent'}
                        Editable={Global.State[this.props.ModelID].ActiveWindow}
                    />
                    <View style={{width: 1, backgroundColor: Global.Theme.Body.BackgroundFade, marginTop: 4, marginBottom: 4}}></View>
                    <ElementControl
                        Name={'Type'}
                        Value={Global.State[this.props.ModelID].SchemaProperty.SchemaPropertyType}
                        Pressed={() => {
                            try {
                                global.root.PickerModal.Show([
                                    {Text: 'Text', Value: 'Text'},
                                    {Text: 'Number', Value: 'Number'},
                                    {Text: 'Decimal2', Value: 'Decimal2'},
                                    {Text: 'Decimal3', Value: 'Decimal3'},
                                    {Text: 'Decimal4', Value: 'Decimal4'},
                                ], false, (Selected_Value) => {
                                    Global.State[this.props.ModelID].SchemaProperty.SchemaPropertyType = Selected_Value;
                                    this.CheckDirty();
                                })
                            } catch (ex) {
                                global.Log({Message: 'SchemaForm.renderBody.SchemaPropertyType>>' + ex.message});
                            }
                        }}
                        RadiusTopLeft={0}
                        RadiusBottomLeft={0}
                        BackgroundColor={'transparent'}
                        Width={100}
                        Editable={Global.State[this.props.ModelID].ActiveWindow}
                    />
                    <View style={{width: 1, backgroundColor: Global.Theme.Body.BackgroundFade, marginTop: 4, marginBottom: 4}}></View>
                    <Pressable 
                    style={({pressed}) => [{width: 50, height: 50, alignItems: 'center', justifyContent: 'center', opacity: pressed ? .7 : 1}]}
                    onPress={() => {
                        try {

                            if (Global.State[this.props.ModelID].SchemaProperty.SchemaPropertyID === null 
                            || Global.State[this.props.ModelID].SchemaProperty.SchemaPropertyID?.length === 0) {
                                throw new Error('Invalid Property ID');
                            }

                            if (Global.State[this.props.ModelID].SchemaProperty.SchemaPropertyName === null 
                            || Global.State[this.props.ModelID].SchemaProperty.SchemaPropertyName?.length === 0) {
                                throw new Error('Invalid Property Name');
                            }

                            if (Global.State[this.props.ModelID].SchemaProperty.SchemaPropertyType === null 
                            || Global.State[this.props.ModelID].SchemaProperty.SchemaPropertyType?.length === 0) {
                                throw new Error('Invalid Property Type');
                            }                            

                            Global.State[this.props.ModelID].Schema.SchemaPropertyList.push({
                                SchemaPropertyID: Global.State[this.props.ModelID].SchemaProperty.SchemaPropertyID,
                                SchemaPropertyName: Global.State[this.props.ModelID].SchemaProperty.SchemaPropertyName,
                                SchemaPropertyType: Global.State[this.props.ModelID].SchemaProperty.SchemaPropertyType,
                            });
                            Global.State[this.props.ModelID].SchemaProperty.SchemaPropertyID = null;
                            Global.State[this.props.ModelID].SchemaProperty.SchemaPropertyName = null;
                            Global.State[this.props.ModelID].SchemaProperty.SchemaPropertyType = null;
                            this.CheckDirty();
                        } catch (ex) {
                            global.Log({Message: 'SchemaForm.renderBody.AddSchemaProperty>>' + ex.message, Notify: true});
                        }
                    }}
                    >
                        <Image source={Global.Theme.Body.Icons.Add} style={{width: 28, height: 28}} />
                    </Pressable>
                </View>
            );

            return (
                <ScrollView style={{flex: 1, backgroundColor: Global.Theme.Body.BackgroundColor}}
                refreshControl={
                    <RefreshControl refreshing={this.state.Refreshing} onRefresh={async () => {
                        try {
                            this.setState({Refreshing: true});
                            Global.State[this.props.ModelID].Schema = await SchemaHelper.GetOne({ SchemaID: Global.State[this.props.ModelID].Schema.SchemaID });
                            this.setState({Refreshing: false});
                        } catch (ex) {
                            global.Log({Message: 'SchemaForm.renderBody.RefreshControl>>' + ex.message, Notify: true});
                        }
                    }} />
                }>

                    {/* Schema Details */}
                    <View style={{flex: 1, padding: 10}}>

                        {/* Schema ID */}
                        <View style={{flex: 1, flexDirection: 'row'}}>
                            <ElementControl
                                Name={'ID'}
                                Value={Global.State[this.props.ModelID].Schema.SchemaID}
                                Changed={(Text_Value) => {
                                    Global.State[this.props.ModelID].Schema.SchemaID = Text_Value;
                                    this.CheckDirty();
                                }}
                                Casing={'upper'}
                                Editable={Global.State[this.props.ModelID].ActiveWindow}
                                Enabled={Global.State[this.props.ModelID].PageTitle === 'NEW SCHEMA'}
                            />
                            {_CopyUI}
                        </View>

                        {_PropertyListUI}

                    </View>

                    {/* Bottom Padding */}
                    <View style={{height: Global.InsetBottom + 20}}></View>
                    <View style={{height: Global.State[this.props.ModelID].ScrollPadding}}></View>
                    <Animated.View key={'Footer_Padding'} style={{position: 'relative', backgroundColor: 'transparent', height: Global.State[this.props.ModelID].FooterPadding}}>
                    </Animated.View>

                </ScrollView>
            );

        } catch (ex) {
            global.Log({Message: 'SchemaForm.renderBody>>' + ex.message});
        }
    };
    renderFooter() {
        try {
            return (
                <Animated.View key={'Footer_Row'} style={[Styles.v3_footer_container, {bottom: Global.State[this.props.ModelID].FooterOffset}]}>
                    <View style={{position: 'absolute', top: 0, left: 10, right: 10, height: 60, backgroundColor: Global.Theme.Footer.BackgroundColor, borderRadius: 4, opacity: .5}}></View>
                    <Pressable style={({pressed}) => [{width: 150, height: 40, marginLeft: 10, backgroundColor: '#c06e6e', opacity: pressed ? .7 : 1, borderRadius: 4, alignItems: 'center', justifyContent: 'center'}]} onPress={() => this.CancelSchema() }>
                        <Text style={{fontWeight: 'bold', color: Global.Theme.Highlight.ForegroundColor}}>Cancel</Text>
                    </Pressable>
                    <View style={{flex: 1}}></View>
                    <Pressable style={({pressed}) => [{width: 150, height: 40, marginRight: 10, backgroundColor: Global.Theme.Highlight.BackgroundColor, opacity: pressed ? .7 : 1, borderRadius: 4, alignItems: 'center', justifyContent: 'center'}]} onPress={() => this.SaveSchema(false) }>
                        <Text style={{fontWeight: 'bold', color: Global.Theme.Highlight.ForegroundColor}}>Save</Text>
                    </Pressable>
                </Animated.View>
            );
        } catch (ex) {
            global.Log({Message: 'SchemaForm.renderFooter>>' + ex.message, Notify: true});
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
            global.Log({Message: 'SchemaForm.renderSwipeBack>>' + ex.message});
        }
    };
};