Setup instructions:

- create a env file in client directory and add "NEXT_PUBLIC_SERVER_URL" which points to the url the server is running.
- create a env file in server directory and add the followings-
  PORT=3001
  NODE_ENV=development (keep it in development mode for authentication to work)
  DB_URL="your mongodb url"
  JWT_SECRET="random characters"
  ACCESS_TOKEN_EXPIRES_IN=86400
  GEMINI_API_KEY="your gemini api key"
- go to server directory and run 'npm install', then run 'npm run dev'
- go to client directory and run 'npm install', then run 'npm run dev'
- make sure to run client and server on 'localhost' for authentication to work.
- you are all set!!

Overview:
A basic ai powered question & anwser web app where user can upload file and get response from the ai, based on the file contents. You can upload a file and ask any questions about the file and AI will give
your answer. For now, only pdf, doc and txt files are supported. As the model only supports pdf, doc/txt files are converted to pdf before uploading. This is a backend focused application and simple authentication system is added. Gemini AI API is used to interact with the gemini model.
