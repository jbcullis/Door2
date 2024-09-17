import React, { Component } from 'react';
import {
    View,
    Text,
    Image,
    Animated,
    Pressable,
    ScrollView,
    Keyboard,
    Platform,
    TurboModuleRegistry,
    NativeModules,
} from 'react-native';
import InputControl from '../controls/InputControl';
module.exports = class ProductForm extends Component {
    constructor(props) {
        super(props);
        this.Titlebar = null;
    };
    IsActive() {
        try {
            return Global.State.hasOwnProperty(this.props.ModelID) && Global.State[this.props.ModelID] !== null;
        } catch (ex) {
            global.Log({Message: 'ProductForm.IsActive>>' + ex.message});
        }
    };
    async Show(Params_Value) {
        try {

            let _ViewWidth = Global.ScreenX > 600 ? 600 : Global.ScreenX;

            let _Product = null;
            if (Global.StringHasContent(Params_Value.ProductID)) {
                _Product = await ProductHelper.GetOne({ProductID: Params_Value.ProductID});
            } else {
                _Product = ProductHelper.Clone({
                    ProductPriceUnit: 'each'
                })
            }

            Global.State[this.props.ModelID] = {
                PageTitle: _Product !== null && _Product.ProductID !== null ? 'Edit Product' : 'New Product',
                Product: ProductHelper.Clone(_Product),
                ProductSnapshot: ProductHelper.Clone(_Product),
                ProductDirty: false,
                SaveCallback: Params_Value.hasOwnProperty('SaveCallback') ? Params_Value.SaveCallback : null,
                DeleteCallback: Params_Value.hasOwnProperty('DeleteCallback') ? Params_Value.DeleteCallback : null,
                ActiveWindow: false,
                ViewWidth: _ViewWidth,
                ViewOffset: new Animated.Value(_ViewWidth),
                FooterOffset: new Animated.Value(-70),
                FooterPadding: new Animated.Value(0)                     
            };
            global.root.NotificationModal.Hide();

            //ActiveHandler must be called after forceUpdate
            this.forceUpdate();
            global.root.ActiveHandler();
            
            //Run animation
            if (Global.State[this.props.ModelID] !== null && Global.State[this.props.ModelID].ViewOffset !== null && Global.State[this.props.ModelID].ViewOffset._value >= Global.State[this.props.ModelID].ViewWidth) {
                setTimeout(() => {
                    Animated.timing(Global.State[this.props.ModelID].ViewOffset, {duration: 200, toValue: 0, useNativeDriver: Global.NativeAnimationDriver}).start();
                }, 1);
            }

        } catch (ex) {
            Global.State[this.props.ModelID] = null;
            global.Log({Message: 'ProductForm.Show>>' + ex.message, Notify: true});
        }
    };
    CheckDirty() {
        try {
            let _IsDirty = (JSON.stringify(Global.State[this.props.ModelID].ProductSnapshot).trim() !== JSON.stringify(Global.State[this.props.ModelID].Product).trim());
            if (_IsDirty !== Global.State[this.props.ModelID].ProductDirty) {
                Global.State[this.props.ModelID].ProductDirty = _IsDirty;
                if (Global.State[this.props.ModelID] !== null && Global.State[this.props.ModelID].FooterOffset !== null) {
                    if (Global.State[this.props.ModelID].ProductDirty) {
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
            global.Log({Message: 'ProductForm.CheckDirty>>' + ex.message});
        }
    }; 
    SaveProduct() {
        try {
            this.ClearFocus();
            setTimeout(async () => {
                try {
                    await global.root.NotificationModal.Show({ NotificationTitle: 'Saving...', NotificationStyle: 'Wait' });
                    let _Product = ProductHelper.Clone(Global.State[this.props.ModelID].Product);

                    //Save product
                    _Product = await ProductHelper.Save(_Product);
                    if (_Product !== null) {
                        Global.State[this.props.ModelID].Product = ProductHelper.Clone(_Product);
                        Global.State[this.props.ModelID].ProductSnapshot = ProductHelper.Clone(_Product);
                        this.CheckDirty();
        
                        //Run callbacks
                        if (Global.State[this.props.ModelID].SaveCallback !== null) {
                            Global.State[this.props.ModelID].SaveCallback(ProductHelper.Clone(_Product));
                        }
        
                        global.root.NotificationModal.Hide();
                    } else {
                        global.root.NotificationModal.Hide();
                        this.Hide();
                    }
                } catch (ex) {
                    global.Log({Message: 'ProductForm.SaveProduct>>' + ex.message, Notify: true});
                }
            }, Platform.OS === 'macos' || Platform.OS === 'windows' ? 50 : 1);            
        } catch (ex) {
            global.Log({Message: 'ProductForm.SaveProduct>>' + ex.message, Notify: true});
        }
    };
    CancelProduct() {
        try {
            this.ClearFocus();
            setTimeout(() => {
                Global.State[this.props.ModelID].Product = ProductHelper.Clone(Global.State[this.props.ModelID].ProductSnapshot);
                this.CheckDirty();
            }, Platform.OS === 'macos' || Platform.OS === 'windows' ? 50 : 1);
        } catch (ex) {
            global.Log({Message: 'ProductForm.CancelProduct>>' + ex.message});
        }
    };
    DeleteProduct() {
        try {
            global.root.ConfirmModal.Show('Just Checking...', 'Are you sure you want to delete this product?', 'Yes', 'No', 
            async () => {
                try {
                    if (Global.State[this.props.ModelID].Product !== null && Global.StringHasContent(Global.State[this.props.ModelID].Product.ProductID)) {
                        await global.root.NotificationModal.Show({ NotificationTitle: 'Deleting...', NotificationStyle: 'Wait' });
                        await ProductHelper.Delete({ProductID: Global.State[this.props.ModelID].Product.ProductID});

                        //Run callbacks
                        if (Global.State[this.props.ModelID].DeleteCallback !== null) {
                            Global.State[this.props.ModelID].DeleteCallback(Global.State[this.props.ModelID].Product);
                        }

                        global.root.NotificationModal.Hide();
                        this.Hide();
                    } else {
                        this.Hide();
                    }
                } catch (ex) {
                    global.Log({Message: 'ProductForm.DeleteProduct>>' + ex.message, Notify: true});
                }
            }, () => {
                //Cancel - Do Nothing
            });
        } catch (ex) {
            global.Log({Message: 'ProductForm.DeleteProduct>>' + ex.message});
        }
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
            global.Log({Message: 'ProductForm.ActiveHandler>>' + ex.message});
        }
    };
    BackHandler() {
        try {
            this.Hide();
        } catch (ex) {
            global.Log({Message: 'ProductForm.BackHandler>>' + ex.message, Notify: true});
        }
    };
    ShortcutHandler(Shortcut_Value) {
        try {
            if (Shortcut_Value === 'Save' && Global.State[this.props.ModelID]?.ProductDirty === true) {
                this.SaveProduct();
            }
        } catch (ex) {
            global.Log({Message: 'ProductForm.ActiveHandler>>' + ex.message});
        }
    };

    Hide() {
        try {
            Animated.timing(Global.State[this.props.ModelID].ViewOffset, {duration: 200, toValue: Global.State[this.props.ModelID].ViewWidth, useNativeDriver: Global.NativeAnimationDriver}).start(() => {
                Global.State[this.props.ModelID] = null;
                global.root.ActiveHandler();
                this.forceUpdate();
            });
        } catch (ex) {
            global.Log({Message: 'ProductForm.Hide>>' + ex.message, Notify: true});
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
            global.Log({Message: 'ProductForm.ClearFocus>>' + ex.message});
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
                    </View>
                );
            } else {
                return (<View></View>);
            }
        } catch (ex) {
            global.Log({Message: 'ProductForm.render>>' + ex.message});
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
                            onPress={() => this.DeleteProduct()}
                            style={({pressed}) => [{width: 50, height: 50, alignItems: 'center', justifyContent: 'center', opacity: pressed ? .5 : 1}]}
                        >
                            <Image source={global.ColorScheme === 'dark' ? IMG_Trash_eeeeee : IMG_Trash_121212} style={{width: 28, height: 28}} />
                        </Pressable>
                    </View>
                </Pressable>
            );
        } catch (ex) {
            global.Log({Message: 'ProductForm.renderHeader>>' + ex.message});
        }
    };
    renderBody() {
        try {
            let _Price = Global.FormatCurrency('USD', Global.State[this.props.ModelID].Product.ProductPrice, 2);

            let _CopyUI = null;
            if (Global.State[this.props.ModelID].PageTitle === 'Edit Product') {
                _CopyUI = (
                    <Pressable
                        onPress={async () => {
                            try {
                                if (Platform.OS === 'windows' || Platform.OS === 'macos') {
                                    await TurboModuleRegistry.get('RNClipboard').SetString(Global.State[this.props.ModelID].Product.ProductID);
                                } else {
                                    await NativeModules.RNClipboard.setString(Global.State[this.props.ModelID].Product.ProductID);
                                }
                                global.root.NotificationModal.Show({ NotificationTitle: 'Copied!', NotificationStyle: 'Toast' });
                            } catch (ex) {
                                global.Log({Message: 'ProductForm.renderBody.CopyID>>' + ex.message, Notify: true});
                            }
                        }}
                        style={({pressed}) => [{width: 40, height: 50, marginTop: 4, alignItems: 'center', justifyContent: 'center', opacity: pressed ? .7 : 1}]}
                    >
                        <Image source={global.ColorScheme === 'dark' ? IMG_Copy_eeeeee : IMG_Copy_121212} style={Styles.toolbar_button_image} />
                    </Pressable>
                )
            }

            let _Availability = null;
            if (Global.State[this.props.ModelID].Product.ProductAvailability === 'never') {
                _Availability = 'Never';
            } else if (Global.State[this.props.ModelID].Product.ProductAvailability === 'renewing') {
                _Availability = 'Limited to Renewals';
            } else if (Global.State[this.props.ModelID].Product.ProductAvailability === 'general') {
                _Availability = 'General Availability';
            }

            return (
                <ScrollView style={{backgroundColor: Global.Theme.Body.BackgroundColor}}>

                    {/* Product Details */}
                    <View style={{flex: 1, padding: 10}}>

                        {/* Product ID */}
                        <View style={{flex: 1, flexDirection: 'row'}}>
                            <InputControl 
                                Name={'ID'}
                                Value={Global.State[this.props.ModelID].Product.ProductID} 
                                Changed={(Text_Value) => {
                                    Global.State[this.props.ModelID].Product.ProductID = Text_Value;
                                    this.CheckDirty();
                                }}
                                Placeholder={'...'}
                                MarginTop={10}
                                Editable={Global.State[this.props.ModelID].ActiveWindow} 
                                Enabled={Global.State[this.props.ModelID].PageTitle === 'New Product'}
                            />
                            {_CopyUI}
                        </View>


                        {/* Product Name */}
                        <InputControl
                            Name={'Name'}
                            Value={Global.State[this.props.ModelID].Product.ProductName}
                            Placeholder={'...'}
                            MarginTop={10}
                            Changed={(Text_Value) => {
                                Global.State[this.props.ModelID].Product.ProductName = Text_Value;
                                this.CheckDirty();
                            }}
                            Editable={Global.State[this.props.ModelID].ActiveWindow}
                        />

                        {/* Product Description */}
                        <InputControl
                            Name={'Description'}
                            Value={Global.State[this.props.ModelID].Product.ProductDescription}
                            MarginTop={10}
                            Changed={(Text_Value) => {
                                Global.State[this.props.ModelID].Product.ProductDescription = Text_Value;
                                this.CheckDirty();
                            }}
                            Editable={Global.State[this.props.ModelID].ActiveWindow}
                        />

                        {/* Product Price */}
                        <View style={{flex: 1, flexDirection: 'row'}}>
                            <InputControl
                                Name={'Price'}
                                Value={_Price.Value > 0 ? _Price.Value.toString() : null}
                                ValueType={'Decimal2'}
                                Prefix={_Price.Symbol}
                                MarginTop={10}
                                Changed={(Text_Value) => {
                                    Global.State[this.props.ModelID].Product.ProductPrice = parseFloat(Text_Value);
                                    this.CheckDirty();
                                }}
                                Editable={Global.State[this.props.ModelID].ActiveWindow}
                            />
                            <View style={{width: 10}}></View>
                            <InputControl
                                Name={'Unit'}
                                Value={Global.State[this.props.ModelID].Product.ProductPriceUnit}
                                Placeholder={'Required...'}
                                MarginTop={10}
                                Pressed={() => {
                                    global.root.PickerModal.Show([
                                        {Value: 'each', Text: 'each'},
                                        {Value: 'month', Text: 'month'},
                                        {Value: 'year', Text: 'year'}
                                    ], false, (Selected_Value) => {
                                        Global.State[this.props.ModelID].Product.ProductPriceUnit = Selected_Value;
                                        this.CheckDirty();
                                    }, () => {
                                        //Cancel - Do Nothing
                                    });
                                }}
                                Editable={Global.State[this.props.ModelID].ActiveWindow}
                            />                        
                        </View>

                        {/* Product Price Category */}
                        <View style={{flex: 1, flexDirection: 'row'}}>
                            <Image source={IMG_Tree_Bottom_000000} style={{width: 20, height: 9, marginTop: 18, marginRight: 4, opacity: .4}} />
                            <InputControl
                                Name={'Price Category'}
                                Value={Global.State[this.props.ModelID].Product.ProductPriceCategory}
                                MarginTop={10}
                                Pressed={() => {
                                    global.root.PickerModal.Show([
                                        {Value: 'Subscription Software', Text: 'Subscription Software'},
                                    ], false, (Selected_Value) => {
                                        Global.State[this.props.ModelID].Product.ProductPriceCategory = Selected_Value;
                                        this.CheckDirty();
                                    }, () => {
                                        //Cancel - Do Nothing
                                    });
                                }}
                                Editable={Global.State[this.props.ModelID].ActiveWindow}
                            />
                        </View>

                        <InputControl
                            Name={'Availability'}
                            Value={_Availability}
                            MarginTop={10}
                            Pressed={() => {
                                global.root.PickerModal.Show([
                                    { Text: 'Never', Value: 'never' },
                                    { Text: 'Limited to Renewals', Value: 'renewing' },
                                    { Text: 'General Availability', Value: 'general' }
                                ], false, (Selected_Value) => {
                                    Global.State[this.props.ModelID].Product.ProductAvailability = Selected_Value;
                                    this.CheckDirty();
                                }, () => {
                                    //Cancel - Do Nothing
                                });
                            }}
                            Editable={Global.State[this.props.ModelID].ActiveWindow}
                        />

                    </View>

                    {/* Bottom Padding */}
                    <View style={{height: Global.InsetBottom + 20}}></View>
                    <View style={{height: Global.State[this.props.ModelID].ScrollPadding}}></View>
                    <Animated.View key={'Footer_Padding'} style={{position: 'relative', backgroundColor: 'transparent', height: Global.State[this.props.ModelID].FooterPadding}}>
                    </Animated.View>

                </ScrollView>
            );
            
        } catch (ex) {
            global.Log({Message: 'ProductForm.renderBody>>' + ex.message});
        }
    };
    renderFooter() {
        try {
            return (
                <Animated.View key={'Footer_Row'} style={[Styles.v3_footer_container, {bottom: Global.State[this.props.ModelID].FooterOffset}]}>
                    <View style={{position: 'absolute', top: 0, left: 10, right: 10, height: 60, backgroundColor: Global.Theme.Footer.BackgroundColor, borderRadius: 6, opacity: .5}}></View>
                    <Pressable style={({pressed}) => [{width: 150, height: 40, marginLeft: 10, backgroundColor: '#c06e6e', opacity: pressed ? .7 : 1, borderRadius: 4, alignItems: 'center', justifyContent: 'center'}]} onPress={() => this.CancelProduct() }>
                        <Text style={{fontWeight: 'bold', color: Global.Theme.Highlight.ForegroundColor}}>Cancel</Text>
                    </Pressable>
                    <View style={{flex: 1}}></View>
                    <Pressable style={({pressed}) => [{width: 150, height: 40, marginRight: 10, backgroundColor: Global.Theme.Highlight.BackgroundColor, opacity: pressed ? .7 : 1, borderRadius: 4, alignItems: 'center', justifyContent: 'center'}]} onPress={() => this.SaveProduct() }>
                        <Text style={{fontWeight: 'bold', color: Global.Theme.Highlight.ForegroundColor}}>Save</Text>
                    </Pressable>
                </Animated.View>
            );
        } catch (ex) {
            global.Log({Message: 'ProductForm.renderFooter>>' + ex.message});
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
            global.Log({Message: 'ProductForm.renderSwipeBack>>' + ex.message});
        }
    };
};