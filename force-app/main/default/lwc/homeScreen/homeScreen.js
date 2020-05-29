import {
    LightningElement,
    wire,
    track
} from 'lwc';
import {
    registerListener,
    unregisterAllListeners,
    fireEvent
} from 'c/pubsub';
import {
    CurrentPageReference, NavigationMixin
} from 'lightning/navigation';

export default class HomeScreen extends NavigationMixin(LightningElement) {
    @wire(CurrentPageReference) pageRef;
    @track homeScreen = true;
    @track attendanceScreen = false;
    @track attendanceCalender = false;
    @track searchCustomer = false;
    @track showTour = false;
    @track newCustomer = false;
    renderedCallback() {
    
        const style = document.createElement('style');
        style.innerText = `c-home-screen .slds-card {
            background-color: white;
            display: block;
            margin-top:-25px;
        }`;
        this.template.querySelector('lightning-card').appendChild(style);

        registerListener('homeScreen', this.showHomeScreen, this);
        registerListener('handleBackFromCustomer', this.showHomeScreen, this);
        registerListener('clickBeat', this.clickSearchCustomer, this);
    }

    showHomeScreen() {
        this.homeScreen = true;
        this.attendanceScreen = false;
        this.searchCustomer = false;
        this.attendanceCalender = false;
        this.showTour = false;
        this.newCustomer = false;
    }
    clickAttendance() {
        console.log('Click Attendance');
        this.attendanceScreen = true;
        this.homeScreen = false;
        this.attendanceCalender = false;
        this.searchCustomer = false;
        this.showTour = false;
        this.newCustomer = false;
    }
    clickBox() {
        this.attendanceCalender = true;
        this.homeScreen = false;
        this.attendanceScreen = false;
        this.searchCustomer = false;
        this.showTour = false;
        this.newCustomer = false;
    }

    clickSearchCustomer(bool) {
        if (bool.bool) {
            console.log('Click from Beat, Home Screen ', bool.accountId);
            fireEvent(this.pageRef, 'handleShowTabs', bool.accountId);
            this.searchCustomer = false;
            this.attendanceCalender = false;
            this.homeScreen = false;
            this.attendanceScreen = false;
            this.showTour = false;
            this.newCustomer = false;
        }else{
            console.log('Click Show Customer');
            this.searchCustomer = true;
            this.attendanceCalender = false;
            this.homeScreen = false;
            this.attendanceScreen = false;
            this.showTour = false;
            this.newCustomer = false;
        }
      
    }
    clickShowTour() {
        this.showTour = true;
        this.searchCustomer = false;
        this.attendanceCalender = false;
        this.homeScreen = false;
        this.attendanceScreen = false;
        this.newCustomer = false;
    }
    clickAddCustomer() {
        this.showTour = false;
        this.searchCustomer = false;
        this.attendanceCalender = false;
        this.homeScreen = false;
        this.attendanceScreen = false;
        this.newCustomer = true;
    }
    disconnectedCallback() {
        // unsubscribe from Listeners
        unregisterAllListeners(this);
    }
}