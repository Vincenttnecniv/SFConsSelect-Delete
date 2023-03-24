({
    
    isContactSelected: function(component, event, helper) {
        // Get the label of the event source, which should be the Contact ID
        var contact = event.getSource().get('v.label');
        
        // Check if any of the selectedContacts in the component's state have the same ID as the event source
        return component.get('v.selectedContacts').some(function(c) {
            return c.Id === contact;
        });
    },
    
    handleCheckboxChange: function(component, event, helper) {
        // Get the value attribute of the event source, which should be the Contact ID
        var contactId = event.getSource().get('v.value');
        
        // Log the selected contact ID to the console for debugging purposes
        console.log('Selected contact ID: ' + contactId);
        
        // Get the selectedContacts array from the component's state, or create an empty array if it doesn't exist
        var selectedContacts = component.get('v.selectedContacts') || [];
        
        // Log the current list of selected contacts to the console for debugging purposes
        console.log('Selected contacts: ' + JSON.stringify(selectedContacts));
        
        // Find the index of the selected contact in the selectedContacts array
        var index = selectedContacts.findIndex(function(c) {
            return c.Id === contactId;
        });
        
        // If the checkbox is checked and the contact isn't already in the selectedContacts array, add it
        if (event.getSource().get('v.checked')) {
            if (index === -1) {
                selectedContacts.push(component.get('v.contacts').find(function(c) {
                    return c.Id === contactId;
                }));
            }
        }
        // If the checkbox is unchecked and the contact is in the selectedContacts array, remove it
        else {
            if (index !== -1) {
                selectedContacts.splice(index, 1);
            }
        }
        // Set the updated selectedContacts array in the component's state
        component.set('v.selectedContacts', selectedContacts);
    },
    
    
    deleteSelectedContacts: function(component, event, helper) {
        var selectedContacts = component.get('v.selectedContacts');
        if (selectedContacts && selectedContacts.length > 0) {
            var action = component.get('c.deleteContacts');
            action.setParams({
                contacts: selectedContacts
            });
            action.setCallback(this, function(response) {
                var state = response.getState();
                console.log('state: ' + state);
                if (state === 'SUCCESS') {
                    console.log('success');
                    var contacts = component.get('v.contacts');
                    var newContacts = [];
                    for (var i = 0; i < contacts.length; i++) {
                        var found = false;
                        for (var j = 0; j < selectedContacts.length; j++) {
                            if (contacts[i].Id == selectedContacts[j].Id) {
                                found = true;
                                break;
                            }
                        }
                        if (!found) {
                            newContacts.push(contacts[i]);
                        }
                    }
                    component.set('v.contacts', newContacts);
                    component.set('v.selectedContacts', []);
                    alert('Selected contacts deleted successfully.');
                } else if (state === 'ERROR') {
                    var errors = response.getError();
                    if (errors) {
                        var errorMessages = [];
                        for (var i = 0; i < errors.length; i++) {
                            if (errors[i] && errors[i].message) {
                                errorMessages.push(errors[i].message);
                            }
                        }
                        if (errorMessages.length > 0) {
                            console.log(errorMessages);
                            alert('Errors occurred while deleting contacts: ' + errorMessages.join('\n'));
                        }
                    }
                }
                
            });
            $A.enqueueAction(action);
        }
        else{
            alert('Please select one contact to delete');
        }
    },
    
    doInit: function(component, event, helper) {
        var action = component.get('c.getContacts');
        action.setCallback(this, function(response) {
            console.log('response - ', response.getReturnValue());
            var state = response.getState();
            if (state === 'SUCCESS') {
                component.set('v.contacts', response.getReturnValue());
            } else if (state === 'ERROR') {
                var errors = response.getError();
                if (errors) {
                    if (errors[0] && errors[0].message) {
                        alert('Error message: ' + errors[0].message);
                    }
                } else {
                    alert('Unknown error');
                }
            }
        });
        $A.enqueueAction(action);
    }})