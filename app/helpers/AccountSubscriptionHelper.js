module.exports = {
    Clone(Object_Value) {
        try {
            return {
                AccountSubscriptionID: Object_Value?.hasOwnProperty('AccountSubscriptionID') && Object_Value.AccountSubscriptionID !== null ? Object_Value.AccountSubscriptionID : null,
                AccountSubscriptionProductID: Object_Value?.hasOwnProperty('AccountSubscriptionProductID') && Object_Value.AccountSubscriptionProductID !== null ? Object_Value.AccountSubscriptionProductID : null,
                AccountSubscriptionProductName: Object_Value?.hasOwnProperty('AccountSubscriptionProductName') && Object_Value.AccountSubscriptionProductName !== null ? Object_Value.AccountSubscriptionProductName : null,
                AccountSubscriptionExpiry: Object_Value?.hasOwnProperty('AccountSubscriptionExpiry') && Object_Value.AccountSubscriptionExpiry !== null ? Object_Value.AccountSubscriptionExpiry : null,
                AccountSubscriptionCreated: Object_Value?.hasOwnProperty('AccountSubscriptionCreated') && Object_Value.AccountSubscriptionCreated !== null ? Object_Value.AccountSubscriptionCreated : null,
                AccountSubscriptionUpdated: Object_Value?.hasOwnProperty('AccountSubscriptionUpdated') && Object_Value.AccountSubscriptionUpdated !== null ? Object_Value.AccountSubscriptionUpdated : null,
            };
        } catch (ex) {
            throw Error('AccountSubscriptionHelper.Clone>>' + ex.message);
        }
    },
    async GetList(Params_Value){
        try {
            let _Response = await Global.FetchCore({ Action: 'v1/accountsubscription/list', Method: 'POST', Body: Params_Value});
            if (!_Response.ok) { 
                throw Error(await _Response.text());
            } else {
                return await _Response.json();
            }
        } catch (ex) {
            throw Error('AccountSubscriptionHelper.GetList>>' + ex.message);
        }
    },
    async GetOne(Params_Value){
        try {
            let _Response = await Global.FetchCore({ Action: 'v1/accountsubscription/get', Method: 'POST', Body: Params_Value});
            if (!_Response.ok) { 
                throw Error(await _Response.text());
            } else {
                return await _Response.json();
            }
        } catch (ex) {
            throw Error('AccountSubscriptionHelper.GetOne>>' + ex.message);
        }
    },
    async Save(Params_Value) {
        try {
            let _Response = await Global.FetchCore({ Action: 'v1/accountsubscription/save', Method: 'POST', Body: Params_Value});
            if (!_Response.ok) { 
                throw Error(await _Response.text());
             } else {
                return await _Response.json();
            } 
        } catch (ex) {
            throw Error('AccountSubscriptionHelper.Save>>' + ex.message);
        }
    },
    async Delete(Params_Value) {
        try {
            let _Response = await Global.FetchCore({ Action: 'v1/accountsubscription/delete', Method: 'POST', Body: Params_Value});
            if (!_Response.ok) {
                throw Error(await _Response.text());
             } else {
                return true;
            }
        } catch (ex) {
            throw Error('AccountSubscriptionHelper.Delete>>' + ex.message);
        }
    },    
};