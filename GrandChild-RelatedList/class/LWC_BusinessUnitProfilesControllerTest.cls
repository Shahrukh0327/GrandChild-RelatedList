/**
 * @description       : Test class for LWC_BusinessUnitProfilesController
 * @author            : shahrukh.ahmed@merkle.com
 * @group             :
 * @last modified on  : 12-02-2024
 * @last modified by  : shahrukh.ahmed@merkle.com
 **/
@IsTest
public with sharing class LWC_BusinessUnitProfilesControllerTest {
	@IsTest
	static void getsObjectRecordTest() {
		String objectName = 'Account';
		String businessUnit = 'ALB';
		List<BusinessUnitSection__mdt> section = LWC_BusinessUnitProfilesController.getCustomMetaData(
			objectName,
			businessUnit,
			null
		);
		Id accountId = TestUtility.getFakeId(Account.SObjectType);
		LWC_BusinessUnitProfilesController.getsObjectRecord(accountId, accountId, accountId, section[1]);
		LWC_BusinessUnitProfilesController.getsObjectRecord(accountId, accountId, accountId, section[2]);
	}

	@IsTest
	static void getLinkFileIdTest() {
		String objectName = 'Account';
		String businessUnit = 'ALB';
		List<BusinessUnitSection__mdt> section = LWC_BusinessUnitProfilesController.getCustomMetaData(
			objectName,
			businessUnit,
			null
		);
		Id accountId = TestUtility.getFakeId(Account.SObjectType);
		LWC_BusinessUnitProfilesController.getLinkFileId(accountId, 'AccountProfile__c', 'OutletProfile__c');
	}
}
