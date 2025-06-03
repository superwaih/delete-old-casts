
const NEYNAR_API_KEY = 'EAAF4A38-195B-48CD-9E0A-1E017A0AC351'
const BASEURL =`https://hub-api.neynar.com/v1`

import axios from 'axios';


// export const BASEURL = 'http://64.227.38.32/api'
export const api = axios.create({
    baseURL: BASEURL,
    headers: {
      'Content-Type': 'application/json',
      'x-api-key': NEYNAR_API_KEY
    },
  });

//   api.interceptors.request.use(
//     async (config) => {
//       const AUTHENTICATION_TOKEN = getToken();
//       if (AUTHENTICATION_TOKEN) {
//         config.headers.Authorization = `Bearer ${AUTHENTICATION_TOKEN}`;
//       }
//       return config;
//     },
//     (error) => {
//       return Promise.reject(error);
//     },
//   );