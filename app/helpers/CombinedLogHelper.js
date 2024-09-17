module.exports = {
    async GetCount(Params_Value) {
        try {
            let _Response = await Global.FetchCore({ Action: 'v1/combinedlog/count', Method: 'POST', Body: Params_Value});
            if (!_Response.ok) { 
                throw Error(await _Response.text());
            } else {
                return await _Response.json();
            }
        } catch (ex) {
            throw Error('CombinedLogHelper.GetCount>>' + ex.message);
        }
    },    
    async GetList(Params_Value) {
        try {
            let _Response = await Global.FetchCore({ Action: 'v1/combinedlog/list', Method: 'POST', Body: Params_Value});
            if (!_Response.ok) { 
                throw Error(await _Response.text());
            } else {
                return await _Response.json();
            }
        } catch (ex) {
            throw Error('CombinedLogHelper.GetList>>' + ex.message);
        }
    },
};