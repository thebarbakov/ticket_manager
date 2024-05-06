const fs = require("fs");

const deleteFilesInFolder = async (path) => {
  fs.readdir(path, (err, items) => {
    for (let i = 0; i < items.length; i++) {
      const file = path + "/" + items[i];
      fs.stat(file, (error, stats) => {
        if (error) {
        } else {
          if (!stats.isFile()) return;
          fs.unlinkSync(file, (err) => console.log(err));
        }
      });
    }
  });
};

module.exports = deleteFilesInFolder;
