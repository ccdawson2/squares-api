var mongoose = require('mongoose');

var squareSchema = mongoose.Schema({
	
   squareId:  Number,
   ownerId:   Number,
   xCoord:    Number,
   yCoord:    Number,
   desc:      String,
   shortDesc: String,
   image:     String,
   updated:   Date,
   created:   Date
});

var square = mongoose.model('square', squareSchema);

//mongoose.connect('mongodb://localhost:27017/squares');
mongoose.connect('mongodb://admin:admin@ds147421.mlab.com:47421/squares');

var db = mongoose.connection;
db.on('error', console.error.bind(console, 'db not connected...'));
db.once('open', function callback() {});

module.exports = {
  dbStats:         dbStats,
  getSquares:      getSquares,
  getSingleSquare: getSingleSquare,
  createSquare:    createSquare,
  updateSquare:    updateSquare,
  deleteSquare:    deleteSquare
};

function dbStats(req, res) {

   res.json("Not Yet Implemented ..");
}
	
function getSquares(req, res, next) {

// http://localhost:10010/squares/?size=2

   var size = req.swagger.params.size.value;
   console.log("getSquares() size=" + size);
  
   square.find({}, {}, {limit:size}, function(err, data) {
      if(err) {
         return next(err);
      }
         res.json(data);
   });  
}

function getSingleSquare(req, res, next) {
  
// http://localhost:10010/squares/2
  
   var squareId = parseInt(req.swagger.params.id.value);
   console.log('getSingleSquare() squareId=' + squareId);
 
   square.findOne({'squareId':squareId} , function(err, data) {
      if(err) {
         return next(err);
      }
         res.json(data);
   });
}

function createSquare(req, res, next) {

// curl --header "Content-Type: application/json" --request POST --data '{"squareId":1,"ownerId":2,"xCoord":5,"yCoord":5,"desc":"description 1","shortDesc":"desc1","image":"XXXXX"}' http://localhost:10010/squares

   console.log("createSquare() squareId=" + req.swagger.params.body.value.squareId);

   var currentDateTime = new Date();

   var Square = new square({
      squareId:  req.swagger.params.body.value.squareId,
      ownerId:   req.swagger.params.body.value.ownerId,
      xCoord:    req.swagger.params.body.value.xCoord,
      yCoord:    req.swagger.params.body.value.yCoord,
      desc:      req.swagger.params.body.value.desc, 
      shortDesc: req.swagger.params.body.value.shortDesc,
      image:     req.swagger.params.body.value.image,
	  created:   currentDateTime,
	  updated:   currentDateTime
      });
		
   Square.save(function(err, data) {
      if(err) {
         return next(err);
      }
      res.status(200)
         .json({
            status:  'success',
            message: 'Created Square'
      });        
   });
}

function updateSquare(req, res, next) {
	
//curl --header "Content-Type: application/json" --request PUT --data '{"squareId":1,"ownerId":2,"xCoord":5}' http://localhost:10010/squares   
  
   var squareId = parseInt(req.swagger.params.id.value);
   console.log("updateSquare() squareId=" + squareId);

   var currentDateTime = new Date();
   
   req.swagger.params.body.value.updated = currentDateTime;
      
   console.log(req.swagger.params.body.value);
   
   square.findOneAndUpdate({'squareId':squareId} , 
                           {$set:req.swagger.params.body.value} ,
						   function(err, data) {
      if(err) {
         return next(err);
      }
      res.status(200)
         .json({
            status:  'success',
            message: 'Updated Square'
      });       
  });
}

function deleteSquare(req, res, next) {

// curl --header "Content-Type: application/json" --request DELETE "http://localhost:10010/squares/1" 
  
   var squareId = parseInt(req.swagger.params.id.value);
   console.log("deleteSquare() squareId=" + squareId);
 
   square.findOneAndRemove({'squareId':squareId} , function(err, data) {
      if(err) {
         return next(err);
      }
      res.status(200)
         .json({
            status:  'success',
            message: 'Deleted Square'
      });       
  });
}