import { LightningElement, api, track, wire } from 'lwc';
import { registerListener, unregisterAllListeners, fireEvent } from 'c/pubsub';
import {
    CurrentPageReference
  } from 'lightning/navigation';

export default class ProductCard extends LightningElement {
    @wire(CurrentPageReference) pageRef;
    @api productdata;
    @track pipe1 = false;
    @track pipe2 = false;
    @track symbol = ' | ';
    @track stockStatusColor;
    @track tags = [];
    connectedCallback() {
        console.log('Product data in product Card ',this.productdata.Color, this.productdata.UOM);
        if(this.productdata.Tag != undefined || this.productdata.Tag != null) {
            this.tags = this.productdata.Tag.split(';');
            console.log('Tags array ',this.tags);
        }
        if(this.productdata.Color && this.productdata.Size) {
            this.pipe1 = true;
            this.pipe2 = true;
        }
        else if(this.productdata.Color) {
            this.pipe1 = true;
        }
        else if(this.productdata.Size) {
            this.pipe2 = true;
        }
        else {
            this.pipe1 = false;
            this.pipe2 = false;
        }

        //Check Stock Status
        if(this.productdata.StockStatus == 'In Stock') {}
    }

    getQuantity(event) {
        console.log('Quantity ',event.target.value);
        var addproduct = {'ProductId':this.productdata.Id, 'Quantity': event.target.value, 'UnitPrice': this.productdata.UnitPrice, 'ProductCode': this.productdata.ProductCode, 'Color': this.productdata.Color};
        fireEvent(this.pageRef, 'getProductData', addproduct);
    }
}