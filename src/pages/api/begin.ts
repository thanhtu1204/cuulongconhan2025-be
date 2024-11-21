// import type { NextApiRequest, NextApiResponse } from 'next';
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
//   myHeaders.append(
//     'Cookie',
//     'remember_web_59ba36addc2b2f9401580f014c7f58ea4e30989d=eyJpdiI6InY3WUZzSm0rS2ZObFlpN3ZaR3lxY2c9PSIsInZhbHVlIjoiTmtnZFhiM2xMNmpxTkxhVmJZVHVDOWpsbHlIQWdCMndVdUVCaXNCd1NWYWJpRkU3OTN1UGFTWkd5OVAwTWl6R3MzQWZCbzdQeXg2YkdqcjRZV05qMHhadTg2VnZ1cTZpSDJRUFdEREp4TmM9IiwibWFjIjoiODQxYjViMDIyYWNlNzM0N2ZmZDhlMGU2Zjc5NWUzNzZlYjg2M2M4NjliYjg3MGY2YTAwNDlkZTY1NzliZDA2MCJ9; XSRF-TOKEN=eyJpdiI6Ikx4RlhGRDVaVXRsdjJ0K2NncVM5UGc9PSIsInZhbHVlIjoiTVNzRFlPbTZNbnRubUtyYXU5blgyQzh6UjYrRXdCSDFKRjNZdmthd0VKWlNPRnJMcHNQZjJFZTg3NjFVRmMyMCIsIm1hYyI6ImFlYjUxYzg3ODBiZDE1ZTU2OTliYzJiM2ZiMThhN2M3MmVhZTBlNGMyYmY4OTZlOWMwYjVhYzhiZThjYTQ4Y2IifQ%3D%3D; laravel_session=eyJpdiI6InlNdERhZURaU1dwRXVBMW1yRldXYXc9PSIsInZhbHVlIjoiZHFLTGp1S3JzR3ZOUkhQRkxOdjh1MlBEdkMrMStCZG04akxwM3p0eVF0b1plTDJZbGFtcjdYNjEweGxIb09GYyIsIm1hYyI6IjIzYmVkNmIwYjI3NzdmZjM2ZjcwM2RlMDZkZTFkNTk4NjUzNTAzYmIyZjRlZWEzZDk4Yjg0ZTA3NDg0M2Q4MGMifQ%3D%3D; laravel_session=eyJpdiI6ImVIQ0M0Y0ZCam8yNDhCRWw4VnpLXC9BPT0iLCJ2YWx1ZSI6InNcL01id1hpelUzVXVMbDVZcHdOQlREVStRWFZ1ckJtc0FUdnYzaVpNRWh3YW92ZGVcL0ljN1FGR0FZaGRzMUo0eCIsIm1hYyI6IjU2ODMwZjI4ZTIzMDNhMjQ3MWE2ZDg4NGMyMzM0MDJiMmE5NzYyYTRmNThmYmU0NmVhMjEzMTM1ZjhkZTdhNmQifQ%3D%3D; remember_web_59ba36addc2b2f9401580f014c7f58ea4e30989d=eyJpdiI6IlhUTWdvS1BPM0ZPeERFVTZ1M2pWSXc9PSIsInZhbHVlIjoiZUY4SUFEaCtvQ2ViWm4zc3liekd1a1FRU2RVcGpiTyt0ZE1iNFdjeDErSVFwXC9cL0pyaXhzMFwvakF1NXNHWE54c2xuRlNEbGdTN1l4MUNVUmdxQThWWEhyenliOXNBcnVSQkFndjd6RVZWN2M9IiwibWFjIjoiZTk2OWI4NTZiNzBjZGUxZTkxYjg1MzE1NWE5MDZmN2RhYzFmMGFjOWE0MDFlYzdiYzUzNjNmNGYzNzcxMGJhNCJ9'
//   );
//   myHeaders.append('Origin', 'http://9dbegins.com');
//   myHeaders.append('Referer', 'http://9dbegins.com/');
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
//   for (let i = 1; i <= 4; i++) {
//     const urlencoded = new URLSearchParams();
//     const username = `muabanhmy1212${i}`;
//     const email = `muabanhmy1212${i}@gmail.com`;
//     const password = `muabanhmy1212${i}`;
//     const passwordx = `muabanhmy1212${i}`;
//     urlencoded.append('_token', 'fjvI7zDbGjRveoJQ0DUh39VZF798VUeT8kz1BjM6');
//     urlencoded.append('u_name', username);
//     urlencoded.append('password', password);
//     urlencoded.append('password_confirmation', passwordx);
//     urlencoded.append('email', email);
//
//     const requestOptions = {
//       method: 'POST',
//       headers: myHeaders,
//       body: urlencoded,
//       redirect: 'follow'
//     };
//     fetch('http://9dbegins.com/register', requestOptions)
//       .then((response) => {
//         return response.text();
//       })
//       .then((result) => {
//         return console.log(result);
//       });
//     // eslint-disable-next-line no-await-in-loop
//     await sleep(50);
//   }
// }
