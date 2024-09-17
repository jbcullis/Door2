import React, { Component } from 'react';
import {
    TextInput,
    View,
    Text,
    Image,
    Animated,
    Platform,
    Keyboard,
    Pressable,
    ScrollView,
    Easing,
} from 'react-native';
module.exports = class ThreadForm extends Component {
    constructor(props) {
        super(props);
        this.Titlebar = null;
        this.Scroller = null;
        this.CombinedLogSearch = null;
        this.PersonForm = null;
    };
    IsActive() {
        try {
            return Global.State.hasOwnProperty(this.props.ModelID) && Global.State[this.props.ModelID] !== null;
        } catch (ex) {
            global.Log({Message: 'ThreadForm.IsActive>>' + ex.message});
        }
    };
    async Show(Params_Value) {
        try {
            global.root.NotificationModal.Show({ NotificationTitle: 'Loading...', NotificationStyle: 'Wait' });

            let _ViewWidth = Global.ScreenX > 600 ? 600 : Global.ScreenX;

            //Generate description
            let _Description = '';
            if (Params_Value.Thread.ThreadPersonList !== null && Params_Value.Thread.ThreadPersonList.length > 0) {
                for (let _ThreadPersonIndex = 0; _ThreadPersonIndex < Params_Value.Thread.ThreadPersonList.length; _ThreadPersonIndex++) {
                    if (!Params_Value.Thread.ThreadPersonList[_ThreadPersonIndex].ThreadPersonID.startsWith('@')) {
                        _Description += (_Description.length > 0 ? ', ' : '') + Params_Value.Thread.ThreadPersonList[_ThreadPersonIndex].ThreadPersonName;
                    }
                }
            }

            //Create State
            Global.State[this.props.ModelID] = {
                PageTitle: (_Description.length > 0 ? _Description : 'Chat Support'),
                Thread: Params_Value.Thread,
                ThreadMessageList: await ThreadMessageHelper.GetList({SearchThreadID: Params_Value.Thread.ThreadID, Limit: 25}),
                ThreadMessageText: '',
                ReadCallback: Params_Value.ReadCallback,
                DeleteCallback: Params_Value.DeleteCallback,
                AnimateScroll: false,
                ActiveWindow: false,
                ViewWidth: _ViewWidth,
                ViewOffset: new Animated.Value(_ViewWidth),
                FooterOffset: new Animated.Value(-70),
                FooterPadding: new Animated.Value(0),
                ViewOpacity: new Animated.Value(1),
                KeyboardHeight: new Animated.Value(0),
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
            global.Log({Message: 'ThreadForm.Show>>' + ex.message, Notify: true});
        }
    };

    //Handlers
    ActiveHandler() {
        try {

            //Handle ActiveWindow state
            let _ActiveWindow = false;
            if (this.CombinedLogSearch !== null && this.CombinedLogSearch.IsActive()) {
                this.CombinedLogSearch.ActiveHandler();
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
            global.Log({Message: 'ThreadForm.ActiveHandler>>' + ex.message});
        }
    };
    BackHandler() {
        try {
            if (this.CombinedLogSearch !== null && this.CombinedLogSearch.IsActive()) {
                this.CombinedLogSearch.BackHandler();
            } else if (this.PersonForm !== null && this.PersonForm.IsActive()) {
                this.PersonForm.BackHandler();
            } else {
                this.Hide();
            }
        } catch (ex) {
            global.Log({Message: 'ThreadForm.BackHandler>>' + ex.message});
        }
    };
    KeyboardHandler(action, keyboardheight) {
        try {
            if (this.CombinedLogSearch !== null && this.CombinedLogSearch.IsActive()) {
                this.CombinedLogSearch.KeyboardHandler(action, keyboardheight);
            } else if (this.PersonForm !== null && this.PersonForm.IsActive()) {
                this.PersonForm.KeyboardHandler(action, keyboardheight);
            } else {
                Animated.timing(Global.State[this.props.ModelID].ViewOpacity, {duration: 100, toValue: (keyboardheight > 0 ? .5 : 1), useNativeDriver: Global.NativeAnimationDriver}).start();
                Animated.timing(Global.State[this.props.ModelID].KeyboardHeight, {toValue: (keyboardheight > 0 ? (keyboardheight + 8) - Global.InsetBottom : 0), duration: 200, easing: Easing.bezier(0.55, 0.085, 0.68, 0.53), useNativeDriver: false}).start();
            }
        } catch (ex) {
            global.Log({Message: 'ThreadForm.KeyboardHandler>>' + ex.message});
        }
    };
    ShortcutHandler(Shortcut_Value) {
        try {
            if (this.CombinedLogSearch?.IsActive()) {
                this.CombinedLogSearch.ShortcutHandler(Shortcut_Value);
            } else if (this.PersonForm?.IsActive()) {
                this.PersonForm.ShortcutHandler(Shortcut_Value);
            } else {
                //Do Nothing
            }
        } catch (ex) {
            global.Log({Message: 'ThreadForm.ShortcutHandler>>' + ex.message});
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
            global.Log({Message: 'ThreadForm.Hide>>' + ex.message});
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
            global.Log({Message: 'ThreadForm.ClearFocus>>' + ex.message, Notify: true});
        }
    };

    ReceiveMessage(ThreadMessage_Value) {
        try {            
            if (ThreadMessage_Value !== null && ThreadMessage_Value.ThreadID === Global.State[this.props.ModelID].Thread.ThreadID) {                
                Global.State[this.props.ModelID].ThreadMessageList.push(ThreadMessage_Value);
                this.forceUpdate();
            }
        } catch (ex) {
            global.Log({Message: 'ThreadForm.ReceiveMessage>>' + ex.message, NotificationStyle: 'Wait'});
        }
    };
    SendMessage(Message_Value) {
        try {
            if (Global.StringHasContent(Message_Value)) {
                
                //Send the message
                Global.WebSocket.send(JSON.stringify({
                    ThreadID: Global.State[this.props.ModelID].Thread.ThreadID,
                    PersonID: '@support',
                    Message: Message_Value,
                }));

                //Update the read marker
                Global.WebSocket.send(JSON.stringify({
                    ThreadID: Global.State[this.props.ModelID].Thread.ThreadID,
                    PersonID: '@support',
                    Message: '{{READ}}',
                }));

            }
        } catch (ex) {
            global.Log({Message: 'ThreadForm.SendMessage>>' + ex.message, NotificationStyle: 'Wait'});
        }
    };
    async SuggesstResponse() {
        try {
            global.root.NotificationModal.Show({ NotificationTitle: 'Responding...', NotificationStyle: 'Wait' });
            this.ClearFocus();
            Global.State[this.props.ModelID].ThreadMessageText = await ThreadHelper.Suggest({ThreadID: Global.State[this.props.ModelID].Thread.ThreadID});
            this.forceUpdate();
            global.root.NotificationModal.Hide();
        } catch (ex) {
            global.Log({Message: 'ThreadForm.SuggesstResponse>>' + ex.message, Notify: true});
        }
    };
    
    ShowPerson() {
        try {            
            let _PersonID = null;
            if (Global.State[this.props.ModelID].Thread.ThreadPersonList !== null && Global.State[this.props.ModelID].Thread.ThreadPersonList.length > 0) {
                for (let _ThreadPersonIndex = 0; _ThreadPersonIndex < Global.State[this.props.ModelID].Thread.ThreadPersonList.length; _ThreadPersonIndex++) {
                    if (!Global.State[this.props.ModelID].Thread.ThreadPersonList[_ThreadPersonIndex].ThreadPersonID.startsWith('@')) {
                        _PersonID = Global.State[this.props.ModelID].Thread.ThreadPersonList[_ThreadPersonIndex].ThreadPersonID;
                        break;
                    }
                }
            }
            if (_PersonID !== null) {
                this.PersonForm.Show({
                    PersonID: _PersonID,
                    AllowChat: false,
                    SaveCallback: null,
                    DeleteCallback: null
                });
            }
        } catch (ex) {
            global.Log({Message: 'ThreadForm.ShowPerson>>' + ex.message, Notify: true});
        }
    };
    ShowLogs(SearchType_Value) {
        try {
            let _PersonID = null;
            if (Global.State[this.props.ModelID].Thread.ThreadPersonList !== null && Global.State[this.props.ModelID].Thread.ThreadPersonList.length > 0) {
                for (let _ThreadPersonIndex = 0; _ThreadPersonIndex < Global.State[this.props.ModelID].Thread.ThreadPersonList.length; _ThreadPersonIndex++) {
                    if (!Global.State[this.props.ModelID].Thread.ThreadPersonList[_ThreadPersonIndex].ThreadPersonID.startsWith('@')) {
                        _PersonID = Global.State[this.props.ModelID].Thread.ThreadPersonList[_ThreadPersonIndex].ThreadPersonID;
                        break;
                    }
                }
            }
            if (_PersonID !== null) {
                this.CombinedLogSearch.Show({
                    SearchType: SearchType_Value,
                    SearchPersonID: _PersonID
                });
            }
        } catch (ex) {
            global.Log({Message: 'ThreadForm.ShowLogs>>' + ex.message, Notify: true});
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
                        <CombinedLogSearch ref={ele => this.CombinedLogSearch = ele} ModelID={this.props.ModelID + '_CLS95YN'} />
                        <PersonForm ref={ele => this.PersonForm = ele} ModelID={this.props.ModelID + '_3TJQ95YN'} />
                    </View>
                );
            } else {
                return (<View></View>);
            }
        } catch (ex) {
            global.Log({Message: 'ThreadForm.render>>' + ex.message});
        }
    };
    renderHeader() {
        try {
            return (
                <Pressable style={{paddingTop: Global.InsetTop}} onPress={() => { this.ClearFocus() }}>
                    <View ref={ele => this.Titlebar = ele} style={{ height: 70, flexDirection:'row', padding: 10, enableFocusRing: false}}>
                        <Pressable 
                            onPress={() => {
                                if (Global.State[this.props.ModelID].ThreadMessageText !== null && Global.State[this.props.ModelID].ThreadMessageText.length > 0) {
                                    global.root.ConfirmModal.Show('Just Checking...', 'You have an un-sent message, close anyway?', 'Yes', 'No', () => {
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
                            <Image source={global.ColorScheme === 'dark' ? IMG_Back_eeeeee : IMG_Back_121212} style={Styles.toolbar_button_image} />
                        </Pressable>
                        <View style={{flex: 1, justifyContent: 'center'}}>
                            <Text style={{fontSize: 20, fontWeight: 'bold', color: Global.Theme.Body.ForegroundColor}} numberOfLines={1}>{Global.State[this.props.ModelID].PageTitle}</Text>
                        </View>
                        <Pressable
                            onPress={() => this.ShowPerson()}
                            style={({pressed}) => [{width: 50, height: 50, alignItems: 'center', justifyContent: 'center', opacity: pressed ? .5 : 1}]}
                        >
                            <Image source={global.ColorScheme === 'dark' ? IMG_Person_eeeeee : IMG_Person_121212} style={{width: 24, height: 24}} />
                        </Pressable>
                        <Pressable
                            onPress={() => {
                                global.root.ConfirmModal.Show('Just Checking...', 'Are you sure you want to mark this thread as read?', 'Yes', 'No', async () => {
                                    try {
                                        Global.WebSocket.send(JSON.stringify({
                                            ThreadID: Global.State[this.props.ModelID].Thread.ThreadID,
                                            PersonID: '@support',
                                            Message: '{{READ}}',
                                        }));
                                        if (Global.State[this.props.ModelID].ReadCallback !== null) {
                                            Global.State[this.props.ModelID].ReadCallback(Global.State[this.props.ModelID].Thread.ThreadID);
                                        }
                                        this.Hide();
                                    } catch (ex) {
                                        global.Log({Message: 'ThreadForm.ArchiveThread>>' + ex.message, Notify: true});
                                    }
                                }, () => {
                                    //Cancel - Do Nothing
                                });  
                            }}
                            style={({pressed}) => [{width: 50, height: 50, alignItems: 'center', justifyContent: 'center', opacity: pressed ? .5 : 1}]}
                        >
                            <Image source={global.ColorScheme === 'dark' ? IMG_Done_eeeeee : IMG_Done_121212} style={{width: 24, height: 24}} />
                        </Pressable>
                        <Pressable
                            onPress={() => {
                                global.root.ConfirmModal.Show('Just Checking...', 'Are you sure you want to archive this thread?', 'Yes', 'No', async () => {
                                    try {
                                        ThreadHelper.Save({
                                            ThreadID: Global.State[this.props.ModelID].Thread.ThreadID,
                                            ThreadStatus: 'archived',
                                        });
                                        if (Global.State[this.props.ModelID].DeleteCallback !== null) {
                                            Global.State[this.props.ModelID].DeleteCallback(Global.State[this.props.ModelID].Thread.ThreadID);
                                        }
                                        this.Hide();
                                    } catch (ex) {
                                        global.Log({Message: 'ThreadForm.ArchiveThread>>' + ex.message, Notify: true});
                                    }
                                }, () => {
                                    //Cancel - Do Nothing
                                });  
                            }}
                            style={({pressed}) => [{width: 50, height: 50, alignItems: 'center', justifyContent: 'center', opacity: pressed ? .5 : 1}]}
                        >
                            <Image source={global.ColorScheme === 'dark' ? IMG_Archive_eeeeee : IMG_Archive_121212} style={{width: 24, height: 24}} />
                        </Pressable>
                        <Pressable
                            onPress={() => {
                                global.root.ConfirmModal.Show('Just Checking...', 'Are you sure you want to delete this thread?', 'Yes', 'No', async () => {
                                    try {
                                        ThreadHelper.Delete({ThreadID: Global.State[this.props.ModelID].Thread.ThreadID});
                                        if (Global.State[this.props.ModelID].DeleteCallback !== null) {
                                            Global.State[this.props.ModelID].DeleteCallback(Global.State[this.props.ModelID].Thread.ThreadID);
                                        }                                        
                                        this.Hide();
                                    } catch (ex) {
                                        global.Log({Message: 'ThreadForm.DeleteThread>>' + ex.message, Notify: true});
                                    }
                                }, () => {
                                    //Cancel - Do Nothing
                                });
                            }}
                            style={({pressed}) => [{width: 50, height: 50, alignItems: 'center', justifyContent: 'center', opacity: pressed ? .5 : 1}]}
                        >
                            <Image source={global.ColorScheme === 'dark' ? IMG_Trash_eeeeee : IMG_Trash_121212} style={{width: 24, height: 24}} />
                        </Pressable>
                    </View>
                </Pressable>
            );
        } catch (ex) {
            global.Log({Message: 'ThreadForm.renderHeader>>' + ex.message});
        }
    };
    renderBody() {
        try {

            //Message List
            let _ThreadMessageListUI = [];            
            if (Global.State[this.props.ModelID].ThreadMessageList !== null && Global.State[this.props.ModelID].ThreadMessageList.length > 0) {
                for (let _ThreadMessageIndex = 0; _ThreadMessageIndex < Global.State[this.props.ModelID].ThreadMessageList.length; _ThreadMessageIndex++) {
                    let _IsClient = Global.State[this.props.ModelID].ThreadMessageList[_ThreadMessageIndex].ThreadMessagePersonID === '@support';
 
                    let _Padding1 = null;
                    if (_IsClient) {
                        _Padding1 = (
                            <View style={{flex: 1}}></View>
                        );
                    }

                    //Message Text
                    _ThreadMessageListUI.push(
                        <View key={'ThreadMessageText_' + _ThreadMessageIndex} style={{flexDirection: 'row', marginLeft: _IsClient ? parseInt(Global.State[this.props.ModelID].ViewWidth * .4) : 8, marginRight: !_IsClient ? parseInt(Global.State[this.props.ModelID].ViewWidth * .4) : 8, marginTop: 20}}>
                            {_Padding1}
                            <View style={[{minWidth: 100, backgroundColor: _IsClient ? Global.Theme.Highlight.BackgroundColor : Global.Theme.Body.ControlBackground, borderRadius: 4, paddingTop: 18, paddingLeft: 20, paddingRight: 20, paddingBottom: 18}]}>
                                <Text style={{position: 'absolute', top: 2, left: 5, right: 5, textAlign: 'right', color: _IsClient ? Global.Theme.Highlight.ForegroundColor : Global.Theme.Body.ForegroundColor, opacity: .5, fontSize: 10}}>{Global.TimeSince(new Date(Global.State[this.props.ModelID].ThreadMessageList[_ThreadMessageIndex].ThreadMessageCreated + 'Z'))}</Text>
                                <Text style={{color: (_IsClient ? Global.Theme.Highlight.ForegroundColor : Global.Theme.Body.ForegroundColor)}} selectable={true}>{Global.State[this.props.ModelID].ThreadMessageList[_ThreadMessageIndex].ThreadMessageText}</Text>
                            </View>
                        </View>
                    );

                }
            } else {
                _ThreadMessageListUI.push(
                    <View key={'MessageIndex_0'} style={{alignItems: 'center', marginTop: 20}}>
                        <Text style={{color: Global.Theme.Body.ForegroundFade}}>Type a message below to start a chat session.</Text>
                    </View>
                );
            }

            return (
                <ScrollView ref={ele => this.Scroller = ele} style={{flex: 1, backgroundColor: Global.Theme.Body.BackgroundColor}} onContentSizeChange={() => {
                    try {
                        this.Scroller.scrollToEnd({animated: Global.State[this.props.ModelID].AnimateScroll});
                        Global.State[this.props.ModelID].AnimateScroll = true;
                    } catch (ex) {
                        global.Log({Message: 'ThreadForm.renderBody.scrollToEnd>>' + ex.message});
                    }
                }}>

                    <Animated.View style={{opacity: Global.State[this.props.ModelID].ViewOpacity}}>
                        {_ThreadMessageListUI}
                    </Animated.View>
                    
                    {/* Bottom Padding */}
                    <View style={{height: parseInt(80 + Global.InsetBottom)}}></View>                   

                </ScrollView>
            );

        } catch (ex) {
            global.Log({Message: 'ThreadForm.renderBody>>' + ex.message});
        }
    };
    renderFooter() {
        try {
            return (
                <View style={[{position: 'absolute', left: 0, right: 0, bottom: (Global.InsetBottom > 0 ? Global.InsetBottom : 10)}]}>
                    <View style={{flexDirection: 'row', marginLeft: 10, marginRight: 10}}>
                        <View style={[{flex: 1}]}>
                            <TextInput 
                                style={[{
                                    padding: 0,
                                    minHeight: 50,
                                    fontWeight: 'bold', 
                                    borderWidth: 0, 
                                    borderColor: 'transparent', 
                                    margin: 0,
                                    backgroundColor: Global.Theme.Body.ControlBackground,
                                    borderRadius: 5,
                                    color: Global.Theme.Body.ForegroundColor,
                                    borderColor: Global.Theme.Body.ControlBackground,
                                    paddingTop: 16,
                                    paddingBottom: 16,
                                    paddingLeft: 10,
                                    paddingRight: 60,
                                    opacity: .9,
                                }]} 
                                placeholder='Type a message...' 
                                placeholderTextColor={Global.Theme.Body.ForegroundFade} 
                                onChangeText={(text) => {
                                    Global.State[this.props.ModelID].ThreadMessageText = text;
                                    this.forceUpdate();
                                }}
                                value={Global.State[this.props.ModelID].ThreadMessageText} 
                                autoComplete={'off'} 
                                autoCorrect={true} 
                                multiline={true}
                                underlineColorAndroid='transparent' 
                                editable={true}
                            />
                        </View>
                        <Pressable style={({pressed}) => [{ position: 'absolute', right: 0, top: 0, bottom: 0, width: 50, backgroundColor: Global.Theme.Highlight.BackgroundColor, alignItems: 'center', justifyContent: 'center', borderRadius: 5, opacity: pressed ? .5 : (Global.WebSocket !== null && Global.WebSocket.readyState === 1 ? 1 : .5)}]} disabled={Global.WebSocket !== null && Global.WebSocket.readyState !== 1} onPress={() => {
                            try {
                                if (Global.StringHasContent(Global.State[this.props.ModelID].ThreadMessageText)) {
                                    let _Message = Global.State[this.props.ModelID].ThreadMessageText;
                                    Global.State[this.props.ModelID].ThreadMessageText = '';
                                    this.forceUpdate();
                                    this.SendMessage(_Message);
                                    this.ClearFocus();
                                } else {
                                    this.SuggesstResponse();
                                }
                            } catch (ex) {
                                global.Log({Message: 'ThreadForm.renderFooter.SendMessage>>' + ex.message});
                            }
                        }}>
                            <Image source={Global.StringHasContent(Global.State[this.props.ModelID].ThreadMessageText) ? IMG_Send_121212 : IMG_Robot_121212} style={{width: 28, height: 28}} />
                        </Pressable>
                    </View>
                    <Animated.View style={{paddingBottom: Global.State[this.props.ModelID].KeyboardHeight}}>
                    </Animated.View>
                </View>
            );
        } catch (ex) {
            global.Log({Message: 'ThreadForm.renderFooter>>' + ex.message});
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
            global.Log({Message: 'ThreadForm.renderSwipeBack>>' + ex.message});
        }
    };
};