import { ipcRenderer, webFrame } from 'electron'

(window as any).ipcRenderer= ipcRenderer
webFrame.setVisualZoomLevelLimits(1, 2);