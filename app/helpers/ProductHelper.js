module.exports = {
    Clone(Object_Value) {
        try {
            return {
                ProductID: Object_Value?.hasOwnProperty('ProductID') && Object_Value.ProductID !== null ? Object_Value.ProductID : null,
                ProductName: Object_Value?.hasOwnProperty('ProductName') && Object_Value.ProductName !== null ? Object_Value.ProductName : null,
                ProductDescription: Object_Value?.hasOwnProperty('ProductDescription') && Object_Value.ProductDescription !== null ? Object_Value.ProductDescription : null,
                ProductPrice: Object_Value?.hasOwnProperty('ProductPrice') && Object_Value.ProductPrice !== null ? Object_Value.ProductPrice : 0,
                ProductPriceUnit: Object_Value?.hasOwnProperty('ProductPriceUnit') && Object_Value.ProductPriceUnit !== null ? Object_Value.ProductPriceUnit : null,
                ProductPriceCategory: Object_Value?.hasOwnProperty('ProductPriceCategory') && Object_Value.ProductPriceCategory !== null ? Object_Value.ProductPriceCategory : null,
                ProductAvailability: Object_Value?.hasOwnProperty('ProductAvailability') ? Object_Value.ProductAvailability : null,
                ProductCreated: Object_Value?.hasOwnProperty('ProductCreated') && Object_Value.ProductCreated !== null ? Object_Value.ProductCreated : null,
                ProductUpdated: Object_Value?.hasOwnProperty('ProductUpdated') && Object_Value.ProductUpdated !== null ? Object_Value.ProductUpdated : null,
            };
        } catch (ex) {
            throw Error('ProductHelper.Clone>>' + ex.message);
        }
    },
    async GetCount(Params_Value){
        try {
            let _Response = await Global.FetchCore({ Action: 'v1/product/count', Method: 'POST', Body: Params_Value});
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
            let _Response = await Global.FetchCore({ Action: 'v1/product/list', Method: 'POST', Body: Params_Value});
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
            let _Response = await Global.FetchCore({ Action: 'v1/product/get', Method: 'POST', Body: Params_Value});
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
            let _Response = await Global.FetchCore({ Action: 'v1/product/save', Method: 'POST', Body: Params_Value});
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
            let _Response = await Global.FetchCore({ Action: 'v1/product/delete', Method: 'POST', Body: Params_Value});
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