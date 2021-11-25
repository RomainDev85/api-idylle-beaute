const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");

const maxAge = 24 * 60 * 60 * 1000
const createToken = (user) => {
    return jwt.sign(user, process.env.ACCESS_SECRET_TOKEN, { expiresIn: maxAge })
}

module.exports = {
    createUser: (req, res) => {
        const checkDb = "SELECT email FROM utilisateur WHERE email = ?;"
        const createUser = "INSERT INTO utilisateur (prenom, nom, email, mot_de_passe) VALUES (?, ?, ?, ?);"
        const email = req.body.email;
        const password = req.body.password;
        const firstname = req.body.firstname;
        const lastname = req.body.lastname;

        if(!email || !password || !firstname || !lastname){
            res.json("Remplir tout les champs")
        }
        else {
            pool.getConnection(function(err, connection) {
                if (err) throw err; // not connected!          
                // Use the connection
                connection.query(checkDb, [email], function (error, result) {
                    if(result.length === 0){
                        bcrypt.hash(password, 10, function(err, hash) {
                            if(err) res.send(err)
                            connection.query(createUser, [firstname, lastname, email, hash], (err, result) => {
                                res.json("Compte crée")
                                if(err) res.send(err)
                            })
                        });
                    }
                    else {
                        res.json("Un compte est déjà associé à cet email")
                    }
                    connection.release();          
                    // Handle error after the release.
                    if (error) throw error;
                });
            });
        }
    },
    login: (req, res) => {
        const email = req.body.email;
        const password = req.body.password;
        const checkEmail = "SELECT email, mot_de_passe FROM utilisateur WHERE email = ?;";
        const tryConnection = "SELECT id, email, nom, prenom FROM utilisateur WHERE email = ? AND mot_de_passe = ?;";

        
        if(!password || !email) res.json("Remplir tout les champs")
        pool.getConnection(function(err, connection) {
            if (err) throw err;        
            connection.query(checkEmail, [email], function (error, result) {
                if(result.length > 0) {
                    bcrypt.compare(password, result[0].mot_de_passe, function(err, success) {
                        if(success) {
                            connection.query(tryConnection, [email, result[0].mot_de_passe], (err, results) => {
                                // res.json(results)
                                const token = createToken({id : results[0].id, email : results[0].email, lastname : results[0].nom, firstname: results[0].prenom});
                                res.cookie('jwt', token, {httpOnly: true, maxAge : maxAge })
                                res.json({success: "Token créé"});
                                if(err) res.json(err);
                            })
                        }
                        else res.json("Mauvais mot de passe")
                    });
                }
                else {
                    res.json("Pas de compte associé a cet email")
                }
                connection.release();          
                if (error) throw error;
            });
        });
    },
    logout: (req, res) => {
        res.cookie('jwt', '', {maxAge: 1});
        res.json("deconnection")
    }
}