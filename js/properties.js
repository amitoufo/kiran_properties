const apiUrl = 'https://8ao0o5ibtl.execute-api.ap-southeast-2.amazonaws.com/test/kiranproperties';
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
                deleteProperty(properties.id); // Make sure properties.id is the correct property ID
            });
            propertiesBox.appendChild(deleteButton);

            const propertiesName = document.createElement('div');
            propertiesName.classList.add('properties-name');
            propertiesName.textContent = "Name: " + properties.name;
            
            const propertiesAvailability = document.createElement('div');
            propertiesAvailability.classList.add('properties-availability');
            propertiesAvailability.textContent = 'Availability: ' + properties.availability;

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

            propertiesBox.appendChild(propertiesName);
            propertiesBox.appendChild(propertiesAvailability);
            propertiesBox.appendChild(propertiesPrice);
            propertiesBox.appendChild(propertiesDescription);
            propertiesBox.appendChild(propertiesLocation);
            propertiesBox.appendChild(propertiesType);
            propertiesBox.appendChild(propertiesSize);
            propertiesBox.appendChild(propertiesBathroom);
            propertiesBox.appendChild(propertiesBedroom);
            propertiesBox.appendChild(propertiesAmenities);

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
        'name', 'availability', 'rental_price', 'description',
        'location', 'property_type', 'size', 'no_of_bathroom',
        'no_of_bedroom', 'amenities'
    ];

    for (const propertyKey of propertyKeys) {
        if (propertyKey !== 'id') { // Exclude the 'id' property
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
    
        // Send PUT request to update property
        fetch(apiUrl + '/' + property.id, {
            method: 'PUT',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(formData)
        })
        .then(response => response.json())
        .then(updatedPropertyData => {
            // Update the property directly in the allProperties array
            const updatedIndex = allProperties.findIndex(prop => prop.id === updatedPropertyData.id);
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
        name: "New Property", // Default values for demonstration
        availability: true,
        rental_price: 0,
        description: "Description of the new property",
        location: "Location of the new property",
        property_type: "Property Type",
        size: "Size of the new property",
        no_of_bathroom: 0,
        no_of_bedroom: 0,
        amenities: "Amenities of the new property"
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

        form.appendChild(label);
        form.appendChild(input);
    }

    const submitButton = document.createElement('button');
    submitButton.textContent = 'Add Property';
    submitButton.addEventListener('click', () => {
        const formData = {};
        const inputElements = form.querySelectorAll('input');
        inputElements.forEach(input => {
            formData[input.previousSibling.textContent.replace(/\s+/g, '_')] = input.value;
        });

        // Send POST request to add new property
        fetch(apiUrl, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(formData)
        })
        .then(response => response.json())
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
            // Send POST request to add new property
            fetch(apiUrl, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(formData)
            })
            .then(response => response.json())
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

function deleteProperty(propertyId) {
    const confirmation = confirm("Are you sure you want to delete this property?");
    if (!confirmation) {
        return; // Abort the deletion
    }

    // Send DELETE request to remove property
    fetch(apiUrl + '/' + propertyId, {
        method: 'DELETE',
    })
    .then(response => {
        if (response.status === 200) {
            // Remove the property from the allProperties array
            allProperties = allProperties.filter(prop => prop.id !== propertyId);

            // Update the displayed properties
            displayData(allProperties);
        }
    })
    .catch(error => {
        console.error('Error deleting property:', error);
    });
}
