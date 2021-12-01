module.exports = {
    // Show all categories of service
    allCategories : (req, res) => {
        const query = 'SELECT id, nom, image, url_categorie FROM categorie_prestation';
        
        pool.getConnection(function(err, connection) {
            if (err) throw err;          
            else {
                connection.query(query, function (error, results) {
                    if (error) throw error;
                    else {
                        res.json(results);
                        connection.release();
                    };          
                });
            };
        });
    },
    // Show one categories
    showOneCategories : (req, res) => {
        const query = 'SELECT id, nom, url_categorie, image FROM categorie_prestation WHERE url_categorie = ?';
        const category = req.params.category;
        
        pool.getConnection(function(err, connection) {
            if (err) throw err;         
            else {
                connection.query(query, [category], function (error, results) {
                    if (error) throw error;
                    else {
                        res.json(results[0]);
                        connection.release();
                    };       
                });
            };
        });
    },
    // Filter services by category
    filterServices : (req, res) => {
        const url = req.params.category;
        const query = 'SELECT p.id AS prestation_id, p.nom AS nom_prestation, p.categorie_id, p.price, p.duree, p.image, p.description, p.url_prestation, c.url_categorie, c.nom AS nom_categorie FROM prestation AS p INNER JOIN categorie_prestation AS c ON p.categorie_id = c.id WHERE c.url_categorie = ?'

        pool.getConnection(function(err, connection) {
            if (err) throw err;          
            else {
                connection.query(query, [url], function (error, results) {
                    if (error) throw error;
                    else {
                        res.json(results);
                        connection.release();
                    };         
                });
            };
        });
    },
    // Show all categories of service exept the category selected
    allCategoriesExeptOne : (req, res) => {
        const query = 'SELECT id, nom, url_categorie FROM categorie_prestation WHERE url_categorie <> ?';
        const url = req.params.category
        
        pool.getConnection(function(err, connection) {
            if (err) throw err;         
            else {
                connection.query(query, [url], function (error, results) {
                    if (error) throw error;
                    else {
                        res.json(results);
                        connection.release();
                    };         
                });
            };
        });
    },
    // Show little categorie of categorie
    showLittleCategories : (req, res) => {
        const query = 'SELECT sc.id, sc.nom AS sous_categorie, sc.categorie_id, c.nom AS categorie, c.url_categorie  FROM sous_categorie as sc INNER JOIN categorie_prestation AS c ON c.id = sc.categorie_id WHERE c.url_categorie = ?;';
        const url = req.params.category;

        pool.getConnection(function(err, connection) {
            if (err) throw err;          
            else {
                connection.query(query, [url], function (error, results) {
                    if (error) throw error;
                    else {
                        res.json(results);
                        connection.release();
                    };
                });
            };
        });
    },
    // Show services of little category
    serviceLittleCategory : (req, res) => {
        const query = 'SELECT psc.id AS id_prestation, psc.id_sous_categorie, sc.categorie_id, psc.nom AS nom_service, psc.duree, psc.price, psc.description FROM prestation_sous_categorie AS psc INNER JOIN sous_categorie AS sc on sc.id = psc.id_sous_categorie WHERE psc.id_sous_categorie = ?;';
        const id = req.params.idCategory;

        pool.getConnection(function(err, connection) {
            if (err) throw err;          
            else {
                connection.query(query, [id], function (error, results) {
                    if (error) throw error;
                    else {
                        res.json(results);
                        connection.release();
                    };
                });
            };
        });
    }
}