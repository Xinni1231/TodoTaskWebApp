# TodoList API

The TodoList API is a simple RESTful API built with ASP.NET that allows users to manage their to-do lists.

## Getting Started

To get started with the TodoList API, follow these steps:

### Client (front-end)

- React with Redux and Javascript

### Service (back-end)

- .NET 7.0
- Unit Test

### Installing

1. Clone the repository: [TodoWebApp](https://github.com/Xinni1231/TodoTaskWebApp)


## How to run locally

1. [Download and install the .NET Core SDK](https://dotnet.microsoft.com/download)
    * In this project, database connection is point to private Azure Database
2. Open a terminal such as **PowerShell**, **Command Prompt**, or **bash** and navigate to the `TodoWebApp` folder
3. Run the following `dotnet` commands:

```sh
cd TodoWebApp
dotnet restore
dotnet build
dotnet run --project  ./webapi/webapi.csproj --urls "https://localhost:7235"

```
3. Open your browser to: `https://localhost:7235/swagger`.
4. In another terminal, navigate to the `reactapp` folder and run the `npm` commands:
```sh
cd reactapp
npm install
npm start
```
5. The webpack dev server hosts the front-end and your browser will open to: `http://localhost:3000`

## Usage

The TodoItems API provides the following endpoints:

- `GET /api/TodoItems/ids`: Get all todos by sort name and filter name.
- `GET /api/todos/{id}`: Get a todo by ID.
- `POST /api/todos`: Add a new todo.
- `PUT /api/todos/{id}`: Update an existing todo.
- `DELETE /api/todos/{id}`: Delete a todo by ID.

#### Example Usage

To get all todos by sort name and filter name:
```
GET /api/TodoItems/ids?sortName=-&filters=-
```
To get a todo by ID:
```
GET /api/TodoItems/1
```
To add a new todo:
```
POST /api/TodoItems
Content-Type: application/json

{
  "id": 0,
  "name": "string",
  "description": "string",
  "dueDate": "2023-04-23T06:13:24.836Z",
  "status": 1,
  "priority": 1,
  "creator": "string",
  "dateCreated": "2023-04-23T06:13:24.836Z",
  "dateModified": "2023-04-23T06:13:24.836Z"
}
```
To update an existing todo:
```
PUT /api/TodoItems/1
Content-Type: application/json

{
  "id": 0,
  "name": "string",
  "description": "string",
  "dueDate": "2023-04-23T06:14:50.492Z",
  "status": 1,
  "priority": 1,
  "creator": "string",
  "dateCreated": "2023-04-23T06:14:50.492Z",
  "dateModified": "2023-04-23T06:14:50.492Z"
}
```
To delete a todo by ID:
```
DELETE /api/TodoItems/1
```
