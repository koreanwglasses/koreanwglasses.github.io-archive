/**
 * Replicates files to their appropriate location to effect static routing.
 * 
 * (This is not a general solution and only works for the current configuration
 * of this project)
 * 
 * Replicates the structure of ./resources/content in the serve root (./ for prod,
 * ./dev for dev) by filling the template.js and writing it to the appropriate
 * folders.
 * 
 * TODO: Use a library or make one
 * TODO: Check for existing files/folders
 * TODO: Insert a static rendering of the page as a fallback incase javascript is disabled
 */

const fs_callback = require('fs');
const fs = {
	readdir: (path) =>
		new Promise((resolve, reject) =>
			fs_callback.readdir(path, (err, files) => {
				if (err) reject(err);
				resolve(files);
			})
		),
	lstat: (path) =>
		new Promise((resolve, reject) =>
			fs_callback.lstat(path, (err, stats) => {
				if (err) reject(err);
				resolve(stats);
			})
		),
	mkdir: (path, options) =>
		new Promise((resolve, reject) =>
			fs_callback.mkdir(path, options, (err) => {
				if (err) reject(err);
				resolve();
			})
		),
	readFile: (path, options) =>
		new Promise((resolve, reject) =>
			fs_callback.readFile(path, options, (err, data) => {
				if (err) reject(err);
				resolve(data);
			})
		),
	writeFile: (path, content) =>
		new Promise((resolve, reject) =>
			fs_callback.writeFile(path, content, (err) => {
				if (err) reject(err);
				resolve();
			})
		)
};

const yfm = require('yaml-front-matter');
const argv = require('minimist')(process.argv);

const template = require(argv.dev ? './template.dev.js' : './template.prod.js');

const serveRoot = argv.dev ? './dev' : '.';
const contentRoot = './resources/content';

/**
 * Strips the extension from the filename
 * @param {string} filename 
 */
const stripExt = (filename) => filename.slice(0, filename.lastIndexOf('.'));

/**
 * @param {string} filename 
 */
const getExt = (filename) => filename.slice(filename.lastIndexOf('.') + 1);

/**
 * Recursively copies the index.html to serveRoot replicating
 * the directory structure of contentRoot and replacing the files
 * with the template. 
 * 
 * @param {(props: any) => string} template
 * @param {string} contentRoot 
 * @param {string} serveRoot 
 * 
 * @returns {any} A summary of the structure traversed 
 */
const buildRecursive = async (template, contentRoot, serveRoot) => {
	console.log(`Building [${contentRoot}] into [${serveRoot}]`);
	const contentNodeNames = await fs.readdir(contentRoot);
	const result = await Promise.all(
		contentNodeNames.map((contentNodeName) =>
			(async () => {
				const contentNodePath = contentRoot + '/' + contentNodeName;
				const contentNodeStats = await fs.lstat(contentNodePath);

				if (contentNodeStats.isDirectory()) {
					// Recurse on directory
					const serveNodePath = serveRoot + '/' + contentNodeName;
					await fs.mkdir(serveNodePath, { recursive: true });
					const result = await buildRecursive(template, contentNodePath, serveNodePath);
					return { [contentNodeName]: { contents: result, isDirectory: true } };
				}

				if (contentNodeStats.isFile() && getExt(contentNodeName) === 'md') {
					// Generate and write file
					const serveNodePath = `${serveRoot}/${stripExt(contentNodeName)}.html`;
					const frontMatter = yfm.loadFront(await fs.readFile(contentNodePath, { encoding: 'UTF-8' }));
					if (frontMatter.replicate) {
						console.log(`Building [${contentNodePath}] into [${serveNodePath}]`);

						// Write html
						const templateArgs = { title: stripExt(contentNodeName), ...frontMatter };
						await fs.writeFile(serveNodePath, template(templateArgs));

						// Keep track of file structure
						const frontMatterOnly = { ...frontMatter };
						delete frontMatterOnly.__content;
						return { [contentNodeName]: { frontMatter: frontMatterOnly, isFile: true } };
					}
				}
				console.log(`Skipping [${contentNodePath}]`);
				return {};
			})()
		)
	);

	return result.reduce((prev, cur) => {
		return { ...prev, ...cur };
	}, {});
};

(async () => {
	const result = await buildRecursive(template, contentRoot, serveRoot);
	console.log('Writing meta.json...');
	await fs.writeFile(contentRoot + '/meta.json', JSON.stringify(result));
	console.log('Done!');
})();
