/**
 * Replicates files to their appropriate location to effect static routing.
 * 
 * (This is not a general solution and only works for the current configuration
 * of this project)
 * 
 * Replicates the structure of ./resources/content in the serve root (./ for prod,
 * ./dev for dev) by copying the index.html in the serve root to the appropriate
 * folders.
 * 
 * TODO: Use a library or make one
 * TODO: Use templates
 * TODO: Check for existing files/folders
 */

const fs = require('fs').promises;
const argv = require('minimist')(process.argv);

const serveRoot = argv.dev ? './dev' : './';
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
 * @param {string} contentRoot 
 * @param {string} serveRoot 
 */
const replicateRecursive = async(indexFile, contentRoot, serveRoot) => {
  console.log(`Replicating [${contentRoot}] into [${serveRoot}]`)
  const contentNodeNames = await fs.readdir(contentRoot);
  await Promise.all(
    contentNodeNames.map(contentNodeName => 
      (async () => {
        const contentNodePath = contentRoot + '/' + contentNodeName;
        const contentNodeStats = await fs.lstat(contentNodePath);

        if(contentNodeStats.isDirectory()) {
          const serveNodePath = serveRoot + '/' + contentNodeName;
          fs.mkdir(serveNodePath, {recursive: true});
          await replicateRecursive(indexFile, contentNodePath, serveNodePath);
        } else if (contentNodeStats.isFile()) {
          const serveNodePath = `${serveRoot}/${stripExt(contentNodeName)}.html`;
          console.log(`Replicating [${contentNodePath}] into [${serveNodePath}]`)
          await fs.copyFile(indexFile, serveNodePath);
        }
      })()
    )
  );
}

(async () => {
  await replicateRecursive(serveRoot + '/index.html', contentRoot, serveRoot);
  console.log('Done!');
})();