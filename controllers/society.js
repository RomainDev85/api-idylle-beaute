module.exports = {
    // Show info of society
    showInfoSociety: (req, res) => {
        const query = "SELECT e.id, e.nom, e.adresse, e.ville, e.code_postal, e.email, e.telephone, e.facebook, e.instagram, h.lundi AS horaire_lundi, h.mardi AS horaire_mardi, h.mercredi AS horaire_mercredi, h.jeudi AS horaire_jeudi, h.vendredi AS horaire_vendredi, h.samedi AS horaire_samedi, h.dimanche AS horaire_dimanche FROM entreprise AS e INNER JOIN horaire_semaine AS h WHERE e.horaire_semaine_id = h.id;"
        pool.getConnection(function(err, connection) {
            if (err) throw err; // not connected!          
            // Use the connection
            connection.query(query, function (error, results) {
              res.json(results[0]);
              connection.release();
           
              // Handle error after the release.
              if (error) throw error;
           
              // Don't use the connection here, it has been returned to the pool.
            });
        });






        // const query = "SELECT e.id, e.nom, e.adresse, e.ville, e.code_postal, e.email, e.telephone, e.facebook, e.instagram, h.lundi AS horaire_lundi, h.mardi AS horaire_mardi, h.mercredi AS horaire_mercredi, h.jeudi AS horaire_jeudi, h.vendredi AS horaire_vendredi, h.samedi AS horaire_samedi, h.dimanche AS horaire_dimanche FROM entreprise AS e INNER JOIN horaire_semaine AS h WHERE e.horaire_semaine_id = h.id;"
        
        //  connection.query(query, (error, results) => {
        //     if(error) {
        //         console.log(error);
        //     }
        //     else {
        //         res.json(results[0]);
        //     }
        // });
    }
}