const apiUrl = 'https://3qprmpuv97.execute-api.ap-southeast-2.amazonaws.com/dev/kiran-property';
let allProperties = []

// fetch the data
fetch(apiUrl, {
    method: 'GET',
})
    .then(response => response.json())
    .then(data => {
        console.log("Received data from API:", data);
        allProperties = data;
        displayData(allProperties);
    })
    .catch(error => console.error('Error fetching data:', error));


// to dynamically display data on the webpage
function displayData(properties) {
    const propertiesDiv = document.getElementById('propertyid');
    propertiesDiv.innerHTML = ''; // Clear existing data

    if (properties && properties.length > 0) {
        properties.forEach(properties => {

            const propertiesBox = document.createElement('div');
            propertiesBox.classList.add('properties-box');

            const editButton = document.createElement('button');
            editButton.textContent = 'Edit';
            editButton.addEventListener('click', () => {
                openEditModal(properties); // Pass the property data to the openEditModal function
            });
            propertiesBox.appendChild(editButton)

            const deleteButton = document.createElement('button');
            deleteButton.textContent = 'Delete';
            deleteButton.addEventListener('click', () => {
                deleteProperty(properties.property_id); // Make sure properties.property_id is the correct property ID
            });
            propertiesBox.appendChild(deleteButton);

            const propertiesName = document.createElement('div');
            propertiesName.classList.add('properties-name');
            propertiesName.textContent = "Name: " + properties.name;
            
            const propertiesPrice = document.createElement('div');
            propertiesPrice.classList.add('properties-price');
            propertiesPrice.textContent = 'Price: ' + properties.rental_price;

            const propertiesDescription = document.createElement('div');
            propertiesDescription.classList.add('properties-description');
            propertiesDescription.textContent = "Description: " + properties.description;

            const propertiesLocation = document.createElement('div');
            propertiesLocation.classList.add('properties-location');
            propertiesLocation.textContent = "Location: " + properties.location;

            const propertiesType = document.createElement('div');
            propertiesType.classList.add('properties-type');
            propertiesType.textContent = "Property Type: " + properties.property_type;

            const propertiesSize = document.createElement('div');
            propertiesSize.classList.add('properties-size');
            propertiesSize.textContent = "Size: " + properties.size;

            const propertiesBathroom = document.createElement('div');
            propertiesBathroom.classList.add('properties-bathroom');
            propertiesBathroom.textContent = "Number of Bathrooms: " + properties.no_of_bathroom;

            const propertiesBedroom = document.createElement('div');
            propertiesBedroom.classList.add('properties-bedroom');
            propertiesBedroom.textContent = "Number of Bedrooms: " + properties.no_of_bedroom;

            const propertiesAmenities = document.createElement('div');
            propertiesAmenities.classList.add('properties-amenities');
            propertiesAmenities.textContent = "Amenities: " + properties.amenities;

            propertiesBox.appendChild(propertiesName); // 1st item
            propertiesBox.appendChild(propertiesPrice); // 2nd item
            propertiesBox.appendChild(propertiesDescription); // 3rd item
            propertiesBox.appendChild(propertiesLocation); // 4th item
            propertiesBox.appendChild(propertiesType); // 5th item
            propertiesBox.appendChild(propertiesSize); // 6th item
            propertiesBox.appendChild(propertiesBathroom); // 7th item
            propertiesBox.appendChild(propertiesBedroom); // 8th item
            propertiesBox.appendChild(propertiesAmenities); // 9th item

            propertiesBox.appendChild(editButton); // This will be outside the 3x3 grid
            propertiesBox.appendChild(deleteButton); // This will be outside the 3x3 grid

            propertiesDiv.appendChild(propertiesBox);
            propertiesBox.style.marginBottom = '20px';
        });
    } else {
        propertiesDiv.textContent = 'No properties found.';
    }
}

function openEditModal(property) {
    const modal = document.createElement('div');
    modal.classList.add('modal');

    const form = document.createElement('form');
    form.classList.add('property-form');

    const closeButton = document.createElement('button');
    closeButton.classList.add('close-button');
    closeButton.textContent = 'Close';
    closeButton.addEventListener('click', () => {
        modal.remove();
    });

    form.appendChild(closeButton);

    // Order of properties as displayed
    const propertyKeys = [
        'name', 'rental_price', 'description',
        'location', 'property_type', 'size', 'no_of_bathroom',
        'no_of_bedroom', 'amenities'
    ];

    for (const propertyKey of propertyKeys) {
        if (propertyKey !== 'property_id') { // Exclude the 'property_id' property
            const label = document.createElement('label');
            label.textContent = propertyKey.replace(/_/g, ' ');

            const input = document.createElement('input');
            input.setAttribute('type', 'text');
            input.setAttribute('placeholder', property[propertyKey]);
            input.value = property[propertyKey]; // Set the current value

            form.appendChild(label);
            form.appendChild(input);
        }
    }

    const submitButton = document.createElement('button');
    submitButton.textContent = 'Save Changes';
    submitButton.addEventListener('click', () => {
        const formData = {};
        const inputElements = form.querySelectorAll('input');
        inputElements.forEach(input => {
            formData[input.previousSibling.textContent.replace(/ /g, '_')] = input.value;
        });

        const apiUrl = 'https://3qprmpuv97.execute-api.ap-southeast-2.amazonaws.com/dev/kiran-property'; // Replace with your API endpoint URL

        // Send PUT request to update property
        fetch(apiUrl + '/' + property.property_id, {
            method: 'PUT',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(formData)
        })
        .then(response => {
            if (!response.ok) {
                throw new Error('Error updating property');
            }
            return response.json();
        })
        .then(updatedPropertyData => {
            // Update the property directly in the allProperties array
            const updatedIndex = allProperties.findIndex(prop => prop.property_id === updatedPropertyData.property_id);
            if (updatedIndex !== -1) {
                allProperties[updatedIndex] = updatedPropertyData;

                // Update the displayed properties
                displayData(allProperties);

                modal.remove();
            }
        })
        .catch(error => {
            console.error('Error updating property:', error);
            modal.remove();
        });
    });

    form.appendChild(submitButton);
    modal.appendChild(form);
    document.body.appendChild(modal);
}


function addProperty() {

    const newProperty = {
        property_id: "Enter Property ID",
        amenities: "Amenities of the new property",
        description: "Description of the new property",
        location: "Location of the new property",
        no_of_bathroom: 0,
        no_of_bedroom: 0,
        property_type: "Property Type",
        rental_price: 0,
        size: "Size of the new property",
        name: "New Property"
    };

    const modal = document.createElement('div');
    modal.classList.add('modal');

    const form = document.createElement('form');
    form.classList.add('property-form');

    const closeButton = document.createElement('button');
    closeButton.classList.add('close-button');
    closeButton.textContent = 'Close';
    closeButton.addEventListener('click', () => {
        modal.remove();
    });

    form.appendChild(closeButton);

    // Create input fields for each property detail
    for (const propertyKey in newProperty) {
        const label = document.createElement('label');
        label.textContent = propertyKey.replace(/_/g, ' ');

        const input = document.createElement('input');
        input.setAttribute('type', 'text');
        input.setAttribute('placeholder', newProperty[propertyKey]);
        input.value = newProperty[propertyKey]; // Set the default value

        form.appendChild(label);
        form.appendChild(input);
    }

    const submitButton = document.createElement('button');
    submitButton.textContent = 'Add Property';
    submitButton.addEventListener('click', (event) => {
        event.preventDefault(); 

        const formData = {};
        let allFieldsFilled = true;

        const inputElements = form.querySelectorAll('input');
    inputElements.forEach(input => {
        const propertyName = input.previousSibling.textContent.replace(/\s+/g, '_');
        const value = input.value.trim();
        
        if (value === '') {
            allFieldsFilled = false; // If any field is empty, set to false
            input.classList.add('invalid');
        } else {
            input.classList.remove('invalid');
        }

        formData[propertyName] = value;
    });

    if (!allFieldsFilled) {
        errorMessage.style.display = 'block'; // Show the error message
        modal.classList.add('modal-open'); // Keep the modal open
        return; // Stop further processing
    } else {
        errorMessage.style.display = 'none'; // Hide the error message
        modal.classList.remove('modal-open'); // Close the modal
    }
        console.log('formData:', formData);

        // Send POST request to add new property
        fetch(apiUrl, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(formData)
        })
        .then(response => {
            if (!response.ok) {
                throw new Error('Error adding property');
            }
            return response.json();
        })
        .then(newPropertyData => {
            // Add the new property to the displayed properties
            allProperties.push(newPropertyData);
            displayData(allProperties);

            modal.remove();
        })
        .catch(error => {
            console.error('Error adding property:', error);
            modal.remove();
        });
    });

    form.appendChild(submitButton);
    modal.appendChild(form);
    document.body.appendChild(modal);
    const errorMessage = document.createElement('div');
    errorMessage.classList.add('error-message');
    errorMessage.textContent = 'Please fill in all fields';
    errorMessage.style.color = 'red';
    errorMessage.style.display = 'none'; // Initially hide the error message

    form.appendChild(errorMessage);

    submitButton.addEventListener('click', (event) => {
        event.preventDefault(); // Prevent the form from being submitted
    
        const formData = {};
        let allFieldsFilled = true;

        const inputElements = form.querySelectorAll('input');
        inputElements.forEach(input => {
            const propertyName = input.previousSibling.textContent.replace(/\s+/g, '_');
            const value = input.value.trim();
        
            if (value === '') {
                allFieldsFilled = false;
                input.classList.add('invalid');
            } else {
                input.classList.remove('invalid');
            }

            formData[propertyName] = value;
        });

        if (!allFieldsFilled) {
            errorMessage.style.display = 'block'; // Show the error message
            modal.classList.add('modal-open'); // Keep the modal open
            return; // Stop further processing
        } else {
            errorMessage.style.display = 'none'; // Hide the error message
            modal.classList.remove('modal-open'); // Close the modal
        }
    
        if (allFieldsFilled) {
            fetch(apiUrl, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(formData)
            })
            .then(response => {
                if (!response.ok) {
                    throw new Error('An error occurred');
                }
                return response.json();
            })
            .then(newPropertyData => {
                // Add the new property to the displayed properties
                allProperties.push(newPropertyData);
                displayData(allProperties);
    
                modal.remove();
            })
            .catch(error => {
                console.error('Error adding property:', error);
                modal.remove();
            });
        }
    });

}


function deleteProperty(property_id) {
    const confirmation = confirm("Are you sure you want to delete this property?");
    if (!confirmation) {
        return; // Abort the deletion
    }

    // Send DELETE request to remove property
    fetch(apiUrl + '/' + property_id, {
        method: 'DELETE',
        headers: {
            'Content-Type': 'application/json'
        }
    })
    .then(response => {
        if (response.status === 200) {
             // Remove the property from the allProperties array
             allProperties = allProperties.filter(prop => prop.property_id !== property_id);

             // Update the displayed properties
             displayData(allProperties);
        }
    })
    .catch(error => {
        console.error('Error deleting property:', error);
    });
}