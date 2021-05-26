module.exports = {
  lintOnSave: false,
  pluginOptions: {
    electronBuilder: {
      preload: 'src/electronHandler/preload.ts',
    }
  }
}
