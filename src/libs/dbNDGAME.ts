import { isEmpty } from 'lodash';
import { ConnectionPool, TYPES } from 'mssql';

import { Env } from '@/libs/Env.mjs';

const dbConfig = {
  user: Env.DATABASE_USERNAME || '',
  password: Env.DATABASE_PASSWORD || '',
  server: Env.DATABASE_URL || '',
  database: 'ND_GAME_0' || '',
  options: {
    instancename: 'SQLEXPRESS',
    trustedconnection: true,
    trustServerCertificate: true,
    providerName: 'System.Data.SqlClient',
    encrypt: false
  }
};

class Database {
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

  public static async getRankInfo() {
    try {
      if (!this.pool || !this.pool.connected) {
        await this.connect();
      }
      const querry =
        'SELECT * FROM dbo.VIEW_RANK_INFO ORDER BY inner_level DESC, level_rate DESC , levelup_time ASC';
      const result = await this.pool!.request().query(querry);
      return result.recordset;
    } catch (error) {
      throw new Error('An internal server error occurred');
    }
  }

  public static async getCharacterInfoByUser(user: string) {
    try {
      if (!this.pool || !this.pool.connected) {
        await this.connect();
      }
      const querry = `SELECT A.unique_id, A.user_id, A.chr_name, B.inner_level
            FROM dbo.ND_V01_Charac A
            INNER JOIN dbo.ND_V01_CharacState B
            ON A.unique_id = B.unique_id
            WHERE user_id =@user AND A.delete_flag = 0`;
      const result = await this.pool!.request()
        .input('user', TYPES.VarChar, String(user))
        .query(querry);
      if (result && !isEmpty(result.recordset)) {
        return result.recordset || null;
      }
      return [];
    } catch (error) {
      throw new Error('An internal server error occurred');
    }
  }

  public static async updateCharacterById(id: string, name: string) {
    try {
      if (!this.pool || !this.pool.connected) {
        await this.connect();
      }
      const querry = `UPDATE dbo.ND_V01_Charac
       SET chr_name = @name
       WHERE unique_id = @id
       `;

      const result = await this.pool!.request()
        .input('name', TYPES.NVarChar, String(name))
        .input('id', TYPES.NVarChar, String(id))
        .query(querry);
      if (result) {
        return result.rowsAffected[0] === 1;
      }
      return null;
    } catch (error) {
      throw new Error('An internal server error occurred');
    }
  }

  public static async checkCharacterExists(name: string) {
    try {
      if (!this.pool || !this.pool.connected) {
        await this.connect();
      }

      const querry = `SELECT TOP 1 * FROM dbo.ND_V01_Charac WHERE chr_name = @name`;

      const result = await this.pool!.request()
        .input('name', TYPES.NVarChar, String(name))
        .query(querry);
      if (result && !isEmpty(result.recordset)) {
        return result.recordset.length > 0 || false;
      }
      return false;
    } catch (error) {
      throw new Error('An internal server error occurred');
    }
  }
}

export default Database;
