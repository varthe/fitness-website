const express = require("express");
const app = express();
const fs = require("fs");
const fileUpload = require("express-fileupload");
const path = require("path");
const util = require("util");
const readline = require("readline");
const { Chart } = require("chart.js");
const date = require("date-and-time");
const ejs = require("ejs");
const fitbit = require("./fitbit.js");
const mysql = require("mysql");
const session = require("express-session");

var con = mysql.createConnection({
    host:"localhost",
    user: "root",
    password: "fmisop123",
    database: "fitness application"
});

con.connect((err)=>{
    if(err) throw new err;
    console.log("Connected to database...");
})

app.use(express.static("./public"));
app.use(fileUpload());
app.use(session({
    secret: "XmrD4F[KoH`6r0K",
    resave: true,
    saveUninitialized: true
}));


app.set("view engine", "html");
app.set("views", __dirname + "/public/views");
app.engine("html", require("ejs").renderFile);

app.get("/upload", (req, res)=>{
    //TODO: MAKE GETS WHEN NOT LOGGED IN, NOT POSTS!!!!!!
})

app.post("/upload", (req, res)=>{
    if(req.session.loggedin){
        let userFile;
        let uploadPath;
        let userID = req.session.userID;

        if(!req.files || Object.keys(req.files).length === 0){
            return res.status(400).send("No file was uploaded!");
        }
        userFile = req.files.userFile;
        uploadPath = __dirname + "/uploadedData/" + userFile.name;
        userFile.mv(uploadPath, (err)=>{
            if(err) return res.status(500).send(err);
            //TODO:insert into data table
            con.query("INSERT INTO UserData (userID, name, filepath) VALUES (?, ?, ?)",
            [userID, userFile.name, uploadPath], (err, results)=>{
                if(err) throw err;
                console.log("UPLOADED SUCCESSFULLY");
            });


            app.emit("event:file_uploaded", uploadPath);
            res.send("File uploaded!");
        })
    }
    res.redirect("/login");
});



app.get("/", (req,res)=>{
    if(req.session.loggedin) res.send("<h1>Welcome back " + req.session.username + "! </h1>");
    else res.sendFile(path.resolve(__dirname + "/public/login.html"));
});
app.post("/login", (req,res)=>{
    console.log("YO" + req.session.loggedin);
    if(!req.session.loggedin){
        let username = req.body.username;
        let password = req.body.password;

        if(username && password){
            con.query("SELECT * FROM Users WHERE username = ? AND password = ?", [username, password], (err, results, fields)=>{
                if(err) throw err;

                if(results.length > 0){
                    req.session.loggedin = true;
                    req.session.username = username;
                    req.session.userID = results[0]["userID"];
                    res.redirect("/dashboard");
                    
                }
                else{
                    res.send("<h1>Incorrect username or password!</h1>")
                }
                res.end();
            });
        }
        else{
            res.send("<h1>Please enter Username and Password</h1>");
        }
    }
    else res.redirect("/upload");
});
app.post("/signup", (req, res)=>{
    let username = req.body.username;
    let password = req.body.password;
    let name = req.body.name;

    if(username && password && name){
        con.query("SELECT * FROM Users WHERE username = ?", username, (err, results)=>{
            if(err) throw err;
            if(results.length > 0){
                res.send("<h1>Username taken!</h1>");
            }
            else{
                con.query("INSERT INTO Users (username, password, name) VALUES (?, ?, ?)",
                [username, password, name], (err, results)=>{
                    if(err) throw err;
                    else{
                        res.send("<h1>Account created!</h1>");
                    }
                });
            }
        });
    }
    else{
        res.send("<h1>Provide Username, Password and Name!</h1>");
    }
});


app.get("/dashboard", async(req,res)=>{
    let userDataPath = "./uploadedData/dailyActivity_merged.csv";
    let result = await readCsv(userDataPath);

    let dates = await fitbit.retrieveDates(result);
    let calories = await fitbit.retrieveEntries(result, "Calories");
    let steps = await fitbit.retrieveEntries(result, "TotalSteps");
    let distance = await fitbit.retrieveEntries(result, "TotalDistance");


    //console.log(dates);
    //console.log(entries);
    fs.readFile(__dirname + "/public/dashboard.html","utf8", (err, html)=>{
        res.send(ejs.render(html, {dates, calories, steps, distance}));
    });
});
app.get("*", (req,res)=>{
    res.status(404).send("<h1>Error!</h1>");
})
app.on("event:file_uploaded", async(userDataPath)=>{
  
    
});


function readCsv(path){
    return new Promise((resolve)=>{
        console.log(`RETRIEVING DATA FROM: ${path}`);
        const stream = fs.createReadStream(path);
        const rl = readline.createInterface({input: stream});
        let data = [];
        rl.on("line", (row)=>{
            data.push(row.split(","));
        })
        rl.on("close", ()=>{
            console.log("Data Processed");//should be completed first
            resolve(data);
        })
    
    })
}

//const PORT = process.env.PORT || 8080;
const PORT = 5000;

app.listen(PORT, ()=>{
    console.log(`listening on port ${PORT}...`);
})