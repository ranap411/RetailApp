import {
    LightningElement,
    wire,
    api,
    track
} from 'lwc';
import loggedUser from '@salesforce/apex/retailAppController.loggedUsers';
import setLocation from "@salesforce/apex/retailAppController.setLocation";
import UpdateDailyLog from "@salesforce/apex/retailAppController.UpdateDailyLog";
import { loadScript, loadStyle } from 'lightning/platformResourceLoader';
import WebcamJS from '@salesforce/resourceUrl/WebcamJS';
//import CameraJS from '@salesforce/resourceUrl/FullCalendarJS';
import {
    registerListener,
    unregisterAllListeners,
    fireEvent
} from 'c/pubsub';
import {
    CurrentPageReference
} from 'lightning/navigation';
import {
    createRecord
} from 'lightning/uiRecordApi';
import {
    ShowToastEvent
} from 'lightning/platformShowToastEvent';
import ATTENDANCE_OBJECT from '@salesforce/schema/Daily_Log__c';
import STATE_FIELD from '@salesforce/schema/Daily_Log__c.Status__c';
import USER_FIELD from '@salesforce/schema/Daily_Log__c.Id';
//import ATTENDANCE_DATE_FIELD from '@salesforce/schema/Daily_Log__c.Attendance_D__c';
export default class Attendance extends LightningElement {
    @wire(CurrentPageReference) pageRef;
    @track existingImage;
    @track userData;
    @track error;
    @track StatusVal = 'Not Working';
    @track autoplay = false;
    @track isButtonDisabled = false;
    @track Imageval = true;
    @track UpdateType;
    @api recordId;
    @track IsCheckout = false;
    @track location = {};
    @track CheckIn = false;
    @track CheckOut = false;
    @track Lat;
    @track Long;
    @track hourDiff;
    @track ShowClockInTime;
    @track ShowClockOutTime;

    @track data;
    @track fileName = '';
    @track UploadFile = 'Upload File';
    @track showLoadingSpinner = false;
    @track isTrue = false;
    selectedRecords;
    filesUploaded = [];
    file;
    fileContents;
    fileReader;
    content;

    recordInput;
    username;
    email;
    phone;
    designation;
    record;
    stage;
    atRecordId;
    ClockOutTime;
    ClockInTime;

    renderedCallback() {
         /*Promise.all([
            loadScript(this, WebcamJS + '/webcamjs-master/webcam.js'),
            loadScript(this, WebcamJS+ '/webcamjs-master/webcam.min.js'),
        ])
            .then(() => {
                Webcam.attach( '#my_camera' );
            })
            .catch(error => {
                console.log('Error js loading : ',error)
                this.dispatchEvent(
                    new ShowToastEvent({
                        title: 'Error loading D3',
                        message:'',
                        variant: 'error'
                    })
                );
            });*/
    }
    connectedCallback() {
        if (navigator.geolocation) {
            navigator.geolocation.getCurrentPosition((position) => {
                this.Lat = position.coords.latitude;
                this.Long = position.coords.longitude;
                
            });
          } else {
            console.log('Geolocation is not supported by browser');
        }
        Promise.all([
            loadScript(this, WebcamJS + '/webcamjs-master/webcam.js'),
            loadScript(this, WebcamJS+ '/webcamjs-master/webcam.min.js'),
        ])
            .then(() => {
                Webcam.attach( '#my_camera' );
            })
            .catch(error => {
                console.log('Error js loading : ',error)
                this.dispatchEvent(
                    new ShowToastEvent({
                        title: 'Error loading D3',
                        message:'',
                        variant: 'error'
                    })
                );
            });
        loggedUser()
        .then( result => {
            this.userData = result;
            this.recordId = this.userData.Id;
            this.username = this.userData.name;
            this.email = this.userData.Email;
            this.phone = this.userData.Phone;
            this.designation = this.userData.Title;
            this.atRecordId = this.userData.atRecordId;
            this.ClockInTime = this.userData.ClockInTime.split(".");
            if( this.userData.ClockInTime !== undefined){
                var str = this.userData.ClockInTime.split(":");
                this.ShowClockInTime = str[0]+':'+str[1];
                this.CheckIn = true;
            }
            console.log('Logged in user details ',this.userData);
            if(this.userData.stage !== undefined){
                console.log('status ',this.userData.stage);

                if( this.userData.ClockOutTime === undefined){
                    this.IsCheckout = true;
                }else{
                    var co = this.userData.ClockOutTime.split(":");
                    this.ShowClockOutTime = co[0]+':'+co[1];
                    this.StatusVal = 'Completed';
                    this.CheckOut = true;
                }
                                
                if(this.userData.stage === 'Present'){
                    this.StatusVal = 'On Duty';
                    if( this.userData.ClockOutTime !== undefined){
                        this.StatusVal = 'Completed';
                    }
                    
                }else if(this.userData.stage === 'Absent'){
                    this.StatusVal = 'On Leave';
                    this.IsCheckout = false;
                    this.CheckIn = false;
                }
                
                this.isButtonDisabled = false;
            }else{
                this.StatusVal = 'Not Working';
                this.isButtonDisabled = true;
            }
        })
        .catch( error => {
            this.error = error;
            console.log('Error on logged in users ',this.error);
        })
        this.existingImage = 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcRS9soUN_EBKY2xnoRK1uVIpCC4FVtUp9xII7coYYB5rrGK50sI&shttps://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcRS9soUN_EBKY2xnoRK1uVIpCC4FVtUp9xII7coYYB5rrGK50sI&s';
    }
 
    disconnectedCallback() {
        // unsubscribe from Listeners
        unregisterAllListeners(this);
    }

    get acceptedFormats() {
        return ['.png', '.jpg', '.jpeg'];
    }

    markAttendance(event) {
        console.log('update type',event.currentTarget.dataset.id);
        console.log('This Lat : ',this.Lat);
        console.log('This Long : ',this.Long);
            if(event.currentTarget.dataset.id === 'clockout'){
                this.UpdateType = 'ClockOut';
                this.recordInput = {"UpdateType":this.UpdateType,"Id": this.userData.atRecordId, "Status": event.currentTarget.dataset.id,"Clock_Out_Lat":this.Lat,"Clock_Out_Long":this.Long};
            }else{
                this.UpdateType = 'ClockIn';
                this.recordInput = {"UpdateType":this.UpdateType,"Id": this.userData.atRecordId, "Status": event.currentTarget.dataset.id,"Clock_In_Lat":this.Lat,"Clock_In_Long":this.Long};
                this.isButtonDisabled = true;
            }
         
            console.log('Attendance record ',this.recordInput);
            UpdateDailyLog({logdata : this.recordInput})
                .then(result => {
                    this.dispatchEvent(
                        new ShowToastEvent({
                            title: 'Success',
                            message: 'Attendance marked successfully',
                            variant: 'success',
                        }),
                    );
                    fireEvent(this.pageRef, 'homeScreen', 'homeScreen');
                })
                .catch(error => {
                    this.dispatchEvent(
                        new ShowToastEvent({
                            title: 'Error creating record',
                            message: error,
                            variant: 'error',
                        }),
                    );
                });
                this.calculateHours();
    }
    homeScreen() {
        fireEvent(this.pageRef, 'homeScreen', 'homeScreen');
    }

    handleUploadFinished(event){
        try{
         console.log('handleUploadFinished target : ',event.detail.files);
        // Get the list of uploaded files
        this.filesUploaded = event.detail.files;
        this.fileName = event.detail.files[0].name;
        this.file = this.filesUploaded[0];
        // create a FileReader object 
        this.fileReader= new FileReader();
        // set onload function of FileReader object 
        console.log('1..... '); 
        this.fileReader.onloadend = (() => {
        console.log('2..... ');
        this.fileContents = this.fileReader.result;
        let base64 = 'base64,';
        console.log('3..... ');
        this.content = this.fileContents.indexOf(base64) + base64.length;
        this.fileContents = this.fileContents.substring(this.content);
        console.log('4..... ');
            this.saveToFile();
        });

        console.log('5..... ');
        }catch(error){
            console.log('Error in handleUploadFinished function : ',error);
        }
      
        
      }

          // Calling apex class to insert the file
    saveToFile() {
        console.log('in savetoFile Function ');
        saveFile({ idParent: this.recordId, strFileName: this.file.name, base64Data: encodeURIComponent(this.fileContents)})
        .then(result => {
            console.log('result ====> ' +result);
            // refreshing the datatable
            //this.getRelatedFiles();

            this.fileName = this.fileName + ' - Uploaded Successfully';
            this.UploadFile = 'File Uploaded Successfully';
                       // Showing Success message after file insert
            this.dispatchEvent(
                new ShowToastEvent({
                    title: 'Success!!',
                    message: this.file.name + ' - Uploaded Successfully!!!',
                    variant: 'success',
                }),
            );

        })
        .catch(error => {
            // Showing errors if any while inserting the files
            console.log(error);
            this.dispatchEvent(
                new ShowToastEvent({
                    title: 'Error while uploading File',
                    message: error.message,
                    variant: 'error',
                }),
            );
        });
    }

    calculateHours(){
        var today = new Date();
        var date1 = today.getFullYear()+'/'+(today.getMonth()+1)+'/'+today.getDate();
        var clockOuttime = today.getHours() + ":" + today.getMinutes() + ":" + today.getSeconds();
        var clockint = ClockInTime[0];
        var timeStart = new Date(date1+' '+clockint[0]);
        var timeEnd = new Date(date1+' '+clockOuttime);
        var res = Math.abs(date1 - date2) / 1000;
        // get hours        
        var hours = Math.floor(res / 3600) % 24;                
        // get minutes
        var minutes = Math.floor(res / 60) % 60; 
        var difference = timeEnd - timeStart;
        var diff_result = new Date(difference);
        this.hourDiff = diff_result.getHours();
        console.log('Today : ',today.getHours());
        console.log('ClockInTime : ',this.ClockInTime);
        console.log('date1 : ',date1);
        console.log('clockOuttime : ',clockOuttime); 
        console.log('timeStart : ',timeStart);
        console.log('timeEnd : ',timeEnd);
        console.log('total hours : ',hourDiff);
    }
    convertTime(time){

    }
    
}