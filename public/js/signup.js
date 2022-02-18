<!DOCTYPE html>
<html lang="en">
  <head>
    <meta charset="UTF-8" />
    <meta http-equiv="X-UA-Compatible" content="IE=edge" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0" />
    <title>Document</title>
    <link rel="stylesheet" href="./css/login.css">
  </head>
  <body>
    
      <div class="main-flexbox">
        <div class="left-flexbox">
          <div class="image-container">
            <img src="./images/worm.png" alt="">
          </div>
        </div>
        <div class="right-flexbox">
          <div class="greeting">Welcome to chat-worm!</div>
          <form action="http://localhost:3000/login" method="post">
            <div>Login</div>
            <input type="text" name="username" placeholder="Username" required />
            <input type="password" name="password" placeholder="Password" required/>
            <button class = "sign-in-button" type="submit">Sign in</button>
          </form>
          <a href="http://localhost:3000/signup">Create an account</a>
        </div>

    <script src="./js/login.js"></script>
  </body>
</html>