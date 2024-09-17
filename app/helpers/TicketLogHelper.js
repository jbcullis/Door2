module.exports = {
    Clone(Object_Value) {
        return {
            TicketLogID: Object_Value !== null && Object_Value.hasOwnProperty('TicketLogID') && Object_Value.TicketLogID !== null ? Object_Value.TicketLogID : null,
            TicketLogIP: Object_Value !== null && Object_Value.hasOwnProperty('TicketLogIP') && Object_Value.TicketLogIP !== null ? Object_Value.TicketLogIP : null,
            TicketLogOS: Object_Value !== null && Object_Value.hasOwnProperty('TicketLogOS') && Object_Value.TicketLogOS !== null ? Object_Value.TicketLogOS : null,
            TicketLogOSV: Object_Value !== null && Object_Value.hasOwnProperty('TicketLogOSV') && Object_Value.TicketLogOSV !== null ? Object_Value.TicketLogOSV : null,
            TicketLogEnvironment: Object_Value !== null && Object_Value.hasOwnProperty('TicketLogEnvironment') && Object_Value.TicketLogEnvironment !== null ? Object_Value.TicketLogEnvironment : null,
            TicketLogMajorVersion: Object_Value !== null && Object_Value.hasOwnProperty('TicketLogMajorVersion') && Object_Value.TicketLogMajorVersion !== null ? Object_Value.TicketLogMajorVersion : null,
            TicketLogMinorVersion: Object_Value !== null && Object_Value.hasOwnProperty('TicketLogMinorVersion') && Object_Value.TicketLogMinorVersion !== null ? Object_Value.TicketLogMinorVersion : null,
            TicketLogPatchVersion: Object_Value !== null && Object_Value.hasOwnProperty('TicketLogPatchVersion') && Object_Value.TicketLogPatchVersion !== null ? Object_Value.TicketLogPatchVersion : null,
            TicketLogAccount: Object_Value !== null && Object_Value.hasOwnProperty('TicketLogAccount') && Object_Value.TicketLogAccount !== null ? Object_Value.TicketLogAccount : null,
            TicketLogPerson: Object_Value !== null && Object_Value.hasOwnProperty('TicketLogPerson') && Object_Value.TicketLogPerson !== null ? Object_Value.TicketLogPerson : null,
            TicketLogSession: Object_Value !== null && Object_Value.hasOwnProperty('TicketLogSession') && Object_Value.TicketLogSession !== null ? Object_Value.TicketLogSession : null,
            TicketLogTimestamp: Object_Value !== null && Object_Value.hasOwnProperty('TicketLogTimestamp') && Object_Value.TicketLogTimestamp !== null ? Object_Value.TicketLogTimestamp : null,
            TicketLogRetention: Object_Value !== null && Object_Value.hasOwnProperty('TicketLogRetention') && Object_Value.TicketLogRetention !== null ? Object_Value.TicketLogRetention : null,
            TicketLogTraceKey: Object_Value !== null && Object_Value.hasOwnProperty('TicketLogTraceKey') && Object_Value.TicketLogTraceKey !== null ? Object_Value.TicketLogTraceKey : null,
            TicketLogTraceList: Object_Value !== null && Object_Value.hasOwnProperty('TicketLogTraceList') && Object_Value.TicketLogTraceList !== null ? Object_Value.TicketLogTraceList : [],
            TicketLogHasData: Object_Value !== null && Object_Value.hasOwnProperty('TicketLogHasData') && Object_Value.TicketLogHasData !== null ? Object_Value.TicketLogHasData : null,
        };
    },
    async GetData(Params_Value) {
        try {
            let _Response = await Global.FetchCore({ Action: 'v1/ticketlog/getdata', Method: 'POST', Body: Params_Value});
            if (!_Response.ok) { 
                throw Error(await _Response.text());
             } else {
                return await _Response.json();
            }
        } catch (ex) {
            throw Error('TicketLogHelper.GetData>>' + ex.message);
        }
    },
    async Geotag(ip) {
        try {
            let _Response = await Global.FetchCore({ Action: 'v1/ticketlog/geotag?ip=' + ip, Method: 'GET'});
            if (!_Response.ok) { 
                throw Error(await _Response.text());
            } else {
                return await _Response.text();
            }
        } catch (ex) {
            throw Error('TicketLogHelper.Geotag>>' + ex.message);
        }
    },
    async RunWebhook(Params_Value) {
        try {
            let _Response = await fetch(Params_Value.Url, {body: JSON.stringify(Params_Value.Packet), method: 'POST', headers: {
                'Content-Type': 'application/json',
                'authorization': 'bearer ' + Params_Value.SecretKey
            }});
            if (!_Response.ok) { 
                throw Error(await _Response.text());
            } else {
                return true;
            }
        } catch (ex) {
            throw Error('TicketLogHelper.RunWebhook>>' + ex.message);
        }
    },
    async Save(TicketID_Value, Params_Value) {
        try {
            let _Response = await Global.FetchCore({ Action: 'v1/ticketlog/save?TicketID_Value=' + TicketID_Value, Method: 'POST', Body: Params_Value});
            if (!_Response.ok) { 
                throw Error(await _Response.text());
            } else {
                return TicketLogHelper.Clone(await _Response.json());
            }
        } catch (ex) {
            throw Error('TicketHelper.Save>>' + ex.message);
        }
    },
    async Delete(Params_Value) {
        try {
            let _Response = await Global.FetchCore({ Action: 'v1/ticketlog/delete', Method: 'POST', Body: Params_Value});
            if (!_Response.ok) { 
                throw Error(await _Response.text());
            } else {
                return true;
            }
        } catch (ex) {
            throw Error('TicketLogHelper.Delete>>' + ex.message);
        }
    },
};