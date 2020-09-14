const fs = require('fs').promises;
const express = require('express');
const uuid = require('uuid');

const app = express();

app.use(express.json());

app.get('/users', async (req, res) => {
    // should return an array of users
    const rawData = await fs.readFile("./data/users.json", "utf-8");
    const parsedUsers = JSON.parse(rawData);
    res.status(200).send(parsedUsers);
    
});

//Ask ed how to do with array functions -> .map??
app.get('/users/names', async (req, res) => {
    // should return an array of users names
    const rawData = await fs.readFile("./data/users.json", "utf-8");
    const parsedUsers = JSON.parse(rawData);
 
    const names = [];
    parsedUsers.forEach(element => {
        console.log(element.name)
        names.push(element.name);
    })
    // const names = parsedUsers.map(element => {
    //     console.log(element.name)
    //     element.name;
    // })
    console.log();
    res.status(200).send(names);
});

app.get('/user/:userId', async (req, res) => {
    const userId = req.params.userId;
    const rawData = await fs.readFile("./data/users.json", "utf-8");
    const parsedUsers = JSON.parse(rawData);


    //Should use .find?? 
    const user = parsedUsers.filter(id => id.userId === userId);
    if (user.length < 1) {
        res.status(404).send("fail");
    } else {
        res.status(200).send(user[0]);
    }
});

app.post('/users', async (req, res) => {
    const newUserId = uuid.v4();
    const newUser = { ...req.body, id: newUserId };

    const rawData = await fs.readFile("./data/users.json", "utf-8");
    let parsedUsers = JSON.parse(rawData);

    parsedUsers.push({userId: newUser.id, name: newUser.name, age: newUser.age, avatar: newUser.avatar});
    await fs.writeFile("./data/users.json", JSON.stringify(parsedUsers), 'utf-8');
    // should add the newUser to the users file.
    res.status(200).send('User added');
});

app.put('/user/:userId', async (req, res) => {
    const userId = req.params.userId;
    const updatedUser = req.body;

    const rawData = await fs.readFile("./data/users.json", "utf-8");
    let parsedUsers = JSON.parse(rawData);
    
    
    let found = false;
    parsedUsers.forEach(element => {
        if (element.userId === userId) {
          element.name = updatedUser.name;
          element.age = updatedUser.age;
          element.avatar = updatedUser.avatar;
          found = true;
      }
    })


    
    await fs.writeFile("./data/users.json", JSON.stringify(parsedUsers), 'utf-8');
    // should update the user with the given ID.
    // If the user does not exist, return a 404 error code
    if (found) {
        res.status(200).send('Updated info');
    }
    else {
        res.status(404).send("user not found");
    }
});

//Could we use .find to get the ID?
app.get('/user/:userId/avatar', async (req, res) => {
    const userId = req.params.userId;
    // look up the user in users.json
    // if it exists, load the file specified by the 'avatar' field and send that back
    // if the user does not exist, or the user does not have an avatar, or the file is missing, send back 404
    
    // Send the file back like this:
    //   fs.readFile('whatever-url.jpg')
    //     .then(file => {
    //       res.send(file.toString('base64'));
    //     });
    // or, using await
    //   const file = await fs.readFile('whatever-url.jpg')
    //   res.send(file.toString('base64))


    const rawData = await fs.readFile("./data/users.json", "utf-8");
    let parsedUsers = JSON.parse(rawData);

    let avatar = null;
    let hasAvatar = true;

    parsedUsers.forEach(element => {
        if (userId === element.userId) {
            avatar = element.avatar;
            
        }
    })
    
    
    console.log("this is the avatar " + avatar);
    //Or we can just check avatar != null
    if (avatar !== null && avatar !== undefined) {
        const file = await fs.readFile("./data/" + avatar)
        res.status(200).send(file.toString('base64'));
    } else {
        
        res.status(404).send("user not found");
    }
});

app.put('/user/:userId/avatar', async (req, res) => {
    const userId = req.params.userId;
    const avatarFilename = req.body.filename;
    const avatarData = Buffer.from(req.body.data, 'base64')
    // look up the user in users.json
    // if it exists, write the avatar to the data directory and update the user object with the file path.
    // if the user does not exist, send back 404
    res.status(500).send('method not implemented');
});

app.get('/users/avatars', async (req, res) => {
    // Return all avatars as an object that maps names to image data a bit like this:
    // { emily: emilyImageData.toString('base64) }
    res.status(500).send('method not implemented');
})

if (process.env.NODE_ENV !== "test") {
    app.listen(8080, () => {
        console.log('server started on port 8080');
    });
}

module.exports = app;