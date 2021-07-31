import esbuild from 'esbuild';
import fs from 'fs';



fs.watch('./src', { recursive: true },(event,filename)=>{
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