public with sharing class ayushController {
@AuraEnabled()
public static Map<String,string> loggedUsers(){
Map<String,string> returnmap = new Map<String,string>();
User u = [select Id, username from User where Id = :UserInfo.getUserId()];
returnmap.put('Id',u.Id);
returnmap.put('username',u.username);
System.debug(returnmap);
return returnmap;

}

@AuraEnabled(cacheable =true)
public static List<Map<String, object>> getProduct(){
    List<Map<String, object>> myMap = new List<Map<String, object>>();
    List<Product__c> myList = new List<Product__c>();
    myList = [select id,Product_Code__c,Name from Product__c];
    for(Product__c pl : myList){
        Map<String, Object> tempMap = new Map<String, Object>();
        tempMap.put('Id',pl.id);
        tempMap.put('ProductCode',pl.Product_Code__c);
        tempMap.put('ProductName',pl.Name);
        myMap.add(tempMap);
    }
    //   System.debug(myMap.get('1223')); 
    // System.debug('map' + myMap);
    // System.debug('Product '+ myList);
    return myMap;
}
@AuraEnabled
public static void insertitem(Map<object,object> data){
try{
    Cart__c c = new Cart__c();
    String acc = String.valueOf(data.get('AccountId'));
    String proId = String.valueOf(data.get('ProductId'));
    Integer quantity = Integer.valueOf(data.get('Quantity'));
    Double price = Double.valueOf(data.get('Price'));
    String color = String.valueOf(data.get('Color'));
    c.Name = acc+'_'+proId;
    c.Product_Id__c = proId;
    c.Unit_Price__c = price;
    c.Quantity__c = quantity;
    c.Color__c = color;
    c.Total_Amount__c = price*quantity;
    insert c;
}catch(exception e) {
    System.debug('Excep' + e.getMessage()+' '+e.getLineNumber());
}
}
}