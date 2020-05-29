/* eslint-disable no-console */
import { LightningElement, wire,api, track} from 'lwc';
import { CurrentPageReference } from 'lightning/navigation';
import {fireEvent } from 'c/pubsub';
import { NavigationMixin } from 'lightning/navigation';

export default class CustomerCard extends NavigationMixin(LightningElement) {
    @wire(CurrentPageReference) pageRef;
    @api account;
    @track openModal = false;
    @track selectedAcc;
    //@track selectedAcc = this.account;

    get name() {

        return this.account.Name;
    }

    renderedCallback(){
        const style = document.createElement('style');
        style.innerText = `c-customer-card .slds-card {
            background-color: white;
            color: black;
            cursor: pointer;
            display: block;
            margin-left: 15px;
            margin-right: 15px;
            margin-bottom: 10px;
            border-radius: 20px 20px 20px 20px;
            //border-width: 0.5px;
            //border: 1px solid gray;
            /* border-color: rgb(181, 70, 10); */
            font-size: 14px;
            font-weight: 400;
            box-shadow: 3px 4px 7px 1px #1c1d1edb;
           // border-radius: 13px 13px 13px 13px;
        }`;
        this.template.querySelector('lightning-card').appendChild(style);

    }
    cardClick(event){
        console.log("Account Name ",this.account.Id);
      // console.log("Account Name ",event.target.id);
    //   this[NavigationMixin.Navigate]({
    //     type: 'standard__recordPage',
    //     attributes: {
    //         recordId: this.account.Id,
    //         objectApiName: 'Account',
    //         actionName: 'view'
    //     },
    // });
    
        fireEvent(this.pageRef, 'handleShowTabs', this.account.Id);
        
    }
    closeModal() {
        this.openModal = false;
    }
    newEntry() {
        this.openModal = false;
        let selectedAcc = this.account;
        console.log('selectedAcc',selectedAcc);
        fireEvent(this.pageRef, 'handleShow',selectedAcc);
    }
    addPackage() {
        this.openModal = false;
        this.selectedAcc = this.account;
        fireEvent(this.pageRef,'showPackage',this.selectedAcc);
    }
}