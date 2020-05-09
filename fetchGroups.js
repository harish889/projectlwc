import { LightningElement, wire, track } from 'lwc';
import fetchAllGroups from '@salesforce/apex/AllGroupInfoservice.fetchAllGroups';
import { ShowToastEvent } from 'lightning/platformShowToastEvent';
export default class FetchGroups extends LightningElement { 
    @track groupList;
     @wire(fetchAllGroups)
    wiredCarType({data, error}){
        if(data){
            this.groupList = [{value:'', label:'All Types'}];
            data.forEach(element => {
                const IndividualGroups = {};
                IndividualGroups.label = element.DeveloperName;
                IndividualGroups.value = element.Id;
                this.groupList.push(IndividualGroups);
            });
        } else if(error){
            this.showToast('ERROR', error.body.message, 'error');
        }
    }
    SelectedGroup(event){
        const GropuId=event.detail.value;
        const SendGroupid=new CustomEvent('groupsid',{
            detail: GropuId
        });
        this.dispatchEvent(SendGroupid);
    }

 showToast(title, message, variant) {
        const evt = new ShowToastEvent({
            title: title,
            message: message,
            variant: variant,
        });
        this.dispatchEvent(evt);
    }  
}