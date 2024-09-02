public with sharing class LWC_BusinessUnitProfilesController {
	@AuraEnabled(cacheable=true)
	public static List<sObject> getsObjectRecord(
		Id recordId,
		Id parentRecId,
		Id profileId,
		BusinessUnitSection__mdt section
	) {
		String query;
		query = 'SELECT Id, ' + section.Field_List__c;
		if (section.RecordTitleField__c != null) {
			query += ', ' + section.RecordTitleField__c;
		}
		query += ' FROM ' + section.Object__c;

		if (String.isNotEmpty(section.SubQuery__c)) {
			Set<String> subqueryResult = new Set<String>();
			for (sObject s : Database.query(section.SubQuery__c)) {
				subqueryResult.add(String.valueOf(s.get(section.SubQueryField__c)));
			}
			query += ' WHERE ' + section.WhereClause__c + ' IN :subqueryResult';
		} else {
			query +=
				' WHERE ' +
				section.WhereClause__c +
				' = :parentRecId OR ' +
				section.WhereClause__c +
				' = :profileId';
		}
		query += ' WITH SECURITY_ENFORCED';
		query += ' ORDER BY ' + section.RecordSorting__c + ' LIMIT ' + Integer.valueof(section.NumberofRecords__c + 1);

		return Database.query(String.escapeSingleQuotes(query));
	}

	@AuraEnabled(cacheable=true)
	public static List<sObject> getLinkFileId(Id profileId, String FileParent, String FileLinkObject) {
		String query;
		query = 'SELECT Id';

		query += ' FROM ' + FileLinkObject;
		query += ' WHERE ' + FileParent + ' = :profileId';

		query += ' WITH SECURITY_ENFORCED LIMIT 1';

		return Database.query(String.escapeSingleQuotes(query));
	}
	@AuraEnabled(cacheable=true)
	public static List<BusinessUnitSection__mdt> getCustomMetaData(
		String objectName,
		String businessUnit,
		String sectionId
	) {
		String query;
		query = 'SELECT Id,Label,Section_Name__c,RecordTitleField__c,Field_List__c,SubQueryField__c,Object__c,SubQuery__c,SingleRecordMode__c,WhereClause__c,SectionOrder__c,RecordSorting__c,Icon__c,Parent_Object__c,NumberofRecords__c,BusinessUnit__c,Is_File_Section__c,AddFileObject__c,FileParent__c';
		query += ' FROM BusinessUnitSection__mdt';
		if (objectName != null && businessUnit != null) {
			query += ' WHERE Parent_Object__c = :objectName AND BusinessUnit__c = :businessUnit AND Active__c = TRUE ';
		} else if (sectionId != null) {
			query += ' WHERE Id = :sectionId';
		}
		query += ' ORDER BY SectionOrder__c';
		// Skipping security check
		return Database.query(String.escapeSingleQuotes(query));
	}
}
