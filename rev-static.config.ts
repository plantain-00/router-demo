export default {
  inputFiles: [
    'vue/index.min.js',
    'react/index.min.js',
    'rxjs-react/index.min.js',
    'index.min.css',
    '**/index.ejs.html'
  ],
  excludeFiles: [
    'node_modules'
  ],
  outputFiles: (file: string) => file.replace('.ejs', ''),
  ejsOptions: {
    rmWhitespace: true
  },
  sha: 256,
  customNewFileName: (_filePath: string, _fileString: string, md5String: string, baseName: string, extensionName: string) => baseName + '-' + md5String + extensionName,
  fileSize: 'file-size.json',
  context: {
    buildMoment: new Date().toString()
  }
}
