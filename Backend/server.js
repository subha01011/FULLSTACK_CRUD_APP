const express = require("express");
const cors = require("cors");
const mysql = require("mysql");

const app = express();

app.use(express.json());
app.use(cors());

const db = mysql.createConnection({
    host: "localhost",
    user: "root",
    password: "",
    database: "crud"
});

db.connect((err) => {
    if (err) {
        console.error("Error connecting to database: " + err.stack);
        return;
    }
    console.log("Connected to database as id " + db.threadId);
});
app.get("/*",function (req,res){
    res.sendFile(
        path.join(__dirname,"../frontend/public/index.html"),
        function(err){
            if(err){
                res.status(500).send(err);
            }
        }
    );
})
app.get("/", (req, res) => {
    try {
        const sql = "SELECT * FROM students";
        db.query(sql, (err, data) => {
            if (err) {
                return res.status(500).json({ error: "Internal server error" });
            } else {
                return res.json(data);
            }
        });
    } catch (error) {
        console.log(error);
        return res.status(500).json({ error: "Internal server error" });
    }
});

app.post("/create", (req, res) => {
    const { name, email } = req.body;
    const sql = "INSERT INTO students (`Name`, `Email`) VALUES (?, ?)";
    const values = [name, email];
    db.query(sql, values, (err, data) => {
        if (err) {
            return res.status(500).json({ error: err });
        } else {
            return res.json({ message: "Student created successfully" });
        }
    });
});
app.put("/update/:id", (req, res) => {
    const { name, email } = req.body;
    const sql = "UPDATE students SET Name=?, Email=? WHERE Id = ?";
    const values = [name, email];
    const id = req.params.id;

    db.query(sql, [...values,id], (err, data) => {
        if (err) {
            return res.status(500).json({ error: err });
        } else {
            return res.json({ message: "Student created successfully" });
        }
    });
});
app.delete("/students/:id", (req, res) => {
    const id = req.params.id;
    const sql = "DELETE FROM students WHERE Id = ?";
    
    db.query(sql, [id], (err, data) => {
        if (err) {
            return res.status(500).json({ error: err });
        } else {
            return res.json({ message: "Student deleted successfully" });
        }
    });
});

const PORT =process.env.PORT || 8081;
app.listen(PORT, () => {
    console.log("Server is running on port" + PORT);
});
