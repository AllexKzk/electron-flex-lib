require('dotenv').config();

module.exports = {
  packagerConfig: {
    icon: __dirname + '/assets/icon.ico'
  },
  rebuildConfig: {},
  publishers: [
    {
      name: '@electron-forge/publisher-github',
      platforms: ['win32', 'linux'],
      config: {
        repository: {
          owner: 'AllexKzk',
          name: 'electron-flex-lib'
        },
        authToken: process.env.GITHUB_TOKEN,
        prerelease: true
      }
    }
  ],
  makers: [
    {
      name: '@electron-forge/maker-squirrel',
      platforms: ['win32'],
      config: {
        iconUrl: __dirname + '/assets/icon.ico',
        setupIcon: __dirname + '/assets/icon.ico',
        //certificateFile: __dirname + '/assets/out.pfx',
        //certificatePassword: __dirname + '/assets/key.key',
      },
    },
    {
      name: '@electron-forge/maker-zip',
      platforms: ['darwin'],
    },
    {
      name: '@electron-forge/maker-deb',
      config: {
        icon: './assets/logo.png'
      },
    },
    {
      name: '@electron-forge/maker-rpm',
      config: {},
    },
  ],
  plugins: [
    {
      name: '@electron-forge/plugin-webpack',
      config: {
        mainConfig: './webpack.main.config.js',
        renderer: {
          config: './webpack.renderer.config.js',
          entryPoints: [
            {
              html: './src/View/index.html',
              js: './src/View/renderer.js',
              name: 'main_window',
              preload: {
                js: './src/Node/preload.js',
              },
            },
          ],
        },
      },
    },
  ],
};
