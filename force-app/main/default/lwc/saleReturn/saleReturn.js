import { LightningElement, track, wire } from 'lwc';
import getProduct from '@salesforce/apex/leactherTechController.getProduct';
import { getPicklistValues } from 'lightning/uiObjectInfoApi';
import Category_FIELD from '@salesforce/schema/Product__c.Category__c';
import { registerListener, unregisterAllListeners, fireEvent } from 'c/pubsub';
import {
    CurrentPageReference
  } from 'lightning/navigation';

export default class SaleReturn extends LightningElement {
    @wire(CurrentPageReference) pageRef;
    @track productList;
    @track error;
    @track noResultFound = true;
    @track spinner = true;
    @track quantity = 0;
    @track searchResult;
    @track keytosearch;
    wiredResults;

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
        registerListener('handleSearch', this.handleSearch, this);
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
    /* this.categoryNames = data.values;
            var a = this;
            if (this.categoryImages !== undefined) {
                this.categoriesList = this.categoryNames.map(function (name) {
                    var catImg = a.categoryImages.find(img => img.Name == name.label);
                    if (catImg == null) {
                        catImg = a.categoryImages.find(img => img.Name == 'default');
                    }
                    return ({
                        "catName": name.label,
                        "catImg": catImg.P91L__Picture_Url__c
                    });
                });
                console.log('this.categoriesList ', this.categoriesList);
                this.spinner = false;
            } */
}