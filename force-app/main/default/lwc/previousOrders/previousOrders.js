import { LightningElement, wire, api, track } from 'lwc';
import getPreviousOrders from '@salesforce/apex/leactherTechController.getPreviousOrders';

export default class PreviousOrders extends LightningElement {
    @api accountid;
    @track previousOrderList = [];
    @track error;
    @track noOrders = false;
    @track spinner = true;

    connectedCallback() {
        console.log('Account Id in previous order comp ',this.accountid);
        getPreviousOrders({
            customerId: this.accountid
        })
        .then( result => {
            this.noOrders = false;
            this.spinner = false;
            this.previousOrderList = result;
            this.error = undefined;
            console.log('Previous Order List ',this.previousOrderList);
        })
        .catch(error => {
            this.noOrders = false;
            this.spinner = true;
            this.previousOrderList = undefined;
            this.error = error;
            console.log('Error in previous order',this.error);
        })
    }
    renderedCallback() {
        if(this.previousOrderList.length == 0) {
            this.noOrders = true;
        }
    }
}