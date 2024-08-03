# MiniMiracle Backend

Welcome to the backend server of MiniMiracle! This project serves as the backbone for our ecommerce platform, handling everything from authentication to payment processing.

## Getting Started

To get the server up and running on your local machine, follow these steps:

### Prerequisites

Make sure you have the following installed:

- [Node.js](https://nodejs.org/) (v14 or higher)
- [PostgreSQL](https://www.postgresql.org/)
- [Prisma CLI](https://www.prisma.io/docs/getting-started)

### Installation

1. **Clone the repository:**

    git clone https://github.com/Init-Projectx/server.git
    cd server

2. **Environment Variables:**

    Create a `.env` file in the root directory and `.env-docker` if you're using Docker. Use the `.env.example` and `.env-docker.example` as templates:

    cp .env.example .env
    cp .env-docker.example .env-docker

    Fill in the necessary values in these files.

3. **Install dependencies:**

    npm install

4. **Database Migration:**

    npx prisma migrate dev

5. **Start the server:**

    npm run dev
    # or
    yarn dev
    # or
    pnpm dev
    # or
    bun dev

### Using Docker

If you prefer using Docker, follow these steps:

1. **Build the Docker image:**

    docker build -t minimiracle-backend .

2. **Run the Docker container:**

    docker-compose up

## Technologies Used

- **Express.js:** Fast, unopinionated, minimalist web framework for Node.js
- **Prisma ORM:** Next-generation ORM for Node.js and TypeScript
- **JWT:** JSON Web Tokens for authentication
- **bcrypt:** Library to hash passwords
- **Midtrans:** Payment gateway integration
- **RajaOngkir:** API to calculate shipping costs
- **NodeMailer:** Library to send email notifications

## Features

- **Authentication:** Secure user authentication using JWT and bcrypt for password hashing.
- **Payments:** Integrated with Midtrans for payment processing.
- **Shipping Costs:** Uses RajaOngkir to fetch shipping cost information.
- **Email Notifications:** Sends email notifications using NodeMailer.

## Project Structure

    ├── prisma                  # Prisma schema and migrations
    ├── src
    │   ├── controllers         # Route controllers
    │   ├── middlewares         # Custom middlewares
    │   ├── models              # Database models
    │   ├── routes              # Application routes
    │   ├── services            # Business logic and services
    │   ├── lib                 # Utility functions
    │   └── server.js           # Express app initialization
    ├── .env                    # Environment variables
    ├── .env-docker             # Docker-specific environment variables
    ├── docker-compose.yml      # Docker Compose configuration
    ├── Dockerfile              # Docker configuration
    ├── package.json            # NPM dependencies and scripts
    └── README.md               # Project documentation

## API Endpoints

Detailed API documentation can be found [here](https://documenter.getpostman.com/view/33629171/2sA3e1Bpua).

## Contributing

Contributions are welcome! Please fork the repository and create a pull request with your changes. 

---

Happy coding!
