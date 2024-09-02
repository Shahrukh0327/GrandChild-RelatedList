import { LightningElement, api, wire, track } from "lwc";
import { getObjectInfo } from "lightning/uiObjectInfoApi";
import { NavigationMixin } from "lightning/navigation";
import getLinkFileId from "@salesforce/apex/LWC_BusinessUnitProfilesController.getLinkFileId";
import getsObjectRecord from "@salesforce/apex/LWC_BusinessUnitProfilesController.getsObjectRecord";
import BusinessUnitProfileSectionModal from "c/businessUnitProfileSectionModal";
export default class BusinessUnitProfileSection extends NavigationMixin(LightningElement) {
  @api recordId;
  @api parentRecId;
  @api profileId;
  @api section;
  @track records = [];
  @track fields = [];
  isFileList;
  FileParent;
  FileLinkObject;
  fileLinkId;
  recordCount = 0;
  viewAllLink;

  @wire(getObjectInfo, { objectApiName: "$section.Object__c" })
  oppInfo({ data }) {
    if (data) {
      this.fields = this.section.fieldList.map((f) => ({ label: data.fields[f].label, fieldName: f }));
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
      this.isFileList = this.section.Is_File_Section__c;
      if (this.isFileList) {
        this.FileLinkObject = this.section.AddFileObject__c;
        this.FileParent = this.section.FileParent__c;
        this.records = data
          .slice(0, this.section.NumberofRecords__c)
          .map((d) => ({ id: d.Id, url: "/" + d.Id, title: d.Title }));
      } else {
        this.records = data.slice(0, this.section.NumberofRecords__c).map((d) => ({ id: d.Id, url: "/" + d.Id }));
      }

      this.recordCount =
        data.length > this.section.NumberofRecords__c ? this.section.NumberofRecords__c + "+" : data.length;
      this.template.querySelector(".slds-page-header").classList.toggle("border-bottom", this.records.length);
    } else if (error) {
      console.error(error);
    }
  }
  @wire(getLinkFileId, {
    profileId: "$profileId",
    FileParent: "$FileParent",
    FileLinkObject: "$FileLinkObject"
  })
  fileInfo({ error, data }) {
    if (data) {
      if (data.length !== 0) this.fileLinkId = data[0].Id;
    } else if (error) {
      console.error(error);
    }
  }

  handleViewAll() {
    this[NavigationMixin.Navigate]({
      type: "standard__navItemPage",
      attributes: {
        apiName: "Business_Unit_Related_List"
      },
      state: {
        c__profileId: this.profileId,
        c__parentRecId: this.parentRecId,
        c__sectionId: this.section.Id,
        c__recordId: this.recordId
      }
    });
  }

  previewHandler(event) {
    this[NavigationMixin.Navigate]({
      type: "standard__namedPage",
      attributes: {
        pageName: "filePreview"
      },
      state: {
        selectedRecordId: event.target.dataset.id
      }
    });
  }

  handleOnselectMenuItem(event) {
    let selectedMenu = event.detail.value;
    if (selectedMenu === "add_files") {
      this.handleRecord();
    }
  }

  handleUploadFinished(detail) {
    const { files } = detail;
    let fileCount = this.records.length;
    files.forEach((g) => {
      fileCount++;
      if (this.records.length < this.section.NumberofRecords__c) {
        let fileName = g.name.substring(0, g.name.lastIndexOf("."));
        let obj = {
          title: fileName,
          id: g.documentId,
          url: `/${g.documentId}`
        };
        this.records.push(obj);
      }
    });
    this.recordCount =
      fileCount > this.section.NumberofRecords__c ? this.section.NumberofRecords__c + "+" : this.records.length;
  }

  handleRecord() {
    console.log(this.fileLinkId);
    BusinessUnitProfileSectionModal.open({
      size: "small", //small, medium, or large default :medium
      currentRecordId: this.fileLinkId,
      label: "Add File",
      onselectrec: (e) => {
        e.stopPropagation();
        this.handleUploadFinished(e.detail);
      }
    });
  }
}
