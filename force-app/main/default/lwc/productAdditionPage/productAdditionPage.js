import { LightningElement,track, api,wire } from 'lwc';
import { ShowToastEvent } from 'lightning/platformShowToastEvent';
import { NavigationMixin , CurrentPageReference} from 'lightning/navigation';
import {fireEvent,registerListener,unregisterAllListeners} from 'c/pubsub';
import saveEnquiry from '@salesforce/apex/CommonUtilController.createEnquiry';

export default class ProductAdditionPage extends NavigationMixin(LightningElement) {
    @track productData = [];
    uniqueData;
    @wire(CurrentPageReference)pageRef;
    @track noData = false;

    renderedCallback(){
        registerListener('SendProduct',this.setData,this);
        registerListener('SaveData',this.handleSaveFromParent,this);
    }

    handleSaveFromParent(temp){
        console.log('Fire Event : ',temp);
        
        if (this.productData.length == 0) {
            this.showToast('Please add one line item','warning','warning');
            return;
        }
        temp['lineItems'] = this.productData;
        saveEnquiry({dataMap:temp})
        .then(result=>{
            console.log('response : ',result);
        })
        .catch(error=>{
            console.log('error : ',error);
        })
    }

    connectedCallback(){
        this.uniqueData = new Map();
    }

    disconnectedCallback(){
        unregisterAllListeners(this);
    }

    setData(temp){
        this.noData = true;
        console.log('Event captured : ',temp);
        temp.forEach(Element => {
            if (!this.uniqueData.has(Element.Id)) {
                this.uniqueData.set(Element.Id,Element);
                this.productData.push({Id:Element.Id,quantity:1,price:Element.price,Name:Element.Name,code:Element.Code,sr:this.productData.length + 1,Description:Element.Description});
            }
        });
        console.log('This.product data : ',this.productData);
    }

    handleRemove(event){
        this.productData = this.productData.filter(element=>{
            return element.Id !== event.currentTarget.dataset.id;
        })
        this.noData = this.productData.length > 0 ? true : false;
        console.log('Product : ',this.productData);
    }

    showToast(msg,variant,title) {
        console.log('taost fired');
        const event = new ShowToastEvent({
            title: title,
            message: msg,
            variant: variant,
            mode: 'dismissable'
        });
        this.dispatchEvent(event);
    }
}