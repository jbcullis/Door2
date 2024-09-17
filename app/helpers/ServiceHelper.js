module.exports = {
    Clone(Object_Value) {
        return {
            ServiceID: Object_Value !== null && Object_Value.hasOwnProperty('ServiceID') && Object_Value.ServiceID !== null ? Object_Value.ServiceID : null,
            ServiceName: Object_Value !== null && Object_Value.hasOwnProperty('ServiceName') && Object_Value.ServiceName !== null ? Object_Value.ServiceName : null,
            ServiceDomain: Object_Value !== null && Object_Value.hasOwnProperty('ServiceDomain') && Object_Value.ServiceDomain !== null ? Object_Value.ServiceDomain : null,
            ServiceEmail: Object_Value !== null && Object_Value.hasOwnProperty('ServiceEmail') && Object_Value.ServiceEmail !== null ? Object_Value.ServiceEmail : null,
            ServiceSequence: Object_Value !== null && Object_Value.hasOwnProperty('ServiceSequence') && Object_Value.ServiceSequence !== null ? parseInt(Object_Value.ServiceSequence) : 0,
            ServiceSecret: Object_Value !== null && Object_Value.hasOwnProperty('ServiceSecret') && Object_Value.ServiceSecret !== null ? Object_Value.ServiceSecret : null,
            ServiceWebhook: Object_Value !== null && Object_Value.hasOwnProperty('ServiceWebhook') && Object_Value.ServiceWebhook !== null ? Object_Value.ServiceWebhook : null,
            ServiceCreated: Object_Value !== null && Object_Value.hasOwnProperty('ServiceCreated') && Object_Value.ServiceCreated !== null ? Object_Value.ServiceCreated : null,
            ServiceUpdated: Object_Value !== null && Object_Value.hasOwnProperty('ServiceUpdated') && Object_Value.ServiceUpdated !== null ? Object_Value.ServiceUpdated : null,
        };
    },
    async GetList(Params_Value) {
        try {
            let _Response = await Global.FetchCore({ Action: 'v1/service/list', Method: 'POST', Body: Params_Value});
            if (!_Response.ok) { 
                throw Error(await _Response.text());
             } else {
                return await _Response.json();
            }
        } catch (ex) {
            throw Error('ServiceHelper.GetList>>' + ex.message);
        }
    },
    async GetOne() {
        try {
            let _Response = await Global.FetchCore({ Action: 'v1/service/get', Method: 'POST', Body: null});
            if (!_Response.ok) { 
                throw Error(await _Response.text());
            } else {
                return await _Response.json();
            }
        } catch (ex) {
            throw Error('ServiceHelper.GetOne>>' + ex.message);          
        }
    },    
    async Save(Params_Value) {
        try {
            let _Response = await Global.FetchCore({ Action: 'v1/service/save', Method: 'POST', Body: Params_Value});
            if (!_Response.ok) { 
                throw Error(await _Response.text());
            } else {
                return ServiceHelper.Clone(await _Response.json());
            }
        } catch (ex) {
            throw Error('ServiceHelper.Save>>' + ex.message);
        }
    },
    async Delete(Params_Value) {
        try {
            let _Response = await Global.FetchCore({ Action: 'v1/service/delete', Method: 'POST', Body: Params_Value});
            if (!_Response.ok) {
                throw Error(await _Response.text());
            } else {
                return true;
            }
        } catch (ex) {
            throw Error('ServiceHelper.Delete>>' + ex.message);
        }
    },
};