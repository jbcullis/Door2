module.exports = {
    Clone(Object_Value) {
        try {
            return {
                AccountID: Object_Value !== null && Object_Value.hasOwnProperty('AccountID') && Object_Value.AccountID !== null ? Object_Value.AccountID : null,
                AccountPersonID: Object_Value !== null && Object_Value.hasOwnProperty('AccountPersonID') && Object_Value.AccountPersonID !== null ? Object_Value.AccountPersonID : null,
                AccountPersonRoles: Object_Value !== null && Object_Value.hasOwnProperty('AccountPersonRoles') && Object_Value.AccountPersonRoles !== null ? Object_Value.AccountPersonRoles : null,
                AccountPersonActivity: Object_Value !== null && Object_Value.hasOwnProperty('AccountPersonActivity') && Object_Value.AccountPersonActivity !== null ? Object_Value.AccountPersonActivity : null,
                AccountPersonCreated: Object_Value !== null && Object_Value.hasOwnProperty('AccountPersonCreated') && Object_Value.AccountPersonCreated !== null ? Object_Value.AccountPersonCreated : null,
                AccountPersonUpdated: Object_Value !== null && Object_Value.hasOwnProperty('AccountPersonUpdated') && Object_Value.AccountPersonUpdated !== null ? Object_Value.AccountPersonUpdated : null,
            };
        } catch (ex) {
            throw Error('AccountPersonHelper.Clone>>' + ex.message);
        }
    },
    async GetCount(Params_Value){
        try {
            let _Response = await Global.FetchCore({ Action: 'v1/accountperson/count', Method: 'POST', Body: Params_Value});
            if (!_Response.ok) { 
                throw Error(await _Response.text());
            } else {
                return await _Response.json();
            }
        } catch (ex) {
            throw ex;
        }
    },
    async GetList(Params_Value){
        try {
            let _Response = await Global.FetchCore({ Action: 'v1/accountperson/list', Method: 'POST', Body: Params_Value});
            if (!_Response.ok) { 
                throw Error(await _Response.text());
            } else {
                return await _Response.json();
            }
        } catch (ex) {
            throw ex;
        }
    },
    async GetOne(Params_Value){
        try {
            let _Response = await Global.FetchCore({ Action: 'v1/accountperson/get', Method: 'POST', Body: Params_Value});
            if (!_Response.ok) { 
                throw Error(await _Response.text());
            } else {
                return await _Response.json();
            }
        } catch (ex) {
            throw ex;
        }    
    },
    async Save(Params_Value) {
        try {
            let _Response = await Global.FetchCore({ Action: 'v1/accountperson/save', Method: 'POST', Body: Params_Value});
            if (!_Response.ok) { 
                throw Error(await _Response.text());
            } else {
                return true;
            } 
        } catch (ex) {
            throw ex;
        }
    },
    async Delete(Params_Value) {
        try {
            let _Response = await Global.FetchCore({ Action: 'v1/accountperson/delete', Method: 'POST', Body: Params_Value});
            if (!_Response.ok) { 
                throw Error(await _Response.text());
            } else {
                return true;
            }
        } catch (ex) {
            throw ex;
        } 
    },
};