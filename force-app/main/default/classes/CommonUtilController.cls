public class CommonUtilController {
    
    @AuraEnabled(cacheable=true)
    public static List<Map<String,Object>> getProduct(String searchKey){
        System.debug('Searchkey : '+searchKey);
        List<Map<String,Object>> returnList = new List<Map<String,Object>>(); 
        String key = '%'+searchKey+'%';
        String query = 'select id, name,Product_Code__c,Unit_Price__c ,Short_description__c from product__c';
        if (String.isNotBlank(searchKey)) {
            query += ' where Name Like : key';
        }
        Integer counter = 1;
        List<product__c> prodList = Database.query(query);
        for (product__c obj : prodList) {
            Map<String,Object> temp = new Map<String,Object>();
            temp.put('sr', counter);
            temp.put('Id', obj.Id);
            temp.put('Name', obj.Name);
            temp.put('Code', obj.Product_Code__c);
            temp.put('Mrp', obj.Unit_Price__c != null ? obj.Unit_Price__c : 0);
            temp.put('Description', obj.Short_description__c !=null ? obj.Short_description__c : '');
            returnList.add(temp);
            counter++;
        }
        System.debug('Return List : '+returnList);
        return returnList;
    }

    @AuraEnabled(cacheable=true)
    public static map<String,Object> getEnquiryData(String enqId){
        Map<String,Object> returnMap = new Map<String,Object>();
        System.debug('Enquiry Id : '+enqId);
        enquiry__c enq = [select id, name,account__r.BillingCity,account__r.BillingStreet,account__r.BillingState,Account__r.BillingCountry,Account__r.BillingPostalCode,account__r.shippingCity,account__r.shippingStreet,account__r.shippingState,Account__r.shippingCountry,Account__r.shippingPostalCode,Account__r.Name from enquiry__c where Id = : enqId];
        returnMap.put('Id', enq.Id);
        returnMap.put('Name',enq.Name);
        returnMap.put('billingCity', enq.account__r.BillingCity != null ? enq.account__r.BillingCity : '');
        returnMap.put('billingState', enq.account__r.billingState !=null ? enq.account__r.billingState : '');
        returnMap.put('billingCountry', enq.account__r.BillingCountry !=null ? enq.account__r.BillingCountry : '');
        returnMap.put('billingStreet', enq.account__r.BillingStreet !=null ? enq.account__r.BillingStreet:'');
        returnMap.put('billingPostalCode', enq.account__r.BillingPostalCode !=null ? enq.account__r.BillingPostalCode :'');
        returnMap.put('shippingCity', enq.Account__r.shippingCity !=null ? enq.Account__r.shippingCity : '');
        returnMap.put('shippingState', enq.Account__r.shippingState !=null ? enq.Account__r.shippingState : '');
        returnMap.put('shippingCountry', enq.Account__r.shippingCountry !=null ? enq.Account__r.shippingCountry : '');
        returnMap.put('shippingStreet', enq.Account__r.shippingStreet !=null ? enq.Account__r.shippingStreet : '');
        returnMap.put('shippingPostalCode', enq.Account__r.shippingPostalCode !=null ? enq.Account__r.shippingPostalCode : '');
        returnMap.put('accountName', enq.Account__r.Name);
        System.debug('Reutrn Map : '+returnMap);
        return returnMap;
        
    }

    @AuraEnabled
    public static map<String,Object> getAccount(String accountId){
        Map<String,Object> returnMap = new Map<String,Object>();
        Account acc = [select Id,Name, BillingStreet,BillingCity,BillingCountry,BillingState,BillingPostalCode,ShippingCity,ShippingCountry,ShippingStreet,ShippingPostalCode, shippingState from account where Id = : accountId];
        returnMap.put('billingCity', acc.BillingCity != null ? acc.BillingCity : '');
        returnMap.put('billingState', acc.billingState !=null ? acc.billingState : '');
        returnMap.put('billingCountry', acc.BillingCountry !=null ? acc.BillingCountry : '');
        returnMap.put('billingStreet', acc.BillingStreet !=null ? acc.BillingStreet:'');
        returnMap.put('billingPostalCode', acc.BillingPostalCode !=null ? acc.BillingPostalCode :'');
        returnMap.put('shippingCity', acc.shippingCity !=null ? acc.shippingCity : '');
        returnMap.put('shippingState', acc.shippingState !=null ? acc.shippingState : '');
        returnMap.put('shippingCountry', acc.shippingCountry !=null ? acc.shippingCountry : '');
        returnMap.put('shippingStreet', acc.shippingStreet !=null ? acc.shippingStreet : '');
        returnMap.put('shippingPostalCode', acc.shippingPostalCode !=null ? acc.shippingPostalCode : '');
        returnMap.put('Name', acc.Name);
        returnMap.put('Id', acc.Id);
        System.debug('Account : '+returnMap);
        return returnMap;
    }

    @AuraEnabled
    public static string createEnquiry(Map<String,Object> dataMap){
        System.debug('Param recived : '+dataMap);
        Map<String,Object> customerMap = (Map<String,Object>)dataMap.get('customer');
        Map<String,Object> shippingMap = (Map<String,Object>)dataMap.get('shipping');
        Map<String,Object> billingMap = (Map<String,Object>)dataMap.get('billing');
        List<Map<String,Object>> OLI = (List<Map<String,Object>>)dataMap.get('lineItems');
        Account acc = new Account();
        acc.Name = '';
        return '';
    }

}