/* eslint-disable eqeqeq */
/* eslint-disable no-alert */
/* eslint-disable no-console */
import { LightningElement, track, wire, api } from 'lwc';
import { createRecord } from 'lightning/uiRecordApi';
import { ShowToastEvent } from 'lightning/platformShowToastEvent';
import ACCOUNT_OBJECT from '@salesforce/schema/Account';
import NAME from '@salesforce/schema/Account.Name';
import PHONE from '@salesforce/schema/Account.Phone';
import DEALER_TYPE from '@salesforce/schema/Account.Dealer_Type__c';
import { CurrentPageReference, NavigationMixin } from 'lightning/navigation';
import { unregisterAllListeners, fireEvent } from 'c/pubsub';
import { getPicklistValues } from 'lightning/uiObjectInfoApi';
import { getObjectInfo } from 'lightning/uiObjectInfoApi';


export default class NewCustomer extends NavigationMixin(LightningElement) {
    @wire(CurrentPageReference) pageRef;
    accountId;
    @track allAcc;
    @track duplicateMob;
    @track phoneVal;
    @track name = '';
    lastName = '';
    @track mobile = '';
    dealertype = '';
    @track objectInfo;
    options;
    recordTypeId;

    /* @wire(getPicklistValues, {
        recordTypeId: '$objectInfo.data.defaultRecordTypeId',
        fieldApiName: DEALER_TYPE
    })
    dealerType({
        data,
        error
    }) {
        if (data) {
            console.log('Data ', data);
            this.options = data.values.map(plValue => {
                return {
                    label: plValue.label,
                    value: plValue.value
                };
            });
            console.log('options ',this.options);
        } else if (error) {
            console.log('====error=====',error);
        }
    } */

    handleChange(event) {
        if (event.target.dataset.item == "Name") {
            this.name = '';
            this.name = event.target.value;
        } else if (event.target.dataset.item == "mobile") {
            this.mobile = '';
            this.mobile = event.target.value;
        }else if (event.target.dataset.item == "dealertype") {
            this.dealertype = event.target.value;
        }
        /*  else if (event.target.dataset.item == "Assigned") {
            this.assigned = event.detail;
        } */
    }

    disconnectedCallback() {
        // unsubscribe from searchKeyChange event
        unregisterAllListeners(this);
    }

    createAccount() {
        try {
            console.log('Data ', this.name, this.mobile);
            if ((this.name != null || this.name != '' || this.name != ' ') && (this.mobile != null || this.mobile != '') && (this.mobile.length == 10)) {
                const fields = {};
                var data;
                fields[NAME.fieldApiName] = this.name;
                fields[PHONE.fieldApiName] = this.mobile;
                /* fields[DEALER_TYPE.fieldApiName] = this.dealertype; */
                const recordInput = { apiName: ACCOUNT_OBJECT.objectApiName, fields };
                createRecord(recordInput)
                    .then(account => {
                        this.accountId = account.id;
                        console.log('Account Created', this.accountId);
                        console.log('Account Created', this.accountId.name, this.accountId);
                        this.dispatchEvent(
                            new ShowToastEvent({
                                title: 'Success',
                                message: 'Account created',
                                variant: 'success',
                            }),
                        );
                        console.log('account.Id', this.accountId);
                        fireEvent(this.pageRef, 'homeScreen', 'homeScreen');
                    })
                    .catch(error => {
                        let errMessg = '';
                        console.log(error);
                        if (error.body.output.errors.length != 0) {
                            if (error.body.output.errors[0].errorCode == 'DUPLICATE_VALUE') {
                                errMessg = 'Customer with same details already exists';
                            }
                        }
                        // else if (error.body.output.fieldErrors.Name[0].errorCode == 'REQUIRED_FIELD_MISSING') {
                        //     errMessg = 'First Name cannot be Empty';
                        // }
                        this.dispatchEvent(
                            new ShowToastEvent({
                                title: '',
                                message: errMessg,
                                variant: 'error',
                            }),
                        );
                    });
            } else {
                let mess = '';
                if ((this.name == null || this.name == '' || this.name == ' ') && (this.mobile == null || this.mobile == '' || this.mobile == ' ')) {
                    mess = "Name and Mobile cannot be Empty";
                }
                else if ((this.name == null || this.name == '' || this.name == ' ') && this.mobile != null && this.mobile.length == 10) {
                    mess = "Name cannot be Empty";
                }
                else if (this.name != null && (this.mobile == null || this.mobile == '' || this.mobile == ' ')) {
                    mess = "Mobile cannot be Empty";
                }
                else if (this.name != null && this.mobile != null && this.mobile.length < 10) {
                    mess = "Mobile No. Digit's should be 10";
                }
                this.dispatchEvent(
                    new ShowToastEvent({
                        title: 'Cannot Save',
                        message: mess,
                        variant: 'error',
                    }),
                );
            }
        } catch (error) {
            console.log('Error ', error.message);
        }
    }
    clickBack() {
        fireEvent(this.pageRef, 'homeScreen', 'homeScreen');
    }

    cancelAccount() {
        fireEvent(this.pageRef, 'homeScreen', 'homeScreen');
    }
}