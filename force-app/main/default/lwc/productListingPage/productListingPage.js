import { LightningElement, wire, track,api } from 'lwc';
import getProduct from '@salesforce/apex/CommonUtilController.getProduct';
import { ShowToastEvent } from 'lightning/platformShowToastEvent';
import { NavigationMixin , CurrentPageReference} from 'lightning/navigation';
import {fireEvent} from 'c/pubsub';

export default class ProductListingPage extends LightningElement {
    @wire(CurrentPageReference)pageRef;
    @track search = '';
    @track productData = [];
    counter = 1;
    @track pageSize = 10;
    @track items = [];
    @track pagination = [];
    @track startingRecord = 1; 
    @track endingRecord = 0; 
    @track totalPage = 0; 
    @track strSearchProdName = '';
    @track totalRecountCount = 0;
    @track spinner = true;
    @track pageCounter = 1;

    @wire(getProduct,{searchKey:'$search'})
    wiredData(result){
        console.log('Data in listing : ',result);
        if (result.data) {
            this.items = result.data;
            this.totalRecountCount = this.items.length; 
            this.totalPage = Math.ceil(this.totalRecountCount / this.pageSize); 
            this.endingRecord = this.pageSize;
            this.productData = this.items.slice(0,this.pageSize); 
        }
    }

    handleClick(event){
        console.log('Product Clicked : ',event.currentTarget.dataset.id);
        var data = [];
        this.productData.every(Element=>{
            if (Element.Id ===  event.currentTarget.dataset.id) {
                console.log('IN true');
                data.push({Id:Element.Id,quantity:1,price:Element.Mrp,Name:Element.Name,code:Element.Code,sr:this.counter,Description:Element.Description});
                this.counter++;
                return false;
            }else{
                console.log('IN false');
                return true;
            }
        });
        console.log('Product : ',data);
        fireEvent(this.pageRef,'SendProduct',data);
    }

    handleSearch(event){
        this.search = event.detail.value;
    }
}