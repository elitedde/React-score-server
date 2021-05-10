# `react-score-server`

The `react-score-server` is the server-side app companion of [`react-scores`](https://github.com/polito-wa1-aw1-2021/react-scores). It presents some APIs to perform CRUD operations on a student's university exams.

## APIs
Hereafter, we report the designed HTTP APIs, also implemented in the project.
## vorrei collezioni corsi e esami
### __List all courses__
## tutte API iniziano con /api 
URL: `/api/courses`

HTTP Method: GET

Description: Get all courses that the student needs to pass.

Request body: _None_
## stato HTTP
Response: `200 OK` (success) or `500 Internal Server Error` (generic error)

## corpo risposta : è un array di oggetti
Response body:
```
[
  {
    "code": "01TYMOV",
    "name": "Web Applications I",
    "CFU": 6
  },
  {
    "code": "01TABC",
    "name": "Information system security",
    "CFU": 10
  },
  ...
]
```
## dato codice corso, trovo corso dato il suo codice
### __Get a course (by code)__

URL: `/api/courses/<code>`

HTTP Method: GET

Description: Get the course identified by the code `code`.

Request body: _None_

Response: `200 OK` (success), `500 Internal Server Error` (generic error), `404 Not Found` (wrong code, se non esiste quel codice)
## risposta è un solo oggetto
Response body:
```
{
  "code": "01TYMOV",
  "name": "Web Applications I",
  "CFU": 6
}
```
### __List all exams

URL: `/api/exams`

HTTP Method: GET

Description: Get all exams that the student already passed.

Request body: _None_

Response: `200 OK` (success) or `500 Internal Server Error` (generic error)

Response body:
```
[
  {
    "code": "01TYMOV",
    "score": 31,
    "date": "2021-02-01"
  },
  {
    "code": "01TABC",
    "score": 25,
    "date": "2021-03-05"
  },
  ...
]
```
### __Add a new exam__

URL: `/api/exams`

HTTP Method: POST

Description: Add a new passed exam.

Request body: An object that represents an exam (Content-Type: `application/json`).
```
{
  "code": "01TYMOV",
  "score": 26,
  "date": "2021-02-23"
}
```

Response: `201` (success - oggetto creato con successo), `503` (generic error, e.g., if adding an already existent exam). If the request body is not valid, `422 Unprocessable Entity`.

Response body: _None_

### __Update an existing exam__

URL: `/api/exams/<code>`

HTTP Method: PUT

Description: Update (entirely) an existing exam ovvero passo tutto oggetto esame, given its code.

Request body: An object that represents an exam (Content-Type: `application/json`).
```
{
  "code": "01TYMOV",
  "score": 27,
  "date": "2021-02-23"
}
```

Response: `200` (success), `503` (generic error). If the request body is not valid, `422 Unprocessable Entity`.

Response body: _None_

### __Delete an existing exam__

URL: `/api/exams/<code>`

HTTP Method: DELETE

Description: Delete an existing exam, given its code.

Request body: _None_

Response: `204` (success, è un ok ma non ha contenuto da passare), `503` (error).

Response body: _None_