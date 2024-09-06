
import crypto from 'crypto';
import axios from 'axios';
import qs from 'qs';

const api_url = "https://api.binance.us";

export function getAuthSignature(data, secret) {
    const message = qs.stringify(data)
    console.log(message)
    return crypto.createHmac('sha256', secret).update(message).digest('hex');
}

export async function request(uri_path, data, api_key, secret_key) {
    const sig = getAuthSignature(data, secret_key);
    //console.log(sig);
    const query = qs.stringify(data)
    axios.get(api_url + uri_path + "?" + query + `&signature=${sig}`, {
      headers: {
        'X-MBX-APIKEY': api_key,
      },
    }).then(function(response) {
      console.log(response.data);
    }).catch(function(error) {
      // handle error
      console.log(error);
    })
}

export async function get(uri_path, data) {
  const query = qs.stringify(data)
  return await axios.get(api_url + uri_path + "?" + query, {}).then(function(response) {
    return response.data
  }).catch(function(error) {
    // handle error
    console.log(error);
  })
}

