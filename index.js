var express = require('express');
var app = express();
var path = require('path');
var fs = require('fs');
var mediaserver = require('mediaserver');
var multer = require('multer');

var multerOptions = multer.diskStorage({
    destination: function(req, file, cb){
        cb(null, path.join(__dirname, 'songs'));
    },
    filename: function(req, file, cb){
        cb(null, file.originalname);
    }
});

var upload = multer({storage: multerOptions});

app.use(express.static('public'));
app.use('/jquery', express.static(path.join(__dirname, 'node_modules', 'jquery', 'dist')));

app.get('/', function(req, res){
    res.sendFile(path.join(__dirname, 'index.html'));
});

app.get('/songs', function(req, res){
    fs.readFile(path.join(__dirname, 'songs.json'), 'utf8', function(err, songs){
        if (err) throw err;
        res.json(JSON.parse(songs));
    });
})

app.get('/songs/:name', function(req, res){
    var song = path.join(__dirname, 'songs', req.params.name);
    mediaserver.pipe(req, res, song);
})

app.post('/songs', upload.single('song'), function(req, res){
    var songArchive = path.join(__dirname, 'songs.json');
    var name = req.file.originalname;
    fs.readFile(songArchive, 'utf8', function(err, archive){
        if (err) throw err;
        var song = JSON.parse(archive);
        song.push({name: name});
        fs.writeFile(songArchive, JSON.stringify(song), function(err){
            if (err) throw err;
            res.sendFile(path.join(__dirname, 'index.html'));
        });
    })
});

app.listen(3000, function(){
    console.log('Application working');
})