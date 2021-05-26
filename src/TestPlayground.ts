
export const test_func = () => {
    const request_client = require('./api/RequestClient').request_client
    // const Blacklist = require('./FilterList').Blacklist
    // const electron = window.require('electron')
    // electron.session.defaultSession.webRequest.onBeforeSendHeaders(Blacklist, (details, callback)=> {
    //     callback({cancel: true})
    // })
    
    console.log('Test file loaded.')
    const client = new request_client()
    const res = client.eval_js('https://rawkuma.com/kanojo-okarishimasu-chapter-188/', "let list = []; let x = document.querySelectorAll('img.ts-main-image'); for (i = 0; i < x.length; ++i) {list.push(x[i].src)}; list")

    console.log(res, typeof res)
}