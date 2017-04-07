const mongoose = require('mongoose');
mongoose.Promise = global.Promise;
mongoose.connect('mongodb://localhost/panduoduo-test');

const db = mongoose.connection;
db.on('error', console.error.bind(console, 'connection error:'))
db.once('open', function() {
  // we're connected!
  console.log('ddd');
  // silence.save(function (err, fluffy) {
  //   if (err) return console.error(err);
  //   console.log('ssss');
  // });
});


var kittySchema = mongoose.Schema({
  name: String
});

var Kitten = mongoose.model('Kitten', kittySchema);
var silence = new Kitten({ name: 'Silence' });
console.log(silence.name); // 'Silence'
silence.save()
  .then((res) => {
    console.log('res: ', res);
  })
  .catch(e => {
    console.log('e: ',e );
  })
