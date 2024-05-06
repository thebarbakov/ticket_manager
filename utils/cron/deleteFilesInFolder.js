const fs = require("fs");

const deleteFilesInFolder = async (path) => {
  console.log(1);
  fs.readdir(path, (err, items) => {
    console.log(items);
    for (let i = 0; i < items.length; i++) {
      const file = path + "/" + items[i];
      fs.stat(file, (error, stats) => {
        if (error) {
          console.log(error);
        } else {
          if (!stats.isFile()) return;
          fs.unlinkSync(file, (err) => console.log(err));
        }
      });
    }
  });
};

module.exports = deleteFilesInFolder;
