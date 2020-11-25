var express = require('express');
var router = express.Router();
var https = require('https')
/* GET home page. */
router.get('/area/:area/util/:util', function(req, res, next) {
  
  let responseString = req.params.area + ' is expected to have ' + req.params.util+' outages from ';
  var datetime = new Date();
  datetime = datetime.toISOString().slice(0,10).replace('-','').replace('-','');
  if(req.params.util == 'Water' || req.params.util == 'Electricity'){
    https.get('https://smart-city-project-155f4.firebaseio.com/jaipur/'+req.params.area+'/'+req.params.util+'/'+datetime+'.json', (resp) => {
      let data = '';
      resp.on('data', (chunk) => {
        data += chunk;
      });

      // The whole response has been received. Print out the result.
      resp.on('end', () => {
        function myFunction(value, index, array) {
          console.log(value.start);
          if(value.start==12){
            value.start='12pm';
          } else if(value.start==0){
            value.start='12am';
          } else if(value.start>=12){
            value.start = value.start-12+ 'pm';
          } else {
            value.start = value.start +'am';
          }

          if(value.end==12){
            value.end='12pm';
          } else if(value.end==0){
            value.end='12am';
          } else if(value.end>=12){
            value.end = value.end-12+ 'pm';
          } else {
            value.end = value.end +'am';
          }
          responseString += (' ' + value.start + ' to ' + value.end + ',');
        }
        const objj = JSON.parse(data);
        objj.forEach(myFunction);
        res.send(responseString.slice(0, -1));
      });

    }).on("error", (err) => {
      console.log("Error: " + err.message);
    });
  } else if(req.params.util == 'Gas') {
    https.get('https://smart-city-project-155f4.firebaseio.com/jaipur/'+req.params.area+'/'+req.params.util+'.json', (resp) => {
      let data = '';
      resp.on('data', (chunk) => {
        data += chunk;
      });

      // The whole response has been received. Print out the result.
      resp.on('end', () => {
        const objj = JSON.parse(data);
        if(objj[datetime] < objj.threshold)
          res.send("There is low availablity of gas cylinders in your area");
      });

    }).on("error", (err) => {
      console.log("Error: " + err.message);
    });
  }
  
});

module.exports = router;
