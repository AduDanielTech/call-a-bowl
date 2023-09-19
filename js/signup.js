
const locationInput = document.getElementById('locationInput');
const searchButton = document.getElementById('searchLocationButton');
const locationResults = document.getElementById('locationResults');

searchButton.addEventListener('click', () => {
  const query = locationInput.value;
  if (query.trim() !== '') {
    // Use the Nominatim API to search for locations
    fetch(`https://nominatim.openstreetmap.org/search?format=json&q=${query}`)
      .then((response) => response.json())
      .then((data) => {
        // Display the location results
        locationResults.innerHTML = '';
        data.forEach((result) => {
          const resultItem = document.createElement('div');
          resultItem.textContent = result.display_name;
          locationResults.appendChild(resultItem);
        });
      })
      .catch((error) => {
        console.error('Error fetching location data:', error);
      });
  }
});

  // Function to save form data to local storage
  function saveFormData() {
    
    const name = document.querySelector('.user_input_name').value;
    const phoneNumber = document.querySelector('.user_input_phone_number').value;
    const emailAddress = document.querySelector('.user_input_email').value;
    const location = document.querySelector('.location_input').value;

    // Create an object to store the form data
    const formData = {
      name: name,
      phoneNumber: phoneNumber,
      emailAddress: emailAddress,
      location: location,
    };

    // Store the form data in local storage
    localStorage.setItem('userDetails', JSON.stringify(formData));

    // Redirect to the preview page
    window.location.href = 'preview.html';
  }

  // Add an event listener to the "proceed to preview" button
  const proceedButton = document.querySelector('.form_submit_contact_input');
  proceedButton.addEventListener('click', saveFormData);

// Function to load and prefill user details from local storage
function loadAndPrefillFormData() {
  const storedData = localStorage.getItem('userDetails');

  if (storedData) {
    const formData = JSON.parse(storedData);

    // Prefill the input fields with the stored data
    document.querySelector('.user_input_name').value = formData.name || '';
    document.querySelector('.user_input_phone_number').value = formData.phoneNumber || '';
    document.querySelector('.user_input_email').value = formData.emailAddress || '';
    document.querySelector('.location_input').value = formData.location || '';
  }
}

// Call the function to load and prefill user details when the page loads
loadAndPrefillFormData();
