// keys.js
// Figure out which credentials return
if(process.env.NOVE_ENV === 'production'){
  //we're in prod
  module.exports = require('./prod');
} else {
  //we're in dev
  module.exports = require('./dev');
}
