# Mangu Reader
A simple and fast manga reader that helps you read manga in various languages and lets you switch between them with one click.

# Examples
This shows how switching between languages feels like:
![switch b/w languages](/example/switching.gif)

# Features
- Fast loading
- Different languages from different sources
- Single and Batch downloads of chapters
- Easy navigation between chapters
- Many raw sources
- Read local / downloaded manga

# Note
- Downloads are saved to your `Pictures` folder inside `Mangas` by default.
- You can change the Mangas directory by changing `mangu-reader/config.json` inside your config directory.
- The default config directory is as follows:
    - %APPDATA% on Windows
    - $XDG_CONFIG_HOME or ~/.config on Linux
    - ~/Library/Application Support on macOS
- You may need to put a `\` in front of every `\` if you are on Windows.

# Downloads and Installation
    
The [continuous_releases](https://github.com/KorigamiK/mangu/releases/tag/continuous_releases) tag shall have the newest binaries for different OS. 

Every commit counts as a new release, so you can watch this repo to receive updates whenever a new commit is pushed.

# Things to work on

- Lacks various QOL features
- Very bare-bones' reader
- No configuration options

# Development

## Project setup
```
npm install
```

### Compiles and hot-reloads for development
```
npm run electron:serve
```

### Compiles and minifies for production
```
npm run electron:build
```

### Lints and fixes files
```
npm run lint
```

### Customize configuration
See [Configuration Reference](https://cli.vuejs.org/config/).
