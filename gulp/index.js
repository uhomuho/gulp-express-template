const fs = require('fs')

fs.readdirSync(__dirname).forEach(file => {
  if (file !== 'index.js') {
    var name = file.replace('.js', '');
    exports[name] = require('./' + file);
  }
})