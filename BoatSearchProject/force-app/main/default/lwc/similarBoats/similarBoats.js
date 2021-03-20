// imports
import { LightningElement, api, wire } from 'lwc';
import { NavigationMixin } from 'lightning/navigation';
// import getSimilarBoats
import getSimilarBoats from '@salesforce/apex/BoatDataService.getSimilarBoats';
export default class SimilarBoats extends NavigationMixin(LightningElement) {
    // Private
    currentBoat;
    relatedBoats;
   // @api recordId;
    boatId;
    error;
    
    // public
  @api  get recordId() {
        // returns the boatId
        return this.boatId;
      }
      set recordId(value) {
          // sets the boatId value          
          this.boatId = value;
          // sets the boatId attribute
          
      }
    
    // public
    @api similarBy;
    
    // Wire custom Apex call, using the import named getSimilarBoats
    // Populates the relatedBoats list
    @wire(getSimilarBoats, { boatId: '$recordId', similarBy: '$similarBy' })    
    similarBoats({ error, data }) {
        console.log('currentRecordata'+data);
        if (data) {
            this.relatedBoats = data;
            this.error = undefined;
            
        } else if(error) {
            this.relatedBoats = undefined;
            this.error = error;
        }
     }
    get getTitle() {
      return 'Similar boats by ' + this.similarBy;
    }
    get noBoats() {
      return !(this.relatedBoats && this.relatedBoats.length > 0);
    }
    
    // Navigate to record page
    openBoatDetailPage(event) { 
        this[NavigationMixin.Navigate]({
            type: 'standard__recordPage',
            attributes: {
                recordId: event.detail.boatId,
                objectApiName: BOAT_OBJECT,
                actionName: 'view'
            },
        });
    }
  }