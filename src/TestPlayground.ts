import { request_client } from './api/RequestClient'

const client = new request_client()
const res = client.eval_js('https://google.com/', 'document.title')

console.log(res)