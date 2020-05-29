import { LightningElement, api, wire, track } from 'lwc';
import { CurrentPageReference, NavigationMixin } from 'lightning/navigation';
import { registerListener, unregisterAllListeners, fireEvent } from 'c/pubsub';
import EVENT_OBJECT from '@salesforce/schema/Event';
import StartDateTime from '@salesforce/schema/Event.StartDateTime';
import EndDateTime from '@salesforce/schema/Event.EndDateTime';
import Subject from '@salesforce/schema/Event.Subject';
import {
    ShowToastEvent
} from 'lightning/platformShowToastEvent';
import createEvent from '@salesforce/apex/leactherTechController.createEvent';

export default class TabScreen extends NavigationMixin(LightningElement) {
    @wire(CurrentPageReference) pageRef;
    @api recordId;
    @api accId;
    @track keyToSearch;
    @track isCheckIn = false;
    @track CheckOut = false;
    @track name;
    @track searchbar = false;

    connectedCallback() {
        console.log('accountid ', this.accId);
    }
    renderedCallback() {
        registerListener('insertProductCart', this.insertProductCart, this);
    }
    insertProductCart(event) {
        console.log('Insert product cart on tab screen ',event);
    }
    clickBack() {
        fireEvent(this.pageRef, 'handleBackFromTabScreen', true);
    }
    handlesearch(event) {
        console.log(event.target.value);
        this.keyToSearch = event.target.value.toUpperCase();
        console.log('Search String ',this.keyToSearch);
        fireEvent(this.pageRef, 'handleSearch', this.keyToSearch);
    }
    handleCheckIn() {
        console.log('Check In function');
        this.isCheckIn = true;
        var today = new Date();
        console.log('Today date ',today);
        let startdate = today.getFullYear() + '-' + (today.getMonth() + 1) + '-' + today.getDate() + 'T' + today.getHours() + ':' + today.getMinutes() + ':' + today.getSeconds() + '.000Z';
        let enddate = today.getFullYear() + '-' + (today.getMonth() + 1) + '-' + today.getDate() + 'T' + (today.getHours() + 1) + ':' + today.getMinutes() + ':' + today.getSeconds() + '.000Z';
        console.log('Today date ',startdate, enddate);
        const fields = {};
            fields[StartDateTime.fieldApiName] = startdate;
            fields[EndDateTime.fieldApiName] = enddate;
            fields[Subject.fieldApiName] = 'Event Created';
            console.log('fields for event creation ',fields);
            createEvent({
                accountid: this.accId,
                eventData: fields
            })
                .then(result => {
                    console.log('Cart ',result);
                    this.error = undefined;
                    this.dispatchEvent(
                        new ShowToastEvent({
                            title: 'Success',
                            message: 'Check - In Successfully',
                            variant: 'success',
                        }),
                    );
                })
                .catch(error => {
                    this.error = error;
                    console.log('Error ', error);
                    this.dispatchEvent(
                        new ShowToastEvent({
                            title: 'Error creating record',
                            message: error.body.message,
                            variant: 'error',
                        }),
                    );
                    console.log('Error on check - in ',error);
                });

    }
    handleCheckOut() {
        //
    }
    tabselect(evt) {
        if(evt.target.label == 'Orders' || evt.target.label == 'Sale Return') {
            console.log('Show search bar ',evt.target.label);
            this.searchbar = true;
            this.CheckOut = false;
        }
        else if(evt.target.label == 'Cart') {
            this.searchbar = false;
            this.CheckOut = true;
        }
        else {
            this.searchbar = false;
            this.CheckOut = false;
        }
        if(evt.target.label != 'Orders') {
            console.log('Targeted tab ',evt.target.label);
            fireEvent(this.pageRef, 'getProductDatatoAddIntoCart', true);
        }
        else {
        }
    }
    disconnectedCallback() {
        // unsubscribe from Listeners
        unregisterAllListeners(this);
    }
}