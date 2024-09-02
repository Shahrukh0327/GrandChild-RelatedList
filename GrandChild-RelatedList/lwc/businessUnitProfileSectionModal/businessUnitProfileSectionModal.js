import { api } from "lwc";
import LightningModal from "lightning/modal";
export default class BusinessUnitProfileSectionModal extends LightningModal {
  @api currentRecordId;

  dispatchUploadFinished(event) {
    const { files } = event.detail;
    const selectEvent = new CustomEvent("selectrec", {
      detail: { files: files }
    });
    this.dispatchEvent(selectEvent);
    this.close("success");
  }
  hideModalBox() {
    this.close("cancelled");
  }
}
