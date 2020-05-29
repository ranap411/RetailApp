import { LightningElement, api, wire, track } from 'lwc';
import getAccount from '@salesforce/apex/leactherTechController.getCustomerDetail';
import Whatsapp from '@salesforce/resourceUrl/Whatsapp';
import Phone from '@salesforce/resourceUrl/Phone';
import Location from '@salesforce/resourceUrl/Location';
import Direction from '@salesforce/resourceUrl/Direction';

export default class CustomerDetail extends LightningElement {
    @api recordid;
    @track account;

    Whatsapp = Whatsapp;
    Phone = Phone;
    Location = Location;
    Direction = Direction;

    @wire(getAccount,{accountId:'$recordid'})
    wiredData(result){
        console.log('Data in customer info : ',result);
        if (result.data != undefined) {
            this.account = result.data;
        }
    }
}