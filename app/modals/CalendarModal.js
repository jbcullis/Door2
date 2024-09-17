import React, { Component } from 'react';
import {
    View,
    Text,
    Image,
    Animated,
    Pressable,
} from 'react-native';
module.exports = class CalendarModal extends Component {
    constructor(props) {
        super(props);
    };    
    IsActive() {
        try {
            return Global.State.hasOwnProperty(this.props.ModelID) && Global.State[this.props.ModelID] !== null;
        } catch (ex) {
            global.Log({Message: 'CalendarModal.IsActive>>' + ex.message});
        }
    };
    Show(Params_Value) {
        try {

            //Set Selected Date
            if (!(Params_Value.hasOwnProperty('SelectedYear') && Params_Value.SelectedYear > 0)) { Params_Value.SelectedYear = new Date().getFullYear(); };
            if (!(Params_Value.hasOwnProperty('SelectedMonth') && Params_Value.SelectedMonth > 0)) { Params_Value.SelectedMonth = parseInt(new Date().getMonth() + 1); };
            if (!(Params_Value.hasOwnProperty('SelectedDay') && Params_Value.SelectedDay > 0)) { Params_Value.SelectedDay = new Date().getDate(); };

            //Set Minimum Date
            let _MinDate = new Date(1900, 0, 1);
            if (Params_Value.hasOwnProperty('MinimumYear') && Params_Value.MinimumYear > 0 && 
                Params_Value.hasOwnProperty('MinimumMonth') && Params_Value.MinimumMonth > 0 && 
                Params_Value.hasOwnProperty('MinimumDay') && Params_Value.MinimumDay > 0) {
                _MinDate = new Date(Params_Value.MinimumYear, Params_Value.MinimumMonth - 1, Params_Value.MinimumDay);
            }

            //Set Maximum Date
            let _MaxDate = new Date();
            _MaxDate.setDate(new Date().getDate() + 1);
            if (Params_Value.hasOwnProperty('MaximumYear') && Params_Value.MaximumYear > 0 && 
                Params_Value.hasOwnProperty('MaximumMonth') && Params_Value.MaximumMonth > 0 && 
                Params_Value.hasOwnProperty('MaximumDay') && Params_Value.MaximumDay > 0) {
                _MaxDate = new Date(Params_Value.MaximumYear, Params_Value.MaximumMonth - 1, Params_Value.MaximumDay);
            }

            Global.State[this.props.ModelID] = this.CreateState(Params_Value.SelectedYear, Params_Value.SelectedMonth);
            Global.State[this.props.ModelID].PageTitle = Params_Value.hasOwnProperty('PageTitle') ? Params_Value.PageTitle : null,
            Global.State[this.props.ModelID].SelectedYear = Params_Value.SelectedYear;
            Global.State[this.props.ModelID].SelectedMonth = Params_Value.SelectedMonth;
            Global.State[this.props.ModelID].SelectedDay = Params_Value.SelectedDay;
            Global.State[this.props.ModelID].MinimumDate = _MinDate;
            Global.State[this.props.ModelID].MaximumDate = _MaxDate;
            Global.State[this.props.ModelID].Callback = Params_Value.hasOwnProperty('Callback') ? Params_Value.Callback : null;
            Global.State[this.props.ModelID].ViewOffset = new Animated.Value(Global.ScreenY);
            Global.State[this.props.ModelID].ViewOpacity = new Animated.Value(0);
            
            //ActiveHandler must be called after forceUpdate
            this.forceUpdate();
            global.root.ActiveHandler();
            
            let _AlreadyOpen = Global.State[this.props.ModelID].ViewOpacity._value > 0;
            if (Global.State[this.props.ModelID] !== null && Global.State[this.props.ModelID].ViewOffset !== null && !_AlreadyOpen) {
                Animated.timing(Global.State[this.props.ModelID].ViewOpacity, {duration: 100, toValue: .4, useNativeDriver: false}).start(() => {
                    Animated.timing(Global.State[this.props.ModelID].ViewOffset, {duration: 250, toValue: 0, useNativeDriver: false}).start();
                });
            }

        } catch (ex) {
            Global.State[this.props.ModelID] = null;
            global.Log({Message: 'CalendarModal.Show>>' + ex.message, Notify: true});
        }
    };
    CreateState(currentyear, currentmonth) {
        let _max = new Date(currentyear, currentmonth, 0).getDate();
        let _day = new Date(currentyear, currentmonth - 1, 1).getDay();
        if (_day == 0) {
            return ({
                PageTitle: this.IsActive() && Global.State[this.props.ModelID].PageTitle !== null ? Global.State[this.props.ModelID].PageTitle : null,
                CurrentYear: currentyear,
                CurrentMonth: currentmonth,
                SelectedYear: this.IsActive() && Global.State[this.props.ModelID].SelectedYear !== null ? Global.State[this.props.ModelID].SelectedYear : null,
                SelectedMonth: this.IsActive() && Global.State[this.props.ModelID].SelectedMonth !== null ? Global.State[this.props.ModelID].SelectedMonth : null,
                SelectedDay: this.IsActive() && Global.State[this.props.ModelID].SelectedDay !== null ? Global.State[this.props.ModelID].SelectedDay: null,
                R1C1: null,
                R1C2: null,
                R1C3: null,
                R1C4: null,
                R1C5: null,
                R1C6: null,
                R1C7: 1,
                R2C1: 2,
                R2C2: 3,
                R2C3: 4,
                R2C4: 5,
                R2C5: 6,
                R2C6: 7,
                R2C7: 8,
                R3C1: 9,
                R3C2: 10,
                R3C3: 11,
                R3C4: 12,
                R3C5: 13,
                R3C6: 14,
                R3C7: 15,
                R4C1: 16,
                R4C2: 17,
                R4C3: 18,
                R4C4: 19,
                R4C5: 20,
                R4C6: 21,
                R4C7: 22,
                R5C1: 23,
                R5C2: 24,
                R5C3: 25,
                R5C4: 26,
                R5C5: 27,
                R5C6: (_max >= 28) ? 28 : null,
                R5C7: (_max >= 29) ? 29 : null,
                R6C1: (_max >= 30) ? 30 : null,
                R6C2: (_max >= 31) ? 31 : null,
                R6C3: null,
                R6C4: null,
                R6C5: null,
                R6C6: null,
                R6C7: null,
                MinimumDate: this.IsActive() && Global.State[this.props.ModelID].MinimumDate !== null ? Global.State[this.props.ModelID].MinimumDate : null,
                MaximumDate: this.IsActive() && Global.State[this.props.ModelID].MaximumDate !== null ? Global.State[this.props.ModelID].MaximumDate : null,
                Callback: this.IsActive() && Global.State[this.props.ModelID].Callback !== null ? Global.State[this.props.ModelID].Callback : null, 
                ActiveWindow: false,
                ViewOffset: this.IsActive() && Global.State[this.props.ModelID].ViewOffset !== null ? Global.State[this.props.ModelID].ViewOffset : null,
                ViewOpacity: this.IsActive() && Global.State[this.props.ModelID].ViewOpacity !== null ? Global.State[this.props.ModelID].ViewOpacity : null
            });            
        } else if (_day == 1) {
            return ({
                PageTitle: this.IsActive() && Global.State[this.props.ModelID].PageTitle !== null ? Global.State[this.props.ModelID].PageTitle : null,
                CurrentYear: currentyear, 
                CurrentMonth: currentmonth,
                SelectedYear: this.IsActive() && Global.State[this.props.ModelID].SelectedYear !== null ? Global.State[this.props.ModelID].SelectedYear : null,
                SelectedMonth: this.IsActive() && Global.State[this.props.ModelID].SelectedMonth !== null ? Global.State[this.props.ModelID].SelectedMonth : null,
                SelectedDay: this.IsActive() && Global.State[this.props.ModelID].SelectedDay !== null ? Global.State[this.props.ModelID].SelectedDay: null,               
                R1C1: 1,
                R1C2: 2,
                R1C3: 3,
                R1C4: 4,
                R1C5: 5,
                R1C6: 6,
                R1C7: 7,
                R2C1: 8,
                R2C2: 9,
                R2C3: 10,
                R2C4: 11,
                R2C5: 12,
                R2C6: 13,
                R2C7: 14,
                R3C1: 15,
                R3C2: 16,
                R3C3: 17,
                R3C4: 18,
                R3C5: 19,
                R3C6: 20,
                R3C7: 21,
                R4C1: 22,
                R4C2: 23,
                R4C3: 24,
                R4C4: 25,
                R4C5: 26,
                R4C6: 27,
                R4C7: (_max >= 28) ? 28 : null,
                R5C1: (_max >= 29) ? 29 : null,
                R5C2: (_max >= 30) ? 30 : null,
                R5C3: (_max >= 31) ? 31 : null,
                R5C4: null,
                R5C5: null,
                R5C6: null,
                R5C7: null,
                R6C1: null,
                R6C2: null,
                R6C3: null,
                R6C4: null,
                R6C5: null,
                R6C6: null,
                R6C7: null,
                MinimumDate: this.IsActive() && Global.State[this.props.ModelID].MinimumDate !== null ? Global.State[this.props.ModelID].MinimumDate : null,
                MaximumDate: this.IsActive() && Global.State[this.props.ModelID].MaximumDate !== null ? Global.State[this.props.ModelID].MaximumDate : null,
                Callback: this.IsActive() && Global.State[this.props.ModelID].Callback !== null ? Global.State[this.props.ModelID].Callback : null, 
                ActiveWindow: false,
                ViewOffset: this.IsActive() && Global.State[this.props.ModelID].ViewOffset !== null ? Global.State[this.props.ModelID].ViewOffset : null,
                ViewOpacity: this.IsActive() && Global.State[this.props.ModelID].ViewOpacity !== null ? Global.State[this.props.ModelID].ViewOpacity : null
            })
        } else if (_day == 2) {
            return ({
                PageTitle: this.IsActive() && Global.State[this.props.ModelID].PageTitle !== null ? Global.State[this.props.ModelID].PageTitle : null,
                CurrentYear: currentyear, 
                CurrentMonth: currentmonth,
                SelectedYear: this.IsActive() && Global.State[this.props.ModelID].SelectedYear !== null ? Global.State[this.props.ModelID].SelectedYear : null,
                SelectedMonth: this.IsActive() && Global.State[this.props.ModelID].SelectedMonth !== null ? Global.State[this.props.ModelID].SelectedMonth : null,
                SelectedDay: this.IsActive() && Global.State[this.props.ModelID].SelectedDay !== null ? Global.State[this.props.ModelID].SelectedDay: null,               
                R1C1: null,
                R1C2: 1,
                R1C3: 2,
                R1C4: 3,
                R1C5: 4,
                R1C6: 5,
                R1C7: 6,
                R2C1: 7,
                R2C2: 8,
                R2C3: 9,
                R2C4: 10,
                R2C5: 11,
                R2C6: 12,
                R2C7: 13,
                R3C1: 14,
                R3C2: 15,
                R3C3: 16,
                R3C4: 17,
                R3C5: 18,
                R3C6: 19,
                R3C7: 20,
                R4C1: 21,
                R4C2: 22,
                R4C3: 23,
                R4C4: 24,
                R4C5: 25,
                R4C6: 26,
                R4C7: 27,
                R5C1: (_max >= 28) ? 28 : null,
                R5C2: (_max >= 29) ? 29 : null,
                R5C3: (_max >= 30) ? 30 : null,
                R5C4: (_max >= 31) ? 31 : null,
                R5C5: null,
                R5C6: null,
                R5C7: null,
                R6C1: null,
                R6C2: null,
                R6C3: null,
                R6C4: null,
                R6C5: null,
                R6C6: null,
                R6C7: null,
                MinimumDate: this.IsActive() && Global.State[this.props.ModelID].MinimumDate !== null ? Global.State[this.props.ModelID].MinimumDate : null,
                MaximumDate: this.IsActive() && Global.State[this.props.ModelID].MaximumDate !== null ? Global.State[this.props.ModelID].MaximumDate : null,
                Callback: this.IsActive() && Global.State[this.props.ModelID].Callback !== null ? Global.State[this.props.ModelID].Callback : null, 
                ActiveWindow: false,
                ViewOffset: this.IsActive() && Global.State[this.props.ModelID].ViewOffset !== null ? Global.State[this.props.ModelID].ViewOffset : null,
                ViewOpacity: this.IsActive() && Global.State[this.props.ModelID].ViewOpacity !== null ? Global.State[this.props.ModelID].ViewOpacity : null
            });
        } else if (_day == 3) {
            return ({
                PageTitle: this.IsActive() && Global.State[this.props.ModelID].PageTitle !== null ? Global.State[this.props.ModelID].PageTitle : null,
                CurrentYear: currentyear, 
                CurrentMonth: currentmonth,
                SelectedYear: this.IsActive() && Global.State[this.props.ModelID].SelectedYear !== null ? Global.State[this.props.ModelID].SelectedYear : null,
                SelectedMonth: this.IsActive() && Global.State[this.props.ModelID].SelectedMonth !== null ? Global.State[this.props.ModelID].SelectedMonth : null,
                SelectedDay: this.IsActive() && Global.State[this.props.ModelID].SelectedDay !== null ? Global.State[this.props.ModelID].SelectedDay: null,
                R1C1: null,
                R1C2: null,
                R1C3: 1,
                R1C4: 2,
                R1C5: 3,
                R1C6: 4,
                R1C7: 5,
                R2C1: 6,
                R2C2: 7,
                R2C3: 8,
                R2C4: 9,
                R2C5: 10,
                R2C6: 11,
                R2C7: 12,
                R3C1: 13,
                R3C2: 14,
                R3C3: 15,
                R3C4: 16,
                R3C5: 17,
                R3C6: 18,
                R3C7: 19,
                R4C1: 20,
                R4C2: 21,
                R4C3: 22,
                R4C4: 23,
                R4C5: 24,
                R4C6: 25,
                R4C7: 26,
                R5C1: 27,
                R5C2: (_max >= 28) ? 28 : null,
                R5C3: (_max >= 29) ? 29 : null,
                R5C4: (_max >= 30) ? 30 : null,
                R5C5: (_max >= 31) ? 31 : null,
                R5C6: null,
                R5C7: null,
                R6C1: null,
                R6C2: null,
                R6C3: null,
                R6C4: null,
                R6C5: null,
                R6C6: null,
                R6C7: null,
                MinimumDate: this.IsActive() && Global.State[this.props.ModelID].MinimumDate !== null ? Global.State[this.props.ModelID].MinimumDate : null,
                MaximumDate: this.IsActive() && Global.State[this.props.ModelID].MaximumDate !== null ? Global.State[this.props.ModelID].MaximumDate : null,
                Callback: this.IsActive() && Global.State[this.props.ModelID].Callback !== null ? Global.State[this.props.ModelID].Callback : null, 
                ActiveWindow: false,
                ViewOffset: this.IsActive() && Global.State[this.props.ModelID].ViewOffset !== null ? Global.State[this.props.ModelID].ViewOffset : null,
                ViewOpacity: this.IsActive() && Global.State[this.props.ModelID].ViewOpacity !== null ? Global.State[this.props.ModelID].ViewOpacity : null
            });
        } else if (_day == 4) {
            return ({
                PageTitle: this.IsActive() && Global.State[this.props.ModelID].PageTitle !== null ? Global.State[this.props.ModelID].PageTitle : null,
                CurrentYear: currentyear, 
                CurrentMonth: currentmonth,
                SelectedYear: this.IsActive() && Global.State[this.props.ModelID].SelectedYear !== null ? Global.State[this.props.ModelID].SelectedYear : null,
                SelectedMonth: this.IsActive() && Global.State[this.props.ModelID].SelectedMonth !== null ? Global.State[this.props.ModelID].SelectedMonth : null,
                SelectedDay: this.IsActive() && Global.State[this.props.ModelID].SelectedDay !== null ? Global.State[this.props.ModelID].SelectedDay: null,
                R1C1: null,
                R1C2: null,
                R1C3: null,
                R1C4: 1,
                R1C5: 2,
                R1C6: 3,
                R1C7: 4,
                R2C1: 5,
                R2C2: 6,
                R2C3: 7,
                R2C4: 8,
                R2C5: 9,
                R2C6: 10,
                R2C7: 11,
                R3C1: 12,
                R3C2: 13,
                R3C3: 14,
                R3C4: 15,
                R3C5: 16,
                R3C6: 17,
                R3C7: 18,
                R4C1: 19,
                R4C2: 20,
                R4C3: 21,
                R4C4: 22,
                R4C5: 23,
                R4C6: 24,
                R4C7: 25,
                R5C1: 26,
                R5C2: 27,
                R5C3: (_max >= 28) ? 28 : null,
                R5C4: (_max >= 29) ? 29 : null,
                R5C5: (_max >= 30) ? 30 : null,
                R5C6: (_max >= 31) ? 31 : null,
                R5C7: null,
                R6C1: null,
                R6C2: null,
                R6C3: null,
                R6C4: null,
                R6C5: null,
                R6C6: null,
                R6C7: null,
                MinimumDate: this.IsActive() && Global.State[this.props.ModelID].MinimumDate !== null ? Global.State[this.props.ModelID].MinimumDate : null,
                MaximumDate: this.IsActive() && Global.State[this.props.ModelID].MaximumDate !== null ? Global.State[this.props.ModelID].MaximumDate : null,
                Callback: this.IsActive() && Global.State[this.props.ModelID].Callback !== null ? Global.State[this.props.ModelID].Callback : null, 
                ActiveWindow: false,
                ViewOffset: this.IsActive() && Global.State[this.props.ModelID].ViewOffset !== null ? Global.State[this.props.ModelID].ViewOffset : null,
                ViewOpacity: this.IsActive() && Global.State[this.props.ModelID].ViewOpacity !== null ? Global.State[this.props.ModelID].ViewOpacity : null
            });
        } else if (_day == 5) {
            return ({
                PageTitle: this.IsActive() && Global.State[this.props.ModelID].PageTitle !== null ? Global.State[this.props.ModelID].PageTitle : null,
                CurrentYear: currentyear, 
                CurrentMonth: currentmonth,
                SelectedYear: this.IsActive() && Global.State[this.props.ModelID].SelectedYear !== null ? Global.State[this.props.ModelID].SelectedYear : null,
                SelectedMonth: this.IsActive() && Global.State[this.props.ModelID].SelectedMonth !== null ? Global.State[this.props.ModelID].SelectedMonth : null,
                SelectedDay: this.IsActive() && Global.State[this.props.ModelID].SelectedDay !== null ? Global.State[this.props.ModelID].SelectedDay: null,
                R1C1: null,
                R1C2: null,
                R1C3: null,
                R1C4: null,
                R1C5: 1,
                R1C6: 2,
                R1C7: 3,
                R2C1: 4,
                R2C2: 5,
                R2C3: 6,
                R2C4: 7,
                R2C5: 8,
                R2C6: 9,
                R2C7: 10,
                R3C1: 11,
                R3C2: 12,
                R3C3: 13,
                R3C4: 14,
                R3C5: 15,
                R3C6: 16,
                R3C7: 17,
                R4C1: 18,
                R4C2: 19,
                R4C3: 20,
                R4C4: 21,
                R4C5: 22,
                R4C6: 23,
                R4C7: 24,
                R5C1: 25,
                R5C2: 26,
                R5C3: 27,
                R5C4: (_max >= 28) ? 28 : null,
                R5C5: (_max >= 29) ? 29 : null,
                R5C6: (_max >= 30) ? 30 : null,
                R5C7: (_max >= 31) ? 31 : null,
                R6C1: null,
                R6C2: null,
                R6C3: null,
                R6C4: null,
                R6C5: null,
                R6C6: null,
                R6C7: null,
                MinimumDate: this.IsActive() && Global.State[this.props.ModelID].MinimumDate !== null ? Global.State[this.props.ModelID].MinimumDate : null,
                MaximumDate: this.IsActive() && Global.State[this.props.ModelID].MaximumDate !== null ? Global.State[this.props.ModelID].MaximumDate : null,
                Callback: this.IsActive() && Global.State[this.props.ModelID].Callback !== null ? Global.State[this.props.ModelID].Callback : null, 
                ActiveWindow: false,
                ViewOffset: this.IsActive() && Global.State[this.props.ModelID].ViewOffset !== null ? Global.State[this.props.ModelID].ViewOffset : null,
                ViewOpacity: this.IsActive() && Global.State[this.props.ModelID].ViewOpacity !== null ? Global.State[this.props.ModelID].ViewOpacity : null
            });
        } else if (_day == 6) {
            return ({
                PageTitle: this.IsActive() && Global.State[this.props.ModelID].PageTitle !== null ? Global.State[this.props.ModelID].PageTitle : null,
                CurrentYear: currentyear, 
                CurrentMonth: currentmonth,
                SelectedYear: this.IsActive() && Global.State[this.props.ModelID].SelectedYear !== null ? Global.State[this.props.ModelID].SelectedYear : null,
                SelectedMonth: this.IsActive() && Global.State[this.props.ModelID].SelectedMonth !== null ? Global.State[this.props.ModelID].SelectedMonth : null,
                SelectedDay: this.IsActive() && Global.State[this.props.ModelID].SelectedDay !== null ? Global.State[this.props.ModelID].SelectedDay: null,
                R1C1: null,
                R1C2: null,
                R1C3: null,
                R1C4: null,
                R1C5: null,
                R1C6: 1,
                R1C7: 2,
                R2C1: 3,
                R2C2: 4,
                R2C3: 5,
                R2C4: 6,
                R2C5: 7,
                R2C6: 8,
                R2C7: 9,
                R3C1: 10,
                R3C2: 11,
                R3C3: 12,
                R3C4: 13,
                R3C5: 14,
                R3C6: 15,
                R3C7: 16,
                R4C1: 17,
                R4C2: 18,
                R4C3: 19,
                R4C4: 20,
                R4C5: 21,
                R4C6: 22,
                R4C7: 23,
                R5C1: 24,
                R5C2: 25,
                R5C3: 26,
                R5C4: 27,
                R5C5: (_max >= 28) ? 28 : null,
                R5C6: (_max >= 29) ? 29 : null,
                R5C7: (_max >= 30) ? 30 : null,
                R6C1: (_max >= 31) ? 31 : null,
                R6C2: null,
                R6C3: null,
                R6C4: null,
                R6C5: null,
                R6C6: null,
                R6C7: null,
                MinimumDate: this.IsActive() && Global.State[this.props.ModelID].MinimumDate !== null ? Global.State[this.props.ModelID].MinimumDate : null,
                MaximumDate: this.IsActive() && Global.State[this.props.ModelID].MaximumDate !== null ? Global.State[this.props.ModelID].MaximumDate : null,
                Callback: this.IsActive() && Global.State[this.props.ModelID].Callback !== null ? Global.State[this.props.ModelID].Callback : null, 
                ActiveWindow: false,
                ViewOffset: this.IsActive() && Global.State[this.props.ModelID].ViewOffset !== null ? Global.State[this.props.ModelID].ViewOffset : null,
                ViewOpacity: this.IsActive() && Global.State[this.props.ModelID].ViewOpacity !== null ? Global.State[this.props.ModelID].ViewOpacity : null
            });
        }
    };
    SelectDate(day) {
        if (Global.State[this.props.ModelID] !== null) {
            Animated.timing(Global.State[this.props.ModelID].ViewOffset, { duration: 250, toValue: Global.ScreenY, useNativeDriver: false}).start(() => {
                if (Global.State[this.props.ModelID] !== null) {
                    Animated.timing(Global.State[this.props.ModelID].ViewOpacity, {duration: 100, toValue: 0, useNativeDriver: false}).start(() => {
                        if (Global.State[this.props.ModelID] !== null && Global.State[this.props.ModelID].Callback !== null) { Global.State[this.props.ModelID].Callback(Global.State[this.props.ModelID].CurrentYear, Global.State[this.props.ModelID].CurrentMonth, day); };
                        Global.State[this.props.ModelID] = null;
                        global.root.ActiveHandler();
                        this.forceUpdate(); 
                    });
                }
            });
        }
    };    
    PrevMonth() {
        if (Global.State[this.props.ModelID].CurrentMonth > 1) {
            Global.State[this.props.ModelID] = this.CreateState(Global.State[this.props.ModelID].CurrentYear, parseInt(Global.State[this.props.ModelID].CurrentMonth - 1));
            this.forceUpdate();
        } else {
            Global.State[this.props.ModelID] = this.CreateState(parseInt(Global.State[this.props.ModelID].CurrentYear - 1), 12);
            this.forceUpdate();
        };
    };
    NextMonth() {
        if (Global.State[this.props.ModelID].CurrentMonth > 11) {
            Global.State[this.props.ModelID] = this.CreateState(parseInt(Global.State[this.props.ModelID].CurrentYear + 1), 1);
            this.forceUpdate();
        } else {
            Global.State[this.props.ModelID] = this.CreateState(Global.State[this.props.ModelID].CurrentYear, parseInt(Global.State[this.props.ModelID].CurrentMonth + 1));
            this.forceUpdate();
        };
    };
    ChangeYear(year) {
        Global.State[this.props.ModelID] = this.CreateState(year, Global.State[this.props.ModelID].CurrentMonth);
        this.forceUpdate();
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
            global.Log({Message: 'CalendarModal.ActiveHandler>>' + ex.message});
        }
    };
    BackHandler() {
        this.Hide();
    };

    Hide() {
        if (Global.State[this.props.ModelID] !== null) {
            Animated.timing(Global.State[this.props.ModelID].ViewOffset, { duration: 250, toValue: Global.ScreenY, useNativeDriver: false}).start(() => {
                if (Global.State[this.props.ModelID] !== null) {
                    Animated.timing(Global.State[this.props.ModelID].ViewOpacity, {duration: 100, toValue: 0, useNativeDriver: false}).start(() => {
                        Global.State[this.props.ModelID] = null;
                        global.root.ActiveHandler();
                        this.forceUpdate();
                    });
                }
            });
        }
    };
    render() {
        if (this.IsActive()) {
            return (
                <View style={{position: 'absolute', top: 0, bottom:0, right: 0, left: 0}}>
                    <Animated.View style={{position: 'absolute', top: 0, bottom:0, right: 0, left: 0, opacity: Global.State[this.props.ModelID].ViewOpacity}}>
                        <Pressable style={{flex: 1}} onPress={() => {
                            if (Global.State[this.props.ModelID] !== null) {
                                this.Hide();
                            }
                        }}>
                            <View style={{flex: 1, backgroundColor: '#262626'}}></View>
                        </Pressable>
                    </Animated.View>
                    <Animated.View style={{position: 'absolute', flex: 1, bottom: 0, right: 0, left: 0, transform: [{translateY: Global.State[this.props.ModelID].ViewOffset}]}}>
                        <View style={{flex: 1}}>
                            <View style={{position: 'absolute', left: 0, top: 0, right: 0, bottom: 0, backgroundColor: Global.Theme.Body.BackgroundColor, opacity: .95}}></View>                                
                            <View>
                                {this.renderPageTitle()}
                                <View style={{height:50, alignItems: 'center', flexDirection:'row', marginTop: 5, marginLeft: 5}}>
                                    <Pressable style={({pressed}) => [{width: 40, height: 40, backgroundColor: Global.Theme.Element.BackgroundColor, borderRadius: 4, alignItems: 'center', justifyContent: 'center', marginRight: 6, opacity: pressed ? .7 : 1}]} onPress={() => this.ChangeYear(parseInt(Global.State[this.props.ModelID].CurrentYear - 1))}>
                                        <Image source={IMG_Prev_Double_ffffff} style={Styles.form_header_button_image} />
                                    </Pressable>
                                    <Pressable style={({pressed}) => [{width: 40, height: 40, backgroundColor: Global.Theme.Element.BackgroundColor, borderRadius: 4, alignItems: 'center', justifyContent: 'center', marginRight: 6, opacity: pressed ? .7 : 1}]} onPress={() => this.PrevMonth()}>
                                        <Image source={IMG_Prev_ffffff} style={Styles.form_header_button_image} />
                                    </Pressable>
                                    <View style={{flex: 1, alignItems: 'center', justifyContent: 'center'}}>
                                        <Text style={[Styles.v3_form_header_text, {color: '#a9a9a9'}]}>{Global.FormatShortMonth(Global.State[this.props.ModelID].CurrentMonth) + ' ' + Global.State[this.props.ModelID].CurrentYear}</Text>
                                    </View>
                                    <Pressable style={({pressed}) => [{width: 40, height: 40, backgroundColor: Global.Theme.Element.BackgroundColor, borderRadius: 4, alignItems: 'center', justifyContent: 'center', marginRight: 6, opacity: pressed ? .7 : 1}]} onPress={() => this.NextMonth()}>
                                        <Image source={IMG_Next_ffffff} style={Styles.form_header_button_image} />
                                    </Pressable>
                                    <Pressable style={({pressed}) => [{width: 40, height: 40, backgroundColor: Global.Theme.Element.BackgroundColor, borderRadius: 4, alignItems: 'center', justifyContent: 'center', marginRight: 6, opacity: pressed ? .7 : 1}]} onPress={() => this.ChangeYear(parseInt(Global.State[this.props.ModelID].CurrentYear + 1))}>
                                        <Image source={IMG_Next_Double_ffffff} style={Styles.form_header_button_image} />
                                    </Pressable>  
                                </View>
                            </View>

                                {/* Row Header */}
                                <View>
                                    <View style={{flex:1, flexDirection:'row', paddingTop: 5, paddingLeft: 5, paddingRight: 5}}>
                                        <Text style={{flex: 1, textAlign: 'center', fontWeight: 'bold', color: '#a9a9a9', fontSize: 12}}>MON</Text>
                                        <Text style={{flex: 1, textAlign: 'center', fontWeight: 'bold', color: '#a9a9a9', fontSize: 12}}>TUE</Text>
                                        <Text style={{flex: 1, textAlign: 'center', fontWeight: 'bold', color: '#a9a9a9', fontSize: 12}}>WED</Text>
                                        <Text style={{flex: 1, textAlign: 'center', fontWeight: 'bold', color: '#a9a9a9', fontSize: 12}}>THU</Text>
                                        <Text style={{flex: 1, textAlign: 'center', fontWeight: 'bold', color: '#a9a9a9', fontSize: 12}}>FRI</Text>
                                        <Text style={{flex: 1, textAlign: 'center', fontWeight: 'bold', color: '#a9a9a9', fontSize: 12}}>SAT</Text>
                                        <Text style={{flex: 1, textAlign: 'center', fontWeight: 'bold', color: '#a9a9a9', fontSize: 12}}>SUN</Text>
                                    </View>
                                </View>

                                {/* Row 1 */}
                                <View style={{flex:1, flexDirection:'row', paddingTop:5, paddingLeft:5, paddingRight:5}}>
                                    {this.renderDayButton(Global.State[this.props.ModelID].R1C1)}
                                    {this.renderDayButton(Global.State[this.props.ModelID].R1C2)}
                                    {this.renderDayButton(Global.State[this.props.ModelID].R1C3)}
                                    {this.renderDayButton(Global.State[this.props.ModelID].R1C4)}
                                    {this.renderDayButton(Global.State[this.props.ModelID].R1C5)}
                                    {this.renderDayButton(Global.State[this.props.ModelID].R1C6)}
                                    {this.renderDayButton(Global.State[this.props.ModelID].R1C7)}
                                </View>

                                {/* Row 2 */}
                                <View style={{flex:1, flexDirection:'row', paddingLeft:5, paddingRight:5}}>
                                    {this.renderDayButton(Global.State[this.props.ModelID].R2C1)}
                                    {this.renderDayButton(Global.State[this.props.ModelID].R2C2)}
                                    {this.renderDayButton(Global.State[this.props.ModelID].R2C3)}
                                    {this.renderDayButton(Global.State[this.props.ModelID].R2C4)}
                                    {this.renderDayButton(Global.State[this.props.ModelID].R2C5)}
                                    {this.renderDayButton(Global.State[this.props.ModelID].R2C6)}
                                    {this.renderDayButton(Global.State[this.props.ModelID].R2C7)}
                                </View>
                                    
                                {/* Row 3 */}
                                <View style={{flex:1, flexDirection:'row', paddingLeft:5, paddingRight:5}}>
                                    {this.renderDayButton(Global.State[this.props.ModelID].R3C1)}
                                    {this.renderDayButton(Global.State[this.props.ModelID].R3C2)}
                                    {this.renderDayButton(Global.State[this.props.ModelID].R3C3)}
                                    {this.renderDayButton(Global.State[this.props.ModelID].R3C4)}
                                    {this.renderDayButton(Global.State[this.props.ModelID].R3C5)}
                                    {this.renderDayButton(Global.State[this.props.ModelID].R3C6)}
                                    {this.renderDayButton(Global.State[this.props.ModelID].R3C7)}
                                </View>

                                {/* Row 4 */}
                                <View style={{flex:1, flexDirection:'row', paddingLeft:5, paddingRight:5}}>
                                    {this.renderDayButton(Global.State[this.props.ModelID].R4C1)}
                                    {this.renderDayButton(Global.State[this.props.ModelID].R4C2)}
                                    {this.renderDayButton(Global.State[this.props.ModelID].R4C3)}
                                    {this.renderDayButton(Global.State[this.props.ModelID].R4C4)}
                                    {this.renderDayButton(Global.State[this.props.ModelID].R4C5)}
                                    {this.renderDayButton(Global.State[this.props.ModelID].R4C6)}
                                    {this.renderDayButton(Global.State[this.props.ModelID].R4C7)}
                                </View>

                                {/* Row 5 */}
                                <View style={{flex:1, flexDirection:'row', paddingLeft:5, paddingRight:5}}>
                                    {this.renderDayButton(Global.State[this.props.ModelID].R5C1)}
                                    {this.renderDayButton(Global.State[this.props.ModelID].R5C2)}
                                    {this.renderDayButton(Global.State[this.props.ModelID].R5C3)}
                                    {this.renderDayButton(Global.State[this.props.ModelID].R5C4)}
                                    {this.renderDayButton(Global.State[this.props.ModelID].R5C5)}
                                    {this.renderDayButton(Global.State[this.props.ModelID].R5C6)}
                                    {this.renderDayButton(Global.State[this.props.ModelID].R5C7)}
                                </View>

                                {/* Row 6 */}
                                <View style={{flex:1, flexDirection:'row', paddingBottom:5, paddingLeft:5, paddingRight:5}}>
                                    {this.renderDayButton(Global.State[this.props.ModelID].R6C1)}
                                    {this.renderDayButton(Global.State[this.props.ModelID].R6C2)}
                                    {this.renderDayButton(Global.State[this.props.ModelID].R6C3)}
                                    {this.renderDayButton(Global.State[this.props.ModelID].R6C4)}
                                    {this.renderDayButton(Global.State[this.props.ModelID].R6C5)}
                                    {this.renderDayButton(Global.State[this.props.ModelID].R6C6)}
                                    {this.renderDayButton(Global.State[this.props.ModelID].R6C7)}
                                </View>

                            <View style={{height: 30}}></View>
                        </View>
                    </Animated.View>
                </View>
            );
        } else {
            return (<View></View>);
        }
    };
    renderPageTitle() {
        if (Global.StringHasContent(Global.State[this.props.ModelID].PageTitle)) {
            return (
                <Text style={{left: 0, right: 0, top: 10, fontWeight: 'bold', color: '#a9a9a9', textAlign: 'center'}}>{Global.State[this.props.ModelID].PageTitle}</Text>
            )
        }
    }
    renderDayButton(Day_Value) {
        try {
            if (Global.State[this.props.ModelID].CurrentYear == Global.State[this.props.ModelID].SelectedYear && Global.State[this.props.ModelID].CurrentMonth == Global.State[this.props.ModelID].SelectedMonth && Day_Value == Global.State[this.props.ModelID].SelectedDay) {
                return (
                    <Pressable style={({pressed}) => [Styles.form_button, {flex:1, margin:2, backgroundColor: Global.Theme.Highlight.BackgroundColor, opacity: pressed ? .7 : 1}]} onPress={() => this.SelectDate(Day_Value)}>
                        <Text style={{color: Global.Theme.Highlight.ForegroundColor, fontWeight: 'bold'}}>{Day_Value}</Text>
                    </Pressable>
                );
            } else if (Day_Value !== null && Day_Value > 0 && new Date(Global.State[this.props.ModelID].CurrentYear, Global.State[this.props.ModelID].CurrentMonth - 1, Day_Value) >= Global.State[this.props.ModelID].MinimumDate && new Date(Global.State[this.props.ModelID].CurrentYear, Global.State[this.props.ModelID].CurrentMonth - 1, Day_Value) <= Global.State[this.props.ModelID].MaximumDate) {
                return (
                    <Pressable style={({pressed}) => [Styles.form_button, {flex:1, margin:2, backgroundColor: Global.Theme.Element.BackgroundColor, opacity: pressed ? .7 : 1}]} onPress={() => this.SelectDate(Day_Value)}>
                        <Text style={{color: Global.Theme.Element.ForegroundColor, fontWeight: 'bold'}}>{Day_Value}</Text>
                    </Pressable>
                );
            } else {
                return (
                    <View style={[Styles.form_button, {flex:1, margin:2, backgroundColor: 'transparent'}]}>
                        <Text style={[Styles.keyboard_button_text, {color: '#777777'}]}>{Day_Value}</Text>
                    </View>
                );
            }
        } catch (ex) {
            global.Log({Message: 'CalendarModal.renderDayButton>>' + ex.message, Notify: true});
        }
    };
};