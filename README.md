<h1> 
    <img src="https://ik.imagekit.io/yg7u65zz2/pngname_1__g-b8fyH6t.png?ik-sdk-version=javascript-1.4.3&updatedAt=1664085643045">
</h1>

# API: User registration

# Index
- [About](#-About)
- [Technologies used](#-Technologies-used)
- [How to download the project](#-How-to-download-the-project)
- [How does the api work?](#-How-does-the-api-work?)

## 🔖 About

Project of an **API** created to put into practice all my acquired knowledge.

---

## 🚀 Technologies used


The project was developed using the following technologies:

- [JavaScript](https://www.javascript.com)
- [Node](https://nodejs.org/en/)
- [Express](https://expressjs.com/pt-br/)
- [Redis](https://redis.io/)

---

## 📁 How to download the project

```bash

    # clone the repository
    $ git clone https://https://github.com/biancaoliv/api_express

    # enter the directory
    $ cd api_express

    # install the dependencies
    $ npm install

    # start the project
    $ npm run start

```
---
## How does the api work?
---

📕 Initially, the home page was created using the local server.
```
userRouter.get("/home", (req, res) => {
  res.contentType("application/html");
  res.status(200).send("<h1>Home page/h1>");
});
```
---
📗  In this route, users are created and email validation is performed. At this point we have also generated a token.

```
userRouter.post("/users", async (req, res) => {
  const { email } = req.body;

  try {
    if (await UserModel.findOne({ email }))
      return res.status(400).send({ error: "User already exists" });

    const user = await UserModel.create(req.body);

    user.password = undefined;

    return res.send({
      user,
      token: generateToken({ id: user.id }),
    });
  } catch (error) {
    return res.status(400).send({ error: "Registration failed" });
  }
});

```
---
📙 finds all users registered in the database with Redis
```
userRouter.get("/users", async (req, res) => {
  try {
    const cachedUsers = await client.get("users")
    if(cachedUsers) {
      return res.status(200).json({cached: true,
        data: cachedUsers});
    }
    const users = await UserModel.find({});
    client.set("users", JSON.stringify(users))
    res.status(200).json({cached: false, data: users});
  } catch (error) {
    return res.status(500).send(error.message);
  }
});
```
---
📘 Email and password authentication route, also having a token.
```
userRouter.post("/login", async (req, res) => {
  const { email, password } = req.body;

  const user = await UserModel.findOne({ email }).select("+password");

  if (!user) return res.status(400).send({ error: "User not found" });

  if (!(await bcrypt.compare(password, user.password)))
    return res.status(400).send({ error: "Invalid password" });

  user.password = undefined;

  res.send({
    user,
    token: generateToken({ id: user.id }),
  });
});

```
💻 Developed by: Bianca Oliveira