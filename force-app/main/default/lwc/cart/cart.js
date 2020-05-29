/* eslint-disable no-console */
import { LightningElement, track, wire, api } from 'lwc';
import {registerListener,unregisterAllListeners} from 'c/pubsub';
import { CurrentPageReference, NavigationMixin } from 'lightning/navigation'; 
import getCartRecord from '@salesforce/apex/leactherTechController.getCartRecord';
import createOLI from '@salesforce/apex/leactherTechController.insertOrderLineItem';
import { createRecord } from 'lightning/uiRecordApi';
import { ShowToastEvent } from 'lightning/platformShowToastEvent';
import SALES_ORDER_OBJECT from '@salesforce/schema/Sales_Order__c';
import ORDER_DATE from '@salesforce/schema/Sales_Order__c.Order_Date__c';

export default class Cart  extends NavigationMixin(LightningElement) {
    @wire(CurrentPageReference)pageRef;
    @api accountId;
    @track orders = [];
    @track totalUnit =0;
    @track totalAmount=0;
    cartData;
    
    @wire(getCartRecord, { accountId: '$accountId' })
    wiredData(result) {
        try{
        console.log('Data in Cart : ', result);
        if (result.data != undefined) {
            this.cartData = result.data;
            console.log('this.cartData ', this.cartData);
            for (let data of this.cartData){
                console.log('Data ',data);
                this.orders.push({ "Name": data.Product_Code__c, "UnitPrice": data.Unit_Price__c, "Unit": data.Quantity__c, "Amount": data.Total_Amount__c});
                this.totalUnit += data.Quantity__c;
                this.totalAmount += data.Total_Amount__c;
            }
        }
        } catch (error) {
            console.log('Error ', error);
        }
    }

    connectedCallback(){
       
       
    }
    
    renderedCallback(){
        console.log('recordId in Cart', this.accountId); 
        registerListener('clickCheckOut', this.createSalesOrder, this);
    }
    disconnectedCallback(){
        unregisterAllListeners(this);
    }

    createSalesOrder(){
        var today = new Date();
        var dd = String(today.getDate()).padStart(2, '0');
        var mm = String(today.getMonth() + 1).padStart(2, '0');
        var yyyy = today.getFullYear();

        today = yyyy + '-' + mm + '-' + dd;
        console.log('Today date ',today);
        
        const FIELDS = {};

        FIELDS[ORDER_DATE.fieldApiName] = today;

        const recordInput = { apiName: SALES_ORDER_OBJECT.objectApiName, fields:FIELDS };
    
        createRecord(recordInput)
            .then(record => {
                this.salesOrderId = record.id;
                console.log('salesOrderId ', this.salesOrderId);
                this.dispatchEvent(
                    new ShowToastEvent({
                        title: 'Success',
                        message: 'Order created',
                        variant: 'success',
                    }),
                );
                console.log('this.cartData ', this.cartData);
                createOLI({
                    salesOrderId: this.salesOrderId,
                        itemList: this.cartData
                }).then(record => {
                    this.dispatchEvent(
                        new ShowToastEvent({
                            title: 'Success',
                            message: 'OLI created',
                            variant: 'success',
                        }),
                    );
                })
                    .catch(error => {
                        console.log(error);
                        this.dispatchEvent(
                            new ShowToastEvent({
                                title: '',
                                message: 'Error',
                                variant: 'error',
                            }),
                        );
                    });
            })
            .catch(error => {
                console.log(error);
                this.dispatchEvent(
                    new ShowToastEvent({
                        title: '',
                        message: 'Error',
                        variant: 'error',
                    }),
                );
            });
    }
   
}