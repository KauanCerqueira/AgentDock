module.exports = {
  appId: 'com.agentdock.app',
  productName: 'AgentDock',
  directories: {
    output: 'dist',
    buildResources: 'electron/assets'
  },
  files: [
    'electron/**/*',
    'src/AgentDock.Backend/**/*',
    'node_modules/**/*',
    '!src/AgentDock.Backend/bin',
    '!src/AgentDock.Backend/obj',
    '!**/*.pdb',
    '!**/.git',
    '!**/.gitignore',
    '!**/node_modules/*/.bin',
    '!**/node_modules/*/test',
    '!**/node_modules/*/tests',
    '!**/node_modules/*/.ts',
    '!**/node_modules/*/.tsx'
  ],
  extraResources: [
    {
      from: 'src/AgentDock.Backend/bin/Release/net8.0/publish',
      to: 'backend',
      filter: ['**/*']
    },
    {
      from: 'llama.cpp',
      to: 'llama.cpp',
      filter: [
        'config.json',
        // Only include CPU variant by default for smaller installer
        // Users can download GPU-specific variants via setup script
        'cpu/**/*',
        // Keep models folder structure
        'models/**/*',
        '!models/*.gguf'  // Exclude actual model files (users download them)
      ]
    }
  ],
  win: {
    target: [
      'nsis',
      'portable'
    ],
    certificateFile: process.env.WIN_CERT_FILE || null,
    certificatePassword: process.env.WIN_CERT_PASSWORD || null,
    signingHashAlgorithms: ['sha256']
  },
  nsis: {
    oneClick: false,
    allowToChangeInstallationDirectory: true,
    createDesktopShortcut: true,
    createStartMenuShortcut: true,
    shortcutName: 'AgentDock'
  },
  portable: {
    artifactName: 'AgentDock-${version}-portable.exe'
  },
  mac: {
    target: [
      'dmg',
      'zip'
    ],
    category: 'public.app-category.developer-tools',
    entitlements: 'electron/entitlements.mac.plist',
    entitlementsInherit: 'electron/entitlements.mac.plist',
    hardenedRuntime: true,
    gatekeeperAssess: false,
    notarize: {
      teamId: process.env.APPLE_TEAM_ID || null
    }
  },
  dmg: {
    contents: [
      {
        x: 110,
        y: 150,
        type: 'file'
      },
      {
        x: 240,
        y: 150,
        type: 'link',
        path: '/Applications'
      }
    ]
  },
  linux: {
    target: [
      'AppImage',
      'deb'
    ],
    category: 'Development'
  },
  appImage: {
    artifactName: 'AgentDock-${version}.${ext}'
  },
  deb: {
    depends: [
      'gconf2',
      'gconf-service',
      'libappindicator1',
      'libnotify4',
      'libxtst6',
      'xdg-utils'
    ]
  },
  publish: {
    provider: 'github',
    owner: 'KauanCerqueira',
    repo: 'AgentDock',
    releaseType: 'release'
  }
}
