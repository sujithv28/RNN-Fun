var jsdom = require("jsdom")
var util = require('util')
var childprocess = require('child_process')
var mkdirp = require('mkdirp')
var path = require('path')
var fs = require('fs')

var txt = []
var url = "http://hpmor.com/chapter/%s"
var base = './data/chapter/'
var counter = 0

mkdirp(base, function(err) {
  if(err) {
    console.log(err)
    return
  }

  for(var i = 0, len = 113; i < len; ++i) {
    jsdom.env(util.format(url, i + 1), ready.bind(i))
  }
})

function ready(errors, window) {
  var index = this
  console.error(window.location.toString())
  if(errors) {
    console.error(errors)
    counter ++
    return
  }

  var item = {title: '', body: ''}
  var container

  for(var i = 0, len = window.document.body.children.length; i < len; ++i) {
    if(window.document.body.children[i].id === 'invertable') {
      container = window.document.body.children[i]

      break
    }
  }

  for(var i = 0, len = container.children.length; i < len; ++i) {
    if(container.children[i].id === "chapter-title") {
      item.title += container.children[i].outerHTML
    }

    if(container.children[i].id === "storycontent") {
      item.body += container.children[i].outerHTML
    }
  }

  var child = childprocess.spawn('pandoc', ['-f', 'html', '-t', 'plain'])

  var output =  ''
  child.stdout.on('data', function(data) {
    output += data
  }).on('error', console.error.bind(console))

  child.stderr.on('data', console.error.bind(console))
  .on('error', console.error.bind(console))

  child.stdout.on('end', function() {
    txt[index] = output

    if(txt.filter(Boolean).length === 113) {
      process.stdout.write(txt.join('\n'))
    }
  })

  child.stdin.end(item.title + item.body)
  fs.createWriteStream(path.join(base, '' + (index + 1)) + '.html').end(item.title + item.body)
}

