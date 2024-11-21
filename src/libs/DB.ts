// // import { createClient } from '@libsql/client';
// // import { drizzle } from 'drizzle-orm/libsql';
// //
// // import { Env } from './Env.mjs';
// //
// // const client = createClient({
// //   url: Env.DATABASE_URL,
// //   authToken: Env.DATABASE_AUTH_TOKEN
// // });
// //
// // export const db = drizzle(client);
// //
// // // Disable migrate function if using Edge runtime for local environment and use `drizzle-kit push` instead
// // // if (process.env.NODE_ENV !== 'production') {
// // //   await migrate(db, { migrationsFolder: './migrations' });
// // // }
//
// import { Env } from './Env.mjs';
//
// const prisma = new PrismaClient({
//   datasources: {
//     db: {
//       url: Env.DATABASE_URL
//       // authToken: Env.DATABASE_AUTH_TOKEN (Nếu bạn có sử dụng xác thực)
//     }
//   }
// });
//
// export const db = prisma;
