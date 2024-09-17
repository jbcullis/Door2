import React, { Component } from 'react';
import {
    View,
    Text,
    Image,
    Animated,
    Platform,
    Keyboard,
    Pressable,
    TextInput,
    ScrollView,
} from 'react-native';
import ElementControl from '../controls/ElementControl.js';
module.exports = class EmailForm extends Component {
    constructor(props) {
        super(props);
        this.Titlebar = null;
    };
    IsActive() {
        try {
            return Global.State.hasOwnProperty(this.props.ModelID) && Global.State[this.props.ModelID] !== null;
        } catch (ex) {
            global.Log({Message: 'EmailForm.IsActive>>' + ex.message});
        }
    };
    async Show(Params_Value) {
        try {
            global.root.NotificationModal.Show({ NotificationTitle: 'Loading...', NotificationStyle: 'Wait' });

            let _ViewWidth = Global.ScreenX > 600 ? 600 : Global.ScreenX;

            //Create State
            Global.State[this.props.ModelID] = {
                PageTitle: 'EMAIL ' + Params_Value.EmailType,
                ContentPath: null,
                EmailSubject: null,
                EmailContent: null,
                EmailList: 'test',
                EmailPersonID: (Params_Value.hasOwnProperty('EmailPersonID') ? Params_Value.EmailPersonID : null),
                EmailDirty: false,
                ActiveWindow: false,
                ViewWidth: _ViewWidth,
                ViewOffset: new Animated.Value(_ViewWidth),
                FooterOffset: new Animated.Value(-70),
                FooterPadding: new Animated.Value(0)
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
            global.Log({Message: 'EmailForm.Show>>' + ex.message, Notify: true});
        }
    };
    CheckDirty() {
        try {
            let _EmailDirty = Global.StringHasContent(Global.State[this.props.ModelID].EmailSubject);
            if (_EmailDirty !== Global.State[this.props.ModelID].EmailDirty) {
                Global.State[this.props.ModelID].EmailDirty = _EmailDirty;
                if (Global.State[this.props.ModelID] !== null && Global.State[this.props.ModelID].FooterOffset !== null) {
                    if (Global.State[this.props.ModelID].EmailDirty) {
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
            global.Log({Message: 'EmailForm.CheckDirty>>' + ex.message, Notify: true});
        }
    };
    FormatEmail() {
        try {
            //this.ClearFocus();
            setTimeout(async () => {
                try {
                    await global.root.NotificationModal.Show({ NotificationTitle: 'Formatting...', NotificationStyle: 'Wait' });    
                    if (Global.StringHasContent(Global.State[this.props.ModelID].ContentPath)) {

                        //Format the email
                        Global.State[this.props.ModelID].EmailContent = await EmailHelper.Format({
                            Uri: Global.State[this.props.ModelID].ContentPath
                        });

                        global.root.NotificationModal.Hide();
                        this.CheckDirty();
                    } else {
                        throw Error('Invalid URL');
                    }
                } catch (ex) {
                    global.Log({Message: 'EmailForm.FormatEmail>>' + ex.message, Notify: true});
                }
            }, Platform.OS === 'macos' || Platform.OS === 'windows' ? 50 : 1);
        } catch (ex) {
            global.Log({Message: 'EmailForm.SendEmail>>' + ex.message, Notify: true});
        }
    };
    SendEmail() {
        try {
            //this.ClearFocus();
            setTimeout(async () => {
                try {
                    await global.root.NotificationModal.Show({ NotificationTitle: 'Sending...', NotificationStyle: 'Wait' });
                    if (Global.StringHasContent(Global.State[this.props.ModelID].EmailSubject)) {
                        if (Global.StringHasContent(Global.State[this.props.ModelID].EmailContent)) {
                            if (Global.State[this.props.ModelID].PageTitle === 'EMAIL PERSON') {
                                let _Statistics = await EmailHelper.Send({
                                    ToPersonID: Global.State[this.props.ModelID].EmailPersonID,
                                    Subject: Global.State[this.props.ModelID].EmailSubject,
                                    Content: Global.State[this.props.ModelID].EmailContent,
                                });                                
                                global.root.NotificationModal.Show({ NotificationTitle: 'Sent', NotificationMessage: 'Sent: ' + _Statistics.Sent + ' Skipped: ' + _Statistics.Skipped, NotificationStyle: 'Acknowledge' });
                                if (_Statistics.Sent === 1 && _Statistics.Skipped === 0) {
                                    this.Hide();
                                } else {
                                    this.CheckDirty();
                                }
                            } else if (Global.State[this.props.ModelID].PageTitle === 'EMAIL LIST') {

                                let _Statistics = await EmailHelper.Send({
                                    ToEmailAddress: Global.State[this.props.ModelID].EmailList,
                                    Subject: Global.State[this.props.ModelID].EmailSubject,
                                    Content: Global.State[this.props.ModelID].EmailContent,
                                });
                                this.CheckDirty();                                
                                global.root.NotificationModal.Show({ NotificationTitle: 'Sent', NotificationMessage: 'Sent: ' + _Statistics.Sent + ' Skipped: ' + _Statistics.Skipped, NotificationStyle: 'Acknowledge' });
                            } else {
                                throw Error('Invalid Email Type');
                            }
                        } else {
                            throw Error('Invalid Content');
                        }
                    } else {
                        throw Error('Invalid Subject');
                    }
                } catch (ex) {
                    global.Log({Message: 'EmailForm.SendEmail>>' + ex.message, Notify: true});
                }
            }, Platform.OS === 'macos' || Platform.OS === 'windows' ? 50 : 1);
        } catch (ex) {
            global.Log({Message: 'EmailForm.SendEmail>>' + ex.message, Notify: true});
        }
    };
    CancelEmail() {
        try {
            //this.ClearFocus();
            setTimeout(async () => {
                try {
                    Global.State[this.props.ModelID].ContentPath = null;
                    Global.State[this.props.ModelID].EmailSubject = null;
                    Global.State[this.props.ModelID].EmailContent = null;
                    this.CheckDirty();
                } catch (ex) {
                    global.Log({Message: 'EmailForm.CancelEmail>>' + ex.message, Notify: true});
                }
            }, Platform.OS === 'macos' || Platform.OS === 'windows' ? 50 : 1);
        } catch (ex) {
            global.Log({Message: 'EmailForm.CancelEmail>>' + ex.message, Notify: true});
        }
    };
    NullWebContent() {
        return '<html><head><style>body {font-family: Arial, sans-serif; font-size: 14px; color: #000000; background-color: ' + Global.Theme.Body.BackgroundColor + ';}</style></head><body style="text-align: center; padding-top: 20px; color: ' + Global.Theme.Body.ForegroundFade + '; font-size: 16pt;">Enter the url to send...</body></html>';
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
            global.Log({Message: 'EmailForm.ActiveHandler>>' + ex.message});
        }
    };
    BackHandler() {
        try {
            this.Hide();
        } catch (ex) {
            global.Log({Message: 'EmailForm.BackHandler>>' + ex.message});
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
            global.Log({Message: 'EmailForm.Hide>>' + ex.message});
        }
    };
    ClearFocus() {
        try {
            console.warn('here');
            if (Platform.OS === 'macos') {
                this.Titlebar.focus();
                this.Titlebar.blur();
            } else {
                Keyboard.dismiss();
            }
        } catch (ex) {
            global.Log({Message: 'EmailForm.ClearFocus>>' + ex.message, Notify: true});
        }
    };

    render() {
        try {
            if (this.IsActive()) {
                
                if (Global.State[this.props.ModelID].PageTitle === 'EMAIL LIST') {

                    let _ActionBar = null;
                    if (Global.State[this.props.ModelID].EmailContent?.length > 0) {
                        _ActionBar = (
                            <View style={{flexDirection: 'row', justifyContent: 'center', marginTop: 10, backgroundColor: Global.Theme.Body.ControlBackground, borderRadius: 4}}>
                                <ElementControl 
                                    Name={'Email Subject'}
                                    PlaceholderTextColor={Global.Theme.Body.ForegroundFade} 
                                    Value={Global.State[this.props.ModelID].EmailSubject}
                                    Changed={(Text_Value) => {
                                        Global.State[this.props.ModelID].EmailSubject = Text_Value;
                                        this.CheckDirty();
                                    }}
                                    Editable={this.props.ActiveWindow} 
                                />
                                <View style={{width: 1, backgroundColor: Global.Theme.Body.BackgroundFade, marginTop: 4, marginBottom: 4}}></View>
                                <ElementControl 
                                    Name={'Send To'}
                                    Value={Global.State[this.props.ModelID].EmailList} 
                                    Pressed={() => {
                                        global.root.PickerModal.Show([
                                            {Value: 'test', Text: 'test'},
                                            {Value: 'list', Text: 'list'},
                                        ], false, (Selected_Value) => {
                                            Global.State[this.props.ModelID].EmailList = Selected_Value;
                                            this.CheckDirty();
                                        });
                                    }}
                                    Placeholder={'Optional...'}
                                    MarginLeft={4}
                                    ElementWidth={120}
                                    Editable={this.props.ActiveWindow}
                                />
                            </View>                            
                        );
                    } else {
                        _ActionBar = (
                            <View style={{flexDirection: 'row', marginTop: 10, backgroundColor: Global.Theme.Body.ControlBackground, borderRadius: 4}}>
                                <ElementControl 
                                    Name={'URL to send'}                                    
                                    Value={Global.State[this.props.ModelID].ContentPath}
                                    Changed={(Text_Value) => {
                                        Global.State[this.props.ModelID].ContentPath = Text_Value;
                                        this.forceUpdate();
                                    }}
                                    RadiusTopRight={0}
                                    RadiusBottomRight={0}
                                    Editable={Global.State[this.props.ModelID].ActiveWindow} 
                                />
                                <View style={{width: 1, backgroundColor: Global.Theme.Body.BackgroundFade, marginTop: 4, marginBottom: 4}}></View>
                                <Pressable
                                    onPress={() => this.FormatEmail()}
                                    style={({pressed}) => [{width: 50, height: 50, alignItems: 'center', justifyContent: 'center', backgroundColor: Global.Theme.Body.ControlBackground, borderTopRightRadius: 4, borderBottomRightRadius: 4, opacity: pressed ? .7 : 1}]}>
                                        <Image source={Global.Theme.Body.Icons.Forward} style={{width: 20, height: 20}} />
                                </Pressable>
                            </View>
                        );
                    }

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
                                                <Image source={Global.Theme.Header.Icons.Back} style={{width: 20, height: 20}} />
                                            </Pressable>
                                            <Pressable style={{flex: 1, justifyContent: 'center'}} onPress={() => { this.ClearFocus() }}>
                                                <Text style={{fontSize: 20, fontWeight: 'bold', color: Global.Theme.Header.ForegroundColor}} numberOfLines={1}>{Global.State[this.props.ModelID].PageTitle}</Text>
                                            </Pressable>
                                        </View>
                                        {_ActionBar}
                                    </View>

                                    {/* Body */}
                                    <View style={{flex: 1}}>

                                        {this.renderFooter()}
                                        {this.renderSwipeBack()}
                                    </View>
                                    
                                </View>
                            </Animated.View>
                        </View>
                    );

                } else if (Global.State[this.props.ModelID].PageTitle === 'EMAIL PERSON') {

                    let _ActionBar = null;
                    if (Global.State[this.props.ModelID].PageTitle === 'EMAIL PERSON') {
                        _ActionBar = (
                            <View style={{flex: 1, flexDirection: 'row', justifyContent: 'center', paddingLeft: 8, paddingRight: 8}}>
                                <ElementControl 
                                    Name={'Email Subject'}
                                    PlaceholderTextColor={'#a9a9a9'} 
                                    Value={Global.State[this.props.ModelID].EmailSubject}
                                    Changed={(Text_Value) => {
                                        Global.State[this.props.ModelID].EmailSubject = Text_Value;
                                        this.CheckDirty();
                                    }}
                                    Editable={this.props.ActiveWindow} 
                                />
                            </View>
                        );
                    } else {
                        _ActionBar = (
                            <View style={{flexDirection: 'row', marginTop: 10, backgroundColor: Global.Theme.Body.ControlBackground, borderRadius: 4}}>                                
                                <ElementControl 
                                    Name={'URL to send'}
                                    PlaceholderTextColor={Global.Theme.Body.ForegroundFade} 
                                    Value={Global.State[this.props.ModelID].ContentPath}
                                    Changed={(Text_Value) => {
                                        Global.State[this.props.ModelID].ContentPath = Text_Value;
                                        this.CheckDirty();
                                    }}
                                    Casing={'lower'}
                                    RadiusTopRight={0}
                                    RadiusBottomRight={0}
                                    Editable={Global.State[this.props.ModelID].ActiveWindow} 
                                />
                                <View style={{width: 1, backgroundColor: Global.Theme.Body.BackgroundFade, marginTop: 4, marginBottom: 4}}></View>
                                <Pressable
                                    onPress={() => this.FormatEmail()}
                                    style={({pressed}) => [{width: 50, height: 50, alignItems: 'center', justifyContent: 'center', backgroundColor: Global.Theme.Body.ControlBackground, borderTopRightRadius: 4, borderBottomRightRadius: 4, opacity: pressed ? .7 : 1}]}>
                                        <Image source={Global.Theme.Body.Icons.Forward} style={{width: 20, height: 20}} />
                                </Pressable>
                            </View>
                        );
                    }

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
                                                <Text style={{fontSize: 20, fontWeight: 'bold', color: Global.Theme.Header.ForegroundColor}} numberOfLines={1}>{Global.State[this.props.ModelID].PageTitle}</Text>
                                            </Pressable>
                                        </View>
                                        {_ActionBar}
                                    </View>
                                    
                                    {/* Body */}
                                    <View style={{flex: 1}}>

                                        {/* Email Content */}
                                        <ScrollView style={[{flex: 1, backgroundColor: Global.Theme.Body.BackgroundColor}]}>
                                            <TextInput 
                                                style={[{
                                                    backgroundColor: 'transparent', 
                                                    padding: 0,
                                                    minHeight: 50,
                                                    fontWeight: 'bold', 
                                                    borderWidth: 0, 
                                                    borderColor: 'transparent', 
                                                    backgroundColor: 'transparent',
                                                    borderRadius: 4,
                                                    color: Global.Theme.Body.ForegroundColor,
                                                    paddingTop: 16,
                                                    paddingBottom: 16,
                                                    paddingLeft: 16,
                                                    paddingRight: 16 
                                                }]} 
                                                placeholder='Type a message...' 
                                                placeholderTextColor={'#a9a9a9'} 
                                                onChangeText={(text) => {
                                                    Global.State[this.props.ModelID].EmailContent = text;
                                                    this.CheckDirty();
                                                }}
                                                value={Global.State[this.props.ModelID].EmailContent} 
                                                autoComplete={'off'} 
                                                autoCorrect={true} 
                                                multiline={true}
                                                underlineColorAndroid='transparent' 
                                                editable={true}                               
                                            />
                                        </ScrollView>

                                        {this.renderFooter()}
                                        {this.renderSwipeBack()}
                                    </View>
                                    
                                </View>
                            </Animated.View>
                        </View>
                    );

                } else {                    
                    return (
                        <View style={{position: 'absolute', top: 0, right: 0, bottom: 0, left: 0}}>
                            <Animated.View style={{position: 'absolute', top: 0, bottom: 0, right: 0, width: Global.State[this.props.ModelID].ViewWidth, backgroundColor: 'transparent', transform: [{translateX: Global.State[this.props.ModelID].ViewOffset}]}}>
                                <View style={{position: 'absolute', top: 0, right: 0, bottom: 0, backgroundColor: Global.Theme.Header.BackgroundColor, width: Global.State[this.props.ModelID].ViewWidth}}>
                                    
                                    {/* Header */}
                                    <Pressable style={{height: 70, padding: 10, paddingTop: Global.InsetTop}} onPress={() => { this.ClearFocus() }}>
                                        <View ref={ele => this.Titlebar = ele} style={{ flexDirection:'row', enableFocusRing: false}}>
                                            <Pressable 
                                            onPress={() => {
                                                this.Hide();
                                            }}
                                            style={({pressed}) => [{width: 50, height: 50, alignItems: 'center', justifyContent: 'center', opacity: pressed ? .5 : 1}]}
                                            >
                                                <Image source={Global.Theme.Header.Icons.Back} style={{width: 20, height: 20}} />
                                            </Pressable>
                                            <View style={{flex: 1, justifyContent: 'center'}}>
                                                <Text style={{fontSize: 20, fontWeight: 'bold', color: Global.Theme.Header.ForegroundColor}} numberOfLines={1}>INVALID EMAIL</Text>
                                            </View>
                                        </View>
                                    </Pressable>

                                    {/* Body */}
                                    <ScrollView style={{flex: 1, backgroundColor: Global.Theme.Body.BackgroundColor}}>
                                        <View style={{height: 50, alignItems: 'center', justifyContent: 'center'}}>
                                            <Text style={{color: Global.Theme.Body.ForegroundFade}}>Invalid Email Type</Text>
                                        </View>
                                        {this.renderSwipeBack()}
                                    </ScrollView>

                                </View>
                            </Animated.View>
                        </View>
                    );
                }
            } else {
                return (<View></View>);
            }
        } catch (ex) {
            global.Log({Message: 'EmailForm.render>>' + ex.message});
        }
    };
    renderFooter() {
        try {
            return (
                <Animated.View key={'Footer_Row'} style={[Styles.v3_footer_container, {bottom: Global.State[this.props.ModelID].FooterOffset}]}>
                    <View style={{position: 'absolute', top: 0, left: 10, right: 10, height: 60, backgroundColor: Global.Theme.Footer.BackgroundColor, borderRadius: 6, opacity: .5}}></View>
                    <Pressable style={({pressed}) => [{width: 150, height: 40, marginLeft: 10, backgroundColor: '#c06e6e', opacity: pressed ? .7 : 1, borderRadius: 4, alignItems: 'center', justifyContent: 'center'}]} onPress={() => this.CancelEmail() }>
                        <Text style={{fontWeight: 'bold', color: Global.Theme.Highlight.ForegroundColor}}>Cancel</Text>
                    </Pressable>
                    <View style={{flex: 1}}></View>
                    <Pressable style={({pressed}) => [{width: 150, height: 40, marginRight: 10, backgroundColor: Global.Theme.Highlight.BackgroundColor, opacity: pressed ? .7 : 1, borderRadius: 4, alignItems: 'center', justifyContent: 'center'}]} onPress={() => this.SendEmail() }>
                        <Text style={{fontWeight: 'bold', color: Global.Theme.Highlight.ForegroundColor}}>Send</Text>
                    </Pressable>
                </Animated.View>
            );
        } catch (ex) {
            global.Log({Message: 'EmailForm.renderFooter>>' + ex.message, Notify: true});
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
            global.Log({Message: 'EmailForm.renderSwipeBack>>' + ex.message});
        }
    };
};