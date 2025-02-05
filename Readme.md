# Wanderlust

Wanderlust is a platform where users can rent out their locations. Users can log in manually or via Google, manage their profiles, upload pictures, and create listings with map integration. The platform ensures user authentication, and the ability to add, modify, or delete reviews and listings. The project includes a complete UI/UX design, frontend, backend, and production deployment.

---

## Features

- **User Authentication**:
    - Manual login/signup.
    - Google OAuth login.
- **Profile Management**:
    - View and edit user profiles.
    - Upload and update profile pictures.
- **Listings**:
    - Create, modify, or delete listings.
    - Map integration for location-based listings.
- **Reviews**:
    - Add reviews to listings.
    - Delete only your own reviews.
- **Secure Messaging**:
    - Users must be logged in to create listings.
- **Production Deployment**:
    - Fully deployed and updated in production.

---

## Technologies Used

- **Frontend**: HTML, CSS, Bootstrap, TailwindCSS,  (or any other framework you used).
- **Backend**: Node.js, Express.js, JavaScript
- **Database**: MongoDB (Atlas for production, local for development).
- **Authentication**: Passport.js (for Google OAuth and manual login).
- **Image Upload**: Cloudinary.
- **Map Integration**: Mapbox.
- **Environment Management**: `.env` file.

---

## Setup and Installation

Follow these steps to set up and run the project locally:

### 1. Clone the Repository
```bash
https://github.com/siddu015/Wanderlust.git
cd Wanderlust
```

### 2. Install Dependencies
Install the required npm packages for both the frontend and backend:
```bash
npm install
```

### 3. Set Up Environment Variables
Create a `.env` file in the root directory and add the following variables:
```env
# Cloudinary for image uploads
CLOUD_NAME=your_cloud_name
CLOUD_API_KEY=your_cloud_api_key
CLOUD_API_SECRET=your_cloud_api_secret

# Mapbox for map integration
MAP_TOKEN=your_mapbox_token

# MongoDB for database
ATLASDB_URL=your_mongodb_atlas_url  # for production
MONGO_URL=mongodb://localhost:27017/wanderlust  # for local development

# Authentication
SECRET=your_jwt_secret_key
GOOGLE_CLIENT_ID=your_google_client_id
GOOGLE_CLIENT_SECRET=your_google_client_secret
```

### 4. Run the Project
Start the backend server:
```bash
nodemon app.js  
```

### 5. Access the Application
Open your browser and go to:
```
http://localhost:8080
```

---

## Production Deployment

The project is deployed and updated in production. Ensure the following environment variables are set in your production environment:
- `ATLASDB_URL` for MongoDB Atlas.
- `CLOUD_NAME`, `CLOUD_API_KEY`, and `CLOUD_API_SECRET` for Cloudinary.
- `MAP_TOKEN` for Mapbox.
- `SECRET`, `GOOGLE_CLIENT_ID`, and `GOOGLE_CLIENT_SECRET` for authentication.

---

## Usage

1. **Sign Up/Log In**:
    - Create an account manually or log in using Google.
2. **Profile Management**:
    - Edit your profile and upload a profile picture.
3. **Create a Listing**:
    - Add a new listing with location-based map integration.
4. **Add Reviews**:
    - Leave reviews on listings (only your reviews can be deleted).
5. **Manage your Listing Messaging**:
    - Modify or delete your listings (login required).

---

## Contributing

Contributions are welcome! If you'd like to contribute, please follow these steps:
1. Fork the repository.
2. Create a new branch (`git checkout -b feature/YourFeatureName`).
3. Commit your changes (`git commit -m 'Add some feature'`).
4. Push to the branch (`git push origin feature/YourFeatureName`).
5. Open a pull request.

---


## Acknowledgments

- [Cloudinary](https://cloudinary.com/) for image upload and storage.
- [Mapbox](https://www.mapbox.com/) for map integration.
- [Google OAuth](https://developers.google.com/identity) for authentication.
- [MongoDB Atlas](https://www.mongodb.com/cloud/atlas) for database hosting.

---


Enjoy using **Wanderlust**! 🌍✨
