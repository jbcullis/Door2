import AsyncStorage from '@react-native-async-storage/async-storage';
module.exports = {
    Clone(Object_Value) {
        try {
            return {
                TokenID: Object_Value !== null && Object_Value.hasOwnProperty('TokenID') && Object_Value.TokenID !== null ? Object_Value.TokenID : null,
                TokenServiceID: Object_Value !== null && Object_Value.hasOwnProperty('TokenServiceID') && Object_Value.TokenServiceID !== null ? Object_Value.TokenServiceID : null,
                TokenAccountID: Object_Value !== null && Object_Value.hasOwnProperty('TokenAccountID') && Object_Value.TokenAccountID !== null ? Object_Value.TokenAccountID : null,
                TokenPersonID: Object_Value !== null && Object_Value.hasOwnProperty('TokenPersonID') && Object_Value.TokenPersonID !== null ? Object_Value.TokenPersonID : null,
                TokenPersonRoles: Object_Value !== null && Object_Value.hasOwnProperty('TokenPersonRoles') && Object_Value.TokenPersonRoles !== null ? Object_Value.TokenPersonRoles : null,
                TokenDeviceID: Object_Value !== null && Object_Value.hasOwnProperty('TokenDeviceID') && Object_Value.TokenDeviceID !== null ? Object_Value.TokenDeviceID : null,
                TokenReleaseID: Object_Value !== null && Object_Value.hasOwnProperty('TokenReleaseID') && Object_Value.TokenReleaseID !== null ? Object_Value.TokenReleaseID : null,
                TokenExpires: Object_Value !== null && Object_Value.hasOwnProperty('TokenExpires') && Object_Value.TokenExpires !== null ? Object_Value.TokenExpires : null,
                TokenCreated: Object_Value !== null && Object_Value.hasOwnProperty('TokenCreated') && Object_Value.TokenCreated !== null ? Object_Value.TokenCreated : null,
                TokenAccessed: Object_Value !== null && Object_Value.hasOwnProperty('TokenAccessed') && Object_Value.TokenAccessed !== null ? Object_Value.TokenAccessed : null,
            };
        } catch (ex) {
            throw Error('TokenHelper.Clone>>' + ex.message);
        }
    },
    async GetList(Params_Value){
        try {
            let _Response = await Global.FetchCore({ Action: 'v1/token/list', Method: 'POST', Body: Params_Value});
            if (!_Response.ok) { 
                throw Error(await _Response.text());
            } else {
                return await _Response.json();
            }
        } catch (ex) {
            throw Error('TokenHelper.GetList>>' + ex.message);
        }
    },
    async GetOne(Params_Value){
        try {
            let _Response = await Global.FetchCore({ Action: 'v1/token/get', Method: 'POST', Body: Params_Value});
            if (!_Response.ok) {
                throw Error(await _Response.text());
            } else {
                return await _Response.json();
            }
        } catch (ex) {
            throw Error('TokenHelper.GetOne>>' + ex.message);
        }
    },
    async Init(Params_Value) {
        try {
            let _Response = await Global.FetchCore({ Action: 'v1/token/init', Method: 'POST', Body: Params_Value});
            if (!_Response.ok) { 
                throw Error(await _Response.text());
            } else {
                Global.SetToken(await _Response.text());
            }
        } catch (ex) {
            throw Error('TokenHelper.Init>>' + ex.message);
        }
    },
    async Auth(Params_Value) {
        try {
            if (Global.StringHasContent(Params_Value.Code)) {
                let _Response = await Global.FetchCore({ Action: 'v1/token/auth', Method: 'POST', Body: Params_Value});
                if (!_Response.ok) { 
                    throw Error(await _Response.text());
                } else {
                    Global.SetToken(await _Response.text())
                    await AsyncStorage.setItem('@Token', Global.Token);
                }
            } else {
                throw Error('TokenHelper.Auth>>Login failed.');
            }
        } catch (ex) {
            throw Error('TokenHelper.Auth>>' + ex.message);
        }
    },
    async Refresh(Params_Value) {
        try {
            let _Response = await Global.FetchCore({ Action: 'v1/token/refresh', Method: 'POST', Body: Params_Value});
            if (!_Response.ok) {
                throw Error(await _Response.text());
            } else {
                Global.SetToken(await _Response.text());
                await AsyncStorage.setItem('@Token', Global.Token);
            }
        } catch(ex) {
            throw Error('TokenHelper.Refresh>>' + ex.message);
        }
    },    
    async Restore() {
        try {
            Global.SetToken(await AsyncStorage.getItem('@Token'));
        } catch(ex) {
            throw Error('TokenHelper.Restore>>' + ex.message);
        }
    },
    async Delete(Params_Value) {
        try {
            if (Global.Token != null) {
                let _Response = await Global.FetchCore({ Action: 'v1/token/delete', Method: 'POST', Body: Params_Value});
                if (!_Response.ok) { 
                    Global.SetToken(null);
                    await AsyncStorage.removeItem('@Token');
                } else {
                    if (Params_Value === null) {
                        Global.SetToken(null);
                        await AsyncStorage.removeItem('@Token');
                    }
                }
            }
        } catch(ex) {
            if (Params_Value == null) {
                Global.SetToken(null);
            }          
        }
    },
    async Create(Params_Value) {
        try {
            let _Response = await Global.FetchCore({ Action: 'v1/token/create', Method: 'POST', Body: Params_Value});
            if (!_Response.ok) { 
                throw Error(await _Response.text());
            } else {
                return await _Response.text();
            }
        } catch (ex) {
            throw Error('TokenHelper.Create>>' + ex.message);
        }
    },
};