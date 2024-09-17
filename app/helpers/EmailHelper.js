module.exports = {
    async Format(Params_Value) {
        try {
            let _Response = await Global.FetchCore({ Action: 'v1/email/format?uri=' + Params_Value.Uri, Method: 'GET'});
            if (!_Response.ok) { 
                throw Error(await _Response.text());
            } else {
                return await _Response.text();
            }
        } catch(ex) {
            throw Error('EmailHelper.Format>>' + ex.message);
        }
    },
    async Send(Params_Value) {
        try {
            let _Response = await Global.FetchCore({ Action: 'v1/email/send', Method: 'POST', Body: Params_Value});
            if (!_Response.ok) { 
                throw Error(await _Response.text());
            } else {
                return await _Response.json();
            }
        } catch(ex) {
            throw Error('EmailHelper.Send>>' + ex.message);
        }
    },
};