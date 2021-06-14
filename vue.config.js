module.exports = {
  lintOnSave: false,
  pluginOptions: {
    electronBuilder: {
      preload: 'src/electronHandler/preload.ts',
      builderOptions: {
        "appId": "com.korigamik.mangu-reader",
        "productName": "ManguReader",
        "linux": {
          "icon": "build/icon.png",
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
