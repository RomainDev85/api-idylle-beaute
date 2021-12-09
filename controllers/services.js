// transform string to url parameter
const nameToUrl = (str) => {
    str = str.replace(/^\s+|\s+$/g, '');

    // passe la chaine de caractere en minuscule
    str = str.toLowerCase();

    // Modifie les lettre avec accent par les memes lettre sans accent ect.
    var from = "ÁÄÂÀÃÅČÇĆĎÉĚËÈÊẼĔȆÍÌÎÏŇÑÓÖÒÔÕØŘŔŠŤÚŮÜÙÛÝŸŽáäâàãåčçćďéěëèêẽĕȇíìîïňñóöòôõøðřŕšťúůüùûýÿžþÞĐđßÆa·/_,:;";
    var to   = "AAAAAACCCDEEEEEEEEIIIINNOOOOOORRSTUUUUUYYZaaaaaacccdeeeeeeeeiiiinnooooooorrstuuuuuyyzbBDdBAa------";
    for (var i=0, l=from.length ; i<l ; i++) {
        str = str.replace(new RegExp(from.charAt(i), 'g'), to.charAt(i));
    }
    // supprime les caractere invalide
    str = str.replace(/[^a-z0-9 -]/g, '') 
    // modifie les espaces par des tirets
    .replace(/\s+/g, '-') 
    // reduit les tirets
    .replace(/-+/g, '-'); 

    return str;
}

module.exports = {
    // Show all categories of service
    allCategories : (req, res) => {
        const query = 'SELECT id, nom, image, url_categorie FROM categorie_prestation';
        
        pool.getConnection(function(err, connection) {
            if (err) throw err;          
            else {
                connection.query(query, function (error, results) {
                    res.json(results);
                    connection.release();          
                    if (error) throw error;
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
                    res.json(results[0]);
                    connection.release();      
                    if (error) throw error;
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
                    res.json(results);
                    connection.release();        
                    if (error) throw error;
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
                    res.json(results);
                    connection.release();
                    if (error) throw error;     
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
                    res.json(results);
                    connection.release();
                    if (error) throw error;
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
                    res.json(results);
                    connection.release();
                    if (error) throw error;
                });
            };
        });
    },
    // Show all services
    showAllServices: (req, res) => {
        const query = "SELECT p.id as service_id, p.nom as name, p.categorie_id as category_id, p.price, p.duree as time, p.description, p.url_prestation as url_service, c.url_categorie as url_category FROM prestation as p INNER JOIN categorie_prestation as c ON p.categorie_id = c.id;";

        pool.getConnection(function(err, connection) {
            if (err) throw err;          
            else {
                connection.query(query, function (error, results) {
                    res.json(results);
                    connection.release();
                    if (error) throw error;
                });
            };
        });
    },
    // Delete one service
    deleteService: (req, res) => {
        const query = "DELETE FROM prestation WHERE id = ?";
        const id = req.params.idService;

        pool.getConnection(function(err, connection) {
            if (err) throw err;          
            else {
                connection.query(query, [id], function (error, results) {
                    res.json({success: "La prestation à bien été supprimée"})
                    connection.release();
                    if (error) throw error;
                });
            };
        });
    },
    // Edit one service
    editService: (req, res) => {
        const id = req.params.idService;
        const name = req.body.name;
        const price = req.body.price;
        let description = req.body.description;
        let time = req.body.time;
        let errors = {};

        const query = "UPDATE prestation SET nom = ?, description = ?, duree = ?, price = ?, url_prestation = ? WHERE id = ?;"

        const checkContent = () => {
            if(!name) errors.name = "La prestation doit avoir un nom.";
            if(!description) description = null;
            if(!price) errors.price = "La prestation doit avoir un prix.";
            if(!time) time = null;
        }

        try {
            checkContent();
            if(!name || !price) res.json({error: errors})
            else {
                pool.getConnection(function(err, connection) {
                    if (err) throw err;          
                    else {
                        connection.query(query, [name, description, time, price, nameToUrl(name), id], function (error, result) {
                            res.json({success: "La prestation a été modifier.", name: name, description: description, price: price, time: time, url_service: nameToUrl(name)});
                            connection.release();
                            if (error) throw error;
                        });
                    };
                });
            };
        }
        catch(err){
            throw err;
        }
    },
    // Create one categories
    createCategory: (req, res) => {
        const name = req.body.name;
        const query = "INSERT INTO categorie_prestation (nom, url_categorie) VALUES (? , ?);";

        if(!name) res.json({ errors: {name: "Un nom est nécessaire pour crée une catégorie."}})
        else {
            pool.getConnection(function(err, connection) {
                if (err) throw err;          
                else {
                    connection.query(query, [name, nameToUrl(name)], function (error, result) {
                        res.json({success: "La catégorie à bien été crée.", nom: name, image: null, url_categorie: nameToUrl(name)});
                        connection.release();
                        if (error) throw error;
                    });
                };
            });
        }
    }
}