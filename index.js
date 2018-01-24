'use strict';

const express = require('express');
const bodyParser = require('body-parser');
const http = require('http');
const apiKey = 'apikey' // DO NOT CHECK THIS IN!!

const server = express();
server.use(bodyParser.urlencoded({
    extended: true
}));

server.use(bodyParser.json());

server.post('/get-movie-details', function (req, res) {

    let movieToSearch = req.body.result && req.body.result.parameters && req.body.result.parameters.movie ? req.body.result.parameters.movie : 'The Godfather';
console.log(movieToSearch);
    //let reqUrl = encodeURI('http://theapache64.xyz:8080/movie_db/search?keyword=' + movieToSearch);
    let reqUrl = encodeURI('http://www.omdbapi.com/?apikey='+ apiKey +'&t=' + movieToSearch);
    http.get(reqUrl, (responseFromAPI) => {

        responseFromAPI.on('data', function (chunk) {
            let movie = JSON.parse(chunk);
            let dataToSend = movieToSearch === 'The Godfather' ? 'I don\'t have the required info on that. Here\'s some info on \'The Godfather\' instead.\n' : '';
            dataToSend += movie.Title + ' is a ' + movie.imdbRating + ' starer ' + movie.Genre + ' movie, released in ' + movie.Year + '. It was directed by ' + movie.Director;

            return res.json({
                speech: dataToSend,
                displayText: dataToSend,
                source: 'get-movie-details'
            });

        });
    }, (error) => {
        return res.json({
            speech: 'Something went wrong!',
            displayText: 'Something went wrong!',
            source: 'get-movie-details'
        });
    });
});

server.listen((process.env.PORT || 8000), function () {
    console.log("Server is up and running... listening on port 8000");
});
