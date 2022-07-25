import { configuration } from '../config';
import moment from 'moment';
import Axios from 'axios';

export const formUrlEncode = (data) => {
    const keys = Object.keys(data);
    const tuples = keys.map(
      (key) => `${encodeURIComponent(key)}=${encodeURIComponent(data[key])}`
    );
    return tuples.join('&');
  };
  

export const getAccessToken = async (code)=> {
    const { OATH_CLIENT_ID, OATH_URL, OAUTH_POLICY } = configuration;
    const body =
    Platform.OS == 'ios'
      ? {
          client_id: OATH_CLIENT_ID,
          code: code,
          grant_type: 'authorization_code',
          scope: `${OATH_CLIENT_ID} offline_access`,
        }
      : {
          client_id: OATH_CLIENT_ID,
          code: code,
          grant_type: 'authorization_code',
          scope: `${OATH_CLIENT_ID} offline_access`,
        };

        let TokenDetails;

  const { data } = await Axios.request({
    method: 'post',
    url: `${OATH_URL}${OAUTH_POLICY}/oauth2/v2.0/token`,
    headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
    data: formUrlEncode(body),
  });
  const refreshTokenExpiry = moment().valueOf() + data.refresh_token_expires_in * 1000;
  
  return {
    accessToken: data.access_token,
    refreshToken: data.refresh_token,
    accessTokenExpiry: data.expires_on * 1000,
    refreshTokenExpiry,
  }
}