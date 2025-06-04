
const NEYNAR_API_KEY = '1D6A156E-9D42-447D-B098-4F611CFF78B5'
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

export const PORTAL_BASEURL = 'https://api.neynar.com/v2'
  export const portalapi = axios.create({
    baseURL: BASEURL,
    headers: {
      'Content-Type': 'application/json',
      'x-api-key': NEYNAR_API_KEY
    },
  });
  

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