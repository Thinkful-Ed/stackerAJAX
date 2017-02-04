var http = require('http'),
fs = require('fs'),
Twig = require("twig"),
express = require('express'),
formidable = require("formidable"),
app = express(),
request = require("request");

app.get('/', function(req, res) {
  res.render('index.twig', {

  });
});

app.post('/', function(req, res) {
  var form = new formidable.IncomingForm();
  form.parse(req, function (err, fields, files) {
    console.log(fields);
    switch(fields.action) {
      case 'answerers':
      getTopAnswerers(fields).then(function(data) {
        res.render('index.twig', Object.assign({},data,fields));
      }, function(error) {
        res.render('index.twig', { error: error });
      });
      break;

      case 'unanswered':
      default:
      getUnanswered(fields).then(function(data) {
        res.render('index.twig', Object.assign({},data,fields));
      }, function(err) {
        res.render('index.twig', { error: error });
      });

      break;
    }

  });
});

function getUnanswered(fields) {
  return new Promise(function(resolve, reject) {

    request.get("http://api.stackexchange.com/2.2/questions/unanswered", {
  		form: Object.assign({},{
    		site: 'stackoverflow',
    		order: 'desc',
    		sort: 'creation'
      },fields),
      gzip: true,
      json: true
  	}, function(error, response, body) {
      if (!error && response.statusCode == 200) {
        resolve(body);
      } else {
        reject(error);
      }
    });

  });
}

function getTopAnswerers(fields) {
  return new Promise(function(resolve, reject) {

    request.get(`http://api.stackexchange.com/2.2/tags/${fields.tagged}/top-answerers/all_time`, {
  		form: Object.assign({},{
    		site: 'stackoverflow',
    		order: 'desc',
    		sort: 'creation'
      },fields),
      gzip: true,
      json: true
  	}, function(error, response, body) {
      if (!error && response.statusCode == 200) {
        resolve(body);
      } else {
        reject(error);
      }
    });

  });
}


/*             __
/\ \__         /\ \__  __
____\ \ ,_\    __  \ \ ,_\/\_\    ___         ____     __   _ __   __  __     __   _ __
/',__\\ \ \/  /'__`\ \ \ \/\/\ \  /'___\      /',__\  /'__`\/\`'__\/\ \/\ \  /'__`\/\`'__\
/\__, `\\ \ \_/\ \L\.\_\ \ \_\ \ \/\ \__/     /\__, `\/\  __/\ \ \/ \ \ \_/ |/\  __/\ \ \/
\/\____/ \ \__\ \__/.\_\\ \__\\ \_\ \____\    \/\____/\ \____\\ \_\  \ \___/ \ \____\\ \_\
\/___/   \/__/\/__/\/_/ \/__/ \/_/\/____/     \/___/  \/____/ \/_/   \/__/   \/____/ \/*/

app.use(express.static(__dirname));

app.listen(process.env.PORT || 1188);

console.log("server listening on " + (process.env.PORT || 1188));
console.log("Visit http://localhost:" + (process.env.PORT || 1188) + " in your browser");
