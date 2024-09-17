module.exports = {
    Clone(Object_Value) {
        return {
            TransactionID: (Object_Value !== null && Object_Value.hasOwnProperty('TransactionID') && Object_Value.TransactionID !== null ? Object_Value.TransactionID : null),
            TransactionNumber: (Object_Value !== null && Object_Value.hasOwnProperty('TransactionNumber') && Object_Value.TransactionNumber !== null ? Object_Value.TransactionNumber : null),
            TransactionDate: (Object_Value !== null && Object_Value.hasOwnProperty('TransactionDate') && Object_Value.TransactionDate !== null ? Object_Value.TransactionDate : null),
            TransactionAccount: (Object_Value !== null && Object_Value.hasOwnProperty('TransactionAccount') && Object_Value.TransactionAccount !== null ? Object_Value.TransactionAccount : null),
            TransactionPerson: (Object_Value !== null && Object_Value.hasOwnProperty('TransactionPerson') && Object_Value.TransactionPerson !== null ? Object_Value.TransactionPerson : null),
            TransactionReference: (Object_Value !== null && Object_Value.hasOwnProperty('TransactionReference') && Object_Value.TransactionReference !== null ? Object_Value.TransactionReference : null), 
            TransactionSubtotal: (Object_Value !== null && Object_Value.hasOwnProperty('TransactionSubtotal') && Object_Value.TransactionSubtotal !== null ? Object_Value.TransactionSubtotal : 0),
            TransactionTax: (Object_Value !== null && Object_Value.hasOwnProperty('TransactionTax') && Object_Value.TransactionTax !== null ? Object_Value.TransactionTax : 0),
            TransactionTotal: (Object_Value !== null && Object_Value.hasOwnProperty('TransactionTotal') && Object_Value.TransactionTotal !== null ? Object_Value.TransactionTotal : 0),
            TransactionCurrency: (Object_Value !== null && Object_Value.hasOwnProperty('TransactionCurrency') && Object_Value.TransactionCurrency !== null ? Object_Value.TransactionCurrency : null),
            TransactionExchange: (Object_Value !== null && Object_Value.hasOwnProperty('TransactionExchange') && Object_Value.TransactionExchange !== null ? Object_Value.TransactionExchange : null),
            TransactionPaymentType: (Object_Value !== null && Object_Value.hasOwnProperty('TransactionPaymentType') && Object_Value.TransactionPaymentType !== null ? Object_Value.TransactionPaymentType : null),
            TransactionPaymentDate: (Object_Value !== null && Object_Value.hasOwnProperty('TransactionPaymentDate') && Object_Value.TransactionPaymentDate !== null ? Object_Value.TransactionPaymentDate : null),
            TransactionPaymentReference: (Object_Value !== null && Object_Value.hasOwnProperty('TransactionPaymentReference') && Object_Value.TransactionPaymentReference !== null ? Object_Value.TransactionPaymentReference : null),
            TransactionPaymentFee: (Object_Value !== null && Object_Value.hasOwnProperty('TransactionPaymentFee') && Object_Value.TransactionPaymentFee !== null ? Object_Value.TransactionPaymentFee : null),
            TransactionRefundDate: (Object_Value !== null && Object_Value.hasOwnProperty('TransactionRefundDate') && Object_Value.TransactionRefundDate !== null ? Object_Value.TransactionRefundDate : null),
            TransactionRefundReference: (Object_Value !== null && Object_Value.hasOwnProperty('TransactionRefundReference') && Object_Value.TransactionRefundReference !== null ? Object_Value.TransactionRefundReference : null),
            TransactionRefundAmount: (Object_Value !== null && Object_Value.hasOwnProperty('TransactionRefundAmount') && Object_Value.TransactionRefundAmount !== null ? Object_Value.TransactionRefundAmount : null),
            TransactionCreated: (Object_Value !== null && Object_Value.hasOwnProperty('TransactionCreated') && Object_Value.TransactionCreated !== null ? Object_Value.TransactionCreated : null),
            TransactionUpdated: (Object_Value !== null && Object_Value.hasOwnProperty('TransactionUpdated') && Object_Value.TransactionUpdated !== null ? Object_Value.TransactionUpdated : null),
            TransactionItemList: (Object_Value !== null && Object_Value.hasOwnProperty('TransactionItemList') && Object_Value.TransactionItemList !== null ? TransactionItemHelper.CloneList(Object_Value.TransactionItemList) : []),
        };
    },
    async GetCount(Params_Value){
        try {
            let _Response = await Global.FetchCore({ Action: 'v1/transaction/count', Method: 'POST', Body: Params_Value});
            if (!_Response.ok) { 
                throw Error(await _Response.text());
            } else {
                return await _Response.json();
            }
        } catch (ex) {
            throw ex;
        }
    },
    async GetList(Params_Value){
        try {
            let _Response = await Global.FetchCore({ Action: 'v1/transaction/list', Method: 'POST', Body: Params_Value});
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
            let _Response = await Global.FetchCore({ Action: 'v1/transaction/get', Method: 'POST', Body: Params_Value});
            if (!_Response.ok) { 
                throw Error(await _Response.text());
            } else {
                return await _Response.json();
            }
        } catch(ex) {
            throw ex;
        }
    },
    async EmailOne(Params_Value){
        try {
            let _Response = await Global.FetchCore({ Action: 'v1/transaction/email', Method: 'POST', Body: Params_Value});
            if (!_Response.ok) { 
                throw Error(await _Response.text());
            } else {
                return true;
            }
        } catch (ex) {
            throw ex;
        }
    },  
    async Save(Params_Value) {
        try {
            let _Response = await Global.FetchCore({ Action: 'v1/transaction/save', Method: 'POST', Body: Params_Value});
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
            let _Response = await Global.FetchCore({ Action: 'v1/transaction/delete', Method: 'POST', Body: Params_Value});
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