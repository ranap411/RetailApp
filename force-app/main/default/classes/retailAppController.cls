/**
* @File Name          : retailAppController.cls
* @Description        : 
* @Author             : Saloni Jain
* @Group              : 
* @Last Modified By   : ChangeMeIn@UserSettingsUnder.SFDoc
* @Last Modified On   : 5/24/2020, 5:36:55 PM
* @Modification Log   : 
* Ver       Date            Author      		    Modification
* 1.0    22/5/2020   Saloni Jain     Initial Version
**/
public with sharing class retailAppController {
    
    @AuraEnabled
    public static Map<String,string> loggedUsers(){
        Map<String,string> returnmap = new Map<String,string>();
        List<Daily_Log__c> att = [select id,Status__c,Clock_Out_Time__c,Clock_In_Time__c from Daily_Log__c where Assigned_To__c =:UserInfo.getUserId() AND Beat_Date__c =: System.today()];
        system.debug('att size : '+att.size());
        if(att.size() > 0){
            returnmap.put('record','Available');
            returnmap.put('stage',att[0].Status__c);
            returnmap.put('atRecordId',att[0].Id);
            returnmap.put('ClockOutTime',string.valueOf(att[0].Clock_Out_Time__c));
            returnmap.put('ClockInTime',string.valueOf(att[0].Clock_In_Time__c));
        }
        User u = [select Id, username,Name,Address,	Phone,Email,Designation__c, title from User where Id = :UserInfo.getUserId()];
        returnmap.put('Id',u.Id);
        returnmap.put('username',u.username);
        returnmap.put('name',u.name);
        //returnmap.put('address',u.Address);
        returnmap.put('Phone',u.Phone);
        returnmap.put('Email',u.Email);
        returnmap.put('Title',u.title);
        System.debug(returnmap);
        system.debug('att record : '+returnmap);
        return returnmap;
        
    }
    @AuraEnabled
    public static ContentVersion saveFile(Id idParent, String strFileName, String base64Data) {
        // Decoding base64Data
        base64Data = EncodingUtil.urlDecode(base64Data, 'UTF-8');
        
        // inserting file
        ContentVersion cv = new ContentVersion();
        cv.Title = strFileName;
        cv.PathOnClient = '/' + strFileName;
        system.debug('URL : '+cv.PathOnClient);
        cv.FirstPublishLocationId = idParent;
        cv.VersionData = EncodingUtil.base64Decode(base64Data);
        cv.IsMajorVersion = true;
        Insert cv;
        return cv;
    }
    @AuraEnabled
    public static void setLocation(String objectApiName, Map<String, Object> location, String recordId){
        sObject sObj = Schema.getGlobalDescribe().get(objectApiName).newSObject();
        sObj.put('Id', recordId);
        for(String field : location.keySet()){
            sObj.put(field, location.get(field));
        }
        update sObj;
    }
    @AuraEnabled
    public static void UpdateDailyLog(Map<string,object> logdata){
        Daily_Log__c logObj = new Daily_Log__c();
        try{
            system.debug('Request Body : '+ logdata);
            system.debug('Lat Lon : '+logdata.get('Clock_Out_Lat'));
            logObj.Id = string.valueOf(logdata.get('Id'));
            DateTime dt = System.now();
            Time myTime = Time.newInstance(dt.hour(), dt.minute(), dt.second(), dt.millisecond());
            system.debug('Update Type : '+string.valueOf(logdata.get('UpdateType')));
            if(string.valueOf(logdata.get('UpdateType'))== 'ClockOut'){
                logObj.Clock_Out_Time__c = myTime;
                logObj.Clock_Out_LatLang__latitude__s = double.valueOf(logdata.get('Clock_Out_Lat'));
                logObj.Clock_Out_LatLang__longitude__s = double.valueOf(logdata.get('Clock_Out_Long'));
            }else if(string.valueOf(logdata.get('UpdateType'))== 'ClockIn'){
                logObj.Status__c = string.valueOf(logdata.get('Status'));
                logObj.Clock_In_Time__c = myTime;
                logObj.Clock_In_LatLang__latitude__s = double.valueOf(logdata.get('Clock_In_Lat'));
                logObj.Clock_In_LatLang__longitude__s = double.valueOf(logdata.get('Clock_In_Long'));
            }
            
            update logObj;
        }catch(Exception e){
            system.debug('Error in class : '+e.getMessage()+' at line no. : '+e.getLineNumber());
        }
    }
    @AuraEnabled(cacheable =true)
    public static List<Map<String, Object>> getProduct(){
        List<Map<String, Object>> myMap = new List<Map<String, Object>>();
        List<Product__c> myList = new List<Product__c>();
        myList = [select id,Product_Code__c,Name,Color__c,Size__c,category__c,	Price__c from Product__c];
        for(Product__c pl : myList){
            Map<String, Object> tempMap = new Map<String, Object>();
            tempMap.put('Id',pl.id);
            tempMap.put('ProductCode',pl.Product_Code__c);
            tempMap.put('ProductName',pl.Name);
            tempMap.put('Color',pl.Color__c);
            tempMap.put('Size',pl.Size__c);
            tempMap.put('Size',pl.Price__c);
            tempMap.put('Category',pl.Category__c);
            myMap.add(tempMap);
        }
        //   System.debug(myMap.get('1223')); 
        // System.debug('map' + myMap);
        // System.debug('Product '+ myList);
        return myMap;
    }
    
    @AuraEnabled
    public static void addToCart(Map<object,object> data){
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