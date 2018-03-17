# Git Better Server

REST-ful API Server for the **Git Better** project.

> Git Better is the web app all novice git users have been looking for. 
Practice daily to bring your git-jitsu up to date.


[Live Demo on Heroku](http://git-better-server.herokuapp.com/api/users)

## Endpoints

**Users Route**

```
POST /api/users
```

Accepts:
```json
{
  "username":"alice",
  "password":"secret",
  "firstName":"Alice",
  "lastName":"Allison"
}
```

```
GET /api/users
```
Returns:
```json
  [
    {
      "id":"123456789",
      "username":"Oscar",
      "firstName":"Oscar",
      "lastName":"the Cat"
    }
  ]
```

**Auth Route**

```
POST '/api/auth/login
```
Accepts:
```json
{
  "username":"Oscar",
  "password":"c@tn!p4m3:D"
}
```
Returns:
```json
{
  "authToken":"some.encodedToken.string"
}
```
```
POST /api/auth/refresh
```
Headers:
```
AUTHORIZATION: Bearer some.encodedToken.string
```

**Questions Route**

```
GET /api/questions/v2
```
Returns:
```json
[
  {
    "question":"red and blue make which color?",
    "answer":"purple"
  }
]
```

```
PUT /api/questions/v2
```
Accepts:
```
{
  "questionId":"123456789",
  "answer":"true"
}
```