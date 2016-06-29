To install swagger tools:
```
npm install -g swagger
```

To edit the swagger yaml run (in this directory):
```
swagger project edit
```

To start the mock API (in this directory):
```
swagger project start -m
```

If you want to change the port the mock server listens to, you must edit the /swagger/app.js file and change the port there. The port in the swagger.yaml is ignored.