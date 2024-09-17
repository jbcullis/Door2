import React, {useState, useRef} from 'react';
import {View, Text, TextInput, Pressable, Image, Keyboard} from 'react-native';
const ElementControl = ({ Name, Required, Value, ValueType, Prefix, Postfix, Width, Placeholder, PlaceholderColor, Icon, BackgroundColor, ForegroundColor, MarginTop, MarginLeft, MarginRight, MarginBottom, RadiusTopLeft, RadiusTopRight, RadiusBottomLeft, RadiusBottomRight, Autocorrect, SpellCheck, Multiline, SecureText, KeyboardType, Casing, Pressed, AutoFocus, Autocomplete, AutocompleteSource, Search, OnEnter, Submit, Changed, LostFocus, Editable, Enabled, Visible}) => {
    try {        
        if (Visible === undefined) { Visible = true; }
        if (Visible === false) {
            return null;
        } else {
    
            //Element State
            const _TextInput = useRef(null);
            const [Rendered] = useState(Date.now());
            const [Focused, setFocused] = useState(false);
            const [FocusedValue, setFocusedValue] = useState(Value);
            const [SearchTimeout, setSearchTimeout] = useState(null);
            const [SearchSuggestions, setSearchSuggestions] = useState([]);
            
            //Process enabled first - used for background color selection
            if (Enabled === undefined) { Enabled = true; }

            //Force core params to hold bool value
            if (Name === undefined) { Name = null; }
            if (Required === undefined) { Required = false; }
            if (Value === undefined) { Value = null; }
            if (ValueType === undefined) { ValueType = 'String'; }
            if (!Enabled) { 
                BackgroundColor = 'transparent'; 
            } else if (BackgroundColor === undefined) { 
                BackgroundColor = Global.Theme.Element.BackgroundColor;
            }
            if (ForegroundColor === undefined) { ForegroundColor = Global.Theme.Element.ForegroundColor; }
            if (Placeholder === undefined) { Placeholder = '...'; }
            if (PlaceholderColor === undefined) { PlaceholderColor = Global.Theme.Element.ForegroundFade; }
            if (Autocorrect === undefined) { Autocorrect = true; }
            if (KeyboardType === undefined) { KeyboardType = 'default'; }
            if (SpellCheck === undefined) { SpellCheck = true; }
            if (Multiline === undefined) { Multiline = false; }
            if (SecureText === undefined) { SecureText = false; }
            if (Casing === undefined) { Casing = 'none'; }
            if (Casing === 'upper') {
                Casing = 'characters';
            } else if (Casing === 'lower') {
                Casing = 'none';
            } else {
                Casing = 'sentences';
            }

            if (Editable === undefined) { Editable = true; }
            
            //Label
            let _Label = null;
            if (Name !== undefined && Name !== null) {
                _Label = (
                    <View style={{position: 'absolute', top: 2, left: 0}}>
                        <Text style={{color: ForegroundColor, paddingLeft: 8, fontSize: 12, opacity: .5}}>{Name}{Required === true ? ' *' : ''}</Text>
                    </View>  
                );
            }

            //Prefix
            let _Prefix = null;
            if (Prefix !== undefined && Prefix !== null) {
                _Prefix = (
                    <View style={{paddingLeft: 6, paddingRight: 6, paddingBottom: 8, justifyContent: 'flex-end'}}>
                        <Text style={{fontWeight: 'bold', color: Global.Theme.Body.ForegroundColor, opacity: .5}}>{Prefix}</Text>
                    </View>
                );
            }  

            //Postfix
            let _Postfix = null;
            if (Postfix !== undefined && Postfix !== null) {
                _Postfix = (
                    <View style={{paddingLeft: 6, paddingRight: 6, paddingBottom: 8, justifyContent: 'flex-end'}}>
                        <Text style={{fontWeight: 'bold', color: Global.Theme.Body.ForegroundColor, opacity: .5}}>{Postfix.trim()}</Text>
                    </View>
                );
            }

            //Create Container Style
            let _ContainerStyle = {
                minHeight: 48,
                marginTop: (MarginTop !== undefined ? MarginTop : 0),
                marginLeft: (MarginLeft !== undefined ? MarginLeft : 0),
                marginRight: (MarginRight !== undefined ? MarginRight : 0),
                marginBottom: (MarginBottom !== undefined ? MarginBottom : 0),
                backgroundColor: BackgroundColor,
                borderStyle: 'solid',
                borderColor: (!Enabled ? BackgroundColor : (Focused ? Global.Theme.Highlight.BackgroundColor : BackgroundColor)),
                borderBottomWidth: 2,
                borderBottomColor: BackgroundColor,
                borderTopLeftRadius: (RadiusTopLeft !== undefined ? RadiusTopLeft : 4),
                borderTopRightRadius: (RadiusTopRight !== undefined ? RadiusTopRight : 4),
                borderBottomLeftRadius: (RadiusBottomLeft !== undefined ? RadiusBottomLeft : 4),
                borderBottomRightRadius: (RadiusBottomRight !== undefined ? RadiusBottomRight : 4),
                zIndex: 999,
            }

            //Apply width or set flex to 1
            if (Width !== undefined) {
                _ContainerStyle.width = Width;
            } else {
                _ContainerStyle.flex = 1;
            }

            //Element Icon
            let _Icon = null;
            if (Icon !== undefined && Icon !== null) {
                _Icon = (
                    <View style={{width: 30, paddingLeft: 6, paddingRight: 10, paddingBottom: (_Label === null ? 10 : 6), justifyContent: 'flex-end'}}>
                        <Image source={Icon} style={{width: 24, height: 24, opacity: .5}} />
                    </View>
                );
            }

            //Format text when not focused
            if (Value !== null && !Focused) {
                if (ValueType === 'Decimal1') {
                    Value = Global.FormatNumber(Value, 1, '.', ',')
                } else if (ValueType === 'Decimal2') {
                    Value = Global.FormatNumber(Value, 2, '.', ',');
                } else if (ValueType === 'Decimal3') {
                    Value = Global.FormatNumber(Value, 3, '.', ',')
                } else if (ValueType === 'Decimal4') {
                    Value = Global.FormatNumber(Value, 4, '.', ',')
                }
            } else if (Value === null) {
                //We need this because the element won't re-render text if comparing null to null
                Value = '';
            }

            //Render Control
            if (Pressed !== undefined) {

                //Border inconsistency on windows
                if (Platform.OS === 'windows') {
                    _ContainerStyle.minHeight = 50;
                }

                return (
                    <Pressable 
                        style={({pressed}) => [_ContainerStyle, { opacity: pressed ? .7 : 1 }]} 
                        disabled={!Enabled} 
                        onPress={() => Pressed()}
                    >
                        {_Label}
                        <View style={{position: 'absolute', flexDirection: 'row', left: 0, right: 0, bottom: 0}}>
                            {_Prefix}
                            <Text 
                                style={{
                                    flex: 1,
                                    backgroundColor: 'transparent',
                                    color: ForegroundColor,
                                    fontWeight: 'bold',
                                    paddingTop: 6,
                                    paddingBottom: 6,
                                    paddingLeft: (_Prefix === null ? 8 : 4),
                                    paddingRight: (_Postfix === null ? 8 : 4),
                                    borderColor: 'transparent',
                                    opacity: (Value !== null && Value?.toString().length > 0 ? 1 : .5)
                                }}
                                numberOfLines={1}
                            >
                                {Value !== null && Value?.toString().length > 0 ? Value.toString() : Placeholder}
                            </Text>
                            {_Postfix}
                        </View>
                    </Pressable>
                );
            } else if (Autocomplete !== undefined) {
                
                let _SearchButton = null;
                if (Enabled && (Search !== undefined && Search !== null)) {
                    _SearchButton = (
                        <Pressable style={({pressed}) => [{width: 48, height: 48, alignItems: 'center', justifyContent: 'center', opacity: (pressed ? .7 : 1)}]} onPress={() => {
                            try {

                                //Clear the search box
                                clearTimeout(SearchTimeout);
                                setFocusedValue(null);
                                setSearchSuggestions([]);

                                //Notify search button pressed
                                if (Search !== undefined) {
                                    Search();
                                }

                            } catch (ex) {
                                SiteMesh.Exception({Message: 'ElementControl.SearchButton>>' + ex.message, Notify: true});
                            }
                        }}>
                            <Image source={Global.Theme.Body.Icons.Search} style={{width: 24, height: 24, marginTop: 2}} />
                        </Pressable>
                    );
                }

                //Return search element
                if (Platform.OS === 'ios' || Platform.OS === 'android') {
                    return (
                        <Pressable 
                            style={({pressed}) => [_ContainerStyle, {opacity: pressed ? .7 : 1}]}
                            onPress={() => {
                                try {
                                    global.root.ShowKeyboard(Name, 'String', Value, AutocompleteSource, (Text_Value) => {
                                        try {
                                            if (Autocomplete !== undefined) {
                                                Autocomplete({
                                                    Text: Text_Value,
                                                    Match: null,
                                                    Matched: false
                                                });
                                            }                                        
                                        } catch (ex) {
                                            SiteMesh.Exception({Message: 'ElementControl.ShowKeyboard>>' + ex.message, Notify: true});
                                        }
                                    }, (Selected_Value) => {
                                        if (Autocomplete !== undefined) {
                                            Autocomplete({
                                                Text: null,
                                                Match: Selected_Value,
                                                Matched: true
                                            });
                                        }
                                    });
                                } catch (ex) {
                                    SiteMesh.Exception({Message: 'ElementControl.ShowKeyboard>>' + ex.message, Notify: true});
                                }
                            }}
                            disabled={!Enabled}
                        >
                            {_Label}
                            <View style={{flex: 1, flexDirection: 'row'}}>
                                <View style={{position: 'absolute', flexDirection: 'row', left: 0, right: (_SearchButton !== null ? 48 : 0), bottom: 0}}>
                                    {_Icon}
                                    {_Prefix}
                                    <Text 
                                        style={{
                                            flex: 1,
                                            backgroundColor: 'transparent',
                                            color: ForegroundColor,
                                            fontWeight: 'bold',
                                            paddingTop: (_Label === null ? 2 : 6),
                                            paddingBottom: (_Label === null ? 0 : 6),
                                            paddingLeft: (_Prefix === null ? 8 : 4),
                                            paddingRight: (_Postfix === null ? 8 : 4),
                                            borderColor: 'transparent',
                                            opacity: (Value?.toString().length > 0 ? 1 : .5)
                                        }}
                                    >
                                        {Value?.toString().length > 0 ? Value.toString() : Placeholder}
                                    </Text>
                                    {_Postfix}
                                </View>
                                {_SearchButton !== null ? <View style={{position: 'absolute', right: 0}}>{_SearchButton}</View> : null}
                            </View>                            
                        </Pressable>
                    );
                } else {

                    //Search Handler
                    let SearchID = null;
                    let SearchSource = (SearchText_Value) => {
                        try {
                            clearTimeout(SearchTimeout);
                            setSearchTimeout(setTimeout(async () => {
                                try {
                                    let _SearchID = Math.random();
                                    SearchID = _SearchID;
                                    if (Global.StringHasContent(SearchText_Value)) {
                                        if (AutocompleteSource !== undefined && AutocompleteSource !== null) {
                                            if (AutocompleteSource === 'ACCOUNTS') {
                                                let _AccountList = await AccountHelper.GetList({
                                                    SearchText: SearchText_Value,
                                                    SearchOffset: 0,
                                                    SearchLimit: 3
                                                });
                                                if (SearchID === _SearchID) {
                                                    let _MatchList = [];
                                                    for (let _AccountIndex = 0; _AccountIndex < _AccountList.length; _AccountIndex++) {
                                                        if (_MatchList.length < 3) {
                                                            _MatchList.push({
                                                                DisplayText: _AccountList[_AccountIndex].AccountName.toUpperCase(),
                                                                Text: _AccountList[_AccountIndex].AccountName.toUpperCase(),
                                                                Value: _AccountList[_AccountIndex],
                                                            });
                                                        } else {
                                                            break;
                                                        }
                                                    }
                                                    setSearchSuggestions(_MatchList);
                                                }                                                
                                            } else if (AutocompleteSource === 'PRODUCTS') {
                                                let _ProductList = await ProductHelper.GetList({
                                                    SearchText: SearchText_Value,
                                                    SearchOffset: 0,
                                                    SearchLimit: 3
                                                });
                                                if (SearchID === _SearchID) {
                                                    let _MatchList = [];
                                                    for (let _ProductIndex = 0; _ProductIndex < _ProductList.length; _ProductIndex++) {
                                                        if (_MatchList.length < 3) {
                                                            _MatchList.push({
                                                                DisplayText: _ProductList[_ProductIndex].ProductName.toUpperCase(),
                                                                Text: _ProductList[_ProductIndex].ProductName.toUpperCase(),
                                                                Value: _ProductList[_ProductIndex],
                                                            });
                                                        } else {
                                                            break;
                                                        }
                                                    }
                                                    setSearchSuggestions(_MatchList);
                                                }                                                
                                            } else if (AutocompleteSource === 'PEOPLE') {
                                                let _PersonList = await PersonHelper.GetList({
                                                    SearchText: SearchText_Value,
                                                    SearchOffset: 0,
                                                    SearchLimit: 3
                                                });
                                                if (SearchID === _SearchID) {
                                                    let _MatchList = [];
                                                    for (let _PersonIndex = 0; _PersonIndex < _PersonList.length; _PersonIndex++) {
                                                        if (_MatchList.length < 3) {
                                                            _MatchList.push({
                                                                DisplayText: _PersonList[_PersonIndex].PersonName.toUpperCase(),
                                                                Text: _PersonList[_PersonIndex].PersonName.toUpperCase(),
                                                                Value: _PersonList[_PersonIndex],
                                                            });
                                                        } else {
                                                            break;
                                                        }
                                                    }
                                                    setSearchSuggestions(_MatchList);
                                                }                                                 
                                            }
                                        }
                                    } else {
                                        if (SearchID === _SearchID) {
                                            setSearchSuggestions([]);
                                        }
                                    }
                                } catch (ex) {
                                    global.Log({Message: 'ElementControl.SearchSource>>' + ex.message, Data: {Name: Name}});
                                }
                            }, 400));
                        } catch (ex) {
                            SiteMesh.Exception({Message: 'ElementControl.SearchSource.' + Name + '>>' + ex.message});
                        }
                    };

                    //Autocomplete rows - Only required on desktop version
                    //Mobile version is handled by the popup keyboard
                    let _AutocompleteContainer = null;
                    let _AutocompleteRows = [];
                    if (SearchSuggestions.length > 0) {
                        for (let _MatchIndex = 0; _MatchIndex < SearchSuggestions.length; _MatchIndex++) {
                            let _Match = SearchSuggestions[_MatchIndex]
                            if (_Match !== null) {
                                let _Opacity = 1;
                                let _ActionButton = null;
                                if (_Match.Value !== null && _Match.Value.hasOwnProperty('LinkType')) {
                                    if (_Match.Value.LinkType === 'Animal' && _Match.Value.LinkTerm4 === '2' && _Match.Value.LinkEnabled === true) {
                                        _ActionButton = (
                                            <Pressable style={({pressed}) => [{width: 40, marginRight: _MatchIndex < (SearchSuggestions.length - 1) ? 4 : 0, height: 30, borderTopRightRadius: 6, borderBottomRightRadius: 6, backgroundColor: pressed ? '#8aaa75' : '#7DA166', alignItems: 'center'}]} onPress={() => {
                                                clearTimeout(SearchTimeout);
                                                if (Autocomplete !== undefined) {
                                                    Autocomplete({
                                                        Text: FocusedValue,
                                                        Match: _Match.Value,
                                                        Matched: true,
                                                        Action: 'BIRTHFLOW'
                                                    });
                                                }
                                                setFocusedValue(_Match.DisplayText);
                                                SearchSuggestions = [];
                                            }}>
                                                <View style={{flex: 1, flexDirection: 'row', height: 30, alignItems: 'center', paddingRight: 6}}>
                                                    <Image source={IMG_Birth_e1e1e1} style={[Styles.form_button_image, {width: 24, height: 24}]} />
                                                </View>
                                            </Pressable>
                                        )
                                    }
                                    if (_Match.Value.LinkEnabled === false) {
                                        _Opacity = .6;
                                    }
                                }
                                _AutocompleteRows.push(
                                    <View key={'Match_' + _MatchIndex} style={{flex: 1, flexDirection: 'row'}}>
                                        <Pressable style={({pressed}) => [
                                            {
                                                flex: 1, 
                                                marginRight: (_ActionButton !== null ? 0 : (_MatchIndex < (SearchSuggestions.length - 1) ? 4 : 0)), 
                                                height: 30, 
                                                borderTopLeftRadius: 6, 
                                                borderBottomLeftRadius: 6, 
                                                borderTopRightRadius: (_ActionButton !== null ? 0 : 6), 
                                                borderBottomRightRadius: (_ActionButton !== null ? 0 : 6), 
                                                backgroundColor: Global.Theme.Highlight.BackgroundColor,
                                                opacity: pressed ? .7 : 1,
                                            }]} 
                                            onPress={() => {
                                            clearTimeout(SearchTimeout);
                                            if (Autocomplete !== undefined) {
                                                Autocomplete({
                                                    Text: FocusedValue,
                                                    Match: _Match.Value,
                                                    Matched: true
                                                });
                                            }
                                            setFocusedValue(_Match.DisplayText);
                                            setSearchSuggestions([]);
                                        }}>
                                            <View style={{flex: 1, flexDirection: 'row', height: 30, alignItems: 'center', paddingLeft: 6, paddingRight: 6}}>
                                                <Text style={{flex: 1, color: Global.Theme.Highlight.ForegroundColor, fontWeight: 'bold', fontSize: 10, opacity: _Opacity}} numberOfLines={1}>{_Match.DisplayText}</Text>
                                            </View>
                                        </Pressable>
                                        {_ActionButton}
                                    </View>
                                ) 
                            }
                        }
                    }
                    if (_AutocompleteRows.length > 0) {
                        _AutocompleteContainer = (
                            <View style={{position: 'absolute', bottom: 50, left: 0, right: 0}}>                            
                                <View style={{flex: 1, flexDirection: 'row', padding: 5}}>
                                    <View style={{position: 'absolute', left: 0, top: 0, right: 0, bottom: 0, backgroundColor: Global.Theme.Highlight.BackgroundColor, opacity: .2, borderRadius: 8}}></View>
                                    {_AutocompleteRows}
                                </View>
                            </View>
                        )
                    }

                    //Need to make an external container for search button
                    let _ExternalContainerStyle = {};

                    if (_ContainerStyle.hasOwnProperty('flex')) {
                        _ExternalContainerStyle.flex = _ContainerStyle.flex;
                    } else if (_ContainerStyle.hasOwnProperty('width')) {
                        _ExternalContainerStyle.width = _ContainerStyle.width;
                    }

                    //Return autocomplete element
                    return (
                        <View style={[_ExternalContainerStyle, {zIndex: 999}]}>
                            <View style={[_ContainerStyle, {flexDirection: 'row'}]}>
                                {_Label}
                                <View style={{position: 'relative', flex: 1, flexDirection: 'row', left: 0, right: 0, bottom: 0, borderWidth: 0}}>
                                    {_Icon}
                                    {_Prefix}                                
                                    <TextInput
                                        style={{
                                            flex: 1,
                                            backgroundColor: 'transparent',
                                            color: ForegroundColor,
                                            fontWeight: 'bold',
                                            paddingTop: parseInt(21 - (_Label === null ? 8 : 0)),
                                            paddingBottom: (6 + (_Label === null ? 8 : 0)),
                                            paddingLeft: 10,
                                            paddingRight: 10,
                                            borderColor: 'transparent',
                                            borderWidth: 0,
                                            borderRadius: 0,
                                        }}
                                        autoFocus={AutoFocus === true}
                                        onKeyPress={(e) => {
                                            try {
                                                if (Platform.OS === 'windows' && e.nativeEvent.key !== 'Enter') {
                                                    if (Global.StringHasContent(FocusedValue)) {
                                                        SearchSource(FocusedValue);
                                                    } else {
                                                        clearTimeout(SearchTimeout);
                                                        setFocusedValue(null);
                                                        setSearchSuggestions([]);
                                                    }
                                                }
                                            } catch (ex) {
                                                SiteMesh.Exception({Message: 'ElementControl.' + Name + '>>' + ex.message});
                                            }
                                        }}
                                        onChangeText={(Text_Value) => {

                                            //Apply casing
                                            if (Global.StringHasContent(Text_Value)) {
                                                if (Casing === 'upper') { 
                                                    Text_Value = Text_Value.toUpperCase(); 
                                                } else if (Casing === 'lower') {
                                                    Text_Value = Text_Value.toLowerCase();
                                                }
                                            } else {
                                                Text_Value = null;
                                            }

                                            //Update search text
                                            if (Platform.OS === 'macos') {
                                                setFocusedValue(Text_Value);
                                                if (Global.StringHasContent(Text_Value)) {
                                                    SearchSource(Text_Value);
                                                } else {
                                                    clearTimeout(SearchTimeout);
                                                    setFocusedValue(null);
                                                    setSearchSuggestions([]);
                                                    if (Autocomplete !== undefined) {
                                                        Autocomplete({
                                                            Text: null,
                                                            Match: null,
                                                            Matched: false
                                                        });
                                                    }
                                                }
                                            } else {
                                                setFocusedValue(Text_Value);
                                                if (!Global.StringHasContent(Text_Value)) {
                                                    clearTimeout(SearchTimeout);
                                                    setSearchSuggestions([]);
                                                }
                                            }
                                            
                                        }}
                                        onSubmitEditing={() => {
                                            clearTimeout(SearchTimeout);
                                            let _MatchText = FocusedValue;
                                            let _MatchObject = (FocusedValue !== Value && SearchSuggestions !== null && SearchSuggestions.length > 0 ? SearchSuggestions[0].Value : null);
                                            setFocusedValue(null);
                                            setSearchSuggestions([]);
                                            if (Autocomplete !== undefined) {
                                                if (_MatchObject !== null || _MatchText !== Value) {
                                                    Autocomplete({
                                                        Text: _MatchText,
                                                        Match: _MatchObject,
                                                        Matched: false
                                                    });
                                                } else {
                                                    Autocomplete({
                                                        Text: null,
                                                        Match: null,
                                                        Matched: false
                                                    });
                                                }
                                            }
                                            Keyboard.dismiss();
                                        }}
                                        onFocus={() => {
                                            setFocused(true);
                                            setFocusedValue(Value);
                                        }}
                                        onBlur={() => {
                                            //Another weird bug with rn macos where onBlur is triggered if autofocus is true and there is a placeholder set.
                                            //Work around is to add a prevent onBlur logic for first 50 milliseconds after first load
                                            //First noticed in 68.57 - test in future versions to see if this work around is still required
                                            if (Platform.OS === 'windows' || (Date.now() - Rendered) > 50) {
                                                //Delay clearing search suggestions in case of manually selection the option
                                                if (SearchSuggestions?.length > 0) {
                                                    setTimeout(() => {
                                                        setFocused(false);
                                                        setFocusedValue(null);
                                                        setSearchSuggestions([]);
                                                        if (LostFocus !== undefined) {
                                                            LostFocus();
                                                        }
                                                    }, 30);
                                                } else {
                                                    setFocused(false);
                                                    setFocusedValue(null);
                                                    setSearchSuggestions([]);
                                                    if (LostFocus !== undefined) {
                                                        LostFocus();
                                                    }
                                                }
                                            }
                                        }}
                                        value={Focused ? FocusedValue : Value} 
                                        keyboardType={KeyboardType} 
                                        autoCapitalize={Casing} 
                                        autoCorrect={Autocorrect}
                                        spellCheck={true}
                                        multiline={false} 
                                        scrollEnabled={false} 
                                        placeholder={Placeholder} 
                                        placeholderTextColor={PlaceholderColor}
                                        focusable={Enabled && Editable}
                                        editable={Enabled && Editable} 
                                        disabled={!Enabled}
                                    />
                                    {_Postfix}
                                </View>
                                {_SearchButton}
                            </View>
                            {_AutocompleteContainer}
                        </View>
                    );

                }

            } else {
                
                //Show soft keyboard on mobile, textbox on desktop
                if ((Platform.OS === 'ios' || Platform.OS === 'android') && (ValueType === 'Integer' || ValueType === 'Decimal1' || ValueType === 'Decimal2' || ValueType === 'Decimal3' || ValueType === 'Decimal4' || ValueType === 'VID' || ValueType === 'EID' || ValueType === 'Tattoo' || ValueType === 'PIN')) {
                    return (
                        <Pressable
                            style={({pressed}) => [_ContainerStyle, {borderColor: pressed ? Global.Theme.Highlight.BackgroundColor : (Focused ? Global.Theme.Highlight.BackgroundColor : BackgroundColor), opacity: pressed ? .7 : 1}]}
                            onPress={() => {
                                global.root.ShowKeyboard(Name, ValueType, Value, null, (Text_Value) => {
                                    //Text Callback
                                    if (ValueType === 'Integer') {
                                        Changed(parseInt(Text_Value))
                                        if (Submit !== undefined) {
                                            Submit();
                                        }
                                    } else if (ValueType === 'Decimal1' || ValueType === 'Decimal2' || ValueType === 'Decimal3' || ValueType === 'Decimal4') {
                                        Changed(parseFloat(Text_Value));
                                        if (Submit !== undefined) {
                                            Submit();
                                        }
                                    } else {
                                        Changed(Text_Value);
                                        if (Submit !== undefined) {
                                            Submit();
                                        }
                                    }
                                }, null);
                            }}
                            disabled={!Enabled}
                        >
                            {_Label}
                            <View style={{position: 'absolute', flexDirection: 'row', left: 0, right: 0, bottom: 0}}>
                                {_Prefix}
                                <Text 
                                    style={{
                                        flex: 1,
                                        backgroundColor: 'transparent',
                                        color: (Value?.length > 0 ? (ForegroundColor !== undefined ? ForegroundColor : Global.Element.Input.ForegroundColor) : PlaceholderColor),
                                        fontWeight: 'bold',
                                        paddingTop: 6,
                                        paddingBottom: 6,
                                        paddingLeft: (_Prefix === null ? 8 : 4),
                                        paddingRight: (_Postfix === null ? 8 : 4),
                                        borderColor: 'transparent',
                                    }}
                                >
                                    {Value?.toString().length > 0 ? Value.toString() : Placeholder}
                                </Text>
                                {_Postfix}
                            </View>
                        </Pressable>
                    );
                } else {

                    let _ClearSearchText = null;
                    if (Platform.OS === 'ios' 
                    && Focused 
                    && FocusedValue?.length > 0) {
                        _ClearSearchText = (
                            <Pressable 
                                onPress={() => {
                                    if (ValueType === 'Integer' || ValueType === 'Decimal1' || ValueType === 'Decimal2' || ValueType === 'Decimal4') {
                                
                                        //Update parent
                                        if (Changed !== undefined) {
                                            setFocusedValue('');
                                            Changed(0);
                                        }
                
                                    } else {
        
                                        //Update parent
                                        if (Changed !== undefined) {
                                            setFocusedValue('');
                                            Changed(null);
                                        }
        
                                    }
                                }} 
                                style={({pressed}) => [{height: 40, width: 40, top: 10, right: 0, alignItems: 'center', justifyContent: 'center', opacity: pressed ? .7 : 1}]}
                            >
                                <Image source={Global.Theme.Element.Icons.Close} style={{width: 20, height: 20, opacity: .5}} />
                            </Pressable>
                        );
                    }

                    //Create padding per platform
                    let _PaddingTop = 0;
                    let _PaddingBottom = 0;
                    if (Platform.OS === 'ios') {
                        _PaddingTop = 24;
                        _PaddingBottom = 4;
                    } else if (Platform.OS === 'android') {
                        _PaddingTop = 17;
                        _PaddingBottom = 0;
                    } else {
                        _PaddingTop = 21;
                        _PaddingBottom = 6;
                    }

                    return (
                        <View style={_ContainerStyle}>
                            {_Label}
                            <View style={{position: 'relative', flexDirection: 'row', left: 0, right: 0, bottom: 0, borderWidth: 0}}>
                                {_Prefix}
                                {_Icon}
                                <TextInput 
                                    ref={_TextInput}
                                    style={{
                                        flex: 1,
                                        backgroundColor: 'transparent',
                                        color: (ForegroundColor),
                                        fontWeight: 'bold',
                                        paddingTop: _PaddingTop,
                                        paddingBottom: _PaddingBottom,
                                        paddingLeft: (_Prefix === null ? (_Icon === null ? 8 : 38) : 4),
                                        paddingRight: (_Postfix === null ? 8 : 4),
                                        borderColor: 'transparent',
                                        borderWidth: 0,
                                        opacity: (Focused ? 1 : (Value !== null && Value.toString().length > 0 ? 1 : .5))
                                    }}
                                    onChangeText={(Text_Value) => {
                                        if (ValueType === 'Integer') {
                        
                                            //Remove invalid characters
                                            let _Formatted = Text_Value.replace(/[^1234567890]/gi,'');

                                            //Update parent
                                            if (Changed !== undefined) {
                                                if (_Formatted !== null && _Formatted.length > 0) {
                                                    setFocusedValue(_Formatted);
                                                    Changed(parseInt(_Formatted));
                                                } else {
                                                    setFocusedValue('');
                                                    Changed(0);
                                                }
                                            }

                                        } else if (ValueType === 'Decimal1' || ValueType === 'Decimal2' || ValueType === 'Decimal3' || ValueType === 'Decimal4') {
                    
                                            //Remove invalid characters
                                            let _Formatted = Text_Value.replace(/[^1234567890.]/gi,'');

                                            //Only keep first period
                                            let _Parts = _Formatted.split('.');
                                            _Formatted = _Parts.shift() + (_Parts.length > 0 ? '.' + _Parts.join('') : '');                                            

                                            //Enforce decimal place maximum
                                            if (_Formatted !== null && _Formatted.indexOf('.') !== -1) {
                                                let _DecimalMax = 0;
                                                if (ValueType === 'Decimal1') {
                                                    _DecimalMax = 1;
                                                } else if (ValueType === 'Decimal2') {
                                                    _DecimalMax = 2;
                                                } else if (ValueType === 'Decimal3') {
                                                    _DecimalMax = 3;
                                                } else if (ValueType === 'Decimal4') {
                                                    _DecimalMax = 4;
                                                }
                                                _Parts = _Formatted.split('.');
                                                if (_Parts.length === 2 && _Parts[1].length > _DecimalMax) {
                                                    _Formatted = _Parts[0] + '.' + _Parts[1].substring(0, _DecimalMax);
                                                }
                                            }
                                            
                                            //Update parent
                                            if (Changed !== undefined) {
                                                if (_Formatted?.length > 0) {
                                                    setFocusedValue(_Formatted);
                                                    if (parseFloat(_Formatted) !== parseFloat(Value)) {                                                        
                                                        Changed(parseFloat(_Formatted));
                                                    }
                                                } else {
                                                    setFocusedValue('');
                                                    Changed(0);
                                                }
                                            }

                                        } else if (ValueType === 'VID') {
                                            //Remove invalid characters
                                            let _Formatted = Text_Value.replace(/[^ABCDEFGHIJKLMNOPQRSTUVWXYZ1234567890-]/gi,'');

                                            //Apply casing
                                            if (Casing === 'upper' && Global.StringHasContent(_Formatted)) { _Formatted = _Formatted.toUpperCase(); }
                                            
                                            //Update parent
                                            if (Changed !== undefined) {
                                                setFocusedValue(_Formatted);
                                                Changed(_Formatted);
                                            }

                                        } else if (ValueType === 'EID') {

                                            //Remove invalid characters
                                            let _Formatted = Text_Value.replace(/[^ABCDEFGHIJKLMNOPQRSTUVWXYZ1234567890 ]/gi,'');
                    
                                            //Apply casing
                                            if (Casing === 'upper' && Global.StringHasContent(_Formatted)) { _Formatted = _Formatted.toUpperCase(); }

                                            //Update parent
                                            if (Changed !== undefined) {
                                                setFocusedValue(_Formatted);
                                                Changed(_Formatted);
                                            }
                    
                                        } else if (ValueType === 'Tattoo') {

                                            //Remove invalid characters
                                            let _Formatted = Text_Value.replace(/[^ABCDEFGHIJKLMNOPQRSTUVWXYZ1234567890 -]/gi,'');

                                            //Apply casing
                                            if (Casing === 'upper' && Global.StringHasContent(_Formatted)) { _Formatted = _Formatted.toUpperCase(); }
                                            
                                            //Update parent
                                            if (Changed !== undefined) {
                                                setFocusedValue(_Formatted);
                                                Changed(_Formatted);
                                            }

                                        } else {
                                            
                                            //Apply casing on macos only (RN macOS casing doesn't work)
                                            //Null out value if string has no content
                                            if (Global.StringHasContent(Text_Value)) { 
                                                if (Platform.OS === 'macos') {
                                                    if (Casing === 'upper') { 
                                                        Text_Value = Text_Value.toUpperCase(); 
                                                    } else if (Casing === 'lower') {
                                                        Text_Value = Text_Value.toLowerCase();
                                                    }
                                                }
                                            } else {
                                                Text_Value = null;
                                            }
 
                                            //Update parent
                                            if (Changed !== undefined && Text_Value !== Value) {
                                                setFocusedValue(Text_Value);
                                                Changed(Text_Value);
                                            }
        
                                        }
                                    }}
                                    onSubmitEditing={() => {      
                                        Keyboard.dismiss();                                        
                                        if (OnEnter !== undefined) {
                                            _TextInput.current.blur();
                                            setTimeout(() => OnEnter(), 100);
                                        } else {
                                            _TextInput.current.blur();
                                        }
                                    }}
                                    onFocus={() => {
                                        setFocused(true);
                                        setFocusedValue(Value); //Set focused value (used to revert back to original value if user cancels edit
                                    }}
                                    onBlur={() => {
                                        setFocused(false);
                                        setFocusedValue(Value);
                                        if (Submit !== undefined) {
                                            Submit();                                            
                                        }
                                    }}
                                    value={Focused ? FocusedValue : (Value?.toString().length > 0 ? Value.toString() : null)} 
                                    keyboardType={KeyboardType}
                                    autoCorrect={Autocorrect}
                                    spellCheck={SpellCheck}
                                    multiline={Multiline}
                                    scrollEnabled={false}
                                    secureTextEntry={SecureText}
                                    placeholder={Placeholder} 
                                    autoCapitalize={Casing}
                                    placeholderTextColor={ForegroundColor} 
                                    focusable={Enabled && Editable}
                                    editable={Enabled && Editable}
                                    disabled={!Enabled}
                                />
                                {_ClearSearchText}
                                {_Postfix}
                            </View>
                        </View>
                    );
                } 

            }

        }
    } catch (ex) {
        global.Log({Message: 'ElementControl.render>>' + ex.message});
    }    
};

export default ElementControl;