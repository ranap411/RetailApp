import { LightningElement, wire, track, api } from 'lwc';
import getProduct from '@salesforce/apex/leactherTechController.getProduct';
import { getPicklistValues } from 'lightning/uiObjectInfoApi';
import Category_FIELD from '@salesforce/schema/Product__c.Category__c';
import { registerListener, unregisterAllListeners, fireEvent } from 'c/pubsub';
import {
    CurrentPageReference
  } from 'lightning/navigation';
  import {
    createRecord
} from 'lightning/uiRecordApi';
import CART from '@salesforce/schema/Cart__c';
import ACCOUNTID from '@salesforce/schema/Cart__c.Account_Id__c';
import COLOR from '@salesforce/schema/Cart__c.Color__c';
import PRODUCTID from '@salesforce/schema/Cart__c.Product_Id__c';
import QUANTITY from '@salesforce/schema/Cart__c.Quantity__c';
import UNITPRICE from '@salesforce/schema/Cart__c.Unit_Price__c';
import TOTALAMOUNT from '@salesforce/schema/Cart__c.Total_Amount__c';
import createCartRecord from '@salesforce/apex/leactherTechController.createCartRecord';
import {
    ShowToastEvent
} from 'lightning/platformShowToastEvent';

export default class AllProducts extends LightningElement {
    @wire(CurrentPageReference) pageRef;
    @track keytosearch;
    @track searchResult;
    @api accountid;
    @track productList;
    @track error;
    @track noResultFound = true;
    @track spinner = true;
    @track quantity = 0;
    wiredResults;
    @track map = [];
    @track productselectedList = [];

    @wire(getProduct)
    products(result) {
        this.wiredResults = result;
        console.log('Result ',result);
        if(result.data) {
            this.productList = result.data;
            this.searchResult = result.data;
            this.error = undefined;
            this.spinner = false;
            this.noResultFound = false;
            //console.log('All product list ',this.productList.Id, this.productList.Color);
        }
        else {
            console.log('Error in all product result ',result);
            this.spinner = true;
            this.error = result.error;
        }
    }
    @wire(getPicklistValues, { recordTypeId: '$objectInfo.data.defaultRecordTypeId', fieldApiName: Category_FIELD})
    CategoryPicklistValues({
        data,
        error
    }) {
        if (data) {
            console.log('Data ', data);
        } else if (error) {
            console.log(error);
        }
    }

    renderedCallback() {
        registerListener('getProductData', this.getProductData, this);
        registerListener('getProductDatatoAddIntoCart', this.getProductDatatoAddIntoCart, this);
        registerListener('handleSearch', this.handleSearch, this);
        if(this.keytosearch != undefined) {
            console.log('key to search ',this.keytosearch);
        }
    }
    getProductDatatoAddIntoCart() {
        console.log('get cart data ');
        if(this.productselectedList != undefined) {
            fireEvent(this.pageRef, 'insertProductCart', this.productselectedList);
        }
    }

    handleSearch(data) {
        this.searchResult = [];
        this.keytosearch = data;
        console.log('Search string ',data, this.keytosearch, this.productList);
        this.searchResult = this.productList.filter(key => key.ProductName.toUpperCase().includes(this.keytosearch) || key.Brand.toUpperCase().includes(this.keytosearch));
        console.log('filtered products ',this.searchResult);
        if(this.searchResult.length > 0) {
            this.noResultFound = false;
            this.spinner = false;
        }
        else {
            this.noResultFound = true;
        }
    }
    /* addProductsIntoCart() {
        if(this.productselectedList != undefined || this.productselectedList != null) {
            console.log('Add product into cart ',this.productselectedList);
            createCartRecord({
                prodList: this.productselectedList
            })
            .then(result => {
                console.log('Cart ',result);
                this.error = undefined;
                if (result == 'Success') {
                    this.dispatchEvent(
                        new ShowToastEvent({
                            title: 'Success',
                            message: 'Product added to Cart',
                            variant: 'success',
                        }),
                    );
                }
                console.log(JSON.stringify(result));
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
                console.log("error", JSON.stringify(this.error));
            });
        }
    } */
    getProductData(details) {
        console.log('Details ',details);
        var data = {
            "ProductId": details.ProductId,
            "Quantity": details.Quantity,
            "Account": this.accountid,
            "UnitPrice": details.UnitPrice,
            "ProductCode": details.ProductCode,
            "Color": details.Color
        }
        var fields = {};
        var list = [];
        this.map[details.ProductId] = data;
        fields = this.map;
        for (var key in fields) {
            // check if the property/key is defined in the object itself, not in parent
            if (fields.hasOwnProperty(key)) {
              list.push(fields[key]);
            }
        }
        console.log('Product Data ',fields, list);
        this.productselectedList = list;
        console.log('Product selected list ',this.productselectedList);
    }
    disconnectedCallback() {
        // unsubscribe from Listeners
        unregisterAllListeners(this);
    }
}