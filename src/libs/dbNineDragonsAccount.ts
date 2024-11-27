import { SignJWT } from 'jose';
import _, { isEmpty } from 'lodash';
import moment from 'moment';
import { ConnectionPool, TYPES } from 'mssql';
import { nanoid } from 'nanoid';

import { getJwtSecretKey } from '@/libs/auth';
import { Env } from '@/libs/Env.mjs';
import type { UserModel } from '@/models/UserModel';
import type { PromotionConfig } from '@/types/adminTypes';
import type { ITransaction } from '@/types/product';
import type { ITransactionDb, ITransactionMbbank } from '@/types/transaction';
import type { IAllUser, IUser } from '@/types/user';
import { calculateDiscount, comparePasswords, hashPasswords } from '@/utils/utils';

const dbConfig = {
  user: Env.DATABASE_USERNAME || '',
  password: Env.DATABASE_PASSWORD || '',
  server: Env.DATABASE_URL || '',
  database: 'NineDragons_Account' || '',
  options: {
    instancename: 'SQLEXPRESS',
    trustedconnection: true,
    trustServerCertificate: true,
    providerName: 'System.Data.SqlClient'
  },
  pool: {
    max: 100, // Số lượng kết nối tối đa trong pool
    min: 0, // Số lượng kết nối tối thiểu trong pool
    idleTimeoutMillis: 30000 // Thời gian tối đa mà một kết nối có thể ở trong pool mà không được sử dụng trước khi bị đóng (30 giây)
  }
};

class NineDragonsAccount {
  private static pool: ConnectionPool | null = null;

  public static async connect() {
    try {
      if (!this.pool) {
        this.pool = new ConnectionPool(dbConfig);
        await this.pool.connect();
      }
    } catch (error) {
      throw new Error('Failed to connect to the database');
    }
  }

  public static async close() {
    try {
      if (this.pool) {
        await this.pool.close();
        this.pool = null;
      }
    } catch (error) {
      throw new Error('Failed to close the database connection');
    }
  }

  public static async register(payload: IUser) {
    const {
      username,
      password,
      email,
      telephone,
      address,
      isActivate = 'false',
      createdby = 'web',
      fullname
    } = payload;
    // Xác thực người dùng
    const result = await this.getUserByUsername(username);
    if (!_.isEmpty(result)) {
      throw new Error('Tài khoản đã tồn tại!');
    } else {
      try {
        if (!this.pool || !this.pool.connected) {
          await this.connect();
          const query = `INSERT INTO dbo.[9d_users] (user_name, password, email, telephone, address, balance, isActivate, created_at, created_by, fullname) VALUES (@user_name, @password, @email, @telephone, @address, @balance, @isActivate, GETDATE(),@created_by, @fullname)`;

          const addTblPass = await this.addTblPass(username, password);
          if (addTblPass === 1) {
            const res = await this.pool!.request()
              .input('user_name', TYPES.NVarChar, username)
              .input('password', TYPES.NVarChar, hashPasswords(password))
              .input('email', TYPES.NVarChar, email)
              .input('telephone', TYPES.NVarChar, telephone)
              .input('address', TYPES.NVarChar, address)
              .input('balance', TYPES.Decimal, 0)
              .input('isActivate', TYPES.Bit, isActivate)
              .input('created_by', TYPES.NVarChar, createdby)
              .input('fullname', TYPES.NVarChar, fullname)
              .query(query);
            if (res.rowsAffected[0] === 1) {
              return { data: 'create successful' };
            }
          }
          return undefined;
        }
        const query = `INSERT INTO dbo.[9d_users] (user_name, password, email, telephone, address, balance, isActivate, created_at, created_by, fullname) VALUES (@user_name, @password, @email, @telephone, @address, @balance, @isActivate, GETDATE(),@created_by, @fullname)`;

        const addTblPass = await this.addTblPass(username, password);
        if (addTblPass === 1) {
          const res = await this.pool!.request()
            .input('user_name', TYPES.NVarChar, username)
            .input('password', TYPES.NVarChar, hashPasswords(password))
            .input('email', TYPES.NVarChar, email)
            .input('telephone', TYPES.NVarChar, telephone)
            .input('address', TYPES.NVarChar, address)
            .input('balance', TYPES.Decimal, 0)
            .input('isActivate', TYPES.Bit, isActivate)
            .input('created_by', TYPES.NVarChar, createdby)
            .input('fullname', TYPES.NVarChar, fullname)
            .query(query);
          if (res.rowsAffected[0] === 1) {
            return { data: 'create successful' };
          }
        }
        return undefined;
      } catch (error) {
        throw new Error('Tài khoản đã tồn tại!');
      }
    }
  }

  public static async login(username: string, password: string) {
    // Kiểm tra tính hợp lệ của username và password
    if (username.length < 6 || username.length > 50) {
      throw new Error('Tên người dùng phải có từ 4 đến 50 ký tự.');
    }
    if (password.length < 6 || password.length > 50) {
      throw new Error('Mật khẩu phải có từ 4 đến 50 ký tự.');
    }

    // Xác thực người dùng
    const result = await this.getUserByUsername(username);
    if (_.isEmpty(result)) {
      throw new Error('Tài khoản hoặc mật khẩu không đúng!');
    } else {
      const user: UserModel = result[0];
      const passwordMatch = comparePasswords(password, user.password); // So sánh mật khẩu
      if (!passwordMatch) {
        throw new Error('Tài khoản hoặc mật khẩu không đúng!');
      } else {
        const payload = {
          id: user.user_id,
          user_name: user.user_name,
          displayName: user.fullname,
          balance: user.balance,
          isActivate: user.isActivate,
          roles: 'USER'
        };

        const token = await new SignJWT(payload)
          .setProtectedHeader({ alg: 'HS256' })
          .setJti(nanoid())
          .setIssuedAt()
          .setExpirationTime('5h')
          .sign(new TextEncoder().encode(getJwtSecretKey()));

        return { accessToken: token, user: payload };
      }
    }
  }

  public static async loginAdmin(username: string, password: string) {
    if (username === 'super_admin' && password === Env.ADMIN_PASSWORD) {
      const payload = {
        id: 1,
        user_name: 'admin',
        displayName: 'Super Admin',
        roles: 'ADMIN'
      };

      const token = await new SignJWT(payload)
        .setProtectedHeader({ alg: 'HS256' })
        .setJti(nanoid())
        .setIssuedAt()
        .setExpirationTime('2h')
        .sign(new TextEncoder().encode(getJwtSecretKey()));

      return { accessToken: token, user: payload };
    }
    throw new Error('Sai thông tin');
  }

  public static async getNewsHome() {
    try {
      if (!this.pool || !this.pool.connected) {
        await this.connect();
        const query = `SELECT TOP 15 news_id, news_title, type, created_at, news_images, news_descriptions FROM dbo.[9d_news] WHERE delete_flag = 0 ORDER BY created_at DESC;`;

        const result = await this.pool!.request().query(query);
        if (!_.isEmpty(result.recordset)) {
          // Chuyển đổi cột created_at thành timestamp
          result.recordset.forEach((record) => {
            const timestamp = record.created_at; // Số giây kể từ Unix Epoch
            // Định dạng timestamp thành ngày tháng năm
            record.created_at = moment(timestamp).format('DD/MM/YYYY HH:mm:ss');
          });
          return result.recordset;
        }
        return [];
      }
      const query = `SELECT TOP 15 news_id, news_title, type, created_at, news_images, news_descriptions FROM dbo.[9d_news] WHERE delete_flag = 0 ORDER BY created_at DESC;`;
      const result = await this.pool!.request().query(query);
      if (!_.isEmpty(result.recordset)) {
        // Chuyển đổi cột created_at thành timestamp
        result.recordset.forEach((record) => {
          const timestamp = record.created_at; // Số giây kể từ Unix Epoch
          // Định dạng timestamp thành ngày tháng năm
          record.created_at = moment(timestamp).format('DD/MM/YYYY HH:mm:ss');
        });
        return result.recordset;
      }
      return [];
    } catch (error) {
      throw new Error('An internal server error occurred');
    }
  }

  public static async getNewsById(id: number) {
    try {
      if (!this.pool || !this.pool.connected) {
        await this.connect();
        const querry = 'SELECT * FROM dbo.[9d_news] WHERE news_id = @id';
        const result = await this.pool!.request().input('id', TYPES.VarChar, id).query(querry);
        return result.recordset || null;
      }
      const querry = 'SELECT * FROM dbo.[9d_news] WHERE news_id = @id';
      const result = await this.pool!.request().input('id', TYPES.VarChar, id).query(querry);
      return result.recordset || null;
    } catch (error) {
      throw new Error('An internal server error occurred');
    }
  }

  public static async getUserByUsername(username: string) {
    try {
      if (!this.pool || !this.pool.connected) {
        await this.connect();
        const querry = 'SELECT * FROM dbo.[9d_users] WHERE user_name = @username';
        const result = await this.pool!.request()
          .input('username', TYPES.VarChar, username)
          .query(querry);
        return result.recordset || null;
      }
      const querry = 'SELECT * FROM dbo.[9d_users] WHERE user_name = @username';
      const result = await this.pool!.request()
        .input('username', TYPES.VarChar, username)
        .query(querry);
      return result.recordset || null;
    } catch (error) {
      throw new Error('An internal server error occurred');
    }
  }

  public static async getUserByUserId(userid: number) {
    try {
      if (!this.pool || !this.pool.connected) {
        await this.connect();
        const querry = 'SELECT * FROM dbo.[9d_users] WHERE user_id = @userid';
        const result = await this.pool!.request()
          .input('userid', TYPES.VarChar, userid)
          .query(querry);
        return result.recordset || null;
      }
      const querry = 'SELECT * FROM dbo.[9d_users] WHERE user_id = @userid';
      const result = await this.pool!.request()
        .input('userid', TYPES.VarChar, userid)
        .query(querry);
      return result.recordset || null;
    } catch (error) {
      throw new Error('An internal server error occurred');
    }
  }

  public static async checkUserExistByEmail(email: string) {
    try {
      const query = 'SELECT TOP 1 1 FROM dbo.[9d_users] WHERE email = @email';

      if (!this.pool || !this.pool.connected) {
        await this.connect();
        const result = await this.pool!.request().input('email', TYPES.VarChar, email).query(query);
        return result?.rowsAffected?.[0] === 1 || false;
      }
      const result = await this.pool!.request().input('email', TYPES.VarChar, email).query(query);
      return result?.rowsAffected?.[0] === 1 || false;
    } catch (error) {
      throw new Error('An internal server error occurred');
    }
  }

  public static async checkUserExistByPhone(telephone: string) {
    try {
      const query = 'SELECT TOP 1 1 FROM dbo.[9d_users] WHERE telephone = @telephone';

      if (!this.pool || !this.pool.connected) {
        await this.connect();
        const result = await this.pool!.request()
          .input('telephone', TYPES.VarChar, telephone)
          .query(query);
        return result?.rowsAffected?.[0] === 1 || false;
      }
      const result = await this.pool!.request()
        .input('telephone', TYPES.VarChar, telephone)
        .query(query);
      return result?.rowsAffected?.[0] === 1 || false;
    } catch (error) {
      throw new Error('An internal server error occurred');
    }
  }

  public static async getUserInfoByUsername(username: string) {
    try {
      if (!this.pool || !this.pool.connected) {
        await this.connect();
        const querry =
          'SELECT user_id, user_name, email, telephone,address,balance,isActivate,created_at, fullname FROM dbo.[9d_users] WHERE user_name = @username;';
        const result = await this.pool!.request()
          .input('username', TYPES.VarChar, username)
          .query(querry);
        return result.recordset[0] || null;
      }
      const querry =
        'SELECT user_id, user_name, email, telephone,address,balance,isActivate,created_at, fullname FROM dbo.[9d_users] WHERE user_name = @username;';
      const result = await this.pool!.request()
        .input('username', TYPES.VarChar, username)
        .query(querry);
      return result.recordset[0] || null;
    } catch (error) {
      throw new Error('An internal server error occurred');
    }
  }

  public static async addTblPass(username: string, password: string) {
    try {
      if (!this.pool || !this.pool.connected) {
        await this.connect();
        const queryTblPass = `INSERT INTO dbo.[Tbl_Member_Password] (userid, userpassword) VALUES (@userid, @userpassword)`;
        const addTblPass = await this.pool!.request()
          .input('userid', TYPES.NVarChar, username)
          .input('userpassword', TYPES.NVarChar, hashPasswords(password))
          .query(queryTblPass);
        return addTblPass.rowsAffected[0] || null;
      }
      const queryTblPass = `INSERT INTO dbo.[Tbl_Member_Password] (userid, userpassword) VALUES (@userid, @userpassword)`;
      const addTblPass = await this.pool!.request()
        .input('userid', TYPES.NVarChar, username)
        .input('userpassword', TYPES.NVarChar, hashPasswords(password))
        .query(queryTblPass);
      return addTblPass.rowsAffected[0] || null;
    } catch (error) {
      throw new Error('Tài khoản đã tồn tại!');
    }
  }

  public static async updateTblPass(username: string, password: string) {
    try {
      if (!this.pool || !this.pool.connected) {
        await this.connect();
      }
      const queryUpdateTblPass = `UPDATE dbo.[Tbl_Member_Password] SET userpassword = @userpassword WHERE userid = @userid`;
      const updateTblPass = await this.pool!.request()
        .input('userid', TYPES.NVarChar, username)
        .input('userpassword', TYPES.NVarChar, hashPasswords(password))
        .query(queryUpdateTblPass);

      return updateTblPass.rowsAffected[0] || null;
    } catch (error) {
      throw new Error('Lỗi khi cập nhật mật khẩu!');
    }
  }

  public static async addBalance(username: string, balance: number) {
    try {
      if (!this.pool || !this.pool.connected) {
        await this.connect();
        const request = await this.pool!.request()
          .input('username', TYPES.NVarChar(60), username)
          .input('balance', TYPES.Int, balance)
          .execute('AddBalance');
        return request.rowsAffected || null;
      }
      const request = await this.pool!.request()
        .input('username', TYPES.NVarChar(60), username)
        .input('balance', TYPES.Int, balance)
        .execute('AddBalance');
      return request.rowsAffected || null;
    } catch (error) {
      throw new Error('An internal server error occurred');
    }
  }

  public static async subtractBalance(username: string, balance: number) {
    try {
      if (!this.pool || !this.pool.connected) {
        await this.connect();
      }
      const query = 'UPDATE dbo.[9d_users] SET balance=balance-@balance where user_name=@username';
      const result = await this.pool!.request()
        .input('username', TYPES.NVarChar(60), username)
        .input('balance', TYPES.Int, balance)
        .query(query);
      if (result) {
        return result.rowsAffected[0] === 1 || null;
      }
      return null;
    } catch (error) {
      throw new Error('Lỗi kết nối dữ liệu vui lòng thử lại sau');
    }
  }

  public static async addTransHistory(payload: ITransaction) {
    try {
      if (!this.pool || !this.pool.connected) {
        await this.connect();
        const query =
          'INSERT INTO dbo.[9d_history_store] (item_name, item_price, item_image, user_name, date_time) VALUES (@item_name, @item_price, @item_image, @user_name, GETDATE())';
        const result = await this.pool!.request()
          .input('item_name', TYPES.NVarChar(255), payload.itemName)
          .input('item_price', TYPES.Money, payload.itemPrice)
          .input('item_image', TYPES.NVarChar(255), payload.itemImage)
          .input('user_name', TYPES.NVarChar(60), payload.userName)
          .query(query);

        return result.recordset || null;
      }
      const query =
        'INSERT INTO dbo.[9d_history_store] (item_name, item_price, item_image, user_name, date_time) VALUES (@item_name, @item_price, @item_image, @user_name, GETDATE())';
      const result = await this.pool!.request()
        .input('item_name', TYPES.NVarChar(255), payload.itemName)
        .input('item_price', TYPES.Money, payload.itemPrice)
        .input('item_image', TYPES.NVarChar(255), payload.itemImage)
        .input('user_name', TYPES.NVarChar(60), payload.userName)
        .query(query);

      return result.recordset || null;
    } catch (error) {
      throw new Error('An internal server error occurred');
    }
  }

  public static async getTransactionBank() {
    try {
      const query = `
        DECLARE @TableExists BIT = 0;
        IF OBJECT_ID('dbo.[9d_transaction_bank]', 'U') IS NOT NULL
      BEGIN
      SET @TableExists = 1;
      END
      IF @TableExists = 0
      BEGIN
      CREATE TABLE dbo.[9d_transaction_bank] (
          transaction_id INT PRIMARY KEY IDENTITY(1, 1),
          user_id INT NOT NULL,
          transaction_bank_id NVARCHAR(100) NOT NULL,
          transaction_time NVARCHAR(100) NOT NULL,
          transaction_description NVARCHAR(255) NOT NULL,
          transaction_code NVARCHAR(20) NOT NULL,
          amount INT NOT NULL,
          status NVARCHAR(20) NOT NULL,
          discount_percentage INT NOT NULL,
          trans_type NVARCHAR(20) NOT NULL,
          create_at DATETIME DEFAULT GETDATE()
          );
      END
      SELECT * FROM dbo.[9d_transaction_bank];`;
      if (!this.pool || !this.pool.connected) {
        await this.connect();

        const result = await this.pool!.request().query(query);
        const transaction: ITransactionDb[] = result.recordset;
        return transaction || [];
      }
      const result = await this.pool!.request().query(query);
      const transaction: ITransactionDb[] = result.recordset;
      return transaction || [];
    } catch (error) {
      throw new Error('An internal server error occurred');
    }
  }

  public static async getAllUser() {
    try {
      if (!this.pool || !this.pool.connected) {
        await this.connect();
        const querry = 'SELECT * FROM dbo.[9d_users]';
        const result = await this.pool!.request().query(querry);
        const allUsers: IAllUser[] = result.recordset;
        return allUsers || [];
      }
      const querry = 'SELECT * FROM dbo.[9d_users]';
      const result = await this.pool!.request().query(querry);
      const allUsers: IAllUser[] = result.recordset;
      return allUsers || [];
    } catch (error) {
      throw new Error('An internal server error occurred');
    }
  }

  public static async addMultipleBalances(
    userList: IAllUser[],
    mergedArray: ITransactionMbbank[],
    promotion?: any
  ) {
    try {
      if (!this.pool || !this.pool.connected) {
        await this.connect();
        const logArr: any[] = [];
        const promises = mergedArray.map(async (record: ITransactionMbbank) => {
          const code = Number(record.description);
          const user = userList.find((some: any) => code === some.user_id);

          if (user) {
            if (!this.pool) {
              throw new Error('Database connection has not been established');
            }
            const originalAmount = Number(record.amount);
            const isDiscount =
              originalAmount >= Number(promotion?.min_amount || 0) &&
              originalAmount <= Number(promotion?.max_amount || 0);
            const discount = Number(promotion?.discount_percentage || 0);
            const amountCalculated = isDiscount
              ? originalAmount + originalAmount * (discount / 100)
              : originalAmount;

            const request = await this.pool
              .request()
              .input('username', TYPES.NVarChar(60), user.user_name)
              .input('balance', TYPES.Int, Number(amountCalculated || 0))
              .execute('AddBalance');
            logArr.push(
              `Added balance for ${user.user_name} balance:${record.amount}, rows affected: ${request.rowsAffected} `
            );
            return { username: user.user_name, rowsAffected: request.rowsAffected };
          }

          return null;
        });

        const results = await Promise.all(promises);

        return { logArr, ...results };
      }
      const logArr: any[] = [];
      const promises = mergedArray.map(async (record: ITransactionMbbank) => {
        const code = Number(record.description);
        const user = userList.find((some: any) => code === some.user_id);

        if (user) {
          if (!this.pool) {
            throw new Error('Database connection has not been established');
          }
          const originalAmount = Number(record.amount);
          const isDiscount =
            originalAmount >= Number(promotion?.min_amount || 0) &&
            originalAmount <= Number(promotion?.max_amount || 0);
          const discount = Number(promotion?.discount_percentage || 0);
          const amountCalculated = isDiscount
            ? originalAmount + originalAmount * (discount / 100)
            : originalAmount;

          const request = await this.pool
            .request()
            .input('username', TYPES.NVarChar(60), user.user_name)
            .input('balance', TYPES.Int, Number(amountCalculated || 0))
            .execute('AddBalance');
          logArr.push(
            `Added balance for ${user.user_name} balance:${record.amount}, rows affected: ${request.rowsAffected} `
          );
          return { username: user.user_name, rowsAffected: request.rowsAffected };
        }

        return null;
      });

      const results = await Promise.all(promises);

      return { logArr, ...results };
    } catch (error) {
      throw new Error('An internal server error occurred');
    }
  }

  public static async addMultipleTransactionBank(payload: ITransactionMbbank[], promotion?: any) {
    try {
      const query = `DECLARE @TableExists BIT = 0;
        IF OBJECT_ID('dbo.[9d_transaction_bank]', 'U') IS NOT NULL
        BEGIN
        SET @TableExists = 1;
        END

        IF @TableExists = 0
        BEGIN
        CREATE TABLE dbo.[9d_transaction_bank] (
        transaction_id INT PRIMARY KEY IDENTITY(1, 1),
        user_id INT NOT NULL,
        transaction_bank_id NVARCHAR(100) NOT NULL,
        transaction_time NVARCHAR(100) NOT NULL,
        transaction_description NVARCHAR(255) NOT NULL,
        transaction_code NVARCHAR(20) NOT NULL,
        amount INT NOT NULL,
        status NVARCHAR(20) NOT NULL,
        discount_percentage INT NOT NULL,
        trans_type NVARCHAR(20) NOT NULL,
        create_at DATETIME DEFAULT GETDATE()
        );

        INSERT INTO dbo.[9d_transaction_bank] (
        user_id,
        transaction_bank_id,
        transaction_time,
        transaction_description,
        transaction_code,
        amount,
        status,
        discount_percentage,
        trans_type,
        create_at
        )
        VALUES (
        @user_id,
        @transaction_bank_id,
        @transaction_time,
        @transaction_description,
        @transaction_code,
        @amount,
        @status,
        @discount_percentage,
        @trans_type,
        GETDATE()
        );
        END
        ELSE
        BEGIN
        INSERT INTO dbo.[9d_transaction_bank] (
        user_id,
        transaction_bank_id,
        transaction_time,
        transaction_description,
        transaction_code,
        amount,
        status,
        discount_percentage,
        trans_type,
        create_at
        )
        VALUES (
        @user_id,
        @transaction_bank_id,
        @transaction_time,
        @transaction_description,
        @transaction_code,
        @amount,
        @status,
        @discount_percentage,
        @trans_type,
        GETDATE()
        );
      END`;

      if (!this.pool || !this.pool.connected) {
        await this.connect();
        const promises = payload.map(async (record: ITransactionMbbank) => {
          const originalAmount = Number(record.amount);
          const isDiscount =
            originalAmount >= Number(promotion?.min_amount || 0) &&
            originalAmount <= Number(promotion?.max_amount || 0);
          const discount = Number(promotion?.discount_percentage || 0);
          const amountCalculated = isDiscount
            ? originalAmount + originalAmount * (discount / 100)
            : originalAmount;

          const result = await this.pool!.request()
            .input('transaction_bank_id', TYPES.NVarChar(100), record.transactionID)
            .input('transaction_time', TYPES.NVarChar, record.transactionDate)
            .input(
              'transaction_description',
              TYPES.NVarChar(255),
              `NAP9D${record.description}CONHAN`
            )
            .input('transaction_code', TYPES.NVarChar(20), record.description)
            .input('amount', TYPES.Int, Number(amountCalculated || 0))
            .input('status', TYPES.NVarChar(20), 'success')
            .input('user_id', TYPES.Int, Number(record.description))
            .input('discount_percentage', TYPES.Int, Number(discount))
            .input('trans_type', TYPES.NVarChar(20), 'BANK')
            .query(query);
          const logData = `Added transaction for ${record.description} balance:${record.amount},transaction_bank_id:${record.transactionID} rows affected: ${result.rowsAffected} `;
          if (result.rowsAffected) {
            return { logData, rowsAffected: result.rowsAffected };
          }
          return null;
        });

        return await Promise.all(promises);
      }

      const promises = payload.map(async (record: ITransactionMbbank) => {
        const originalAmount = Number(record.amount);
        const isDiscount =
          originalAmount >= Number(promotion?.min_amount || 0) &&
          originalAmount <= Number(promotion?.max_amount || 0);
        const discount = Number(promotion?.discount_percentage || 0);
        const amountCalculated = isDiscount
          ? originalAmount + originalAmount * (discount / 100)
          : originalAmount;
        const result = await this.pool!.request()
          .input('transaction_bank_id', TYPES.NVarChar(100), record.transactionID)
          .input('transaction_time', TYPES.NVarChar, record.transactionDate)
          .input('transaction_description', TYPES.NVarChar(255), `NAP9D${record.description}CONHAN`)
          .input('transaction_code', TYPES.NVarChar(20), record.description)
          .input('amount', TYPES.Int, Number(amountCalculated || 0))
          .input('status', TYPES.NVarChar(20), 'success')
          .input('user_id', TYPES.Int, Number(record.description))
          .input('discount_percentage', TYPES.Int, Number(discount))
          .input('trans_type', TYPES.NVarChar(20), 'BANK')
          .query(query);
        const logData = `Added transaction for ${record.description} balance:${record.amount},transaction_bank_id:${record.transactionID} rows affected: ${result.rowsAffected} `;
        if (result.rowsAffected) {
          return { logData, rowsAffected: result.rowsAffected };
        }
        return null;
      });

      return await Promise.all(promises);
    } catch (error) {
      throw new Error('An internal server error occurred');
    }
  }

  public static async getTransactionBankById(id: number) {
    try {
      if (!this.pool || !this.pool.connected) {
        await this.connect();
        const querry =
          'SELECT * FROM dbo.[9d_transaction_bank] WHERE user_id = @id ORDER BY create_at DESC;';
        const result = await this.pool!.request()
          .input('id', TYPES.VarChar, String(id))
          .query(querry);
        return result.recordset || [];
      }
      const querry =
        'SELECT * FROM dbo.[9d_transaction_bank] WHERE user_id = @id ORDER BY create_at DESC;';
      const result = await this.pool!.request()
        .input('id', TYPES.VarChar, String(id))
        .query(querry);
      return result.recordset || [];
    } catch (error) {
      throw new Error('An internal server error occurred');
    }
  }

  public static async userChangePassword(payload: any) {
    const { username, password, oldPassword } = payload;

    if (!this.pool || !this.pool.connected) {
      await this.connect();
    }
    // Xác thực người dùng
    const result = await this.getUserByUsername(username);
    const hasOldPass = hashPasswords(oldPassword);

    if (!_.isEmpty(result) && hasOldPass === result[0]?.password) {
      try {
        const query = `UPDATE dbo.[9d_users] SET password = @password WHERE user_name = @user_name`;
        const addTblPass = await this.updateTblPass(username, password);
        if (addTblPass === 1) {
          const updatePassword = await this.pool!.request()
            .input('user_name', TYPES.NVarChar, username)
            .input('password', TYPES.NVarChar, hashPasswords(password))
            .query(query);

          if (updatePassword.rowsAffected[0] === 1) {
            return { data: 'update successful' };
          }
        }
        return undefined;
      } catch (error) {
        throw new Error('Lỗi đổi mật khẩu!');
      }
    } else {
      throw new Error('Mật khẩu cũ không đúng');
    }
  }

  public static async checkOnline(user: string) {
    try {
      if (!this.pool || !this.pool.connected) {
        await this.connect();
      }
      const querry = `SELECT * from dbo.Tbl_ND_GameConnect where member_id = @user`;
      const result = await this.pool!.request()
        .input('user', TYPES.VarChar, String(user))
        .query(querry);

      if (result && !isEmpty(result.recordset)) {
        return result?.recordset[0];
      }
      return null;
    } catch (error) {
      throw new Error('có lỗi kết nối dữ liệu, vui lòng thử lại sau!');
    }
  }

  public static async getTimeBlockUser(user: string) {
    try {
      if (!this.pool || !this.pool.connected) {
        await this.connect();
      }
      const querry = `SELECT TOP 1 FROM dbo.UserBlockedTime WHERE username = @user`;
      const result = await this.pool!.request()
        .input('user', TYPES.VarChar, String(user))
        .query(querry);

      if (result && !isEmpty(result.recordset)) {
        return result?.recordset[0];
      }
      return null;
    } catch (error) {
      throw new Error('có lỗi kết nối dữ liệu, vui lòng thử lại sau!');
    }
  }

  public static async blockUser(payload: any) {
    try {
      if (!this.pool || !this.pool.connected) {
        await this.connect();
      }

      const { user, memberGuid, causeContent } = payload;
      const query = `
      DECLARE @memberId NVARCHAR(255) = @user;
      DECLARE @currentDate DATETIME = GETDATE();
      DECLARE @failMessage NVARCHAR(50) = 'fail';

      -- Kiểm tra nếu release_date lớn hơn 15 phút so với thời điểm hiện tại và memberId = @memberId
      IF EXISTS (
          SELECT 1
          FROM dbo.Tbl_Blocking
          WHERE DATEDIFF(DAY, release_date, @currentDate) > 1
          AND member_id = @memberId
      )
      BEGIN
          SELECT @failMessage AS result;
      END
      ELSE
      BEGIN
          -- Kiểm tra xem member_name đã tồn tại trong bảng hay chưa
          IF EXISTS (
              SELECT 1
              FROM dbo.Tbl_Blocking
              WHERE member_id = @memberId
          )
          BEGIN
              -- Nếu đã tồn tại, cập nhật release_date và cause_content
              UPDATE dbo.Tbl_Blocking
              SET release_date = DATEADD(MINUTE, 15, @currentDate),  -- Thêm 15 phút vào thời gian hiện tại
                  casue_content = @causeContent
              WHERE member_id = @memberId
              SELECT 'update' AS result;  -- Trả về thông báo update thành công
          END
          ELSE
          BEGIN
              -- Nếu chưa tồn tại, thêm mới bản ghi với release_date là thời gian hiện tại cộng thêm 15 phút
              INSERT INTO dbo.Tbl_Blocking (member_guid, member_id, member_name, block_code, casue_content, regdate, release_date, state_code)
              VALUES (@memberGuid, @memberId, 'NexonName', '10', @causeContent, @currentDate, DATEADD(MINUTE, 15, @currentDate), '0');
              SELECT 'insert' AS result;  -- Trả về thông báo insert thành công
          END
      END
    `;

      const result = await this.pool!.request()
        .input('user', TYPES.VarChar, String(user))
        .input('memberGuid', TYPES.VarChar, String(memberGuid))
        .input('causeContent', TYPES.VarChar, String(causeContent))
        .query(query);

      if (result && !isEmpty(result.recordset)) {
        const queryResult = result.recordset[0].result;
        return queryResult === 'update' || queryResult === 'insert';
      }

      return null;
    } catch (error) {
      throw new Error('có lỗi kết nối dữ liệu, vui lòng thử lại sau!');
    }
  }

  public static async unlockUser(user: string) {
    try {
      if (!this.pool || !this.pool.connected) {
        await this.connect();
      }
      const querry = `BEGIN
            UPDATE dbo.Tbl_ND_Member_Login SET member_class = 0 WHERE member_id = @user;
            IF EXISTS(SELECT * FROM dbo.UserBlockedTime WHERE username = @user)
            BEGIN
            DELETE FROM dbo.UserBlockedTime WHERE username = @user;
            END
            END`;
      const result = await this.pool!.request()
        .input('user', TYPES.VarChar, String(user))
        .query(querry);

      if (result) {
        return result.rowsAffected[0] === 1;
      }
      return null;
    } catch (error) {
      throw new Error('có lỗi kết nối dữ liệu, vui lòng thử lại sau!');
    }
  }

  public static async createAndUpdatePromotionConfigV1(config: PromotionConfig) {
    try {
      if (!this.pool || !this.pool.connected) {
        await this.connect();
      }
      const query = `
        DECLARE @TableExists BIT = 0, @HasRecords BIT = 0;

        -- Kiểm tra bảng tồn tại
        IF OBJECT_ID('dbo.promotion_config', 'U') IS NOT NULL
        BEGIN
            SET @TableExists = 1;
        END

        -- Nếu bảng chưa tồn tại, tạo bảng và thêm bản ghi mới
        IF @TableExists = 0
        BEGIN
            CREATE TABLE dbo.promotion_config (
                id INT PRIMARY KEY IDENTITY(1,1),
                min_amount INT NOT NULL,
                max_amount INT NOT NULL,
                discount_percentage INT NOT NULL,
                start_date BIGINT NOT NULL, 
                end_date BIGINT NOT NULL,
                is_active BIT NOT NULL,
                create_at DATETIME2 DEFAULT GETDATE(),
                update_at DATETIME2 DEFAULT GETDATE()
            );
            INSERT INTO dbo.promotion_config (min_amount, max_amount, discount_percentage, start_date, end_date, is_active)
            VALUES (@minAmount, @maxAmount, @discountPercentage, @startDate, @endDate, @isActive);
        END
        ELSE
        BEGIN
            -- Kiểm tra xem bảng có bản ghi nào không
            SELECT TOP 1 @HasRecords = 1 FROM dbo.promotion_config;

            -- Nếu có bản ghi, thực hiện UPDATE
            IF @HasRecords = 1
            BEGIN
                UPDATE dbo.promotion_config
                SET
                    min_amount = @minAmount,
                    max_amount = @maxAmount,
                    discount_percentage = @discountPercentage,
                    start_date = @startDate,
                    end_date = @endDate,
                    is_active = @isActive,
                    update_at = GETDATE();
            END
            ELSE
            BEGIN
                -- Nếu không có bản ghi, thực hiện INSERT
                INSERT INTO dbo.promotion_config (min_amount, max_amount, discount_percentage, start_date, end_date, is_active)
                VALUES (@minAmount, @maxAmount, @discountPercentage, @startDate, @endDate, @isActive);
            END
        END`;

      const result: any = await this.pool!.request()
        .input('minAmount', TYPES.Decimal, config.minAmount)
        .input('maxAmount', TYPES.Decimal, config.maxAmount)
        .input('discountPercentage', TYPES.Decimal, config.discountPercentage)
        .input('startDate', TYPES.BigInt, config.startDate)
        .input('endDate', TYPES.BigInt, config.endDate)
        .input('isActive', TYPES.Bit, 1)
        .query(query);

      if (result && result?.rowsAffected) {
        return result?.rowsAffected[0] > 0;
      }
      return null;
    } catch (error) {
      throw new Error('An internal server error occurred');
    }
  }

  public static async getFirstPromotionConfig(): Promise<any> {
    try {
      if (!this.pool || !this.pool.connected) {
        await this.connect();
      }
      const query = `
    DECLARE @CurrentTimestamp BIGINT = DATEDIFF_BIG(MILLISECOND, '1970-01-01', GETUTCDATE());
    IF OBJECT_ID('dbo.promotion_config', 'U') IS NOT NULL
    BEGIN
    SELECT TOP 1 *
    FROM dbo.promotion_config
    WHERE 
        (@CurrentTimestamp >= start_date) AND
        (@CurrentTimestamp <= end_date) AND
        (is_active = 1)
    ORDER BY create_at DESC;
    END
    ELSE
    BEGIN
    SELECT NULL AS id;
    END;`;
      const result: any = await this.pool!.query(query);
      if (result && result?.recordset?.length > 0) {
        const recordset = result.recordset[0];
        console.log('recordset', recordset);

        // Tính toán và trả về giá trị dựa trên bản ghi tìm được
        return calculateDiscount(recordset);
      }
      return null;
    } catch (error) {
      throw new Error('An internal server error occurred');
    }
  }
}

export default NineDragonsAccount;
