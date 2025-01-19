const filters = document.querySelectorAll('.filter');
const searchInput = document.getElementById('search-input');
const searchButton = document.getElementById('search-button');

// Add event listeners to each filter category
filters.forEach(filter => {
    filter.addEventListener('click', () => {
        const category = filter.getAttribute('data-category');
        const location = searchInput.value.trim();
        filterListings(category, location);
    });
});

// Add event listener to the search button for location search
searchButton.addEventListener('click', () => {
    const location = searchInput.value.trim();

    if(!location) return;

    filterListings(null, location);
});

function filterListings(category, location) {
    let searchParams = '';
    if (category) searchParams += `?category=${category}`;
    if (location) searchParams += `${category ? '&' : '?'}location=${encodeURIComponent(location)}`;

    fetch(`/listings${searchParams}`)
        .then(response => response.text())
        .then(html => {
            document.querySelector('.row').innerHTML = html;
            initializeTogglePrice();
        })
        .catch(error => console.error('Error fetching listings:', error));
}

// Function to initialize the price toggle functionality
function initializeTogglePrice() {
    const togglePrice = document.getElementById('toggle-price');

    if (togglePrice) {
        togglePrice.addEventListener('change', (event) => {
            const isChecked = event.target.checked;
            const listingPrices = document.querySelectorAll('.listing-price');

            listingPrices.forEach(priceElement => {
                const originalPrice = parseFloat(priceElement.getAttribute('data-original-price'));
                let newPrice;

                if (isChecked) {
                    newPrice = originalPrice * 1.18;
                } else {
                    newPrice = originalPrice;
                }

                priceElement.innerHTML = `&#8377;${newPrice.toLocaleString("en-IN")} / night`;
            });
        });
    }
}

document.addEventListener('DOMContentLoaded', initializeTogglePrice);
