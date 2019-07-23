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

const fs = require('fs');

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
 * @param {string} contentDir 
 * @param {string} serveDir 
 * 
 * @returns {any} A summary of the structure traversed 
 */
const buildRecursive = (template, contentDir, serveDir) => {
	console.log(`Building [${contentDir}] into [${serveDir}]`);
	const contentNodeNames = fs.readdirSync(contentDir);
	const result = [];

	for (const contentNodeName of contentNodeNames) {
		const contentNodePath = contentDir + '/' + contentNodeName;
		const contentNodeStats = fs.lstatSync(contentNodePath);

		if (contentNodeStats.isDirectory()) {
			// Recurse on directory
			const serveNodePath = serveDir + '/' + contentNodeName;
			fs.mkdirSync(serveNodePath, { recursive: true });

			const subResult = buildRecursive(template, contentNodePath, serveNodePath);
			if (Object.keys(subResult).length > 0) {
				result.push({ [contentNodeName]: { contents: subResult, isDirectory: true } });
			}
			continue;
		}

		if (contentNodeStats.isFile() && getExt(contentNodeName) === 'md') {
			// Generate and write file
			const serveNodePath = `${serveDir}/${stripExt(contentNodeName)}.html`;
			const frontMatter = yfm.loadFront(fs.readFileSync(contentNodePath, { encoding: 'UTF-8' }));
			if (frontMatter.replicate) {
				console.log(`Building [${contentNodePath}] into [${serveNodePath}]`);

				// Write html
				const templateArgs = {
					title: stripExt(contentNodeName),
					command: 'cat ' + contentNodePath.slice(contentRoot.length),
					...frontMatter
				};
				fs.writeFileSync(serveNodePath, template(templateArgs));

				// Keep track of file structure
				const frontMatterOnly = { ...frontMatter };
				delete frontMatterOnly.__content;
				result.push({ [contentNodeName]: { frontMatter: frontMatterOnly, isFile: true } });
				continue;
			} else if (frontMatter.redirect) {
				console.log(`Building [${contentNodePath}] into [${serveNodePath}]`);

				// Write html
				fs.writeFileSync(serveNodePath, template(frontMatter));

				// skip tracking for this file
				return {};
			}
		}
		console.log(`Skipping [${contentNodePath}]`);
	}

	return result.reduce((prev, cur) => {
		return { ...prev, ...cur };
	}, {});
};

(async () => {
	const result = buildRecursive(template, contentRoot, serveRoot);
	console.log('Writing meta.json...');
	fs.writeFileSync(contentRoot + '/meta.json', JSON.stringify(result));
	console.log('Done!');
})();
