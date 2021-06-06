const path = require('path')

module.exports = function (source) {
  const filename = path.basename(this.resourcePath)
  const assetInfo = {
    sourceFilename: path.relative(this.rootContext, this.resourcePath),
  }

  this.emitFile(filename, source, null, assetInfo)

  return `
import React from 'react'

export default function Player(props) {
  return <audio controls {...props} src="${filename}" />
}
  `
}

// Mark the loader as raw so that the emitted audio binary
// does not get processed in any way.
module.exports.raw = true
