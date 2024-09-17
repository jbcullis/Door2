module.exports = {
    Clone(Object_Value) {
        try {
            return {
                ThreadMessageID: Object_Value !== null && Object_Value.hasOwnProperty('ThreadMessageID') && Object_Value.ThreadMessageID !== null ? Object_Value.ThreadMessageID : null,
                ThreadMessagePersonID: Object_Value !== null && Object_Value.hasOwnProperty('ThreadMessagePersonID') && Object_Value.ThreadMessagePersonID !== null ? Object_Value.ThreadMessagePersonID : null,
                ThreadMessageText: Object_Value !== null && Object_Value.hasOwnProperty('ThreadMessageText') && Object_Value.ThreadMessageText !== null ? Object_Value.ThreadMessageText : null,
                ThreadMessageStatus: Object_Value !== null && Object_Value.hasOwnProperty('ThreadMessageStatus') && Object_Value.ThreadMessageStatus !== null ? Object_Value.ThreadMessageStatus : null,
                ThreadMessageCreated: Object_Value !== null && Object_Value.hasOwnProperty('ThreadMessageCreated') && Object_Value.ThreadMessageCreated !== null ? Object_Value.ThreadMessageCreated : null,
                ThreadMessageUpdated: Object_Value !== null && Object_Value.hasOwnProperty('ThreadMessageUpdated') && Object_Value.ThreadMessageUpdated !== null ? Object_Value.ThreadMessageUpdated : null,
            };
        } catch (ex) {
            throw Error('TheadMessageHelper.Clone>>' + ex.message);
        }
    },
    async GetCount(Params_Value){
        try {
            let _Response = await Global.FetchCore({ Action: 'v1/threadmessage/count', Method: 'POST', Body: Params_Value});
            if (!_Response.ok) { 
                throw Error(await _Response.text());
            } else {
                return await _Response.json();
            }
        } catch (ex) {
            throw Error('ThreadMessageHelper.GetCount>>' + ex.message);
        }
    },
    async GetList(Params_Value){
        try {
            let _Response = await Global.FetchCore({ Action: 'v1/threadmessage/list', Method: 'POST', Body: Params_Value});
            if (!_Response.ok) { 
                throw Error(await _Response.text());
            } else {
                return await _Response.json();
            }
        } catch (ex) {
            throw Error('ThreadMessageHelper.GetList>>' + ex.message);
        }
    },
};