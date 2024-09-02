import { LightningElement, api, wire, track } from "lwc";
import getCustomMetaData from "@salesforce/apex/LWC_BusinessUnitProfilesController.getCustomMetaData";

export default class BusinessUnitProfileTab extends LightningElement {
  @api recordId;
  @api objectApiName;
  @api parentRecId;
  @api profileId;
  @api profileName;
  @track sections = [];

  @wire(getCustomMetaData, { objectName: "$objectApiName", businessUnit: "$profileName" })
  wiredSections({ error, data }) {
    if (data) {
      this.sections = data.map((x) => ({ ...x, fieldList: x.Field_List__c.split(",") }));
      console.log("Sections: ", this.sections);
    } else if (error) {
      console.error(error);
    }
  }
}
