'use strict';
import {
  StyleSheet,
  Platform,
} from 'react-native';
module.exports = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#fafafa',
    },
    toolbar_safearea: {
        backgroundColor: '#ffffff',
        borderStyle: 'solid',
        borderBottomWidth: 1,
        borderColor: '#e1e1e1'
    },
    toolbar_container: {        
        height: 50,
        alignItems: 'center',  
        flexDirection:'row',
    },
    toolbar_button:{
        width: 40,
        height: 40,
        borderRadius: 4,
        marginRight: 10,
        marginLeft: 10,
        flexDirection:'row',
        alignItems:'center',
        justifyContent:'center',
        backgroundColor: '#474747',
    },
    toolbar_button_image: {
        width: 20, 
        height: 20,
    },
    v3_toolbar_text: {
        fontSize: 22,
        color: '#000000',
        fontWeight: 'bold'
    },    
    footer_safearea: {
        backgroundColor:'#d6d6d6',
    },
    footer_container: {        
        flexDirection:'row',
        paddingTop: 5, 
        paddingBottom: 5, 
        paddingLeft: 10, 
        paddingRight: 10
    },
    v3_footer_container: { 
        position: 'absolute',
        right: 0,
        left: 0,
        flexDirection:'row',
        backgroundColor:'transparent',
        height: 70,
        paddingTop: 10,
        paddingLeft: 10,
        paddingRight: 10
    },    
    radius_full: {
        borderRadius: 4
    },    
    radius_left: {
        borderTopLeftRadius: 4,
        borderBottomLeftRadius: 4,        
        borderTopRightRadius: 0,
        borderBottomRightRadius: 0
    },
    radius_right: {
        borderTopLeftRadius: 0,
        borderBottomLeftRadius: 0,        
        borderTopRightRadius: 4,
        borderBottomRightRadius: 4
    },
    radius_top: {
        borderTopLeftRadius: 4,
        borderBottomLeftRadius: 0,        
        borderTopRightRadius: 4,
        borderBottomRightRadius: 0
    }, 
    radius_bottom: {
        borderTopLeftRadius: 0,
        borderBottomLeftRadius: 4,        
        borderTopRightRadius: 0,
        borderBottomRightRadius: 4
    },    
    form_container: {
        marginTop: 10,
        marginBottom: 10,
        marginLeft: 5,
        marginRight: 5
    },
    form_header: {
        flex: 1,
        flexDirection:'row',
        backgroundColor:'#e1e1e1',
        height: 50,
        alignItems: 'center',
        justifyContent: 'center'
    },
    v3_form_header: {
        flex: 1,
        flexDirection: 'row',
        backgroundColor: '#e1e1e1',
        height: 50,
        alignItems: 'center',
        justifyContent: 'center'
    },   
    v3_form_header_text: {
        fontSize: 20,
        fontWeight: 'bold',
        backgroundColor: 'transparent',
        color: '#000000',
    },
    form_header_button:{
        width: 40,
        height: 40,
        borderRadius: 4,
        margin: 5,
        flexDirection:'row',
        alignItems:'center',
        justifyContent:'center',
        backgroundColor: '#eeeeee',
    },
    form_header_button_image: {
        width: 20, 
        height: 20,
    },
    v3_form_panel: {
        backgroundColor: '#eeeeee',
        marginTop: 2,
        paddingTop: 10,
        paddingBottom: 10,
        paddingLeft: 8,
        paddingRight: 8
    },
    form_button:{
        height: 40,
        borderRadius: 4,
        backgroundColor: '#4169E1',
        flexDirection:'row',
        alignItems:'center',
        justifyContent:'center'
    },
    form_button_text: {
        flex: 1, 
        textAlign: 'center', 
        color: '#ffffff',
        fontWeight: 'bold'
    },
    form_button_right: {
        width: 36,
        height: 40,       
        borderTopRightRadius: 2,
        borderBottomRightRadius: 2,
        backgroundColor: '#4169E1',
        flexDirection:'row',
        alignItems:'center',
        justifyContent:'center'
    },
    modern_form_button:{
        width: 40,
        height: 40,
        borderRadius: 4,
        backgroundColor: '#e1e1e1',
        flexDirection:'row',
        alignItems:'center',
        justifyContent:'center'
    },
    v2_form_button:{
        width: 40,
        height: 40,
        backgroundColor: '#e9e9e9',
        flexDirection:'row',
        alignItems:'center',
        justifyContent:'center'
    },
    keyboard_button: {
        backgroundColor: '#474747', 
        borderRadius: 4, 
        margin: 3,
        shadowColor: '#000000',
        shadowOffset: {
            width: 0,
            height: 1
        },
        shadowRadius: 1,
        shadowOpacity: .5
    },
    keyboard_button_text: {
        flex:1, 
        textAlign: 'center', 
        fontWeight: 'bold', 
        color: '#ffffff'
    },
    v3_form_button: {
        width: 40,
        height: 40,
        backgroundColor: '#fefefe',
        flexDirection:'row',
        alignItems:'center',
        justifyContent:'center'
    },
    form_button_image: {
        width: 20, 
        height: 20
    },
    icon_40: {
        height: 20,
        width: 20,
        margin: 10
    },
    form_delete_button:{
        height: 40,
        borderRadius: 4,
        backgroundColor: '#bf381a',
        flexDirection:'row',
        alignItems:'center',
        justifyContent:'center'
    },
    v3_checkbox: {
        width: 26, 
        height: 26, 
        borderRadius: 4, 
        borderColor: '#8DA5ED', //Faded blue - #8DA5ED
        borderWidth: 2,
    },     
    form_row: {
        flex: 1,
        height: 48,
        alignItems: 'center',
        flexDirection:'row'
    },
    v3_form_textbox_container: {
        flex: 1,
        flexDirection: 'row',
        height: 40,
        backgroundColor: '#fefefe'
    },
    v3_form_textbox_input: {
        flex: 1,
        height: 40,
        backgroundColor: 'transparent',
        color: '#000000', //Do not delete otherwise dark mode shows as white text on white background
        fontWeight: 'bold',
        paddingTop: 10,
        paddingBottom: 10,
        paddingLeft: 6,
        paddingRight: 6,
        borderWidth: 0,
        borderRadius: 4
    },
    v3_textbox_text: {
        flex: 1,
        lineHeight: 40,
        fontWeight: 'bold',
        fontSize: Platform.OS === 'ios' || Platform.OS === 'macos' ? 14 : 16, //Android text doesn't match text input
        paddingLeft: 6,
        paddingRight: 6,
        color: '#000000'
    },
});