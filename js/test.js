document.addEventListener("DOMContentLoaded", function () {
    fetchPropertyData();
});

function fetchPropertyData() {
    fetch("https://8ao0o5ibtl.execute-api.ap-southeast-2.amazonaws.com/dev/kiranproperties", {
        method: "GET",
        headers: {
            "Content-Type": "application/json"
        }
    })
    .then(response => response.json())
    .then(data => {
        displayPropertyData(data);
    })
    .catch(error => {
        console.error("Error fetching property data:", error);
    });
}

function displayPropertyData(propertyData) {
    const propertyListContainer = document.getElementById("property-list");
    propertyListContainer.innerHTML = "";

    if (propertyData && propertyData.length > 0) {
        propertyData.forEach(property => {
            const propertyCard = document.createElement("div");
            propertyCard.className = "property-card";

            const propertyInfo = `
                <h2>${property.name}</h2>
                <p><strong>Location:</strong> ${property.location}</p>
                <p><strong>Price:</strong> $${property.rental_price}</p>
                <p><strong>Bedrooms:</strong> ${property.no_of_bedroom}</p>
                <p><strong>Bathrooms:</strong> ${property.no_of_bathroom}</p>
                <p><strong>Description:</strong> ${property.description}</p>
            `;

            propertyCard.innerHTML = propertyInfo;
            propertyListContainer.appendChild(propertyCard);
        });
    } else {
        propertyListContainer.innerHTML = "<p>No properties available.</p>";
    }
}
