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



Code-Gen
========
Swagger code generator from here: https://github.com/swagger-api/swagger-codegen

To run the swagger code generator (for swagger.json):
```
java -jar swagger-codegen-cli.jar generate -i ./api/swagger/swagger.yaml -l swagger -o ../clients/swagger
```

To run the swagger code generator (for javascript):
```
java -jar swagger-codegen-cli.jar generate -i ../clients/swagger/swagger.json -l javascript -o ../clients/javascript
```

To run the swagger code generator (for static html docs):
```
java -jar swagger-codegen-cli.jar generate -i ../clients/swagger/swagger.json -l html -o ../clients/html-docs
```