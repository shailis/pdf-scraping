const fs = require('fs');
const pdfParse = require('pdf-parse');
const PDFExtract = require('pdf.js-extract').PDFExtract;
const pdfExtract = new PDFExtract();

let filePath = './pdf/2021_Eco_eBike_230x160mm_DIGITAL VERSION_DE.pdf';

/**------------Using pdf-parser--------------- */
let dataBuffer = fs.readFileSync(filePath);

pdfParse(dataBuffer).then((data) => {
  const txt = data.text.split(/\n/);
  truncFileIfExists('./data/demo1.txt');

  var file = fs.createWriteStream('./data/demo1.txt');
  file.on('error', function (err) {
    /* error handling */
    console.log(err);
  });
  txt.forEach(function (v) {
    if (v !== '') {
      // console.log(v.replace(/\b/g, '').replace('  ', ' '));
      file.write(v.replace(/\b/g, '').replace('  ', ' ') + '\n');
    }
  });
  file.end();
  // truncFileIfExists('./data/demo1.txt');
  // fs.writeFileSync('./data/demo1.txt', data.text);
});
/**---------------pdf-parser----------------- */

/**--------------Using pdf.js-extract-------------- */
const options = {
  normalizeWhitespace: true,
  disableCombineTextItems: true, // to keep or not to keep, that is the question
};
pdfExtract.extract(filePath, options, (err, data) => {
  if (err) return console.log(err);

  truncFileIfExists('./data/demo2.txt');

  for (var i = 0; i < data.pages.length; i++) {
    for (var j = 0; j < data.pages[i].content.length; j++) {
      require('fs').appendFileSync(
        './data/demo2.txt',
        data.pages[i].content[j].str + '\n',
        'utf-8'
      );
    }
  }
});
/**------------pdf.js-extract--------------- */

const truncFileIfExists = (filePath) => {
  if (fs.existsSync(filePath)) {
    fs.truncateSync(filePath, 0);
  }
};
