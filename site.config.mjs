/**
 * Site configuration: identity, links, the downloadable products and where the mod list comes
 * from. Each product's texts (kind, summary, systems) live in the translations, in
 * src/i18n/<locale>.mjs.
 *
 * Products are read from the repositories in `releases`: the source repository, where every release
 * goes now, then the frozen distribution repository that held the earlier ones. `changelog` is the
 * repository whose changelog/<version>.<locale>.md files hold the translated notes (the English
 * release body is used for a version without them).
 *
 * Mods are not listed here: the official ones are the `sources` of the Stein Loader index (the first
 * address of `modIndex` that answers), the same list the Stein Client and the installer read, and the
 * third-party ones are the indexes in `thirdPartySources`. Each source is a steinmods.json published with the mod's releases.
 */
export default {
  name: 'Stein Project',
  author: 'X4vieer',

  discord: 'https://discord.gg/MEHE9b5bjj',
  github: 'https://github.com/Stein-Project',

  products: [
    {
      id: 'client',
      label: 'Stein Client',
      releases: ['Stein-Project/client', 'Stein-Project/stein-client'],
      changelog: 'Stein-Project/client',
      files: ['SteinClient.exe'],
    },
    {
      id: 'loader',
      label: 'Stein Loader',
      releases: ['Stein-Project/installer', 'Stein-Project/stein-loader'],
      changelog: 'Stein-Project/loader',
      source: 'https://github.com/Stein-Project/loader',
      files: ['SteinLoader-Installer.jar'],
    },
    {
      id: 'sdk',
      label: 'Stein SDK',
      releases: ['Stein-Project/sdk', 'Stein-Project/stein-sdk'],
      changelog: 'Stein-Project/sdk',
      source: 'https://github.com/Stein-Project/sdk',
      files: ['stein-sdk.jar'],
    },
  ],

  modIndex: [
    'https://github.com/Stein-Project/installer/releases/latest/download/stein.json',
    'https://raw.githubusercontent.com/Stein-Project/stein-loader/main/stein.json',
  ],

  thirdPartySources: [],
};
