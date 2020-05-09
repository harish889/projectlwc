import { LightningElement,track, wire,api } from 'lwc';
import fetchAllUsers from '@salesforce/apex/AllGroupInfoservice.fetchAllUsers';
import { ShowToastEvent } from 'lightning/platformShowToastEvent';
import { NavigationMixin } from 'lightning/navigation';
export default class DynamicUserFetch extends NavigationMixin(LightningElement) {
    @track  groupid="";
    @track Alluserlist;
    handlegrooup(event){
      const  groupname=event.detail;
        this.groupid=groupname;
       
    }
@wire(fetchAllUsers,{ids :"$groupid"})
WiredGroups({data,error}){
    if(data){
       this.Alluserlist=data;
        }
        else if(error){
            this.showToast('ERROR', error.body.message, 'error');
        }
       
    } 
    showToast(title, message, variant) {
        const evt = new ShowToastEvent({
            title: title,
            message: message,
            variant: variant,
        });
        this.dispatchEvent(evt);
    }
    navigateToEditRecordPage(event){
        const recid=event.target.name;
        this[NavigationMixin.Navigate]({
            type:'standard__recordPage',
            attributes:{
                "recordId":recid,
                "objectApiName":"User",
                "actionName": "view"
            }
        });
    } 
}
