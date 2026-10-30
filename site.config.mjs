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
 * Mods come in three groups. The base mods are the `sources` of the Stein Loader index (the first
 * address of `modIndex` that answers), the same list the Stein Client and the installer read. The
 * extras (`extraSources`) are official too, but serve specific servers, so the Stein Client does not
 * bring them on its own: the player adds them by their link. The third-party ones are the indexes in
 * `thirdPartySources`. Each source is a steinmods.json published with the mod's releases; an extra
 * with no release yet simply doesn't show up, and a mod in `extraSources` wins over the base list.
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

  extraSources: [
    'https://github.com/Stein-Project/keybind/releases/latest/download/steinmods.json',
    'https://github.com/Stein-Project/minimap/releases/latest/download/steinmods.json',
    'https://github.com/Stein-Project/mouse/releases/latest/download/steinmods.json',
    'https://github.com/Stein-Project/combat/releases/latest/download/steinmods.json',
  ],

  thirdPartySources: [],
};
