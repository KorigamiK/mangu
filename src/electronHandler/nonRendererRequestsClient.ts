import fetch from 'node-fetch'
import { createWriteStream, existsSync } from 'fs';
import { pipeline } from 'stream';
import { promisify } from 'util';
import { extension } from 'mime-types';
import { mkdir, writeFile } from 'fs/promises';
import { dirname } from 'path';

const streamPipeline = promisify(pipeline)

export class non_renderer_requests_client {
  public static test_url = 'https://h1.klimv1.xyz/images/20210407/2d960b00a9c003e16e51d5d473871eb7142.jpg'

  public static get_encoded_response = async (url: string, options = { headers: { 'referer': 'https://kissaway.net/' } }): Promise<string> => {
    const response = await fetch(url, options);
    const data = await response.buffer()
    const mime = response.headers.get("content-type")
    return "data:" + mime + ";base64," + data.toString('base64')
  };

  public static async download(url: string, download_location: string, headers={}): Promise<number> {
    if (url.startsWith('file:')) {
      return -1;
    }
    const matches = url.match(/^data:([A-Za-z-+/]+);base64,(.+)$/);
    if (!existsSync(dirname(download_location))) await mkdir(dirname(download_location), {recursive: true})
    if (!matches) {
      const response = await fetch(url, headers)
      if (!response.ok) {
        console.log(`unexpected response ${response.statusText}`)
        return response.status
      }
      const mime = response.headers.get("content-type") || 'unknown'
      await streamPipeline(response.body, createWriteStream(download_location + `.${extension(mime)}`));
      return response.status
    } else if (matches.length === 3) {
      const mime = matches[1]
      const data = Buffer.from(matches[2], 'base64')
      await writeFile(download_location + `.${extension(mime)}`, data)
      return 1.1
    } else {
      console.log('Unknown url type. Cannot download')
      return 0.0
    }

  }
}

