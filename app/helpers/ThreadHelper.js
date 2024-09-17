module.exports = {
    Clone(Object_Value) {
        try {
            return {
                ThreadID: Object_Value !== null && Object_Value.hasOwnProperty('ThreadID') && Object_Value.ThreadID !== null ? Object_Value.ThreadID : null,
                ThreadPerson: Object_Value !== null && Object_Value.hasOwnProperty('ThreadPerson') && Object_Value.ThreadPerson !== null ? Object_Value.ThreadPerson : null,
                ThreadStatus: Object_Value !== null && Object_Value.hasOwnProperty('ThreadStatus') && Object_Value.ThreadStatus !== null ? Object_Value.ThreadStatus : null,
                ThreadActivity: Object_Value !== null && Object_Value.hasOwnProperty('ThreadActivity') && Object_Value.ThreadActivity !== null ? Object_Value.ThreadActivity : null,
                ThreadCreated: Object_Value !== null && Object_Value.hasOwnProperty('ThreadCreated') && Object_Value.ThreadCreated !== null ? Object_Value.ThreadCreated : null,
                ThreadUpdated: Object_Value !== null && Object_Value.hasOwnProperty('ThreadUpdated') && Object_Value.ThreadUpdated !== null ? Object_Value.ThreadUpdated : null,
                ThreadPersonList: (Object_Value !== null && Object_Value.hasOwnProperty('ThreadPersonList') && Object_Value.ThreadPersonList !== null ? JSON.parse(JSON.stringify(Object_Value.ThreadPersonList)) : []),
            };
        } catch (ex) {
            throw Error('ThreadHelper.Clone>>' + ex.message);
        }
    },
    async GetCount(Params_Value){
        try {
            let _Response = await Global.FetchCore({ Action: 'v1/thread/count', Method: 'POST', Body: Params_Value});
            if (!_Response.ok) {
                throw Error(await _Response.text());
            } else {
                return await _Response.json();
            }
        } catch (ex) {
            throw Error('ThreadHelper.GetCount>>' + ex.message);
        }
    },    
    async GetList(Params_Value){
        try {
            let _Response = await Global.FetchCore({ Action: 'v1/thread/list', Method: 'POST', Body: Params_Value});
            if (!_Response.ok) {
                throw Error(await _Response.text());
            } else {
                return await _Response.json();
            }
        } catch (ex) {
            throw Error('ThreadHelper.GetList>>' + ex.message);
        }
    },
    async GetOne(Params_Value){
        try {
            let _Response = await Global.FetchCore({ Action: 'v1/thread/get', Method: 'POST', Body: Params_Value});
            if (!_Response.ok) { 
                throw Error(await _Response.text());
            } else {
                return await _Response.json();
            }
        } catch (ex) {
            throw Error('ThreadHelper.GetOne>>' + ex.message);
        }    
    },
    async Save(Params_Value) {
        try {
            let _Response = await Global.FetchCore({ Action: 'v1/thread/save', Method: 'POST', Body: Params_Value});
            if (!_Response.ok) { 
                throw Error(await _Response.text());
             } else {
                return await _Response.json();
            } 
        } catch (ex) {
            throw Error('ThreadHelper.Save>>' + ex.message);
        }
    },
    async Suggest(Params_Value) {
        try {
            let _Response = await Global.FetchCore({ Action: 'v1/thread/suggest', Method: 'POST', Body: Params_Value});
            if (!_Response.ok) { 
                throw Error(await _Response.text());
             } else {
                let _Suggestion = await _Response.text();
                return _Suggestion.replace(/【.*?】/g, "");
            } 
        } catch (ex) {
            throw Error('ThreadHelper.Suggest>>' + ex.message);
        }
    },    
    async Archive(Params_Value) {
        try {
            try {
                let _Response = await Global.FetchCore({ Action: 'v1/thread/archive', Method: 'POST', Body: Params_Value});
                if (!_Response.ok) {
                    throw Error(await _Response.text());
                } else {
                    return true;
                }
            } catch (ex) {
                throw ex;
            }   
        } catch (ex) {
            throw ex;
        }
    },
    async Delete(Params_Value) {
        try {
            try {
                let _Response = await Global.FetchCore({ Action: 'v1/thread/delete', Method: 'POST', Body: Params_Value});
                if (!_Response.ok) {
                    throw Error(await _Response.text());
                } else {
                    return true;
                }
            } catch (ex) {
                throw ex;
            }   
        } catch (ex) {
            throw ex;
        }
    },
};