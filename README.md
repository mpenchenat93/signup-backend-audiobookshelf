# Node Serverless Backend for Audiobookshelf Signup

## Description

This is a Node.js serverless backend application designed to run on **Vercel**. 

## Endpoints

### `GET /hello`

- **Description**:  
  Returns a simple "Hello World" message.  
  Useful for health checks and verifying if the backend is running.

- **Response**:  
  ```json
  {
    "message": "Hello World"
  }
  ```

---

### `POST /signup`

- **Description**:  
  Creates a new user in the Audiobookshelf instance.

- **Request Body** (JSON):
  ```json
  {
    "email": "user@example.com",
    "name": "John Doe",
    "password": "securepassword123"
  }
  ```

- **Process


## Features

### Endpoints

1. **GET /hello**
   - **Description**: A health check endpoint to verify if the backend is operational.
   - **Response**:  
     ```
     {
       "message": "Hello World"
     }
     ```

2. **POST /signup**
   - **Description**: Creates a new user on the Audiobookshelf instance.
   - **Request Body**:  
     The endpoint expects a JSON payload with the following fields:
     ```json
     {
       "email": "user@example.com",
       "name": "John Doe",
       "password": "securepassword"
     }
     ```
   - **Response**:  
     On success:
     ```json
     {
       "status": "success",
       "message": "User created successfully."
     }
     ```
     On failure:
     ```json
     {
       "status": "error",
       "message": "Reason for the failure"
     }
     ```

---

## Environment Variables

The application requires the following environment variables to be set in a `.env` file:

- `BASE_URL`: The base URL of your Audiobookshelf instance.
- `LOGIN_USERNAME`: The username of the admin account to authenticate with Audiobookshelf.
- `LOGIN_PASSWORD`: The password of the admin account.
- `HOST_CLIENT_URL`: The frontend URL interacting with this backend.

Here is an example `.env` file with randomized values:

```env
BASE_URL=https://audiobookshelf-xyz123.vercel.app
LOGIN_USERNAME=admin123
LOGIN_PASSWORD=supersecurepassword789
HOST_CLIENT_URL=https://signup-frontend-abc456.vercel.app
```

---

## Deployment

This application is designed to be deployed on [Vercel](https://vercel.com). Follow these steps to deploy:

1. Clone the repository:
   ```bash
   git clone https://github.com/mpenchenat93/signup-backend-audiobookshelf
   cd node-serverless-backend
   ```

2. Install dependencies:
   ```bash
   npm install
   ```

3. Create a `.env` file in the root directory with your environment variables.

4. Deploy to Vercel:
   ```bash
   vercel
   ```

---

## Usage

### Running Locally

To test the application locally:

1. Install the [Vercel CLI](https://vercel.com/docs/cli):
   ```bash
   npm install -g vercel
   ```

2. Start the development server:
   ```bash
   vercel dev
   ```

3. Test the endpoints:
   - Health Check: Visit `http://localhost:3000/api/hello`.
   - Signup: Use a tool like Postman to send a `POST` request to `http://localhost:3000/api/signup` with the required fields.

---

## Technology Stack

- **Node.js**: Backend runtime.
- **Serverless**: Function-based backend hosted on Vercel.
- **Audiobookshelf API**: For user management.
- **Vercel**: Hosting and deployment.

---

## Frontend Integration

This backend works in conjunction with the **Angular frontend** hosted at:
`https://signup-frontend-audiobookshelf.vercel.app`. The frontend handles user input and communicates with this backend to perform the signup process.

---

## Security Considerations

- Ensure the `LOGIN_PASSWORD` is stored securely and not hardcoded in the source code.
- Use HTTPS to secure communication between the frontend and backend.

---

## Future Improvements

- Add rate limiting to the `/signup` endpoint to prevent abuse.
- Implement input validation for the `signup` payload.
- Add more robust error handling and logging.

---

## License

This project is released under a Modified MIT License. The following conditions specifically apply to any portions related to Maria Valtorta:

- Mandatory Anonymization: Any redistribution or reuse must remove all explicit or implicit references to Maria Valtorta, her writings, and any associated entities (e.g., the Maria Valtorta association or foundation).

- Removal of Related Information: All contact information, mentions, or links related to the Maria Valtorta association or foundation must be removed prior to redistribution.

The remainder of the project is licensed under the standard MIT terms, allowing free use, modification, and redistribution as long as these conditions are met and the copyright notice is preserved.


---

## Contact

For questions or support, please contact:

**Matthieu Penchenat**  
Email: [matthieu.penchenat@protonmail.com](mailto:matthieu.penchenat@protonmail.com)  
LinkedIn: [Matthieu Penchenat](https://www.linkedin.com/in/penchenat-matthieu/)
