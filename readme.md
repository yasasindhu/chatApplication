# Chat Application

Real-time chat application with user registration, login, and WebSocket-based messaging.

## Features

- User registration and login
- Real-time chat with WebSocket
- Online user tracking
- JWT authentication
- Secure password storage with bcrypt
- MongoDB integration for user data and chat history
- Responsive UI design with Tailwind CSS

## Technologies Used

- Node.js
- MongoDB
- React
- Express
- WebSocket
- Tailwind CSS

## Getting Started

1. **Clone the repository:**

   ```bash
   git clone https://github.com/your-username/chat-application.git 
   ```
2. **Install dependency:**

    - Install dependencies in api 
        ```bash
        cd api
        npm i
        ```
    - Install dependencies in client 
        ```bash
        cd client
        npm i
        ```
        
3. **Configure environment variables:**
    Create a .env file in the api directory with the following: 

     ```  
     PORT=4000
            MONGO_URL=your_mongodb_connection_string
            JWT_SECRET=your_jwt_secret
            CLIENT_URL=http://localhost:5173
     ```

    Create a .env file in the client directory with the following: 

     ```  
     VITE_API_BASE_URL="http://localhost:4000/api",
     VITE_WEBSOCKET_URL="ws://localhost:4000/api/"
           
     ```
4. **Usage:**
     - To start Api use

        ```
        nodemon index.js
        ```
    - To start client use
        ```
        npm run dev
        ```

## Screenshots 
![register](/assets/images/register.png)
![login](/assets/images/login.png)
![initialScreen](/assets/images/noUserSelected.png)
![coversation](/assets/images/conversation.png)
![conversationEnd](/assets/images/conversationEnd.png)
![conv0](/assets/images/conversation1.png)


## Authentication

- Uses JWT for authentication.
- JWT token is generated and stored on user registration or login.
- Include the token in the header for authenticated routes.

## Database

- MongoDB stores user information and chat history.
- Passwords are securely hashed using bcrypt.

## Deployment

Deployed on Vercel.

                    