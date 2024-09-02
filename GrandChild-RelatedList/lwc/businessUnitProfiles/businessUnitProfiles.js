import { LightningElement, api, wire } from "lwc";
import { getRecord, getFieldValue } from "lightning/uiRecordApi";
import { getRelatedListRecords } from "lightning/uiRelatedListApi";

export default class BusinessUnitProfiles extends LightningElement {
  @api recordId;
  @api objectApiName;
  @api relatedObject;
  @api parentRecordField;

  @wire(getRecord, { recordId: "$recordId", fields: "$parentRecordField" })
  parent;

  get parentRecId() {
    return getFieldValue(this.parent.data, this.parentRecordField);
  }
  get hasRecords() {
    return this.profiles.data?.records.length;
  }

  @wire(getRelatedListRecords, { parentRecordId: "$parentRecId", relatedListId: "$relatedObject" })
  profiles;
}
