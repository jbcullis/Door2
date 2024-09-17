import React, { Component } from 'react';
import {
    View,
    Text,
    Image,
    Keyboard,
    Linking,
    Pressable,
    Platform,
    TurboModuleRegistry,
} from 'react-native';
import ElementControl from '../controls/ElementControl.js';
module.exports = class AuthenticateForm extends Component {
    constructor(props) {
        super(props);
        this.Titlebar = null;
        this.state = {
            Refreshing: false
        };        
    };
    IsActive() {
        try {
            return Global.State.hasOwnProperty(this.props.ModelID) && Global.State[this.props.ModelID] !== null;
        } catch (ex) {
            global.Log({Message: 'AccountSearch.IsActive>>' + ex.message});
        }
    }; 
    async Show() {
        try {
            Global.State[this.props.ModelID] = {
                AuthEmail: null,
                AuthCode: null,
            }
            this.forceUpdate();
            global.root.ActiveHandler();
        } catch (ex) {
            Global.State[this.props.ModelID] = null;
            global.Log({Message: 'AuthenticateForm.Show>>' + ex.message, Notify: true});
        }
    };
    Hide() {
        try {
            if (Global.State[this.props.ModelID] !== null) {
                Global.State[this.props.ModelID] = null;
            }
        } catch (ex) {
            global.Log({Message: 'AuthenticateForm.Hide>>' + ex.message});
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
            global.Log({Message: 'AccountSearch.ClearFocus>>' + ex.message});
        }
    };

    async AuthInit(PersonEmail_Value) {
        try {
            this.ClearFocus();            
            global.root.NotificationModal.Show({ NotificationTitle: 'Signing In...', NotificationStyle: 'Wait' });

            //Sign challenge
            //let _Challenge = await TurboModuleRegistry.get('RNBiometrics').SignChallenge(SiteMesh.TokenPayload.PersonEmail, SiteMesh.TokenPayload.PersonEmail)

            await TokenHelper.Init({
                ServiceID: 'D20240917101835896S783452',
                PersonEmail: PersonEmail_Value,
                DeviceID: (Platform.OS === 'ios' ? await TurboModuleRegistry.get('NotificationModule').DeviceID() : null),
                ReleaseID: Global.VERSION,
            });
            Global.State[this.props.ModelID].AuthEmail = null;
            global.root.NotificationModal.Hide();
            this.forceUpdate();
        } catch (ex) {
            global.Log({Message: 'DashboardModal.AuthInit>>' + ex.message, Notify: true});
        }        
    };
    async AuthValidate() {
        try {
            if (Global.StringHasContent(Global.State[this.props.ModelID].AuthCode)) {
                
                //Validate auth code
                this.ClearFocus();
                global.root.NotificationModal.Show({ NotificationTitle: 'Authenticating...', NotificationStyle: 'Wait' });
                await TokenHelper.Auth({
                    Code: Global.State[this.props.ModelID].AuthCode,
                });

                //Enroll biometrics
                // if (Global.TokenPayload?.PersonEmail?.length > 0) {
                //     if (await TurboModuleRegistry.get('RNBiometrics').DeviceStatus() === 0) {
                //         await TokenHelper.Enroll(await TurboModuleRegistry.get('RNBiometrics').Enroll(Global.TokenPayload.PersonEmail));
                //     }    
                // }

                //Clear auth code
                Global.State[this.props.ModelID].AuthCode = null;
                global.root.NotificationModal.Hide();
                this.forceUpdate();

                //Show service list
                global.root.ChangeView('StatisticSearch');
                
            }
        } catch (ex) {
            global.Log({Message: 'AuthenticateForm.AuthValidate>>' + ex.message, Notify: true});
        }
    };
    async AuthDelete() {
        try {
            global.root.ConfirmModal.Show('Just Checking...', 'Are you sure you want to sign out?', 'Yes', 'No', 
            async () => {
                try {
                    global.root.NotificationModal.Show({ NotificationTitle: 'Signing Out...', NotificationStyle: 'Wait' });

                    Global.State[this.props.ModelID].AuthEmail = null;
                    Global.State[this.props.ModelID].AuthCode = null;
                    global.root.NotificationModal.Hide();
                    Global.SetToken(null);
                    this.forceUpdate();
                } catch (ex) {
                    global.Log({Message: 'AuthenticateForm.AuthDelete>>' + ex.message});
                    this.forceUpdate();
                }
            }, () => {
                //Cancel - Do Nothing
            });
        } catch (ex) {
            global.Log({Message: 'AuthenticateForm.AuthDelete>>' + ex.message});
        }
    };

    render() {
        try {
            if (this.IsActive()) {
                if (Global.TokenPayload !== null && Global.TokenPayload.hasOwnProperty('PersonEmail')) {
                    return (
                        <View style={{flex: 1}}>
                            <View style={{flex: 1}}></View>
                            <View style={{flex: 1, flexDirection: 'row', maxHeight: 188, justifyContent: 'center', paddingLeft: 10, paddingRight: 10}}>
                                <View style={{flex: 1, maxWidth: 500, backgroundColor: Global.Theme.Body.BackgroundColor, borderRadius: 4}}>
                                    <View style={[{height: 120, alignItems: 'center', justifyContent: 'center', flexDirection: 'row'}]}>
                                        <Image source={IMG_LOGO} style={{width: 250, height: 48, margin: 20}} />
                                        <Pressable 
                                            style={{position: 'absolute', right: 4, top: 4}}
                                            onPress={() => {
                                                let _Uri = 'https://www.sitemesh.com/privacy-policy';
                                                Linking.canOpenURL(_Uri).then(supported => {
                                                    if (supported) {
                                                        Linking.openURL(_Uri);
                                                    } else {
                                                        console.log('Don\'t know how to open URI: ' + this.props.url);
                                                    }
                                                });    
                                            }}
                                        >
                                            <View style={{width: 120, padding: 10}}>
                                                <Text style={{textAlign: 'right', fontSize: 12, color: Global.Theme.Header.ForegroundColor, fontWeight: 'bold'}}>Privacy Policy</Text>
                                                </View>
                                        </Pressable>
                                    </View>
                                    <View style={[{padding: 10, height: 68}]}>

                                        {/* Auth Email */}
                                        <View style={{flex: 1, flexDirection: 'row', height: 48, backgroundColor: Global.Theme.Element.BackgroundColor, borderRadius: 4}}>
                                            <ElementControl
                                                Name={'Auth Code'}
                                                Value={Global.State[this.props.ModelID].AuthCode}
                                                KeyboardType={Platform.OS === 'ios' || Platform.OS === 'android' ? 'number-pad' : 'default'}
                                                Changed={(Text_Value) => {
                                                    Global.State[this.props.ModelID].AuthCode = Text_Value;
                                                    this.forceUpdate();
                                                }}
                                                OnEnter={async () => {
                                                    this.AuthValidate();
                                                }}
                                                Casing={'lower'}
                                                RadiusTopRight={0}
                                                RadiusBottomRight={0}
                                                Editable={Global.State[this.props.ModelID].ActiveWindow}
                                            />
                                            <View style={{width: 1, backgroundColor: Global.Theme.Body.BackgroundFade, marginTop: 4, marginBottom: 4}}></View>
                                            <Pressable
                                            onPress={() => {
                                                this.AuthValidate();
                                            }}
                                            style={({pressed}) => [{width: 50, height: 48, alignItems: 'center', justifyContent: 'center', opacity: pressed ? .7 : 1}]}>
                                                <Image source={Global.Theme.Body.Icons.Forward} style={{width: 20, height: 20}} />
                                            </Pressable>
                                        </View>

                                    </View>
                                </View>                            
                            </View>
                            <View style={{flex: 1}}></View>
                        </View>
                    );                    
                } else {
                    return (
                        <View style={{flex: 1}}>
                            <View style={{flex: 1}}></View>
                            <View style={{flex: 1, flexDirection: 'row', maxHeight: 188, justifyContent: 'center', paddingLeft: 10, paddingRight: 10}}>
                                <View style={{flex: 1, maxWidth: 500, backgroundColor: Global.Theme.Body.BackgroundColor, borderRadius: 4}}>
                                    <View style={[{flexDirection: 'row', height: 120, alignItems: 'center', justifyContent: 'center', flexDirection: 'row'}]}>
                                        <Image source={IMG_LOGO} style={{width: 250, height: 48}} />
                                        <Pressable 
                                            style={{position: 'absolute', right: 4, top: 4}}
                                            onPress={() => {
                                                let _Uri = 'https://www.sitemesh.com/privacy-policy';
                                                Linking.canOpenURL(_Uri).then(supported => {
                                                    if (supported) {
                                                        Linking.openURL(_Uri);
                                                    } else {
                                                        console.log('Don\'t know how to open URI: ' + this.props.url);
                                                    }
                                                });    
                                            }}
                                        >
                                            <View style={{width: 120, padding: 10}}>
                                                <Text style={{textAlign: 'right', fontSize: 12, color: Global.Theme.Header.ForegroundColor, fontWeight: 'bold'}}>Privacy Policy</Text>
                                                </View>
                                        </Pressable>
                                    </View>
                                    <View style={[{padding: 10, height: 68}]}>

                                        {/* Auth Email */}
                                        <View style={{flex: 1, flexDirection: 'row', height: 48, backgroundColor: Global.Theme.Element.BackgroundColor, borderRadius: 4}}>
                                            <ElementControl
                                                Name={'Email Address'}
                                                Value={Global.State[this.props.ModelID].AuthEmail}
                                                Changed={(Text_Value) => {
                                                    Global.State[this.props.ModelID].AuthEmail = Text_Value;
                                                    this.forceUpdate();
                                                }}
                                                OnEnter={() => {
                                                    this.AuthInit(Global.State[this.props.ModelID].AuthEmail);
                                                }}
                                                Casing={'lower'}
                                                KeyboardType={'email-address'}
                                                KeyboardAutocomplete={'email'}
                                                Autocorrect={false}
                                                SpellCheck={false}
                                                RadiusTopRight={0}
                                                RadiusBottomRight={0}
                                                Editable={Global.State[this.props.ModelID].ActiveWindow}
                                            />
                                            <View style={{width: 1, backgroundColor: Global.Theme.Body.BackgroundFade, marginTop: 4, marginBottom: 4}}></View>
                                            <Pressable
                                            onPress={() => {
                                                this.AuthInit(Global.State[this.props.ModelID].AuthEmail);
                                            }}
                                            style={({pressed}) => [{width: 50, height: 48, alignItems: 'center', justifyContent: 'center', opacity: pressed ? .7 : 1}]}>
                                                <Image source={Global.Theme.Body.Icons.Forward} style={{width: 20, height: 20}} />
                                            </Pressable>
                                        </View>

                                    </View>
                                </View>                            
                            </View>
                            <View style={{flex: 1}}></View>
                        </View>
                    );
                }
            } else {
                return (
                    <View></View>
                )
            }
        } catch (ex) {
            global.Log({Message: 'AuthenticateForm.render>>' + ex.message});
        }
    };
};