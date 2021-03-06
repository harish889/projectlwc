import { LightningElement, track, api,wire } from 'lwc';
import {APPLICATION_SCOPE, MessageContext, subscribe} from 'lightning/messageService';
import {NavigationMixin} from 'lightning/navigation';
import {getFieldValue, getRecord} from 'lightning/uiRecordApi';
import labelAddReview from '@salesforce/label/c.Add_Review';
import labelDetails from '@salesforce/label/c.Details';
import labelFullDetails from '@salesforce/label/c.Full_Details';
import labelReviews from '@salesforce/label/c.Reviews';
import labelPleaseSelectABoat from '@salesforce/label/c.Please_select_a_boat';
import {refreshApex} from '@salesforce/apex';
import BOATMC from '@salesforce/messageChannel/BoatMessageChannel__c';
import BOAT_TYPE_FIELD from '@salesforce/schema/Boat__c.BoatType__c';
import BOAT_ID_FIELD from '@salesforce/schema/Boat__c.Id';
import BOAT_DESCRIPTION_FIELD from '@salesforce/schema/Boat__c.Description__c';
import BOAT_NAME_FIELD from '@salesforce/schema/Boat__c.Name';
import BOAT_LENGTH_FIELD from '@salesforce/schema/Boat__c.Length__c';
import BOAT_PRICE_FIELD from '@salesforce/schema/Boat__c.Price__c';//
const BOAT_FIELDS=[BOAT_TYPE_FIELD,BOAT_ID_FIELD,BOAT_DESCRIPTION_FIELD,BOAT_NAME_FIELD,BOAT_LENGTH_FIELD,BOAT_PRICE_FIELD];

export default class BoatDetailTabs extends NavigationMixin(LightningElement) {
   
   @api boatId;
  wiredRecord;
  label = {
    labelDetails,
    labelReviews,
    labelAddReview,
    labelFullDetails,
    labelPleaseSelectABoat,
  };
  // Decide when to show or hide the icon
  // returns 'utility:anchor' or null
  get detailsTabIconName() {
    return this.wiredRecord && this.wiredRecord.data ? 'utility:anchor' : null;
   }
  
  // Utilize getFieldValue to extract the boat name from the record wire
  @wire(getRecord,{recordId: '$boatId',fields: BOAT_FIELDS})
  wiredRecord;
  get boatName() {
    return getFieldValue(this.wiredRecord.data, BOAT_NAME_FIELD);
   }
  
  // Private
  subscription = null;
  // Initialize messageContext for Message Service
@wire(MessageContext)
messageContext;
  
  // Subscribe to the message channel
  subscribeMC() {
    if(this.subscription) { return; }
    // local boatId must receive the recordId from the message
    this.subscription = subscribe(
        this.messageContext, 
        BOATMC, 
        (message) => {
            this.boatId = message.recordId;
        }, 
        { scope: APPLICATION_SCOPE }
    );
  }
  
 
  connectedCallback() { 
    this.subscribeMC();
  }
  handleReviewCreated() {
    this.template.querySelector('lightning-tabset').activeTabValue = 'reviews';
    this.template.querySelector('c-boat-reviews').refresh();  
   }
  // Navigates to record page
  navigateToRecordViewPage() {
    this[NavigationMixin.Navigate]({
      type: "standard__recordPage",
      attributes: {
          recordId: this.boatId,
          actionName: "view"
      }
  });
   }
}