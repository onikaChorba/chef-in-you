# Chef in You - Backend

The backend of Chef in You is responsible for handling user authentication, recipe management, and interactions with ingredients and cooking steps. It provides a RESTful API to support the frontend application.

## Technologies Used

- Node.js - Runtime environment

- Express.js - Web framework

- MongoDB - Database

- Mongoose - ODM for database interactions

- JWT - Authentication

- bcrypt - Password hashing

- Multer - File upload handling

- Cors - Cross-origin resource sharing

- dotenv - Environment variable management

## API Endpoints

# Authentication

- POST /registration - User registration

- POST /login - User login

- GET /me - Get authenticated user details

# File Upload

- POST /upload - Upload an image (authenticated users only)

# Recipes

- GET /api/recipes - Get all recipes

- GET /api/recipes/tags - Get last tags

- GET /api/recipes/:id - Get recipe by ID

- POST /api/recipes - Create a new recipe (authenticated users only)

- DELETE /api/recipes/:id - Delete a recipe (authenticated users only)

- PATCH /api/recipes/:id - Update a recipe (authenticated users only)

# Authentication & Security

- Users authenticate using JWT tokens.

- Passwords are securely hashed using bcrypt.

- Role-based access control for different API endpoints.
