function debounce(func, wait) {
    let timeout;
    return function (...args) {
        clearTimeout(timeout);
        timeout = setTimeout(() => func.apply(this, args), wait);
    };
}

const searchInput = document.getElementById("search-input");
const searchButton = document.getElementById("search-button");
const filters = document.querySelectorAll(".filter");
const togglePrice = document.getElementById("toggle-price");

function setActiveFilter(filter) {
    filters.forEach(f => f.classList.remove('active'));

    if (filter) {
        filter.classList.add('active');

        const filtersContainer = document.getElementById('filters');
        if (filtersContainer) {
            const filterLeft = filter.offsetLeft;
            const containerScrollLeft = filtersContainer.scrollLeft;
            const containerWidth = filtersContainer.offsetWidth;

            if (filterLeft < containerScrollLeft ||
                filterLeft + filter.offsetWidth > containerScrollLeft + containerWidth) {
                filtersContainer.scrollTo({
                    left: filterLeft - (containerWidth / 2) + (filter.offsetWidth / 2),
                    behavior: 'smooth'
                });
            }
        }
    }
}

function initializeActiveFilter() {
    const urlParams = new URLSearchParams(window.location.search);
    const activeCategory = urlParams.get('category');

    if (!activeCategory) {
        const allFilter = document.querySelector('.filter a[href="/listings"]')?.closest('.filter');
        if (allFilter) setActiveFilter(allFilter);
        return;
    }

    filters.forEach(filter => {
        if (filter.dataset.category === activeCategory) {
            setActiveFilter(filter);
        }
    });
}

async function fetchSuggestions(query) {
    if (query.length < 2) return [];
    try {
        const response = await fetch(`/listings?q=${encodeURIComponent(query)}`, {
            headers: {
                "X-Requested-With": "XMLHttpRequest",
                "Accept": "application/json"
            }
        });
        if (!response.ok) throw new Error('Network response was not ok');
        return await response.json();
    } catch (error) {
        console.error("Error fetching suggestions:", error);
        return [];
    }
}

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

document.addEventListener("click", (e) => {
    const dropdown = document.querySelector(".suggestions-dropdown");
    if (dropdown && !searchInput.contains(e.target) && !dropdown.contains(e.target)) {
        dropdown.style.display = "none";
    }
});

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

searchInput.addEventListener("keypress", (e) => {
    if (e.key === "Enter") {
        const query = searchInput.value.trim();
        if (query) {
            filterListings(null, query);
        }
    }
});

async function filterListings(category, location) {
    let searchParams = new URLSearchParams();
    if (category) searchParams.append('category', category);
    if (location) searchParams.append('location', location);

    const currentQuery = searchInput.value.trim();
    if (currentQuery && currentQuery.length > 0) {
        searchParams.append('q', currentQuery);
    }

    try {
        const response = await fetch(`/listings?${searchParams.toString()}`, {
            headers: {
                "X-Requested-With": "XMLHttpRequest",
                "Accept": "text/html"
            }
        });

        if (!response.ok) throw new Error('Network response was not ok');

        const html = await response.text();
        const listingsContainer = document.querySelector('.row.row-cols-lg-3.row-cols-md-2.row-cols-sm-1');
        if (listingsContainer) {
            listingsContainer.innerHTML = html;
            initializeTogglePrice();
            attachListingEventListeners();
        } else {
            console.error("Listings container not found");
        }

        const newUrl = `/listings?${searchParams.toString()}`;
        history.pushState({ path: newUrl }, '', newUrl);

        if (category) {
            filters.forEach(filter => {
                if (filter.dataset.category === category) {
                    setActiveFilter(filter);
                }
            });
        } else {
            const allFilter = document.querySelector('.filter a[href="/listings"]')?.closest('.filter');
            if (allFilter) setActiveFilter(allFilter);
        }
    } catch (error) {
        console.error("Error fetching listings:", error);
    }
}

searchButton.addEventListener("click", () => {
    const query = searchInput.value.trim();
    if (query) {
        filterListings(null, query);
    }
});

filters.forEach(filter => {
    filter.addEventListener("click", (e) => {
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

function initializeTogglePrice() {
    const togglePrice = document.getElementById("toggle-price");
    if (togglePrice) {
        togglePrice.addEventListener("change", () => {
            document.querySelectorAll(".listing-price").forEach(price => {
                const originalPrice = parseFloat(price.dataset.originalPrice);
                const taxMultiplier = togglePrice.checked ? 1.18 : 1;
                price.textContent = `₹${(originalPrice * taxMultiplier).toLocaleString("en-IN")} / night`;
            });
        });
    }
}

function addFilterScrollButtons() {
    const filtersContainer = document.getElementById('filters-container');
    const filters = document.getElementById('filters');

    if (!filtersContainer || !filters) return;

    const scrollLeftBtn = document.createElement('button');
    scrollLeftBtn.className = 'filter-scroll-btn scroll-left';
    scrollLeftBtn.innerHTML = '<i class="fa-solid fa-chevron-left"></i>';
    scrollLeftBtn.style.display = 'none';

    const scrollRightBtn = document.createElement('button');
    scrollRightBtn.className = 'filter-scroll-btn scroll-right';
    scrollRightBtn.innerHTML = '<i class="fa-solid fa-chevron-right"></i>';

    filtersContainer.insertBefore(scrollLeftBtn, filters);
    filtersContainer.appendChild(scrollRightBtn);

    scrollLeftBtn.addEventListener('click', () => {
        filters.scrollBy({ left: -200, behavior: 'smooth' });
    });

    scrollRightBtn.addEventListener('click', () => {
        filters.scrollBy({ left: 200, behavior: 'smooth' });
    });

    filters.addEventListener('scroll', () => {
        scrollLeftBtn.style.display = filters.scrollLeft > 0 ? 'flex' : 'none';

        const maxScrollLeft = filters.scrollWidth - filters.clientWidth;
        scrollRightBtn.style.display = filters.scrollLeft >= maxScrollLeft - 10 ? 'none' : 'flex';
    });

    function checkOverflow() {
        const hasOverflow = filters.scrollWidth > filters.clientWidth;
        scrollRightBtn.style.display = hasOverflow ? 'flex' : 'none';
    }

    checkOverflow();
    window.addEventListener('resize', checkOverflow);
}

function updateActiveFilter() {
    const filters = document.querySelectorAll(".filter");

    filters.forEach(filter => {
        filter.addEventListener("click", function() {
            this.style.transform = "scale(0.95)";
            setTimeout(() => {
                this.style.transform = "";
            }, 200);
        });
    });

    if (!localStorage.getItem('filterTipShown')) {
        const firstFilter = document.querySelector(".filter:nth-child(2)");
        if (firstFilter) {
            const tip = document.createElement('div');
            tip.className = 'filter-tip';
            tip.textContent = 'Try our filters!';
            tip.style = 'position: absolute; background: #333; color: white; padding: 6px 12px; border-radius: 16px; font-size: 12px; top: -25px; animation: bounce 2s infinite; z-index: 100;';

            firstFilter.style.position = 'relative';
            firstFilter.appendChild(tip);

            const style = document.createElement('style');
            style.textContent = '@keyframes bounce { 0%, 100% { transform: translateY(0); } 50% { transform: translateY(-5px); } }';
            document.head.appendChild(style);

            setTimeout(() => {
                if (tip && tip.parentNode) {
                    tip.parentNode.removeChild(tip);
                    localStorage.setItem('filterTipShown', 'true');
                }
            }, 5000);
        }
    }
}

function enhanceToggleButton() {
    const toggle = document.getElementById('toggle-price');
    if (toggle) {
        toggle.addEventListener('change', function() {
            const toggleContainer = document.getElementById('toggle-container');
            toggleContainer.style.transform = 'scale(0.95)';
            setTimeout(() => {
                toggleContainer.style.transform = '';
            }, 200);
        });
    }
}

function attachListingEventListeners() {
    // Add any event listeners needed for dynamically loaded listings
}

document.addEventListener('DOMContentLoaded', function() {
    initializeActiveFilter();
    initializeTogglePrice();
    addFilterScrollButtons();
    updateActiveFilter();
    enhanceToggleButton();
});
