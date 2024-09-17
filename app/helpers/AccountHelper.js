module.exports = {
    async GetCount(Params_Value){
        try {
            let _Response = await Global.FetchCore({ Action: 'v1/account/count', Method: 'POST', Body: Params_Value});
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
            let _Response = await Global.FetchCore({ Action: 'v1/account/list', Method: 'POST', Body: Params_Value});
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
            let _Response = await Global.FetchCore({ Action: 'v1/account/get', Method: 'POST', Body: Params_Value});
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
            let _Response = await Global.FetchCore({ Action: 'v1/account/save', Method: 'POST', Body: Params_Value});
            if (!_Response.ok) { 
                throw Error(await _Response.text());
             } else {
                return await _Response.json();
            } 
        } catch (ex) {
            throw ex;
        }
    },
    async Delete(Params_Value) {
        try {
            let _Response = await Global.FetchCore({ Action: 'v1/account/delete', Method: 'POST', Body: Params_Value});
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