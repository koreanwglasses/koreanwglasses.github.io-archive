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
 * @param {string} filename 
 */
const getExt = filename => filename.slice(filename.lastIndexOf('.') + 1);

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
const replicateRecursive = async(template, contentRoot, serveRoot) => {
  console.log(`Replicating [${contentRoot}] into [${serveRoot}]`)
  const contentNodeNames = await fs.readdir(contentRoot);
  const result = await Promise.all(
    contentNodeNames.map(contentNodeName => 
      (async () => {
        const contentNodePath = contentRoot + '/' + contentNodeName;
        const contentNodeStats = await fs.lstat(contentNodePath);

        if(contentNodeStats.isDirectory()) {
          // Recurse on directory
          const serveNodePath = serveRoot + '/' + contentNodeName;
          await fs.mkdir(serveNodePath, {recursive: true});
          const result = await replicateRecursive(template, contentNodePath, serveNodePath);
          return {[contentNodeName]: {...result, isDirectory: true}}
        }
        
        if (contentNodeStats.isFile() && getExt(contentNodeName) === 'md') {
          // Generate and write file
          const serveNodePath = `${serveRoot}/${stripExt(contentNodeName)}.html`;
          const frontMatter = yfm.loadFront(await fs.readFile(contentNodePath, {encoding: 'UTF-8'}));
          if(frontMatter.replicate) {
            console.log(`Replicating [${contentNodePath}] into [${serveNodePath}]`);
            await fs.writeFile(serveNodePath, template(frontMatter));
            const frontMatterOnly = {...frontMatter};
            delete frontMatterOnly.__content;
            return {[contentNodeName]: {...frontMatterOnly, isFile: true}};
          }
        }
        console.log(`Skipping [${contentNodePath}]`);
        return {};
      })()
    )
  );

  return result.reduce((prev, cur) => {return {...prev, ...cur}}, {});
}

(async () => {
  const result = await replicateRecursive(template, contentRoot, serveRoot);
  console.log('Writing meta.json...');
  await fs.writeFile(contentRoot + '/meta.json', JSON.stringify(result));
  console.log('Done!');
})();