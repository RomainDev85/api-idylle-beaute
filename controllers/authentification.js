const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");

const maxAge = 24 * 60 * 60 * 1000;
// Fonction permettant la création d'un cookie
const createToken = (user) => {
    return jwt.sign(user, process.env.ACCESS_SECRET_TOKEN, { expiresIn: maxAge });
};

module.exports = {
    // Callback pour crée un utilisateur
    createUser: (req, res) => {
        const checkDb = "SELECT email FROM utilisateur WHERE email = ?;"
        const createUser = "INSERT INTO utilisateur (prenom, nom, email, mot_de_passe) VALUES (?, ?, ?, ?);"
        
        
        const email = req.body.email;
        const password = req.body.password;
        const password2 = req.body.password2;
        const firstname = req.body.firstname;
        const lastname = req.body.lastname;


        if(!email) res.json({error: {email: "Email est obligatoire"}});
        else if(!password) res.json({error: {password: "Un mot de passe est obligatoire"}});
        else if(!password2) res.json({error : {password2: "Confirmez votre mot de passe"}});
        else if(password !== password2) res.json({error : {password2: "Les mots de passe ne correspondent pas"}});
        else if(!firstname) res.json({error: {firstname: "Le prénom est obligatoire"}});
        else if(!lastname) res.json({error: {lastname: "Le nom est obligatoire"}});
        else {
            pool.getConnection(function(err, connection) {
                if (err) throw err;         
                else {
                    connection.query(checkDb, [email], function (error, result) {
                        if(result.length === 0){
                            bcrypt.hash(password, 10, function(err, hash) {
                                if(err) throw err;
                                else {
                                    connection.query(createUser, [firstname, lastname, email, hash], (err, result) => {
                                        if(err) throw err;
                                        else res.json({success: "Le compte a été créé."});
                                    });
                                };
                            });
                        }
                        else {
                            res.json({error: {email: "Un compte est déjà associé."}});
                        }
                        connection.release();
                        if (error) throw error;
                    });
                };
            });
        };
    },
    login: (req, res) => {
        const checkEmail = "SELECT email, mot_de_passe FROM utilisateur WHERE email = ?;";
        const tryConnection = "SELECT id, email, nom, prenom FROM utilisateur WHERE email = ? AND mot_de_passe = ?;";
        
        const email = req.body.email;
        const password = req.body.password;
        

        if(!email && !password) res.json({error: {password: "Veuillez indiquer votre mot de passe", email: "Veuillez indiquer votre email"}});     
        else if(!password) res.json({error: {password: "Veuillez indiquer votre mot de passe"}});     
        else if(!email) res.json({error: {email: "Veuillez indiquer votre email"}});
        else {
            pool.getConnection(function(err, connection) {
                if (err) throw err;        
                connection.query(checkEmail, [email], function (error, result) {
                    if(result.length > 0) {
                        bcrypt.compare(password, result[0].mot_de_passe, function(err, success) {
                            if(success) {
                                connection.query(tryConnection, [email, result[0].mot_de_passe], (err, results) => {                              
                                    const token =  createToken({id : results[0].id, email : results[0].email, lastname : results[0].nom, firstname: results[0].prenom});

                                    if(err) res.json(err);
                                    else {
                                        res.cookie('jwt', token, {httpOnly: true, maxAge });
                                        res.json({
                                            id: results[0].id,
                                            email: results[0].email,
                                            firstname: results[0].prenom,
                                            lastname: results[0].nom
                                        });
                                    }
                                })
                            }
                            else res.json({error: {password: "Le mot de passe n'est pas correct"}});
                        });
                    }
                    else {
                        res.json({error: {email: "Pas de compte associé a cet email"}});
                    };
                    connection.release();          
                    if (error) throw error;
                });
            });
        };
    },
    logout: (req, res) => {
        res.cookie('jwt', '', {maxAge: 1});
        res.json({user: null});
    }
}