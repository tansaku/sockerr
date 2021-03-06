var glob = require('glob');
var spawn = require('child_process').spawn;
var app = require('./app');
var mongoose = require('mongoose');
var env = require('./lib/config/test_env');

var dbUri = process.env.MONGOHQ_URL;

if(mongoose.connection.db) { 
  mongoose.disconnect(function() {
    mongoose.connect(dbUri, function() {
      console.log('connected to db: ' + dbUri);
    });
  })
}
else {
  mongoose.connect(dbUri, function() {
    console.log('connected to db: ' + dbUri);
  });
};

var server = app.listen(3000, function() {
  var port = 3000;
  process.env.URL = 'http://localhost:' + port;
  return glob('test', function(err, filename) {
    var child = spawn('mocha', ['--recursive'].concat(filename));
    child.stdout.on('data', function(msg) {
      return process.stdout.write(msg);
    });
    child.stderr.on('data', function(msg) {
      return process.stderr.write(msg);
    });
    return child.on('exit', function(code) {
      mongoose.connection.db.dropDatabase(function() {
        mongoose.disconnect(function() {
          console.log('disconnected from db: ' + dbUri);
            return process.exit(code);    
        });
      });      
    });
  });
});
