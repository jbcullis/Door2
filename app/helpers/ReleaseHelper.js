module.exports = {
    Clone(Object_Value) {
        try {
            return {
                ReleaseID: Object_Value !== null && Object_Value.hasOwnProperty('ReleaseID') && Object_Value.ReleaseID !== null ? Object_Value.ReleaseID : null,
                ReleaseStatus: Object_Value !== null && Object_Value.hasOwnProperty('ReleaseStatus') && Object_Value.ReleaseStatus !== null ? Object_Value.ReleaseStatus : null,
                ReleaseCreated: Object_Value !== null && Object_Value.hasOwnProperty('ReleaseCreated') && Object_Value.ReleaseCreated !== null ? Object_Value.ReleaseCreated : null,
                ReleaseUpdated: Object_Value !== null && Object_Value.hasOwnProperty('ReleaseUpdated') && Object_Value.ReleaseUpdated !== null ? Object_Value.ReleaseUpdated : null,
            };
        } catch (ex) {
            throw Error('ReleaseHelper.Clone>>' + ex.message);
        }
    },
    async GetCount(Params_Value){
        try {
            let _Response = await Global.FetchCore({ Action: 'v1/release/count', Method: 'POST', Body: Params_Value});
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
            let _Response = await Global.FetchCore({ Action: 'v1/release/list', Method: 'POST', Body: Params_Value});
            if (!_Response.ok) { 
                throw Error(await _Response.text());
            } else {
                return await _Response.json();
            }
        } catch (ex) {
            throw Error('ReleaseHelper.GetList>>' + ex.message);
        }
    },
    async GetOne(Params_Value){
        try {
            let _Response = await Global.FetchCore({ Action: 'v1/release/get', Method: 'POST', Body: Params_Value});
            if (!_Response.ok) { 
                throw Error(await _Response.text());
            } else {
                return ReleaseHelper.Clone(await _Response.json());
            }
        } catch(ex) {
            throw Error('ReleaseHelper.GetOne>>' + ex.message);
        }       
    },
    async Save(Params_Value) {
        try {
            let _Response = await Global.FetchCore({ Action: 'v1/release/save', Method: 'POST', Body: Params_Value});
            if (!_Response.ok) { 
                throw Error(await _Response.text());
            } else {
                return await _Response.json();
            }
        } catch(ex) {
            throw Error('ReleaseHelper.Save>>' + ex.message);
        }
    },
    async Delete(Params_Value) {
        try {
            let _Response = await Global.FetchCore({ Action: 'v1/release/delete', Method: 'POST', Body: Params_Value});
            if (!_Response.ok) { 
                throw Error(await _Response.text());
            } else {
                return true;
            }
        } catch(ex) {
            throw Error('ReleaseHelper.Delete>>' + ex.message);
        }
    },
};