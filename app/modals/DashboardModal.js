import React, { Component } from 'react';
import { Dimensions } from 'react-native';
import {
    View,
    Pressable,
    Image,
    Platform,
    TurboModuleRegistry,
    Keyboard,
    ActivityIndicator,
    AppState,
} from 'react-native';

Global = require('../helpers/Global.js');
Styles = require('../helpers/Styles.js');

//Modals
AccountForm = require('../modals/AccountForm.js');
AccountPersonForm = require('../modals/AccountPersonForm.js');
AccountSubscriptionForm = require('../modals/AccountSubscriptionForm.js');
AuthenticateForm = require('../modals/AuthenticateForm.js');
CalendarModal = require('../modals/CalendarModal.js');
CombinedLogSearch = require('../modals/CombinedLogSearch.js');
ConfirmModal = require('../modals/ConfirmModal.js');
EmailForm = require('../modals/EmailForm.js');
PersonDeviceForm = require('../modals/PersonDeviceForm.js');
PersonForm = require('../modals/PersonForm.js');
PersonPicker = require('../modals/PersonPicker.js');
PickerModal = require('../modals/PickerModal.js');
ProductForm = require('../modals/ProductForm.js');
ProductSearch = require('../modals/ProductSearch.js');
ReleaseForm = require('../modals/ReleaseForm.js');
SchemaForm = require('../modals/SchemaForm.js');
ServiceForm = require('../modals/ServiceForm.js');
ActivitySearch = require('../modals/ActivitySearch.js');
TaskSearch = require('../modals/TaskSearch.js');
TicketForm = require('../modals/TicketForm.js');
TicketLogForm = require('../modals/TicketLogForm.js');
VideoSearch = require('../modals/VideoSearch.js');
TokenForm = require('../modals/TokenForm.js');
TransactionForm = require('../modals/TransactionForm.js');
PodcastSearch = require('../modals/PodcastSearch.js');
NotificationModal = require('../modals/NotificationModal.js');

//Helpers
AccountHelper = require('../helpers/AccountHelper.js');
AccountPersonHelper = require('../helpers/AccountPersonHelper.js');
AccountSubscriptionHelper = require('../helpers/AccountSubscriptionHelper.js');
CombinedLogHelper = require('../helpers/CombinedLogHelper.js');
EmailHelper = require('../helpers/EmailHelper.js');
KnowledgeHelper = require('../helpers/KnowledgeHelper.js');
PersonHelper = require('../helpers/PersonHelper.js');
PersonDeviceHelper = require('../helpers/PersonDeviceHelper.js');
ProductHelper = require('../helpers/ProductHelper.js');
ReleaseHelper = require('../helpers/ReleaseHelper.js');
SchemaHelper = require('../helpers/SchemaHelper.js');
ServiceHelper = require('../helpers/ServiceHelper.js');
StatisticHelper = require('../helpers/StatisticHelper.js');
ThreadHelper = require('../helpers/ThreadHelper.js');
ThreadMessageHelper = require('../helpers/ThreadMessageHelper.js');
TicketHelper = require('../helpers/TicketHelper.js');
TicketLogHelper = require('../helpers/TicketLogHelper.js');
TokenHelper = require('../helpers/TokenHelper.js');
TransactionHelper = require('../helpers/TransactionHelper.js');
TransactionItemHelper = require('../helpers/TransactionItemHelper.js');

//Images
IMG_LOGO = require('./images/logo.png');
IMG_Back_eeeeee = require('./images/back_eeeeee.png');
IMG_Back_121212 = require('./images/back_121212.png');
IMG_Close_4169e1 = require('./images/close_4169e1.png');
IMG_Close_ffffff = require('./images/close_ffffff.png');
IMG_Tick_4169e1 = require('./images/tick_4169e1.png');
IMG_Next_ffffff = require('./images/next_ffffff.png');
IMG_Next_121212 = require('./images/next_121212.png');
IMG_Next_eeeeee = require('./images/next_eeeeee.png');
IMG_Next_Double_4169e1 = require('./images/next_double_4169e1.png');
IMG_Next_Double_ffffff = require('./images/next_double_ffffff.png');
IMG_Prev_4169e1 = require('./images/prev_4169e1.png');
IMG_Prev_ffffff = require('./images/prev_ffffff.png');
IMG_Prev_Double_4169e1 = require('./images/prev_double_4169e1.png');
IMG_Prev_Double_ffffff = require('./images/prev_double_ffffff.png');
IMG_Print_4169e1 = require('./images/print_4169e1.png');
IMG_Person_ffffff = require('./images/person_ffffff.png');
IMG_Product_ffffff = require('./images/product_ffffff.png');
IMG_Product_333333 = require('./images/product_333333.png');
IMG_Ticket_333333 = require('./images/ticket_333333.png');
IMG_Location_a9a9a9 = require('./images/location_a9a9a9.png');
IMG_Trash_ffffff = require('./images/trash_ffffff.png');
IMG_Trash_000000 = require('./images/trash_000000.png');
IMG_Settings_333333 = require('./images/settings_333333.png');
IMG_Settings_eeeeee = require('./images/settings_eeeeee.png');
IMG_Settings_121212 = require('./images/settings_121212.png');
IMG_Chart_333333 = require('./images/chart_333333.png');
IMG_Warning_333333 = require('./images/warning_333333.png');
IMG_Warning_121212 = require('./images/warning_121212.png');
IMG_Tree_Bottom_000000 = require('./images/tree_bottom_000000.png');
IMG_Transaction_333333 = require('./images/transaction_333333.png');
IMG_Website_000000 = require('./images/website_000000.png');
IMG_Upload_000000 = require('./images/upload_000000.png');
IMG_Email_000000 = require('./images/email_000000.png');
IMG_Sync_eeeeee = require('./images/sync_eeeeee.png');
IMG_Sync_121212 = require('./images/sync_121212.png');
IMG_Hide_000000 = require('./images/hide_000000.png');
IMG_Building_000000 = require('./images/building_000000.png');
IMG_Product_eeeeee = require('./images/product_eeeeee.png');
IMG_Product_121212 = require('./images/product_121212.png');
IMG_Bolt_eeeeee = require('./images/bolt_eeeeee.png');
IMG_Comment_eeeeee = require('./images/comment_eeeeee.png');
IMG_Comment_121212 = require('./images/comment_121212.png');
IMG_Account_eeeeee = require('./images/account_eeeeee.png');
IMG_Account_121212 = require('./images/account_121212.png');
IMG_Person_eeeeee = require('./images/person_eeeeee.png');
IMG_Person_121212 = require('./images/person_121212.png');
IMG_Trash_eeeeee = require('./images/trash_eeeeee.png');
IMG_Trash_121212 = require('./images/trash_121212.png');
IMG_Add_eeeeee = require('./images/add_eeeeee.png');
IMG_Add_121212 = require('./images/add_121212.png');
IMG_Email_eeeeee = require('./images/email_eeeeee.png');
IMG_Email_121212 = require('./images/email_121212.png');
IMG_Send_eeeeee = require('./images/send_eeeeee.png');
IMG_Send_121212 = require('./images/send_121212.png');
IMG_Copy_eeeeee = require('./images/copy_eeeeee.png');
IMG_Copy_121212 = require('./images/copy_121212.png');
IMG_Upload_eeeeee = require('./images/upload_eeeeee.png');
IMG_Upload_121212 = require('./images/upload_121212.png');
IMG_Robot_eeeeee = require('./images/robot_eeeeee.png');
IMG_Robot_121212 = require('./images/robot_121212.png');
IMG_Done_eeeeee = require('./images/done_eeeeee.png');
IMG_Done_121212 = require('./images/done_121212.png');
IMG_Archive_eeeeee = require('./images/archive_eeeeee.png');
IMG_Archive_121212 = require('./images/archive_121212.png');
IMG_Book_eeeeee = require('./images/book_eeeeee.png');
IMG_Book_121212 = require('./images/book_121212.png');

//Uncaught Exception Handler
global.ErrorUtils.setGlobalHandler((ex, isFatal) => {
    global.Log({Message: 'Unhandled>>' + ex.message, Stack: (ex.hasOwnProperty('stack') ? ex.stack : null), Log: !__DEV__});
});

module.exports = class DashboardModal extends Component {
    constructor(props) {
        super(props);

        //Set screen size
        Global.ScreenX = Dimensions.get('window').width;
        Global.ScreenY = Dimensions.get('window').height;
        Dimensions.addEventListener('change', () => {
            Global.ScreenX = Dimensions.get('window').width;
            Global.ScreenY = Dimensions.get('window').height;
            this.forceUpdate();
        });

        this.AccountForm = null;
        this.AuthenticateForm = null;
        this.CalendarModal = null;
        this.ConfirmModal = null;
        this.EmailForm = null;
        this.NotificationModal = null;
        this.PickerModal = null;
        this.ProductSearch = null;
        this.ReleaseForm = null;
        this.ActivitySearch = null;
        this.TaskSearch = null;
        this.VideoSearch = null;
        this.TransactionForm = null;
        this.PodcastSearch = null;
        this.PersonForm = null;
        this.KeyboardOpen = false;

        Global.State[this.props.ModelID] = {
            IsLoaded: false,
            ActiveWindow: true,
        };

        if (Platform.OS === 'ios') {

            //Registration for notifications
            TurboModuleRegistry.get('NotificationModule').Register();

            //Track app state - close sockets if background or inactive
            this.AppStateSubscription = AppState.addEventListener('change', async (nextAppState) => {
                
            });

            //Calculate safe area insets
            TurboModuleRegistry.get('SafeAreaModule').getInsets().then((Insets_Value) => {
                if (Insets_Value !== null) {
                    Global.InsetTop = Insets_Value.top;
                    Global.InsetBottom = Insets_Value.bottom;
                } else {
                    Global.InsetTop = 0;
                    Global.InsetBottom = 0;                    
                }
            });

            //Handle iOS keypad padding
            //Might be an RN 64 issue but keyboardWillShow fires on keyboard hiding unless you check for open state
            //Revisit when upgraded to latest version of RN
            this.keyboardWillShowListener = Keyboard.addListener('keyboardWillShow', (e) => {
                if (!this.KeyboardOpen) {
                    let keyboardHeight = e.endCoordinates.height;
                    this.KeyboardHandler('SHOW', keyboardHeight); 
                }
            });
            this.keyboardDidShowListener = Keyboard.addListener('keyboardDidShow', (e) => {
                this.KeyboardOpen = true;
            });            
            this.keyboardWillHideListener = Keyboard.addListener('keyboardWillHide', () => {
                this.KeyboardHandler('HIDE', 0);
            });
            this.keyboardDidShowListener = Keyboard.addListener('keyboardDidHide', () => {
                this.KeyboardOpen = false;
            });

        }

        global.root = this;
        global.Log = async (Params_Value) => {
            try {

                //Split target from message
                let _Target = null;
                let _Message = null;
                if (Params_Value.hasOwnProperty('Message') && Global.StringHasContent(Params_Value.Message)) {
                    let _MessageParts = Params_Value.Message.split('>>');
                    for (let _PartIndex = 0; _PartIndex < _MessageParts.length; _PartIndex++) {
                        if (_PartIndex === (_MessageParts.length - 1)) {
                            _Message = _MessageParts[_PartIndex];
                        } else {
                            if (_Target !== null) {
                                _Target += _MessageParts[_PartIndex] + '>>';
                            } else {
                                _Target = _MessageParts[_PartIndex] + '>>';
                            }
                        }
                    }                
                }
    
                //Show notification when true / otherwise show console when in dev
                if (Params_Value.hasOwnProperty('Notify') && Params_Value.Notify) {
                    global.root.NotificationModal.Show({ NotificationTitle: 'Interesting...', NotificationMessage: (__DEV__ ? _Target + _Message : _Message), NotificationStyle: 'Acknowledge' });
                } else if (__DEV__) {
                    console.warn(Params_Value.Message);
                }
    
                //ToDo: Save the log to sitemesh
                await fetch(Global.CORE_URL + 'v1/stream', { body: JSON.stringify({   
                    Type: 'exception',           
                    Version: Global.VERSION,
                    Environment: (__DEV__ ? 'debug' : 'release'),
                    OS: Platform.OS,
                    Message: Params_Value.Message,
                    Data: Params_Value.hasOwnProperty('Data') ? Params_Value.Data : null
                }), method: 'POST', headers: {
                    'Content-Type': 'application/json',
                    'authorization': 'bearer ' + Global.Token, 
                }});

                //Logout
                if (Params_Value.Message !== null && Params_Value.Message.endsWith('>>Unauthorized')) {
                    Global.SetToken(null);
                    global.root.ChangeView('AuthenticateForm');                  
                }

            } catch (ex) {
                console.warn('global.Log>>' + ex.message);
            }
        }
    };
    componentDidMount() {
        try {            
            this.NotificationModal.Show({ NotificationTitle: 'Loading...', NotificationStyle: 'Wait' }).then(async () => {
                try {

                    //Restore session
                    await TokenHelper.Restore();

                    //Load available orgs if session exists but not in context
                    if (Global.TokenPayload !== null 
                    && Global.TokenPayload.hasOwnProperty('TokenID') 
                    && Global.TokenPayload.TokenID !== null 
                    && Global.TokenPayload.hasOwnProperty('TokenPersonID') 
                    && Global.TokenPayload.TokenPersonID !== null) {
                        this.ChangeView('ActivitySearch');
                    } else {
                        await TokenHelper.Delete(null);
                        this.ChangeView('AuthenticateForm');
                    }

                    this.NotificationModal.Hide();

                    //Load dash
                    Global.State[this.props.ModelID].IsLoaded = true;
                    this.forceUpdate();

                } catch (ex) {
                    Global.State[this.props.ModelID].IsLoaded = true;
                    this.forceUpdate();                
                }
            });
        } catch (ex) {
            Global.State[this.props.ModelID].IsLoaded = true;
            this.forceUpdate();
        }
    };
    componentWillUnmount() {
        try {
            this.AppStateSubscription?.remove();
        } catch (ex) {
            //Do Nothing
        }
    }

    //Authenticateion Flow
    async AuthContext(ServiceID_Value) {
        try {
            await global.root.NotificationModal.Show({ NotificationTitle: 'Loading...', NotificationStyle: 'Wait' });
            await TokenHelper.Refresh({
                ServiceID: ServiceID_Value
            });
            if (Global.TokenPayload !== null 
            && Global.TokenPayload.hasOwnProperty('TokenPersonID') 
            && Global.TokenPayload.TokenPersonID !== null
            && Global.TokenPayload.TokenPersonID.length > 0) {
                this.ChangeView('ActivitySearch');
            } else {
                this.ChangeView('ActivitySearch');
            }
            this.forceUpdate();
        } catch (ex) {
            global.Log({Message: 'DashboardModal.AuthContext>>' + ex.message});
        }
    };
    async AuthDelete() {
        try {
            this.ConfirmModal.Show('Just Checking...', 'Are you sure you want to sign out?', 'Yes', 'No', 
            async () => {
                try {
                    await global.root.NotificationModal.Show({ NotificationTitle: 'Signing Out...', NotificationStyle: 'Wait' });
                    this.ActivitySearch.Hide();
                    this.PodcastSearch.Hide();
                    this.VideoSearch.Hide();
                    this.TaskSearch.Hide();
                    this.AuthenticateForm.Show();
                    await TokenHelper.Delete(null);
                    this.NotificationModal.Hide();
                    this.forceUpdate();
                } catch (ex) {
                    global.Log({Message: 'DashboardModal.AuthDelete>>' + ex.message});
                    this.NotificationModal.Hide();
                    this.forceUpdate();
                }
            }, () => {
                //Cancel - Do Nothing
            });
        } catch (ex) {
            global.Log({Message: 'DashboardModal.AuthDelete>>' + ex.message});
        }
    };

    NavBack() {
        try {
            if (this.TaskSearch !== null
            || this.VideoSearch !== null
            || this.PodcastSearch !== null) {
                this.ChangeView('ActivitySearch');
            } else {
                this.AuthContext(null);
            }
        } catch (ex) {
            global.Log({Message: 'DashboardModal.NavBack>>' + ex.message, Notify: true});
        }
    }
    async ChangeView(View_Value) {
        try {

            //Show / Hide
            if (View_Value === 'AuthenticateForm') {
                await this.AuthenticateForm.Show();
                this.ActivitySearch.Hide();
                this.PodcastSearch.Hide()
                this.VideoSearch.Hide();
                this.TaskSearch.Hide();
            } else if (View_Value === 'ActivitySearch') {           
                await this.ActivitySearch.Show();
                this.AuthenticateForm.Hide();
                this.PodcastSearch.Hide();
                this.VideoSearch.Hide();
                this.TaskSearch.Hide();
            } else if (View_Value === 'PodcastSearch') {
                await this.PodcastSearch.Show();
                this.AuthenticateForm.Hide();
                this.ActivitySearch.Hide();
                this.VideoSearch.Hide();
                this.TaskSearch.Hide();
            } else if (View_Value === 'VideoSearch') {
                await this.VideoSearch.Show();
                this.AuthenticateForm.Hide();
                this.ActivitySearch.Hide();
                this.TaskSearch.Hide();
                this.PodcastSearch.Hide();
            } else if (View_Value === 'TaskSearch') {
                await this.TaskSearch.Show();
                this.AuthenticateForm.Hide();
                this.ActivitySearch.Hide();
                this.VideoSearch.Hide();
                this.PodcastSearch.Hide();
            }

            this.forceUpdate();

        } catch (ex) {
            global.Log({Message: 'DashboardModal.ChangeView>>' + ex.message, Notify: true});
        }
    };

    //Flyouts
    ShowAccount(Params_Value) {
        try {
            this.AccountForm.Show(Params_Value);
        } catch (ex) {
            global.Log({Message: 'DashboardModal.ShowAccount>>' + ex.message, Notify: true});
        }
    };  
    ShowEmail(Params_Value) {
        try {
            this.EmailForm.Show(Params_Value);            
        } catch (ex) {
            global.Log({Message: 'DashboardModal.ShowEmail>>' + ex.message, Notify: true});
        }
    };
    ShowPerson(Params_Value) {
        try {
            this.PersonForm.Show(Params_Value);            
        } catch (ex) {
            global.Log({Message: 'DashboardModal.ShowPerson>>' + ex.message, Notify: true});
        }
    };
    ShowRelease(Params_Value) {
        try {
            this.ReleaseForm.Show(Params_Value);
        } catch (ex) {
            global.Log({Message: 'DashboardModal.ShowRelease>>' + ex.message, Notify: true});
        }
    };
    ShowService(Params_Value) {
        try {
            this.ServiceForm.Show(Params_Value);
        } catch (ex) {
            global.Log({Message: 'DashboardModal.ShowService>>' + ex.message, Notify: true});
        }
    };
    ShowTicket(Params_Value) {
        try {
            this.TicketForm.Show(Params_Value, null, (TicketID_Value) => this.VideoSearch.Delete(TicketID_Value));
        } catch (ex) {
            global.Log({Message: 'DashboardModal.ShowTicket>>' + ex.message, Notify: true});
        }
    };
    ShowTransaction(Params_Value) {
        try {
            this.TransactionForm.Show(Params_Value);
        } catch (ex) {
            global.Log({Message: 'DashboardModal.ShowTransaction>>' + ex.message, Notify: true});
        }
    };

    BackHandler() {
        try {
            //Show singleton top level controls first (NotificationModal, ConfirmModal, PickerModal) because they sit at the root so propagating backhandler doesnt work
            if (this.AccountForm?.IsActive()) {
                this.AccountForm.BackHandler();
                return true;            
            } else if (this.ConfirmModal?.IsActive()) {
                this.ConfirmModal.BackHandler();
                return true;
            } else if (this.EmailForm?.IsActive()) {
                this.EmailForm.BackHandler();
                return true;
            } else if (this.NotificationModal?.IsActive()) {
                this.NotificationModal.BackHandler();
                return true;
            } else if (this.PickerModal?.IsActive()) {
                this.PickerModal.BackHandler();
                return true;
            } else if (this.PersonForm?.IsActive()) {
                this.PersonForm.BackHandler();
                return true;
            } else if (this.ProductSearch?.IsActive()) {
                this.ProductSearch.BackHandler();
                return true;
            } else if (this.ReleaseForm?.IsActive()) {
                this.ReleaseForm.BackHandler();
            } else if (this.ServiceForm?.IsActive()) {
                this.ServiceForm.BackHandler();
                return true;
            } else if (this.TransactionForm?.IsActive()) {
                this.TransactionForm.BackHandler();
                return true;
            } else {
                return true;
            }
        } catch (ex) {
            global.Log({Message: 'DashboardModal.BackHandler>>' + ex.message});
        }
    };
    ActiveHandler() {
        try {
            
            //Check global modal active
            if (this.CalendarModal.IsActive()) {
                global.GlobalModalActive = true;
            } else if (this.ConfirmModal.IsActive()) {
                global.GlobalModalActive = true;
            } else if (this.NotificationModal.IsActive()) {
                global.GlobalModalActive = true;
            } else if (this.PickerModal.IsActive()) {
                global.GlobalModalActive = true;
            } else {
                global.GlobalModalActive = false;
            }
            
            let _ActiveWindow = false;
            if (this.AccountForm?.IsActive()) {
                this.AccountForm.ActiveHandler();
            } else if (this.EmailForm?.IsActive()) {
                this.EmailForm.ActiveHandler();
            } else if (this.PersonForm?.IsActive()) {
                this.PersonForm.ActiveHandler();
            } else if (this.ProductSearch?.IsActive()) {
                this.ProductSearch.ActiveHandler();
            } else if (this.ReleaseForm?.IsActive()) {
                this.ReleaseForm.ActiveHandler();                
            } else if (this.ServiceForm?.IsActive()) {
                this.ServiceForm.ActiveHandler();
            } else if (this.TicketForm?.IsActive()) {
                this.TicketForm.ActiveHandler();
            } else if (this.TransactionForm?.IsActive()) {
                this.TransactionForm.ActiveHandler();
            } else if (!global.GlobalModalActive) {
                _ActiveWindow = true;
            }

            //Handle IsActive change
            if (_ActiveWindow !== Global.State[this.props.ModelID].ActiveWindow) {
                Global.State[this.props.ModelID].ActiveWindow = _ActiveWindow;
                this.forceUpdate();
            }

        } catch (ex) {
            global.Log({Message: 'DashboardModal.ActiveHandler>>' + ex.message});
        }
    };
    KeyboardHandler(action, keyboardheight) {
        try {
            if (this.PodcastSearch !== null && this.PodcastSearch.IsActive()) {
                this.PodcastSearch.KeyboardHandler(action, keyboardheight);
            } else {
                //Do Nothing
            }
        } catch (ex) {
            global.Log({Message: 'DashboardModal.KeyboardHandler>>' + ex.message});
        }
    };

    async Export(Params_Value) {
        try {

            Params_Value.Base64 = Params_Value.Base64.replace('data:text/csv;base64,', '');
            Params_Value.Base64 = Params_Value.Base64.replace('data:application/pdf;base64,', '');
            Params_Value.Base64 = Params_Value.Base64.replace('data:image/jpeg;base64,', '');
            Params_Value.Base64 = Params_Value.Base64.replace('data:image/png;base64,', '');

            if (Params_Value.FileName.endsWith('.csv')) {
                Params_Value.FileExtension = '.csv';
            } else if (Params_Value.FileName.endsWith('.pdf')) {
                Params_Value.FileExtension = '.pdf';
            } else if (Params_Value.FileName.endsWith('.jpg')) {
                Params_Value.FileExtension = '.jpg';
            } else if (Params_Value.FileName.endsWith('.png')) {
                Params_Value.FileExtension = '.png';
            }

            if (Platform.OS === 'macos' || Platform.OS === 'ios') {
                await TurboModuleRegistry.get('RNExport').Export(Params_Value.FileName, Params_Value.Base64);
            } else if (Platform.OS === 'windows') {
                await TurboModuleRegistry.get('RNExport').Export(Params_Value);
            }
        } catch (ex) {
            throw Error('DashboardModal.Export>>' + ex.message);
        }
    };    

    render() {
        try {

            //Show menu when logged in
            let _DesktopMenuUI = null;
            let _MobileMenuUI = null;
            let _SafeAreaBackground = null;
            let _Display = Global.ScreenX >= 600 ? 'Desktop' : 'Mobile';            
            let _ActivityButton = null;
            let _TransactionsButton = null;
            let _TicketsButton = null;
            let _CalendarButton = null;
            if (Global.TokenPayload !== null 
            && Global.TokenPayload.hasOwnProperty('TokenPersonID')
            && Global.StringHasContent(Global.TokenPayload.TokenPersonID)) {

                //Create menu buttons
                _ActivityButton = (
                    <Pressable onPress={() => {
                        this.ChangeView('ActivitySearch');
                    }} style={({pressed}) => [{width: 50, height: 50, alignItems: 'center', justifyContent: 'center', opacity: pressed ? .5 : 1, backgroundColor: this.ActivitySearch?.IsActive() ? Global.Theme.Footer.ControlBackground : 'transparent', borderRadius: 5, margin: _Display === 'Desktop' ? 10 : 5}]}>
                        <Image source={Global.Theme.Footer.Icons.Activity} style={[Styles.form_button_image, {width: 24, height: 24}]} />
                    </Pressable>
                );
                _TransactionsButton = (
                    <Pressable onPress={() => {
                        this.ChangeView('PodcastSearch');
                    }} style={({pressed}) => [{width: 50, height: 50, alignItems: 'center', justifyContent: 'center', opacity: pressed ? .5 : 1, backgroundColor: this.PodcastSearch?.IsActive() ? Global.Theme.Footer.ControlBackground : 'transparent', borderRadius: 5, margin: _Display === 'Desktop' ? 10 : 5}]}>
                        <Image source={Global.Theme.Footer.Icons.Podcast} style={[Styles.form_button_image, {width: 24, height: 24}]} />
                    </Pressable>
                );
                _TicketsButton = (
                    <Pressable onPress={() => {
                        this.ChangeView('VideoSearch');
                    }} style={({pressed}) => [{width: 50, height: 50, alignItems: 'center', justifyContent: 'center', opacity: pressed ? .5 : 1, backgroundColor: this.VideoSearch?.IsActive() ? Global.Theme.Footer.ControlBackground : 'transparent', borderRadius: 5, margin: _Display === 'Desktop' ? 10 : 5}]}>
                        <Image source={Global.Theme.Footer.Icons.Video} style={[Styles.form_button_image, {width: 24, height: 24}]} />
                    </Pressable>
                );
                _CalendarButton = (
                    <Pressable onPress={() => {
                        this.ChangeView('TaskSearch');
                    }} style={({pressed}) => [{width: 50, height: 50, alignItems: 'center', justifyContent: 'center', opacity: pressed ? .5 : 1, backgroundColor: this.TaskSearch?.IsActive() ? Global.Theme.Footer.ControlBackground : 'transparent', borderRadius: 5, margin: _Display === 'Desktop' ? 10 : 5}]}>
                        <Image source={Global.Theme.Footer.Icons.Calendar} style={{width: 24, height: 24}} />
                    </Pressable>
                );

                //Layout depending on screen size
                if (Global.ScreenX >= 600) {
                    _DesktopMenuUI = (
                        <View style={{position: 'absolute', alignSelf: 'center', width: 600, borderRadius: 5, flexDirection: 'row', bottom: 10}}>
                            <View style={{position: 'absolute', top: 0, left: 0, bottom: 0, right: 0, backgroundColor: Global.Theme.Footer.BackgroundColor, opacity: .8}}></View>
                            <View style={{flex: 1}}></View>
                            {_ActivityButton}
                            <View style={{flex: 1}}></View>
                            {_TransactionsButton}
                            <View style={{flex: 1}}></View>
                            {_TicketsButton}
                            <View style={{flex: 1}}></View>
                            {_CalendarButton}
                            <View style={{flex: 1}}></View>
                        </View>
                    );
                } else {
                    _MobileMenuUI = (
                        <View style={{flexDirection: 'row', backgroundColor: Global.Theme.Footer.BackgroundColor, paddingLeft: 10, paddingRight: 10}}>
                            <View style={{flex: 1, alignItems: 'center'}}>
                                {_ActivityButton}
                            </View>
                            <View style={{flex: 1, alignItems: 'center'}}>
                                {_TransactionsButton}
                            </View>
                            <View style={{flex: 1, alignItems: 'center'}}>
                                {_TicketsButton}
                            </View>
                            <View style={{flex: 1, alignItems: 'center'}}>
                                {_CalendarButton}
                            </View>
                        </View>
                    );
                    _SafeAreaBackground = (
                        <View style={{position: 'absolute', left: 0, right: 0, bottom: 0, height: 50, backgroundColor: Global.Theme.Footer.BackgroundColor}}></View>
                    );
                }
                
            }
            
            return (
                <View style={{flex: 1, backgroundColor: Global.Theme.Header.BackgroundColor}} onKeyDown={this._onKeyDown} focusable={true}>
                    {_SafeAreaBackground}

                    {/* UI Body */}
                    <View style={{flex: 1, marginTop: Global.InsetTop, marginBottom: Global.InsetBottom}}>
                        <View style={{flex: 1, flexDirection: 'row'}}>                            
                            <AuthenticateForm ref={ele => this.AuthenticateForm = ele} ModelID={this.props.ModelID + '_AFS84US'} ActiveWindow={Global.State[this.props.ModelID].ActiveWindow} />
                            <ActivitySearch ref={ele => this.ActivitySearch = ele} ModelID={this.props.ModelID + '_SD9ZP4US'} ActiveWindow={Global.State[this.props.ModelID].ActiveWindow} />
                            <PodcastSearch ref={ele => this.PodcastSearch = ele} ModelID={this.props.ModelID + '_UAIFJ1KD'} ActiveWindow={Global.State[this.props.ModelID].ActiveWindow} />
                            <VideoSearch ref={ele => this.VideoSearch = ele} ModelID={this.props.ModelID + '_NP52AJUS'} ActiveWindow={Global.State[this.props.ModelID].ActiveWindow} />
                            <TaskSearch ref={ele => this.TaskSearch = ele} ModelID={this.props.ModelID + '_CS52AJUS'} ActiveWindow={Global.State[this.props.ModelID].ActiveWindow} />
                        </View>
                        {_DesktopMenuUI}
                        {_MobileMenuUI}
                    </View>

                    {/* Session Loader */}
                    {this.renderSessionLoader()}
    
                    {/* Opacity Layer */}
                    {this.renderOpacity()}
                    
                    <AccountForm ref={ele => this.AccountForm = ele} ModelID={this.props.ModelID + '_ZP2X7ZSM'} />
                    <PersonForm ref={ele => this.PersonForm = ele} ModelID={this.props.ModelID + '_3TJQ95YN'} />
                    <ProductSearch ref={ele => this.ProductSearch = ele} ModelID={this.props.ModelID + '_4VXVVCT1'} />
                    <ReleaseForm ref={ele => this.ReleaseForm = ele} ModelID={this.props.ModelID + '_RF1VV5C1'} />
                    <ServiceForm ref={ele => this.ServiceForm = ele} ModelID={this.props.ModelID + '_U48MQ3CT'} />                  
                    <TicketForm ref={ele => this.TicketForm = ele} ModelID={this.props.ModelID + '_0ZJQ95YN'} />
                    <TransactionForm ref={ele => this.TransactionForm = ele} ModelID={this.props.ModelID + '_NJ52AJUS'} />

                    {/* Singleton Modals */}
                    <EmailForm ref={ele => this.EmailForm = ele} ModelID={this.props.ModelID + '_E8S7TT3N'} />
                    <CalendarModal ref={ele => this.CalendarModal = ele} ModelID={this.props.ModelID + '_EKX98QNG'} />
                    <PickerModal ref={ele => this.PickerModal = ele} ModelID={this.props.ModelID + '_NKD35742'} />
                    <ConfirmModal ref={ele => this.ConfirmModal = ele} ModelID={this.props.ModelID + '_UJ6ZX5H6'} />
                    <NotificationModal ref={ele => this.NotificationModal = ele} ModelID={this.props.ModelID + '_Q38DLK4T'} />
    
                </View>
            );

        } catch (ex) {
            global.Log({Message: 'DashboardModal.render>>' + ex.message});
        }
    };
    renderSessionLoader() {
        try {
            if (!Global.State[this.props.ModelID].IsLoaded) {
                return (
                    <View style={{position: 'absolute', top: 50, left: 0, right: 0, bottom: 0, backgroundColor: Global.Theme.Body.ControlBackground, alignItems: 'center', justifyContent: 'center'}}>
                        <ActivityIndicator style={{width: 50, height: 50}} size={'large'} color={Global.Theme.Body.ForegroundColor} />
                    </View>
                )
            }
        } catch (ex) {
            global.Log({Message: 'DashboardModal.renderSessionLoader>>' + ex.message});
        }
    };
    renderOpacity() {
        try {
            if ((Platform.OS === 'macos' || Platform.OS === 'windows') && !Global.State[this.props.ModelID].ActiveWindow) {
                return (
                    <View style={{position: 'absolute', left: 0, top: 0, right: 0, bottom: 0, backgroundColor: '#000000', opacity: .4}}></View>                    
                );
            } else {
                return <View></View>;
            }
        } catch (ex) {
            global.Log({Message: 'DashboardModal.renderOpacity>>' + ex.message});
        }
    };
};