# Express Task Manager

A RESTful API for managing tasks built with Express.js and TypeScript.

## Features

- CRUD operations for tasks
- TypeScript for type safety
- Express.js for routing and middleware
- Jest for testing
- MongoDB for data persistence
- Input validation
- Error handling

## Prerequisites

- Node.js (v14 or higher)
- MongoDB
- npm or yarn

## Installation

1. Clone the repository:
```bash
git clone https://github.com/pomipomie/express_task_manager.git
cd express_task_manager
```

2. Install dependencies:
```bash
npm install
```

3. Create a `.env` file in the root directory and add your MongoDB connection string:
```
MONGODB_URI=your_mongodb_connection_string
PORT=3000
```

4. Start the development server:
```bash
npm run dev
```

## API Documentation

### Endpoints

#### Get all tasks
- **GET** `/api/tasks`
- **Response**: Array of task objects
```json
[
  {
    "id": "string",
    "title": "string",
    "description": "string",
    "status": "pending" | "completed"
  }
]
```

#### Create a task
- **POST** `/api/tasks`
- **Body**:
```json
{
  "title": "string",
  "description": "string",
  "status": "pending" | "completed"
}
```
- **Response**: Created task object

#### Get task by ID
- **GET** `/api/tasks/:id`
- **Response**: Task object
```json
{
  "id": "string",
  "title": "string",
  "description": "string",
  "status": "pending" | "completed"
}
```

#### Update task
- **PUT** `/api/tasks/:id`
- **Body**: Fields to update
```json
{
  "title": "string",
  "description": "string",
  "status": "pending" | "completed"
}
```
- **Response**: Updated task object

#### Delete task
- **DELETE** `/api/tasks/:id`
- **Response**: Success message

## Architecture

The project follows a clean architecture pattern with the following structure:

```
src/
├── api/
│   ├── controllers/    # Request handlers
│   ├── services/       # Services
│   ├── routes/         # Route definitions
│   ├── validators/     # Validation middleware
│   └── middleware/     # Custom middleware
├── data/               
│   ├── cache/          # Cache management
│   ├── models/         # Data models
├── domain/             # Business logic
│   ├── dto/            # Data tranfer objects
│   ├── entities/       # Data entities
│   ├── interfaces/     # Data interfaces
│   ├── repositories/   # Core logic
└── utils/              # Helper functions and utilities
```

### Design Decisions

1. **TypeScript**: Used for better type safety and developer experience
2. **MongoDB**: Chosen for its flexibility with document-based data
3. **Express.js**: Lightweight and flexible web framework
4. **Repository Pattern**: Separates data access from business logic
5. **Jest**: Comprehensive testing framework

## Testing

The project includes unit tests and integration tests. To run the tests:

```bash
# Run all tests
npm test

# Run tests with coverage
npm run test:coverage

# Run tests in watch mode
npm run test:watch
```

### Test Structure

- `__tests__/controllers/`: Controller unit tests
- `__tests__/routes/`: API endpoint integration tests

## Contributing

1. Fork the repository
2. Create a feature branch
3. Commit your changes
4. Push to the branch
5. Create a Pull Request

## License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.