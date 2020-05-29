trigger GetRecordsValuesFromLeave on Leave__c (before insert)
{
   //map <string ,Object> m = new map< string,object>();
  //List<Leave__c>slist= [select id ,Leave_status__c , Leave_Type__c from Leave__c where Beat_Date__c >= From_Date__c and Beat_Date__c <=To_Date__c and Assigned_To__c = User__c];
    for(Leave__c lp : TRigger.new){
        if(lp.Leave_status__c == 'Approved'){
            
            
        }
        
        
        
    }
}