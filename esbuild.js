const esbuild = require('esbuild')
const fs = require('fs')
 


fs.watch('./src',(event,filename)=>{
    if (filename && event == 'change') {
        console.log(`${filename}文件发生更新`)
        esbuild.build({
            entryPoints: ['./src/index.js'],
            bundle: true,
            outfile: './dist/index.js',
          }).then(
            ({ stderr, warnings }) => {
              // const output = fs.readFileSync('./example.min.js', 'utf8')
              // console.log('success', { output, stderr, warnings })
            },
            ({ stderr, errors, warnings }) => {
              console.error('failure', { stderr, errors, warnings })
            }
          )
    }
})