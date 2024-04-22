# Effective NodeJS 

# How to run 

```sh
docker run -d -p 27017:27017 mongo                  # run database container
git clone github.com/OlegSadJktu/effective-nodejs   
npm run prod                                        # compile to *.js and run server
```

# Documentation
When server is running, open `localhost:3000/documentation`

# Testing
Use `./reqtest` directory and [httpie](https://httpie.io/) for this. Example: 

```sh
http GET localhost:3000/forms                                       # get forms
```
or 
```sh
http POST localhost:3000/forms < reqtest/new_form.json              # create form
```
or 
```sh
http POST localhost:3000/forms/35/answers < reqtest/new_ans.json    # create answer
```