/**
* @File Name          : leactherTechController.cls
* @Description        : 
* @Author             : ChangeMeIn@UserSettingsUnder.SFDoc
* @Group              : 
* @Last Modified By   : ChangeMeIn@UserSettingsUnder.SFDoc
* @Last Modified On   : 5/29/2020, 3:23:07 AM
* @Modification Log   : 
* Ver       Date            Author                  Modification
* 1.0    5/16/2020   ChangeMeIn@UserSettingsUnder.SFDoc     Initial Version
**/
public with sharing class leactherTechController {
    
    @AuraEnabled(cacheable=true)
    public static List<Account> findAccount(String searchKey) {
        String key = '%' + searchKey + '%';
        return [SELECT Id, Name, Phone FROM Account WHERE (Name LIKE :key OR Phone LIKE :key) ORDER BY createdDate DESC LIMIT 10];
    }
    
    @AuraEnabled(cacheable=true)
    public static List<Account> allAccount() {
        return [SELECT Id, Name, Phone FROM Account];
    }
    
    @AuraEnabled(cacheable=true)
    public static List<Map<String, Object>> getProduct(){
        List<Map<String, Object>> myMap = new List<Map<String, Object>>();
        List<Product__c> myList = new List<Product__c>();
        myList = [select id,Product_Code__c,Name,Color__c,Size__c,category__c, Price__c, Unit_Price__c, Stock_Status__c, Brand__c, Tag__c, UOM__c from Product__c];
        for(Product__c pl : myList){
            Map<String, Object> tempMap = new Map<String, Object>();
            tempMap.put('Id',pl.id);
            tempMap.put('ProductCode',pl.Product_Code__c);
            tempMap.put('ProductName',pl.Name);
            tempMap.put('Color',pl.Color__c);
            tempMap.put('Size',pl.Size__c);
            tempMap.put('Price',pl.Price__c);
            tempMap.put('Category',pl.Category__c);
            tempMap.put('UnitPrice',pl.Unit_Price__c);
            tempMap.put('StockStatus',pl.Stock_Status__c);
            tempMap.put('Brand',pl.Brand__c	);
            tempMap.put('Tag',pl.Tag__c	);
            tempMap.put('UOM',pl.UOM__c	);
            myMap.add(tempMap);
        }
        // System.debug('map' + myMap);
        // System.debug('Product '+ myList);
        return myMap;
    }
    @AuraEnabled(cacheable = true)
    public static List<Map<String,Object>> getPreviousOrders(Id customerId) {
        List<Map<String,Object>> myMap = new List<Map<String, Object>>();
        List<Sales_Order__c> myList = new List<Sales_Order__c>();
        myList = [select Id,Customer__c, Challan_no__c, name, Total_Discount__c,Total_Amount__c,Order_Date__c from Sales_Order__c where Customer__c =: customerId];
        for (Sales_Order__c pl: myList) {
            Map<String, Object> tempMap = new Map<String,Object> ();
            tempMap.put('Id', pl.Id);
            tempMap.put('challanNo', pl.Challan_no__c);
            tempMap.put('OrderNo', pl.name);
            tempMap.put('TotalDiscount', pl.Total_Discount__c);
            tempMap.put('TotalAmount', pl.Total_Amount__c);
            tempMap.put('OrderDate', pl.Order_Date__c);
            myMap.add(tempMap);
        }
        return mymap;
    }

    @AuraEnabled(cacheable = true)
    public static map<String,Object> getCustomerDetail(String accountId){
        System.debug('Param recieved  '+accountId);
        map<String,Object> returnMap = new map<String,Object>();
        Account acc = [select Id, Name , BillingAddress,Type, Owner.Name, Owner.Phone, Owner.Address from account where Id =: accountId ];
        returnMap.put('Name', acc.Name);
        returnMap.put('DealerType', 'Register');
        returnMap.put('Mobile', '788889900');
        returnMap.put('Address', 'Delhi India');
        returnMap.put('OwnerName', acc.Owner.Name);
        returnMap.put('OwnerPhone', acc.Owner.Phone);
        returnMap.put('Beat', 'Beat 3');
        returnMap.put('Address', acc.Owner.Address);
        returnMap.put('OutletType', 'Bar');
        returnMap.put('OutletCategory', 'Class A');
        returnMap.put('Balance', '125634');

        System.debug('Return Map : '+returnMap);

        return returnMap;
    }
    
     @AuraEnabled(cacheable=true)
    public static List<Cart__c> getCartRecord(String accountId) {
        return [select Account_Id__c, Color__c, Product_Id__c, Product_Code__c, Quantity__c, Total_Amount__c, Unit_Price__c from Cart__c where Account_Id__c =:accountId];
    }
    
    @AuraEnabled
    public static String insertOrderLineItem(Id salesOrderId, List<map<string,object>> itemList){
    try{
        system.debug('itemList '+itemList);
       Sales_order_line_Item__c salesOrderLineItem = new Sales_order_line_Item__c();
       List<Sales_order_line_Item__c> listOfSOLI = new List<Sales_order_line_Item__c>();
       
       for(map<string,object> item : itemList){
        System.debug('item '+item);
        salesOrderLineItem.Sales_Order__c = salesOrderId;
        salesOrderLineItem.Product_Name__c = String.valueOf(item.get('Product_Code__c'));
        salesOrderLineItem.Quantity__c = Integer.valueOf(item.get('Quantity__c'));
        salesOrderLineItem.Total_Amount_incl_tax__c = Integer.valueOf(item.get('Total_Amount__c'));
        salesOrderLineItem.Unit_Price__c = Integer.valueOf(item.get('Unit_Price__c'));
        
        listOfSOLI.add(salesOrderLineItem);
       }
       
        insert listOfSOLI;
        }catch(exception e) {
            System.debug('Error' + e.getMessage()+' On Line '+e.getLineNumber());
             return 'Failed';
        }
        
         return 'Success';
    }

    @AuraEnabled
    public static string createCartRecord(List<object> prodList){
        try {
            System.debug('OLI recieved in the system : '+prodList);
            List<Cart__c> cartList = new List<Cart__c>();
            for(object prod : prodList){
                if(prod instanceOf map<object,object>){
                    Map<object, object> objMap =  (Map<object, object>) prod;
                    if( Decimal.valueOf(String.valueOf(objMap.get('Quantity'))) != 0 ) {
                        System.debug('objMap '+objMap);
                        Cart__c cartItem = new Cart__c();
                        cartItem.Name = String.valueOf(objMap.get('ProductId')) + String.valueOf(objMap.get('Account'));
                        cartItem.Product_Id__c = String.valueOf(objMap.get('ProductId'));
                        cartItem.Account_Id__c = String.valueOf(objMap.get('Account'));
                        cartItem.Color__c = String.valueOf(objMap.get('Color'));
                        cartItem.Product_Code__c = String.valueOf(objMap.get('ProductCode'));
                        cartItem.Unit_Price__c = Decimal.valueOf(String.valueOf(objMap.get('UnitPrice')));
                        cartItem.Total_Amount__c = Decimal.valueOf(String.valueOf(objMap.get('UnitPrice'))) * Decimal.valueOf(String.valueOf(objMap.get('Quantity')));
                        cartItem.Quantity__c = Decimal.valueOf(String.valueOf(objMap.get('Quantity')));
                        cartList.add(cartItem);
                    }
                }
            }
            insert cartList;
            return 'Success';
        } catch(exception e) {
            System.debug('Error in create OLI'+e.getMessage()+ ' at line no. '+e.getLineNumber());
            return 'Error';
        }
    }
    
     
     @AuraEnabled(cacheable = true)
    public static List<Daily_Log__c> getBeatRecords() {
    Date nowDate = system.today();
    Date newDate = nowDate.addDays(2);
    Date oldDate = nowDate.addDays(-2);
    System.debug(oldDate +' '+newDate);
    
    List<Daily_Log__c> beatList = [select id, Beat_Date__c, (select id, What.Name, Location, Subject from Events) from Daily_Log__c where (Beat_Date__c >=: oldDate AND Beat_Date__c <=: newDate)];
    return beatList;
    }

    @AuraEnabled 
    public static string createEvent(Id accountid, Event eventData){
        try{
            System.debug('Event Data '+eventData);
            return 'Success';
        }catch(exception e) {
            System.debug('Error in Create Event '+ e.getMessage()+ 'at line no. '+e.getLineNumber());
            return 'Error';
        }
    }
}