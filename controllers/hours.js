module.exports = {
    // Show hours of society
    showHours : (req, res) => {
        const query = 'SELECT * FROM horaire_semaine';

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
}