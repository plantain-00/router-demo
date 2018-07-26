module.exports = {
  inputFiles: [
    'vue/index.min.js',
    'react/index.min.js',
    'rxjs-react/index.min.js',
    'index.min.css',
    '**/index.ejs.html'
  ],
  outputFiles: file => file.replace('.ejs', ''),
  ejsOptions: {
    rmWhitespace: true
  },
  sha: 256,
  customNewFileName: (filePath, fileString, md5String, baseName, extensionName) => baseName + '-' + md5String + extensionName,
  fileSize: 'file-size.json'
}
