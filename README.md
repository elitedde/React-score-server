# `react-score-server`

The `react-score-server` is the server-side app companion of [`react-scores`](https://github.com/polito-wa1-aw1-2021/react-scores). It presents some APIs to perform CRUD operations on a student's university exams.

## APIs
Hereafter, we report the designed HTTP APIs, also implemented in the project.

### __Retrieve the list of all the  available tasks__

URL: `/api/tasks`

HTTP Method: GET

Description: Get all tasks.

Request body: _None_
## stato HTTP
Response: `200 OK` (success) or `500 Internal Server Error` (generic error)

corpo risposta : è un array di oggetti

Response body:
```
[
  {
    "description": "laundry",
    "important": 0,
    "private": 1,
    "deadline": NULL;
  },
  {
    "description": "monday lab",
    "important": 0,
    "private": 0,
    "deadline": 2021-03-16T09:00:00.000Z;
  },
  ...
]
```
### __Retrieve a list of all the tasks that fulfill a given filter__

URL: `/api/tasks/<filter>`

HTTP Method: GET

Description: Get all tasks that fulfill a given filter `filter`.

Request body: _None_
## stato HTTP
Response: `200 OK` (success) or `500 Internal Server Error` (generic error) or , `404 Not Found` (filter doesn't exist)

corpo risposta : è un array di oggetti

Response body:
```
[
  {
    "description": "laundry",
    "important": 0,
    "private": 1,
    "deadline": NULL;
  },
  {
    "description": "monday lab",
    "important": 1,
    "private": 1,
    "deadline": 2021-03-16T09:00:00.000Z;
  },
  ...
]
```

### __Retrieve a task, given its “id”__

URL: `/api/tasks/<id>`

HTTP Method: GET

Description: Get the task identified by the id `id`.

Request body: _None_

Response: `200 OK` (success), `500 Internal Server Error` (generic error), `404 Not Found` (wrong id)

risposta è un solo oggetto

Response body:
```
{
    "description": "laundry",
    "important": 0,
    "private": 1,
    "deadline": NULL;
}
```
### __Add a new task__

URL: `/api/tasks`

HTTP Method: POST

Description: Add a new task.

Request body: An object that represents an task (Content-Type: `application/json`).
```
{
    "description": "laundry",
    "important": 0,
    "private": 1,
    "deadline": NULL;
}
```

Response: `201` (success - oggetto creato con successo), `503` (generic error, e.g., if adding an already existent task). If the request body is not valid, `422 Unprocessable Entity`.

Response body: _None_

### __Update an existing task__

URL: `/api/tasks/<id>`

HTTP Method: PUT

Description: Update an existing task given its id by providing all relevant information – except the “id” that will be automatically assigned by the back-end;

Request body: An object that represents an task (Content-Type: `application/json`).
```
{
    "description": "laundry",
    "important": 1,
    "private": 1,
    "deadline": NULL;
}
```

Response: `200` (success), `503` (generic error). If the request body is not valid, `422 Unprocessable Entity`.

Response body: _None_

### __Delete an existing task__

URL: `/api/tasks/<id>`

HTTP Method: DELETE

Description: Delete an existing task, given its id `id`

Request body: _None_

Response: `204` (success, è un ok ma non ha contenuto da passare), `503` (error).

Response body: _None_

### __Mark an existing task as completed/uncompleted__

URL: /api/tasks/<id>

HTTP Method: PUT

Description: mark an existing task as completed/uncompleted given its id

Request body: An object that represents a task (Content-Type: application/json).

  {
    "description": "Eat whitw chocolate",
    "important": 0,
    "private": 1,
    "deadline": "2021-05-24 09:00",
    "completed": 1,
    "user": 1
  }
Response: 200 (success), 503 (generic error). If the request body is not valid, 422 Unprocessable Entity.

Response body: None