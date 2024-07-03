# Go-Chain

Go-Chain is a custom cryptocurrency blockchain implementation with transaction management and validation. This project includes the following features and components. :point_down:

## Features

### Blockchain Implementation :bricks:

- A custom cryptocurrency blockchain.
- Transaction management and validation.

### Transaction Pool :water_polo:

- Managed transactions before adding them to a block.
- Created and tracked reward transactions in the transaction pool.

### Validation :white_check_mark:

- Validated transactions to ensure they follow specified rules.

### Networking :magnet:

- Supported multiple nodes with blockchain synchronization.
- Utilized Redis for network communication.

### Database :floppy_disk:

- Stored the blockchain, blocks, and transactions in a MongoDB database.

### Security :closed_lock_with_key:

- Implemented user registration and login.
- Used JSON Web Tokens (JWT) for user validation.
- Stored user information in MongoDB.

### Client Application :balloon:

- Developed a client application using React with Vite.
- Enabled the creation of new transactions.
- Listed transactions and blocks.
- Provided functionality to mine blocks with transactions.

### Best Practices :crystal_ball:

- TDD for transaction management.
- Followed best practices: Clean Code, Separation of Concerns (SOC) and Model-View-Controller (MVC).
- Secured the server against various attacks, including NoSQL injections, DDOS and XSS attempts.

## Installation :scroll:

To run this project locally, follow these steps:

1. **Clone the repository:**

   ```sh
   git clone https://github.com/codebatine/gochain.git
   cd gochain
   ```

2. **Install dependencies for both backend and frontend:**

   ```sh
   cd backend
   npm install
   cd ../frontend
   npm install
   ```

3. **Run Redis server:**

   ```sh
   redis-server
   ```

4. **Set up MongoDB:**

   Make sure you have MongoDB installed and running on your local machine.

5. **Add environment variables:**

   Create a file named `.env` in the `backend/config` directory with the following content:

   ```env
   NODE_ENV=development
   PORT=5000
   MONGO_URI=your_mongo_uri_here
   JWT_SECRET=your_jwt_secret_here
   JWT_TTL=90d
   JWT_COOKIE_TTL=90d
   REDIS_HOST=localhost
   REDIS_PORT=6379
   ```

6. **Start the backend and frontend servers:**

   Open two terminal windows or tabs, and run the following commands in each:

   **In the first terminal (backend):**

   ```sh
   cd backend
   npm run dev
   ```

   **In the second terminal (frontend):**

   ```sh
   cd frontend
   npm run dev
   ```

   7. **Run tests in backend:**

   To run tests for the backend, use the following command:

   ```sh
   cd backend
   npm test
   ```

## Usage :flamingo;

1. **Register and log in:**

   - Create a new user account and log in to access the blockchain features.

2. **Create transactions:**

   - Use the client application to create and send new transactions.

3. **Mine blocks:**

   - Mine blocks to add transactions to the blockchain and receive rewards.

4. **View blockchain:**
   - Explore the blockchain, view transactions, and monitor blocks.

## Screenshots :camera_flash:

Here are some screenshots of the Go-Chain application in action:

### Registration and Login

![Registration](path_to_screenshot1)
![Login](path_to_screenshot2)

### Creating a Transaction

![Create Transaction](path_to_screenshot3)

### Mining a Block

![Mine Block](path_to_screenshot4)

### Viewing the Blockchain

![View Blockchain](path_to_screenshot5)
