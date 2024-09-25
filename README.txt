API FOR HARVEST

Routing:

/v1 - GET - Homepage
/v1/user - GET - User Dashboard, returns email
/v1/user/register - POST - Create profile using the following:
    {
        "email": "",
        "first_name": "",
        "last_name": "",
        "password": ""
    }
/v1/user/login - POST - Login to account using the following:
    {
        "email": "",
        "password": ""
    }
    If successful, generates access token
/v1/user/logout - GET - Removes access token and blacklists token to prevent sign in
/v1/user/room/ - GET - Returns most recent chatroom
/v1/user/room/:roomId - GET - Gets information about specific room
/v1/user/room/initiate - POST - Creates chatroom using the following:
    {
        "vendorId": "",
        "type": "CONSUMER_TO_CONSUMER" or "CONSUMER_TO_SUPPORT"
    }
/v1/user/room/:roomId/message - POST - Sends message to chatroom specified in url using the following:
    {
        "message": ""
    }
/v1/user/room/:roomID/mark-read - PUT - Updates chatroom to indicate user has read messages
/v1/user/vendor/register - POST - Creates vendor profile and attaches to individual user using the following:
    {
        "name": "",
        "address": "",
        "selling": [],
        "bio": "",
        "emails": []
    }
/v1/user/vendor/get-in-range - GET - Accepts a latitude, longitude, and range query
    Range is a number value in miles
    Example: /v1/user/vendor/get-in-range/range=5&lat=34.013413&long=95.23453