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

const fs = require('fs').promises;
const yfm = require('yaml-front-matter');
const argv = require('minimist')(process.argv);

const template = require(argv.dev ? './template.dev.js' : './template.prod.js');

const serveRoot = argv.dev ? './dev' : '.';
const contentRoot = './resources/content';

/**
 * Strips the extension from the filename
 * @param {string} filename 
 */
const stripExt = filename => filename.slice(0, filename.lastIndexOf('.'));

/**
 * Recursively copies the index.html to serveRoot replicating
 * the directory structure of contentRoot and replacing the files
 * with index.html
 * 
 * @param {(props: any) => string} template
 * @param {string} contentRoot 
 * @param {string} serveRoot 
 */
const replicateRecursive = async(template, contentRoot, serveRoot) => {
  console.log(`Replicating [${contentRoot}] into [${serveRoot}]`)
  const contentNodeNames = await fs.readdir(contentRoot);
  await Promise.all(
    contentNodeNames.map(contentNodeName => 
      (async () => {
        const contentNodePath = contentRoot + '/' + contentNodeName;
        const contentNodeStats = await fs.lstat(contentNodePath);

        if(contentNodeStats.isDirectory()) {
          // Recurse on directory
          const serveNodePath = serveRoot + '/' + contentNodeName;
          await fs.mkdir(serveNodePath, {recursive: true});
          await replicateRecursive(template, contentNodePath, serveNodePath);
        } else if (contentNodeStats.isFile()) {
          // Generate and write file
          const serveNodePath = `${serveRoot}/${stripExt(contentNodeName)}.html`;
          const frontMatter = yfm.loadFront(await fs.readFile(contentNodePath, {encoding: 'UTF-8'}));
          if(frontMatter.replicate) {
            console.log(`Replicating [${contentNodePath}] into [${serveNodePath}]`);
            await fs.writeFile(serveNodePath, template(frontMatter)); 
          } else {
            console.log(`Skipping [${contentNodePath}]`);
          }
        }
      })()
    )
  );
}

(async () => {
  await replicateRecursive(template, contentRoot, serveRoot);
  console.log('Done!');
})();