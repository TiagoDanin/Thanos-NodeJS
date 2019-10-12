#!/usr/bin/env node

const fs = require('fs')
const path = require('path')
const argv = require('minimist')(process.argv)

let allFiles = []
const showHelp = () => {
	return console.log(`
THANOS NodeJS by Tiago Danin
Inspired by https://thanosjs.org

Reduce the file size of your project down to 50%,
by randomly deleting half of the files.
It uses fs.unlinkSync to delete the files.
It traverses the whole directory structure down from where the command is executed. So files inside child directories might be deleted.

Use: thanos --universe [dir]
You can save a single file with --ironman [file]
	`)
}

const getFiles = (dir) => {
	fs.readdirSync(dir).map((f) => {
		let fullPath = path.join(dir, f)
		if (fs.statSync(fullPath).isDirectory()) {
			getFiles(fullPath)
		} else {
			allFiles.push(fullPath)
		}
	})
}

const main = () => {
	getFiles(path.resolve(process.cwd(), argv.universe))

	if (argv.ironman) {
		allFiles = allFiles.filter(f => f != path.resolve(argv.ironman))
	}

	const max = Math.round(allFiles.length / 2)
	for (let i = 0; i < max; i++) {
		let pathRandom = allFiles[Math.floor((Math.random() * allFiles.length))]
		allFiles = allFiles.filter(f => f != pathRandom)
		fs.unlinkSync(pathRandom)
	}
	return console.log(`
Thanos deleted half of the files! :)
	`)
}

if (!argv.universe || argv.help) {
	return showHelp()
}
return main()
