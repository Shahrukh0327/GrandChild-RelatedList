import { LightningElement, wire, track } from "lwc";
import { CurrentPageReference, NavigationMixin } from "lightning/navigation";
import { getObjectInfo } from "lightning/uiObjectInfoApi";
import { getRecord } from "lightning/uiRecordApi";
import getCustomMetaData from "@salesforce/apex/LWC_BusinessUnitProfilesController.getCustomMetaData";
import getsObjectRecord from "@salesforce/apex/LWC_BusinessUnitProfilesController.getsObjectRecord";

// TODO: Add Sort and Filtering
export default class BusinessUnitRelatedList extends NavigationMixin(LightningElement) {
  profileId;
  parentRecId;
  recordId;
  sectionId;
  soqlLimit = 100;
  section;
  @track fields = [];
  @track records = [];
  recordCountLabel;
  lastUpdated = Date.now();
  parentRecordUrl;
  parentObjectUrl;
  isLoading = true;

  @wire(CurrentPageReference)
  wiredPageReference(pageRef) {
    this.profileId = pageRef.state.c__profileId;
    this.parentRecId = pageRef.state.c__parentRecId;
    this.sectionId = pageRef.state.c__sectionId;
    this.recordId = pageRef.state.c__recordId;
    if (!this.profileId || !this.parentRecId || !this.sectionId || !this.recordId) {
      this.isLoading = false;
    }
  }

  @wire(getRecord, { recordId: "$parentRecId", layoutTypes: "Compact" })
  parentRecord;
  @wire(getObjectInfo, { objectApiName: "$parentRecord.data.apiName" })
  parentObjectInfo;

  get parentRecordName() {
    return this.parentRecord.data?.fields.Name.value;
  }
  get parentObjectName() {
    return this.parentObjectInfo.data?.labelPlural;
  }

  connectedCallback() {
    this[NavigationMixin.GenerateUrl]({
      type: "standard__recordPage",
      attributes: { recordId: this.parentRecId, actionName: "view" }
    }).then((url) => {
      this.parentRecordUrl = url;
    });
    this[NavigationMixin.GenerateUrl]({
      type: "standard__objectPage",
      attributes: { objectApiName: this.parentRecord.apiName, actionName: "list" }
    }).then((url) => {
      this.parentObjectUrl = url;
    });
  }

  @wire(getObjectInfo, { objectApiName: "$section.Object__c" })
  oppInfo({ data }) {
    if (data) {
      this.fields = [];
      if (this.section.RecordTitleField__c) {
        this.fields.push({
          label: data.fields[this.section.RecordTitleField__c].label,
          fieldName: "url",
          type: "url",
          typeAttributes: { label: { fieldName: this.section.RecordTitleField__c } }
        });
      }
      this.fields.push(...this.section.fieldList.map((f) => ({ label: data.fields[f].label, fieldName: f })));
    }
  }

  @wire(getCustomMetaData, { sectionId: "$sectionId" })
  wiredSection({ error, data }) {
    if (data) {
      this.section = data.map((x) => ({ ...x, fieldList: x.Field_List__c.split(",") }))[0];
      console.log("Section Metadata: ", this.section);
      if (this.section.Is_File_Section__c) {
        if (this.section.RecordTitleField__c) {
          this.fields.push({
            label: this.section.RecordTitleField__c,
            fieldName: "url",
            type: "url",
            typeAttributes: { label: { fieldName: this.section.RecordTitleField__c } }
          });
        }
        this.fields.push(...this.section.fieldList.map((f) => ({ label: f, fieldName: f })));
      }
    } else if (error) {
      console.error(error);
      this.isLoading = false;
    }
  }

  @wire(getsObjectRecord, {
    recordId: "$recordId",
    parentRecId: "$parentRecId",
    profileId: "$profileId",
    section: "$section"
  })
  wiredRecords({ error, data }) {
    if (data) {
      this.isLoading = false;
      this.records = data.slice(0, this.soqlLimit).map((d) => ({ ...d, url: "/" + d.Id }));
      console.log("Section Data: ", this.records);
      const recordCount = data.length > this.soqlLimit ? this.soqlLimit + "+" : data.length;
      this.recordCountLabel = `${recordCount} ${recordCount === 1 ? "item" : "items"}`;
    } else if (error) {
      console.error(error);
      this.isLoading = false;
    }
  }
}
