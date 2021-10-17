module.exports = {
    // Show all categories of service
    allCategories : (req, res) => {
        const query = 'SELECT id, nom, image, url_categorie FROM categorie_prestation';

        connection.query(query, (err, result) => {
            if(err) res.send(err);
            else {
                res.json(result);
            }
        })
    },
    // Show one categories
    showOneCategories : (req, res) => {
        const query = 'SELECT id, nom, url_categorie, image FROM categorie_prestation WHERE url_categorie = ?';
        const category = req.params.category;

        connection.query(query, [category], (err, result) => {
            if(err) res.send(err);
            else res.json(result[0]);
        })
    },
    // Filter services by category
    filterServices : (req, res) => {
        const url = req.params.category;
        const query = 'SELECT p.id AS prestation_id, p.nom AS nom_prestation, p.categorie_id, p.price, p.duree, p.image, p.description, p.url_prestation, c.url_categorie, c.nom AS nom_categorie FROM prestation AS p INNER JOIN categorie_prestation AS c ON p.categorie_id = c.id WHERE c.url_categorie = ?'

        connection.query(query, [url], (err, result) => {
            if(err) res.send(err);
            else {
                res.json(result);
                // console.log(result);
            }
        })
    }
}