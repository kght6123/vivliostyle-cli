import chalk from 'chalk';
import fs from 'fs';
import path from 'upath';
import { CONTAINER_IMAGE } from './container';
import { cwd, log } from './util';

export interface InitCliFlags {
  title?: string;
  author?: string;
  language?: string;
  theme?: string;
  size?: string;
}

export async function init(cliFlags: InitCliFlags) {
  const vivliostyleConfigPath = path.join(cwd, 'vivliostyle.config.js');

  if (fs.existsSync(vivliostyleConfigPath)) {
    return log(
      `${chalk.yellow('vivliostyle.config.js already exists. aborting.')}`,
    );
  }

  // prettier-ignore
  const vivliostyleConfig = `module.exports = {
  title: '${ cliFlags.title || 'Principia'}', // populated into 'publication.json', default to 'title' of the first entry or 'name' in 'package.json'.
  author: '${cliFlags.author || 'Isaac Newton'}', // default to 'author' in 'package.json' or undefined
  ${cliFlags.language ? '' : '// '}language: '${cliFlags.language || 'la'}',
  // readingProgression: 'rtl', // reading progression direction, 'ltr' or 'rtl'.
  ${cliFlags.size ? '' : '// '}size: '${cliFlags.size || 'A4'}',
  ${cliFlags.theme ? '' : '// '}theme: '${cliFlags.theme || ''}', // .css or local dir or npm package. default to undefined
  image: '${CONTAINER_IMAGE}',
  entry: [ // **required field**
    // 'introduction.md', // 'title' is automatically guessed from the file (frontmatter > first heading)
    // {
    //   path: 'epigraph.md',
    //   title: 'おわりに', // title can be overwritten (entry > file),
    //   theme: '@vivliostyle/theme-whatever' // theme can be set individually. default to root 'theme'
    // },
    // 'glossary.html' // html is also acceptable
  ], // 'entry' can be 'string' or 'object' if there's only single markdown file
  // entryContext: './manuscripts', // default to '.' (relative to 'vivliostyle.config.js')
  // output: [ // path to generate draft file(s). default to '{title}.pdf'
  //   './output.pdf', // the output format will be inferred from the name.
  //   {
  //     path: './book',
  //     format: 'webpub',
  //   },
  // ],
  // workspaceDir: '.vivliostyle', // directory which is saved intermediate files.
  // toc: true, // whether generate and include ToC HTML or not, default to 'false'.
  // cover: './cover.png', // cover image. default to undefined.
  // vfm: { // options of VFM processor
  //   hardLineBreaks: true, // converts line breaks of VFM to <br> tags. default to 'false'.
  //   disableFormatHtml: true, // disables HTML formatting. default to 'false'.
  // },
};
`;

  fs.writeFileSync(vivliostyleConfigPath, vivliostyleConfig);
  log(`Successfully created ${chalk.cyan('vivliostyle.config.js')}`);
}
