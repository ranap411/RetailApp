/**
 * @File Name          : GetPrevOrder.cls
 * @Description        : 
 * @Author             : ChangeMeIn@UserSettingsUnder.SFDoc
 * @Group              : 
 * @Last Modified By   : Saloni Jain
 * @Last Modified On   : 21/5/2020, 6:57:57 pm
 * @Modification Log   : 
 * Ver       Date            Author      		    Modification
 * 1.0    19/5/2020   ChangeMeIn@UserSettingsUnder.SFDoc     Initial Version
 **/
public with sharing class GetPrevOrder {
    /**
     * @File Name          : Leathertech.cls
     * @Description        :
     * @Author             : ChangeMeIn@UserSettingsUnder.SFDoc
     * @Group              : 
     * @Last Modified By   : Saloni Jain
     * @Last Modified On   : 21/5/2020, 6:57:57 pm
     * @Modification Log   : 
     * Ver       Date            Author      		    Modification
     * 1.0    19/5/2020   ChangeMeIn@UserSettingsUnder.SFDoc     Initial Version
     **/
    /* @AuraEnabled(cacheable = true)
    public static List < Map < string, Object >> getOrders(Id customerId) {
        List < Map < String, Object >> myMap = new List < Map < String, Object >> ();
        List < Sales_Order_headers__c > myList = new List < Sales_Order_headers__c > ();
        myList = [select Customer__c, Challan_no__c, Order_no__c, Total_Discount__c from Sales_Order_headers__c where Customer__c =: customerId];
        for (Sales_Order_headers__c pl: myList) {
            Map < String, Object > tempMap = new Map < String, Object > ();
            tempMap.put('Id', pl.customer__c);
            tempMap.put('challan no', pl.Challan_no__c);
            tempMap.put('ProductName', pl.Order_no__c);
            tempMap.put('Color', pl.Total_Discount__c);
            myMap.add(tempMap);
        }
        return mymap;
    } */
}