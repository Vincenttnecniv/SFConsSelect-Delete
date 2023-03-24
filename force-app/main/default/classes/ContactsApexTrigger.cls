public with sharing class ContactsApexTrigger {
    @AuraEnabled
    public static List<Contact> getContacts() {
        List<Contact> cons = [SELECT Id, Name, Phone, Email FROM Contact];
        system.debug('Contacts - ' + cons);
        return cons;
    }
    
    
    @AuraEnabled
public static void deleteContacts(List<Contact> contacts) {
    List<Database.DeleteResult> results = null;
    try {
        results = Database.delete(contacts, false);
    } catch (Exception ex) {
        // If an unexpected error occurs, throw an AuraHandledException
        throw new AuraHandledException(ex.getMessage());
    }
    List<String> errorMessages = new List<String>();
    for (Database.DeleteResult result : results) {
        if (!result.isSuccess()) {
            for (Database.Error error : result.getErrors()) {
                errorMessages.add(error.getMessage());
            }
        }
    }
    if (errorMessages.size() > 0) {
        throw new AuraHandledException(String.join(errorMessages, '\n'));
    }
    //Comment For Commit
}
}