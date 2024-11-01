const filters = document.querySelectorAll('.filter');

filters.forEach(filter => {
    filter.addEventListener('click', () => {
        const category = filter.getAttribute('data-category');
        filterListings(category);
    });
});

function filterListings(category) {
    const searchParams = category ? `?category=${category}` : '';
    fetch(`/listings${searchParams}`)
        .then(response => response.text())
        .then(html => {
            document.querySelector('.row').innerHTML = html; // Assuming your listings are within a div with class 'row'
        })
        .catch(error => console.error('Error fetching listings:', error));
}


document.addEventListener('DOMContentLoaded', () => {
    const togglePrice = document.getElementById('toggle-price');

    togglePrice.addEventListener('change', (event) => {
        const isChecked = event.target.checked;
        const listingPrices = document.querySelectorAll('.listing-price');

        listingPrices.forEach(priceElement => {
            const originalPrice = parseFloat(priceElement.getAttribute('data-original-price'));
            let newPrice;

            if (isChecked) {
                // Calculate price with 18% tax
                newPrice = originalPrice * 1.18;
            } else {
                // Revert to the original price
                newPrice = originalPrice;
            }

            // Update the price display
            priceElement.innerHTML = `&#8377;${newPrice.toLocaleString("en-IN")} / night`;
        });
    });
});
