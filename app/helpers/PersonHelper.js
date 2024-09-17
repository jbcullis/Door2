module.exports = {
    async GetCount(Params_Value){
        try {
            let _Response = await Global.FetchCore({ Action: 'v1/person/count', Method: 'POST', Body: Params_Value});
            if (!_Response.ok) { 
                throw Error(await _Response.text());
            } else {
                return await _Response.json();
            }
        } catch (ex) {
            throw ex;
        }
    },
    async GetList(Params_Value) {
        try {
            let _Response = await Global.FetchCore({ Action: 'v1/person/list', Method: 'POST', Body: Params_Value});
            if (!_Response.ok) { 
                throw Error(await _Response.text());
            } else {
                return await _Response.json();
            }
        } catch (ex) {
            throw Error('PersonHelper.GetList>>' + ex.message);
        }
    },
    async GetOne(Params_Value){
        try {
            let _Response = await Global.FetchCore({ Action: 'v1/person/get', Method: 'POST', Body: Params_Value});
            if (!_Response.ok) { 
                throw Error(await _Response.text());
            } else {
                return await _Response.json();
            }
        } catch(ex) {
            throw Error('PersonHelper.GetOne>>' + ex.message);
        }       
    },
    async Save(Params_Value) {
        try {
            let _Response = await Global.FetchCore({ Action: 'v1/person/save', Method: 'POST', Body: Params_Value});
            if (!_Response.ok) { 
                throw Error(await _Response.text());
            } else {
                return await _Response.json();
            }
        } catch(ex) {
            throw Error('PersonHelper.Save>>' + ex.message);
        }
    },
    async Delete(Params_Value) {
        try {
            let _Response = await Global.FetchCore({ Action: 'v1/person/delete', Method: 'POST', Body: Params_Value});
            if (!_Response.ok) { 
                throw Error(await _Response.text());
            } else {
                return true;
            }
        } catch(ex) {
            throw Error('PersonHelper.Delete>>' + ex.message);
        }
    }, 
};