console.log("js file loaded")

// Get the elements on the HTML page:
const Form = document.getElementById('form')
const Button = document.getElementById('button')
const TheError = document.getElementById('error')
const Items = document.getElementById('items')

// Retrieve the URL from the form's action
const url = Form.action;
console.log("form url: " + url);

function loadItems() {
    Button.classList.add('is-loading')
	
	fetch(url)
		.then(response => {
			if (!response.ok) {
				throw new Error('Network response was not ok');
			}
			return response.json();
		})
		.then(data => {
		// Handle the retrieved data here
			console.log(data); // for debugging purposes
			renderItems(data)
		})
		.catch(error => {
			// Handle any errors that occurred during the request
			console.error('Error:', error);
		})
		.then( () => {
			Button.classList.remove('is-loading')
		});
}

function renderItems(items) {
	console.log(items)
	
    while(Items.hasChildNodes()) {
		Items.removeChild(Items.lastChild)
    }

    items.map( item => {
		const el = document.createElement('div')
		el.innerHTML = item.thingid
		Items.appendChild(el)
    })

    return items
}

function renderError(err) {
	TheError.style.display = 'block'
	TheError.innerHTML = err
}

function hideError() {
	TheError.style.display = 'none'
	TheError.innerHTML = ''
}

function addItem(item) {
    const payload = {
        thingid: item
    }

    //return 
	fetch(url, {
		method: 'POST',
		body: JSON.stringify(payload)
    })
	.then( () =>
		loadItems()
	)
	
	
	// Ready UI for next submission
    Form.thingid.value = ''
	Form.thingid.focus()
}

// Bind to form 'onsubmit'
Form.addEventListener('submit', (e) => {
    // Prevent default execution
    e.preventDefault()

    Button.classList.add('is-loading')

    addItem(Form.thingid.value)
	
	Button.classList.remove('is-loading')

    // Returning false to prevent form from submitting
    return false
})

loadItems();