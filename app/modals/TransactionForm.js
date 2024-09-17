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
module.exports = class TransactionForm extends Component {
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
            global.Log({Message: 'TransactionForm.IsActive>>' + ex.message});
        }
    };
    async Show(Params_Value) {
        try {
            global.root.NotificationModal.Show({ NotificationTitle: 'Loading...', NotificationStyle: 'Wait' });

            let _ViewWidth = Global.ScreenX > 600 ? 600 : Global.ScreenX;

            let _PageTitle = '';
            if (Global.StringHasContent(Params_Value.TransactionID)) {
                _PageTitle = 'EDIT TRANSACTION';
            } else {
                _PageTitle = 'NEW TRANSACTION';
            }  
    
            let _Transaction = null;
            if (Global.StringHasContent(Params_Value.TransactionID)) {
                _Transaction = await TransactionHelper.GetOne({TransactionID: Params_Value.TransactionID});
            } else {
                _Transaction = TransactionHelper.Clone({
                    TransactionDate: new Date(),
                    TransactionExchange: 1,
                    TransactionPaymentType: 'unpaid',
                });
            }

            //Load initial model - force update before flyout
            Global.State[this.props.ModelID] = {
                PageTitle: _PageTitle,
                Transaction: TransactionHelper.Clone(_Transaction),
                TransactionSnapshot: TransactionHelper.Clone(_Transaction),
                SaveCallback: Params_Value.hasOwnProperty('SaveCallback') ? Params_Value.SaveCallback : null,
                DeleteCallback: Params_Value.hasOwnProperty('DeleteCallback') ? Params_Value.DeleteCallback : null,
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
            global.Log({Message: 'TransactionForm.Show>>' + ex.message, Data: Transaction_Value, Notify: true});
        }
    };
    CheckDirty() {
        try {
            let _IsDirty = (JSON.stringify(Global.State[this.props.ModelID].TransactionSnapshot).trim() !== JSON.stringify(Global.State[this.props.ModelID].Transaction).trim());
            if (_IsDirty !== Global.State[this.props.ModelID].TransactionDirty) {
                Global.State[this.props.ModelID].TransactionDirty = _IsDirty;
                if (Global.State[this.props.ModelID] !== null && Global.State[this.props.ModelID].FooterOffset !== null) {
                    if (Global.State[this.props.ModelID].TransactionDirty) {
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
            global.Log({Message: 'TransactionForm.CheckDirty>>' + ex.message});
        }
    };
    UpdatePricing(TransactionItem_Value, CalculateBy_Value) {
        try {

            //Update item price
            TransactionItem_Value.TransactionItemSubtotal = parseFloat(TransactionItem_Value.TransactionItemQuantity * TransactionItem_Value.TransactionItemPrice);
            TransactionItem_Value.TransactionItemTax = TransactionItem_Value.TransactionItemSubtotal * (TransactionItem_Value.TransactionItemTaxRate / 100);
            TransactionItem_Value.TransactionItemTotal = TransactionItem_Value.TransactionItemSubtotal + TransactionItem_Value.TransactionItemTax;    

            //Calculate sum of transaction item subtal
            let _TransactionSubtotal = 0;
            let _TransactionTax = 0;
            for (let _TransactionItemIndex = 0; _TransactionItemIndex < Global.State[this.props.ModelID].Transaction.TransactionItemList.length; _TransactionItemIndex++) {            
                _TransactionSubtotal += parseFloat(Global.State[this.props.ModelID].Transaction.TransactionItemList[_TransactionItemIndex].TransactionItemSubtotal);
                _TransactionTax += parseFloat(Global.State[this.props.ModelID].Transaction.TransactionItemList[_TransactionItemIndex].TransactionItemTax);
            }

            //Update order subtotal
            Global.State[this.props.ModelID].Transaction.TransactionSubtotal = _TransactionSubtotal;
            Global.State[this.props.ModelID].Transaction.TransactionTax = _TransactionTax;
            Global.State[this.props.ModelID].Transaction.TransactionTotal = _TransactionSubtotal + _TransactionTax;
            this.CheckDirty();            


        } catch (ex) {
            global.Log({Message: 'TransactionForm.UpdatePricing>>' + ex.message});
        }
    };
    TakePhoto() {
        try {
            launchCamera({
                mediaType: 'Photo',
                includeBase64: true,
                maxWidth: 1200,
                maxHeight: 1200
            }, async (Response_Value) => {
                try {
                    if (Response_Value !== null 
                    && !Response_Value.hasOwnProperty('didCancel')
                    && Response_Value.hasOwnProperty('assets')) {
                        let _Media = MediaHelper.Clone(null);
                        _Media.MediaType = 60;
                        _Media.MediaDescription = Response_Value.assets[0].fileName;
                        _Media.MediaFile = Response_Value.assets[0].base64;
                        _Media.MediaSize = Response_Value.assets[0].fileSize
                        MediaHelper.ValidateDataType(_Media);
                        if (Global.State[this.props.ModelID].Transaction.TransactionMediaList === null) { Global.State[this.props.ModelID].Transaction.TransactionMediaList = []; }
                        Global.State[this.props.ModelID].Transaction.TransactionMediaList.push(_Media);
                        global.root.NotificationModal.Hide();
                        this.CheckDirty();
                    } else {
                        global.root.NotificationModal.Hide();
                        this.forceUpdate();
                    }
                } catch (ex) {
                    global.Log({Message: 'TransactionForm.TakePhoto>>' + ex.message, Notify: true});
                }
            });
        } catch (ex) {
            global.Log({Message: 'TransactionForm.TakePhoto>>' + ex.message, Notify: true});
        }
    };
    async CreateTransactionMedia() {
        try {
            if (Platform.OS === 'macos' || Platform.OS === 'windows') {
                let _Response = await TurboModuleRegistry.get('Upload').Upload(1200, 1200);
                if (_Response !== null) {
                    let _Media = MediaHelper.Clone(null);
                    _Media.MediaType = 60;
                    _Media.MediaDescription = _Response.fileName;
                    _Media.MediaFile = _Response.base64;
                    _Media.MediaSize = parseInt(_Response.fileSize / 4 * 3)
                    MediaHelper.ValidateDataType(_Media);
                    if (Global.State[this.props.ModelID].Transaction.TransactionMediaList === null) { Global.State[this.props.ModelID].Transaction.TransactionMediaList = []; }
                    Global.State[this.props.ModelID].Transaction.TransactionMediaList.push(_Media);
                    global.root.NotificationModal.Hide();
                    this.CheckDirty();
                }
            } else {
                let _Request = {
                    mediaType: 'Photo',
                    includeBase64: true,
                    maxWidth: 1200,
                    maxHeight: 1200
                }
                global.root.PickerModal.Show([
                    { Text: 'Take Photo', Value: 'Take Photo' },
                    { Text: 'Pick Photo', Value: 'Pick Photo' }
                ], false, async (Selected_Value) => {
                    if (Selected_Value === 'Take Photo') {
                        global.root.NotificationModal.Show({ NotificationTitle: 'Loading...', NotificationStyle: 'Wait' });
                        if (Platform.OS === 'ios') {
                            await this.TakePhoto();
                        } else if (Platform.OS === 'android') {
                            PermissionsAndroid.request(PermissionsAndroid.PERMISSIONS.CAMERA, null).then((Permission_Value) => {
                                if (Permission_Value === PermissionsAndroid.RESULTS.GRANTED) {
                                    this.TakePhoto();
                                } else {
                                    global.root.NotificationModal.Hide();
                                }
                            });
                        }
                    } else if (Selected_Value === 'Pick Photo') {
                        global.root.NotificationModal.Show({ NotificationTitle: 'Loading...', NotificationStyle: 'Wait' });
                        launchImageLibrary(_Request, async (Response_Value) => {
                            if (Response_Value !== null 
                                && !Response_Value.hasOwnProperty('didCancel')
                                && Response_Value.hasOwnProperty('assets')) {
                                    let _Media = MediaHelper.Clone(null);
                                    _Media.MediaType = 60;
                                    _Media.MediaDescription = Response_Value.assets[0].fileName;
                                    _Media.MediaFile = Response_Value.assets[0].base64;
                                    _Media.MediaSize = Response_Value.assets[0].fileSize
                                    MediaHelper.ValidateDataType(_Media);
                                    if (Global.State[this.props.ModelID].Transaction.TransactionMediaList === null) { Global.State[this.props.ModelID].Transaction.TransactionMediaList = []; }
                                    Global.State[this.props.ModelID].Transaction.TransactionMediaList.push(_Media);
                                    global.root.NotificationModal.Hide();
                                    this.CheckDirty();
                                } else {
                                    global.root.NotificationModal.Hide();
                                    this.forceUpdate();
                                }
                        });
                    }
                });
            }
        } catch (ex) {
            global.Log({Message: 'TransactionForm.CreateTransactionMedia>>' + ex.message, Notify: true});
        }
    };
    DeleteTransactionMedia(Media_Value) {
        global.root.ConfirmModal.Show('Just Checking...', 'Are you sure you want to delete the attachment?', 'Yes', 'No', 
        () => {
            if (Global.State[this.props.ModelID].Transaction.TransactionMediaList !== null) {
                for (i = 0; i < Global.State[this.props.ModelID].Transaction.TransactionMediaList.length; i++) {
                    if (Global.State[this.props.ModelID].Transaction.TransactionMediaList[i].MediaID === Media_Value.MediaID) {
                        Global.State[this.props.ModelID].Transaction.TransactionMediaList.splice(i, 1);
                        {break}
                    };
                }
                for (i = 0; i < Global.State[this.props.ModelID].Transaction.TransactionMediaList.length; i++) {
                    Global.State[this.props.ModelID].Transaction.TransactionMediaList[i].MediaID = parseInt(i + 1);
                }
                this.CheckDirty();
            };
        }, () => {
            //Cancel - Do Nothing
        });
    };
    DeleteTransactionItem(transactionitem) {
        try {
            global.root.ConfirmModal.Show('Just Checking...', 'Are you sure you want to delete ' + transactionitem.TransactionItemDescription + '?', 'Yes', 'No', () => {
                if (Global.State[this.props.ModelID].Transaction.TransactionItemList !== null) {
                    for (let _TransactionItemIndex = 0; _TransactionItemIndex < Global.State[this.props.ModelID].Transaction.TransactionItemList.length; _TransactionItemIndex++) {
                        if (Global.State[this.props.ModelID].Transaction.TransactionItemList[_TransactionItemIndex].TransactionItemID === transactionitem.TransactionItemID) {
                            Global.State[this.props.ModelID].Transaction.TransactionItemList.splice(_TransactionItemIndex, 1);
                            {break}
                        }
                    }
                    this.CheckDirty();
                };
            }, () => {
                //Cancel - Do Nothing
            });
        } catch (ex) {
            global.Log({Message: 'TransactionForm.CreateTransactionMedia>>' + ex.message, Notify: true});
        }
    };
    async SaveTransaction() {
        try {
            this.ClearFocus();
            setTimeout(async () => {
                try {

                    global.root.NotificationModal.Show({ NotificationTitle: 'Saving...', NotificationStyle: 'Wait' });
                    let _Transaction = TransactionHelper.Clone(Global.State[this.props.ModelID].Transaction);
                    
                    //Save the transaction
                    _Transaction = await TransactionHelper.Save(_Transaction);
                    if (_Transaction !== null) {
                        Global.State[this.props.ModelID].Transaction = TransactionHelper.Clone(_Transaction);
                        Global.State[this.props.ModelID].TransactionSnapshot = TransactionHelper.Clone(_Transaction);
                        this.CheckDirty();
        
                        //Run callbacks
                        if (Global.State[this.props.ModelID].SaveCallback !== null) {
                            Global.State[this.props.ModelID].SaveCallback(TransactionHelper.Clone(_Transaction));
                        }
        
                        global.root.NotificationModal.Hide();
                    } else {
                        global.root.NotificationModal.Hide();
                        this.Hide();
                    }

                } catch (ex) {
                    global.Log({Message: 'TransactionForm.SaveTransaction>>' + ex.message, Notify: true});
                }
            }, Platform.OS === 'macos' || Platform.OS === 'windows' ? 50 : 1);
        } catch (ex) {
            global.Log({Message: 'TransactionForm.SaveTransaction>>' + ex.message, Notify: true});
        }
    };
    CancelTransaction() {
        try {
            Global.State[this.props.ModelID].Transaction = TransactionHelper.Clone(Global.State[this.props.ModelID].TransactionSnapshot);
            this.CheckDirty();
        } catch (ex) {

        }
    };
    DeleteTransaction() {
        try {
            global.root.ConfirmModal.Show('Just Checking...', 'Are you sure you want to delete this transaction?', 'Yes', 'No', async () => {
                try {
                    if (Global.State[this.props.ModelID].Transaction !== null && Global.StringHasContent(Global.State[this.props.ModelID].Transaction.TransactionID)) {
                        await global.root.NotificationModal.Show({ NotificationTitle: 'Deleting...', NotificationStyle: 'Wait' });
                        await TransactionHelper.Delete({TransactionID: Global.State[this.props.ModelID].Transaction.TransactionID});

                        //Run callbacks
                        if (Global.State[this.props.ModelID].DeleteCallback !== null) {
                            Global.State[this.props.ModelID].DeleteCallback(Global.State[this.props.ModelID].Transaction);
                        }

                        global.root.NotificationModal.Hide();
                        this.Hide();
                    } else {
                        this.Hide();
                    }
                } catch (ex) {
                    global.Log({Message: 'TransactionForm.DeleteTransaction>>' + ex.message, Notify: true});
                }
            }, () => {
                //Cancel - Do Nothing
            });
        } catch (ex) {

        }
    };
    async EmailTransaction() {
        try {
            global.root.ConfirmModal.Show('Just Checking...', 'Are you sure you want to email this transaction?', 'Yes', 'No', async () => {
                try {
                    await global.root.NotificationModal.Show({ NotificationTitle: 'Sending...', NotificationStyle: 'Wait' });
                    await TransactionHelper.EmailOne({TransactionID: Global.State[this.props.ModelID].Transaction.TransactionID});
                    global.root.NotificationModal.Hide();
                } catch (ex) {
                    global.Log({Message: 'TransactionForm.EmailTransaction>>' + ex.message, Notify: true});
                }
            }, () => {
                //Cancel - Do Nothing
            });
        } catch (ex) {
            global.Log({Message: 'TransactionForm.EmailTransaction>>' + ex.message, Notify: true});
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
            global.Log({Message: 'TransactionForm.ActiveHandler>>' + ex.message});
        }
    };
    BackHandler() {
        try {
            if (Global.State[this.props.ModelID].TransactionDirty) {
                global.root.ConfirmModal.Show('Just Checking...', 'You have unsaved changes, close anyway?', 'Yes', 'No', () => {
                    this.Hide();
                }, () => {
                    //Cancel - Do Nothing
                });
            } else {
                this.Hide();
            }
        } catch (ex) {
            global.Log({Message: 'TransactionForm.BackHandler>>' + ex.message});
        }
    };
    ShortcutHandler(Shortcut_Value) {
        try {
            //Do Nothing
        } catch (ex) {
            global.Log({Message: 'TransactionForm.ShortcutHandler>>' + ex.message});
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
            global.Log({Message: 'TransactionForm.Hide>>' + ex.message, Notify: true});
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
            global.Log({Message: 'TransactionForm.ClearFocus>>' + ex.message});
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
                        <AccountForm ref={ele => this.AccountForm = ele} ModelID={this.props.ModelID + '_MQ5WN7SM'} />
                        <PersonForm ref={ele => this.PersonForm = ele} ModelID={this.props.ModelID + '_BRE5PX1R'} />
                    </View>
                );
            } else {
                return (<View></View>);
            }
        } catch (ex) {
            global.Log({Message: 'TransactionForm.render>>' + ex.message});
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
                        <View style={{flex: 1, justifyContent: 'center'}}>
                            <Text style={{fontSize: 20, fontWeight: 'bold', color: (global.ColorScheme === 'dark' ? '#eeeeee' : '#121212')}}>{Global.State[this.props.ModelID].PageTitle}</Text>
                        </View>
                        <Pressable
                            onPress={() => this.EmailTransaction()}
                            style={({pressed}) => [{width: 50, height: 50, alignItems: 'center', justifyContent: 'center', opacity: pressed ? .5 : 1}]}
                        >
                            <Image source={global.ColorScheme === 'dark' ? IMG_Email_eeeeee : IMG_Email_121212} style={{width: 24, height: 24}} />
                        </Pressable>
                        <Pressable
                            onPress={() => this.DeleteTransaction()}
                            style={({pressed}) => [{width: 50, height: 50, alignItems: 'center', justifyContent: 'center', opacity: pressed ? .5 : 1}]}
                        >
                            <Image source={global.ColorScheme === 'dark' ? IMG_Trash_eeeeee : IMG_Trash_121212} style={{width: 24, height: 24}} />
                        </Pressable>
                    </View>
                </Pressable>             
            );
        } catch (ex) {
            global.Log({Message: 'TransactionForm.renderHeader>>' + ex.message});
        }
    };
    renderBody() {
        try {
            let _Today = new Date();
            let _TransactionDate = new Date(Global.State[this.props.ModelID].Transaction.TransactionDate);
            let _PaymentDate = Global.State[this.props.ModelID].Transaction.TransactionPaymentDate !== null ? new Date(Global.State[this.props.ModelID].Transaction.TransactionPaymentDate) : null;
            let _RefundDate = Global.State[this.props.ModelID].Transaction.TransactionRefundDate !== null ? new Date(Global.State[this.props.ModelID].Transaction.TransactionRefundDate) : null;
            return (
                <ScrollView style={{backgroundColor: Global.Theme.Body.BackgroundColor}}>

                    {/* Transaction Details */}
                    <View style={{flex: 1, padding: 10}}>

                        {/* Transaction Number / Transaction Date */}
                        <View style={{flex: 1, flexDirection: 'row', marginTop: 10}}>
                            <ElementControl
                                Name={'Number'}
                                Value={Global.State[this.props.ModelID].Transaction.TransactionNumber}
                                Changed={(Text_Value) => {
                                    Global.State[this.props.ModelID].Transaction.TransactionNumber = Text_Value;
                                    this.CheckDirty();
                                }}
                                Editable={Global.State[this.props.ModelID].ActiveWindow}
                            />
                            <View style={{width: 8}}></View>
                            <ElementControl
                                Name={'Date'}
                                Value={Global.FormatShortDate(_TransactionDate.getFullYear(), parseInt(_TransactionDate.getMonth() + 1), _TransactionDate.getDate())}
                                Pressed={() => {
                                    global.root.CalendarModal.Show({
                                        SelectedYear: _TransactionDate.getFullYear(),
                                        SelectedMonth: parseInt(_TransactionDate.getMonth() + 1),
                                        SelectedDay: _TransactionDate.getDate(),
                                        MaximumYear: _Today.getFullYear(),
                                        MaximumMonth: parseInt(_Today.getMonth() + 1),
                                        MaximumDay: _Today.getDate(),
                                        Callback: (SelectedYear_Value, SelectedMonth_Value, SelectedDay_Value) => {
                                            Global.State[this.props.ModelID].Transaction.TransactionDate = new Date(SelectedYear_Value, parseInt(SelectedMonth_Value - 1), SelectedDay_Value);
                                            this.CheckDirty();
                                        }
                                    });
                                }}
                                Editable={Global.State[this.props.ModelID].ActiveWindow}
                            />
                        </View>

                        {/* Transaction Account */}
                        <View style={{flexDirection: 'row', marginTop: 10}}>
                            <View style={{position: 'absolute', top: 0, bottom: 0, left: 0, right: 0, backgroundColor: Global.Theme.Element.BackgroundColor, borderRadius: 4}}></View>
                            <ElementControl
                                Name={'Account'}
                                Value={Global.State[this.props.ModelID].Transaction.TransactionAccount !== null ? Global.State[this.props.ModelID].Transaction.TransactionAccount.AccountName : null}
                                ValueType={'Autocomplete'}
                                Autocomplete={(Selected_Value) => {
                                    if (Selected_Value.Match !== null) {
                                        Global.State[this.props.ModelID].Transaction.TransactionAccount = Selected_Value.Match;
                                        Global.State[this.props.ModelID].Transaction.TransactionCurrency = Global.State[this.props.ModelID].Transaction.TransactionAccount.AccountCurrency;
                                    }
                                    this.CheckDirty();
                                }}
                                AutocompleteSource={'ACCOUNTS'}
                                RadiusTopRight={0}
                                RadiusBottomRight={0}
                                Casing={'upper'}
                                BackgroundColor={'transparent'}
                                SpellCheck={false}
                                Editable={Global.State[this.props.ModelID].ActiveWindow}
                                Enabled={true}
                                Visible={true}
                            />
                            <View style={{width: 1, backgroundColor: Global.Theme.Body.BackgroundFade, marginTop: 4, marginBottom: 4}}></View>
                            <Pressable
                                style={({pressed}) => [{width: 50, height: 50, alignItems: 'center', justifyContent: 'center', opacity: pressed ? .7 : 1}]}
                                onPress={() => {
                                    this.AccountForm.Show({
                                        AccountID: Global.State[this.props.ModelID].Transaction.TransactionAccount.AccountID,
                                        SaveCallback: null,
                                        DeleteCallback: null
                                    })
                                }}
                            >
                                <Image source={Global.Theme.Body.Icons.Forward} style={{width: 20, height: 20}} />
                            </Pressable>
                        </View>

                        {/* Transaction Person */}
                        <View style={{flex: 1, flexDirection: 'row', marginTop: 10}}>
                            <View style={{position: 'absolute', top: 0, bottom: 0, left: 0, right: 0, backgroundColor: Global.Theme.Element.BackgroundColor, borderRadius: 4}}></View>
                            <ElementControl
                                Name={'Person'}
                                Value={Global.State[this.props.ModelID].Transaction.TransactionPerson !== null ? Global.State[this.props.ModelID].Transaction.TransactionPerson.PersonName : null}
                                ValueType={'Autocomplete'}
                                Autocomplete={(Selected_Value) => {
                                    if (Selected_Value.Match !== null) {
                                        Global.State[this.props.ModelID].Transaction.TransactionPerson = Selected_Value.Match;
                                    }
                                    this.CheckDirty();
                                }}
                                AutocompleteSource={'PEOPLE'}
                                RadiusTopRight={0}
                                RadiusBottomRight={0}
                                Casing={'upper'}
                                BackgroundColor={'transparent'}
                                SpellCheck={false}
                                Editable={Global.State[this.props.ModelID].ActiveWindow}
                                Enabled={true}
                                Visible={true}
                            />
                            <View style={{width: 1, backgroundColor: Global.Theme.Body.BackgroundFade, marginTop: 4, marginBottom: 4}}></View>
                            <Pressable
                                style={({pressed}) => [{width: 50, height: 50, alignItems: 'center', justifyContent: 'center', opacity: pressed ? .7 : 1}]}
                                onPress={() => {
                                    this.PersonForm.Show({
                                        PersonID: Global.State[this.props.ModelID].Transaction.TransactionPerson.PersonID,
                                        SaveCallback: null,
                                        DeleteCallback: null
                                    })
                                }}
                            >
                                <Image source={Global.Theme.Body.Icons.Forward} style={{width: 20, height: 20}} />
                            </Pressable>
                        </View>                       

                        {/* Transaction Reference */}
                        <ElementControl
                            Name={'Reference'}
                            Value={Global.State[this.props.ModelID].Transaction.TransactionReference}
                            MarginTop={10}
                            Changed={(Text_Value) => {
                                Global.State[this.props.ModelID].Transaction.TransactionReference = Text_Value;
                                this.CheckDirty();
                            }}
                            Editable={Global.State[this.props.ModelID].ActiveWindow}
                        />

                        {/* Transaction Subtotal / Currency */}
                        <View style={{flex: 1, flexDirection: 'row', marginTop: 10}}>
                            <ElementControl
                                Name={'Subtotal'}
                                Value={Global.State[this.props.ModelID].Transaction.TransactionSubtotal}
                                ValueType={'Decimal2'}
                                Prefix={'$'}
                                Enabled={false}
                            />
                            <View style={{width: 19}}></View>
                            <ElementControl
                                Name={'Currency'}
                                Value={Global.State[this.props.ModelID].Transaction.TransactionCurrency !== null ? Global.State[this.props.ModelID].Transaction.TransactionCurrency.toUpperCase() : null}
                                Pressed={() => {
                                    global.root.PickerModal.Show([
                                        {Value: 'aud', Text: 'AUD'},
                                        {Value: 'cad', Text: 'CAD'},
                                        {Value: 'nzd', Text: 'NZD'},
                                        {Value: 'usd', Text: 'USD'}
                                    ], false, (Selected_Value) => {
                                        if (Selected_Value !== null) { Global.State[this.props.ModelID].Transaction.TransactionCurrency = Selected_Value; }
                                        this.CheckDirty();
                                    }, () => {
                                        //Cancel - Do Nothing
                                    });
                                }}
                                Editable={Global.State[this.props.ModelID].ActiveWindow}
                            />
                        </View>

                        {/* Transaction Tax / Tax Rate */}
                        <View style={{flex: 1, flexDirection: 'row', marginTop: 10}}>
                            <ElementControl
                                Name={'Tax'}
                                Value={Global.State[this.props.ModelID].Transaction.TransactionTax}
                                ValueType={'Decimal2'}
                                Prefix={'$'}
                                Enabled={false}
                            />
                            <View style={{width: 10}}></View>
                            <ElementControl
                                Name={'Exchange Rate'}
                                Value={Global.State[this.props.ModelID].Transaction.TransactionExchange.toString()}
                                ValueType={'Decimal4'}
                                Changed={(Text_Value) => {
                                    Global.State[this.props.ModelID].Transaction.TransactionExchange = parseFloat(Text_Value);
                                    this.CheckDirty();
                                }}
                                Editable={Global.State[this.props.ModelID].ActiveWindow}
                            />
                        </View>

                        {/* Transaction Total */}
                        <View style={{flex: 1, flexDirection: 'row', marginTop: 10}}>
                            <ElementControl
                                Name={'Total'}
                                Value={Global.State[this.props.ModelID].Transaction.TransactionTotal}
                                ValueType={'Decimal2'}
                                Prefix={'$'}
                                Enabled={false}
                            />
                            <View style={{width: 10}}></View>
                            <ElementControl
                                Name={'Payment Reference'}
                                Value={Global.State[this.props.ModelID].Transaction.TransactionPaymentReference}
                                Changed={(Text_Value) => {
                                    Global.State[this.props.ModelID].Transaction.TransactionPaymentReference = Text_Value;
                                    this.CheckDirty();
                                }}
                                Editable={Global.State[this.props.ModelID].ActiveWindow}
                                Enabled={Global.State[this.props.ModelID].Transaction.TransactionPaymentType !== 'unpaid'}
                            />
                        </View>

                        {/* Transaction Payment Type / Payment Date */}
                        <View style={{flex: 1, flexDirection: 'row', marginTop: 10}}>
                            <ElementControl
                                Name={'Payment'}
                                Value={Global.State[this.props.ModelID].Transaction.TransactionPaymentType !== null ? Global.State[this.props.ModelID].Transaction.TransactionPaymentType.charAt(0).toUpperCase() + Global.State[this.props.ModelID].Transaction.TransactionPaymentType.slice(1) : null}
                                Pressed={() => {
                                    global.root.PickerModal.Show([
                                        {Value: 'unpaid', Text: 'Unpaid'},
                                        {Value: 'card', Text: 'Card'},
                                        {Value: 'cash', Text: 'Cash'},
                                        {Value: 'check', Text: 'Check'},
                                    ], false, (Selected_Value) => {
                                        if (Selected_Value !== null) {
                                            Global.State[this.props.ModelID].Transaction.TransactionPaymentType = Selected_Value;
                                            if (Global.State[this.props.ModelID].Transaction.TransactionPaymentType === 'unpaid') {
                                                Global.State[this.props.ModelID].Transaction.TransactionPaymentDate = null;
                                                Global.State[this.props.ModelID].Transaction.TransactionRefundDate = null;
                                                Global.State[this.props.ModelID].Transaction.TransactionRefundAmount = null;
                                            } else {
                                                Global.State[this.props.ModelID].Transaction.TransactionPaymentDate = new Date(Global.State[this.props.ModelID].Transaction.TransactionDate);
                                            }
                                            this.CheckDirty();
                                        }
                                    }, () => {
                                        //Cancel - Do Nothing
                                    });
                                }}
                                Editable={Global.State[this.props.ModelID].ActiveWindow}
                            />
                            <View style={{width: 10}}></View>
                            <ElementControl
                                Name={'Paid On'}
                                Value={_PaymentDate !== null ? Global.FormatShortDate(_PaymentDate.getFullYear(), parseInt(_PaymentDate.getMonth() + 1), _PaymentDate.getDate()) : null}
                                Pressed={() => {
                                    global.root.CalendarModal.Show({
                                        MinimumYear: _TransactionDate.getFullYear(),
                                        MinimumMonth: parseInt(_TransactionDate.getMonth() + 1),
                                        MinimumDay: _TransactionDate.getDate(),
                                        SelectedYear: _TransactionDate.getFullYear(),
                                        SelectedMonth: parseInt(_TransactionDate.getMonth() + 1),
                                        SelectedDay: _TransactionDate.getDate(),
                                        Callback: (SelectedYear_Value, SelectedMonth_Value, SelectedDay_Value) => {
                                            Global.State[this.props.ModelID].Transaction.TransactionPaymentDate = new Date(SelectedYear_Value, parseInt(SelectedMonth_Value - 1), SelectedDay_Value);
                                            this.CheckDirty();
                                        }
                                    });
                                }}
                                Editable={Global.State[this.props.ModelID].ActiveWindow}
                                Enabled={Global.State[this.props.ModelID].Transaction.TransactionPaymentType !== 'unpaid'}
                            />
                        </View>

                        <View style={{flex: 1, flexDirection: 'row', marginTop: 10}}>
                            <ElementControl
                                Name={'Refund Date'}
                                Value={_RefundDate !== null ? Global.FormatShortDate(_RefundDate.getFullYear(), parseInt(_RefundDate.getMonth() + 1), _RefundDate.getDate()) : null}
                                Pressed={() => {
                                    global.root.CalendarModal.Show({
                                        MinimumYear: _PaymentDate.getFullYear(),
                                        MinimumMonth: parseInt(_PaymentDate.getMonth() + 1),
                                        MinimumDay: _PaymentDate.getDate(),
                                        SelectedYear: _PaymentDate.getFullYear(),
                                        SelectedMonth: parseInt(_PaymentDate.getMonth() + 1),
                                        SelectedDay: _PaymentDate.getDate(),
                                        Callback: (SelectedYear_Value, SelectedMonth_Value, SelectedDay_Value) => {
                                            Global.State[this.props.ModelID].Transaction.TransactionRefundDate = new Date(SelectedYear_Value, parseInt(SelectedMonth_Value - 1), SelectedDay_Value);
                                            Global.State[this.props.ModelID].Transaction.TransactionRefundAmount = Global.State[this.props.ModelID].Transaction.TransactionTotal;
                                            this.CheckDirty();
                                        }
                                    });
                                }}
                                Editable={Global.State[this.props.ModelID].ActiveWindow}
                                Enabled={Global.State[this.props.ModelID].Transaction.TransactionPaymentType !== 'unpaid'}
                            />
                            <View style={{width: 10}}></View>
                            <ElementControl
                                Name={'Refund Amount'}
                                Value={_RefundDate !== null && Global.State[this.props.ModelID].Transaction.TransactionRefundAmount !== null ? Global.State[this.props.ModelID].Transaction.TransactionRefundAmount.toString() : null}
                                ValueType={'Decimal2'}
                                Changed={(Text_Value) => {
                                    Global.State[this.props.ModelID].Transaction.TransactionRefundAmount = parseFloat(Text_Value);
                                    this.CheckDirty();
                                }}                                
                                Prefix={'$'}
                                Editable={Global.State[this.props.ModelID].ActiveWindow}
                                Enabled={Global.State[this.props.ModelID].Transaction.TransactionPaymentType !== 'unpaid' && _RefundDate !== null}
                            />
                        </View>

                    </View>

                    {/* Transaction Attachments */}
                    {/* <View style={Styles.form_container}>
                        {this.renderTransactionMediaHeader()}
                        {this.renderTransactionMediaList()}
                    </View> */}

                    {/* Transaction Items */}
                    {this.renderTransactionItemList()}

                    {/* Bottom Padding */}
                    <View style={{height: Global.InsetBottom + 20}}></View>
                    <View style={{height: Global.State[this.props.ModelID].ScrollPadding}}></View>
                    <Animated.View key={'Footer_Padding'} style={{position: 'relative', backgroundColor: 'transparent', height: Global.State[this.props.ModelID].FooterPadding}}>
                    </Animated.View>

                </ScrollView>   
            );
        } catch (ex) {
            global.Log({Message: 'TransactionForm.renderBody>>' + ex.message});
        }
    };
    renderTransactionMediaHeader() {
        return (
            <View style={[Styles.v3_form_header, Styles.radius_top]}>
                <Text style={Styles.v3_form_header_text}>Attachments</Text>
            </View>
        );
    };
    renderTransactionMediaList() {
        try {
            if (Global.State[this.props.ModelID].Transaction.TransactionMediaList !== null && Global.State[this.props.ModelID].Transaction.TransactionMediaList.length > 0) {
                let _UI = [];
                for (let _MediaIndex = 0; _MediaIndex < Global.State[this.props.ModelID].Transaction.TransactionMediaList.length; _MediaIndex++) {
                    let _Media = Global.State[this.props.ModelID].Transaction.TransactionMediaList[_MediaIndex];
    
                    let _MediaFile = null;
                    if (Platform.OS === 'macos' || Platform.OS === 'windows') {
                        _MediaFile = (
                            <Pressable style={[{flex: 1, height: 40, justifyContent: 'center', marginTop: 5, borderBottomRightRadius: _DeleteButton === null ? 4 : 0}]} onPress={async () => {
                                try {
                                    await global.root.NotificationModal.Show({ NotificationTitle: 'Saving...', NotificationStyle: 'Wait' });
                                    let _FileName = _Media.MediaDescription;
                                    await global.root.Export({
                                        FileName: _FileName,
                                        Base64: await MediaHelper.GetOne({
                                            LinkType: 25,
                                            LinkID: Global.State[this.props.ModelID].Transaction.TransactionID,
                                            MediaID: _Media.MediaID
                                        })
                                    });                                    
                                    global.root.NotificationModal.Show({ NotificationTitle: 'Saved...', Message: _FileName + ' has been saved to your Downloads folder.', NotificationStyle: 'Toast' });
                                } catch (ex) {
                                    global.Log({Message: 'TransactionForm.renderTransactionMediaList>>' + ex.message, Notify: true});
                                }
                            }}>
                                <Text style={{color: '#4169e1', fontWeight: 'bold'}}>{_Media.MediaDescription + ' (' + Global.FormatFileSize(_Media.MediaSize) + ')'}</Text>
                            </Pressable>
                        )
                    } else {
                        _MediaFile = (
                            <View style={[{flex: 1, height: 40, justifyContent: 'center', marginTop: 5}]}>
                                <Text style={{color: '#000000'}}>{_Media.MediaDescription + ' (' + Global.FormatFileSize(_Media.MediaSize) + ')'}</Text>
                            </View>                            
                        );
                    }

                    //Hide delete button when locked
                    let _DeleteButton = null;
                    _DeleteButton = (
                        <View style={{width: 5}}></View>
                    )
    
                    let _Radius = _MediaIndex === parseInt(Global.State[this.props.ModelID].Transaction.TransactionMediaList.length - 1) ? Styles.radius_bottom : null;
    
                    _UI.push(
                        <View key={'TransactionMediaList_' + _MediaIndex} style={[_Radius, {backgroundColor: '#eeeeee', borderRadius: 4, marginTop: 2}]}>
                            <View style={{flex:1, flexDirection:'row'}}>
                                <View style={{width: 50, height: 50, alignItems: 'center', justifyContent:'center'}}>
                                    <Text style={{fontWeight: 'bold', color: '#000000'}}>{_MediaIndex + 1}</Text>
                                </View>
                                {_MediaFile}
                                {_DeleteButton}
                            </View>                     
                        </View>
                    );
                } 
                return _UI;
            } else {
                return (
                    <View style={[Styles.radius_bottom, {flex: 1, height: 40, alignItems: 'center', justifyContent: 'center', backgroundColor: '#e1e1e1'}]}>
                        <Text style={{color: '#a9a9a9'}}>-- No Records Found --</Text>
                    </View>
                );            
            }
        } catch (ex) {
            global.Log({Message: 'TransactionForm.renderTransactionMediaList>>' + ex.message});
        }
    };
    renderTransactionItemList() {
        try {
            if (Global.State[this.props.ModelID].Transaction.TransactionItemList !== null) {
                let _UI = [];
                for (let _TransactionItemIndex = 0; _TransactionItemIndex < Global.State[this.props.ModelID].Transaction.TransactionItemList.length; _TransactionItemIndex++) {
                    let _TransactionItem = Global.State[this.props.ModelID].Transaction.TransactionItemList[_TransactionItemIndex];
                    _UI.push(
                        <View key={'TransactionItemListList_' + _TransactionItemIndex} style={{marginTop: _TransactionItemIndex > 0 ? 10 : 0}}>
                            <View style={{flex:1, flexDirection:'row'}}>
                                <View style={{width: 44, height: 40, alignItems: 'center', justifyContent: 'center'}}>
                                    <Text style={{fontWeight: 'bold', color: Global.Theme.Body.ForegroundColor}}>{_TransactionItemIndex + 1}</Text>
                                </View>
                                <View style={{flex: 1, height: 40, justifyContent: 'center', paddingLeft: 6, paddingRight: 6}}>
                                    <Text numberOfLines={1} style={{fontWeight: 'bold', color: Global.Theme.Body.ForegroundColor}}>{_TransactionItem.TransactionItemDescription !== null && _TransactionItem.TransactionItemDescription.length > 0 ? _TransactionItem.TransactionItemDescription : 'Item Description...'}</Text>
                                </View>
                                <Pressable style={({pressed}) => [{width: 40, height: 40, opacity: pressed ? .7 : 1}]} onPress={async () => {
                                    this.DeleteTransactionItem(_TransactionItem);
                                }}>
                                    <Image source={Global.Theme.Body.Icons.Trash} style={{width: 24, height: 24}} />
                                </Pressable>
                            </View>
                            <View style={{flex: 1, flexDirection: 'row'}}>
                                <View style={{width: 46}}>
                                    <Image source={IMG_Tree_Bottom_000000} style={{width: 20, height: 9, marginTop: 26, marginLeft: 22, opacity: .4}} />
                                </View>
                                <ElementControl
                                        Name={'Category'}
                                        Value={_TransactionItem.TransactionItemCategory}
                                        MarginTop={4}
                                        MarginBottom={4}
                                        Changed={(Text_Value) => {
                                            _TransactionItem.TransactionItemCategory = Text_Value;
                                            this.CheckDirty();
                                        }}
                                        Editable={Global.State[this.props.ModelID].ActiveWindow}
                                    />
                            </View>
                            <View style={{flexDirection: 'row', backgroundColor: Global.Theme.Element.BackgroundColor, borderRadius: 4, marginTop: 10}}>
                                <ElementControl
                                    Name={'Quantity'}
                                    Value={_TransactionItem.TransactionItemQuantity}
                                    ValueType={'Decimal2'}
                                    Changed={(Text_Value) => {
                                        _TransactionItem.TransactionItemQuantity = parseFloat(Text_Value);
                                        this.UpdatePricing(_TransactionItem);
                                    }}
                                    BackgroundColor={'transparent'}
                                    RadiusTopRight={0}
                                    RadiusBottomRight={0}
                                    Editable={Global.State[this.props.ModelID].ActiveWindow}
                                />
                                <View style={{width: 1, backgroundColor: Global.Theme.Body.BackgroundFade, marginTop: 4, marginBottom: 4}}></View>
                                <ElementControl
                                    Name={'Price'}
                                    Value={_TransactionItem.TransactionItemPrice}
                                    ValueType={'Decimal2'}
                                    Changed={(Text_Value) => {
                                        _TransactionItem.TransactionItemPrice = parseFloat(Text_Value);
                                        this.UpdatePricing(_TransactionItem);
                                    }}
                                    BackgroundColor={'transparent'}
                                    RadiusTopLeft={0}
                                    RadiusTopRight={0}
                                    RadiusBottomLeft={0}
                                    RadiusBottomRight={0}                                    
                                    Editable={Global.State[this.props.ModelID].ActiveWindow}
                                />
                                <View style={{width: 1, backgroundColor: Global.Theme.Body.BackgroundFade, marginTop: 4, marginBottom: 4}}></View>
                                <ElementControl
                                    Name={'Tax Rate'}
                                    Value={_TransactionItem.TransactionItemTaxRate}
                                    ValueType={'Decimal4'}
                                    Changed={(Text_Value) => {
                                        _TransactionItem.TransactionItemTaxRate = parseFloat(Text_Value);
                                        this.UpdatePricing(_TransactionItem);
                                    }}
                                    BackgroundColor={'transparent'}
                                    RadiusTopLeft={0}
                                    RadiusTopRight={0}
                                    RadiusBottomLeft={0}
                                    RadiusBottomRight={0}
                                    Editable={Global.State[this.props.ModelID].ActiveWindow}
                                />
                                <View style={{width: 1, backgroundColor: Global.Theme.Body.BackgroundFade, marginTop: 4, marginBottom: 4}}></View>
                                <ElementControl
                                    Name={'Price'}
                                    Value={_TransactionItem.TransactionItemTotal}
                                    ValueType={'Decimal2'}
                                    Changed={(Text_Value) => {
                                        _TransactionItem.TransactionItemTotal = parseFloat(Text_Value);
                                        this.UpdatePricing(_TransactionItem, 'Total');
                                    }}
                                    BackgroundColor={'transparent'}
                                    RadiusTopLeft={0}
                                    RadiusBottomLeft={0}
                                    Editable={Global.State[this.props.ModelID].ActiveWindow}
                                />        
                            </View>
                        </View>
                    );
                }
    
                //Include new item row
                _UI.push(
                    <View key={'NewItemRow'} style={{flex: 1, height: 20, marginTop: 10}}>
                        <ElementControl
                            Name={'New Item'}
                            Value={null}
                            Autocomplete={(Selected_Value) => {
                                if (Selected_Value.Match !== null) {
                                    let _TransactionItem = TransactionItemHelper.Clone({
                                        TransactionItemProductID: Selected_Value.Match.ProductID,
                                        TransactionItemDescription: Selected_Value.Match.ProductName,
                                        TransactionItemPrice: Selected_Value.Match.ProductPrice,
                                        TransactionItemCategory: Selected_Value.Match.ProductPriceCategory,
                                        TransactionItemQuantity: 1,
                                    });
                                    Global.State[this.props.ModelID].Transaction.TransactionItemList.push(_TransactionItem);
                                    this.UpdatePricing(_TransactionItem);
                                } else {
                                    let _TransactionItem = TransactionItemHelper.Clone({
                                        TransactionItemDescription: Selected_Value.Text,
                                        TransactionItemQuantity: 1,
                                    });
                                    Global.State[this.props.ModelID].Transaction.TransactionItemList.push(_TransactionItem);
                                    this.UpdatePricing(_TransactionItem);
                                }
                                this.ClearFocus();
                                this.CheckDirty();
                            }}
                            AutocompleteSource={'PRODUCTS'}
                            MarginTop={4}
                            MarginBottom={4}
                            Editable={Global.State[this.props.ModelID].ActiveWindow}
                        />                        
                    </View>
                )
    
                return (
                    <View style={{padding: 10, marginBottom: 40}}>
                        <View style={{flex: 1, height: 50, justifyContent: 'center'}}>
                            <Text style={{fontSize: 20, fontWeight: 'bold', color: Global.Theme.Body.ForegroundColor}}>Line Items</Text>
                        </View>
                        {_UI}
                    </View>                        
                );
            }
        } catch (ex) {
            global.Log({Message: 'TransactionForm.renderTransactionItemList>>' + ex.message});
        }
    };
    renderFooter() {
        try {
            return (
                <Animated.View key={'Footer_Row'} style={[Styles.v3_footer_container, {bottom: Global.State[this.props.ModelID].FooterOffset}]}>
                    <View style={{position: 'absolute', top: 0, left: 10, right: 10, height: 60, backgroundColor: Global.Theme.Footer.BackgroundColor, borderRadius: 6, opacity: .5}}></View>
                    <Pressable style={({pressed}) => [{width: 150, height: 40, marginLeft: 10, backgroundColor: '#c06e6e', opacity: pressed ? .7 : 1, borderRadius: 4, alignItems: 'center', justifyContent: 'center'}]} onPress={() => this.CancelTransaction() }>
                        <Text style={{fontWeight: 'bold', color: Global.Theme.Highlight.ForegroundColor}}>Cancel</Text>
                    </Pressable>
                    <View style={{flex: 1}}></View>
                    <Pressable style={({pressed}) => [{width: 150, height: 40, marginRight: 10, backgroundColor: Global.Theme.Highlight.BackgroundColor, opacity: pressed ? .7 : 1, borderRadius: 4, alignItems: 'center', justifyContent: 'center'}]} onPress={() => this.SaveTransaction() }>
                        <Text style={{fontWeight: 'bold', color: Global.Theme.Highlight.ForegroundColor}}>Save</Text>
                    </Pressable>
                </Animated.View>                
            );
        } catch (ex) {
            global.Log({Message: 'TransactionForm.renderFooter>>' + ex.message});
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
            global.Log({Message: 'TransactionForm.renderSwipeBack>>' + ex.message});
        }
    };
};