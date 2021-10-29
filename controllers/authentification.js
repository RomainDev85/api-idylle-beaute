module.exports = {
    createUser: (req, res) => {
        const query = "SELECT email, password FROM utilisateur;"
        const email = req.body.email;
        const password = req.body.password;

        if(!email || !password){
            res.json("Remplir tout les champs")
        }
        else {
            pool.getConnection(function(err, connection) {
                if (err) throw err; // not connected!          
                // Use the connection
                connection.query(query, function (error, results) {
                  res.json(results);
                  connection.release();          
                  // Handle error after the release.
                  if (error) throw error;
                });
            });
        }
    }
}