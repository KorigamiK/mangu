module.exports = {
  lintOnSave: false,
  pluginOptions: {
    electronBuilder: {
      preload: 'src/electronHandler/preload.ts',
      builderOptions: {
        "appId": "com.korigamik.mangu-reader",
        "productName": "ManguReader",
        "linux": {
          "target": [
            "deb",
            "AppImage"
          ],
          "category": "Viewer"
        }
      }
    }
  }
}
