
# Account Service

This server only allows users to log in, register, and check tokens.


## Installation

Install my-project with git

```bash
    git clone project url
    cd project

    npm install
    npm run build
    npm start
```
    
## API Reference

#### Login

```http
  POST /v1/login
```

| Body | Type     | Description                |
| :-------- | :------- | :------------------------- |
| `username` | `string` | **Required** |
| `password` | `string` | **Required** |

#### Registration

```http
  POST /v1/registration
```

| Body | Type     | Description                |
| :-------- | :------- | :------------------------- |
| `username` | `string` | **Required** |
| `password` | `string` | **Required** |


#### Presence

```http
  GET /v1/presence
```

| Header | Type     | Description                |
| :-------- | :------- | :------------------------- |
| `authorization` | `string` | **Required** Bearer token |


#### Password Update

```http
  PATCH /v1/update/password
```

| Header | Type     | Description                |
| :-------- | :------- | :------------------------- |
| `authorization` | `string` | **Required** Bearer token |

| Body | Type     | Description                |
| :-------- | :------- | :------------------------- |
| `current` | `string` | **Required** Current password |
| `updated` | `string` | **Required** Current password |

#### About Update

```http
  PATCH /v1/update/about
```

| Header | Type     | Description                |
| :-------- | :------- | :------------------------- |
| `authorization` | `string` | **Required** Bearer token |

| Body | Type     | Description                |
| :-------- | :------- | :------------------------- |
| `data` | `string` | **Required** new about |


#### Visibility Update

```http
  PATCH /v1/update/visibility
```

| Header | Type     | Description                |
| :-------- | :------- | :------------------------- |
| `authorization` | `string` | **Required** Bearer token |

| Body | Type     | Description                |
| :-------- | :------- | :------------------------- |
| `data` | `string` | **Required** new about |


## Environment Variables

To run this project, you will need to add the following environment variables to your .env file

`PORT`

`MYSQL`

`JWT_SECRET`

`DATACENTER`

`MACHINE_ID`

