module.exports = {
    Clone(Object_Value) {
        try {
            return {
                TicketID: Object_Value !== null && Object_Value.hasOwnProperty('TicketID') && Object_Value.TicketID !== null ? Object_Value.TicketID : null,
                TicketType: Object_Value !== null && Object_Value.hasOwnProperty('TicketType') && Object_Value.TicketType !== null ? Object_Value.TicketType : null,
                TicketMajorVersion: Object_Value !== null && Object_Value.hasOwnProperty('TicketMajorVersion') && Object_Value.TicketMajorVersion !== null ? Object_Value.TicketMajorVersion : 0,
                TicketMinorVersion: Object_Value !== null && Object_Value.hasOwnProperty('TicketMinorVersion') && Object_Value.TicketMinorVersion !== null ? Object_Value.TicketMinorVersion : 0,
                TicketPatchVersion: Object_Value !== null && Object_Value.hasOwnProperty('TicketPatchVersion') && Object_Value.TicketPatchVersion !== null ? Object_Value.TicketPatchVersion : 0,
                TicketDescription: Object_Value !== null && Object_Value.hasOwnProperty('TicketDescription') && Object_Value.TicketDescription !== null ? Object_Value.TicketDescription : null,
                TicketTarget: Object_Value !== null && Object_Value.hasOwnProperty('TicketTarget') && Object_Value.TicketTarget !== null ? Object_Value.TicketTarget : null,
                TicketWebhook: Object_Value !== null && Object_Value.hasOwnProperty('TicketWebhook') && Object_Value.TicketWebhook !== null ? Object_Value.TicketWebhook : null,
                TicketTrigger: Object_Value !== null && Object_Value.hasOwnProperty('TicketTrigger') && Object_Value.TicketTrigger !== null ? Object_Value.TicketTrigger : null,
                TicketLogCount: Object_Value !== null && Object_Value.hasOwnProperty('TicketLogCount') && Object_Value.TicketLogCount !== null ? Object_Value.TicketLogCount : null,
                TicketMessageCount: Object_Value !== null && Object_Value.hasOwnProperty('TicketMessageCount') && Object_Value.TicketMessageCount !== null ? Object_Value.TicketMessageCount : null,
                TicketStatus: Object_Value !== null && Object_Value.hasOwnProperty('TicketStatus') && Object_Value.TicketStatus !== null ? Object_Value.TicketStatus : null,
                TicketActivity: Object_Value !== null && Object_Value.hasOwnProperty('TicketActivity') && Object_Value.TicketActivity !== null ? Object_Value.TicketActivity : null,
                TicketCreated: Object_Value !== null && Object_Value.hasOwnProperty('TicketCreated') && Object_Value.TicketCreated !== null ? Object_Value.TicketCreated : null,
                TicketUpdated: Object_Value !== null && Object_Value.hasOwnProperty('TicketUpdated') && Object_Value.TicketUpdated !== null ? Object_Value.TicketUpdated : null,
            };
        } catch (ex) {
            throw Error('TicketHelper.GetList>>' + ex.message);
        }
    },
    async GetCount(Params_Value) {
        try {
            let _Response = await Global.FetchCore({ Action: 'v1/ticket/count', Method: 'POST', Body: Params_Value});
            if (!_Response.ok) { 
                throw Error(await _Response.text());
            } else {
                return await _Response.json();
            }
        } catch (ex) {
            throw Error('TicketHelper.GetList>>' + ex.message);
        }
    },
    async GetList(Params_Value) {
        try {
            let _Response = await Global.FetchCore({ Action: 'v1/ticket/list', Method: 'POST', Body: Params_Value});
            if (!_Response.ok) { 
                throw Error(await _Response.text());
            } else {
                return await _Response.json();
            }
        } catch (ex) {
            throw Error('TicketHelper.GetList>>' + ex.message);
        }
    },
    async GetOne(Params_Value) {
        try {
            let _Response = await Global.FetchCore({ Action: 'v1/ticket/get', Method: 'POST', Body: Params_Value});
            if (!_Response.ok) { 
                throw Error(await _Response.text());
            } else {
                return await _Response.json();
            }
        } catch (ex) {
            throw Error('TicketHelper.GetList>>' + ex.message);
        }
    },    
    async Save(Params_Value) {
        try {
            let _Response = await Global.FetchCore({ Action: 'v1/ticket/save', Method: 'POST', Body: Params_Value});
            if (!_Response.ok) { 
                throw Error(await _Response.text());
            } else {
                return TicketHelper.Clone(await _Response.json());
            }
        } catch (ex) {
            throw Error('TicketHelper.Save>>' + ex.message);
        }
    },
    async Delete(Params_Value) {
        try {
            let _Response = await Global.FetchCore({ Action: 'v1/ticket/delete', Method: 'POST', Body: Params_Value});
            if (!_Response.ok) { 
                throw Error(await _Response.text());
            } else {
                return true;
            }
        } catch (ex) {
            throw Error('TicketHelper.Delete>>' + ex.message);
        }
    },
};