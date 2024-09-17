import React, { Component } from 'react';
import { Buffer } from 'buffer';
import {
    View,
    Text,
    Image,
    RefreshControl,
    Keyboard,
    FlatList,
    Pressable,
    Platform,
} from 'react-native';
import ElementControl from '../controls/ElementControl.js';
module.exports = class TransactionSearch extends Component {
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
            global.Log({Message: 'TransactionSearch.IsActive>>' + ex.message});
        }
    };
    async Show() {
        try {
            global.root.NotificationModal.Show({ NotificationTitle: 'Loading...', NotificationStyle: 'Wait' });

            let _Params = {
                SearchLimit: 25,
                SearchOffset: 0,
            };

            Global.State[this.props.ModelID] = {
                SearchID: null,
                SearchTimeout: null,
                SearchText: null,
                SearchLimit: 25,
                SearchOffset: 0,
                SearchCount: await TransactionHelper.GetCount(_Params),
                TransactionList: await TransactionHelper.GetList(_Params),
                LazyLoadEnabled: false,
            }
            this.forceUpdate();
            global.root.ActiveHandler();
            global.root.NotificationModal.Hide();
        } catch (ex) {
            Global.State[this.props.ModelID] = null;
            global.Log({Message: 'TransactionSearch.Show>>' + ex.message, Notify: true});
        }
    };
    Hide() {
        try {
            if (Global.State[this.props.ModelID] !== null) {
                Global.State[this.props.ModelID] = null;
            }
        } catch (ex) {
            global.Log({Message: 'TransactionSearch.Show>>' + ex.message});
        }
    };

    async ExportList() {
        try {
            await global.root.NotificationModal.Show({ NotificationTitle: 'Loading...', NotificationStyle: 'Wait' });

            let _Base64 = '';
            _Base64 += 'Transaction,';
            _Base64 += 'Reference,';
            _Base64 += 'Account,';
            _Base64 += 'Person,';
            _Base64 += 'Date,';
            _Base64 += 'Payment Method,';
            _Base64 += 'Payment Date,';
            _Base64 += 'Payment Reference,';
            _Base64 += 'Payment Fee,';
            _Base64 += 'Refund Method,';
            _Base64 += 'Refund Date,';
            _Base64 += 'Refund Reference,';
            _Base64 += 'Refund Fee,';          
            _Base64 += 'Item,';
            _Base64 += 'Product,';
            _Base64 += 'Quantity,';
            _Base64 += 'Price,';
            _Base64 += 'Comment,';
            _Base64 += 'Subtotal,';
            _Base64 += 'Tax,';
            _Base64 += 'Tax Rate,';
            _Base64 += 'Total,';
            _Base64 += 'Currency,';
            _Base64 += 'Exchange,';
            _Base64 += 'Local Total,';
            _Base64 += '\n';

            for (let _TransactionIndex = 0; _TransactionIndex < Global.State[this.props.ModelID].TransactionList.length; _TransactionIndex++) {
                let _Transaction = Global.State[this.props.ModelID].TransactionList[_TransactionIndex];
                for (let _TransactionItemIndex = 0; _TransactionItemIndex < _Transaction.TransactionItemList.length; _TransactionItemIndex++) {
                    let _TransactionItem = _Transaction.TransactionItemList[_TransactionItemIndex];
                    _Base64 += _Transaction.TransactionNumber + ',';
                    _Base64 += (_Transaction.TransactionReference !== null ? _Transaction.TransactionReference + ',' : ',');
                    _Base64 += (_Transaction.TransactionAccount !== null ? _Transaction.TransactionAccount.AccountName + ',' : ',');
                    _Base64 += (_Transaction.TransactionPerson !== null ? _Transaction.TransactionPerson.PersonName + ',' : ',');
                    _Base64 += _Transaction.TransactionDate.toString() + ',';
                    _Base64 += (_Transaction.TransactionPaymentType > 0 ? _Transaction.TransactionPaymentType + ',' : ',');
                    _Base64 += (_Transaction.TransactionPaymentDate !== null ? _Transaction.TransactionPaymentDate.toString() + ',' : ',');
                    _Base64 += (_Transaction.TransactionPaymentReference !== null ? _Transaction.TransactionPaymentReference + ',' : ',');
                    _Base64 += (_Transaction.TransactionPaymentFee > 0 ? _Transaction.TransactionPaymentFee + ',' : ',');
                    _Base64 += (_Transaction.TransactionRefundDate !== null ? _Transaction.TransactionRefundDate.toString() + ',' : ',');
                    _Base64 += (_Transaction.TransactionRefundReference !== null ? _Transaction.TransactionRefundReference + ',' : ',');
                    _Base64 += (_Transaction.TransactionRefundAmount !== null ? _Transaction.TransactionRefundAmount + ',' : ',');
                    _Base64 += (Global.PadInteger(parseInt(_TransactionItemIndex + 1), 4) + ',');
                    _Base64 += (Global.StringHasContent(_TransactionItem.TransactionItemDescription) ? _TransactionItem.TransactionItemDescription + ',' : ',');
                    _Base64 += (_TransactionItem.TransactionItemQuantity + ',');
                    _Base64 += (_TransactionItem.TransactionItemPrice + ',')
                    _Base64 += (Global.StringHasContent(_TransactionItem.TransactionItemComment) ? _TransactionItem.TransactionItemComment + ',' : ',');
                    _Base64 += _TransactionItem.TransactionItemSubtotal.toString() + ',';
                    _Base64 += _TransactionItem.TransactionItemTax.toFixed(2) + ',';
                    _Base64 += _TransactionItem.TransactionItemTaxRate.toString() + ',';
                    _Base64 += _TransactionItem.TransactionItemTotal.toFixed(2) + ',';
                    _Base64 += (Global.StringHasContent(_Transaction.TransactionCurrency) ? _Transaction.TransactionCurrency + ',' : ',');
                    _Base64 += (_Transaction.TransactionExchange + ',');
                    _Base64 += (parseFloat(_TransactionItem.TransactionItemTotal * _Transaction.TransactionExchange).toFixed(2) + ',');
                    _Base64 += '\n';
                }

            }

            await global.root.NotificationModal.Hide();

            let _Buffer = Buffer.from(_Base64);
            _Base64 = 'data:text/csv;base64,' + _Buffer.toString('base64');
            await global.root.Export({
                FileName: 'Transactions-' + Global.CreateTimestamp() + '.csv',
                Base64: _Base64
            });

        } catch (ex) {
            global.Log({Message: 'TransactionSearch.ExportList>>' + ex.message, Notify: true});
        }
    };

    async Search(SearchID_Value) {
        try {
            Global.State[this.props.ModelID].SearchOffset = 0;
            let _Params = {
                SearchText: Global.State[this.props.ModelID].SearchText,
                SearchLimit: Global.State[this.props.ModelID].SearchLimit,
                SearchOffset: Global.State[this.props.ModelID].SearchOffset
            };

            let _TransactionList = await TransactionHelper.GetList(_Params);
            if (Global.State[this.props.ModelID] !== null
            && (SearchID_Value === null || Global.State[this.props.ModelID].SearchID === SearchID_Value)) {
                Global.State[this.props.ModelID].SearchCount = await TransactionHelper.GetCount(_Params);
                Global.State[this.props.ModelID].TransactionList = _TransactionList;
                this.forceUpdate();
            }
            this.forceUpdate();
        } catch (ex) {
            global.Log({Message: 'TransactionSearch.Search>>' + ex.message, Notify: true});
        }
    };
    async Update(Transaction_Value) {
        try {
            let _Updated = false;
            for (let _TransactionIndex = Global.State[this.props.ModelID].TransactionList.length - 1; _TransactionIndex >= 0; _TransactionIndex--) {
                let _Transaction = Global.State[this.props.ModelID].TransactionList[_TransactionIndex];
                if (_Transaction.TransactionID === Transaction_Value.TransactionID) {
                    Global.State[this.props.ModelID].TransactionList.splice(_TransactionIndex, 1, TransactionHelper.Clone(Transaction_Value));
                    _Updated = true;
                }
            }
            if (!_Updated) {
                Global.State[this.props.ModelID].TransactionList.push(TransactionHelper.Clone(Transaction_Value));
            }
            this.forceUpdate();
        } catch (ex) {
            global.Log({Message: 'TransactionSearch.Update>>' + ex.message});
        }
    };
    async Delete(Transaction_Value) {
        try {
            for (let _TransactionIndex = Global.State[this.props.ModelID].TransactionList.length - 1; _TransactionIndex >= 0; _TransactionIndex--) {
                let _Transaction = Global.State[this.props.ModelID].TransactionList[_TransactionIndex];
                if (_Transaction.TransactionID === Transaction_Value.TransactionID) {
                    Global.State[this.props.ModelID].TransactionList.splice(_TransactionIndex, 1);
                }
            }
            this.forceUpdate();
        } catch (ex) {
            global.Log({Message: 'TransactionSearch.Delete>>' + ex.message});
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
            global.Log({Message: 'TransactionSearch.ClearFocus>>' + ex.message});
        }
    };

    //Handlers
    ActiveHandler() {
        try {
            //Do Nothing
        } catch (ex) {
            global.Log({Message: 'TransactionSearch.ActiveHandler>>' + ex.message});
        }
    };
    BackHandler() {
        try {
            this.Hide();
        } catch (ex) {
            global.Log({Message: 'TransactionSearch.BackHandler>>' + ex.message});
        }
    };
    KeyboardHandler(action, keyboardheight) {
        try {
            //Do Nothing
        } catch (ex) {
            global.Log({Message: 'TransactionSearch.KeyboardHandler>>' + ex.message});
        }
    };
    ShortcutHandler(Shortcut_Value) {
        try {
            //Do Nothing
        } catch (ex) {
            global.Log({Message: 'TransactionSearch.KeyboardHandler>>' + ex.message});
        }
    };

    render() {
        try {
            if (this.IsActive()) {
                let _LastDate = null;
                return (
                    <View style={{flex: 1, backgroundColor: Global.Theme.Header.BackgroundColor}}>
                        
                        {/* Searchbox */}
                        <View style={[
                            {
                                height: 131, 
                                padding: 10,
                            }
                        ]}>
    

                            {/* Header */}
                            <View style={{flexDirection: 'row', height: 50}}>
                                <Pressable 
                                    onPress={() => {
                                        global.root.NavBack();
                                    }}
                                    style={({pressed}) => [{width: 50, height: 50, alignItems: 'center', justifyContent: 'center', opacity: pressed ? .5 : 1}]}
                                >
                                        <Image source={Global.Theme.Header.Icons.Back} style={{width: 20, height: 20}} />
                                </Pressable>                                  
                                <View style={{flex: 1, height: 50, justifyContent: 'center'}}>
                                    <Text style={{fontSize: 20, fontWeight: 'bold', color: (global.ColorScheme === 'dark' ? '#eeeeee' : '#121212')}} numberOfLines={1}>TRANSACTIONS ({Global.State[this.props.ModelID].SearchCount})</Text>
                                </View>
                                <Pressable 
                                    onPress={() => {
                                        this.ExportList();
                                    }}
                                    style={({pressed}) => [{width: 50, height: 50, alignItems: 'center', justifyContent: 'center', opacity: pressed ? .5 : 1}]}
                                >
                                    <Image source={global.ColorScheme === 'dark' ? IMG_Upload_eeeeee : IMG_Upload_121212} style={{width: 24, height: 24}} />
                                </Pressable>
                                <Pressable 
                                    onPress={() => {
                                        global.root.ProductSearch.Show();
                                    }}
                                    style={({pressed}) => [{width: 50, height: 50, alignItems: 'center', justifyContent: 'center', opacity: pressed ? .5 : 1}]}
                                >
                                    <Image source={global.ColorScheme === 'dark' ? IMG_Product_eeeeee : IMG_Product_121212} style={{width: 24, height: 24}} />
                                </Pressable>                                
                                <Pressable 
                                    onPress={() => {
                                        global.root.ShowTransaction({
                                            TransactionID: null,
                                            SaveCallback: (Transaction_Value) => this.Update(Transaction_Value),
                                            DeleteCallback: (TransactionID_Value) => this.Delete(TransactionID_Value)
                                        });
                                    }}
                                    style={({pressed}) => [{width: 50, height: 50, alignItems: 'center', justifyContent: 'center', opacity: pressed ? .5 : 1}]}
                                >
                                    <Image source={global.ColorScheme === 'dark' ? IMG_Add_eeeeee : IMG_Add_121212} style={{width: 28, height: 28}} />
                                </Pressable>
                            </View>
    
                            {/* Search */}
                            <View style={{flexDirection: 'row', justifyContent: 'center', marginTop: 10}}>
                                <ElementControl 
                                    Name={'Search'}
                                    Casing={'upper'}                               
                                    Value={Global.State[this.props.ModelID].SearchText}
                                    Changed={(Text_Value) => {
                                        Global.State[this.props.ModelID].SearchText = Text_Value;
                                        this.forceUpdate();
                                        clearTimeout(Global.State[this.props.ModelID].SearchTimeout);
                                        Global.State[this.props.ModelID].SearchTimeout = setTimeout(() => {
                                            let _SearchID = Math.random();
                                            Global.State[this.props.ModelID].SearchID = _SearchID;
                                            this.Search(_SearchID);
                                        }, 400);
                                    }}
                                    Editable={this.props.ActiveWindow} 
                                />                               
                            </View>
    
                        </View>

                        <FlatList 
                            style={{flex: 1, backgroundColor: Global.Theme.Body.BackgroundColor}} 
                            data={Global.State[this.props.ModelID].TransactionList}
                            onScroll={() => {
                                Global.State[this.props.ModelID].LazyLoadEnabled = true;
                            }}
                            refreshControl={
                                <RefreshControl refreshing={this.state.Refreshing} onRefresh={async () => {
                                    try {
                                        this.setState({Refreshing: true});
                                        await this.Search(null);
                                        this.setState({Refreshing: false});
                                    } catch (ex) {
                                        global.Log({Message: 'TransactionSearch.IsActive>>' + ex.message, Notify: true});
                                        this.setState({Refreshing: false});
                                    }
                                }} />
                            }
                            onEndReached={() => {
                                try {                        
                                    if (Global.State[this.props.ModelID].LazyLoadEnabled) {
                                        Global.State[this.props.ModelID].LazyLoadEnabled = false;
                                        Global.State[this.props.ModelID].SearchOffset += Global.State[this.props.ModelID].SearchLimit;                
                                        TransactionHelper.GetList({
                                            SearchText: Global.State[this.props.ModelID].SearchText,
                                            SearchLimit: Global.State[this.props.ModelID].SearchLimit,
                                            SearchOffset: Global.State[this.props.ModelID].SearchOffset
                                        }).then((TransactionList_Value) => {
                                            Global.State[this.props.ModelID].TransactionList = [...Global.State[this.props.ModelID].TransactionList, ...TransactionList_Value];
                                            this.forceUpdate();
                                        }).catch((ex) => {
                                            global.Log({Message: 'TransactionSearch.render>>' + ex.message, Notify: true});
                                        });
                                    }
                                } catch (ex) {
                                    global.Log({Message: 'TransactionSearch.render>>' + ex.message, Notify: true});
                                }
                            }}
                            renderItem={({item, index, separators}) => {
                                let _Transaction = Global.State[this.props.ModelID].TransactionList[index];

                                let _BorderColor = '#262626';
                                if (_Transaction.TransactionPaymentType === 'unpaid') {
                                    _BorderColor = '#ff392e'
                                } else {
                                    _BorderColor = Global.Theme.Highlight.BackgroundColor;
                                }

                                let _SeparatorUI = null;
                                let _TransactionDate = new Date(_Transaction.TransactionDate);
                                let _TransactionShortDate = Global.FormatShortDate(_TransactionDate.getFullYear(), parseInt(_TransactionDate.getMonth() + 1), _TransactionDate.getDate());
                                if (_LastDate === null || (_LastDate !== null && _LastDate !== _TransactionShortDate)) {
                                    _LastDate = _TransactionShortDate;
                                    _SeparatorUI = (
                                        <View key={'DateSeparator_' + index} style={{flex: 1, height: 50, justifyContent: 'center', marginTop: 1, paddingLeft: 11}}>
                                            <Text style={{color: (global.ColorScheme === 'dark' ? '#eeeeee' : '#121212'), fontWeight: 'bold', fontSize: 20}}>{_TransactionShortDate}</Text>
                                        </View>
                                    );
                                }

                                let _TransactionUI = (
                                    <Pressable 
                                        key={'TransactionList_' + index}
                                        onPress={() => global.root.ShowTransaction({
                                            TransactionID: _Transaction.TransactionID,
                                            SaveCallback: (Transaction_Value) => this.Update(Transaction_Value),
                                            DeleteCallback: (TransactionID_Value) => this.Delete(TransactionID_Value)
                                        })}
                                        style={({pressed}) => [{flex: 1, flexDirection: 'row', opacity: pressed ? .7 : 1, backgroundColor: Global.Theme.Body.ControlBackground, borderRadius: 4, minHeight: 50, marginTop: (_SeparatorUI === null ? 10 : 0), marginLeft: 10, marginRight: 10}]}
                                    >
                                        <View style={{width: 3, backgroundColor: _BorderColor, borderRadius: 4, opacity: .5}}></View>
                                        <View style={{flex: 1, justifyContent: 'center', padding: 10}}>
                                            <Text style={{color: Global.Theme.Body.ForegroundFade, fontSize: 11}}>{_Transaction.TransactionAccount !== null ? _Transaction.TransactionAccount.AccountName : null}</Text>
                                            <Text style={{color: Global.Theme.Body.ForegroundFade, fontSize: 11, marginTop: 4}}>${Global.FormatNumber(parseFloat(_Transaction.TransactionTotal * _Transaction.TransactionExchange), 2, '.' , ',')} on {Global.FormatShortDate(_TransactionDate.getFullYear(), _TransactionDate.getMonth() + 1, _TransactionDate.getDate()) + ' (' + (_Transaction.TransactionPaymentType === 'unpaid' ? 'Unpaid' : 'Paid') + ')'}</Text>
                                            <Text style={{marginTop: 4, color: Global.Theme.Body.ForegroundColor}}>{_Transaction.TransactionNumber}</Text>
                                        </View>
                                        <View style={{width: 50, alignItems: 'center', justifyContent: 'center'}}>
                                            <Image source={Global.Theme.Body.Icons.Forward} style={{width: 20, height: 20}} />
                                        </View>
                                    </Pressable>
                                );

                                return (
                                    <View>
                                        {_SeparatorUI}
                                        {_TransactionUI}
                                    </View>
                                );

                            }}
                            keyExtractor={item => item.TransactionID} 
                            ListEmptyComponent={() => {
                                return (
                                    <View key={'No_Threads_Found'} style={{flex: 1, height: 50, margin: 10, backgroundColor: Global.Theme.Body.ControlBackground, borderRadius: 4, alignItems: 'center', justifyContent: 'center'}}>
                                    <Text style={{color: Global.Theme.Body.ForegroundFade}}>No Transactions Found</Text>
                                </View>
                                );
                            }}
                        />

                    </View>
                );
            } else {
                return (
                    <View></View>
                )
            }
        } catch (ex) {
            global.Log({Message: 'TransactionSearch.render>>' + ex.message});
        }
    };
};