module.exports = {
    CloneList(List_Value) {
        let _List = [];
        for (let _TICLI = List_Value.length - 1; _TICLI >= 0; --_TICLI) {
            _List.push(TransactionItemHelper.Clone(List_Value[_TICLI]));
        }
        return _List;
    },    
    Clone(Object_Value) {
        return {
            TransactionItemID: (Object_Value !== null && Object_Value.hasOwnProperty('TransactionItemID') && Object_Value.TransactionItemID !== null ? Object_Value.TransactionItemID : null),
            TransactionItemProductID: (Object_Value !== null && Object_Value.hasOwnProperty('TransactionItemProductID') && Object_Value.TransactionItemProductID !== null ? Object_Value.TransactionItemProductID : null),
            TransactionItemProductInventoryID: (Object_Value !== null && Object_Value.hasOwnProperty('TransactionItemProductInventoryID') && Object_Value.TransactionItemProductInventoryID !== null ? Object_Value.TransactionItemProductInventoryID : null),
            TransactionItemDescription: (Object_Value !== null && Object_Value.hasOwnProperty('TransactionItemDescription') && Object_Value.TransactionItemDescription !== null ? Object_Value.TransactionItemDescription : null),
            TransactionItemCategory: (Object_Value !== null && Object_Value.hasOwnProperty('TransactionItemCategory') && Object_Value.TransactionItemCategory !== null ? Object_Value.TransactionItemCategory : null),
            TransactionItemComment: (Object_Value !== null && Object_Value.hasOwnProperty('TransactionItemComment') && Object_Value.TransactionItemComment !== null ? Object_Value.TransactionItemComment : null),
            TransactionItemQuantity: (Object_Value !== null && Object_Value.hasOwnProperty('TransactionItemQuantity') && Object_Value.TransactionItemQuantity !== null ? Object_Value.TransactionItemQuantity : 0),
            TransactionItemPrice: (Object_Value !== null && Object_Value.hasOwnProperty('TransactionItemPrice') && Object_Value.TransactionItemPrice !== null ? Object_Value.TransactionItemPrice : 0),
            TransactionItemSubtotal: (Object_Value !== null && Object_Value.hasOwnProperty('TransactionItemSubtotal') && Object_Value.TransactionItemSubtotal !== null ? Object_Value.TransactionItemSubtotal : 0),
            TransactionItemTax: (Object_Value !== null && Object_Value.hasOwnProperty('TransactionItemTax') && Object_Value.TransactionItemTax !== null ? Object_Value.TransactionItemTax : 0),
            TransactionItemTaxRate: (Object_Value !== null && Object_Value.hasOwnProperty('TransactionItemTaxRate') && Object_Value.TransactionItemTaxRate !== null ? Object_Value.TransactionItemTaxRate : 0),
            TransactionItemTotal: (Object_Value !== null && Object_Value.hasOwnProperty('TransactionItemTotal') && Object_Value.TransactionItemTotal !== null ? Object_Value.TransactionItemTotal : 0),
        };
    },
};