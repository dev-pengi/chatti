# chatti
<sub>the official link: https://rockpro.me/chat<sub>

> chatti is a simple realtime chat web application with the feature: google login, contacts and searching

### to run the website localy:

> first clone the repository

```
git clone https://github.com/dev-pengi/chatti.git
```

>next install the depancies:
```
npm install
```
> next create a google app [from here](https://console.cloud.google.com/apis/credentials)

> now create `.env` file and fill up the variables:
```
MONGODB = "your mongodb connection link"
CLIENT_ID= "your google app client id"
CLIENT_SECRET= "your google app secret"
cb = "callback url (leave it http://localhost:5000/login/auth/google if you're running the app on a local machine)"
PORT = "5000"
TEST = "true (leave it true only in dev, testing mode)"
```

> fantastic now you can just run the app by typing
```
npm run dev
```

> to host it publicly with domain name and ssl encryption you can do it throw Ubuntu virtual private server (VPS) follow [this instraction](https://gist.github.com/dev-pengi/0f480f0eef16dfd7e6a755ad7e99272a)


