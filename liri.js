// Dependencies
require("dotenv").config();

var axios = require("axios");

var Spotify = require("node-spotify-api");

var keys = require("./keys.js");

var spotify = new Spotify(keys.spotify);

var moment = require("moment");

var fs = require("fs");


var getNames = function (artist) {
    return artist.name;
};

// Spotify
var spotifyResults = function (songName) {
    if (!songName) {
        songName = "Ace of Base The Sign";
    }

    spotify.search(
        {
            type: "track",
            query: songName,
            limit: 1
        },

        function (err, data) {
            if (err) {
                output("Error: " + err);
                return;
            }
            var songs = data.tracks.items;
            if (!data.tracks.items.length) {
                return output('no song found');
            }
            output("Artist(s): " + songs[0].artists[0].name);
            output("Song Name: " + songs[0].name);
            output("Preview Song: " + (songs[0].preview_url ? songs[0].preview_url : 'n/a'));
            output("Album: " + songs[0].album.name);

        }
    );
};

// OMDB
var movieResults = function (movieName) {
    if (!movieName) {
        movieName = "Mr Nobody";
    }

    var url = "http://www.omdbapi.com/?t=" + movieName + "&apikey=trilogy";
    axios.get(url).then(
        function (response) {
            var movieData = response.data;
            if (movieData.Response === 'False') {
                return output('no movie found');
            }
            output("Title: " + movieData.Title);
            output("Year: " + movieData.Year);
            output("IMDB Rating: " + movieData.imdbRating);
            // todo - loop through ratings and check source
            output("Rotten Tomatoes Rating: " + movieData.Ratings[1].Value);
            output("Country: " + movieData.Country);
            output("Language: " + movieData.Language);
            output("Plot: " + movieData.Plot);
            output("Actors: " + movieData.Actors);
        }
    );
};

// Bands in Town
var bandResults = function (bandName) {
    if (!bandName) {
        bandName = "Modest Mouse";
    }

    var url = "https://rest.bandsintown.com/artists/" + bandName + "/events?app_id=codingbootcamp";
    axios.get(url).then(
        function (response) {
            var bandData = response.data;
            output("Name of Band: " + bandName);
            if (typeof bandData === 'string' || !bandData.length) {
                return output('no concerts found');
            }
            var date = moment(bandData[0].datetime).format("MM-DD-YYYY");
            output("Name of Venue: " + bandData[0].venue.name);
            output("Location: " + bandData[0].venue.city);
            output("Date: " + date);
        }
    );
};

// Do what it Says
var doIt = function () {
    fs.readFile("random.txt", "utf8", function (error, data) {
        output(data);

        var dataArr = data.split(",");

        if (dataArr.length === 2) {
            pick(dataArr[0], dataArr[1]);
        }
        else if (dataArr.length === 1) {
            pick(dataArr[0]);
        }
    });
};

// Switch statements for commands
var pick = function (command, info) {
    appendToLog('command: ' + command);
    switch (command) {
        case "spotify-this-song":
            spotifyResults(info);
            break;
        case "movie-this":
            movieResults(info);
            break;
        case "concert-this":
            bandResults(info);
            break;
        case "do-what-it-says":
            doIt();
            break;
        default:
            output("Does Not Compute");
    }
};

// Takes in arguments runs correct function
var runLiri = function (argOne, argTwo) {
    pick(argOne, argTwo);
};

var output = function (out) {
    console.log(out);
    appendToLog(out);
}
var appendToLog = function (txt) {
    fs.appendFileSync('log.txt', txt + '\n');
}

// Run Liri
runLiri(process.argv[2], process.argv.slice(3).join(" "));