Group Chat App (Personal Project)

A web application with chat features including user authentication, messaging, media support, and admin operations.

## Features
- **Secure User Authentication** using JWT for token-based login and Bcrypt for password hashing.
- **Real-time Chat** functionality for sending and receiving messages instantly.
- **Media File Sharing** support for uploading and sending images or files.
- **Group Chat Management** with features for adding and removing group members.
- **Admin Controls** for group admins to manage members within a group.
- **Seamless Group Creation** where any user can create a group and invite new members.
  
## Technologies Used
- **Frontend**: HTML, Bootstrap (for responsive and stylish UI)
- **Backend**: Node.js, Express.js
- **Database**: MySQL with Sequelize ORM
- **Authentication**: JWT (JSON Web Tokens), Bcrypt
- **Real-time Communication**: Socket.IO

## Project Setup Instructions

### Prerequisites
Make sure you have the following installed:
- [Node.js](https://nodejs.org) (version 14 or higher)
- [MySQL](https://www.mysql.com/) (or another MySQL-compatible database)
- [npm](https://www.npmjs.com/) (Node Package Manager)

### Steps to Set Up

1. **Clone the repository**
   ```bash
   git clone https://github.com/yourusername/group-chat-app.git
   cd group-chat-app
   ```

2. **Install Dependencies**
   Inside the project directory, run the following command to install all necessary dependencies.
   ```bash
   npm install
   ```

3. **Set Up Environment Variables**
   You need to create a `.env` file in the root of your project with the following variables:
   ```env
   DB_HOST=localhost
   DB_USER=root
   DB_PASSWORD=yourpassword
   DB_NAME=groupchat
   JWT_SECRET=your_jwt_secret_key
   ```

4. **Set Up MySQL Database**
   Create a database in MySQL (or another compatible database) with the name specified in your `.env` file (`groupchat`).
   ```sql
   CREATE DATABASE groupchat;
   ```

5. **Run Database Migrations**
   Sequelize will handle the database schema migrations. Run the following command to set up your database tables.
   ```bash
   npx sequelize-cli db:migrate
   ```

6. **Start the Application**
   After setting up the environment, you can run the application:
   ```bash
   npm start
   ```
   This will start the server, and your app will be accessible at `http://localhost:3000` (or a different port if configured).

### Frontend Setup
- The frontend part of the app uses Bootstrap for styling and HTML to handle user interactions.
- For the chat functionality to work, you'll need to configure the Socket.IO client-side logic as per the implementation in the app.

### Testing
- Use the app on your local machine to test all functionalities.
- Ensure to use tools like Postman to test the authentication and CRUD operations (adding/removing group members, sending messages, etc.).

---

## Application Features
- **Login & Registration**:
   - Users can register an account using their email and password.
   - Authentication is handled with JWT tokens to keep users logged in.

- **Group Management**:
   - Any user can create a group and add members to it.
   - Group admins can remove members from the group.
   - Admins have the ability to manage groups.

- **Messaging**:
   - Real-time messaging using Socket.IO for instant message delivery.
   - Users can send both text messages and media files (images, documents).

---

## License
This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.
