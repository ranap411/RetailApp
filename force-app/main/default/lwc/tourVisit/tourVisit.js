import { LightningElement, track, wire} from 'lwc';
import { CurrentPageReference, NavigationMixin } from 'lightning/navigation';
import { registerListener, unregisterAllListeners, fireEvent } from 'c/pubsub';
import getBeats from '@salesforce/apex/leactherTechController.getBeatRecords';
export default class TourVisit extends NavigationMixin(LightningElement) {
    @wire(CurrentPageReference) pageRef;
    beatResults;
@track beats;
    // { "beat": "Beat 1", "visit": [{ "Name": "Rahul", "address": "12, Sheetal Nagar" }, { "Name": "Navkar", "address": "12, Sheetal Nagar" }, { "Name": "Jyoti", "address": "12, Sheetal Nagar" }, { "Name": "Saloni", "address": "12, Sheetal Nagar" }]},
    // { "beat": "Beat 2", "visit": [{ "Name": "Kajal", "address": "12, Sheetal Nagar" }, { "Name": "Rahul Verma", "address": "12, Sheetal Nagar" }, { "Name": "Navkar Kushwah", "address": "12, Sheetal Nagar" }, { "Name": "Nancy", "address": "12, Sheetal Nagar" }]},
    // { "beat": "Beat 3", "visit": [{ "Name": "Himanshu", "address": "12, Sheetal Nagar" }, { "Name": "Navkar", "address": "12, Sheetal Nagar" }, { "Name": "Jyoti", "address": "12, Sheetal Nagar" }, { "Name": "Saloni", "address": "12, Sheetal Nagar" }]},
    // { "beat": "Beat 4", "visit": [{ "Name": "Shivam", "address": "12, Sheetal Nagar" }, { "Name": "Amam", "address": "12, Sheetal Nagar" }, { "Name": "Jyoti", "address": "12, Sheetal Nagar" }, { "Name": "Saloni", "address": "12, Sheetal Nagar" }]},
    // { "beat": "Beat 5", "visit": [{ "Name": "Manoj", "address": "12, Sheetal Nagar" }, { "Name": "Ankit", "address": "12, Sheetal Nagar" }, { "Name": "Jyoti", "address": "12, Sheetal Nagar" }, { "Name": "Saloni", "address": "12, Sheetal Nagar" }]},
    // { "beat": "Beat 6", "visit": [{ "Name": "Ayush", "address": "12, Sheetal Nagar" }, { "Name": "Om Prakash", "address": "12, Sheetal Nagar" }, { "Name": "Jyoti", "address": "12, Sheetal Nagar" }, { "Name": "Saloni", "address": "12, Sheetal Nagar" }]},
    // { "beat": "Beat 7", "visit": [{ "Name": "Amit", "address": "12, Sheetal Nagar" }, { "Name": "Hari Om", "address": "12, Sheetal Nagar" }, { "Name": "Jyoti", "address": "12, Sheetal Nagar" }, { "Name": "Saloni", "address": "12, Sheetal Nagar" }] },
    // { "beat": "Beat 8", "visit": [{ "Name": "Sourabh", "address": "12, Sheetal Nagar" }, { "Name": "Mohit", "address": "12, Sheetal Nagar" }, { "Name": "Jyoti", "address": "12, Sheetal Nagar" }, { "Name": "Saloni", "address": "12, Sheetal Nagar" }] },
    // { "beat": "Beat 9", "visit": [{ "Name": "Hitesh", "address": "12, Sheetal Nagar" }, { "Name": "Rohit", "address": "12, Sheetal Nagar" }, { "Name": "Jyoti", "address": "12, Sheetal Nagar" }, { "Name": "Saloni", "address": "12, Sheetal Nagar" }] },
    // { "beat": "Beat 10", "visit": [{ "Name": "Piyush", "address": "12, Sheetal Nagar" }, { "Name": "Naveen", "address": "12, Sheetal Nagar" }, { "Name": "Jyoti", "address": "12, Sheetal Nagar" }, { "Name": "Saloni", "address": "12, Sheetal Nagar" }] },
    

    
    @wire(getBeats)
    beatsData(result) {
        try {
            console.log('Result ', result);
            if (result.data) {
                this.beatResults = result;
                console.log('Result.Data ', this.beatResults.data);
                this.beats = this.beatResults.data;
            }
        } catch (error) {
            console.log('Error ', error);
        }
    }

    clickBack() {
        fireEvent(this.pageRef, 'homeScreen', true);
    } 
    
    clickBeat(){
        console.log('Click Beat');
        fireEvent(this.pageRef, 'clickBeat', { "bool": true, "accountId": "0015w00002DM42nAAD" });
    }
}