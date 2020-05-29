import { LightningElement, track, wire, api } from 'lwc';
import { NavigationMixin , CurrentPageReference} from 'lightning/navigation';
import {fireEvent,registerListener,unregisterAllListeners} from 'c/pubsub';
import getEnquiry from '@salesforce/apex/CommonUtilController.getEnquiryData';
import getAccount from '@salesforce/apex/CommonUtilController.getAccount';
import { ShowToastEvent } from 'lightning/platformShowToastEvent';
import saveEnquiry from '@salesforce/apex/CommonUtilController.createEnquiry';

export default class EnquiryPage extends NavigationMixin(LightningElement) {

    @wire(CurrentPageReference)pageRef;

    @api recordId;
    @track newEnquiryId;
    @track detailSection  = false;
    @track isNewAccount = false;
    @track isExistingAccount = false;
    @track mainScreen = true;
    @track spinner = false;
    @track billingAddress;
    @track shippingAddress;
    @track customerDetail;
    @track finalData;

    @wire(getEnquiry,{enqId:'$recordId'})
    wiredData(result){
        console.log('Enquiry Data : ',result);
        if (result.data) {
            var temp = result.data;
            this.billingAddress = {Street:temp.billingStreet,City:temp.billingCity,State:temp.billingState,PostalCode:temp.billingPostalCode,Country:temp.billingCountry}
            this.shippingAddress = {Street:temp.shippingStreet,City:temp.shippingCity,State:temp.shippingState,PostalCode:temp.shippingPostalCode,Country:temp.shippingCountry}
        }
    }

    get options() {
        return [
            { label: 'New Account', value: 'option1' },
            { label: 'Existing Account', value: 'option2' },
        ];
    }

    connectedCallback(){
        this.billingAddress = {City:'',Street:'',PostalCode:'',State:'',Country:''};
        this.shippingAddress = {City:'',Street:'',PostalCode:'',State:'',Country:''};
        this.customerDetail = {Name:'',FirstName:'',LastName:'',Phone:'',Email:'',Designation:''};
        console.log('Record Id : ',this.recordId);
        if (this.recordId) {
            this.detailSection = true;
            this.newAccount = true;
        }
    }

    newAccount(event){
        console.log('Check : ',event.detail.value);
        this.detailSection = true;
        if (event.detail.value == 'option1') {
            this.isNewAccount = true ;
            this.isExistingAccount = false;
            this.billingAddress = {City:'',Street:'',PostalCode:'',State:'',Country:''};
            this.shippingAddress = {City:'',Street:'',PostalCode:'',State:'',Country:''};
        }else if (event.detail.value == 'option2') {
            this.isExistingAccount = true;
            this.isNewAccount = false;
            this.billingAddress = {City:'',Street:'',PostalCode:'',State:'',Country:''};
            this.shippingAddress = {City:'',Street:'',PostalCode:'',State:'',Country:''};   
        }
    }

    handleValueSelcted(event) {
       console.log('selected account',event.detail);
       this.spinner = true;
       getAccount({accountId:event.detail[0]})
       .then(result=>{
           console.log('Result : ',result);
           this.spinner = false;
           this.billingAddress = {Street:result.billingStreet,City:result.billingCity,State:result.billingState,PostalCode:result.billingPostalCode,Country:result.billingCountry}
           this.shippingAddress = {Street:result.shippingStreet,City:result.shippingCity,State:result.shippingState,PostalCode:result.shippingPostalCode,Country:result.shippingCountry}
       })
       .catch(error=>{
           console.log('Error in getting account : ',error);
           this.spinner = false;
       })
    }

    handleNext(){
        if (!this.isExistingAccount && !this.isNewAccount) {
            this.showToast('Select Account Action','warning','warning');
            return;
        }
        if (this.isNewAccount) {
            const allValid = [...this.template.querySelectorAll('.mandate')]
            .reduce((validSoFar, inputCmp) => {
                console.log('IN : ',validSoFar,'',inputCmp);
                        inputCmp.reportValidity();
                        return validSoFar && inputCmp.checkValidity();
            }, true);
            const address = [...this.template.querySelectorAll('.Address')]
            .reduce((valid, input) => {
                        input.reportValidity();
                        return valid && input.checkValidity();
            }, true);
            if (!allValid && !address) {
                this.showToast('Please fill required fields','warning','warning');
            }else{
                console.log('In Main Screen');
                this.finalData = {billing:this.billingAddress,shipping:this.shippingAddress,customer:this.customerDetail};
                console.log('Customer Data : ',this.finalData);
                this.mainScreen = false;
            }
            
        }else if (this.isExistingAccount) {
            const addressVa = [...this.template.querySelectorAll('.Address')]
            .reduce((valid, input) => {
                        input.reportValidity();
                        return valid && input.checkValidity();
            }, true);
            if (!addressVa) {
                this.showToast('Please fill required fields','warning','warning');
            }else{
                console.log('In Main Screen existing');
                this.mainScreen = false;
            }
        }
    }
    
    handleBack(){
        this.mainScreen = true;
    }

    handleAddress(event){
        console.log('Address event',event.detail.value);
        const name = event.target.name;
        switch (name) {
            case 'bStreet':
                this.billingAddress['Street'] = event.target.value;
                break;
            case 'bCity':
                this.billingAddress['City'] = event.target.value;
                break;
            case 'bState':
                this.billingAddress['State'] = event.target.value;
                break;
            case 'bCountry':
                this.billingAddress['Country'] = event.target.value;
                break;
            case 'bCode':
                this.billingAddress['PostalCode'] = event.target.value;
                break;
            case 'sCode':
                this.shippingAddress['PostalCode'] = event.target.value;
                break;
                case 'sState':
                this.shippingAddress['State'] = event.target.value;
                break;
            case 'sCountry':
                this.shippingAddress['Country'] = event.target.value;
                break;
            case 'sState':
                this.shippingAddress['State'] = event.target.value;
                break;
            case 'sStreet':
                this.shippingAddress['Street'] = event.target.value;
                break;
            case 'sCity':
                this.shippingAddress['City'] = event.target.value;
                break;
            default:
                break;
        }
    }

    navigateToAccountListView() {
        this[NavigationMixin.Navigate]({
            type: 'standard__objectPage',
            attributes: {
                objectApiName: 'Enquiry__c',
                actionName: 'list'
            },
            state: {
                filterName: 'Recent'
            },
        });
    }

    handleCustomerDetails(event){
        const name = event.target.name
        switch (name) {
            case 'cName':
                this.customerDetail['Name'] = event.target.value;
                break;
            case 'fName':
                this.customerDetail['FirstName'] = event.target.value;
                break;
            case 'lName':
                this.customerDetail['LastName'] = event.target.value;
                break;
            case 'email':
                this.customerDetail['Email'] = event.target.value;
                break;
            case 'phone':
                this.customerDetail['Phone'] = event.target.value;
                break;
            case 'designation':
                this.customerDetail['Designation'] = event.target.value;
                break;
            default:
                break;
        }
    }

    handleSave(){
        console.log('Handle Save : ',this.finalData);
        fireEvent(this.pageRef,'SaveData',this.finalData);
    }

    showToast(msg,variant,title) {
        console.log('taost fired');
        const event = new ShowToastEvent({
            title: title,
            message: msg,
            variant: variant,
            mode: 'dismissable'
        });
        this.dispatchEvent(event);
    }
}