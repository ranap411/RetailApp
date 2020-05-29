/* eslint-disable @lwc/lwc/no-async-operation */
/* eslint-disable no-console */
import { LightningElement, track, api, wire} from 'lwc';
import findAccount from '@salesforce/apex/leactherTechController.findAccount';
import { CurrentPageReference, NavigationMixin} from 'lightning/navigation';
import { registerListener, unregisterAllListeners, fireEvent } from 'c/pubsub';
const DELAY = 100;
export default class SearchCustomer extends NavigationMixin(LightningElement){
    @wire(CurrentPageReference) pageRef;

    @track searchKey = '';
    @api selectedval = '';
    @track accounts;
    @track noResult = false;
    url;
    @track sKey;
    @track showTabs=false;
    @track showAccount = true;
    @track accId;
    @track newCustomer = false;

  //  @track hideShowCust = true;
    // @wire(findAccount, { searchKey: '$searchKey' })
    // accounts;

    @wire(findAccount, { searchKey: '$searchKey' })
    findAccount(result){ 
    if(result.data){
    this.accounts =  result.data;
    console.log("Find Account ",result.data.length);
    if(result.data.length == 0){
        this.noResult = true;
    }
    else{
        this.noResult = false;
    }
    }

  }

    renderedCallback() {
        registerListener('refreshMachine', this.refMachine, this);
        console.log("All Accounts ",this.accounts);
        registerListener("showPackage", this.selectedAccountValue, this);
        registerListener("resetSearchBar", this.handleResetSearchBar, this);
        registerListener("handleShowTabs", this.handleShowTabs, this);
        registerListener("handleBackFromTabScreen", this.handleHideTabs, this);
    }

    connectedCallback(){
        this.searchKey = '';
    }
    clickBack(){
        fireEvent(this.pageRef, 'homeScreen', true);
    }
    disconnectedCallback() {
        // unsubscribe from searchKeyChange event
        unregisterAllListeners(this);
        this.searchKey = '';
    }
    handleShowTabs(accId){
        console.log('accId ', accId);
        this.accId = accId;
        this.showTabs = true;
        this.showAccount = false;
    }
    handleHideTabs(accId) {
        console.log('accId ', accId);
        this.accId = accId;
        this.showTabs = false;
        this.showAccount = true;
    }
    handleResetSearchBar(){
        console.log('handleResetSearchBar ');
        this.template.querySelector("form").reset();
    }

    selectedAccountValue(val){
        this.selectedval = val;
    }

    refMachine(){
        //return refreshApex(this.accounts);
    }
    handleKeyChange(event) {
        this.sKey = event.target.value;
        console.log('this.sKey in Search Customer', this.sKey);
        // Debouncing this method: Do not update the reactive property as long as this function is
        // being called within a delay of DELAY. This is to avoid a very large number of Apex method calls.
        window.clearTimeout(this.delayTimeout);
        const searchKey = event.target.value.split(' ').join('');
        this.delayTimeout = setTimeout(() => {
            this.searchKey = searchKey;
        }, DELAY);
    }

    handleNewClick(){
        console.log('this.template.querySelector("form") ', this.template.querySelector("form"));
        // this.template.querySelector("form").reset();
        fireEvent(this.pageRef, 'handleNewCustomer', true);
        console.log('SKEY When Click New ',this.sKey);
        fireEvent (this.pageRef, 'searchKeyVal', this.sKey);
        // this.hideShowCust = false;
        console.log("New Button Clicked");
        this.newCustomer = true;
    }
    // closepopup(){
    //     this.hideCustomer = true;
    //}
}