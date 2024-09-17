module.exports = {
    Clone(Object_Value) {
        try {
            return {
                PersonDeviceID: Object_Value !== null && Object_Value.hasOwnProperty('PersonDeviceID') && Object_Value.PersonDeviceID !== null ? Object_Value.PersonDeviceID : null,
                PersonDeviceName: Object_Value !== null && Object_Value.hasOwnProperty('PersonDeviceName') && Object_Value.PersonDeviceName !== null ? Object_Value.PersonDeviceName : null,
                PersonDeviceOS: Object_Value !== null && Object_Value.hasOwnProperty('PersonDeviceOS') && Object_Value.PersonDeviceOS !== null ? Object_Value.PersonDeviceOS : null,
                PersonDeviceActivity: Object_Value !== null && Object_Value.hasOwnProperty('PersonDeviceActivity') && Object_Value.PersonDeviceActivity !== null ? Object_Value.PersonDeviceActivity : null,
                PersonDeviceCreated: Object_Value !== null && Object_Value.hasOwnProperty('PersonDeviceCreated') && Object_Value.PersonDeviceCreated !== null ? Object_Value.PersonDeviceCreated : null,
                PersonDeviceUpdated: Object_Value !== null && Object_Value.hasOwnProperty('PersonDeviceUpdated') && Object_Value.PersonDeviceUpdated !== null ? Object_Value.PersonDeviceUpdated : null,
            };
        } catch (ex) {
            throw Error('PersonDeviceHelper.Clone>>' + ex.message);
        }
    },
    async GetCount(Params_Value){
        try {
            let _Response = await Global.FetchCore({ Action: 'v1/persondevice/count', Method: 'POST', Body: Params_Value});
            if (!_Response.ok) { 
                throw Error(await _Response.text());
            } else {
                return await _Response.json();
            }
        } catch(ex) {
            throw ex;
        }
    },
    async GetList(Params_Value){
        try {
            let _Response = await Global.FetchCore({ Action: 'v1/persondevice/list', Method: 'POST', Body: Params_Value});
            if (!_Response.ok) { 
                throw Error(await _Response.text());
            } else {
                return await _Response.json();
            }
        } catch(ex) {
            throw ex;
        }
    },
    async GetOne(Params_Value){
        try {
            let _Response = await Global.FetchCore({ Action: 'v1/persondevice/get', Method: 'POST', Body: Params_Value});
            if (!_Response.ok) { 
                throw Error(await _Response.text());
            } else {
                return await _Response.json();
            }
        } catch(ex) {
            throw ex;
        }
    },
    async Save(Params_Value) {
        try {
            let _Response = await Global.FetchCore({ Action: 'v1/persondevice/save', Method: 'POST', Body: Params_Value});
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
            let _Response = await Global.FetchCore({ Action: 'v1/persondevice/delete', Method: 'POST', Body: Params_Value});
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