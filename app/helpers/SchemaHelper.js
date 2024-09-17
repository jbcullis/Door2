module.exports = {
    Clone(Object_Value) {
        try {
            return {
                SchemaID: Object_Value?.hasOwnProperty('SchemaID') && Object_Value.SchemaID !== null ? Object_Value.SchemaID : null,
                SchemaPropertyName: Object_Value?.hasOwnProperty('SchemaPropertyName') && Object_Value.SchemaPropertyName !== null ? Object_Value.SchemaPropertyName : null,
                SchemaPropertyList: Object_Value?.hasOwnProperty('SchemaPropertyList') && Object_Value.SchemaPropertyList !== null ? JSON.parse(JSON.stringify(Object_Value.SchemaPropertyList)) : [],
                SchemaCreated: Object_Value?.hasOwnProperty('SchemaCreated') && Object_Value.SchemaCreated !== null ? Object_Value.SchemaCreated : null,
                SchemaUpdated: Object_Value?.hasOwnProperty('SchemaUpdated') && Object_Value.SchemaUpdated !== null ? Object_Value.SchemaUpdated : null,
            };
        } catch (ex) {
            throw Error('SchemaHelper.Clone>>' + ex.message);
        }
    },
    async GetCount(Params_Value){
        try {
            let _Response = await Global.FetchCore({ Action: 'v1/schema/count', Method: 'POST', Body: Params_Value});
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
            let _Response = await Global.FetchCore({ Action: 'v1/schema/list', Method: 'POST', Body: Params_Value});
            if (!_Response.ok) { 
                throw Error(await _Response.text());
            } else {
                return await _Response.json();
            }
        } catch (ex) {
            throw Error('SchemaHelper.GetList>>' + ex.message);
        }
    },
    async GetOne(Params_Value){
        try {
            let _Response = await Global.FetchCore({ Action: 'v1/schema/get', Method: 'POST', Body: Params_Value});
            if (!_Response.ok) { 
                throw Error(await _Response.text());
            } else {
                return SchemaHelper.Clone(await _Response.json());
            }
        } catch(ex) {
            throw Error('SchemaHelper.GetOne>>' + ex.message);
        }       
    },
    async Save(Params_Value) {
        try {
            let _Response = await Global.FetchCore({ Action: 'v1/schema/save', Method: 'POST', Body: Params_Value});
            if (!_Response.ok) { 
                throw Error(await _Response.text());
            } else {
                return await _Response.json();
            }
        } catch(ex) {
            throw Error('SchemaHelper.Save>>' + ex.message);
        }
    },
    async Delete(Params_Value) {
        try {
            let _Response = await Global.FetchCore({ Action: 'v1/schema/delete', Method: 'POST', Body: Params_Value});
            if (!_Response.ok) { 
                throw Error(await _Response.text());
            } else {
                return true;
            }
        } catch(ex) {
            throw Error('SchemaHelper.Delete>>' + ex.message);
        }
    },
};