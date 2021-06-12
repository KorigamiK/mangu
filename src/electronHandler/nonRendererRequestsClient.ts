import fetch from 'node-fetch'

export class non_renderer_requests_client {
  public static test_url = 'https://h1.klimv1.xyz/images/20210407/2d960b00a9c003e16e51d5d473871eb7142.jpg'

  public static get_encoded_response = async (url: string, options = { headers: { 'referer': 'https://kissaway.net/' } }): Promise<string> => {
    const response = await fetch(url, options);
    const data = await response.buffer()
    const mime = response.headers.get("content-type")
    return "data:" + mime + ";base64," + data.toString('base64')
  };
}

