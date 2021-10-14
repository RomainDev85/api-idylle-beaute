module.exports = {
    // Show hours of society
    showHours : (req, res) => {
        const query = 'SELECT * FROM horaire_semaine';
        connection.query(query, (error, result) => {
            if(error){
                console.log(error);
            }
            else {
                console.log(result);
                res.json(result);
            }
        })
    },
}