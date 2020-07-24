[![Build Status](https://travis-ci.com/larapollehn/buchling.svg?branch=master)](https://travis-ci.com/larapollehn/buchling)
### Requirements

Implementation of a book shop with Admin dashboard and payment gateway. User can manage 
his/her profile and see his/her personal purchasing history.

### Doc for API 

https://app.swaggerhub.com/apis/larapollehn/buchling/1.0.0#/

### Road map
- [x] First Sprint: CRUD REST-ful API (Estimation: 3 Days)
- [x] Second Sprint: Basic MVP Frontend (Estimation: 3 Days)
- [x] Last Sprint: Final Styling and responsive (Estimation: 2 - 4 Days)  

### How to setup the project
Add proper environments in a `.env` file in directory `backend`:

```
DATABASE=mongodb://domain_name/ecommerce
PORT=8000
JWT_SECRET=secret
LOG_LEVEL=debug
```

Start the docker compose file with 

```
docker-compose up -d --build
```
