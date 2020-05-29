import { LightningElement, api, track } from 'lwc';

export default class SaleReturnCard extends LightningElement {
    @api productdata;
    @track pipe1 = false;
    @track pipe2 = false;
    @track symbol = ' | ';
    @track stockStatusColor;
    @track tags = [];
    connectedCallback() {
        console.log('Product data in product Card ',this.productdata.ProductCode, this.productdata.Tag);
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
}