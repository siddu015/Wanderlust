const sampleListings = [
    {
        title: "Cozy Beachfront Cottage",
        description: "Escape to this charming beachfront cottage for a relaxing getaway. Enjoy stunning ocean views and the sound of the waves.",
        image: {
            filename: "listingImage",
            url: "https://images.unsplash.com/photo-1516134221268-19bdc6985125?w=800&auto=format&fit=crop&q=60&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8Mjh8fHJlc29ydHxlbnwwfHwwfHx8MA%3D%3D"
        },
        price: 1500,
        location: "Malibu",
        country: "United States",
        reviews: [],
        owner: "671fe0bdcfceb80c960891fd",
        geometry: {
            type: "Point",
            coordinates: [-118.4814, 34.0259]
        },
        category: "Romantic Getaways"
    },
    {
        title: "Modern Loft in Downtown",
        description: "Stay in the heart of the city in this stylish loft apartment. Perfect for urban living with a touch of luxury.",
        image: {
            filename: "listingImage",
            url: "https://images.unsplash.com/photo-1494843805337-17790590e923?q=80&w=2558&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D"
        },
        price: 1200,
        location: "New York City",
        country: "United States",
        reviews: [],
        owner: "671fe0bdcfceb80c960891fd",
        geometry: {
            type: "Point",
            coordinates: [-74.0060, 40.7128]
        },
        category: "Iconic Cities"
    },
    {
        title: "Mountain Retreat",
        description: "Relax in this beautiful mountain retreat, perfect for a quiet getaway surrounded by nature.",
        image: {
            filename: "listingImage",
            url: "https://plus.unsplash.com/premium_photo-1682913629540-3857602b540c?q=80&w=2841&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D"
        },
        price: 2000,
        location: "Aspen",
        country: "United States",
        reviews: [],
        owner: "671fe0bdcfceb80c960891fd",
        geometry: {
            type: "Point",
            coordinates: [-106.8175, 39.1911]
        },
        category: "Mountains"
    },
    {
        title: "Luxury Penthouse",
        description: "Experience the ultimate in luxury living in this stunning penthouse with breathtaking city views.",
        image: {
            filename: "listingImage",
            url: "https://plus.unsplash.com/premium_photo-1669050695617-03cfe6ec763f?q=80&w=2940&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D"
        },
        price: 3500,
        location: "Maui",
        country: "United States",
        reviews: [],
        owner: "671fe0bdcfceb80c960891fd",
        geometry: {
            type: "Point",
            coordinates: [-156.3319, 20.7984]
        },
        category: "Trending"
    },
    {
        title: "Charming Cottage with Garden",
        description: "Relax in this charming cottage with a beautiful garden. Perfect for a peaceful getaway.",
        image: {
            filename: "listingImage",
            url: "https://plus.unsplash.com/premium_photo-1687960116497-0dc41e1808a2?q=80&w=2942&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D"
        },
        price: 1100,
        location: "Nashville",
        country: "United States",
        reviews: [],
        owner: "671fe0bdcfceb80c960891fd",
        geometry: {
            type: "Point",
            coordinates: [-86.7816, 36.1627]
        },
        category: "Rooms"
    },
    {
        title: "Elegant Apartment with Balcony",
        description: "This elegant apartment offers a spacious balcony with breathtaking city views.",
        image: {
            filename: "listingImage",
            url: "https://images.unsplash.com/photo-1520250497591-112f2f40a3f4?q=80&w=2940&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D"
        },
        price: 900,
        location: "Big Bear Lake",
        country: "United States",
        reviews: [],
        owner: "671fe0bdcfceb80c960891fd",
        geometry: {
            type: "Point",
            coordinates: [-116.9213, 34.2442]
        },
        category: "Castles"
    },
    {
        title: "Luxury Chalet in the Mountains",
        description: "Experience the ultimate mountain getaway in this luxury chalet with stunning views.",
        image: {
            filename: "listingImage",
            url: "https://images.unsplash.com/photo-1507525428034-b723cf961d3e?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&q=80&w=800"
        },
        price: 950,
        location: "Los Angeles",
        country: "United States",
        reviews: [],
        owner: "671fe0bdcfceb80c960891fd",
        geometry: {
            type: "Point",
            coordinates: [-118.2437, 34.0522]
        },
        category: "Restaurants"
    },
    {
        title: "Cozy Cabin by the Lake",
        description: "This cozy cabin offers a tranquil lakeside retreat with all the comforts of home.",
        image: {
            filename: "listingImage",
            url: "https://images.unsplash.com/photo-1523413651479-597eb2da0ad6?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&q=80&w=800"
        },
        price: 4000,
        location: "Key West",
        country: "United States",
        reviews: [],
        owner: "671fe0bdcfceb80c960891fd",
        geometry: {
            type: "Point",
            coordinates: [-81.7824, 24.5551]
        },
        category: "Romantic Getaways"
    },
    {
        title: "Modern Home with Pool",
        description: "This modern home features a private pool and spacious outdoor living area.",
        image: {
            filename: "listingImage",
            url: "https://images.unsplash.com/photo-1502672260266-1c1ef2d93688?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&q=80&w=800"
        },
        price: 3000,
        location: "Savannah",
        country: "United States",
        reviews: [],
        owner: "671fe0bdcfceb80c960891fd",
        geometry: {
            type: "Point",
            coordinates: [-81.0920, 32.0835]
        },
        category: "Iconic Cities"
    },
    {
        title: "Spacious Farmhouse with Land",
        description: "This spacious farmhouse offers plenty of room and land for outdoor activities.",
        image: {
            filename: "listingImage",
            url: "https://plus.unsplash.com/premium_photo-1676517030737-5ac484676ea7?q=80&w=2787&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D"
        },
        price: 1200,
        location: "Sedona",
        country: "United States",
        reviews: [],
        owner: "671fe0bdcfceb80c960891fd",
        geometry: {
            type: "Point",
            coordinates: [-111.7610, 34.8697]
        },
        category: "Amazing Pools"
    },
    {
        title: "Beachfront Villa with Infinity Pool",
        description: "Indulge in luxury at this beachfront villa with an infinity pool and breathtaking ocean views.",
        image: {
            filename: "listingImage",
            url: "https://images.unsplash.com/photo-1502672023488-70e25813eb80?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&q=80&w=800"
        },
        price: 1100,
        location: "San Francisco",
        country: "United States",
        reviews: [],
        owner: "671fe0bdcfceb80c960891fd",
        geometry: {
            type: "Point",
            coordinates: [-122.4194, 37.7749]
        },
        category: "Pet-Friendly"
    },
    {
        title: "Penthouse with Rooftop Terrace",
        description: "Enjoy panoramic city views from the rooftop terrace of this luxury penthouse.",
        image: {
            filename: "listingImage",
            url: "https://images.unsplash.com/photo-1493809842364-78817add7ffb?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&q=80&w=800"
        },
        price: 1300,
        location: "Chicago",
        country: "United States",
        reviews: [],
        owner: "671fe0bdcfceb80c960891fd",
        geometry: {
            type: "Point",
            coordinates: [-87.6298, 41.8781]
        },
        category: "Restaurants"
    },
    {
        title: "Rustic Lodge in the Forest",
        description: "This rustic lodge is nestled in the forest, offering a peaceful retreat with nature trails.",
        image: {
            filename: "listingImage",
            url: "https://images.unsplash.com/photo-1529316275402-0462fcc4abd6?q=80&w=2942&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D"
        },
        price: 4500,
        location: "Los Cabos",
        country: "Mexico",
        reviews: [],
        owner: "671fe0bdcfceb80c960891fd",
        geometry: {
            type: "Point",
            coordinates: [-109.8657, 22.8861]
        },
        category: "Iconic Cities"
    },
    {
        title: "Modern Studio in the City Center",
        description: "This modern studio offers the perfect blend of comfort and convenience in the city center.",
        image: {
            filename: "listingImage",
            url: "https://images.unsplash.com/photo-1497366754035-f200968a6e72?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&q=80&w=800"
        },
        price: 800,
        location: "Olympic National Park",
        country: "United States",
        reviews: [],
        owner: "671fe0bdcfceb80c960891fd",
        geometry: {
            type: "Point",
            coordinates: [-123.9690, 47.8029]
        },
        category: "Amazing Pools"
    },
    {
        title: "Beachfront Paradise",
        description: "Relax in this beachfront paradise, offering serene views and comfortable living.",
        image: {
            filename: "listingImage",
            url: "https://images.unsplash.com/photo-1493809842364-78817add7ffb?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&q=80&w=800"
        },
        price: 5000,
        location: "Maldives",
        country: "Maldives",
        reviews: [],
        owner: "671fe0bdcfceb80c960891fd",
        geometry: {
            type: "Point",
            coordinates: [73.5089, 3.2028]
        },
        category: "Amazing Pools"
    },
    {
        title: "Luxury Estate with Private Gardens",
        description: "This luxury estate features private gardens and stunning architecture, perfect for hosting events.",
        image: {
            filename: "listingImage",
            url: "https://images.unsplash.com/photo-1523413651479-597eb2da0ad6?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&q=80&w=800"
        },
        price: 1200,
        location: "Santa Monica",
        country: "United States",
        reviews: [],
        owner: "671fe0bdcfceb80c960891fd",
        geometry: {
            type: "Point",
            coordinates: [-118.4912, 34.0194]
        },
        category: "Amazing Pools"
    },
    {
        title: "Modern Loft in Downtown",
        description: "Stay in the heart of the city in this stylish loft apartment. Perfect for urban living with a touch of luxury.",
        image: {
            filename: "listingImage",
            url: "https://plus.unsplash.com/premium_photo-1676517030737-5ac484676ea7?q=80&w=2787&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D"
        },
        price: 7000,
        location: "Bora Bora",
        country: "French Polynesia",
        reviews: [],
        owner: "671fe0bdcfceb80c960891fd",
        geometry: {
            type: "Point",
            coordinates: [-151.7415, -16.5002]
        },
        category: "Free Wi-Fi"
    }
];

module.exports = { data: sampleListings }