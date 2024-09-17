import {
    Platform,
} from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
module.exports = {    
    CORE_URL: 'https://core.sitemesh.com/',
    VERSION: '2024.1.0',
    WebSocket: null,
    State: {},
    Token: null,
    TokenPayload: null,
    ScreenX: 0,
    ScreenY: 0,
    InsetTop: 0,
    InsetBottom: 0,
    NativeAnimationDriver: Platform.OS === 'windows' ? false : true,
    Theme: {
        Header: {
            BackgroundColor: (global.ColorScheme === 'dark' ? '#16161a' : '#dedede'),
            BackgroundFade: (global.ColorScheme === 'dark' ? 'rgba(38, 38, 38, .5)' : 'rgba(222, 222, 222, .5)'),
            ForegroundColor: (global.ColorScheme === 'dark' ? '#eeeeee' : '#121212'),
            Icons: {
                Back: global.ColorScheme === 'dark' ? require('../modals/images/back_eeeeee.png') : require('../modals/images/back_121212.png'),
                Add: global.ColorScheme === 'dark' ? require('../modals/images/add_eeeeee.png') : require('../modals/images/add_121212.png'),
                Close: global.ColorScheme === 'dark' ? require('../modals/images/close_eeeeee.png') : require('../modals/images/close_121212.png'),
                Trash: global.ColorScheme === 'dark' ? require('../modals/images/trash_eeeeee.png') : require('../modals/images/trash_121212.png'),
            }
        },
        Body: {
            BackgroundColor: (global.ColorScheme === 'dark' ? '#121212' : '#f1f1f1'),
            BackgroundFade: (global.ColorScheme === 'dark' ? 'rgba(18, 18, 18, .5)' : 'rgba(241, 241, 241, .5)'),
            ControlBackground: (global.ColorScheme === 'dark' ? '#28292f' : '#e6e6e6'),
            ForegroundColor: (global.ColorScheme === 'dark' ? '#eeeeee' : '#121212'),
            ForegroundFade: (global.ColorScheme === 'dark' ? 'rgba(238,238,238,.5)' : 'rgba(18,18,18,.5)'),
            Icons: {
                Back: global.ColorScheme === 'dark' ? require('../modals/images/back_eeeeee.png') : require('../modals/images/back_121212.png'),
                Forward: global.ColorScheme === 'dark' ? require('../modals/images/forward_eeeeee.png') : require('../modals/images/forward_121212.png'),
                Activity: global.ColorScheme === 'dark' ? require('../modals/images/activity_eeeeee.png') : require('../modals/images/activity_121212.png'),
                Copy: global.ColorScheme === 'dark' ? require('../modals/images/copy_eeeeee.png') : require('../modals/images/copy_121212.png'),
                Add: global.ColorScheme === 'dark' ? require('../modals/images/add_eeeeee.png') : require('../modals/images/add_121212.png'),
                Trash: global.ColorScheme === 'dark' ? require('../modals/images/trash_eeeeee.png') : require('../modals/images/trash_121212.png'),
            }
        },
        Element: {
            BackgroundColor: (global.ColorScheme === 'dark' ? '#28292f' : '#e6e6e6'),
            BackgroundFade: (global.ColorScheme === 'dark' ? 'rgba(40,41,47,.5)' : 'rgba(230, 230, 230,.5)'),
            ForegroundColor: (global.ColorScheme === 'dark' ? '#eeeeee' : '#121212'),
            ForegroundFade: (global.ColorScheme === 'dark' ? 'rgba(238,238,238,.5)' : 'rgba(18,18,18,.5)'),
            Icons: {
                Close: global.ColorScheme === 'dark' ? require('../modals/images/close_eeeeee.png') : require('../modals/images/close_121212.png'),
            }
        },
        Footer: {
            BackgroundColor: (global.ColorScheme === 'dark' ? '#4c4d5a' : '#dedede'),
            ControlBackground: (global.ColorScheme === 'dark' ? '#28292f' : '#e6e6e6'),
            ForegroundColor: (global.ColorScheme === 'dark' ? '#eeeeee' : '#121212'),
            Icons: {
                Activity: global.ColorScheme === 'dark' ? require('../modals/images/activity_eeeeee.png') : require('../modals/images/activity_121212.png'),
                Podcast: global.ColorScheme === 'dark' ? require('../modals/images/podcast_eeeeee.png') : require('../modals/images/podcast_121212.png'),
                Task: global.ColorScheme === 'dark' ? require('../modals/images/task_eeeeee.png') : require('../modals/images/task_121212.png'),
                Video: global.ColorScheme === 'dark' ? require('../modals/images/video_eeeeee.png') : require('../modals/images/video_121212.png'),
            }
        },
        Highlight: {
            BackgroundColor: (global.Appearance === 'dark' ? '#03dac5' : '#04D9FF'),
            BackgroundFade: (global.Appearance === 'dark' ? 'rgba(3,218,197,.5)' : 'rgba(4, 217, 255,.5)'),
            ForegroundColor: (global.Appearance === 'dark' ? '#121212' : '#121212'),
            Icons: {
                Activity: global.ColorScheme === 'dark' ? require('../modals/images/activity_121212.png') : require('../modals/images/activity_121212.png'),
                Lock: global.ColorScheme === 'dark' ? require('../modals/images/lock_121212.png') : require('../modals/images/lock_121212.png'),
            }
        },    
    },
    SetToken(Token_Value) {
        try {
            if (Token_Value !== null) {
                Global.Token = Token_Value;
                let _Base64Url = Global.Token.split('.')[1];
                let _Base64 = _Base64Url.replace(/-/g, '+').replace(/_/g, '/');
                let _PayloadString = decodeURIComponent(Global.atob(_Base64).split('').map(function(c) {
                    return '%' + ('00' + c.charCodeAt(0).toString(16)).slice(-2);
                }).join(''));
                Global.TokenPayload = JSON.parse(_PayloadString);
            } else {
                Global.Token = null;
                Global.TokenPayload = null;
            }
        } catch (ex) {
            throw Error('Global.SetToken>>' + ex.message);
        }
    },
    GetHeaders() {
        try {
            return {
                'Content-Type': 'application/json',
                'authorization': (Global.Token !== null ? 'bearer ' + Global.Token : ''), 
                'version': Global.VERSION, 
                'platform-key': Platform.OS 
            };
        } catch (ex) {
            throw Error('Global.GetHeaders>>' + ex.message);
        }        
    },
    async FetchCore(Params_Value) {
        try {
            if (Params_Value.hasOwnProperty('Body') && Params_Value.Body !== null) {
                return await fetch(Global.CORE_URL + Params_Value.Action, { body: JSON.stringify(Params_Value.Body), method: Params_Value.Method, headers: Global.GetHeaders() });
            } else {
                return await fetch(Global.CORE_URL + Params_Value.Action, { method: Params_Value.Method, headers: Global.GetHeaders() });
            }
        } catch (ex) {
            throw Error('Global.FetchCore>>' + ex.message);   
        }
    },    
    async GetTicketFilter() {
        return await AsyncStorage.getItem('TicketFilter').then((Output_Value) => {
            let _Object = (Output_Value !== null ? JSON.parse(Output_Value) : null);
            return {
                SearchType: (_Object !== null && _Object.hasOwnProperty('SearchType') && _Object.SearchType !== null ? _Object.SearchType : null),
                SearchText: (_Object !== null && _Object.hasOwnProperty('SearchText') && _Object.SearchText !== null ? _Object.SearchText : null),
                SearchStatus: (_Object !== null && _Object.hasOwnProperty('SearchStatus') && _Object.SearchStatus !== null ? _Object.SearchStatus : null),                                
            }
        });        
    },
    SetTicketFilter(Params_Value) {
        AsyncStorage.setItem('TicketFilter', JSON.stringify(Params_Value));
    },
    async GetCalendarFilter() {
        return await AsyncStorage.getItem('CalendarFilter').then((Output_Value) => {
            let _Object = (Output_Value !== null ? JSON.parse(Output_Value) : null);
            return {
                SearchText: (_Object !== null && _Object.hasOwnProperty('SearchText') && _Object.SearchText !== null ? _Object.SearchText : null),
                SearchStatus: (_Object !== null && _Object.hasOwnProperty('SearchStatus') && _Object.SearchStatus !== null ? _Object.SearchStatus : null),                                
            }
        });        
    },
    SetCalendarFilter(Params_Value) {
        AsyncStorage.setItem('CalendarFilter', JSON.stringify(Params_Value));
    },    
    async GetAccountFilter() {
        return await AsyncStorage.getItem('AccountFilter').then((Output_Value) => {
            let _Object = (Output_Value !== null ? JSON.parse(Output_Value) : null);
            return {
                SearchText: (_Object !== null && _Object.hasOwnProperty('SearchText') && _Object.SearchText !== null ? _Object.SearchText : null),                                
                SearchTag: (_Object !== null && _Object.hasOwnProperty('SearchTag') && _Object.SearchTag !== null ? _Object.SearchTag : null),
            }
        });
    },
    SetAccountFilter(Params_Value) {
        AsyncStorage.setItem('AccountFilter', JSON.stringify(Params_Value));
    },
    async GetPageFilter() {
        return await AsyncStorage.getItem('PageFilter').then((Output_Value) => {
            let _Object = (Output_Value !== null ? JSON.parse(Output_Value) : null);
            return {
                SearchText: (_Object !== null && _Object.hasOwnProperty('SearchText') && _Object.SearchText !== null ? _Object.SearchText : null),
                SearchStatus: (_Object !== null && _Object.hasOwnProperty('SearchStatus') && _Object.SearchStatus !== null ? _Object.SearchStatus : null),
            }
        });        
    },
    SetPageFilter(Params_Value) {
        AsyncStorage.setItem('PageFilter', JSON.stringify(Params_Value));
    },    
    async GetPersonFilter() {
        return await AsyncStorage.getItem('PersonFilter').then((Output_Value) => {
            let _Object = (Output_Value !== null ? JSON.parse(Output_Value) : null);
            return {
                SearchText: (_Object !== null && _Object.hasOwnProperty('SearchText') && _Object.SearchText !== null ? _Object.SearchText : null),
                SearchMarketing: (_Object !== null && _Object.hasOwnProperty('SearchMarketing') && _Object.SearchMarketing !== null ? _Object.SearchMarketing : null),
            }
        });        
    },
    SetPersonFilter(Params_Value) {
        AsyncStorage.setItem('PersonFilter', JSON.stringify(Params_Value));
    },
    async GetThreadFilter() {
        return await AsyncStorage.getItem('ThreadFilter').then((Output_Value) => {
            let _Object = (Output_Value !== null ? JSON.parse(Output_Value) : null);
            return {
                SearchText: (_Object !== null && _Object.hasOwnProperty('SearchText') && _Object.SearchText !== null ? _Object.SearchText : null),
            }
        });
    },
    SetThreadFilter(Params_Value) {
        AsyncStorage.setItem('ThreadFilter', JSON.stringify(Params_Value));
    },
    CreateTimestamp(OutputType_Value) {
        try {
            let _Now = new Date();
            let _Timestamp = _Now.getUTCFullYear().toString();
            _Timestamp += Global.PadInteger(_Now.getUTCMonth() + 1, 2).toString();
            _Timestamp += Global.PadInteger(_Now.getUTCDate().toString(), 2).toString();
            _Timestamp += Global.PadInteger(_Now.getUTCHours().toString(), 2).toString();
            _Timestamp += Global.PadInteger(_Now.getUTCMinutes().toString(), 2).toString();
            _Timestamp += Global.PadInteger(_Now.getUTCSeconds().toString(), 2).toString();
            _Timestamp += Global.PadInteger(_Now.getUTCMilliseconds().toString(), 3).toString();
            if (OutputType_Value === 'String') {
                return _Timestamp;
            } else {
                return parseInt(_Timestamp);
            }            
        } catch (ex) {
            throw Error('Global.CreateTimestamp>>' + ex.message);
        }
    },
    CheckedStyle(checked) {
        if (checked == true) {
            return {backgroundColor: '#4169E1'};
        } else {
            return {backgroundColor: 'transparent'};
        }
    },
    FormatOptionText(array, selected) {
        try {
            let _return = array.find(x=> x.Value === selected);
            if (_return != null) {
                return _return.Text;
            } else {
                return '';
            };
        } catch (e) {
            throw e;
        };
    },
    FormatShortDate(year, month, day) {
        if (month >= 1 && month <= 12) {
            return this.PadInteger(day, 2) + ' ' + this.FormatShortMonth(month) + ' \'' + this.FormatShortYear(year);
        } else {
            return 'N/A';
        }
    },
    FormatShortYear(year) {
        return String(year).slice(-2);
    },
    FormatLongMonth(month) {
        if (month == 1) {
            return 'January';
        } else if (month == 2) {
            return 'February';
        } else if (month == 3) {
            return 'March';
        } else if (month == 4) {
            return 'April';
        } else if (month == 5) {
            return 'May';
        } else if (month == 6) {
            return 'June';
        } else if (month == 7) {
            return 'July';
        } else if (month == 8) {
            return 'August';
        } else if (month == 9) {
            return 'September';
        } else if (month == 10) {
            return 'October';
        } else if (month == 11) {
            return 'November';
        } else if (month == 12) {
            return 'December';
        } else {
            return 'N/A';
        }
    },
    FormatShortMonth(month) {
        if (month == 1) {
            return 'JAN';
        } else if (month == 2) {
            return 'FEB';
        } else if (month == 3) {
            return 'MAR';
        } else if (month == 4) {
            return 'APR';
        } else if (month == 5) {
            return 'MAY';
        } else if (month == 6) {
            return 'JUN';
        } else if (month == 7) {
            return 'JUL';
        } else if (month == 8) {
            return 'AUG';
        } else if (month == 9) {
            return 'SEP';
        } else if (month == 10) {
            return 'OCT';
        } else if (month == 11) {
            return 'NOV';
        } else if (month == 12) {
            return 'DEC';
        } else {
            return 'N/A';
        }
    },
    FormatDaySuffix(Day_Value) {
        if (Day_Value === 1) {
            return 'st';
        } else if (Day_Value === 2) {
            return 'nd';
        } else if (Day_Value === 3) {
            return 'rd';
        } else if (Day_Value === 4) {
            return 'th';
        } else if (Day_Value === 5) {
            return 'th';
        } else if (Day_Value === 6) {
            return 'th';
        } else if (Day_Value === 7) {
            return 'th';
        } else if (Day_Value === 8) {
            return 'th';
        } else if (Day_Value === 9) {
            return 'th';
        } else {
            return '';
        }
    },
	FormatLongWeekDay(year, month, day) {
        var _DaysOfWeek = ['Sunday', 'Month', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];
        return _DaysOfWeek[new Date(year, month - 1, day).getDay()];
    },    
	FormatWeekDay(year, month, day) {
        var _DaysOfWeek = ['SUN', 'MON', 'TUE', 'WED', 'THU', 'FRI', 'SAT'];
        return _DaysOfWeek[new Date(year, month - 1, day).getDay()];
    },
    FormatCurrency(Currency_Value, Sum_Value, Precision_Value) {
        try {
            let _Symbol = null;
            let _Text = null;
            let _Value = parseFloat(Sum_Value);

            //If > 2 decimal places, drop trailing zeroes
            if (Precision_Value > 2) {
                let _Precision = parseFloat(Sum_Value).toString().indexOf('.') !== -1  ? parseFloat(Sum_Value).toString().split('.')[1].length : 0;
                if (_Precision < Precision_Value) {
                    Precision_Value = _Precision > 2 ? _Precision : 2;
                }
            }

            if (Currency_Value === 'AED') {
                if (Platform.OS === 'android') {
                    _Text = this.FormatNumber(Sum_Value, 2, '.', ',');
                } else {
                    _Symbol = '\u062f' + '\u002e' + '\u0625' + '\u002e';
                    _Text = this.FormatNumber(Sum_Value, 2, '.', ',');
                }            
            } else if (Currency_Value === 'ARS') {
                _Symbol = '$';
                _Text = this.FormatNumber(Sum_Value, Precision_Value, '.', ',');
            } else if (Currency_Value === 'AUD') {
                _Symbol = '$';
                _Text = this.FormatNumber(Sum_Value, Precision_Value, '.', ',');
            } else if (Currency_Value === 'BRL') {
                _Symbol = 'R$';
                _Text = this.FormatNumber(Sum_Value, Precision_Value, '.', ',');
            } else if (Currency_Value === 'BZD') {
                _Symbol = 'BZ$';
                _Text = this.FormatNumber(Sum_Value, Precision_Value, '.', ',');
            } else if (Currency_Value === 'CAD') {
                _Symbol = '$';
                _Text = this.FormatNumber(Sum_Value, Precision_Value, '.', ',');
            } else if (Currency_Value === 'EUR') {
                _Symbol = '€';
                _Text = this.FormatNumber(Sum_Value, Precision_Value, ',', '.');
            } else if (Currency_Value === 'FJD') {
                _Symbol = '$';
                _Text = this.FormatNumber(Sum_Value, Precision_Value, '.', ',');
            } else if (Currency_Value === 'GBP') {
                _Symbol = '£';
                _Text = this.FormatNumber(Sum_Value, Precision_Value, '.', ',');
            } else if (Currency_Value === 'GTQ') {
                _Symbol = 'Q';
                _Text = this.FormatNumber(Sum_Value, Precision_Value, '.', ',');
            } else if (Currency_Value === 'JMD') {
                _Symbol = 'J$';
                _Text = this.FormatNumber(Sum_Value, Precision_Value, '.', ',');
            } else if (Currency_Value === 'KSH') {
                _Symbol = 'KSH';
                _Text = this.FormatNumber(Sum_Value, Precision_Value, '.', ',');
            } else if (Currency_Value === 'MXN') {
                _Symbol = '$';
                _Text = this.FormatNumber(Sum_Value, Precision_Value, '.', ',');
            } else if (Currency_Value === 'MZN') {
                _Symbol = 'MT';
                _Text = this.FormatNumber(Sum_Value, Precision_Value, '.', ',');
            } else if (Currency_Value === 'NAD') {
                _Symbol = '$';
                _Text = this.FormatNumber(Sum_Value, Precision_Value, '.', ',');
            } else if (Currency_Value === 'NGN') {
                _Symbol = '₦';
                _Text = this.FormatNumber(Sum_Value, Precision_Value, '.', ',');
            } else if (Currency_Value === 'NZD') {
                _Symbol = '$';
                _Text = this.FormatNumber(Sum_Value, Precision_Value, '.', ',');
            } else if (Currency_Value === 'PAB') {
                _Symbol = 'B/.';
                _Text = this.FormatNumber(Sum_Value, Precision_Value, '.', ',');
            } else if (Currency_Value === 'PHP') {
                _Symbol = '₱';
                _Text = this.FormatNumber(Sum_Value, Precision_Value, '.', ',');
            } else if (Currency_Value === 'SAR') {
                if (Platform.OS === 'android') {
                    _Text = this.FormatNumber(Sum_Value, Precision_Value, '.', ',');
                } else {
                    _Symbol = '\u0631' + '\u002e' + '\u0633';
                    _Text = this.FormatNumber(Sum_Value, 2, '.', ',');
                }
            } else if (Currency_Value === 'TTD') {
                _Symbol = 'TT$';
                _Text = this.FormatNumber(Sum_Value, Precision_Value, '.', ',');
            } else if (Currency_Value === 'TZS') {
                _Symbol = 'TSh';
                _Text = this.FormatNumber(Sum_Value, Precision_Value, '.', ',');
            } else if (Currency_Value === 'UGX') {
                _Symbol = 'USh';
                _Text = this.FormatNumber(Sum_Value, Precision_Value, '.', ',');
            } else if (Currency_Value === 'USD') {
                _Symbol = '$';
                _Text = this.FormatNumber(Sum_Value, Precision_Value, '.', ',');
            } else if (Currency_Value === 'ZAR') {
                _Symbol = 'R';
                _Text = this.FormatNumber(Sum_Value, Precision_Value, '.', ',');
            } else if (Currency_Value === 'ZMK') {
                _Symbol = 'ZMK';
                _Text = this.FormatNumber(Sum_Value, Precision_Value, '.', ',');
            } else if (Currency_Value === 'ZWL') {
                _Symbol = 'Z$';
                _Text = this.FormatNumber(Sum_Value, Precision_Value, '.', ',');
            } else {
                _Symbol = '$';
                _Text = this.FormatNumber(Sum_Value, Precision_Value, '.', ',');
            }
            return {
                Symbol: _Symbol,
                Value: _Value,
                Text: _Text,
            }
        } catch (ex) {
            throw Error('Global.FormatCurrency>>' + ex.message);
        }
    },
    FormatLocalCurrency(Currency_Value, Sum_Value, Precision_Value) {

        //If > 2 decimal places, drop trailing zeroes
        if (Precision_Value > 2) {
            let _Precision = parseFloat(Sum_Value).toString().indexOf('.') !== -1  ? parseFloat(Sum_Value).toString().split('.')[1].length : 0;
            if (_Precision < Precision_Value) {
                Precision_Value = _Precision > 2 ? _Precision : 2;
            }
        }

        if (Currency_Value === 'AED') {
            if (Platform.OS === 'android') {
                return this.FormatNumber(Sum_Value, 2, '.', ',');
            } else {
                return '\u062f' + '\u002e' + '\u0625' + '\u002e' + this.FormatNumber(Sum_Value, 2, '.', ',');
            }            
        } else if (Currency_Value === 'ARS') {
            return '$' + this.FormatNumber(Sum_Value, Precision_Value, '.', ',');
        } else if (Currency_Value === 'AUD') {
            return '$' + this.FormatNumber(Sum_Value, Precision_Value, '.', ',');
        } else if (Currency_Value === 'BRL') {
            return 'R$' + this.FormatNumber(Sum_Value, Precision_Value, '.', ',');
        } else if (Currency_Value === 'BZD') {
            return 'BZ$' + this.FormatNumber(Sum_Value, Precision_Value, '.', ',');
        } else if (Currency_Value === 'CAD') {
            return '$' + this.FormatNumber(Sum_Value, Precision_Value, '.', ',');
        } else if (Currency_Value === 'EUR') {
            return '€' + this.FormatNumber(Sum_Value, Precision_Value, ',', '.');
        } else if (Currency_Value === 'FJD') {
            return '$' + this.FormatNumber(Sum_Value, Precision_Value, '.', ',');
        } else if (Currency_Value === 'GBP') {
            return '£' + this.FormatNumber(Sum_Value, Precision_Value, '.', ',');
        } else if (Currency_Value === 'GTQ') {
            return 'Q' + this.FormatNumber(Sum_Value, Precision_Value, '.', ',');
        } else if (Currency_Value === 'JMD') {
            return 'J$' + this.FormatNumber(Sum_Value, Precision_Value, '.', ',');
        } else if (Currency_Value === 'KSH') {
            return 'KSH' + this.FormatNumber(Sum_Value, Precision_Value, '.', ',');
        } else if (Currency_Value === 'MXN') {
            return '$' + this.FormatNumber(Sum_Value, Precision_Value, '.', ',');
        } else if (Currency_Value === 'MZN') {
            return 'MT' + this.FormatNumber(Sum_Value, Precision_Value, '.', ',');
        } else if (Currency_Value === 'NAD') {
            return '$' + this.FormatNumber(Sum_Value, Precision_Value, '.', ',');
        } else if (Currency_Value === 'NGN') {
            return '₦' + this.FormatNumber(Sum_Value, Precision_Value, '.', ',');
        } else if (Currency_Value === 'NZD') {
            return '$' + this.FormatNumber(Sum_Value, Precision_Value, '.', ',');
        } else if (Currency_Value === 'PAB') {
            return 'B/.' + this.FormatNumber(Sum_Value, Precision_Value, '.', ',');
        } else if (Currency_Value === 'PHP') {
            return '₱' + this.FormatNumber(Sum_Value, Precision_Value, '.', ',');
        } else if (Currency_Value === 'SAR') {
            if (Platform.OS === 'android') {
                return this.FormatNumber(Sum_Value, Precision_Value, '.', ',');
            } else {
                return '\u0631' + '\u002e' + '\u0633' + this.FormatNumber(Sum_Value, 2, '.', ',');
            }
        } else if (Currency_Value === 'TTD') {
            return 'TT$' + this.FormatNumber(Sum_Value, Precision_Value, '.', ',');
        } else if (Currency_Value === 'TZS') {
            return 'TSh' + this.FormatNumber(Sum_Value, Precision_Value, '.', ',');
        } else if (Currency_Value === 'UGX') {
            return 'USh' + this.FormatNumber(Sum_Value, Precision_Value, '.', ',');
        } else if (Currency_Value === 'USD') {
            return '$' + this.FormatNumber(Sum_Value, Precision_Value, '.', ',');
        } else if (Currency_Value === 'ZAR') {
            return 'R' + this.FormatNumber(Sum_Value, Precision_Value, '.', ',');
        } else if (Currency_Value === 'ZMK') {
            return 'ZMK' + this.FormatNumber(Sum_Value, Precision_Value, '.', ',');
        } else if (Currency_Value === 'ZWL') {
            return 'Z$' + this.FormatNumber(Sum_Value, Precision_Value, '.', ',');        
        }
        return '$' + this.FormatNumber(Sum_Value, Precision_Value, '.', ',');
    },
    FormatTimespan(Milli_Value) {
        if (Milli_Value < 1000) {
            return Milli_Value + 'ms';
        } else {
            return parseFloat(Milli_Value / 1000) + 's'
        }
    },
    FormatNumber(number, decimals, dec_point, thousands_sep) {
        var n = number, prec = decimals;

        var toFixedFix = function (n, prec) {
            var k = Math.pow(10, prec);
            return (Math.round(n * k) / k).toString();
        };

        n = !isFinite(+n) ? 0 : +n;
        prec = !isFinite(+prec) ? 0 : Math.abs(prec);
        var sep = (typeof thousands_sep === 'undefined') ? ',' : thousands_sep;
        var dec = (typeof dec_point === 'undefined') ? '.' : dec_point;

        var s = (prec > 0) ? toFixedFix(n, prec) : toFixedFix(Math.round(n), prec); //fix for IE parseFloat(0.55).toFixed(0) = 0;

        var abs = toFixedFix(Math.abs(n), prec);
        var _, i;

        if (abs >= 1000) {
            _ = abs.split(/\D/);
            i = _[0].length % 3 || 3;

            _[0] = s.slice(0, i + (n < 0)) +
                _[0].slice(i).replace(/(\d{3})/g, sep + '$1');
            s = _.join(dec);
        } else {
            s = s.replace('.', dec);
        }

        var decPos = s.indexOf(dec);
        if (prec >= 1 && decPos !== -1 && (s.length - decPos - 1) < prec) {
            s += new Array(prec - (s.length - decPos - 1)).join(0) + '0';
        }
        else if (prec >= 1 && decPos === -1) {
            s += dec + new Array(prec).join(0) + '0';
        }
        return s;
    },
    FormatFileSize(Bytes_Value) {
        if (Bytes_Value < 1024) {
            return Bytes_Value + 'B';
        } else if(Bytes_Value >= 1024 && Bytes_Value < 1048576) {
            return (Bytes_Value/1024).toFixed(1) + 'Kb';
        } else if(Bytes_Value >= 1048576) {
            return (Bytes_Value/1048576).toFixed(1) + 'Mb';
        }
    },
    Lookup_CountryTypes() {
        return [
            { Value: null, Text: 'N/A' },
            { Value: 'Argentina', Text: 'Argentina' },
            { Value: 'Australia', Text: 'Australia' },
            { Value: 'Belize', Text: 'Belize' },
            { Value: 'Brazil', Text: 'Brazil' },
            { Value: 'Canada', Text: 'Canada' },
            { Value: 'England', Text: 'England' },
            { Value: 'Fiji', Text: 'Fiji' },
            { Value: 'Guatemala', Text: 'Guatemala' },
            { Value: 'Ireland', Text: 'Ireland' },
            { Value: 'Jamaica', Text: 'Jamaica' },
            { Value: 'Kenya', Text: 'Kenya' },
            { Value: 'Mexico', Text: 'Mexico' },
            { Value: 'Mozambique', Text: 'Mozambique' },
            { Value: 'Namibia', Text: 'Namibia' },
            { Value: 'New Zealand', Text: 'New Zealand' },
            { Value: 'Nigeria', Text: 'Nigeria' },
            { Value: 'Panama', Text: 'Panama' },
            { Value: 'Philippines', Text: 'Philippines' },
            { Value: 'Saudi Arabia', Text: 'Saudi Arabia' },
            { Value: 'Scotland', Text: 'Scotland' },
            { Value: 'South Africa', Text: 'South Africa' },
            { Value: 'Tanzania', Text: 'Tanzania' },            
            { Value: 'Trinidad and Tobago', Text: 'Trinidad and Tobago' },
            { Value: 'Uganda', Text: 'Uganda' },
            { Value: 'United Arab Emirates', Text: 'United Arab Emirates' },
            { Value: 'United States', Text: 'United States' },
            { Value: 'Wales', Text: 'Wales' },
            { Value: 'Zambia', Text: 'Zambia' },
            { Value: 'Zimbabwe', Text: 'Zimbabwe' }            
        ];
    },
    Lookup_StateTypes(Country_Value) {
        try {
            if (Country_Value.toUpperCase() === 'ARGENTINA') {
                return [
                    { Value: null, Text: 'N/A' },
                    { Value: 'Ciudad de Buenos Aires', Text: 'Ciudad de Buenos Aires' },
                    { Value: 'Buenos Aires', Text: 'Buenos Aires' },
                    { Value: 'Catamarca', Text: 'Catamarca' },
                    { Value: 'Chaco', Text: 'Chaco' },
                    { Value: 'Chubut', Text: 'Chubut' },
                    { Value: 'Córdoba', Text: 'Córdoba' },
                    { Value: 'Corrientes', Text: 'Corrientes' },
                    { Value: 'Entre Ríos', Text: 'Entre Ríos' },
                    { Value: 'Formosa', Text: 'Formosa' },
                    { Value: 'Jujuy', Text: 'Jujuy' },
                    { Value: 'La Pampa', Text: 'La Pampa' },
                    { Value: 'La Rioja', Text: 'La Rioja' },
                    { Value: 'Mendoza', Text: 'Mendoza' },
                    { Value: 'Misiones', Text: 'Misiones' },
                    { Value: 'Neuquén', Text: 'Neuquén' },
                    { Value: 'Río Negro', Text: 'Río Negro' },
                    { Value: 'Salta', Text: 'Salta' },
                    { Value: 'San Juan', Text: 'San Juan' },
                    { Value: 'San Luis', Text: 'San Luis' },
                    { Value: 'Santa Cruz', Text: 'Santa Cruz' },
                    { Value: 'Santa Fe', Text: 'Santa Fe' },
                    { Value: 'Santiago del Estero', Text: 'Santiago del Estero' },
                    { Value: 'Tierra del Fuego', Text: 'Tierra del Fuego' },
                    { Value: 'Tucumán', Text: 'Tucumán' },
                ];
            } else if (Country_Value.toUpperCase() === 'AUSTRALIA') {
                return [
                    { Value: null, Text:'N/A' },
                    { Value:'ACT', Text:'ACT' },
                    { Value:'NSW', Text:'NSW' },
                    { Value:'NT', Text:'NT' },
                    { Value:'QLD', Text:'QLD' },
                    { Value:'SA', Text:'SA' },
                    { Value:'TAS', Text:'TAS' },
                    { Value:'VIC', Text:'VIC' },
                    { Value:'WA', Text:'WA' },
                ];
            } else if (Country_Value.toUpperCase() === 'BELIZE') {
                return [
                    { Value: null, Text: 'N/A' },
                    { Value: 'Belize', Text: 'Belize' },
                    { Value: 'Cayo', Text: 'Cayo' },
                    { Value: 'Corozal', Text: 'Corozal' },
                    { Value: 'Orange Walk', Text: 'Orange Walk' },
                    { Value: 'Stann Creek', Text: 'Stann Creek' },
                    { Value: 'Toledo', Text: 'Toledo' }
                ];
            } else if (Country_Value.toUpperCase() === 'BRAZIL') {
                return [
                    { Value: null, Text: 'N/A' },
                    {Value:'AC', Text:'AC'},
                    {Value:'AL', Text:'AL'},
                    {Value:'AP', Text:'AP'},
                    {Value:'AM', Text:'AM'},
                    {Value:'BA', Text:'BA'},
                    {Value:'CE', Text:'CE'},
                    {Value:'DF', Text:'DF'},
                    {Value:'ES', Text:'ES'},
                    {Value:'GO', Text:'GO'},
                    {Value:'MA', Text:'MA'},
                    {Value:'MT', Text:'MT'},
                    {Value:'MS', Text:'MS'},
                    {Value:'MG', Text:'MG'},
                    {Value:'PA', Text:'PA'},
                    {Value:'PB', Text:'PB'},
                    {Value:'PR', Text:'PR'},
                    {Value:'PE', Text:'PE'},
                    {Value:'PI', Text:'PI'},
                    {Value:'RJ', Text:'RJ'},
                    {Value:'RN', Text:'RN'},
                    {Value:'RS', Text:'RS'},
                    {Value:'RO', Text:'RO'},
                    {Value:'RR', Text:'RR'},
                    {Value:'SC', Text:'SC'},
                    {Value:'SP', Text:'SP'},
                    {Value:'SE', Text:'SE'},
                    {Value:'TO', Text:'TO'},
                ];
            } else if (Country_Value.toUpperCase() === 'CANADA') {
                return [
                    { Value: null, Text: 'N/A' },
                    {Value:'AB', Text:'AB'},
                    {Value:'BC', Text:'BC'},
                    {Value:'MB', Text:'MB'},
                    {Value:'NB', Text:'NB'},
                    {Value:'NL', Text:'NL'},
                    {Value:'NS', Text:'NS'},
                    {Value:'ON', Text:'ON'},
                    {Value:'PE', Text:'PE'},
                    {Value:'QC', Text:'QC'},
                    {Value:'SK', Text:'SK'}
                ];
            } else if (Country_Value.toUpperCase() === 'ENGLAND') {
                return [
                    { Value: null, Text: 'N/A' },
                    { Value: 'ABINGDON', Text: 'ABINGDON' },
                    { Value: 'ACCRINGTON', Text: 'ACCRINGTON' },
                    { Value: 'ACLE', Text: 'ACLE' },
                    { Value: 'ACTON', Text: 'ACTON' },
                    { Value: 'ADLINGTON', Text: 'ADLINGTON' },
                    { Value: 'ALCESTER', Text: 'ALCESTER' },
                    { Value: 'ALDEBURGH', Text: 'ALDEBURGH' },
                    { Value: 'ALDERSHOT', Text: 'ALDERSHOT' },
                    { Value: 'ALDRIDGE', Text: 'ALDRIDGE' },
                    { Value: 'ALFORD', Text: 'ALFORD' },
                    { Value: 'ALFRETON', Text: 'ALFRETON' },
                    { Value: 'ALNWICK', Text: 'ALNWICK' },
                    { Value: 'ALSAGER', Text: 'ALSAGER' },
                    { Value: 'ALSTON', Text: 'ALSTON' },
                    { Value: 'ALTON', Text: 'ALTON' },
                    { Value: 'ALTON', Text: 'ALTON' },
                    { Value: 'ALTRINCHAM', Text: 'ALTRINCHAM' },
                    { Value: 'AMBLE', Text: 'AMBLE' },
                    { Value: 'AMBLESIDE', Text: 'AMBLESIDE' },
                    { Value: 'AMERSHAM', Text: 'AMERSHAM' },
                    { Value: 'AMESBURY', Text: 'AMESBURY' },
                    { Value: 'AMPTHILL', Text: 'AMPTHILL' },
                    { Value: 'ANDOVER', Text: 'ANDOVER' },
                    { Value: 'ANSTON', Text: 'ANSTON' },
                    { Value: 'APPLEBY IN WESTMORLAND', Text: 'APPLEBY IN WESTMORLAND' },
                    { Value: 'APPLEY', Text: 'APPLEY' },
                    { Value: 'ARLESEY', Text: 'ARLESEY' },
                    { Value: 'ARNOLD', Text: 'ARNOLD' },
                    { Value: 'ARUNDEL', Text: 'ARUNDEL' },
                    { Value: 'ASCOT', Text: 'ASCOT' },
                    { Value: 'ASHBOURNE', Text: 'ASHBOURNE' },
                    { Value: 'ASHBURTON', Text: 'ASHBURTON' },
                    { Value: 'ASHBY DE LA ZOUCH', Text: 'ASHBY DE LA ZOUCH' },
                    { Value: 'ASHBY WOULDS', Text: 'ASHBY WOULDS' },
                    { Value: 'ASHFORD', Text: 'ASHFORD' },
                    { Value: 'ASHFORD', Text: 'ASHFORD' },
                    { Value: 'ASHINGTON', Text: 'ASHINGTON' },
                    { Value: 'ASHTON IN MAKERFIELD', Text: 'ASHTON IN MAKERFIELD' },
                    { Value: 'ASHTON UNDER LYNE', Text: 'ASHTON UNDER LYNE' },
                    { Value: 'ASKERN', Text: 'ASKERN' },
                    { Value: 'ASPATRIA', Text: 'ASPATRIA' },
                    { Value: 'ATHERSTONE', Text: 'ATHERSTONE' },
                    { Value: 'ATHERTON', Text: 'ATHERTON' },
                    { Value: 'ATTLEBOROUGH', Text: 'ATTLEBOROUGH' },
                    { Value: 'AUDENSHAW', Text: 'AUDENSHAW' },
                    { Value: 'AXBRIDGE', Text: 'AXBRIDGE' },
                    { Value: 'AXMINSTER', Text: 'AXMINSTER' },
                    { Value: 'AYLESBURY', Text: 'AYLESBURY' },
                    { Value: 'AYLSHAM', Text: 'AYLSHAM' },
                    { Value: 'BACUP', Text: 'BACUP' },
                    { Value: 'BAILDON', Text: 'BAILDON' },
                    { Value: 'BAKEWELL', Text: 'BAKEWELL' },
                    { Value: 'BALDOCK', Text: 'BALDOCK' },
                    { Value: 'BAMPTON', Text: 'BAMPTON' },
                    { Value: 'BANBURY', Text: 'BANBURY' },
                    { Value: 'BARKING', Text: 'BARKING' },
                    { Value: 'BARNARD CASTLE', Text: 'BARNARD CASTLE' },
                    { Value: 'BARNES', Text: 'BARNES' },
                    { Value: 'BARNET', Text: 'BARNET' },
                    { Value: 'BARNOLDSWICK', Text: 'BARNOLDSWICK' },
                    { Value: 'BARNSLEY', Text: 'BARNSLEY' },
                    { Value: 'BARNSTAPLE', Text: 'BARNSTAPLE' },
                    { Value: 'BARROW HILL AND WHITTINGTON', Text: 'BARROW HILL AND WHITTINGTON' },
                    { Value: 'BARROW IN FURNESS', Text: 'BARROW IN FURNESS' },
                    { Value: 'BARTON UPON HUMBER', Text: 'BARTON UPON HUMBER' },
                    { Value: 'BASILDON', Text: 'BASILDON' },
                    { Value: 'BASINGSTOKE', Text: 'BASINGSTOKE' },
                    { Value: 'BATH', Text: 'BATH' },
                    { Value: 'BATLEY', Text: 'BATLEY' },
                    { Value: 'BATTLE', Text: 'BATTLE' },
                    { Value: 'BAWTRY', Text: 'BAWTRY' },
                    { Value: 'BEACONSFIELD', Text: 'BEACONSFIELD' },
                    { Value: 'BEAMINSTER', Text: 'BEAMINSTER' },
                    { Value: 'BEBINGTON', Text: 'BEBINGTON' },
                    { Value: 'BECCLES', Text: 'BECCLES' },
                    { Value: 'BECKENHAM', Text: 'BECKENHAM' },
                    { Value: 'BEDALE', Text: 'BEDALE' },
                    { Value: 'BEDFORD', Text: 'BEDFORD' },
                    { Value: 'BEDLINGTON', Text: 'BEDLINGTON' },
                    { Value: 'BEDWORTH', Text: 'BEDWORTH' },
                    { Value: 'BEESTON', Text: 'BEESTON' },
                    { Value: 'BELPER', Text: 'BELPER' },
                    { Value: 'BELTCHINGLEY', Text: 'BELTCHINGLEY' },
                    { Value: 'BENTHAM', Text: 'BENTHAM' },
                    { Value: 'BERKELEY', Text: 'BERKELEY' },
                    { Value: 'BERKHAMSTED', Text: 'BERKHAMSTED' },
                    { Value: 'BERWICK UPON TWEED', Text: 'BERWICK UPON TWEED' },
                    { Value: 'BEVERLEY', Text: 'BEVERLEY' },
                    { Value: 'BEWDLEY', Text: 'BEWDLEY' },
                    { Value: 'BEXHILL ON SEA', Text: 'BEXHILL ON SEA' },
                    { Value: 'BEXLEY', Text: 'BEXLEY' },
                    { Value: 'BICESTER', Text: 'BICESTER' },
                    { Value: 'BIDDULPH', Text: 'BIDDULPH' },
                    { Value: 'BIDEFORD', Text: 'BIDEFORD' },
                    { Value: 'BIGGLESWADE', Text: 'BIGGLESWADE' },
                    { Value: 'BILLERICAY', Text: 'BILLERICAY' },
                    { Value: 'BILLINGHAM', Text: 'BILLINGHAM' },
                    { Value: 'BILSTON', Text: 'BILSTON' },
                    { Value: 'BINGHAM', Text: 'BINGHAM' },
                    { Value: 'BINGLEY', Text: 'BINGLEY' },
                    { Value: 'BIRCHWOOD', Text: 'BIRCHWOOD' },
                    { Value: 'BIRKENHEAD', Text: 'BIRKENHEAD' },
                    { Value: 'BIRMINGHAM', Text: 'BIRMINGHAM' },
                    { Value: 'BIRTLEY', Text: 'BIRTLEY' },
                    { Value: 'BISHOP AUCKLAND', Text: 'BISHOP AUCKLAND' },
                    { Value: 'BISHOP\'S CASTLE', Text: 'BISHOP\'S CASTLE' },
                    { Value: 'BISHOP\'S STORTFORD', Text: 'BISHOP\'S STORTFORD' },
                    { Value: 'BISHOP\'S WALTHAM', Text: 'BISHOP\'S WALTHAM' },
                    { Value: 'BLACKBURN', Text: 'BLACKBURN' },
                    { Value: 'BLACKHEATH', Text: 'BLACKHEATH' },
                    { Value: 'BLACKPOOL', Text: 'BLACKPOOL' },
                    { Value: 'BLACKROD', Text: 'BLACKROD' },
                    { Value: 'BLACKWATER AND HAWLEY', Text: 'BLACKWATER AND HAWLEY' },
                    { Value: 'BLANDFORD FORUM', Text: 'BLANDFORD FORUM' },
                    { Value: 'BLAYDON ON TYNE', Text: 'BLAYDON ON TYNE' },
                    { Value: 'BLETCHLEY', Text: 'BLETCHLEY' },
                    { Value: 'BLOXWICH', Text: 'BLOXWICH' },
                    { Value: 'BLYTH', Text: 'BLYTH' },
                    { Value: 'BODMIN', Text: 'BODMIN' },
                    { Value: 'BOGNOR REGIS', Text: 'BOGNOR REGIS' },
                    { Value: 'BOLLINGTON', Text: 'BOLLINGTON' },
                    { Value: 'BOLSOVER', Text: 'BOLSOVER' },
                    { Value: 'BOLTON', Text: 'BOLTON' },
                    { Value: 'BOOTLE', Text: 'BOOTLE' },
                    { Value: 'BORDON', Text: 'BORDON' },
                    { Value: 'BOREHAMWOOD', Text: 'BOREHAMWOOD' },
                    { Value: 'BOROUGHBRIDGE', Text: 'BOROUGHBRIDGE' },
                    { Value: 'BOSTON', Text: 'BOSTON' },
                    { Value: 'BOTTESFORD', Text: 'BOTTESFORD' },
                    { Value: 'BOURNE', Text: 'BOURNE' },
                    { Value: 'BOURNEMOUTH', Text: 'BOURNEMOUTH' },
                    { Value: 'BOVEY TRACEY', Text: 'BOVEY TRACEY' },
                    { Value: 'BOWNESS ON WINDERMERE', Text: 'BOWNESS ON WINDERMERE' },
                    { Value: 'BRACEBRIDGE', Text: 'BRACEBRIDGE' },
                    { Value: 'BRACKLEY', Text: 'BRACKLEY' },
                    { Value: 'BRACKNELL', Text: 'BRACKNELL' },
                    { Value: 'BRADFORD', Text: 'BRADFORD' },
                    { Value: 'BRADFORD ON AVON', Text: 'BRADFORD ON AVON' },
                    { Value: 'BRADING', Text: 'BRADING' },
                    { Value: 'BRADLEY STOKE', Text: 'BRADLEY STOKE' },
                    { Value: 'BRADNINCH', Text: 'BRADNINCH' },
                    { Value: 'BRAINTREE', Text: 'BRAINTREE' },
                    { Value: 'BRAMPTON', Text: 'BRAMPTON' },
                    { Value: 'BRANDON', Text: 'BRANDON' },
                    { Value: 'BRAUNSTONE TOWN', Text: 'BRAUNSTONE TOWN' },
                    { Value: 'BRENTFORD', Text: 'BRENTFORD' },
                    { Value: 'BRENTWOOD', Text: 'BRENTWOOD' },
                    { Value: 'BRIDGNORTH', Text: 'BRIDGNORTH' },
                    { Value: 'BRIDGWATER', Text: 'BRIDGWATER' },
                    { Value: 'BRIDLINGTON', Text: 'BRIDLINGTON' },
                    { Value: 'BRIDPORT', Text: 'BRIDPORT' },
                    { Value: 'BRIERFIELD', Text: 'BRIERFIELD' },
                    { Value: 'BRIERLEY', Text: 'BRIERLEY' },
                    { Value: 'BRIERLEY HILL', Text: 'BRIERLEY HILL' },
                    { Value: 'BRIGG', Text: 'BRIGG' },
                    { Value: 'BRIGHOUSE', Text: 'BRIGHOUSE' },
                    { Value: 'BRIGHTLINGSEA', Text: 'BRIGHTLINGSEA' },
                    { Value: 'BRIGHTON', Text: 'BRIGHTON' },
                    { Value: 'BRISTOL', Text: 'BRISTOL' },
                    { Value: 'BRIXHAM', Text: 'BRIXHAM' },
                    { Value: 'BROADSTAIRS', Text: 'BROADSTAIRS' },
                    { Value: 'BROMBOROUGH', Text: 'BROMBOROUGH' },
                    { Value: 'BROMLEY', Text: 'BROMLEY' },
                    { Value: 'BROMSGROVE', Text: 'BROMSGROVE' },
                    { Value: 'BROMYARD', Text: 'BROMYARD' },
                    { Value: 'BROSELEY', Text: 'BROSELEY' },
                    { Value: 'BROUGH', Text: 'BROUGH' },
                    { Value: 'BROUGHTON', Text: 'BROUGHTON' },
                    { Value: 'BROUGHTON IN FURNESS', Text: 'BROUGHTON IN FURNESS' },
                    { Value: 'BROWNHILLS', Text: 'BROWNHILLS' },
                    { Value: 'BROXBOURNE', Text: 'BROXBOURNE' },
                    { Value: 'BRUTON', Text: 'BRUTON' },
                    { Value: 'BUCKFASTLEIGH', Text: 'BUCKFASTLEIGH' },
                    { Value: 'BUCKHURST HILL', Text: 'BUCKHURST HILL' },
                    { Value: 'BUCKINGHAM', Text: 'BUCKINGHAM' },
                    { Value: 'BUDE', Text: 'BUDE' },
                    { Value: 'BUDLEIGH SALTERTON', Text: 'BUDLEIGH SALTERTON' },
                    { Value: 'BULWELL', Text: 'BULWELL' },
                    { Value: 'BUNGAY', Text: 'BUNGAY' },
                    { Value: 'BUNTINGFORD', Text: 'BUNTINGFORD' },
                    { Value: 'BURFORD', Text: 'BURFORD' },
                    { Value: 'BURGESS HILL', Text: 'BURGESS HILL' },
                    { Value: 'BURGH LE MARSH', Text: 'BURGH LE MARSH' },
                    { Value: 'BURNHAM ON CROUCH', Text: 'BURNHAM ON CROUCH' },
                    { Value: 'BURNHAM ON SEA', Text: 'BURNHAM ON SEA' },
                    { Value: 'BURNLEY', Text: 'BURNLEY' },
                    { Value: 'BURNTWOOD', Text: 'BURNTWOOD' },
                    { Value: 'BURSLEM', Text: 'BURSLEM' },
                    { Value: 'BURTON LATIMER', Text: 'BURTON LATIMER' },
                    { Value: 'BURTON UPON TRENT', Text: 'BURTON UPON TRENT' },
                    { Value: 'BURY', Text: 'BURY' },
                    { Value: 'BURY ST EDMUNDS', Text: 'BURY ST EDMUNDS' },
                    { Value: 'BUSHEY', Text: 'BUSHEY' },
                    { Value: 'BUXTON', Text: 'BUXTON' },
                    { Value: 'CADISHEAD', Text: 'CADISHEAD' },
                    { Value: 'CAISTER ON SEA', Text: 'CAISTER ON SEA' },
                    { Value: 'CAISTOR', Text: 'CAISTOR' },
                    { Value: 'CALLINGTON', Text: 'CALLINGTON' },
                    { Value: 'CALNE', Text: 'CALNE' },
                    { Value: 'CAMBERLEY', Text: 'CAMBERLEY' },
                    { Value: 'CAMBORNE', Text: 'CAMBORNE' },
                    { Value: 'CAMBRIDGE', Text: 'CAMBRIDGE' },
                    { Value: 'CAMELFORD', Text: 'CAMELFORD' },
                    { Value: 'CANNOCK', Text: 'CANNOCK' },
                    { Value: 'CANTERBURY', Text: 'CANTERBURY' },
                    { Value: 'CANVEY ISLAND', Text: 'CANVEY ISLAND' },
                    { Value: 'CARLISLE', Text: 'CARLISLE' },
                    { Value: 'CARLTON', Text: 'CARLTON' },
                    { Value: 'CARLTON COLVILLE', Text: 'CARLTON COLVILLE' },
                    { Value: 'CARNFORTH', Text: 'CARNFORTH' },
                    { Value: 'CARTERTON', Text: 'CARTERTON' },
                    { Value: 'CASTLE CARY', Text: 'CASTLE CARY' },
                    { Value: 'CASTLEFORD', Text: 'CASTLEFORD' },
                    { Value: 'CHADDERTON', Text: 'CHADDERTON' },
                    { Value: 'CHAFFORD HUNDRED', Text: 'CHAFFORD HUNDRED' },
                    { Value: 'CHAGFORD', Text: 'CHAGFORD' },
                    { Value: 'CHAPEL EN LE FRITH', Text: 'CHAPEL EN LE FRITH' },
                    { Value: 'CHARD', Text: 'CHARD' },
                    { Value: 'CHARLBURY', Text: 'CHARLBURY' },
                    { Value: 'CHARLESTOWN', Text: 'CHARLESTOWN' },
                    { Value: 'CHATHAM', Text: 'CHATHAM' },
                    { Value: 'CHATTERIS', Text: 'CHATTERIS' },
                    { Value: 'CHEADLE', Text: 'CHEADLE' },
                    { Value: 'CHEADLE HULME', Text: 'CHEADLE HULME' },
                    { Value: 'CHELMSFORD', Text: 'CHELMSFORD' },
                    { Value: 'CHELTENHAM', Text: 'CHELTENHAM' },
                    { Value: 'CHERTSEY', Text: 'CHERTSEY' },
                    { Value: 'CHESHAM', Text: 'CHESHAM' },
                    { Value: 'CHESHUNT', Text: 'CHESHUNT' },
                    { Value: 'CHESTER', Text: 'CHESTER' },
                    { Value: 'CHESTER LE STREET', Text: 'CHESTER LE STREET' },
                    { Value: 'CHESTERFIELD', Text: 'CHESTERFIELD' },
                    { Value: 'CHICHESTER', Text: 'CHICHESTER' },
                    { Value: 'CHICKERELL', Text: 'CHICKERELL' },
                    { Value: 'CHINGFORD', Text: 'CHINGFORD' },
                    { Value: 'CHIPPENHAM', Text: 'CHIPPENHAM' },
                    { Value: 'CHIPPING CAMPDEN', Text: 'CHIPPING CAMPDEN' },
                    { Value: 'CHIPPING NORTON', Text: 'CHIPPING NORTON' },
                    { Value: 'CHIPPING SODBURY', Text: 'CHIPPING SODBURY' },
                    { Value: 'CHORLEY', Text: 'CHORLEY' },
                    { Value: 'CHORLEYWOOD', Text: 'CHORLEYWOOD' },
                    { Value: 'CHRISTCHURCH', Text: 'CHRISTCHURCH' },
                    { Value: 'CHUDLEIGH', Text: 'CHUDLEIGH' },
                    { Value: 'CHULMLEIGH', Text: 'CHULMLEIGH' },
                    { Value: 'CHURCH STRETTON', Text: 'CHURCH STRETTON' },
                    { Value: 'CINDERFORD', Text: 'CINDERFORD' },
                    { Value: 'CIRENCESTER', Text: 'CIRENCESTER' },
                    { Value: 'CLACKWELL', Text: 'CLACKWELL' },
                    { Value: 'CLACTON ON SEA', Text: 'CLACTON ON SEA' },
                    { Value: 'CLARE', Text: 'CLARE' },
                    { Value: 'CLAY CROSS', Text: 'CLAY CROSS' },
                    { Value: 'CLAYTON LE MOORS', Text: 'CLAYTON LE MOORS' },
                    { Value: 'CLEATOR MOOR', Text: 'CLEATOR MOOR' },
                    { Value: 'CLECKHEATON', Text: 'CLECKHEATON' },
                    { Value: 'CLEETHORPES', Text: 'CLEETHORPES' },
                    { Value: 'CLEOBURY MORTIMER', Text: 'CLEOBURY MORTIMER' },
                    { Value: 'CLEVEDON', Text: 'CLEVEDON' },
                    { Value: 'CLEVELEYS', Text: 'CLEVELEYS' },
                    { Value: 'CLITHEROE', Text: 'CLITHEROE' },
                    { Value: 'CLUN', Text: 'CLUN' },
                    { Value: 'COAL POOL', Text: 'COAL POOL' },
                    { Value: 'COALVILLE', Text: 'COALVILLE' },
                    { Value: 'COCKERMOUTH', Text: 'COCKERMOUTH' },
                    { Value: 'COGGESHALL', Text: 'COGGESHALL' },
                    { Value: 'COLBURN', Text: 'COLBURN' },
                    { Value: 'COLCHESTER', Text: 'COLCHESTER' },
                    { Value: 'COLEFORD', Text: 'COLEFORD' },
                    { Value: 'COLESHILL', Text: 'COLESHILL' },
                    { Value: 'COLNE', Text: 'COLNE' },
                    { Value: 'COLYTON', Text: 'COLYTON' },
                    { Value: 'CONGLETON', Text: 'CONGLETON' },
                    { Value: 'CONINGSBY', Text: 'CONINGSBY' },
                    { Value: 'CONISBROUGH', Text: 'CONISBROUGH' },
                    { Value: 'CONSETT', Text: 'CONSETT' },
                    { Value: 'CORBRIDGE', Text: 'CORBRIDGE' },
                    { Value: 'CORBY', Text: 'CORBY' },
                    { Value: 'CORRINGHAM', Text: 'CORRINGHAM' },
                    { Value: 'CORSHAM', Text: 'CORSHAM' },
                    { Value: 'COSELEY', Text: 'COSELEY' },
                    { Value: 'COTGRAVE', Text: 'COTGRAVE' },
                    { Value: 'COVENTRY', Text: 'COVENTRY' },
                    { Value: 'COWES', Text: 'COWES' },
                    { Value: 'CRADLEY HEATH', Text: 'CRADLEY HEATH' },
                    { Value: 'CRAMLINGTON', Text: 'CRAMLINGTON' },
                    { Value: 'CRANBROOK', Text: 'CRANBROOK' },
                    { Value: 'CRAVEN ARMS', Text: 'CRAVEN ARMS' },
                    { Value: 'CRAWLEY', Text: 'CRAWLEY' },
                    { Value: 'CRAYFORD', Text: 'CRAYFORD' },
                    { Value: 'CREDITON', Text: 'CREDITON' },
                    { Value: 'CREWE', Text: 'CREWE' },
                    { Value: 'CREWKERNE', Text: 'CREWKERNE' },
                    { Value: 'CRICKLADE', Text: 'CRICKLADE' },
                    { Value: 'CROMER', Text: 'CROMER' },
                    { Value: 'CROOK', Text: 'CROOK' },
                    { Value: 'CROSBY', Text: 'CROSBY' },
                    { Value: 'CROWBOROUGH', Text: 'CROWBOROUGH' },
                    { Value: 'CROWLAND', Text: 'CROWLAND' },
                    { Value: 'CROWLE', Text: 'CROWLE' },
                    { Value: 'CROWTHORNE', Text: 'CROWTHORNE' },
                    { Value: 'CROYDON', Text: 'CROYDON' },
                    { Value: 'CUCKFIELD', Text: 'CUCKFIELD' },
                    { Value: 'CULLERCOATS', Text: 'CULLERCOATS' },
                    { Value: 'CULLOMPTON', Text: 'CULLOMPTON' },
                    { Value: 'DAGENHAM', Text: 'DAGENHAM' },
                    { Value: 'DALTON IN FURNESS', Text: 'DALTON IN FURNESS' },
                    { Value: 'DARLASTON', Text: 'DARLASTON' },
                    { Value: 'DARLEY DALE', Text: 'DARLEY DALE' },
                    { Value: 'DARLINGTON', Text: 'DARLINGTON' },
                    { Value: 'DARSLEY PARK', Text: 'DARSLEY PARK' },
                    { Value: 'DARTFORD', Text: 'DARTFORD' },
                    { Value: 'DARTMOUTH', Text: 'DARTMOUTH' },
                    { Value: 'DARWEN', Text: 'DARWEN' },
                    { Value: 'DAVENTRY', Text: 'DAVENTRY' },
                    { Value: 'DAWLEY', Text: 'DAWLEY' },
                    { Value: 'DAWLISH', Text: 'DAWLISH' },
                    { Value: 'DEAL', Text: 'DEAL' },
                    { Value: 'DENHOLME', Text: 'DENHOLME' },
                    { Value: 'DENTON', Text: 'DENTON' },
                    { Value: 'DERBY', Text: 'DERBY' },
                    { Value: 'DEREHAM', Text: 'DEREHAM' },
                    { Value: 'DESBOROUGH', Text: 'DESBOROUGH' },
                    { Value: 'DEVIZES', Text: 'DEVIZES' },
                    { Value: 'DEWSBURY', Text: 'DEWSBURY' },
                    { Value: 'DIDCOT', Text: 'DIDCOT' },
                    { Value: 'DINNINGTON', Text: 'DINNINGTON' },
                    { Value: 'DISS', Text: 'DISS' },
                    { Value: 'DOMMOC', Text: 'DOMMOC' },
                    { Value: 'DONCASTER', Text: 'DONCASTER' },
                    { Value: 'DORCHESTER', Text: 'DORCHESTER' },
                    { Value: 'DORKING', Text: 'DORKING' },
                    { Value: 'DOVER', Text: 'DOVER' },
                    { Value: 'DOVERCOURT', Text: 'DOVERCOURT' },
                    { Value: 'DOWNHAM MARKET', Text: 'DOWNHAM MARKET' },
                    { Value: 'DRIFFIELD', Text: 'DRIFFIELD' },
                    { Value: 'DROITWICH SPA', Text: 'DROITWICH SPA' },
                    { Value: 'DRONFIELD', Text: 'DRONFIELD' },
                    { Value: 'DRONFIELD WOODHOUSE', Text: 'DRONFIELD WOODHOUSE' },
                    { Value: 'DROYLSDEN', Text: 'DROYLSDEN' },
                    { Value: 'DUDLEY', Text: 'DUDLEY' },
                    { Value: 'DUKINFIELD', Text: 'DUKINFIELD' },
                    { Value: 'DULVERTON', Text: 'DULVERTON' },
                    { Value: 'DUNSTABLE', Text: 'DUNSTABLE' },
                    { Value: 'DUNSTON', Text: 'DUNSTON' },
                    { Value: 'DUNWICH', Text: 'DUNWICH' },
                    { Value: 'DURHAM', Text: 'DURHAM' },
                    { Value: 'DURSLEY', Text: 'DURSLEY' },
                    { Value: 'EAGLESCLIFFE', Text: 'EAGLESCLIFFE' },
                    { Value: 'EALING', Text: 'EALING' },
                    { Value: 'EARL SHILTON', Text: 'EARL SHILTON' },
                    { Value: 'EARLESTOWN', Text: 'EARLESTOWN' },
                    { Value: 'EARLEY', Text: 'EARLEY' },
                    { Value: 'EASINGWOLD', Text: 'EASINGWOLD' },
                    { Value: 'EAST COWES', Text: 'EAST COWES' },
                    { Value: 'EAST GRINSTEAD', Text: 'EAST GRINSTEAD' },
                    { Value: 'EAST HAM', Text: 'EAST HAM' },
                    { Value: 'EAST RETFORD', Text: 'EAST RETFORD' },
                    { Value: 'EASTBOURNE', Text: 'EASTBOURNE' },
                    { Value: 'EASTINGTON', Text: 'EASTINGTON' },
                    { Value: 'EASTLEIGH', Text: 'EASTLEIGH' },
                    { Value: 'EASTWOOD', Text: 'EASTWOOD' },
                    { Value: 'ECCLES', Text: 'ECCLES' },
                    { Value: 'ECCLESHALL', Text: 'ECCLESHALL' },
                    { Value: 'ECKINGTON', Text: 'ECKINGTON' },
                    { Value: 'EDENBRIDGE', Text: 'EDENBRIDGE' },
                    { Value: 'EDGWARE', Text: 'EDGWARE' },
                    { Value: 'EDLINGTON', Text: 'EDLINGTON' },
                    { Value: 'EDMONTON', Text: 'EDMONTON' },
                    { Value: 'EGHAM', Text: 'EGHAM' },
                    { Value: 'EGREMONT', Text: 'EGREMONT' },
                    { Value: 'ELLAND', Text: 'ELLAND' },
                    { Value: 'ELLESMERE', Text: 'ELLESMERE' },
                    { Value: 'ELLESMERE PORT', Text: 'ELLESMERE PORT' },
                    { Value: 'ELSTREE', Text: 'ELSTREE' },
                    { Value: 'ELY', Text: 'ELY' },
                    { Value: 'EMSWORTH', Text: 'EMSWORTH' },
                    { Value: 'ENFIELD', Text: 'ENFIELD' },
                    { Value: 'EPPING', Text: 'EPPING' },
                    { Value: 'EPSOM', Text: 'EPSOM' },
                    { Value: 'EPWORTH', Text: 'EPWORTH' },
                    { Value: 'ERITH', Text: 'ERITH' },
                    { Value: 'ESHER', Text: 'ESHER' },
                    { Value: 'ESTON', Text: 'ESTON' },
                    { Value: 'ETON', Text: 'ETON' },
                    { Value: 'EVESHAM', Text: 'EVESHAM' },
                    { Value: 'EXETER', Text: 'EXETER' },
                    { Value: 'EXMOUTH', Text: 'EXMOUTH' },
                    { Value: 'EYE', Text: 'EYE' },
                    { Value: 'FAILSWORTH', Text: 'FAILSWORTH' },
                    { Value: 'FAIRFIELD', Text: 'FAIRFIELD' },
                    { Value: 'FAIRFORD', Text: 'FAIRFORD' },
                    { Value: 'FAKENHAM', Text: 'FAKENHAM' },
                    { Value: 'FALMOUTH', Text: 'FALMOUTH' },
                    { Value: 'FAREHAM', Text: 'FAREHAM' },
                    { Value: 'FARINGDON', Text: 'FARINGDON' },
                    { Value: 'FARNBOROUGH', Text: 'FARNBOROUGH' },
                    { Value: 'FARNHAM', Text: 'FARNHAM' },
                    { Value: 'FARNWORTH', Text: 'FARNWORTH' },
                    { Value: 'FARSLEY', Text: 'FARSLEY' },
                    { Value: 'FAVERSHAM', Text: 'FAVERSHAM' },
                    { Value: 'FAZELEY', Text: 'FAZELEY' },
                    { Value: 'FEATHERSTONE', Text: 'FEATHERSTONE' },
                    { Value: 'FELIXSTOWE', Text: 'FELIXSTOWE' },
                    { Value: 'FENNY STRATFORD', Text: 'FENNY STRATFORD' },
                    { Value: 'FENTON', Text: 'FENTON' },
                    { Value: 'FERNDOWN', Text: 'FERNDOWN' },
                    { Value: 'FERRYHILL', Text: 'FERRYHILL' },
                    { Value: 'FILEY', Text: 'FILEY' },
                    { Value: 'FILTON', Text: 'FILTON' },
                    { Value: 'FINCHLEY', Text: 'FINCHLEY' },
                    { Value: 'FLEET', Text: 'FLEET' },
                    { Value: 'FLEETWOOD', Text: 'FLEETWOOD' },
                    { Value: 'FLITWICK', Text: 'FLITWICK' },
                    { Value: 'FOLKESTONE', Text: 'FOLKESTONE' },
                    { Value: 'FORDBRIDGE', Text: 'FORDBRIDGE' },
                    { Value: 'FORDINGBRIDGE', Text: 'FORDINGBRIDGE' },
                    { Value: 'FORDWICH', Text: 'FORDWICH' },
                    { Value: 'FORMBY', Text: 'FORMBY' },
                    { Value: 'FOWEY', Text: 'FOWEY' },
                    { Value: 'FRAMLINGHAM', Text: 'FRAMLINGHAM' },
                    { Value: 'FRINTON ON SEA', Text: 'FRINTON ON SEA' },
                    { Value: 'FRODSHAM', Text: 'FRODSHAM' },
                    { Value: 'FROME', Text: 'FROME' },
                    { Value: 'FULBOURN', Text: 'FULBOURN' },
                    { Value: 'GAINSBOROUGH', Text: 'GAINSBOROUGH' },
                    { Value: 'GARFORTH', Text: 'GARFORTH' },
                    { Value: 'GARSTANG', Text: 'GARSTANG' },
                    { Value: 'GATESHEAD', Text: 'GATESHEAD' },
                    { Value: 'GILLINGHAM', Text: 'GILLINGHAM' },
                    { Value: 'GLASTONBURY', Text: 'GLASTONBURY' },
                    { Value: 'GLOSSOP', Text: 'GLOSSOP' },
                    { Value: 'GLOUCESTER', Text: 'GLOUCESTER' },
                    { Value: 'GODALMING', Text: 'GODALMING' },
                    { Value: 'GODMANCHESTER', Text: 'GODMANCHESTER' },
                    { Value: 'GOLBOURNE', Text: 'GOLBOURNE' },
                    { Value: 'GOMSHALL', Text: 'GOMSHALL' },
                    { Value: 'GOOLE', Text: 'GOOLE' },
                    { Value: 'GORLESTON', Text: 'GORLESTON' },
                    { Value: 'GORNAL', Text: 'GORNAL' },
                    { Value: 'GOSPORT', Text: 'GOSPORT' },
                    { Value: 'GRANGE OVER SANDS', Text: 'GRANGE OVER SANDS' },
                    { Value: 'GRANGETOWN', Text: 'GRANGETOWN' },
                    { Value: 'GRANTHAM', Text: 'GRANTHAM' },
                    { Value: 'GRASSINGTON', Text: 'GRASSINGTON' },
                    { Value: 'GRATTON', Text: 'GRATTON' },
                    { Value: 'GRAVESEND', Text: 'GRAVESEND' },
                    { Value: 'GRAYS', Text: 'GRAYS' },
                    { Value: 'GREAT BROOKHAM', Text: 'GREAT BROOKHAM' },
                    { Value: 'GREAT DUNMOW', Text: 'GREAT DUNMOW' },
                    { Value: 'GREAT HARWOOD', Text: 'GREAT HARWOOD' },
                    { Value: 'GREAT MALVERN', Text: 'GREAT MALVERN' },
                    { Value: 'GREAT TORRINGTON', Text: 'GREAT TORRINGTON' },
                    { Value: 'GREAT YARMOUTH', Text: 'GREAT YARMOUTH' },
                    { Value: 'GREATER WILLINGTON', Text: 'GREATER WILLINGTON' },
                    { Value: 'GREENHILL', Text: 'GREENHILL' },
                    { Value: 'GRIMSBY', Text: 'GRIMSBY' },
                    { Value: 'GUILDFORD', Text: 'GUILDFORD' },
                    { Value: 'GUISBOROUGH', Text: 'GUISBOROUGH' },
                    { Value: 'GUISELEY', Text: 'GUISELEY' },
                    { Value: 'HADFIELD', Text: 'HADFIELD' },
                    { Value: 'HADLEIGH', Text: 'HADLEIGH' },
                    { Value: 'HAILSHAM', Text: 'HAILSHAM' },
                    { Value: 'HALESOWEN', Text: 'HALESOWEN' },
                    { Value: 'HALESWORTH', Text: 'HALESWORTH' },
                    { Value: 'HALEWOOD', Text: 'HALEWOOD' },
                    { Value: 'HALIFAX', Text: 'HALIFAX' },
                    { Value: 'HALSTEAD', Text: 'HALSTEAD' },
                    { Value: 'HALTWHISTLE', Text: 'HALTWHISTLE' },
                    { Value: 'HANLEY GRANGE', Text: 'HANLEY GRANGE' },
                    { Value: 'HARLOW', Text: 'HARLOW' },
                    { Value: 'HARPENDEN', Text: 'HARPENDEN' },
                    { Value: 'HARRINGTON', Text: 'HARRINGTON' },
                    { Value: 'HARROGATE', Text: 'HARROGATE' },
                    { Value: 'HARROW', Text: 'HARROW' },
                    { Value: 'HARTLAND', Text: 'HARTLAND' },
                    { Value: 'HARTLEPOOL', Text: 'HARTLEPOOL' },
                    { Value: 'HARWICH', Text: 'HARWICH' },
                    { Value: 'HARWORTH AND BIRCOTES', Text: 'HARWORTH AND BIRCOTES' },
                    { Value: 'HASLEMERE', Text: 'HASLEMERE' },
                    { Value: 'HASLINGDEN', Text: 'HASLINGDEN' },
                    { Value: 'HASTINGS', Text: 'HASTINGS' },
                    { Value: 'HATFIELD', Text: 'HATFIELD' },
                    { Value: 'HATHERLEIGH', Text: 'HATHERLEIGH' },
                    { Value: 'HAVANT', Text: 'HAVANT' },
                    { Value: 'HAVERHILL', Text: 'HAVERHILL' },
                    { Value: 'HAWES', Text: 'HAWES' },
                    { Value: 'HAXBY', Text: 'HAXBY' },
                    { Value: 'HAYLE', Text: 'HAYLE' },
                    { Value: 'HAYWARDS HEATH', Text: 'HAYWARDS HEATH' },
                    { Value: 'HEANOR', Text: 'HEANOR' },
                    { Value: 'HEATHFIELD', Text: 'HEATHFIELD' },
                    { Value: 'HEBDEN BRIDGE', Text: 'HEBDEN BRIDGE' },
                    { Value: 'HEBDEN ROYD', Text: 'HEBDEN ROYD' },
                    { Value: 'HECKMONDWIKE', Text: 'HECKMONDWIKE' },
                    { Value: 'HEDGE END', Text: 'HEDGE END' },
                    { Value: 'HEDNESFORD', Text: 'HEDNESFORD' },
                    { Value: 'HEDON', Text: 'HEDON' },
                    { Value: 'HELMSLEY', Text: 'HELMSLEY' },
                    { Value: 'HELSTON', Text: 'HELSTON' },
                    { Value: 'HEMEL HEMPSTEAD', Text: 'HEMEL HEMPSTEAD' },
                    { Value: 'HEMSWORTH', Text: 'HEMSWORTH' },
                    { Value: 'HENDON', Text: 'HENDON' },
                    { Value: 'HENLEY IN ARDEN', Text: 'HENLEY IN ARDEN' },
                    { Value: 'HENLEY ON THAMES', Text: 'HENLEY ON THAMES' },
                    { Value: 'HEREFORD', Text: 'HEREFORD' },
                    { Value: 'HERNE BAY', Text: 'HERNE BAY' },
                    { Value: 'HERTFORD', Text: 'HERTFORD' },
                    { Value: 'HESSLE', Text: 'HESSLE' },
                    { Value: 'HESWALL', Text: 'HESWALL' },
                    { Value: 'HETTON', Text: 'HETTON' },
                    { Value: 'HEXHAM', Text: 'HEXHAM' },
                    { Value: 'HEYBRIDGE', Text: 'HEYBRIDGE' },
                    { Value: 'HEYWOOD', Text: 'HEYWOOD' },
                    { Value: 'HIGH WYCOMBE', Text: 'HIGH WYCOMBE' },
                    { Value: 'HIGHAM FERRERS', Text: 'HIGHAM FERRERS' },
                    { Value: 'HIGHAMPTON', Text: 'HIGHAMPTON' },
                    { Value: 'HIGHBRIDGE', Text: 'HIGHBRIDGE' },
                    { Value: 'HIGHCLIFFE', Text: 'HIGHCLIFFE' },
                    { Value: 'HIGHWORTH', Text: 'HIGHWORTH' },
                    { Value: 'HINCKLEY', Text: 'HINCKLEY' },
                    { Value: 'HINDLEY', Text: 'HINDLEY' },
                    { Value: 'HINGHAM', Text: 'HINGHAM' },
                    { Value: 'HITCHIN', Text: 'HITCHIN' },
                    { Value: 'HOCKLEY', Text: 'HOCKLEY' },
                    { Value: 'HODDESDON', Text: 'HODDESDON' },
                    { Value: 'HOLBEACH', Text: 'HOLBEACH' },
                    { Value: 'HOLLAND ON SEA', Text: 'HOLLAND ON SEA' },
                    { Value: 'HOLMFIRTH', Text: 'HOLMFIRTH' },
                    { Value: 'HOLSWORTHY', Text: 'HOLSWORTHY' },
                    { Value: 'HOLT', Text: 'HOLT' },
                    { Value: 'HONITON', Text: 'HONITON' },
                    { Value: 'HORLEY', Text: 'HORLEY' },
                    { Value: 'HORNCASTLE', Text: 'HORNCASTLE' },
                    { Value: 'HORNSEA', Text: 'HORNSEA' },
                    { Value: 'HORNSEY', Text: 'HORNSEY' },
                    { Value: 'HORSFORTH', Text: 'HORSFORTH' },
                    { Value: 'HORSHAM', Text: 'HORSHAM' },
                    { Value: 'HORWICH', Text: 'HORWICH' },
                    { Value: 'HOUGHTON LE SPRING', Text: 'HOUGHTON LE SPRING' },
                    { Value: 'HOUGHTON REGIS', Text: 'HOUGHTON REGIS' },
                    { Value: 'HOVE', Text: 'HOVE' },
                    { Value: 'HOWDEN', Text: 'HOWDEN' },
                    { Value: 'HOWDON', Text: 'HOWDON' },
                    { Value: 'HOYLAKE', Text: 'HOYLAKE' },
                    { Value: 'HOYLAND', Text: 'HOYLAND' },
                    { Value: 'HUCKNALL', Text: 'HUCKNALL' },
                    { Value: 'HUDDERSFIELD', Text: 'HUDDERSFIELD' },
                    { Value: 'HUNGERFORD', Text: 'HUNGERFORD' },
                    { Value: 'HUNSTANTON', Text: 'HUNSTANTON' },
                    { Value: 'HUNTINGDON', Text: 'HUNTINGDON' },
                    { Value: 'HUYTON', Text: 'HUYTON' },
                    { Value: 'HYDE', Text: 'HYDE' },
                    { Value: 'HYTHE', Text: 'HYTHE' },
                    { Value: 'ILFORD', Text: 'ILFORD' },
                    { Value: 'ILFRACOMBE', Text: 'ILFRACOMBE' },
                    { Value: 'ILKESTON', Text: 'ILKESTON' },
                    { Value: 'ILKLEY', Text: 'ILKLEY' },
                    { Value: 'ILMINSTER', Text: 'ILMINSTER' },
                    { Value: 'IMMINGHAM', Text: 'IMMINGHAM' },
                    { Value: 'INCE IN MAKERFIELD', Text: 'INCE IN MAKERFIELD' },
                    { Value: 'INGATESTONE', Text: 'INGATESTONE' },
                    { Value: 'INGLEBY BARWICK', Text: 'INGLEBY BARWICK' },
                    { Value: 'IPSWICH', Text: 'IPSWICH' },
                    { Value: 'IRLAM', Text: 'IRLAM' },
                    { Value: 'IRTHLINGBOROUGH', Text: 'IRTHLINGBOROUGH' },
                    { Value: 'IVYBRIDGE', Text: 'IVYBRIDGE' },
                    { Value: 'JARROW', Text: 'JARROW' },
                    { Value: 'KEARSLEY', Text: 'KEARSLEY' },
                    { Value: 'KEIGHLEY', Text: 'KEIGHLEY' },
                    { Value: 'KEMPSTON', Text: 'KEMPSTON' },
                    { Value: 'KENDAL', Text: 'KENDAL' },
                    { Value: 'KENILWORTH', Text: 'KENILWORTH' },
                    { Value: 'KESGRAVE', Text: 'KESGRAVE' },
                    { Value: 'KESWICK', Text: 'KESWICK' },
                    { Value: 'KETTERING', Text: 'KETTERING' },
                    { Value: 'KEYNSHAM', Text: 'KEYNSHAM' },
                    { Value: 'KIDDERMINSTER', Text: 'KIDDERMINSTER' },
                    { Value: 'KIDSGROVE', Text: 'KIDSGROVE' },
                    { Value: 'KILLAMARSH', Text: 'KILLAMARSH' },
                    { Value: 'KILLINGWORTH', Text: 'KILLINGWORTH' },
                    { Value: 'KILTON', Text: 'KILTON' },
                    { Value: 'KIMBERLEY', Text: 'KIMBERLEY' },
                    { Value: 'KING\'S LYNN', Text: 'KING\'S LYNN' },
                    { Value: 'KINGSBRIDGE', Text: 'KINGSBRIDGE' },
                    { Value: 'KINGSTEIGNTON', Text: 'KINGSTEIGNTON' },
                    { Value: 'KINGSTON UPON THAMES', Text: 'KINGSTON UPON THAMES' },
                    { Value: 'KINGSWOOD', Text: 'KINGSWOOD' },
                    { Value: 'KINGTON', Text: 'KINGTON' },
                    { Value: 'KIRKBY', Text: 'KIRKBY' },
                    { Value: 'KIRKBY IN ASHFIELD', Text: 'KIRKBY IN ASHFIELD' },
                    { Value: 'KIRKBY LONSDALE', Text: 'KIRKBY LONSDALE' },
                    { Value: 'KIRKBY STEPHEN', Text: 'KIRKBY STEPHEN' },
                    { Value: 'KIRKBYMOORSIDE', Text: 'KIRKBYMOORSIDE' },
                    { Value: 'KIRKHAM', Text: 'KIRKHAM' },
                    { Value: 'KIRTON IN LINDSEY', Text: 'KIRTON IN LINDSEY' },
                    { Value: 'KNARESBOROUGH', Text: 'KNARESBOROUGH' },
                    { Value: 'KNOTTINGLEY', Text: 'KNOTTINGLEY' },
                    { Value: 'KNUTSFORD', Text: 'KNUTSFORD' },
                    { Value: 'LAINDON', Text: 'LAINDON' },
                    { Value: 'LAMBOURN', Text: 'LAMBOURN' },
                    { Value: 'LANCASTER', Text: 'LANCASTER' },
                    { Value: 'LANGDON HILLS', Text: 'LANGDON HILLS' },
                    { Value: 'LANGLEY MILL', Text: 'LANGLEY MILL' },
                    { Value: 'LANGPORT', Text: 'LANGPORT' },
                    { Value: 'LAUNCESTON', Text: 'LAUNCESTON' },
                    { Value: 'LEATHERHEAD', Text: 'LEATHERHEAD' },
                    { Value: 'LECHLADE', Text: 'LECHLADE' },
                    { Value: 'LEDBURY', Text: 'LEDBURY' },
                    { Value: 'LEE ON THE SOLENT', Text: 'LEE ON THE SOLENT' },
                    { Value: 'LEEDS', Text: 'LEEDS' },
                    { Value: 'LEEK', Text: 'LEEK' },
                    { Value: 'LEICESTER', Text: 'LEICESTER' },
                    { Value: 'LEIGH', Text: 'LEIGH' },
                    { Value: 'LEIGH ON SEA', Text: 'LEIGH ON SEA' },
                    { Value: 'LEIGHTON BUZZARD', Text: 'LEIGHTON BUZZARD' },
                    { Value: 'LEISTON', Text: 'LEISTON' },
                    { Value: 'LEOMINSTER', Text: 'LEOMINSTER' },
                    { Value: 'LETCHWORTH', Text: 'LETCHWORTH' },
                    { Value: 'LEWES', Text: 'LEWES' },
                    { Value: 'LEYBURN', Text: 'LEYBURN' },
                    { Value: 'LEYLAND', Text: 'LEYLAND' },
                    { Value: 'LEYTON', Text: 'LEYTON' },
                    { Value: 'LICHFIELD', Text: 'LICHFIELD' },
                    { Value: 'LINCOLN', Text: 'LINCOLN' },
                    { Value: 'LINSLADE', Text: 'LINSLADE' },
                    { Value: 'LISKEARD', Text: 'LISKEARD' },
                    { Value: 'LITTLE BENTON', Text: 'LITTLE BENTON' },
                    { Value: 'LITTLE COATES', Text: 'LITTLE COATES' },
                    { Value: 'LITTLEBOROUGH', Text: 'LITTLEBOROUGH' },
                    { Value: 'LITTLEHAMPTON', Text: 'LITTLEHAMPTON' },
                    { Value: 'LIVERPOOL', Text: 'LIVERPOOL' },
                    { Value: 'LODDON', Text: 'LODDON' },
                    { Value: 'LOFTUS', Text: 'LOFTUS' },
                    { Value: 'LONG EATON', Text: 'LONG EATON' },
                    { Value: 'LONG SUTTON', Text: 'LONG SUTTON' },
                    { Value: 'LONGBENTON', Text: 'LONGBENTON' },
                    { Value: 'LONGRIDGE', Text: 'LONGRIDGE' },
                    { Value: 'LONGTON', Text: 'LONGTON' },
                    { Value: 'LONGTOWN', Text: 'LONGTOWN' },
                    { Value: 'LOOE', Text: 'LOOE' },
                    { Value: 'LOSTWITHIEL', Text: 'LOSTWITHIEL' },
                    { Value: 'LOUGHBOROUGH', Text: 'LOUGHBOROUGH' },
                    { Value: 'LOUGHTON', Text: 'LOUGHTON' },
                    { Value: 'LOUTH', Text: 'LOUTH' },
                    { Value: 'LOW FELL', Text: 'LOW FELL' },
                    { Value: 'LOWESTOFT', Text: 'LOWESTOFT' },
                    { Value: 'LUDGERSHALL', Text: 'LUDGERSHALL' },
                    { Value: 'LUDLOW', Text: 'LUDLOW' },
                    { Value: 'LUTON', Text: 'LUTON' },
                    { Value: 'LUTTERWORTH', Text: 'LUTTERWORTH' },
                    { Value: 'LYDD', Text: 'LYDD' },
                    { Value: 'LYDNEY', Text: 'LYDNEY' },
                    { Value: 'LYE', Text: 'LYE' },
                    { Value: 'LYME REGIS', Text: 'LYME REGIS' },
                    { Value: 'LYMINGTON', Text: 'LYMINGTON' },
                    { Value: 'LYNDHURST', Text: 'LYNDHURST' },
                    { Value: 'LYNTON', Text: 'LYNTON' },
                    { Value: 'LYTHAM ST ANNES', Text: 'LYTHAM ST ANNES' },
                    { Value: 'MABLETHORPE', Text: 'MABLETHORPE' },
                    { Value: 'MABLETHORPE AND SUTTON', Text: 'MABLETHORPE AND SUTTON' },
                    { Value: 'MACCLESFIELD', Text: 'MACCLESFIELD' },
                    { Value: 'MADELEY', Text: 'MADELEY' },
                    { Value: 'MAGHULL', Text: 'MAGHULL' },
                    { Value: 'MAIDENHEAD', Text: 'MAIDENHEAD' },
                    { Value: 'MAIDSTONE', Text: 'MAIDSTONE' },
                    { Value: 'MALDON', Text: 'MALDON' },
                    { Value: 'MALMESBURY', Text: 'MALMESBURY' },
                    { Value: 'MALPAS', Text: 'MALPAS' },
                    { Value: 'MALTBY', Text: 'MALTBY' },
                    { Value: 'MALTON', Text: 'MALTON' },
                    { Value: 'MALVERN', Text: 'MALVERN' },
                    { Value: 'MANCHESTER', Text: 'MANCHESTER' },
                    { Value: 'MANNINGTREE', Text: 'MANNINGTREE' },
                    { Value: 'MANSFIELD', Text: 'MANSFIELD' },
                    { Value: 'MARAZION', Text: 'MARAZION' },
                    { Value: 'MARCH', Text: 'MARCH' },
                    { Value: 'MARGATE', Text: 'MARGATE' },
                    { Value: 'MARKET BOSWORTH', Text: 'MARKET BOSWORTH' },
                    { Value: 'MARKET DEEPING', Text: 'MARKET DEEPING' },
                    { Value: 'MARKET DRAYTON', Text: 'MARKET DRAYTON' },
                    { Value: 'MARKET HARBOROUGH', Text: 'MARKET HARBOROUGH' },
                    { Value: 'MARKET RASEN', Text: 'MARKET RASEN' },
                    { Value: 'MARKET WEIGHTON', Text: 'MARKET WEIGHTON' },
                    { Value: 'MARLBOROUGH', Text: 'MARLBOROUGH' },
                    { Value: 'MARLOW', Text: 'MARLOW' },
                    { Value: 'MARYPORT', Text: 'MARYPORT' },
                    { Value: 'MASHAM', Text: 'MASHAM' },
                    { Value: 'MATLOCK', Text: 'MATLOCK' },
                    { Value: 'MEDLAR WITH WESHAM', Text: 'MEDLAR WITH WESHAM' },
                    { Value: 'MELBOURNE', Text: 'MELBOURNE' },
                    { Value: 'MELKSHAM', Text: 'MELKSHAM' },
                    { Value: 'MELTHAM', Text: 'MELTHAM' },
                    { Value: 'MELTON MOWBRAY', Text: 'MELTON MOWBRAY' },
                    { Value: 'MERE', Text: 'MERE' },
                    { Value: 'MEXBOROUGH', Text: 'MEXBOROUGH' },
                    { Value: 'MIDDLE QUINTON', Text: 'MIDDLE QUINTON' },
                    { Value: 'MIDDLEHAM', Text: 'MIDDLEHAM' },
                    { Value: 'MIDDLESBROUGH', Text: 'MIDDLESBROUGH' },
                    { Value: 'MIDDLETON', Text: 'MIDDLETON' },
                    { Value: 'MIDDLEWICH', Text: 'MIDDLEWICH' },
                    { Value: 'MIDHURST', Text: 'MIDHURST' },
                    { Value: 'MIDSOMER NORTON', Text: 'MIDSOMER NORTON' },
                    { Value: 'MILDENHALL', Text: 'MILDENHALL' },
                    { Value: 'MILLOM', Text: 'MILLOM' },
                    { Value: 'MILNROW', Text: 'MILNROW' },
                    { Value: 'MILNTHORPE', Text: 'MILNTHORPE' },
                    { Value: 'MILTON KEYNES', Text: 'MILTON KEYNES' },
                    { Value: 'MINCHINHAMPTON', Text: 'MINCHINHAMPTON' },
                    { Value: 'MINEHEAD', Text: 'MINEHEAD' },
                    { Value: 'MINSTER', Text: 'MINSTER' },
                    { Value: 'MIRFIELD', Text: 'MIRFIELD' },
                    { Value: 'MITCHAM', Text: 'MITCHAM' },
                    { Value: 'MITCHELDEAN', Text: 'MITCHELDEAN' },
                    { Value: 'MODBURY', Text: 'MODBURY' },
                    { Value: 'MORECAMBE', Text: 'MORECAMBE' },
                    { Value: 'MORETON IN MARSH', Text: 'MORETON IN MARSH' },
                    { Value: 'MORETONHAMPSTEAD', Text: 'MORETONHAMPSTEAD' },
                    { Value: 'MORLEY', Text: 'MORLEY' },
                    { Value: 'MORPETH', Text: 'MORPETH' },
                    { Value: 'MOSSLEY', Text: 'MOSSLEY' },
                    { Value: 'MOXLEY', Text: 'MOXLEY' },
                    { Value: 'MUCH WENLOCK', Text: 'MUCH WENLOCK' },
                    { Value: 'MYTHOLMROYD', Text: 'MYTHOLMROYD' },
                    { Value: 'NAILSEA', Text: 'NAILSEA' },
                    { Value: 'NAILSWORTH', Text: 'NAILSWORTH' },
                    { Value: 'NANTWICH', Text: 'NANTWICH' },
                    { Value: 'NEEDHAM MARKET', Text: 'NEEDHAM MARKET' },
                    { Value: 'NEITHROP', Text: 'NEITHROP' },
                    { Value: 'NELSON', Text: 'NELSON' },
                    { Value: 'NESTON', Text: 'NESTON' },
                    { Value: 'NETHERFIELD', Text: 'NETHERFIELD' },
                    { Value: 'NETHERTHORPE', Text: 'NETHERTHORPE' },
                    { Value: 'NETHERTON', Text: 'NETHERTON' },
                    { Value: 'NEW ALRESFORD', Text: 'NEW ALRESFORD' },
                    { Value: 'NEW MILLS', Text: 'NEW MILLS' },
                    { Value: 'NEW MILTON', Text: 'NEW MILTON' },
                    { Value: 'NEW ROMNEY', Text: 'NEW ROMNEY' },
                    { Value: 'NEWARK ON TRENT', Text: 'NEWARK ON TRENT' },
                    { Value: 'NEWBIGGIN BY THE SEA', Text: 'NEWBIGGIN BY THE SEA' },
                    { Value: 'NEWBURY', Text: 'NEWBURY' },
                    { Value: 'NEWCASTLE UNDER LYME', Text: 'NEWCASTLE UNDER LYME' },
                    { Value: 'NEWCASTLE UPON TYNE', Text: 'NEWCASTLE UPON TYNE' },
                    { Value: 'NEWENT', Text: 'NEWENT' },
                    { Value: 'NEWHAVEN', Text: 'NEWHAVEN' },
                    { Value: 'NEWLYN', Text: 'NEWLYN' },
                    { Value: 'NEWMARKET', Text: 'NEWMARKET' },
                    { Value: 'NEWPORT', Text: 'NEWPORT' },
                    { Value: 'NEWPORT PAGNELL', Text: 'NEWPORT PAGNELL' },
                    { Value: 'NEWQUAY', Text: 'NEWQUAY' },
                    { Value: 'NEWTON ABBOT', Text: 'NEWTON ABBOT' },
                    { Value: 'NEWTON AYCLIFFE', Text: 'NEWTON AYCLIFFE' },
                    { Value: 'NEWTON LE WILLOWS', Text: 'NEWTON LE WILLOWS' },
                    { Value: 'NORMANTON', Text: 'NORMANTON' },
                    { Value: 'NORTH CAMP', Text: 'NORTH CAMP' },
                    { Value: 'NORTH HYKEHAM', Text: 'NORTH HYKEHAM' },
                    { Value: 'NORTH PETHERTON', Text: 'NORTH PETHERTON' },
                    { Value: 'NORTH SHIELDS', Text: 'NORTH SHIELDS' },
                    { Value: 'NORTH SHOEBURY', Text: 'NORTH SHOEBURY' },
                    { Value: 'NORTH TAWTON', Text: 'NORTH TAWTON' },
                    { Value: 'NORTH WALSHAM', Text: 'NORTH WALSHAM' },
                    { Value: 'NORTHALLERTON', Text: 'NORTHALLERTON' },
                    { Value: 'NORTHAM', Text: 'NORTHAM' },
                    { Value: 'NORTHAMPTON', Text: 'NORTHAMPTON' },
                    { Value: 'NORTHFLEET', Text: 'NORTHFLEET' },
                    { Value: 'NORTHLEACH', Text: 'NORTHLEACH' },
                    { Value: 'NORTHSTOWE', Text: 'NORTHSTOWE' },
                    { Value: 'NORTHWICH', Text: 'NORTHWICH' },
                    { Value: 'NORTON ON DERWENT', Text: 'NORTON ON DERWENT' },
                    { Value: 'NORTON RADSTOCK', Text: 'NORTON RADSTOCK' },
                    { Value: 'NORWICH', Text: 'NORWICH' },
                    { Value: 'NOTTINGHAM', Text: 'NOTTINGHAM' },
                    { Value: 'NUNEATON', Text: 'NUNEATON' },
                    { Value: 'OADBY', Text: 'OADBY' },
                    { Value: 'OAKENGATES', Text: 'OAKENGATES' },
                    { Value: 'OAKHAM', Text: 'OAKHAM' },
                    { Value: 'OKEHAMPTON', Text: 'OKEHAMPTON' },
                    { Value: 'OLDBURY', Text: 'OLDBURY' },
                    { Value: 'OLDHAM', Text: 'OLDHAM' },
                    { Value: 'OLLERTON', Text: 'OLLERTON' },
                    { Value: 'OLLERTON AND BOUGHTON', Text: 'OLLERTON AND BOUGHTON' },
                    { Value: 'OLNEY', Text: 'OLNEY' },
                    { Value: 'ONGAR', Text: 'ONGAR' },
                    { Value: 'ORE VALLEY', Text: 'ORE VALLEY' },
                    { Value: 'ORFORD', Text: 'ORFORD' },
                    { Value: 'ORGILL', Text: 'ORGILL' },
                    { Value: 'ORMSKIRK', Text: 'ORMSKIRK' },
                    { Value: 'ORPINGTON', Text: 'ORPINGTON' },
                    { Value: 'OSSETT', Text: 'OSSETT' },
                    { Value: 'OSWALDTWISTLE', Text: 'OSWALDTWISTLE' },
                    { Value: 'OSWESTRY', Text: 'OSWESTRY' },
                    { Value: 'OTLEY', Text: 'OTLEY' },
                    { Value: 'OTTERY ST MARY', Text: 'OTTERY ST MARY' },
                    { Value: 'OUNDLE', Text: 'OUNDLE' },
                    { Value: 'OVER WOODHOUSE', Text: 'OVER WOODHOUSE' },
                    { Value: 'OXFORD', Text: 'OXFORD' },
                    { Value: 'PADDOCK WOOD', Text: 'PADDOCK WOOD' },
                    { Value: 'PADIHAM', Text: 'PADIHAM' },
                    { Value: 'PADSTOW', Text: 'PADSTOW' },
                    { Value: 'PAIGNTON', Text: 'PAIGNTON' },
                    { Value: 'PAINSWICK', Text: 'PAINSWICK' },
                    { Value: 'PAR', Text: 'PAR' },
                    { Value: 'PARKESTON', Text: 'PARKESTON' },
                    { Value: 'PARTINGTON', Text: 'PARTINGTON' },
                    { Value: 'PATCHWAY', Text: 'PATCHWAY' },
                    { Value: 'PATELEY BRIDGE', Text: 'PATELEY BRIDGE' },
                    { Value: 'PEACEHAVEN', Text: 'PEACEHAVEN' },
                    { Value: 'PELSALL', Text: 'PELSALL' },
                    { Value: 'PENDLEBURY', Text: 'PENDLEBURY' },
                    { Value: 'PENISTONE', Text: 'PENISTONE' },
                    { Value: 'PENKRIDGE', Text: 'PENKRIDGE' },
                    { Value: 'PENRITH', Text: 'PENRITH' },
                    { Value: 'PENRYN', Text: 'PENRYN' },
                    { Value: 'PENWORTHAM', Text: 'PENWORTHAM' },
                    { Value: 'PENZANCE', Text: 'PENZANCE' },
                    { Value: 'PERRY CROFTS', Text: 'PERRY CROFTS' },
                    { Value: 'PERSHORE', Text: 'PERSHORE' },
                    { Value: 'PETERBOROUGH', Text: 'PETERBOROUGH' },
                    { Value: 'PETERLEE', Text: 'PETERLEE' },
                    { Value: 'PETERSFIELD', Text: 'PETERSFIELD' },
                    { Value: 'PETWORTH', Text: 'PETWORTH' },
                    { Value: 'PICKERING', Text: 'PICKERING' },
                    { Value: 'PITSEA', Text: 'PITSEA' },
                    { Value: 'PLYMOUTH', Text: 'PLYMOUTH' },
                    { Value: 'POCKLINGTON', Text: 'POCKLINGTON' },
                    { Value: 'POLEGATE', Text: 'POLEGATE' },
                    { Value: 'PONTEFRACT', Text: 'PONTEFRACT' },
                    { Value: 'PONTELAND', Text: 'PONTELAND' },
                    { Value: 'POOLE', Text: 'POOLE' },
                    { Value: 'PORTCHESTER', Text: 'PORTCHESTER' },
                    { Value: 'PORTHLEVEN', Text: 'PORTHLEVEN' },
                    { Value: 'PORTISHEAD', Text: 'PORTISHEAD' },
                    { Value: 'PORTISHEAD AND NORTH WESTON', Text: 'PORTISHEAD AND NORTH WESTON' },
                    { Value: 'PORTLAND', Text: 'PORTLAND' },
                    { Value: 'PORTSMOUTH', Text: 'PORTSMOUTH' },
                    { Value: 'POTTERS BAR', Text: 'POTTERS BAR' },
                    { Value: 'POTTON', Text: 'POTTON' },
                    { Value: 'POULTON LE FYLDE', Text: 'POULTON LE FYLDE' },
                    { Value: 'POYNTON WITH WORTH', Text: 'POYNTON WITH WORTH' },
                    { Value: 'PREESALL', Text: 'PREESALL' },
                    { Value: 'PRESCOT', Text: 'PRESCOT' },
                    { Value: 'PRESTON', Text: 'PRESTON' },
                    { Value: 'PRESTWICH', Text: 'PRESTWICH' },
                    { Value: 'PRETTLEWELL', Text: 'PRETTLEWELL' },
                    { Value: 'PRINCES RISBOROUGH', Text: 'PRINCES RISBOROUGH' },
                    { Value: 'PRINCETOWN', Text: 'PRINCETOWN' },
                    { Value: 'PRUDHOE', Text: 'PRUDHOE' },
                    { Value: 'PUDSEY', Text: 'PUDSEY' },
                    { Value: 'QUEENBOROUGH', Text: 'QUEENBOROUGH' },
                    { Value: 'RACKHEATH', Text: 'RACKHEATH' },
                    { Value: 'RADCLIFFE', Text: 'RADCLIFFE' },
                    { Value: 'RADSTOCK', Text: 'RADSTOCK' },
                    { Value: 'RAINFORD', Text: 'RAINFORD' },
                    { Value: 'RAINHAM', Text: 'RAINHAM' },
                    { Value: 'RAINHILL', Text: 'RAINHILL' },
                    { Value: 'RAMSBOTTOM', Text: 'RAMSBOTTOM' },
                    { Value: 'RAMSEY', Text: 'RAMSEY' },
                    { Value: 'RAMSGATE', Text: 'RAMSGATE' },
                    { Value: 'RAUNDS', Text: 'RAUNDS' },
                    { Value: 'RAWTENSTALL', Text: 'RAWTENSTALL' },
                    { Value: 'RAYLEIGH', Text: 'RAYLEIGH' },
                    { Value: 'READING', Text: 'READING' },
                    { Value: 'REDCAR', Text: 'REDCAR' },
                    { Value: 'REDDITCH', Text: 'REDDITCH' },
                    { Value: 'REDENHALL WITH HARLESTON', Text: 'REDENHALL WITH HARLESTON' },
                    { Value: 'REDHILL', Text: 'REDHILL' },
                    { Value: 'REDRUTH', Text: 'REDRUTH' },
                    { Value: 'REEPHAM', Text: 'REEPHAM' },
                    { Value: 'REIGATE', Text: 'REIGATE' },
                    { Value: 'RETFORD', Text: 'RETFORD' },
                    { Value: 'RICHMOND', Text: 'RICHMOND' },
                    { Value: 'RICKMANSWORTH', Text: 'RICKMANSWORTH' },
                    { Value: 'RINGWOOD', Text: 'RINGWOOD' },
                    { Value: 'RIPLEY', Text: 'RIPLEY' },
                    { Value: 'RIPON', Text: 'RIPON' },
                    { Value: 'ROBIN HOOD\'S BAY', Text: 'ROBIN HOOD\'S BAY' },
                    { Value: 'ROCHDALE', Text: 'ROCHDALE' },
                    { Value: 'ROCHESTER', Text: 'ROCHESTER' },
                    { Value: 'ROCHFORD', Text: 'ROCHFORD' },
                    { Value: 'ROMFORD', Text: 'ROMFORD' },
                    { Value: 'ROMSEY', Text: 'ROMSEY' },
                    { Value: 'ROSS ON WYE', Text: 'ROSS ON WYE' },
                    { Value: 'ROTHBURY', Text: 'ROTHBURY' },
                    { Value: 'ROTHERHAM', Text: 'ROTHERHAM' },
                    { Value: 'ROTHWELL', Text: 'ROTHWELL' },
                    { Value: 'ROWLEY REGIS', Text: 'ROWLEY REGIS' },
                    { Value: 'ROYAL LEAMINGTON SPA', Text: 'ROYAL LEAMINGTON SPA' },
                    { Value: 'ROYAL TUNBRIDGE WELLS', Text: 'ROYAL TUNBRIDGE WELLS' },
                    { Value: 'ROYAL WOOTTON BASSETT', Text: 'ROYAL WOOTTON BASSETT' },
                    { Value: 'ROYSTON', Text: 'ROYSTON' },
                    { Value: 'ROYTON', Text: 'ROYTON' },
                    { Value: 'RUGBY', Text: 'RUGBY' },
                    { Value: 'RUGELEY', Text: 'RUGELEY' },
                    { Value: 'RUNCORN', Text: 'RUNCORN' },
                    { Value: 'RUSCOTE', Text: 'RUSCOTE' },
                    { Value: 'RUSHDEN', Text: 'RUSHDEN' },
                    { Value: 'RYDE', Text: 'RYDE' },
                    { Value: 'RYE', Text: 'RYE' },
                    { Value: 'RYTON', Text: 'RYTON' },
                    { Value: 'SAFFRON WALDEN', Text: 'SAFFRON WALDEN' },
                    { Value: 'SALCOMBE', Text: 'SALCOMBE' },
                    { Value: 'SALE', Text: 'SALE' },
                    { Value: 'SALFORD', Text: 'SALFORD' },
                    { Value: 'SALISBURY', Text: 'SALISBURY' },
                    { Value: 'SALTASH', Text: 'SALTASH' },
                    { Value: 'SALTBURN BY THE SEA', Text: 'SALTBURN BY THE SEA' },
                    { Value: 'SANDBACH', Text: 'SANDBACH' },
                    { Value: 'SANDHURST', Text: 'SANDHURST' },
                    { Value: 'SANDIACRE', Text: 'SANDIACRE' },
                    { Value: 'SANDOWN', Text: 'SANDOWN' },
                    { Value: 'SANDWICH', Text: 'SANDWICH' },
                    { Value: 'SANDY', Text: 'SANDY' },
                    { Value: 'SAWBRIDGEWORTH', Text: 'SAWBRIDGEWORTH' },
                    { Value: 'SAXMUNDHAM', Text: 'SAXMUNDHAM' },
                    { Value: 'SCARBOROUGH', Text: 'SCARBOROUGH' },
                    { Value: 'SCUNTHORPE', Text: 'SCUNTHORPE' },
                    { Value: 'SEAFORD', Text: 'SEAFORD' },
                    { Value: 'SEAHAM', Text: 'SEAHAM' },
                    { Value: 'SEATON', Text: 'SEATON' },
                    { Value: 'SEDBERGH', Text: 'SEDBERGH' },
                    { Value: 'SEDGEFIELD', Text: 'SEDGEFIELD' },
                    { Value: 'SEDGLEY', Text: 'SEDGLEY' },
                    { Value: 'SELBY', Text: 'SELBY' },
                    { Value: 'SELSEY', Text: 'SELSEY' },
                    { Value: 'SETTLE', Text: 'SETTLE' },
                    { Value: 'SEVENOAKS', Text: 'SEVENOAKS' },
                    { Value: 'SHAFTESBURY', Text: 'SHAFTESBURY' },
                    { Value: 'SHALLCROSS', Text: 'SHALLCROSS' },
                    { Value: 'SHANKLIN', Text: 'SHANKLIN' },
                    { Value: 'SHAW AND CROMPTON', Text: 'SHAW AND CROMPTON' },
                    { Value: 'SHEERNESS', Text: 'SHEERNESS' },
                    { Value: 'SHEFFIELD', Text: 'SHEFFIELD' },
                    { Value: 'SHEFFORD', Text: 'SHEFFORD' },
                    { Value: 'SHEPSHED', Text: 'SHEPSHED' },
                    { Value: 'SHEPTON MALLET', Text: 'SHEPTON MALLET' },
                    { Value: 'SHERBORNE', Text: 'SHERBORNE' },
                    { Value: 'SHERBURN IN ELMET', Text: 'SHERBURN IN ELMET' },
                    { Value: 'SHERFORD', Text: 'SHERFORD' },
                    { Value: 'SHERIFF HILL', Text: 'SHERIFF HILL' },
                    { Value: 'SHERINGHAM', Text: 'SHERINGHAM' },
                    { Value: 'SHIFNAL', Text: 'SHIFNAL' },
                    { Value: 'SHILDON', Text: 'SHILDON' },
                    { Value: 'SHIPLEY', Text: 'SHIPLEY' },
                    { Value: 'SHIPSTON ON STOUR', Text: 'SHIPSTON ON STOUR' },
                    { Value: 'SHIREBROOK', Text: 'SHIREBROOK' },
                    { Value: 'SHOEBURYNESS', Text: 'SHOEBURYNESS' },
                    { Value: 'SHOREHAM BY SEA', Text: 'SHOREHAM BY SEA' },
                    { Value: 'SHREWSBURY', Text: 'SHREWSBURY' },
                    { Value: 'SIDMOUTH', Text: 'SIDMOUTH' },
                    { Value: 'SILLOTH', Text: 'SILLOTH' },
                    { Value: 'SILSDEN', Text: 'SILSDEN' },
                    { Value: 'SITTINGBOURNE', Text: 'SITTINGBOURNE' },
                    { Value: 'SKEGNESS', Text: 'SKEGNESS' },
                    { Value: 'SKELMERSDALE', Text: 'SKELMERSDALE' },
                    { Value: 'SKELTON IN CLEVELAND', Text: 'SKELTON IN CLEVELAND' },
                    { Value: 'SKIPTON', Text: 'SKIPTON' },
                    { Value: 'SLEAFORD', Text: 'SLEAFORD' },
                    { Value: 'SLOUGH', Text: 'SLOUGH' },
                    { Value: 'SMETHWICK', Text: 'SMETHWICK' },
                    { Value: 'SNAITH', Text: 'SNAITH' },
                    { Value: 'SNODLAND', Text: 'SNODLAND' },
                    { Value: 'SOHAM', Text: 'SOHAM' },
                    { Value: 'SOLIHULL', Text: 'SOLIHULL' },
                    { Value: 'SOMERTON', Text: 'SOMERTON' },
                    { Value: 'SOUTH BENFLEET', Text: 'SOUTH BENFLEET' },
                    { Value: 'SOUTH CAVE', Text: 'SOUTH CAVE' },
                    { Value: 'SOUTH ELMSALL', Text: 'SOUTH ELMSALL' },
                    { Value: 'SOUTH KIRKBY AND MOORTHORPE', Text: 'SOUTH KIRKBY AND MOORTHORPE' },
                    { Value: 'SOUTH MOLTON', Text: 'SOUTH MOLTON' },
                    { Value: 'SOUTH PETHERTON', Text: 'SOUTH PETHERTON' },
                    { Value: 'SOUTH SHIELDS', Text: 'SOUTH SHIELDS' },
                    { Value: 'SOUTH WOODHAM FERRERS', Text: 'SOUTH WOODHAM FERRERS' },
                    { Value: 'SOUTHALL', Text: 'SOUTHALL' },
                    { Value: 'SOUTHAM', Text: 'SOUTHAM' },
                    { Value: 'SOUTHAMPTON', Text: 'SOUTHAMPTON' },
                    { Value: 'SOUTHBOROUGH', Text: 'SOUTHBOROUGH' },
                    { Value: 'SOUTHCHURCH', Text: 'SOUTHCHURCH' },
                    { Value: 'SOUTHEND ON SEA', Text: 'SOUTHEND ON SEA' },
                    { Value: 'SOUTHGATE', Text: 'SOUTHGATE' },
                    { Value: 'SOUTHMINSTER', Text: 'SOUTHMINSTER' },
                    { Value: 'SOUTHPORT', Text: 'SOUTHPORT' },
                    { Value: 'SOUTHSEA', Text: 'SOUTHSEA' },
                    { Value: 'SOUTHWARK', Text: 'SOUTHWARK' },
                    { Value: 'SOUTHWELL', Text: 'SOUTHWELL' },
                    { Value: 'SOUTHWICK', Text: 'SOUTHWICK' },
                    { Value: 'SOUTHWOLD', Text: 'SOUTHWOLD' },
                    { Value: 'SOWERBY BRIDGE', Text: 'SOWERBY BRIDGE' },
                    { Value: 'SPALDING', Text: 'SPALDING' },
                    { Value: 'SPENNYMOOR', Text: 'SPENNYMOOR' },
                    { Value: 'SPILSBY', Text: 'SPILSBY' },
                    { Value: 'ST AUSTELL', Text: 'ST AUSTELL' },
                    { Value: 'ST BLAZEY', Text: 'ST BLAZEY' },
                    { Value: 'ST COLUMB MAJOR', Text: 'ST COLUMB MAJOR' },
                    { Value: 'ST HELENS', Text: 'ST HELENS' },
                    { Value: 'ST IVES', Text: 'ST IVES' },
                    { Value: 'ST JUST', Text: 'ST JUST' },
                    { Value: 'ST MARY CRAY', Text: 'ST MARY CRAY' },
                    { Value: 'ST MAWES', Text: 'ST MAWES' },
                    { Value: 'ST NEOTS', Text: 'ST NEOTS' },
                    { Value: 'STAFFORD', Text: 'STAFFORD' },
                    { Value: 'STAINES UPON THAMES', Text: 'STAINES UPON THAMES' },
                    { Value: 'STAINFORTH', Text: 'STAINFORTH' },
                    { Value: 'STALBRIDGE', Text: 'STALBRIDGE' },
                    { Value: 'STALHAM', Text: 'STALHAM' },
                    { Value: 'STALYBRIDGE', Text: 'STALYBRIDGE' },
                    { Value: 'STAMFORD', Text: 'STAMFORD' },
                    { Value: 'STANFIELD LE HOPE', Text: 'STANFIELD LE HOPE' },
                    { Value: 'STANHOPE', Text: 'STANHOPE' },
                    { Value: 'STANLEY', Text: 'STANLEY' },
                    { Value: 'STAPLEFORD', Text: 'STAPLEFORD' },
                    { Value: 'STAVELEY', Text: 'STAVELEY' },
                    { Value: 'STEVENAGE', Text: 'STEVENAGE' },
                    { Value: 'STEYNING', Text: 'STEYNING' },
                    { Value: 'STOCKPORT', Text: 'STOCKPORT' },
                    { Value: 'STOCKSBRIDGE', Text: 'STOCKSBRIDGE' },
                    { Value: 'STOCKTON ON TEES', Text: 'STOCKTON ON TEES' },
                    { Value: 'STOKE ON TRENT', Text: 'STOKE ON TRENT' },
                    { Value: 'STOKESLEY', Text: 'STOKESLEY' },
                    { Value: 'STONE', Text: 'STONE' },
                    { Value: 'STONEHOUSE', Text: 'STONEHOUSE' },
                    { Value: 'STONY STRATFORD', Text: 'STONY STRATFORD' },
                    { Value: 'STOTFOLD', Text: 'STOTFOLD' },
                    { Value: 'STOURBRIDGE', Text: 'STOURBRIDGE' },
                    { Value: 'STOURPORT ON SEVERN', Text: 'STOURPORT ON SEVERN' },
                    { Value: 'STOW ON THE WOLD', Text: 'STOW ON THE WOLD' },
                    { Value: 'STOWMARKET', Text: 'STOWMARKET' },
                    { Value: 'STRATFORD UPON AVON', Text: 'STRATFORD UPON AVON' },
                    { Value: 'STRATTON', Text: 'STRATTON' },
                    { Value: 'STREET', Text: 'STREET' },
                    { Value: 'STRETFORD', Text: 'STRETFORD' },
                    { Value: 'STROOD', Text: 'STROOD' },
                    { Value: 'STROUD', Text: 'STROUD' },
                    { Value: 'STURMINSTER NEWTON', Text: 'STURMINSTER NEWTON' },
                    { Value: 'SUDBURY', Text: 'SUDBURY' },
                    { Value: 'SUNDERLAND', Text: 'SUNDERLAND' },
                    { Value: 'SURBITON', Text: 'SURBITON' },
                    { Value: 'SUTTON COLDFIELD', Text: 'SUTTON COLDFIELD' },
                    { Value: 'SUTTON IN ASHFIELD', Text: 'SUTTON IN ASHFIELD' },
                    { Value: 'SWADLINCOTE', Text: 'SWADLINCOTE' },
                    { Value: 'SWAFFHAM', Text: 'SWAFFHAM' },
                    { Value: 'SWANAGE', Text: 'SWANAGE' },
                    { Value: 'SWANLEY', Text: 'SWANLEY' },
                    { Value: 'SWANSCOMBE AND GREENHITHE', Text: 'SWANSCOMBE AND GREENHITHE' },
                    { Value: 'SWINDON', Text: 'SWINDON' },
                    { Value: 'SWINTON', Text: 'SWINTON' },
                    { Value: 'SYSTON', Text: 'SYSTON' },
                    { Value: 'TADCASTER', Text: 'TADCASTER' },
                    { Value: 'TADLEY', Text: 'TADLEY' },
                    { Value: 'TAMWORTH', Text: 'TAMWORTH' },
                    { Value: 'TAUNTON', Text: 'TAUNTON' },
                    { Value: 'TAVISTOCK', Text: 'TAVISTOCK' },
                    { Value: 'TEIGNMOUTH', Text: 'TEIGNMOUTH' },
                    { Value: 'TELFORD', Text: 'TELFORD' },
                    { Value: 'TELSCOMBE', Text: 'TELSCOMBE' },
                    { Value: 'TENBURY WELLS', Text: 'TENBURY WELLS' },
                    { Value: 'TENTERDEN', Text: 'TENTERDEN' },
                    { Value: 'TETBURY', Text: 'TETBURY' },
                    { Value: 'TEWKESBURY', Text: 'TEWKESBURY' },
                    { Value: 'THAME', Text: 'THAME' },
                    { Value: 'THATCHAM', Text: 'THATCHAM' },
                    { Value: 'THAXTED', Text: 'THAXTED' },
                    { Value: 'THE DEEPINGS', Text: 'THE DEEPINGS' },
                    { Value: 'THETFORD', Text: 'THETFORD' },
                    { Value: 'THIRSK', Text: 'THIRSK' },
                    { Value: 'THORNABY ON TEES', Text: 'THORNABY ON TEES' },
                    { Value: 'THORNBURY', Text: 'THORNBURY' },
                    { Value: 'THORNE', Text: 'THORNE' },
                    { Value: 'THORNTON', Text: 'THORNTON' },
                    { Value: 'THORNTON CLEVELEYS', Text: 'THORNTON CLEVELEYS' },
                    { Value: 'THORPE BAY', Text: 'THORPE BAY' },
                    { Value: 'THORPE ST ANDREW', Text: 'THORPE ST ANDREW' },
                    { Value: 'THRAPSTON', Text: 'THRAPSTON' },
                    { Value: 'TICKHILL', Text: 'TICKHILL' },
                    { Value: 'TIDWORTH', Text: 'TIDWORTH' },
                    { Value: 'TILBURY', Text: 'TILBURY' },
                    { Value: 'TIPTON', Text: 'TIPTON' },
                    { Value: 'TISBURY', Text: 'TISBURY' },
                    { Value: 'TIVERTON', Text: 'TIVERTON' },
                    { Value: 'TODMORDEN', Text: 'TODMORDEN' },
                    { Value: 'TONBRIDGE', Text: 'TONBRIDGE' },
                    { Value: 'TOPSHAM', Text: 'TOPSHAM' },
                    { Value: 'TORPOINT', Text: 'TORPOINT' },
                    { Value: 'TORQUAY', Text: 'TORQUAY' },
                    { Value: 'TOTNES', Text: 'TOTNES' },
                    { Value: 'TOTTENHAM', Text: 'TOTTENHAM' },
                    { Value: 'TOTTINGTON', Text: 'TOTTINGTON' },
                    { Value: 'TOTTON', Text: 'TOTTON' },
                    { Value: 'TOW LAW', Text: 'TOW LAW' },
                    { Value: 'TOWCESTER', Text: 'TOWCESTER' },
                    { Value: 'TRING', Text: 'TRING' },
                    { Value: 'TROWBRIDGE', Text: 'TROWBRIDGE' },
                    { Value: 'TRURO', Text: 'TRURO' },
                    { Value: 'TUNBRIDGE WELLS', Text: 'TUNBRIDGE WELLS' },
                    { Value: 'TUNSTALL', Text: 'TUNSTALL' },
                    { Value: 'TWICKENHAM', Text: 'TWICKENHAM' },
                    { Value: 'TYLDSLEY', Text: 'TYLDSLEY' },
                    { Value: 'TYNEMOUTH', Text: 'TYNEMOUTH' },
                    { Value: 'UCKFIELD', Text: 'UCKFIELD' },
                    { Value: 'ULVERSTON', Text: 'ULVERSTON' },
                    { Value: 'UPPINGHAM', Text: 'UPPINGHAM' },
                    { Value: 'UPTON UPON SEVERN', Text: 'UPTON UPON SEVERN' },
                    { Value: 'UTTOXETER', Text: 'UTTOXETER' },
                    { Value: 'UXBRIDGE', Text: 'UXBRIDGE' },
                    { Value: 'VENTNOR', Text: 'VENTNOR' },
                    { Value: 'VERWOOD', Text: 'VERWOOD' },
                    { Value: 'WADEBRIDGE', Text: 'WADEBRIDGE' },
                    { Value: 'WADHURST', Text: 'WADHURST' },
                    { Value: 'WAINFLEET', Text: 'WAINFLEET' },
                    { Value: 'WAKEFIELD', Text: 'WAKEFIELD' },
                    { Value: 'WALKDEN', Text: 'WALKDEN' },
                    { Value: 'WALLASEY', Text: 'WALLASEY' },
                    { Value: 'WALLINGFORD', Text: 'WALLINGFORD' },
                    { Value: 'WALLSEND', Text: 'WALLSEND' },
                    { Value: 'WALSALL', Text: 'WALSALL' },
                    { Value: 'WALTHAM ABBEY', Text: 'WALTHAM ABBEY' },
                    { Value: 'WALTHAM CROSS', Text: 'WALTHAM CROSS' },
                    { Value: 'WALTHAMSTOW', Text: 'WALTHAMSTOW' },
                    { Value: 'WALTON ON THAMES', Text: 'WALTON ON THAMES' },
                    { Value: 'WALTON ON THE NAZE', Text: 'WALTON ON THE NAZE' },
                    { Value: 'WANTAGE', Text: 'WANTAGE' },
                    { Value: 'WARE', Text: 'WARE' },
                    { Value: 'WAREHAM', Text: 'WAREHAM' },
                    { Value: 'WARMINSTER', Text: 'WARMINSTER' },
                    { Value: 'WARRINGTON', Text: 'WARRINGTON' },
                    { Value: 'WARSOP', Text: 'WARSOP' },
                    { Value: 'WARWICK', Text: 'WARWICK' },
                    { Value: 'WASHINGTON', Text: 'WASHINGTON' },
                    { Value: 'WATCHET', Text: 'WATCHET' },
                    { Value: 'WATERLOOVILLE', Text: 'WATERLOOVILLE' },
                    { Value: 'WATFORD', Text: 'WATFORD' },
                    { Value: 'WATH UPON DEARNE', Text: 'WATH UPON DEARNE' },
                    { Value: 'WATLINGTON', Text: 'WATLINGTON' },
                    { Value: 'WATTON', Text: 'WATTON' },
                    { Value: 'WEDNESBURY', Text: 'WEDNESBURY' },
                    { Value: 'WEDNESFIELD', Text: 'WEDNESFIELD' },
                    { Value: 'WELLINGBOROUGH', Text: 'WELLINGBOROUGH' },
                    { Value: 'WELLINGTON', Text: 'WELLINGTON' },
                    { Value: 'WELLS', Text: 'WELLS' },
                    { Value: 'WELLS NEXT THE SEA', Text: 'WELLS NEXT THE SEA' },
                    { Value: 'WELWYN GARDEN CITY', Text: 'WELWYN GARDEN CITY' },
                    { Value: 'WEM', Text: 'WEM' },
                    { Value: 'WEMBLEY', Text: 'WEMBLEY' },
                    { Value: 'WENDOVER', Text: 'WENDOVER' },
                    { Value: 'WESHAM', Text: 'WESHAM' },
                    { Value: 'WEST BEDLINGTON', Text: 'WEST BEDLINGTON' },
                    { Value: 'WEST BRIDGEFIELD', Text: 'WEST BRIDGEFIELD' },
                    { Value: 'WEST BROMWICH', Text: 'WEST BROMWICH' },
                    { Value: 'WEST HAM', Text: 'WEST HAM' },
                    { Value: 'WEST MALLING', Text: 'WEST MALLING' },
                    { Value: 'WEST MERSEA', Text: 'WEST MERSEA' },
                    { Value: 'WEST THURROCK', Text: 'WEST THURROCK' },
                    { Value: 'WEST TILBURY', Text: 'WEST TILBURY' },
                    { Value: 'WESTBURY', Text: 'WESTBURY' },
                    { Value: 'WESTCLIFF ON SEA', Text: 'WESTCLIFF ON SEA' },
                    { Value: 'WESTERHAM', Text: 'WESTERHAM' },
                    { Value: 'WESTGATE ON SEA', Text: 'WESTGATE ON SEA' },
                    { Value: 'WESTHOUGHTON', Text: 'WESTHOUGHTON' },
                    { Value: 'WESTON OTMOOR', Text: 'WESTON OTMOOR' },
                    { Value: 'WESTON SUPER MARE', Text: 'WESTON SUPER MARE' },
                    { Value: 'WETHERBY', Text: 'WETHERBY' },
                    { Value: 'WEYBRIDGE', Text: 'WEYBRIDGE' },
                    { Value: 'WEYMOUTH', Text: 'WEYMOUTH' },
                    { Value: 'WHALEY BRIDGE', Text: 'WHALEY BRIDGE' },
                    { Value: 'WHISTON', Text: 'WHISTON' },
                    { Value: 'WHITBY', Text: 'WHITBY' },
                    { Value: 'WHITCHURCH', Text: 'WHITCHURCH' },
                    { Value: 'WHITEFIELD', Text: 'WHITEFIELD' },
                    { Value: 'WHITEHAVEN', Text: 'WHITEHAVEN' },
                    { Value: 'WHITEHILL', Text: 'WHITEHILL' },
                    { Value: 'WHITLEY BAY', Text: 'WHITLEY BAY' },
                    { Value: 'WHITNASH', Text: 'WHITNASH' },
                    { Value: 'WHITSTABLE', Text: 'WHITSTABLE' },
                    { Value: 'WHITTLESEY', Text: 'WHITTLESEY' },
                    { Value: 'WHITWORTH', Text: 'WHITWORTH' },
                    { Value: 'WICKFORD', Text: 'WICKFORD' },
                    { Value: 'WICKHAM', Text: 'WICKHAM' },
                    { Value: 'WICKWAR', Text: 'WICKWAR' },
                    { Value: 'WIDNES', Text: 'WIDNES' },
                    { Value: 'WIGAN', Text: 'WIGAN' },
                    { Value: 'WIGSTON MAGNA', Text: 'WIGSTON MAGNA' },
                    { Value: 'WIGTON', Text: 'WIGTON' },
                    { Value: 'WILLENHALL', Text: 'WILLENHALL' },
                    { Value: 'WILLESDEN', Text: 'WILLESDEN' },
                    { Value: 'WILLINGTON', Text: 'WILLINGTON' },
                    { Value: 'WILLINGTON QUAY', Text: 'WILLINGTON QUAY' },
                    { Value: 'WILMSLOW', Text: 'WILMSLOW' },
                    { Value: 'WILTON', Text: 'WILTON' },
                    { Value: 'WIMBLEDON', Text: 'WIMBLEDON' },
                    { Value: 'WIMBORNE MINSTER', Text: 'WIMBORNE MINSTER' },
                    { Value: 'WINCANTON', Text: 'WINCANTON' },
                    { Value: 'WINCHCOMBE', Text: 'WINCHCOMBE' },
                    { Value: 'WINCHELSEA', Text: 'WINCHELSEA' },
                    { Value: 'WINCHESTER', Text: 'WINCHESTER' },
                    { Value: 'WINDERMERE', Text: 'WINDERMERE' },
                    { Value: 'WINDSOR', Text: 'WINDSOR' },
                    { Value: 'WINDY NOOK', Text: 'WINDY NOOK' },
                    { Value: 'WINSFORD', Text: 'WINSFORD' },
                    { Value: 'WINSLOW', Text: 'WINSLOW' },
                    { Value: 'WINTERTON', Text: 'WINTERTON' },
                    { Value: 'WIRKSWORTH', Text: 'WIRKSWORTH' },
                    { Value: 'WISBECH', Text: 'WISBECH' },
                    { Value: 'WITHAM', Text: 'WITHAM' },
                    { Value: 'WITHERNSEA', Text: 'WITHERNSEA' },
                    { Value: 'WITNEY', Text: 'WITNEY' },
                    { Value: 'WIVELISCOMBE', Text: 'WIVELISCOMBE' },
                    { Value: 'WIVENHOE', Text: 'WIVENHOE' },
                    { Value: 'WIXAMS', Text: 'WIXAMS' },
                    { Value: 'WOBURN', Text: 'WOBURN' },
                    { Value: 'WOBURN SANDS', Text: 'WOBURN SANDS' },
                    { Value: 'WOKING', Text: 'WOKING' },
                    { Value: 'WOKINGHAM', Text: 'WOKINGHAM' },
                    { Value: 'WOLSINGHAM', Text: 'WOLSINGHAM' },
                    { Value: 'WOLVERHAMPTON', Text: 'WOLVERHAMPTON' },
                    { Value: 'WOLVERTON AND GREENLEYS', Text: 'WOLVERTON AND GREENLEYS' },
                    { Value: 'WOMBWELL', Text: 'WOMBWELL' },
                    { Value: 'WOOD GREEN', Text: 'WOOD GREEN' },
                    { Value: 'WOODBRIDGE', Text: 'WOODBRIDGE' },
                    { Value: 'WOODLEY', Text: 'WOODLEY' },
                    { Value: 'WOODSTOCK', Text: 'WOODSTOCK' },
                    { Value: 'WOOLER', Text: 'WOOLER' },
                    { Value: 'WORCESTER', Text: 'WORCESTER' },
                    { Value: 'WORKINGTON', Text: 'WORKINGTON' },
                    { Value: 'WORKSOP', Text: 'WORKSOP' },
                    { Value: 'WORSLEY', Text: 'WORSLEY' },
                    { Value: 'WORTHING', Text: 'WORTHING' },
                    { Value: 'WOTTON UNDER EDGE', Text: 'WOTTON UNDER EDGE' },
                    { Value: 'WRAGBY', Text: 'WRAGBY' },
                    { Value: 'WROXHAM', Text: 'WROXHAM' },
                    { Value: 'WYMONDHAM', Text: 'WYMONDHAM' },
                    { Value: 'YARM', Text: 'YARM' },
                    { Value: 'YARMOUTH', Text: 'YARMOUTH' },
                    { Value: 'YATE', Text: 'YATE' },
                    { Value: 'YATELEY', Text: 'YATELEY' },
                    { Value: 'YEADON', Text: 'YEADON' },
                    { Value: 'YEOVIL', Text: 'YEOVIL' },
                    { Value: 'YORK', Text: 'YORK' }
                ];        
            } else if (Country_Value.toUpperCase() === 'FIJI') {
                return [
                    { Value: null, Text: 'N/A' },
                    { Value: 'Ba', Text: 'Ba' },
                    { Value: 'Dreketi', Text: 'Dreketi' },
                    { Value: 'Korolevu', Text: 'Korolevu' },
                    { Value: 'Korovou', Text: 'Korovou' },
                    { Value: 'Labasa', Text: 'Labasa' },
                    { Value: 'Lami', Text: 'Lami' },
                    { Value: 'Lautoka', Text: 'Lautoka' },
                    { Value: 'Levuka', Text: 'Levuka' },
                    { Value: 'Lomawai', Text: 'Lomawai' },
                    { Value: 'Nadelei', Text: 'Nadelei' },
                    { Value: 'Nadi', Text: 'Nadi' },
                    { Value: 'Nakasi', Text: 'Nakasi' },
                    { Value: 'Nasinu', Text: 'Nasinu' },
                    { Value: 'Natumbua', Text: 'Natumbua' },
                    { Value: 'Nausori', Text: 'Nausori' },
                    { Value: 'Navua', Text: 'Navua' },
                    { Value: 'Rakiraki', Text: 'Rakiraki' },
                    { Value: 'Savusavu', Text: 'Savusavu' },
                    { Value: 'Seaqaqa', Text: 'Seaqaqa' },
                    { Value: 'Sigatoka', Text: 'Sigatoka' },
                    { Value: 'Suva', Text: 'Suva' },
                    { Value: 'Tavua', Text: 'Tavua' },
                    { Value: 'Vatukoula', Text: 'Vatukoula' }
                ];
            } else if (Country_Value.toUpperCase() === 'GUATEMALA') {
                return [
                    { Value: null, Text: 'N/A' },
                    { Value: 'Alta Verapaz', Text: 'Alta Verapaz' },
                    { Value: 'Baja Verapaz', Text: 'Baja Verapaz' },
                    { Value: 'Chimaltenango', Text: 'Chimaltenango' },
                    { Value: 'Chiquimula', Text: 'Chiquimula' },
                    { Value: 'El Progreso', Text: 'El Progreso' },
                    { Value: 'Escuintla', Text: 'Escuintla' },
                    { Value: 'Guatemala', Text: 'Guatemala' },
                    { Value: 'Huehuetenango', Text: 'Huehuetenango' },
                    { Value: 'Izabal', Text: 'Izabal' },
                    { Value: 'Jalapa', Text: 'Jalapa' },
                    { Value: 'Jutiapa', Text: 'Jutiapa' },
                    { Value: 'Petén', Text: 'Petén' },
                    { Value: 'Quetzaltenango', Text: 'Quetzaltenango' },
                    { Value: 'Quiché', Text: 'Quiché' },
                    { Value: 'Retalhuleu', Text: 'Retalhuleu' },
                    { Value: 'Sacatepéquez', Text: 'Sacatepéquez' },
                    { Value: 'San Marcos', Text: 'San Marcos' },
                    { Value: 'Santa Rosa', Text: 'Santa Rosa' },
                    { Value: 'Sololá', Text: 'Sololá' },
                    { Value: 'Suchitepéquez', Text: 'Suchitepéquez' },
                    { Value: 'Totonicapán', Text: 'Totonicapán' },
                    { Value: 'Zacapa', Text: 'Zacapa' }
                ];
            } else if (Country_Value.toUpperCase() === 'IRELAND') {
                return [
                    { Value: null, Text: 'N/A' },
                    { Value: 'Antrim', Text: 'Antrim' },
                    { Value: 'Armagh', Text: 'Armagh' },
                    { Value: 'Carlow', Text: 'Carlow' },
                    { Value: 'Cavan', Text: 'Cavan' },
                    { Value: 'Clare', Text: 'Clare' },
                    { Value: 'Cork', Text: 'Cork' },
                    { Value: 'Derry', Text: 'Derry' },
                    { Value: 'Donegal', Text: 'Donegal' },
                    { Value: 'Down', Text: 'Down' },
                    { Value: 'Dublin', Text: 'Dublin' },
                    { Value: 'Fermanagh', Text: 'Fermanagh' },
                    { Value: 'Galway', Text: 'Galway' },
                    { Value: 'Kerry', Text: 'Kerry' },
                    { Value: 'Kildare', Text: 'Kildare' },
                    { Value: 'Kilkenny', Text: 'Kilkenny' },
                    { Value: 'Laois', Text: 'Laois' },
                    { Value: 'Leitrim', Text: 'Leitrim' },
                    { Value: 'Limerick', Text: 'Limerick' },
                    { Value: 'Longford', Text: 'Longford' },
                    { Value: 'Louth', Text: 'Louth' },
                    { Value: 'Mayo', Text: 'Mayo' },
                    { Value: 'Meath', Text: 'Meath' },
                    { Value: 'Monaghan', Text: 'Monaghan' },
                    { Value: 'Offaly', Text: 'Offaly' },
                    { Value: 'Roscommon', Text: 'Roscommon' },
                    { Value: 'Sligo', Text: 'Sligo' },
                    { Value: 'Tipperary', Text: 'Tipperary' },
                    { Value: 'Tyrone', Text: 'Tyrone' },
                    { Value: 'Waterford', Text: 'Waterford' },
                    { Value: 'Westmeath', Text: 'Westmeath' },
                    { Value: 'Wexford', Text: 'Wexford' },
                    { Value: 'Wicklow', Text: 'Wicklow' },
                ];
            } else if (Country_Value.toUpperCase() === 'JAMAICA') {
                return [
                    { Value: null, Text: 'N/A' },
                    { Value: 'Hanover', Text: 'Hanover' },
                    { Value: 'Saint Elizabeth', Text: 'Saint Elizabeth' },
                    { Value: 'Saint James', Text: 'Saint James' },
                    { Value: 'Trelawny', Text: 'Trelawny' },
                    { Value: 'Westmoreland', Text: 'Westmoreland' },
                    { Value: 'Clarendon', Text: 'Clarendon' },
                    { Value: 'Manchester', Text: 'Manchester' },
                    { Value: 'Saint Ann', Text: 'Saint Ann' },
                    { Value: 'Saint Catherine', Text: 'Saint Catherine' },
                    { Value: 'Saint Mary', Text: 'Saint Mary' },
                    { Value: 'Kingston Parish', Text: 'Kingston Parish' },
                    { Value: 'Portland', Text: 'Portland' },
                    { Value: 'Saint Andrew', Text: 'Saint Andrew' },
                    { Value: 'Saint Thomas', Text: 'Saint Thomas' }
                ];
            } else if (Country_Value.toUpperCase() === 'MEXICO') {
                return [
                    { Value: null, Text: 'N/A' },
                    { Value: 'Aguascalientes', Text: 'Aguascalientes' },
                    { Value: 'Baja California', Text: 'Baja California' },
                    { Value: 'Baja California Sur', Text: 'Baja California Sur' },
                    { Value: 'Campeche', Text: 'Campeche' },
                    { Value: 'Chiapas', Text: 'Chiapas' },
                    { Value: 'Ciudad de México', Text: 'Ciudad de México' },
                    { Value: 'Chihuahua', Text: 'Chihuahua' },
                    { Value: 'Coahuila de Zaragoza', Text: 'Coahuila de Zaragoza' },
                    { Value: 'Colima', Text: 'Colima' },
                    { Value: 'Durango', Text: 'Durango' },
                    { Value: 'Guanajuato', Text: 'Guanajuato' },
                    { Value: 'Guerrero', Text: 'Guerrero' },
                    { Value: 'Hidalgo', Text: 'Hidalgo' },
                    { Value: 'Jalisco', Text: 'Jalisco' },
                    { Value: 'México', Text: 'México' },
                    { Value: 'Michoacán de Ocampo', Text: 'Michoacán de Ocampo' },
                    { Value: 'Morelos', Text: 'Morelos' },
                    { Value: 'Nayarit', Text: 'Nayarit' },
                    { Value: 'Nuevo León', Text: 'Nuevo León' },
                    { Value: 'Oaxaca', Text: 'Oaxaca' },
                    { Value: 'Puebla', Text: 'Puebla' },
                    { Value: 'Querétaro de Arteaga', Text: 'Querétaro de Arteaga' },
                    { Value: 'Quintana Roo', Text: 'Quintana Roo' },
                    { Value: 'San Luis Potosí', Text: 'San Luis Potosí' },
                    { Value: 'Sinaloa', Text: 'Sinaloa' },
                    { Value: 'Sonora', Text: 'Sonora' },
                    { Value: 'Tabasco', Text: 'Tabasco' },
                    { Value: 'Tamaulipas', Text: 'Tamaulipas' },
                    { Value: 'Tlaxcala', Text: 'Tlaxcala' },
                    { Value: 'Veracruz de Ignacio de la Llave', Text: 'Veracruz de Ignacio de la Llave' },
                    { Value: 'Yucatán', Text: 'Yucatán' },
                    { Value: 'Zacatecas', Text: 'Zacatecas' }
                ];
            } else if (Country_Value.toUpperCase() === 'MOZAMBIQUE') {
                return [
                    { Value: null, Text: 'N/A' },
                    { Value: 'Cabo Delgado', Text: 'Cabo Delgado' },
                    { Value: 'Gaza', Text: 'Gaza' },
                    { Value: 'Inhambane', Text: 'Inhambane' },
                    { Value: 'Manica', Text: 'Manica' },
                    { Value: 'Maputo City', Text: 'Maputo City' },
                    { Value: 'Maputo', Text: 'Maputo' },
                    { Value: 'Nampula', Text: 'Nampula' },
                    { Value: 'Niassa', Text: 'Niassa' },
                    { Value: 'Sofala', Text: 'Sofala' },
                    { Value: 'Tete', Text: 'Tete' },
                    { Value: 'Zambezia', Text: 'Zambezia' }
                ];
            } else if (Country_Value.toUpperCase() === 'NAMIBIA') {
                return [
                    { Value: null, Text: 'N/A' },
                    { Value: 'Erongo', Text: 'Erongo' },
                    { Value: 'Hardap', Text: 'Hardap' },
                    { Value: 'Karas', Text: 'Karas' },
                    { Value: 'Kavango East', Text: 'Kavango East' },
                    { Value: 'Kavango West', Text: 'Kavango West' },
                    { Value: 'Khomas', Text: 'Khomas' },
                    { Value: 'Kunene', Text: 'Kunene' },
                    { Value: 'Ohangwena', Text: 'Ohangwena' },
                    { Value: 'Omaheke', Text: 'Omaheke' },
                    { Value: 'Omusati', Text: 'Omusati' },
                    { Value: 'Oshana', Text: 'Oshana' },
                    { Value: 'Oshikoto', Text: 'Oshikoto' },
                    { Value: 'Zambezi', Text: 'Zambezi' }
                ];
            } else if (Country_Value.toUpperCase() === 'NEW ZEALAND') {
                return [
                    { Value: null, Text: 'N/A' },
                    { Value:'Auckland', Text:'Auckland' },
                    { Value:'Bay Of Plenty', Text:'Bay Of Plenty' },
                    { Value:'Canterbuy', Text:'Canterbuy' },
                    { Value:'Gisbone', Text:'Gisbone' },
                    { Value:'Hawke\'s Bay', Text:'Hawke\'s Bay' },
                    { Value:'Manawatu-Wanganui', Text:'Manawatu-Wanganui' },
                    { Value:'Marlborough', Text:'Marlborough' },
                    { Value:'Nelson', Text:'Nelson' },
                    { Value:'Northland', Text:'Northland' },
                    { Value:'Otago', Text:'Otago' },
                    { Value:'Southland', Text:'Southland' },
                    { Value:'Taranaki', Text:'Taranaki' },
                    { Value:'Tasman', Text:'Tasman' },
                    { Value:'Waikato', Text:'Waikato' },
                    { Value:'Wellington', Text:'Wellington' },
                    { Value:'West Coast', Text:'West Coast' }
                ];
            } else if (Country_Value.toUpperCase() === 'NIGERIA') {
                return [
                    { Value: null, Text: 'N/A' },
                    { Value: 'Abia', Text: 'Abia' },
                    { Value: 'Adamawa', Text: 'Adamawa' },
                    { Value: 'Akwa Ibom', Text: 'Akwa Ibom' },
                    { Value: 'Anambra', Text: 'Anambra' },
                    { Value: 'Bauchi', Text: 'Bauchi' },
                    { Value: 'Bayelsa', Text: 'Bayelsa' },
                    { Value: 'Benue', Text: 'Benue' },
                    { Value: 'Borno', Text: 'Borno' },
                    { Value: 'Cross River', Text: 'Cross River' },
                    { Value: 'Delta', Text: 'Delta' },
                    { Value: 'Ebonyi', Text: 'Ebonyi' },
                    { Value: 'Enugu', Text: 'Enugu' },
                    { Value: 'Edo', Text: 'Edo' },
                    { Value: 'Ekiti', Text: 'Ekiti' },
                    { Value: 'Federal Capital Territory', Text: 'Federal Capital Territory' },
                    { Value: 'Gombe', Text: 'Gombe' },
                    { Value: 'Imo', Text: 'Imo' },
                    { Value: 'Jigawa', Text: 'Jigawa' },
                    { Value: 'Kaduna', Text: 'Kaduna' },
                    { Value: 'Kano', Text: 'Kano' },
                    { Value: 'Katsina', Text: 'Katsina' },
                    { Value: 'Kebbi', Text: 'Kebbi' },
                    { Value: 'Kogi', Text: 'Kogi' },
                    { Value: 'Kwara', Text: 'Kwara' },
                    { Value: 'Lagos', Text: 'Lagos' },
                    { Value: 'Nasarawa', Text: 'Nasarawa' },
                    { Value: 'Niger', Text: 'Niger' },
                    { Value: 'Ogun', Text: 'Ogun' },
                    { Value: 'Ondo', Text: 'Ondo' },
                    { Value: 'Osun', Text: 'Osun' },
                    { Value: 'Oyo', Text: 'Oyo' },
                    { Value: 'Plateau', Text: 'Plateau' },
                    { Value: 'Rivers', Text: 'Rivers' },
                    { Value: 'Sokoto', Text: 'Sokoto' },
                    { Value: 'Taraba', Text: 'Taraba' },
                    { Value: 'Yobe', Text: 'Yobe' },
                    { Value: 'Zamfara', Text: 'Zamfara' }
                ];        
            } else if (Country_Value.toUpperCase() === 'PHILIPPINES') {
                return [
                    { Value: null, Text: 'N/A' },
                    { Value: 'Abra', Text: 'Abra' },
                    { Value: 'Agusan del Norte', Text: 'Agusan del Norte' },
                    { Value: 'Agusan del Sur', Text: 'Agusan del Sur' },
                    { Value: 'Aklan', Text: 'Aklan' },
                    { Value: 'Albay', Text: 'Albay' },
                    { Value: 'Antique', Text: 'Antique' },
                    { Value: 'Apayao', Text: 'Apayao' },
                    { Value: 'Aurora', Text: 'Aurora' },
                    { Value: 'Basilan', Text: 'Basilan' },
                    { Value: 'Bataan', Text: 'Bataan' },
                    { Value: 'Batanes', Text: 'Batanes' },
                    { Value: 'Batangas', Text: 'Batangas' },
                    { Value: 'Benguet', Text: 'Benguet' },
                    { Value: 'Biliran', Text: 'Biliran' },
                    { Value: 'Bohol', Text: 'Bohol' },
                    { Value: 'Bukidnon', Text: 'Bukidnon' },
                    { Value: 'Bulacan', Text: 'Bulacan' },
                    { Value: 'Cagayan', Text: 'Cagayan' },
                    { Value: 'Camarines Norte', Text: 'Camarines Norte' },
                    { Value: 'Camarines Sur', Text: 'Camarines Sur' },
                    { Value: 'Camiguin', Text: 'Camiguin' },
                    { Value: 'Capiz', Text: 'Capiz' },
                    { Value: 'Catanduanes', Text: 'Catanduanes' },
                    { Value: 'Cavite', Text: 'Cavite' },
                    { Value: 'Cebu', Text: 'Cebu' },
                    { Value: 'Compostela Valley', Text: 'Compostela Valley' },
                    { Value: 'Cotabato', Text: 'Cotabato' },
                    { Value: 'Davao del Norte', Text: 'Davao del Norte' },
                    { Value: 'Davao del Sur', Text: 'Davao del Sur' },
                    { Value: 'Davao Occidental', Text: 'Davao Occidental' },
                    { Value: 'Dinagat Islands', Text: 'Dinagat Islands' },
                    { Value: 'Eastern Samar', Text: 'Eastern Samar' },
                    { Value: 'Guimaras', Text: 'Guimaras' },
                    { Value: 'Ifugao', Text: 'Ifugao' },
                    { Value: 'Ilocos Norte', Text: 'Ilocos Norte' },
                    { Value: 'Ilocos Sur', Text: 'Ilocos Sur' },
                    { Value: 'Iloilo', Text: 'Iloilo' },
                    { Value: 'Isabela', Text: 'Isabela' },
                    { Value: 'Kalinga', Text: 'Kalinga' },
                    { Value: 'La Union', Text: 'La Union' },
                    { Value: 'Laguna', Text: 'Laguna' },
                    { Value: 'Lanao del Norte', Text: 'Lanao del Norte' },
                    { Value: 'Lanao del Sur', Text: 'Lanao del Sur' },
                    { Value: 'Leyte', Text: 'Leyte' },
                    { Value: 'Maguindanao', Text: 'Maguindanao' },
                    { Value: 'Marinduque', Text: 'Marinduque' },
                    { Value: 'Masbate', Text: 'Masbate' },
                    { Value: 'Misamis Occidental', Text: 'Misamis Occidental' },
                    { Value: 'Misamis Oriental', Text: 'Misamis Oriental' },
                    { Value: 'Mountain Province', Text: 'Mountain Province' },
                    { Value: 'Negros Occidental', Text: 'Negros Occidental' },
                    { Value: 'Northern Samar', Text: 'Northern Samar' },
                    { Value: 'Nueva Ecija', Text: 'Nueva Ecija' },
                    { Value: 'Nueva Vizcaya', Text: 'Nueva Vizcaya' },
                    { Value: 'Occidental Mindoro', Text: 'Occidental Mindoro' },
                    { Value: 'Palawan', Text: 'Palawan' },
                    { Value: 'Pampanga', Text: 'Pampanga' },
                    { Value: 'Pangasinan', Text: 'Pangasinan' },
                    { Value: 'Quezon', Text: 'Quezon' },
                    { Value: 'Quirino', Text: 'Quirino' },
                    { Value: 'Rizal', Text: 'Rizal' },
                    { Value: 'Romblon', Text: 'Romblon' },
                    { Value: 'Samar', Text: 'Samar' },
                    { Value: 'Sarangani', Text: 'Sarangani' },
                    { Value: 'Siquijor', Text: 'Siquijor' },
                    { Value: 'Sorsogon', Text: 'Sorsogon' },
                    { Value: 'South Cotabato', Text: 'South Cotabato' },
                    { Value: 'Southern Leyte', Text: 'Southern Leyte' },
                    { Value: 'Sultan Kudarat', Text: 'Sultan Kudarat' },
                    { Value: 'Sulu', Text: 'Sulu' },
                    { Value: 'Surigao del Norte', Text: 'Surigao del Norte' },
                    { Value: 'Surigao del Sur', Text: 'Surigao del Sur' },
                    { Value: 'Tarlac', Text: 'Tarlac' },
                    { Value: 'Tawi-Tawi', Text: 'Tawi-Tawi' },
                    { Value: 'Zambales', Text: 'Zambales' },
                    { Value: 'Zamboanga del Norte', Text: 'Zamboanga del Norte' },
                    { Value: 'Zamboanga del Sur', Text: 'Zamboanga del Sur' },
                    { Value: 'Zamboanga Sibugay', Text: 'Zamboanga Sibugay' }
                ];
            } else if (Country_Value.toUpperCase() === 'SAUDI ARABIA') {
                return [
                    { Value: null, Text: 'N/A' },
                    { Value: 'Tabuk', Text: 'Tabuk' },
                    { Value: 'Riyadh', Text: 'Riyadh' },
                    { Value: 'Qassim', Text: 'Qassim' },
                    { Value: 'Gisbone', Text: 'Gisbone' },
                    { Value: 'Madinah', Text: 'Madinah' },
                    { Value: 'Makkah', Text: 'Makkah' },
                    { Value: 'Northern Borders', Text: 'Northern Borders' },
                    { Value: 'Jawf', Text: 'Jawf' },
                    { Value: 'Ha\'il', Text: 'Ha\'il' },
                    { Value: 'Bahah', Text: 'Bahah' },
                    { Value: 'Jizan', Text: 'Jizan' },
                    { Value: '\'Asir', Text: '\'Asir' },
                    { Value: 'Najran', Text: 'Najran' },
                    { Value: 'Eastern Province', Text: 'Eastern Province' }
                ];
            } else if (Country_Value.toUpperCase() === 'SCOTLAND') {
                return [
                    { Value: null, Text: 'N/A' },
                    { Value: 'Aberdeen', Text: 'Aberdeen' },
                    { Value: 'Aberfeldy', Text: 'Aberfeldy' },
                    { Value: 'Aberlour', Text: 'Aberlour' },
                    { Value: 'Aboyne', Text: 'Aboyne' },
                    { Value: 'Acharacle', Text: 'Acharacle' },
                    { Value: 'Achnasheen', Text: 'Achnasheen' },
                    { Value: 'Airdrie', Text: 'Airdrie' },
                    { Value: 'Alexandria', Text: 'Alexandria' },
                    { Value: 'Alford', Text: 'Alford' },
                    { Value: 'Alloa', Text: 'Alloa' },
                    { Value: 'Alness', Text: 'Alness' },
                    { Value: 'Alva', Text: 'Alva' },
                    { Value: 'Annan', Text: 'Annan' },
                    { Value: 'Anstruther', Text: 'Anstruther' },
                    { Value: 'Appin', Text: 'Appin' },
                    { Value: 'Arbroath', Text: 'Arbroath' },
                    { Value: 'Ardgay', Text: 'Ardgay' },
                    { Value: 'Arisaig', Text: 'Arisaig' },
                    { Value: 'Arrochar', Text: 'Arrochar' },
                    { Value: 'Auchterarder', Text: 'Auchterarder' },
                    { Value: 'Aviemore', Text: 'Aviemore' },
                    { Value: 'Avoch', Text: 'Avoch' },
                    { Value: 'Ayr', Text: 'Ayr' },
                    { Value: 'Balerno', Text: 'Balerno' },
                    { Value: 'Ballachulish', Text: 'Ballachulish' },
                    { Value: 'Ballater', Text: 'Ballater' },
                    { Value: 'Ballindalloch', Text: 'Ballindalloch' },
                    { Value: 'Banchory', Text: 'Banchory' },
                    { Value: 'Banff', Text: 'Banff' },
                    { Value: 'Bathgate', Text: 'Bathgate' },
                    { Value: 'Beauly', Text: 'Beauly' },
                    { Value: 'Bellshill', Text: 'Bellshill' },
                    { Value: 'Berriedale', Text: 'Berriedale' },
                    { Value: 'Berwick-upon-Tweed', Text: 'Berwick-upon-Tweed' },
                    { Value: 'Biggar', Text: 'Biggar' },
                    { Value: 'Bishopton', Text: 'Bishopton' },
                    { Value: 'Blairgowrie', Text: 'Blairgowrie' },
                    { Value: 'Bo\'Ness', Text: 'Bo\'Ness' },
                    { Value: 'Boat of Garten', Text: 'Boat of Garten' },
                    { Value: 'Bonnybridge', Text: 'Bonnybridge' },
                    { Value: 'Bonnyrigg', Text: 'Bonnyrigg' },
                    { Value: 'Brechin', Text: 'Brechin' },
                    { Value: 'Bridge of Orchy', Text: 'Bridge of Orchy' },
                    { Value: 'Bridge of Weir', Text: 'Bridge of Weir' },
                    { Value: 'Brora', Text: 'Brora' },
                    { Value: 'Broxburn', Text: 'Broxburn' },
                    { Value: 'Buckie', Text: 'Buckie' },
                    { Value: 'Burntisland', Text: 'Burntisland' },
                    { Value: 'Cairndow', Text: 'Cairndow' },
                    { Value: 'Callander', Text: 'Callander' },
                    { Value: 'Campbeltown', Text: 'Campbeltown' },
                    { Value: 'Canonbie', Text: 'Canonbie' },
                    { Value: 'Carluke', Text: 'Carluke' },
                    { Value: 'Carnoustie', Text: 'Carnoustie' },
                    { Value: 'Carrbridge', Text: 'Carrbridge' },
                    { Value: 'Castle Douglas', Text: 'Castle Douglas' },
                    { Value: 'Clackmannan', Text: 'Clackmannan' },
                    { Value: 'Clydebank', Text: 'Clydebank' },
                    { Value: 'Coatbridge', Text: 'Coatbridge' },
                    { Value: 'Cockburnspath', Text: 'Cockburnspath' },
                    { Value: 'Coldstream', Text: 'Coldstream' },
                    { Value: 'Colintraive', Text: 'Colintraive' },
                    { Value: 'Cornhill-on-Tweed', Text: 'Cornhill-on-Tweed' },
                    { Value: 'Corrour', Text: 'Corrour' },
                    { Value: 'Cowdenbeath', Text: 'Cowdenbeath' },
                    { Value: 'Crianlarich', Text: 'Crianlarich' },
                    { Value: 'Crieff', Text: 'Crieff' },
                    { Value: 'Cromarty', Text: 'Cromarty' },
                    { Value: 'Cumnock', Text: 'Cumnock' },
                    { Value: 'Cupar', Text: 'Cupar' },
                    { Value: 'Currie', Text: 'Currie' },
                    { Value: 'Dalbeattie', Text: 'Dalbeattie' },
                    { Value: 'Dalkeith', Text: 'Dalkeith' },
                    { Value: 'Dalmally', Text: 'Dalmally' },
                    { Value: 'Dalwhinnie', Text: 'Dalwhinnie' },
                    { Value: 'Darvel', Text: 'Darvel' },
                    { Value: 'Denny', Text: 'Denny' },
                    { Value: 'Dingwall', Text: 'Dingwall' },
                    { Value: 'Dollar', Text: 'Dollar' },
                    { Value: 'Dornoch', Text: 'Dornoch' },
                    { Value: 'Doune', Text: 'Doune' },
                    { Value: 'Dumbarton', Text: 'Dumbarton' },
                    { Value: 'Dumfries', Text: 'Dumfries' },
                    { Value: 'Dunbar', Text: 'Dunbar' },
                    { Value: 'Dunbeath', Text: 'Dunbeath' },
                    { Value: 'Dunblane', Text: 'Dunblane' },
                    { Value: 'Dundee', Text: 'Dundee' },
                    { Value: 'Dunfermline', Text: 'Dunfermline' },
                    { Value: 'Dunkeld', Text: 'Dunkeld' },
                    { Value: 'Dunoon', Text: 'Dunoon' },
                    { Value: 'Duns', Text: 'Duns' },
                    { Value: 'Earlston', Text: 'Earlston' },
                    { Value: 'East Linton', Text: 'East Linton' },
                    { Value: 'Edinburgh', Text: 'Edinburgh' },
                    { Value: 'Elgin', Text: 'Elgin' },
                    { Value: 'Ellon', Text: 'Ellon' },
                    { Value: 'Erskine', Text: 'Erskine' },
                    { Value: 'Eyemouth', Text: 'Eyemouth' },
                    { Value: 'Falkirk', Text: 'Falkirk' },
                    { Value: 'Fochabers', Text: 'Fochabers' },
                    { Value: 'Forfar', Text: 'Forfar' },
                    { Value: 'Forres', Text: 'Forres' },
                    { Value: 'Forsinard', Text: 'Forsinard' },
                    { Value: 'Fort Augustus', Text: 'Fort Augustus' },
                    { Value: 'Fort William', Text: 'Fort William' },
                    { Value: 'Fortrose', Text: 'Fortrose' },
                    { Value: 'Fraserburgh', Text: 'Fraserburgh' },
                    { Value: 'Fullarton', Text: 'Fullarton' },
                    { Value: 'Gairloch', Text: 'Gairloch' },
                    { Value: 'Galashiels', Text: 'Galashiels' },
                    { Value: 'Galston', Text: 'Galston' },
                    { Value: 'Garve', Text: 'Garve' },
                    { Value: 'Glasgow', Text: 'Glasgow' },
                    { Value: 'Glenfinnan', Text: 'Glenfinnan' },
                    { Value: 'Glenrothes', Text: 'Glenrothes' },
                    { Value: 'Golspie', Text: 'Golspie' },
                    { Value: 'Gordon', Text: 'Gordon' },
                    { Value: 'Gorebridge', Text: 'Gorebridge' },
                    { Value: 'Gourock', Text: 'Gourock' },
                    { Value: 'Grangemouth', Text: 'Grangemouth' },
                    { Value: 'Grantown-on-Spey', Text: 'Grantown-on-Spey' },
                    { Value: 'Greenock', Text: 'Greenock' },
                    { Value: 'Gretna', Text: 'Gretna' },
                    { Value: 'Gullane', Text: 'Gullane' },
                    { Value: 'Haddington', Text: 'Haddington' },
                    { Value: 'Halkirk', Text: 'Halkirk' },
                    { Value: 'Hamilton', Text: 'Hamilton' },
                    { Value: 'Hawick', Text: 'Hawick' },
                    { Value: 'Helensburgh', Text: 'Helensburgh' },
                    { Value: 'Helmsdale', Text: 'Helmsdale' },
                    { Value: 'Heriot', Text: 'Heriot' },
                    { Value: 'Humbie', Text: 'Humbie' },
                    { Value: 'Huntly', Text: 'Huntly' },
                    { Value: 'Innerleithen', Text: 'Innerleithen' },
                    { Value: 'Insch', Text: 'Insch' },
                    { Value: 'Inveraray', Text: 'Inveraray' },
                    { Value: 'Invergarry', Text: 'Invergarry' },
                    { Value: 'Invergordon', Text: 'Invergordon' },
                    { Value: 'Inverkeithing', Text: 'Inverkeithing' },
                    { Value: 'Inverness', Text: 'Inverness' },
                    { Value: 'Inverurie', Text: 'Inverurie' },
                    { Value: 'Irvine', Text: 'Irvine' },
                    { Value: 'Isle of Barra', Text: 'Isle of Barra' },
                    { Value: 'Isle of Benbecula', Text: 'Isle of Benbecula' },
                    { Value: 'Isle of Bute', Text: 'Isle of Bute' },
                    { Value: 'Isle of Canna', Text: 'Isle of Canna '},
                    { Value: 'Isle of Coll', Text: 'Isle of Coll' },
                    { Value: 'Isle of Colonsay', Text: 'Isle of Colonsay' },
                    { Value: 'Isle of Eigg', Text: 'Isle of Eigg' },
                    { Value: 'Isle of Gigha', Text: 'Isle of Gigha' },
                    { Value: 'Isle of Harris', Text: 'Isle of Harris' },
                    { Value: 'Isle of Iona', Text: 'Isle of Iona' },
                    { Value: 'Isle of Islay', Text: 'Isle of Islay' },
                    { Value: 'Isle of Jura', Text: 'Isle of Jura' },
                    { Value: 'Isle of Lewis', Text: 'Isle of Lewis' },
                    { Value: 'Isle of Mull', Text: 'Isle of Mull' },
                    { Value: 'Isle of North Uist', Text: 'Isle of North Uist' },
                    { Value: 'Isle of Rum', Text: 'Isle of Rum' },
                    { Value: 'Isle of Scalpay', Text: 'Isle of Scalpay' },
                    { Value: 'Isle of Skye', Text: 'Isle of Skye' },
                    { Value: 'Isle of South Uist', Text: 'Isle of South Uist' },
                    { Value: 'Isle of Tiree', Text: 'Isle of Tiree' },
                    { Value: 'Jedburgh', Text: 'Jedburgh' },
                    { Value: 'Johnstone', Text: 'Johnstone' },
                    { Value: 'Juniper Green', Text: 'Juniper Green' },
                    { Value: 'Keith', Text: 'Keith' },
                    { Value: 'Kelso', Text: 'Kelso' },
                    { Value: 'Kelty', Text: 'Kelty' },
                    { Value: 'Killin', Text: 'Killin' },
                    { Value: 'Kilmacolm', Text: 'Kilmacolm' },
                    { Value: 'Kilmarnock', Text: 'Kilmarnock' },
                    { Value: 'Kinbrace', Text: 'Kinbrace' },
                    { Value: 'Kingussie', Text: 'Kingussie' },
                    { Value: 'Kinlochleven', Text: 'Kinlochleven' },
                    { Value: 'Kinross', Text: 'Kinross' },
                    { Value: 'Kirkcaldy', Text: 'Kirkcaldy' },
                    { Value: 'Kirkcudbright', Text: 'Kirkcudbright' },
                    { Value: 'Kirkliston', Text: 'Kirkliston' },
                    { Value: 'Kirknewton', Text: 'Kirknewton' },
                    { Value: 'Kirkwall', Text: 'Kirkwall' },
                    { Value: 'Kirriemuir', Text: 'Kirriemuir' },
                    { Value: 'Kyle', Text: 'Kyle' },
                    { Value: 'Lairg', Text: 'Lairg' },
                    { Value: 'Lanark', Text: 'Lanark' },
                    { Value: 'Langholm', Text: 'Langholm' },
                    { Value: 'Larbert', Text: 'Larbert' },
                    { Value: 'Larkhall', Text: 'Larkhall' },
                    { Value: 'Lasswade', Text: 'Lasswade' },
                    { Value: 'Latheron', Text: 'Latheron' },
                    { Value: 'Lauder', Text: 'Lauder' },
                    { Value: 'Laurencekirk', Text: 'Laurencekirk' },
                    { Value: 'Leven', Text: 'Leven' },
                    { Value: 'Linlithgow', Text: 'Linlithgow' },
                    { Value: 'Livingston', Text: 'Livingston' },
                    { Value: 'Loanhead', Text: 'Loanhead' },
                    { Value: 'Lochailort', Text: 'Lochailort' },
                    { Value: 'Lochearnhead', Text: 'Lochearnhead' },
                    { Value: 'Lochgelly', Text: 'Lochgelly' },
                    { Value: 'Lochgilphead', Text: 'Lochgilphead' },
                    { Value: 'Lochwinnoch', Text: 'Lochwinnoch' },
                    { Value: 'Lockerbie', Text: 'Lockerbie' },
                    { Value: 'Longniddry', Text: 'Longniddry' },
                    { Value: 'Lossiemouth', Text: 'Lossiemouth' },
                    { Value: 'Lybster', Text: 'Lybster' },
                    { Value: 'Macduff', Text: 'Macduff' },
                    { Value: 'Mallaig', Text: 'Mallaig' },
                    { Value: 'Mauchline', Text: 'Mauchline' },
                    { Value: 'Melrose', Text: 'Melrose' },
                    { Value: 'Menstrie', Text: 'Menstrie' },
                    { Value: 'Milltimber', Text: 'Milltimber' },
                    { Value: 'Mindrum', Text: 'Mindrum' },
                    { Value: 'Moffat', Text: 'Moffat' },
                    { Value: 'Montrose', Text: 'Montrose' },
                    { Value: 'Motherwell', Text: 'Motherwell' },
                    { Value: 'Muir of Ord', Text: 'Muir of Ord' },
                    { Value: 'Munlochy', Text: 'Munlochy' },
                    { Value: 'Musselburgh', Text: 'Musselburgh' },
                    { Value: 'Nairn', Text: 'Nairn' },
                    { Value: 'Nethy Bridge', Text: 'Nethy Bridge' },
                    { Value: 'Newbridge', Text: 'Newbridge' },
                    { Value: 'Newcastleton', Text: 'Newcastleton' },
                    { Value: 'Newmilns', Text: 'Newmilns' },
                    { Value: 'Newport-on-Tay', Text: 'Newport-on-Tay' },
                    { Value: 'Newton Stewart', Text: 'Newton Stewart' },
                    { Value: 'Newtonmore', Text: 'Newtonmore' },
                    { Value: 'North Berwick', Text: 'North Berwick' },
                    { Value: 'Oban', Text: 'Oban' },
                    { Value: 'Orkney', Text: 'Orkney' },
                    { Value: 'Paisley', Text: 'Paisley' },
                    { Value: 'Pathhead', Text: 'Pathhead' },
                    { Value: 'Patna And Drongan', Text: 'Patna And Drongan' },
                    { Value: 'Peebles', Text: 'Peebles' },
                    { Value: 'Penicuik', Text: 'Penicuik' },
                    { Value: 'Perth', Text: 'Perth' },
                    { Value: 'Peterculter', Text: 'Peterculter' },
                    { Value: 'Peterhead', Text: 'Peterhead' },
                    { Value: 'Pitlochry', Text: 'Pitlochry' },
                    { Value: 'Plockton', Text: 'Plockton' },
                    { Value: 'Port Glasgow', Text: 'Port Glasgow' },
                    { Value: 'Portree', Text: 'Portree' },
                    { Value: 'Prestonpans', Text: 'Prestonpans' },
                    { Value: 'Renfrew', Text: 'Renfrew' },
                    { Value: 'Rogart', Text: 'Rogart' },
                    { Value: 'Rosewell', Text: 'Rosewell' },
                    { Value: 'Roslin', Text: 'Roslin' },
                    { Value: 'Roy Bridge', Text: 'Roy Bridge' },
                    { Value: 'Sanquhar', Text: 'Sanquhar' },
                    { Value: 'Selkirk', Text: 'Selkirk' },
                    { Value: 'Shetland', Text: 'Shetland' },
                    { Value: 'Shotts', Text: 'Shotts' },
                    { Value: 'Skelmorlie', Text: 'Skelmorlie' },
                    { Value: 'South Queensferry', Text: 'South Queensferry' },
                    { Value: 'Spean Bridge', Text: 'Spean Bridge' },
                    { Value: 'Springside', Text: 'Springside' },
                    { Value: 'St. Andrews', Text: 'St. Andrews' },
                    { Value: 'Stirling', Text: 'Stirling' },
                    { Value: 'Stonehaven', Text: 'Stonehaven' },
                    { Value: 'Stornoway', Text: 'Stornoway' },
                    { Value: 'Stranraer', Text: 'Stranraer' },
                    { Value: 'Strathaven', Text: 'Strathaven' },
                    { Value: 'Strathcarron', Text: 'Strathcarron' },
                    { Value: 'Strathdon', Text: 'Strathdon' },
                    { Value: 'Strathpeffer', Text: 'Strathpeffer' },
                    { Value: 'Strome Ferry', Text: 'Strome Ferry' },
                    { Value: 'Stromness', Text: 'Stromness' },
                    { Value: 'Tain', Text: 'Tain' },
                    { Value: 'Tarbert', Text: 'Tarbert' },
                    { Value: 'Taynuilt', Text: 'Taynuilt' },
                    { Value: 'Tayport', Text: 'Tayport' },
                    { Value: 'Thornhill', Text: 'Thornhill' },
                    { Value: 'Thurso', Text: 'Thurso' },
                    { Value: 'Tighnabruaich', Text: 'Tighnabruaich' },
                    { Value: 'Tillicoultry', Text: 'Tillicoultry' },
                    { Value: 'Tranent', Text: 'Tranent' },
                    { Value: 'Turriff', Text: 'Turriff' },
                    { Value: 'Ullapool', Text: 'Ullapool' },
                    { Value: 'Walkerburn', Text: 'Walkerburn' },
                    { Value: 'Wemyss Bay', Text: 'Wemyss Bay' },
                    { Value: 'West Calder', Text: 'West Calder' },
                    { Value: 'West Linton', Text: 'West Linton' },
                    { Value: 'Westhill', Text:'Westhill'},
                    { Value: 'Wick', Text: 'Wick' },
                    { Value: 'Wishaw', Text: 'Wishaw' }
                ];
            } else if (Country_Value.toUpperCase() === 'SOUTH AFRICA') {
                return [
                    { Value: null, Text: 'N/A' },
                    { Value: 'Eastern Cape', Text: 'Eastern Cape' },
                    { Value: 'Free State', Text: 'Free State' },
                    { Value: 'Gauteng', Text: 'Gauteng' },
                    { Value: 'KwaZulu-Natal', Text: 'KwaZulu-Natal' },
                    { Value: 'Limpopo', Text: 'Limpopo' },
                    { Value: 'Mpumalanga', Text: 'Mpumalanga' },
                    { Value: 'North West', Text: 'North West' },
                    { Value: 'Northern Cape', Text: 'Northern Cape' },
                    { Value: 'Western Cape', Text: 'Western Cape' }
                ];
            } else if (Country_Value.toUpperCase() === 'TANZANIA') {
                return [
                    { Value: null, Text: 'N/A' },
                    { Value: 'Arusha', Text: 'Arusha' },
                    { Value: 'Dar es Salaam', Text: 'Dar es Salaam' },
                    { Value: 'Dodoma', Text: 'Dodoma' },
                    { Value: 'Geita', Text: 'Geita' },
                    { Value: 'Iringa', Text: 'Iringa' },
                    { Value: 'Kagera', Text: 'Kagera' },
                    { Value: 'Katavi', Text: 'Katavi' },
                    { Value: 'Kigoma', Text: 'Kigoma' },
                    { Value: 'Kilimanjaro', Text: 'Kilimanjaro' },
                    { Value: 'Lindi', Text: 'Lindi' },
                    { Value: 'Manyara', Text: 'Manyara' },
                    { Value: 'Mara', Text: 'Mara' },
                    { Value: 'Mbeya', Text: 'Mbeya' },
                    { Value: 'Mjini Magharibi', Text: 'Mjini Magharibi' },
                    { Value: 'Morogoro', Text: 'Morogoro' },
                    { Value: 'Mtwara', Text: 'Mtwara' },
                    { Value: 'Mwanza', Text: 'Mwanza' },
                    { Value: 'Njombe', Text: 'Njombe' },
                    { Value: 'Pemba North', Text: 'Pemba North' },
                    { Value: 'Pemba South', Text: 'Pemba South' },
                    { Value: 'Pwani', Text: 'Pwani' },
                    { Value: 'Rukwa', Text: 'Rukwa' },
                    { Value: 'Ruvuma', Text: 'Ruvuma' },
                    { Value: 'Shinyanga', Text: 'Shinyanga' },
                    { Value: 'Simiyu', Text: 'Simiyu' },
                    { Value: 'Singida', Text: 'Singida' },
                    { Value: 'Songwe', Text: 'Songwe' },
                    { Value: 'Tabora', Text: 'Tabora' },
                    { Value: 'Tanga', Text: 'Tanga' },
                    { Value: 'Unguja North', Text: 'Unguja North' },
                    { Value: 'Unguja South', Text: 'Unguja South' }
                ];        
            } else if (Country_Value.toUpperCase() === 'TRINIDAD AND TOBAGO') {
                return [
                    { Value: null, Text: 'N/A' },
                    { Value: 'Arima', Text: 'Arima' },
                    { Value: 'Chaguanas', Text: 'Chaguanas' },
                    { Value: 'Couva-Tabaquite-Talparo', Text: 'Couva-Tabaquite-Talparo' },
                    { Value: 'Diego Martin', Text: 'Diego Martin' },
                    { Value: 'Mayaro-Rio Claro', Text: 'Mayaro-Rio Claro' },
                    { Value: 'Penal-Debe', Text: 'Penal-Debe' },
                    { Value: 'Point Fortin', Text: 'Point Fortin' },
                    { Value: 'Port of Spain', Text: 'Port of Spain' },
                    { Value: 'Princes Town', Text: 'Princes Town' },
                    { Value: 'San Fernando', Text: 'San Fernando' },
                    { Value: 'Sangre Grande', Text: 'Sangre Grande' },
                    { Value: 'San Juan-Laventille', Text: 'San Juan-Laventille' },
                    { Value: 'Siparia', Text: 'Siparia' },
                    { Value: 'Tobago', Text: 'Tobago' },
                    { Value: 'Tunapuna/Piarco', Text: 'Tunapuna/Piarco' },
                ];
            } else if (Country_Value.toUpperCase() === 'UGANDA') {
                return [
                    { Value: null, Text: 'N/A' },
                    { Value: 'Central', Text: 'Central' },
                    { Value: 'Western', Text: 'Western' },
                    { Value: 'Eastern', Text: 'Eastern' },
                    { Value: 'Northern', Text: 'Northern' }
                ];
            } else if (Country_Value.toUpperCase() === 'UNITED ARAB EMIRATES') {
                return [
                    { Value: null, Text: 'N/A' },
                    { Value: 'Abu Dhabi', Text: 'Abu Dhabi' },
                    { Value: 'Ajman', Text: 'Ajman' },
                    { Value: 'Dubai', Text: 'Dubai' },
                    { Value: 'Fujairah', Text: 'Fujairah' },
                    { Value: 'Ras al-Khaimah', Text: 'Ras al-Khaimah' },
                    { Value: 'Sharjah', Text: 'Sharjah' },
                    { Value: 'Umm al-Quwain', Text: 'Umm al-Quwain' }
                ];        
            } else if (Country_Value.toUpperCase() === 'UNITED STATES') {
                return [
                    { Value: null, Text: 'N/A' },
                    { Value: 'AL', Text: 'AL' },
                    { Value: 'AK', Text: 'AK' },
                    { Value: 'AR', Text: 'AR' },
                    { Value: 'AZ', Text: 'AZ' },                
                    { Value: 'CA', Text: 'CA' },
                    { Value: 'CO', Text: 'CO' },
                    { Value: 'CT', Text: 'CT' },
                    { Value: 'DE', Text: 'DE' },
                    { Value: 'DC', Text: 'DC' },
                    { Value: 'FL', Text: 'FL' },
                    { Value: 'GA', Text: 'GA' },
                    { Value: 'HI', Text: 'HI' },
                    { Value: 'IA', Text: 'IA' },
                    { Value: 'ID', Text: 'ID' },
                    { Value: 'IL', Text: 'IL' },
                    { Value: 'IN', Text: 'IN' },                
                    { Value: 'KS', Text: 'KS' },
                    { Value: 'KY', Text: 'KY' },
                    { Value: 'LA', Text: 'LA' },
                    { Value: 'MA', Text: 'MA' },
                    { Value: 'MD', Text: 'MD' },
                    { Value: 'ME', Text: 'ME' },
                    { Value: 'MI', Text: 'MI' },
                    { Value: 'MN', Text: 'MN' },
                    { Value: 'MO', Text: 'MO' },
                    { Value: 'MS', Text: 'MS' },                
                    { Value: 'MT', Text: 'MT' },
                    { Value: 'NC', Text: 'NC' },
                    { Value: 'ND', Text: 'ND' },
                    { Value: 'NE', Text: 'NE' },
                    { Value: 'NH', Text: 'NH' },
                    { Value: 'NJ', Text: 'NJ' },
                    { Value: 'NM', Text: 'NM' },
                    { Value: 'NV', Text: 'NV' },                
                    { Value: 'NY', Text: 'NY' },
                    { Value: 'OH', Text: 'OH' },
                    { Value: 'OK', Text: 'OK' },
                    { Value: 'OR', Text: 'OR' },
                    { Value: 'PA', Text: 'PA' },
                    { Value: 'RI', Text: 'RI' },
                    { Value: 'SC', Text: 'SC' },
                    { Value: 'SD', Text: 'SD' },
                    { Value: 'TN', Text: 'TN' },
                    { Value: 'TX', Text: 'TX' },
                    { Value: 'UT', Text: 'UT' },
                    { Value: 'VA', Text: 'VA' },
                    { Value: 'VT', Text: 'VT' },                
                    { Value: 'WA', Text: 'WA' },
                    { Value: 'WI', Text: 'WI' },
                    { Value: 'WV', Text: 'WV' },                
                    { Value: 'WY', Text: 'WY' }
                ];
            } else if (Country_Value.toUpperCase() === 'WALES') {
                return [
                    { Value: null, Text: 'N/A' },
                    { Value: 'ABERAERON', Text: 'ABERAERON' },
                    { Value: 'ABERDARE', Text: 'ABERDARE' },
                    { Value: 'ABERGAVENNY', Text: 'ABERGAVENNY' },
                    { Value: 'ABERGELE', Text: 'ABERGELE' },
                    { Value: 'ABERTILLERY', Text: 'ABERTILLERY' },
                    { Value: 'ABERYSTWYTH', Text: 'ABERYSTWYTH' },
                    { Value: 'AMLWCH', Text: 'AMLWCH' },
                    { Value: 'AMMANFORD', Text: 'AMMANFORD' },
                    { Value: 'BAGALLIT', Text: 'BAGALLIT' },
                    { Value: 'BALA', Text: 'BALA' },
                    { Value: 'BANGOR', Text: 'BANGOR' },
                    { Value: 'BARMOUTH', Text: 'BARMOUTH' },
                    { Value: 'BARRY', Text: 'BARRY' },
                    { Value: 'BEAUMARIS', Text: 'BEAUMARIS' },
                    { Value: 'BENLLECH', Text: 'BENLLECH' },
                    { Value: 'BETWS Y COED', Text: 'BETWS Y COED' },
                    { Value: 'BLAENAU FFESTINIOG', Text: 'BLAENAU FFESTINIOG' },
                    { Value: 'BLAINA', Text: 'BLAINA' },
                    { Value: 'BRECON', Text: 'BRECON' },
                    { Value: 'BRIDGEND', Text: 'BRIDGEND' },
                    { Value: 'BROUGHTON', Text: 'BROUGHTON' },
                    { Value: 'BRYNMAWR', Text: 'BRYNMAWR' },
                    { Value: 'BUCKLEY', Text: 'BUCKLEY' },
                    { Value: 'BUILTH WELLS', Text: 'BUILTH WELLS' },
                    { Value: 'BURRY PORT', Text: 'BURRY PORT' },
                    { Value: 'CAERNARFON', Text: 'CAERNARFON' },
                    { Value: 'CAERPHILLY', Text: 'CAERPHILLY' },
                    { Value: 'CAERWYS', Text: 'CAERWYS' },
                    { Value: 'CALDICOT', Text: 'CALDICOT' },
                    { Value: 'CARDIFF', Text: 'CARDIFF' },
                    { Value: 'CARDIGAN', Text: 'CARDIGAN' },
                    { Value: 'CARMARTHEN', Text: 'CARMARTHEN' },
                    { Value: 'CARROG', Text: 'CARROG' },
                    { Value: 'CEFNLLYS', Text: 'CEFNLLYS' },
                    { Value: 'CHEPSTOW', Text: 'CHEPSTOW' },
                    { Value: 'CHIRK', Text: 'CHIRK' },
                    { Value: 'COLWYN BAY', Text: 'COLWYN BAY' },
                    { Value: 'CONNAH\'S QUAY', Text: 'CONNAH\'S QUAY' },
                    { Value: 'CONWY', Text: 'CONWY' },
                    { Value: 'CORWEN', Text: 'CORWEN' },
                    { Value: 'COWBRIDGE', Text: 'COWBRIDGE' },
                    { Value: 'CRICCIETH', Text: 'CRICCIETH' },
                    { Value: 'CRICKHOWELL', Text: 'CRICKHOWELL' },
                    { Value: 'CWMBRAN', Text: 'CWMBRAN' },
                    { Value: 'DEGANWY', Text: 'DEGANWY' },
                    { Value: 'DENBIGH', Text: 'DENBIGH' },
                    { Value: 'DOLGELLAU', Text: 'DOLGELLAU' },
                    { Value: 'EBBW VALE', Text: 'EBBW VALE' },
                    { Value: 'EWOLE', Text: 'EWOLE' },
                    { Value: 'FFESTINIOG', Text: 'FFESTINIOG' },
                    { Value: 'FISHGUARD', Text: 'FISHGUARD' },
                    { Value: 'FLINT', Text: 'FLINT' },
                    { Value: 'GARNANT', Text: 'GARNANT' },
                    { Value: 'GELLIFOR', Text: 'GELLIFOR' },
                    { Value: 'GLANAMMAN', Text: 'GLANAMMAN' },
                    { Value: 'GOODWICK', Text: 'GOODWICK' },
                    { Value: 'GORSEINON', Text: 'GORSEINON' },
                    { Value: 'HAKIN', Text: 'HAKIN' },
                    { Value: 'HARLECH', Text: 'HARLECH' },
                    { Value: 'HAVERFORDWEST', Text: 'HAVERFORDWEST' },
                    { Value: 'HAWARDEN', Text: 'HAWARDEN' },
                    { Value: 'HAY ON WYE', Text: 'HAY ON WYE' },
                    { Value: 'HOLYHEAD', Text: 'HOLYHEAD' },
                    { Value: 'HOLYWELL', Text: 'HOLYWELL' },
                    { Value: 'KIDWELLY', Text: 'KIDWELLY' },
                    { Value: 'KNIGHTON', Text: 'KNIGHTON' },
                    { Value: 'LAMPETER', Text: 'LAMPETER' },
                    { Value: 'LAUGHARNE', Text: 'LAUGHARNE' },
                    { Value: 'LLANBERIS', Text: 'LLANBERIS' },
                    { Value: 'LLANDEILO', Text: 'LLANDEILO' },
                    { Value: 'LLANDOVERY', Text: 'LLANDOVERY' },
                    { Value: 'LLANDRINDOD WELLS', Text: 'LLANDRINDOD WELLS' },
                    { Value: 'LLANDUDNO', Text: 'LLANDUDNO' },
                    { Value: 'LLANDUDNO JUNCTION', Text: 'LLANDUDNO JUNCTION' },
                    { Value: 'LLANDYSUL', Text: 'LLANDYSUL' },
                    { Value: 'LLANELLI', Text: 'LLANELLI' },
                    { Value: 'LLANFACHRETH', Text: 'LLANFACHRETH' },
                    { Value: 'LLANFAIR CAEREINION', Text: 'LLANFAIR CAEREINION' },
                    { Value: 'LLANFAIRFECHAN', Text: 'LLANFAIRFECHAN' },
                    { Value: 'LLANFAIRPWLLGWYNGYLL', Text: 'LLANFAIRPWLLGWYNGYLL' },
                    { Value: 'LLANFYLLIN', Text: 'LLANFYLLIN' },
                    { Value: 'LLANGEFNI', Text: 'LLANGEFNI' },
                    { Value: 'LLANGOLLEN', Text: 'LLANGOLLEN' },
                    { Value: 'LLANGORS', Text: 'LLANGORS' },
                    { Value: 'LLANIDLOES', Text: 'LLANIDLOES' },
                    { Value: 'LLANRWST', Text: 'LLANRWST' },
                    { Value: 'LLANTRISANT', Text: 'LLANTRISANT' },
                    { Value: 'LLANTWIT MAJOR', Text: 'LLANTWIT MAJOR' },
                    { Value: 'LLANWRTYD WELLS', Text: 'LLANWRTYD WELLS' },
                    { Value: 'LLIW VALEY', Text: 'LLIW VALEY' },
                    { Value: 'MACHYNLLETH', Text: 'MACHYNLLETH' },
                    { Value: 'MAESTEG', Text: 'MAESTEG' },
                    { Value: 'MENAI BRIDGE', Text: 'MENAI BRIDGE' },
                    { Value: 'MERTHYR TYDFIL', Text: 'MERTHYR TYDFIL' },
                    { Value: 'MILFORD HAVEN', Text: 'MILFORD HAVEN' },
                    { Value: 'MOLD', Text: 'MOLD' },
                    { Value: 'MONMOUTH', Text: 'MONMOUTH' },
                    { Value: 'MONTGOMERY', Text: 'MONTGOMERY' },
                    { Value: 'NARBERTH', Text: 'NARBERTH' },
                    { Value: 'NEATH', Text: 'NEATH' },
                    { Value: 'NEFYN', Text: 'NEFYN' },
                    { Value: 'NEW QUAY', Text: 'NEW QUAY' },
                    { Value: 'NEWCASTLE EMLYN', Text: 'NEWCASTLE EMLYN' },
                    { Value: 'NEWPORT', Text: 'NEWPORT' },
                    { Value: 'NEWTOWN', Text: 'NEWTOWN' },
                    { Value: 'NEYLAND', Text: 'NEYLAND' },
                    { Value: 'OLD COLWYN', Text: 'OLD COLWYN' },
                    { Value: 'OLD RADNOR', Text: 'OLD RADNOR' },
                    { Value: 'OVERTON ON DEE', Text: 'OVERTON ON DEE' },
                    { Value: 'PEMBROKE', Text: 'PEMBROKE' },
                    { Value: 'PEMBROKE DOCK', Text: 'PEMBROKE DOCK' },
                    { Value: 'PENARTH', Text: 'PENARTH' },
                    { Value: 'PENMAENMAWR', Text: 'PENMAENMAWR' },
                    { Value: 'PONTYPRIDD', Text: 'PONTYPRIDD' },
                    { Value: 'PORT TALBOT', Text: 'PORT TALBOT' },
                    { Value: 'PORTH', Text: 'PORTH' },
                    { Value: 'PORTHCAWL', Text: 'PORTHCAWL' },
                    { Value: 'PORTHMADOG', Text: 'PORTHMADOG' },
                    { Value: 'PRESTATYN', Text: 'PRESTATYN' },
                    { Value: 'PRESTEIGNE', Text: 'PRESTEIGNE' },
                    { Value: 'PWLLHELI', Text: 'PWLLHELI' },
                    { Value: 'QUEENSFERRY', Text: 'QUEENSFERRY' },
                    { Value: 'RHAYADER', Text: 'RHAYADER' },
                    { Value: 'RHOSLLANNERCHRUGOG', Text: 'RHOSLLANNERCHRUGOG' },
                    { Value: 'RHOSNESNI', Text: 'RHOSNESNI' },
                    { Value: 'RHUDDLAN', Text: 'RHUDDLAN' },
                    { Value: 'RHYL', Text: 'RHYL' },
                    { Value: 'RUTHIN', Text: 'RUTHIN' },
                    { Value: 'SALTNEY', Text: 'SALTNEY' },
                    { Value: 'SHOTTON', Text: 'SHOTTON' },
                    { Value: 'ST ASAPH', Text: 'ST ASAPH' },
                    { Value: 'ST CLEARS', Text: 'ST CLEARS' },
                    { Value: 'ST DAVIDS', Text: 'ST DAVIDS' },
                    { Value: 'SWANSEA', Text: 'SWANSEA' },
                    { Value: 'TAFARNAUBACH', Text: 'TAFARNAUBACH' },
                    { Value: 'TALGARTH', Text: 'TALGARTH' },
                    { Value: 'TENBY', Text: 'TENBY' },
                    { Value: 'TOWYN', Text: 'TOWYN' },
                    { Value: 'TREDEGAR', Text: 'TREDEGAR' },
                    { Value: 'TREGARON', Text: 'TREGARON' },
                    { Value: 'TYWYN', Text: 'TYWYN' },
                    { Value: 'USK', Text: 'USK' },
                    { Value: 'WELSHPOOL', Text: 'WELSHPOOL' },
                    { Value: 'WHITLAND', Text: 'WHITLAND' },
                    { Value: 'WREXHAM', Text: 'WREXHAM' },
                    { Value: 'Y FELINHELI', Text: 'Y FELINHELI' }
                ];
            } else if (Country_Value.toUpperCase() === 'ZAMBIA') {
                return [
                    { Value: null, Text: 'N/A' },
                    { Value: 'Central', Text: 'Central' },
                    { Value: 'Copperbelt', Text: 'Copperbelt' },
                    { Value: 'Eastern', Text: 'Eastern' },
                    { Value: 'Luapula', Text: 'Luapula' },
                    { Value: 'Lusaka', Text: 'Lusaka' },
                    { Value: 'Muchinga', Text: 'Muchinga' },
                    { Value: 'North-Western', Text: 'North-Western' },
                    { Value: 'Northern', Text: 'Northern' },
                    { Value: 'Southern', Text: 'Southern' },
                    { Value: 'Western', Text: 'Western' }
                ];
            } else if (Country_Value.toUpperCase() === 'ZIMBABWE') {
                return [
                    { Value: null, Text: 'N/A' },
                    { Value: 'Bulawayo', Text: 'Bulawayo' },
                    { Value: 'Harare', Text: 'Harare' },
                    { Value: 'Manicaland', Text: 'Manicaland' },
                    { Value: 'Mashonaland Central', Text: 'Mashonaland Central' },
                    { Value: 'Mashonaland East', Text: 'Mashonaland East' },
                    { Value: 'Mashonaland West', Text: 'Mashonaland West' },
                    { Value: 'Masvingo', Text: 'Masvingo' },
                    { Value: 'Matabeleland North', Text: 'Matabeleland North' },
                    { Value: 'Matabeleland South', Text: 'Matabeleland South' },
                    { Value: 'Midlands', Text: 'Midlands' }
                ];        
            } else {
                return [{ Value: null, Text: 'N/A' }];
            }
        } catch (ex) {
            throw Error('Global.GetRegions>>' + ex.message);
        }
    },
    PadInteger(number, length) {
        let str = '' + number;
        while (str.length < length) {
            str = '0' + str;
        }
        return str;
    },
    ValidEmailAddress(Email_Value) {
        var re = /^(([^<>()[\]\\.,;:\s@\"]+(\.[^<>()[\]\\.,;:\s@\"]+)*)|(\".+\"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
        return re.test(Email_Value);
    },
    ValidDate(Year_Value, Month_Value, Day_Value) {
        if ((Year_Value < 1753 || Year_Value > 2099) || (Month_Value <= 0 || Month_Value > 12)) { 
            return false;
        } else {
            let _DaysInMonth = new Date(Year_Value, Month_Value, 0).getDate();
            if (Day_Value <= 0 || Day_Value > _DaysInMonth) {
                return false;
            } else {
                return true;
            }
        }
    },
    StringHasContent(String_Value) {
        return (String_Value !== null && String_Value.trim().length > 0);
    },
    atob(input) {
        let chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/=';
        let str = input.replace(/=+$/, '');
        let output = '';
    
        if (str.length % 4 == 1) {
          throw new Error("'atob' failed: The string to be decoded is not correctly encoded.");
        }
        for (let bc = 0, bs = 0, buffer, i = 0;
          buffer = str.charAt(i++);
    
          ~buffer && (bs = bc % 4 ? bs * 64 + buffer : buffer,
            bc++ % 4) ? output += String.fromCharCode(255 & bs >> (-2 * bc & 6)) : 0
        ) {
          buffer = chars.indexOf(buffer);
        }
        return output;
    },
    TimeSince(date) {
        try {
            let _Seconds = Math.floor((new Date() - date) / 1000);
            let _Interval = _Seconds / 31536000;
            if (_Interval > 1) {
              return Math.floor(_Interval) + ' year' + (_Interval > 2 ? 's' : '') + ' ago';
            }
            _Interval = _Seconds / 2592000;
            if (_Interval > 1) {
              return Math.floor(_Interval) + ' month' + (_Interval > 2 ? 's' : '') + ' ago';
            }
            _Interval = _Seconds / 86400;
            if (_Interval > 1) {
              return Math.floor(_Interval) + ' day' + (_Interval > 2 ? 's' : '') + ' ago';
            }
            _Interval = _Seconds / 3600;
            if (_Interval > 1) {
              return Math.floor(_Interval) + ' hour' + (_Interval > 2 ? 's' : '') + ' ago';
            }
            _Interval = _Seconds / 60;
            if (_Interval > 1) {
              return Math.floor(_Interval) + ' minute' + (_Interval > 2 ? 's' : '') + ' ago';
            }
            return Math.floor(_Seconds) + ' second' + (_Seconds > 2 ? 's' : '') + ' ago';
        } catch (ex) {
            throw Error('Global.TimeSince>>' + ex.message);
        }
    },
};