var express = require('express');
var router = express.Router();
var fingerprint = require('express-fingerprint')
const util = require('util')


/* GET home page. */
router.get('/', function(req, res, next) {
	console.log("********* Request ***********");
	console.log(req.query.from);
  	// console.log(util.inspect(req, { showHidden: false, depth: null }));	

	console.log("********* New fingerprint ***********");
  	console.log(util.inspect(req.fingerprint, { showHidden: false, depth: null }));	

	console.log("********* Existing fingerprints ***********");
	db = req.db
	var collection = db.get('fingerprintCollection');

	var oldFps = {};
	collection.find({},{},function(e,docs){
		console.log(util.inspect(docs, { showHidden: false, depth: null }));			
		oldFps = docs;
	});

	collection = db.get('fingerprintCollection');
    // Submit to the DB
    collection.insert({
        "hash" : req.fingerprint.hash,
        "from": req.query.from,
        "components" : req.fingerprint.components
    });

  // console.log('fingerprint', util.inspect(req.fingerprint));
  res.render('index', { title: 'Express', fingerprint: JSON.stringify(req.fingerprint), fingerprints: JSON.stringify(oldFps)});
});

module.exports = router;
