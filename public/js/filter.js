// Debounce function to prevent excessive API calls
function debounce(func, wait) {
    let timeout;
    return function (...args) {
        clearTimeout(timeout);
        timeout = setTimeout(() => func.apply(this, args), wait);
    };
}

// Elements
const searchInput = document.getElementById("search-input");
const searchButton = document.getElementById("search-button");

// Fetch suggestions from the server
async function fetchSuggestions(query) {
    if (query.length < 2) return []; // Minimum query length
    const response = await fetch(`/listings?q=${encodeURIComponent(query)}`, {
        headers: { "X-Requested-With": "XMLHttpRequest" }, // Mark as AJAX
    });
    return await response.json();
}

// Display suggestions in a dropdown
function showSuggestions(suggestions) {
    let dropdown = document.querySelector(".suggestions-dropdown");
    if (!dropdown) {
        dropdown = document.createElement("div");
        dropdown.className = "suggestions-dropdown";
        searchInput.parentElement.appendChild(dropdown);
    }

    dropdown.innerHTML = suggestions.length
        ? suggestions
            .map(
                suggestion => `
                      <a href="${suggestion.url}" class="suggestion-item">
                          ${suggestion.title} - ₹${suggestion.price.toLocaleString("en-IN")}
                      </a>
                  `
            )
            .join("")
        : "<div class='suggestion-item no-results'>No results found</div>";

    dropdown.style.display = "block";
}

// Hide dropdown when clicking outside
document.addEventListener("click", (e) => {
    const dropdown = document.querySelector(".suggestions-dropdown");
    if (dropdown && !searchInput.contains(e.target) && !dropdown.contains(e.target)) {
        dropdown.style.display = "none";
    }
});

// Autocomplete input listener
searchInput.addEventListener(
    "input",
    debounce(async (e) => {
        const query = e.target.value.trim();
        if (query.length < 2) {
            showSuggestions([]);
            return;
        }
        const suggestions = await fetchSuggestions(query);
        showSuggestions(suggestions);
    }, 300)
);

// Search button click
searchButton.addEventListener("click", () => {
    const query = searchInput.value.trim();
    if (query) {
        window.location.href = `/listings?q=${encodeURIComponent(query)}`;
    }
});

// Existing filter and tax toggle logic (assuming it’s still there)
document.querySelectorAll(".filter").forEach(filter => {
    filter.addEventListener("click", (e) => {
        e.preventDefault();
        const category = filter.dataset.category || "";
        window.location.href = category ? `/listings?category=${category}` : "/listings";
    });
});

const togglePrice = document.getElementById("toggle-price");
togglePrice.addEventListener("change", () => {
    document.querySelectorAll(".listing-price").forEach(price => {
        const originalPrice = parseFloat(price.dataset.originalPrice);
        const taxMultiplier = togglePrice.checked ? 1.18 : 1; // Example 18% tax
        price.textContent = `₹${(originalPrice * taxMultiplier).toLocaleString("en-IN")} / night`;
    });
});
