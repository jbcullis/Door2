module.exports = {
    Clone(Object_Value) {
        try {
            return {
                KnowledgeID: Object_Value !== null && Object_Value.hasOwnProperty('KnowledgeID') && Object_Value.KnowledgeID !== null ? Object_Value.KnowledgeID : null,
                KnowledgeQuestion: Object_Value !== null && Object_Value.hasOwnProperty('KnowledgeQuestion') && Object_Value.KnowledgeQuestion !== null ? Object_Value.KnowledgeQuestion : null,
                KnowledgeAnswer: Object_Value !== null && Object_Value.hasOwnProperty('KnowledgeAnswer') && Object_Value.KnowledgeAnswer !== null ? Object_Value.KnowledgeAnswer : null,
                KnowledgeCreated: Object_Value !== null && Object_Value.hasOwnProperty('KnowledgeCreated') && Object_Value.KnowledgeCreated !== null ? Object_Value.KnowledgeCreated : null,
                KnowledgeUpdated: Object_Value !== null && Object_Value.hasOwnProperty('KnowledgeUpdated') && Object_Value.KnowledgeUpdated !== null ? Object_Value.KnowledgeUpdated : null,
            };
        } catch (ex) {
            throw Error('KnowledgeHelper.Clone>>' + ex.message);
        }
    },
    async GetCount(Params_Value){
        try {
            let _Response = await Global.FetchCore({ Action: 'v1/knowledge/count', Method: 'POST', Body: Params_Value});
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
            let _Response = await Global.FetchCore({ Action: 'v1/knowledge/list', Method: 'POST', Body: Params_Value});
            if (!_Response.ok) { 
                throw Error(await _Response.text());
            } else {
                return await _Response.json();
            }
        } catch (ex) {
            throw Error('KnowledgeHelper.GetList>>' + ex.message);
        }
    },
    async GetOne(Params_Value){
        try {
            let _Response = await Global.FetchCore({ Action: 'v1/knowledge/get', Method: 'POST', Body: Params_Value});
            if (!_Response.ok) { 
                throw Error(await _Response.text());
            } else {
                return KnowledgeHelper.Clone(await _Response.json());
            }
        } catch(ex) {
            throw Error('KnowledgeHelper.GetOne>>' + ex.message);
        }       
    },
    async Save(Params_Value) {
        try {
            let _Response = await Global.FetchCore({ Action: 'v1/knowledge/save', Method: 'POST', Body: Params_Value});
            if (!_Response.ok) {
                throw Error(await _Response.text());
            } else {
                return await _Response.json();
            }
        } catch(ex) {
            throw Error('KnowledgeHelper.Save>>' + ex.message);
        }
    },
    async Publish() {
        try {
            let _Response = await Global.FetchCore({ Action: 'v1/knowledge/publish', Method: 'POST'});
            if (!_Response.ok) {
                throw Error(await _Response.text());
            }
        } catch(ex) {
            throw Error('KnowledgeHelper.Publish>>' + ex.message);
        }
    },    
    async Delete(Params_Value) {
        try {
            let _Response = await Global.FetchCore({ Action: 'v1/knowledge/delete', Method: 'POST', Body: Params_Value});
            if (!_Response.ok) {
                throw Error(await _Response.text());
            } else {
                return true;
            }
        } catch(ex) {
            throw Error('KnowledgeHelper.Delete>>' + ex.message);
        }
    },
};