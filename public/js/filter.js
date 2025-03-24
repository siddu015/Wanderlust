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
const filters = document.querySelectorAll(".filter");
const togglePrice = document.getElementById("toggle-price");

// Add active class functionality
function setActiveFilter(filter) {
    // Remove active class from all filters
    filters.forEach(f => f.classList.remove('active'));

    // Add active class to the clicked filter
    if (filter) {
        filter.classList.add('active');
    }
}

// Initialize active filter on page load based on URL
function initializeActiveFilter() {
    const urlParams = new URLSearchParams(window.location.search);
    const activeCategory = urlParams.get('category');

    if (!activeCategory) {
        // If we're on the main listings page with no category, activate "All"
        const allFilter = document.querySelector('.filter a[href="/listings"]')?.closest('.filter');
        if (allFilter) setActiveFilter(allFilter);
        return;
    }

    // Find and activate the filter matching the URL category
    filters.forEach(filter => {
        if (filter.dataset.category === activeCategory) {
            setActiveFilter(filter);
        }
    });
}

// Fetch suggestions from the server
async function fetchSuggestions(query) {
    if (query.length < 2) return []; // Minimum query length
    try {
        const response = await fetch(`/listings?q=${encodeURIComponent(query)}`, {
            headers: { "X-Requested-With": "XMLHttpRequest" }, // Mark as AJAX
        });
        if (!response.ok) throw new Error('Network response was not ok');
        return await response.json();
    } catch (error) {
        console.error("Error fetching suggestions:", error);
        return [];
    }
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
            const dropdown = document.querySelector(".suggestions-dropdown");
            if (dropdown) dropdown.style.display = "none";
            return;
        }
        const suggestions = await fetchSuggestions(query);
        showSuggestions(suggestions);
    }, 300)
);

// Function to filter listings via AJAX
// Function to filter listings via AJAX
async function filterListings(category, location) {
    let searchParams = new URLSearchParams();
    if (category) searchParams.append('category', category);
    if (location) searchParams.append('location', location);

    // Get existing search query if any
    const currentQuery = searchInput.value.trim();
    if (currentQuery && currentQuery.length > 0) {
        searchParams.append('q', currentQuery);
    }

    try {
        const response = await fetch(`/listings?${searchParams.toString()}`, {
            headers: { "X-Requested-With": "XMLHttpRequest" }
        });

        if (!response.ok) throw new Error('Network response was not ok');

        const html = await response.text();

        // Target the exact container in index.ejs
        const listingsContainer = document.querySelector('.row.row-cols-lg-3.row-cols-md-2.row-cols-sm-1');

        if (listingsContainer) {
            listingsContainer.innerHTML = html;

            // Re-initialize price toggle for new content
            initializeTogglePrice();

            // Re-attach event listeners to new content if needed
            attachListingEventListeners();
        } else {
            console.error("Could not find listings container to update");
        }

        // Update URL without reloading the page
        const newUrl = `/listings?${searchParams.toString()}`;
        history.pushState({ path: newUrl }, '', newUrl);

        // Update active filter
        if (category) {
            filters.forEach(filter => {
                if (filter.dataset.category === category) {
                    setActiveFilter(filter);
                }
            });
        } else {
            // If no category, set "All" filter as active
            const allFilter = document.querySelector('.filter a[href="/listings"]')?.closest('.filter');
            if (allFilter) setActiveFilter(allFilter);
        }
    } catch (error) {
        console.error("Error fetching listings:", error);
    }
}

// Attach event listeners to dynamically loaded listing elements
function attachListingEventListeners() {
    // Add any event listeners needed for listing elements here
    // This function will be called after new listings are loaded
}

// Search button click handler
searchButton.addEventListener("click", () => {
    const query = searchInput.value.trim();
    if (query) {
        filterListings(null, query);
    }
});

// Filter click handler
filters.forEach(filter => {
    filter.addEventListener("click", (e) => {
        // Check if it's the "All" filter with an anchor tag
        const allFilterLink = filter.querySelector('a[href="/listings"]');
        if (allFilterLink) {
            e.preventDefault();
            setActiveFilter(filter);
            filterListings(null, searchInput.value.trim());
            return;
        }

        e.preventDefault();
        const category = filter.dataset.category;
        if (!category) return;

        filterListings(category, searchInput.value.trim());
    });
});

// Toggle price with tax
function initializeTogglePrice() {
    const togglePrice = document.getElementById("toggle-price");
    if (togglePrice) {
        togglePrice.addEventListener("change", () => {
            document.querySelectorAll(".listing-price").forEach(price => {
                const originalPrice = parseFloat(price.dataset.originalPrice);
                const taxMultiplier = togglePrice.checked ? 1.18 : 1; // Example 18% tax
                price.textContent = `₹${(originalPrice * taxMultiplier).toLocaleString("en-IN")} / night`;
            });
        });
    }
}

// Add horizontal scroll buttons for filters on desktop
function addFilterScrollButtons() {
    const filtersContainer = document.getElementById('filters-container');
    const filters = document.getElementById('filters');

    if (!filtersContainer || !filters) return;

    // Create left and right scroll buttons
    const scrollLeftBtn = document.createElement('button');
    scrollLeftBtn.className = 'filter-scroll-btn scroll-left';
    scrollLeftBtn.innerHTML = '<i class="fa-solid fa-chevron-left"></i>';
    scrollLeftBtn.style.display = 'none'; // Hide initially

    const scrollRightBtn = document.createElement('button');
    scrollRightBtn.className = 'filter-scroll-btn scroll-right';
    scrollRightBtn.innerHTML = '<i class="fa-solid fa-chevron-right"></i>';

    // Insert buttons
    filtersContainer.insertBefore(scrollLeftBtn, filters);
    filtersContainer.appendChild(scrollRightBtn);

    // Scroll handlers
    scrollLeftBtn.addEventListener('click', () => {
        filters.scrollBy({ left: -200, behavior: 'smooth' });
    });

    scrollRightBtn.addEventListener('click', () => {
        filters.scrollBy({ left: 200, behavior: 'smooth' });
    });

    // Show/hide buttons based on scroll position
    filters.addEventListener('scroll', () => {
        // Show left button if we've scrolled
        scrollLeftBtn.style.display = filters.scrollLeft > 0 ? 'flex' : 'none';

        // Show right button if there's more to scroll
        const maxScrollLeft = filters.scrollWidth - filters.clientWidth;
        scrollRightBtn.style.display = filters.scrollLeft >= maxScrollLeft - 10 ? 'none' : 'flex';
    });

    // Initial check for overflow
    function checkOverflow() {
        const hasOverflow = filters.scrollWidth > filters.clientWidth;
        scrollRightBtn.style.display = hasOverflow ? 'flex' : 'none';
    }

    // Check on load and resize
    checkOverflow();
    window.addEventListener('resize', checkOverflow);
}

// Initialize everything on page load
document.addEventListener('DOMContentLoaded', () => {
    initializeActiveFilter();
    initializeTogglePrice();
    addFilterScrollButtons();
});

// Add these functions to your existing filter.js file

// Enhanced filter UI effect
function updateActiveFilter() {
    const filters = document.querySelectorAll(".filter");

    filters.forEach(filter => {
        filter.addEventListener("click", function() {
            // Visual feedback when clicking a filter
            this.style.transform = "scale(0.95)";
            setTimeout(() => {
                this.style.transform = "";
            }, 200);
        });
    });

    // Show user a tooltip on first visit to encourage filter usage
    if (!localStorage.getItem('filterTipShown')) {
        const firstFilter = document.querySelector(".filter:nth-child(2)");  // Skip "All" filter
        if (firstFilter) {
            const tip = document.createElement('div');
            tip.className = 'filter-tip';
            tip.textContent = 'Try our filters!';
            tip.style = 'position: absolute; background: #333; color: white; padding: 6px 12px; border-radius: 16px; font-size: 12px; top: -25px; animation: bounce 2s infinite; z-index: 100;';

            firstFilter.style.position = 'relative';
            firstFilter.appendChild(tip);

            // Add a style for the animation
            const style = document.createElement('style');
            style.textContent = '@keyframes bounce { 0%, 100% { transform: translateY(0); } 50% { transform: translateY(-5px); } }';
            document.head.appendChild(style);

            // Remove after 5 seconds
            setTimeout(() => {
                if (tip && tip.parentNode) {
                    tip.parentNode.removeChild(tip);
                    localStorage.setItem('filterTipShown', 'true');
                }
            }, 5000);
        }
    }
}

// Optimize toggle button animation
function enhanceToggleButton() {
    const toggle = document.getElementById('toggle-price');
    if (toggle) {
        toggle.addEventListener('change', function() {
            // Add visual feedback when toggling
            const toggleContainer = document.getElementById('toggle-container');
            toggleContainer.style.transform = 'scale(0.95)';
            setTimeout(() => {
                toggleContainer.style.transform = '';
            }, 200);
        });
    }
}

// Improved function to set active filter with visual styling
function setActiveFilter(filter) {
    // Remove active class from all filters
    filters.forEach(f => f.classList.remove('active'));

    // Add active class to the clicked filter
    if (filter) {
        filter.classList.add('active');

        // Smooth scroll the active filter into view if it's not fully visible
        const filtersContainer = document.getElementById('filters');
        if (filtersContainer) {
            const filterLeft = filter.offsetLeft;
            const containerScrollLeft = filtersContainer.scrollLeft;
            const containerWidth = filtersContainer.offsetWidth;

            // Calculate if the filter is not fully visible
            if (filterLeft < containerScrollLeft ||
                filterLeft + filter.offsetWidth > containerScrollLeft + containerWidth) {
                // Scroll to make the filter centered
                filtersContainer.scrollTo({
                    left: filterLeft - (containerWidth / 2) + (filter.offsetWidth / 2),
                    behavior: 'smooth'
                });
            }
        }
    }
}

// Add to your initialization code
document.addEventListener('DOMContentLoaded', function() {
    // Your existing initialization code
    initializeActiveFilter();
    initializeTogglePrice();
    addFilterScrollButtons();

    // Add new enhanced features
    updateActiveFilter();
    enhanceToggleButton();
});
