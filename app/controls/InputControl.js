import React, { Component } from 'react';
import {
    View,
    Text,
    TextInput,
    Pressable,
    Image,
    Platform,
    Keyboard,
} from 'react-native';
module.exports = class InputControl extends Component {
    constructor(props) {
        super(props);
        this.SearchID = null;
        this.SearchTimeout = null;
        this.SearchText = null;
        this.SearchSuggestions = [];
        this.Focused = false;
        this.state = {
            maxHeight: 50
        };
    };
    KeyboardType() {
        if (this.props.KeyboardType === 'number-pad') {
            return this.props.KeyboardType;
        } else {
            return 'default';
        }
    };
    AutoCapitalize() {
        if (this.props.Casing === 'upper') {
            return 'characters';
        } else if (this.props.Casing === 'lower') {
            return 'none';
        } else {
            return 'sentences';
        }
    };
    SearchSource(SearchText_Value) {
        try {
            clearTimeout(this.SearchTimeout);
            this.SearchTimeout = setTimeout(() => {
                let _SearchID = Math.random();
                this.SearchID = _SearchID;
                if (Global.StringHasContent(SearchText_Value)) {
                    if (this.props.AutocompleteSource !== undefined && this.props.AutocompleteSource !== null) {
                        if (this.props.AutocompleteSource === 'ACCOUNTS') {
                            AccountHelper.GetList({
                                SearchText: SearchText_Value,
                                SearchLimit: 3
                            }).then((AccountList_Value) => { 
                                if (this.SearchID === _SearchID) {
                                    let _MatchList = [];
                                    for (let _AccountIndex = 0; _AccountIndex < AccountList_Value.length; _AccountIndex++) {
                                        if (_MatchList.length < 3) {
                                            _MatchList.push({
                                                DisplayText: AccountList_Value[_AccountIndex].AccountName,
                                                Text: AccountList_Value[_AccountIndex].AccountName,
                                                Value: AccountList_Value[_AccountIndex]
                                            });
                                        } else {
                                            break;
                                        }
                                    }
                                    this.SearchSuggestions = _MatchList;
                                    this.forceUpdate();
                                }
                            }).catch((ex) => {
                                global.Log({Message: 'InputControl.SearchSource>>' + ex.message, Notify: true});
                            });
                        } else if (this.props.AutocompleteSource === 'PEOPLE') {
                            PersonHelper.GetList({
                                SearchText: SearchText_Value,
                                SearchLimit: 3
                            }).then((PersonList_Value) => {
                                if (this.SearchID === _SearchID) {
                                    let _MatchList = [];
                                    for (let _PersonIndex = 0; _PersonIndex < PersonList_Value.length; _PersonIndex++) {
                                        if (_MatchList.length < 3) {
                                            _MatchList.push({
                                                DisplayText: PersonList_Value[_PersonIndex].PersonName,
                                                Text: PersonList_Value[_PersonIndex].PersonName,
                                                Value: PersonList_Value[_PersonIndex]
                                            });
                                        } else {
                                            break;
                                        }
                                    }
                                    this.SearchSuggestions = _MatchList;
                                    this.forceUpdate();
                                }
                            }).catch((ex) => {
                                global.Log({Message: 'InputControl.SearchSource>>' + ex.message, Notify: true});
                            });                            
                        } else if (this.props.AutocompleteSource === 'PRODUCTS') {
                            ProductHelper.GetList({
                                SearchText: SearchText_Value,
                                SearchLimit: 3
                            }).then((ProductList_Value) => {
                                if (this.SearchID === _SearchID) {
                                    let _MatchList = [];
                                    for (let _ProductIndex = 0; _ProductIndex < ProductList_Value.length; _ProductIndex++) {
                                        if (_MatchList.length < 3) {
                                            _MatchList.push({
                                                DisplayText: ProductList_Value[_ProductIndex].ProductName,
                                                Text: ProductList_Value[_ProductIndex].ProductName,
                                                Value: ProductList_Value[_ProductIndex],
                                            });
                                        } else {
                                            break;
                                        }
                                    }
                                    this.SearchSuggestions = _MatchList;
                                    this.forceUpdate();
                                }
                            }).catch((ex) => {
                                global.Log({Message: 'InputControl.SearchSource>>' + ex.message, Notify: true});
                            });
                        } else if (this.props.AutocompleteSource === 'TRANSACTIONS') {
                            TransactionHelper.GetList({
                                SearchText: SearchText_Value,
                                SearchLimit: 3
                            }).then((TransactionList_Value) => {
                                if (this.SearchID === _SearchID) {
                                    let _MatchList = [];
                                    for (let _TransactionIndex = 0; _TransactionIndex < TransactionList_Value.length; _TransactionIndex++) {
                                        if (_MatchList.length < 3) {
                                            _MatchList.push({
                                                DisplayText: TransactionList_Value[_TransactionIndex].TransactionNumber,
                                                Text: TransactionList_Value[_TransactionIndex].TransactionNumber,
                                                Value: TransactionList_Value[_TransactionIndex],
                                            });
                                        } else {
                                            break;
                                        }
                                    }
                                    this.SearchSuggestions = _MatchList;
                                    this.forceUpdate();
                                }
                            }).catch((ex) => {
                                global.Log({Message: 'InputControl.SearchSource>>' + ex.message, Notify: true});
                            });
                        }
                    }
                } else {
                    if (this.SearchID === _SearchID) {
                        this.SearchSuggestions = [];
                        this.forceUpdate();
                    }
                }
            }, 400);
        } catch (ex) {
            global.Log({Message: 'InputControl.SearchSource>>' + ex.message, Notify: true});
        }
    };
    render() {
        try {
            if (this.props.Visible === false) {
                return null;
            } else {

                //Determine Variables
                let _MarginTop = this.props.MarginTop !== undefined ? this.props.MarginTop : 0;
                let _MarginRight = this.props.MarginRight !== undefined ? this.props.MarginRight : 0;
                let _MarginBottom = this.props.MarginBottom !== undefined ? this.props.MarginBottom : 0;
                let _MarginLeft = this.props.MarginLeft !== undefined ? this.props.MarginLeft : 0;
                let _ElementHeight = this.props.ElementHeight !== undefined ? this.props.ElementHeight : 50;

                //Label
                let _Label = null;
                if (this.props.Name !== undefined) {
                    _Label = (
                        <Text style={{position: 'absolute', color: '#a9a9a9', left: 8, top: 4, fontSize: 12}}>{this.props.Name}</Text>
                    )
                }

                let _Prefix = null;
                if (this.props.Prefix !== undefined) {
                    _Prefix = (
                        <View style={{height: _ElementHeight, justifyContent: 'center', paddingLeft: 6, paddingRight: 6, borderTopLeftRadius: 4, borderBottomLeftRadius: 4}}>
                            <Text style={{paddingTop: 10, paddingBottom: 0, fontWeight: 'bold', color: '#a9a9a9'}}>{this.props.Prefix}</Text>
                        </View>
                    );
                }

                let _Postfix = null;
                if (this.props.Postfix !== undefined) {
                    _Postfix = (
                        <View style={{height: _ElementHeight, backgroundColor: '#f8f8f8', paddingLeft: 6, paddingRight: 6, borderTopRightRadius: 4, borderBottomRightRadius: 4}}>
                            <Text style={{paddingTop: 10, paddingBottom: 0, fontWeight: 'bold', color: '#a9a9a9'}}>{this.props.Postfix}</Text>
                        </View>
                    );
                }

                //Create Container Style
                let _ContainerStyle = {
                    minHeight: _ElementHeight, 
                    alignItems: 'center', 
                    flexDirection:'row',
                    marginTop: _MarginTop,
                    marginRight: _MarginRight,
                    marginBottom: _MarginBottom,
                    marginLeft: _MarginLeft,
                }

                //Create Element Style
                let _ElementStyle = {
                    flex: 1,
                    minHeight: _ElementHeight
                }

                //Element Width
                if (this.props.ElementWidth !== undefined) {
                    _ContainerStyle.width = this.props.ElementWidth;
                } else {
                    _ContainerStyle.flex = 1;
                }

                //Border Radius
                if (this.props.BorderRadius !== undefined) {
                if (this.props.BorderRadius === 'top') {
                    _ElementStyle.borderTopLeftRadius = 4;
                    _ElementStyle.borderTopRightRadius = 4;
                } else if (this.props.BorderRadius === 'right') {
                    _ElementStyle.borderTopRightRadius = 4;
                    _ElementStyle.borderBottomRightRadius = 4;
                } else if (this.props.BorderRadius === 'left') {
                    _ElementStyle.borderTopLeftRadius = 4;
                    _ElementStyle.borderBottomLeftRadius = 4;
                } else if (this.props.BorderRadius === 'bottom') {
                    _ElementStyle.borderBottomLeftRadius = 4;
                    _ElementStyle.borderBottomRightRadius = 4;
                } else if (this.props.BorderRadius === 'none') {
                    _ElementStyle.borderRadius = 0;
                } else {
                    _ElementStyle.borderRadius = 4;
                }                
                } else {
                    _ElementStyle.borderRadius = 4;
                }

                //Background Color
                if (this.props.Enabled !== undefined && this.props.Enabled === false) {
                    _ElementStyle.backgroundColor = 'transparent';
                } else {
                    _ElementStyle.backgroundColor = Global.Theme.Body.ControlBackground;
                }

                //Render Control
                if (this.props.Pressed !== undefined) {
                    
                    //If pressed is available, show picker

                    //Determine if control has content
                    let _ActiveText = (this.props.Value !== null);
                    if (typeof this.props.Value === 'string') {
                    _ActiveText = Global.StringHasContent(this.props.Value);
                    }
                    
                    let _TextAlignment = 'flex-start';
                    if (this.props.TextAlignment !== undefined) {
                        if (this.props.TextAlignment === 'center') {
                            _TextAlignment = 'center';
                        } else if (this.props.TextAlignment === 'right') {
                            _TextAlignment = 'flex-end';
                        }
                    }

                    //Picker Control
                    return (
                        <View style={_ContainerStyle}>                            
                            <Pressable 
                                style={({pressed}) => [_ElementStyle, {opacity: pressed ? .7 : 1}]} 
                                onPress={() => {
                                    this.props.Pressed();
                                }}
                                disabled={this.props.Enabled === false}
                            >
                                <View style={{flex: 1, alignItems: _TextAlignment, justifyContent: 'center', paddingTop: 10, paddingLeft: 6, paddingRight: 6}}>
                                    {_Label}
                                    <Text 
                                        style={{fontWeight: 'bold', color: _ActiveText ? (global.ColorScheme === 'dark' ? '#eeeeee' : '#121212') : (this.props.Enabled === undefined || this.props.Enabled === true ? '#a9a9a9' : '#e1e1e1')}} 
                                        numberOfLines={1}>
                                            {_ActiveText ? this.props.Value : ((this.props.Enabled === undefined || this.props.Enabled === true) && this.props.Placeholder !== undefined ? this.props.Placeholder : '...')}
                                    </Text>
                                </View>
                            </Pressable>
                        </View>
                    );

                } else if (this.props.Autocomplete !== undefined) {

                    //Format text when not focused - convert null to empty otherwise the element won't re-render
                    let _Value = (this.props.Value !== undefined && this.props.Value !== null ? this.props.Value : '');

                    let _AutocompleteContainer = null;
                    let _AutocompleteRows = [];
                    if (this.SearchSuggestions.length > 0) {
                        for (let _MatchIndex = 0; _MatchIndex < this.SearchSuggestions.length; _MatchIndex++) {
                            let _Match = this.SearchSuggestions[_MatchIndex]
                            if (_Match !== null) {
                                _AutocompleteRows.push(
                                    <Pressable 
                                        key={'Match_' + _MatchIndex} 
                                        style={({pressed}) => [{flex: 1, marginRight: _MatchIndex < (this.SearchSuggestions.length - 1) ? 4 : 0, height: 40, borderRadius: 4, backgroundColor: pressed ? '#9d9cd9' : '#6e65c4'}]} 
                                        onPress={() => {
                                            clearTimeout(this.SearchTimeout);
                                            if (this.props.Autocomplete !== undefined) {
                                                this.props.Autocomplete({
                                                    Text: this.SearchText,
                                                    Match: _Match.Value,
                                                    Matched: true
                                                });
                                            }
                                            this.SearchText = _Match.DisplayText;
                                            this.SearchSuggestions = [];
                                            this.forceUpdate();
                                        }}
                                    >
                                        <View style={{flex: 1, flexDirection: 'row', height: 40, alignItems: 'center', padding: 8}}>
                                            <Text style={{flex: 1, color: '#ffffff', fontWeight: 'bold', fontSize: 10}} numberOfLines={1}>{_Match.DisplayText}</Text>
                                        </View>
                                    </Pressable>
                                )
                            }
                        }
                    }
                    if (_AutocompleteRows.length > 0) {
                        _AutocompleteContainer = (
                            <View style={{position: 'absolute', bottom: 44, left: 0, right: 0}}>                            
                                <View style={{flex: 1, flexDirection: 'row', padding: 5}}>
                                    <View style={{position: 'absolute', left: 0, top: 0, right: 0, bottom: 0, backgroundColor: (global.ColorScheme === 'dark' ? '#eeeeee' : '#121212'), opacity: .2, borderRadius: 8}}></View>
                                    {_AutocompleteRows}
                                </View>
                            </View>
                        )                    
                    }

                    //Show soft keyboard on mobile, textbox on desktop
                    return (
                        <View style={_ContainerStyle}>                            
                            <View style={[_ElementStyle, {paddingTop: 12}]}>
                                {_Label}
                                {_Prefix}
                                <TextInput 
                                    style={{      
                                        flex: 1,
                                        backgroundColor: 'transparent',
                                        color: (global.ColorScheme === 'dark' ? '#eeeeee' : '#121212'), //Do not delete otherwise dark mode shows as white text on white background
                                        fontWeight: 'bold',
                                        paddingTop: 10,
                                        paddingLeft: (_Prefix === null ? 8 : 3),
                                        paddingRight: 6,
                                        borderWidth: 0,
                                        borderColor: 'transparent',
                                        borderRadius: 4                                    
                                    }}
                                    onEndEditing={(e) => {
                                        //Do Nothing
                                    }}
                                    onKeyPress={(e) => {
                                        if ((Platform.OS === 'windows') && e.nativeEvent.key !== 'Enter') {
                                            if (Global.StringHasContent(this.SearchText)) {
                                                this.SearchSource(this.SearchText);
                                            } else {
                                                clearTimeout(this.SearchTimeout);
                                                this.SearchText = null;
                                                this.SearchSuggestions = [];
                                                this.forceUpdate();
                                                if (this.props.Autocomplete !== undefined) {
                                                    this.props.Autocomplete({
                                                        Text: null,
                                                        Match: null,
                                                        Matched: false
                                                    });
                                                }
                                            }
                                        }
                                    }}                                     
                                    onChangeText={(Text_Value) => {

                                        //Apply casing
                                        if (Global.StringHasContent(Text_Value)) { 
                                            if (Platform.OS === 'macos') {
                                                if (this.props.Casing === 'upper') { 
                                                    Text_Value = Text_Value.toUpperCase(); 
                                                } else if (this.props.Casing === 'lower') {
                                                    Text_Value = Text_Value.toLowerCase();
                                                }
                                            }
                                        } else {
                                            Text_Value = null; 
                                        }

                                        //Update search text
                                        this.SearchText = Text_Value;
                                        
                                        if (Platform.OS === 'macos' || Platform.OS === 'ios') {
                                            if (Global.StringHasContent(Text_Value)) {
                                                this.forceUpdate();
                                                this.SearchSource(Text_Value);
                                            } else {
                                                clearTimeout(this.SearchTimeout);
                                                this.SearchText = null;
                                                this.SearchSuggestions = [];
                                                this.forceUpdate();
                                                if (this.props.Autocomplete !== undefined) {
                                                    this.props.Autocomplete({
                                                        Text: null,
                                                        Match: null,
                                                        Matched: false
                                                    });
                                                }
                                            }
                                        } else {
                                            this.forceUpdate();
                                        }
                                    }}
                                    onSubmitEditing={() => {
                                        clearTimeout(this.SearchTimeout);
                                        let _MatchText = this.SearchText;
                                        let _MatchObject = (this.SearchText !== this.props.Value && this.SearchSuggestions !== null && this.SearchSuggestions.length > 0 ? this.SearchSuggestions[0].Value : null);
                                        this.SearchText = null;
                                        this.SearchSuggestions = [];                                    
                                        if (this.props.Autocomplete !== undefined) {
                                            this.props.Autocomplete({
                                                Text: _MatchText,
                                                Match: _MatchObject,
                                                Matched: false
                                            });
                                        }
                                        Keyboard.dismiss();
                                    }}
                                    onFocus={() => {
                                        this.Focused = true;
                                    }}
                                    onBlur={() => {
                                        this.Focused = false;
                                        this.SearchText = null;

                                        //Delay clearing search suggestions in case of manually selection the option
                                        if (this.SearchSuggestions.length > 0) {
                                            setTimeout(() => {
                                                this.SearchSuggestions = [];
                                                this.forceUpdate();
                                            }, 150);
                                        } else {
                                            this.SearchSuggestions = [];
                                            this.forceUpdate();
                                        }

                                    }}
                                    value={this.Focused ? this.SearchText : _Value} 
                                    keyboardType={this.KeyboardType()} 
                                    autoCapitalize={this.AutoCapitalize()} 
                                    autoCorrect={this.props.Autocorrect === false ? true : false}                             
                                    spellCheck={false}
                                    multiline={false} 
                                    scrollEnabled={false} 
                                    placeholder={(this.props.Enabled === undefined || this.props.Enabled === true) && this.props.Placeholder !== undefined ? this.props.Placeholder : '...'} 
                                    placeholderTextColor={this.props.Enabled === undefined || this.props.Enabled === true ? '#a9a9a9' : '#e1e1e1'} 
                                    focusable={(this.props.Enabled === undefined || this.props.Enabled === true) && (this.props.Editable === undefined || this.props.Editable === true)}
                                    editable={(this.props.Enabled === undefined || this.props.Enabled === true) && (this.props.Editable === undefined || this.props.Editable === true)} 
                                />
                                {_Postfix}
                            </View>
                            {_AutocompleteContainer}
                        </View>
                    )

                } else {

                    //Format text when not focused
                    let _Value = this.props.Value;
                    if (_Value !== null && !this.Focused) {
                        if (this.props.ValueType === 'Decimal1') {
                            _Value = Global.FormatNumber(_Value, 1, '.', ',')
                        } else if (this.props.ValueType === 'Decimal2') {
                            _Value = Global.FormatNumber(_Value, 2, '.', ',');
                        } else if (this.props.ValueType === 'Decimal3') {
                            _Value = Global.FormatNumber(_Value, 3, '.', ',')
                        } else if (this.props.ValueType === 'Decimal4') {
                            _Value = Global.FormatNumber(_Value, 4, '.', ',')
                        }
                    } else if (_Value === null) {
                        //We need this because the element won't re-render text if comparing null to null
                        _Value = '';                    
                    }
                    
                    let _ClearSearchText = null;
                    if (Platform.OS === 'ios' && this.Focused && ((this.SearchText !== null && this.SearchText.length > 0) || (_Value !== null && _Value.length > 0))) {
                        _ClearSearchText = (
                            <Pressable 
                                onPress={() => {
                                    if (this.props.ValueType === 'Integer') {
                                
                                        //Update parent
                                        if (this.props.Changed !== undefined) {
                                            this.SearchText = '';
                                            this.props.Changed(0);
                                        }

                                    } else if (this.props.ValueType === 'Decimal1' || this.props.ValueType === 'Decimal2' || this.props.ValueType === 'Decimal4') {
                
                                        //Update parent
                                        if (this.props.Changed !== undefined) {
                                            this.SearchText = '';
                                            this.props.Changed(0);
                                        }
                
                                    } else {

                                        //Update parent
                                        if (this.props.Changed !== undefined && this.props.Value !== null) {
                                            this.SearchText = null;
                                            this.props.Changed(null);
                                        }

                                    }
                                }} 
                                style={({pressed}) => [{height: 40, width: 40, top: 10, right: 0, alignItems: 'center', justifyContent: 'center', opacity: pressed ? .7 : 1}]}
                            >
                                <Image source={Global.Theme.Element.Icons.Close} style={{width: 20, height: 20, opacity: .5}} />
                            </Pressable>
                        );
                    }
                    
                    return (
                        <View style={_ContainerStyle}> 
                            <View style={[_ElementStyle]}>
                                {_Label}
                                <View style={{flex: 1, flexDirection: 'row'}}>
                                    {_Prefix}
                                    <TextInput 
                                        ref={(ref) => { this.TextInput = ref; }}
                                        style={{
                                            flex: 1,
                                            backgroundColor: 'transparent',
                                            color: Global.Theme.Element.ForegroundColor, //Do not delete otherwise dark mode shows as white text on white background
                                            placeholderTextColor: Global.Theme.Element.ForegroundFade,
                                            fontWeight: 'bold',
                                            paddingTop: 20,
                                            paddingBottom: 8,
                                            paddingLeft: (_Prefix === null ? 8 : 3),
                                            paddingRight: 8,
                                            borderWidth: 0,
                                            borderColor: 'transparent',
                                            borderRadius: 4,
                                            maxHeight: this.state.maxHeight,
                                        }}
                                        onChangeText={(Text_Value) => {
                                            if (this.props.ValueType === 'Integer') {
                            
                                                //Remove invalid characters
                                                let _Formatted = Text_Value.replace(/[^1234567890]/gi,'');

                                                //Update parent
                                                if (this.props.Changed !== undefined) {
                                                    if (_Formatted !== null && _Formatted.length > 0) {
                                                        this.SearchText = _Formatted;
                                                        
                                                        this.props.Changed(parseInt(_Formatted));
                                                    } else {
                                                        this.SearchText = '';
                                                        this.props.Changed(0);
                                                    }
                                                }

                                            } else if (this.props.ValueType === 'Decimal1' || this.props.ValueType === 'Decimal2' || this.props.ValueType === 'Decimal4') {
                        
                                                //Remove invalid characters
                                                let _Formatted = Text_Value.replace(/[^1234567890.]/gi,'');

                                                //Only keep first period
                                                let _Parts = _Formatted.split('.');
                                                _Formatted = _Parts.shift() + (_Parts.length ? '.' + _Parts.join('') : '');
                        
                                                //Enforce decimal place maximum
                                                if (_Formatted !== null && _Formatted.indexOf('.') !== -1) {
                                                    let _DecimalMax = 0;
                                                    if (this.props.ValueType === 'Decimal1') {
                                                        _DecimalMax = 1;
                                                    } else if (this.props.ValueType === 'Decimal2') {
                                                        _DecimalMax = 2;
                                                    } else if (this.props.ValueType === 'Decimal4') {
                                                        _DecimalMax = 4;
                                                    }
                                                    _Parts = _Formatted.split('.');
                                                    if (_Parts.length === 2 && _Parts[1].length > _DecimalMax) {
                                                        _Formatted = _Parts[0] + '.' + _Parts[1].substring(0, _DecimalMax);
                                                    }
                                                }

                                                //Update parent
                                                if (this.props.Changed !== undefined) {
                                                    if (_Formatted !== null && _Formatted.length > 0) {
                                                        this.SearchText = _Formatted;
                                                        this.props.Changed(parseFloat(_Formatted));
                                                    } else {
                                                        this.SearchText = '';
                                                        this.props.Changed(0);
                                                    }
                                                }                                            

                                            } else if (this.props.ValueType === 'VID') {
                        
                                                //Remove invalid characters
                                                let _Formatted = Text_Value.replace(/[^ABCDEFGHIJKLMNOPQRSTUVWXYZ1234567890-]/gi,'');

                                                //Apply casing
                                                if (this.props.Casing === 'upper' && Global.StringHasContent(_Formatted)) { _Formatted = _Formatted.toUpperCase(); }
                                                
                                                //Update parent
                                                if (this.props.Changed !== undefined) {
                                                    this.SearchText = _Formatted;
                                                    this.props.Changed(_Formatted);
                                                }

                                            } else if (this.props.ValueType === 'EID') {
                        
                                                //Remove invalid characters
                                                let _Formatted = Text_Value.replace(/[^ABCDEFGHIJKLMNOPQRSTUVWXYZ1234567890 ]/gi,'');
                        
                                                //Apply casing
                                                if (this.props.Casing === 'upper' && Global.StringHasContent(_Formatted)) { _Formatted = _Formatted.toUpperCase(); }

                                                //Update parent
                                                if (this.props.Changed !== undefined) {
                                                    this.SearchText = _Formatted;
                                                    this.props.Changed(_Formatted);
                                                }
                        
                                            } else {
                                                
                                                //Apply casing
                                                if (Global.StringHasContent(Text_Value)) { 
                                                    if (Platform.OS === 'macos') {
                                                        if (this.props.Casing === 'upper') { 
                                                            Text_Value = Text_Value.toUpperCase(); 
                                                        } else if (this.props.Casing === 'lower') {
                                                            Text_Value = Text_Value.toLowerCase();
                                                        }
                                                    }
                                                } else {
                                                    Text_Value = null;
                                                }

                                                //Update parent
                                                if (this.props.Changed !== undefined && Text_Value !== this.props.Value) {
                                                    this.SearchText = Text_Value;
                                                    this.props.Changed(Text_Value);
                                                }

                                            }
                                        }}
                                        onSubmitEditing={() => {
                                            Keyboard.dismiss();
                                            if (this.props.Submit !== undefined) {
                                                this.props.Submit();
                                            }
                                        }}
                                        onFocus={() => {
                                            this.Focused = true;
                                            this.SearchText = _Value;
                                            this.forceUpdate();
                                        }}
                                        onBlur={() => {
                                            this.Focused = false;
                                            this.SearchText = _Value;
                                            this.forceUpdate();
                                        }}
                                        onContentSizeChange={(event) => {
                                            if (this.props.Multiline === true) {                                                
                                                this.setState({ maxHeight: parseInt(event.nativeEvent.contentSize.height + 28) });
                                            }
                                        }}
                                        value={this.Focused ? this.SearchText : _Value} 
                                        keyboardType={this.KeyboardType()} 
                                        autoComplete={this.props.hasOwnProperty('KeyboardAutocomplete') ? this.props.KeyboardAutocomplete : 'off'}
                                        autoCapitalize={this.AutoCapitalize()} 
                                        autoCorrect={this.props.Autocorrect === true ? true : false}                             
                                        spellCheck={false}
                                        multiline={this.props.Multiline === true ? true : false} 
                                        scrollEnabled={false} 
                                        placeholder={(this.props.Enabled === undefined || this.props.Enabled === true) && this.props.Placeholder !== undefined ? this.props.Placeholder : '...'} 
                                        placeholderTextColor={this.props.Enabled === undefined || this.props.Enabled === true ? '#a9a9a9' : '#e1e1e1'} 
                                        focusable={(this.props.Enabled === undefined || this.props.Enabled === true) && (this.props.Editable === undefined || this.props.Editable === true)}
                                        editable={(this.props.Enabled === undefined || this.props.Enabled === true) && (this.props.Editable === undefined || this.props.Editable === true)} 
                                    />
                                    {_ClearSearchText}
                                    {_Postfix}
                                </View>                                    
                            </View>
                        </View>
                    );

                }

            }            
        } catch (ex) {
            global.Log({Message: 'InputControl.render>>' + ex.message});
        }
    };
};