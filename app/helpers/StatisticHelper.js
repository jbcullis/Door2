module.exports = {
    Clone(Object_Value) {
        return {
            StatisticID: Object_Value !== null && Object_Value.hasOwnProperty('StatisticID') && Object_Value.StatisticID !== null ? Object_Value.StatisticID : null,
            StatisticYear: Object_Value !== null && Object_Value.hasOwnProperty('StatisticYear') && Object_Value.StatisticYear !== null ? Object_Value.StatisticYear : null,
            StatisticMonth: Object_Value !== null && Object_Value.hasOwnProperty('StatisticMonth') && Object_Value.StatisticMonth !== null ? Object_Value.StatisticMonth : null,
            StatisticDay: Object_Value !== null && Object_Value.hasOwnProperty('StatisticDay') && Object_Value.StatisticDay !== null ? Object_Value.StatisticDay : null,
            StatisticValue: Object_Value !== null && Object_Value.hasOwnProperty('StatisticValue') && Object_Value.StatisticValue !== null ? Object_Value.StatisticValue : null,
        };
    },
    async GetModel() {
        try {
            let _Response = await Global.FetchCore({ Action: 'v1/statistic/getmodel', Method: 'POST'});
            if (!_Response.ok) {
                throw Error(await _Response.text());
            } else {
                return await _Response.json();
            }
        } catch (ex) {
            throw Error('StatisticHelper.GetModel>>' + ex.message);
        }
    },
};