module.exports = {
    // Show all categories of service
    allCategories : (req, res) => {
        const query = 'SELECT id, nom, image, url_categorie FROM categorie_prestation';
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
    },
    // Show one categories
    showOneCategories : (req, res) => {
        const query = 'SELECT id, nom, url_categorie, image FROM categorie_prestation WHERE url_categorie = ?';
        const category = req.params.category;

        
        pool.getConnection(function(err, connection) {
            if (err) throw err; // not connected!          
            // Use the connection
            connection.query(query, [category], function (error, results) {
              res.json(results[0]);
              connection.release();          
              // Handle error after the release.
              if (error) throw error;
            });
        });
    },
    // Filter services by category
    filterServices : (req, res) => {
        const url = req.params.category;
        const query = 'SELECT p.id AS prestation_id, p.nom AS nom_prestation, p.categorie_id, p.price, p.duree, p.image, p.description, p.url_prestation, c.url_categorie, c.nom AS nom_categorie FROM prestation AS p INNER JOIN categorie_prestation AS c ON p.categorie_id = c.id WHERE c.url_categorie = ?'

        pool.getConnection(function(err, connection) {
            if (err) throw err; // not connected!          
            // Use the connection
            connection.query(query, [url], function (error, results) {
              res.json(results);
              connection.release();          
              // Handle error after the release.
              if (error) throw error;
            });
        });
    },
    // Show all categories of service exept the category selected
    allCategoriesExeptOne : (req, res) => {
        const query = 'SELECT id, nom, url_categorie FROM categorie_prestation WHERE url_categorie <> ?';
        const url = req.params.category
        
        pool.getConnection(function(err, connection) {
            if (err) throw err; // not connected!          
            // Use the connection
            connection.query(query, [url], function (error, results) {
              res.json(results);
              connection.release();          
              // Handle error after the release.
              if (error) throw error;
            });
        });
    }
}