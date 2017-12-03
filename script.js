const _ = require('underscore')
const fs = require('fs-promise')
const debug = require('debug')('cue-file-generator')
const argv = require('minimist')(process.argv.slice(2))

function createCueFile(binName) {
  return `FILE “${binName}” BINARY
    TRACK 01 MODE1/2352
    INDEX 01 00:00:00`
}

async function run() {
  const binDir = argv.dir

  if(!binDir) {
    debug('I need a dir to work, use --dir bin/files/dir')
    process.exit(1)
  }

  debug('Looking for .bin files inside %s', binDir)
  const files = await fs.readdir(binDir)

  for (var i = 0; i < files.length; i++) {
    const file = files[i]
    const fileCue = file.split('.bin')[0] + '.cue'

    if(file.split('.').pop() === 'bin') {
      debug(`Checking file ${file}`)

      try {
        const cueFile = await fs.lstat(binDir + fileCue)
        debug(`There is already a .cue file for ${file}`)
      } catch (e) {
        if(e) {
          debug(`${fileCue} does not exist`)
          debug(`Creating new ${fileCue}`)

          try {
            await fs.writeFile(binDir + fileCue, createCueFile(files[i]))
            debug(`.cue file created for ${files[i]}`)
          } catch (e) {
            debug(e.toString())
          }
        }
      }
    }
  }
}

run()
