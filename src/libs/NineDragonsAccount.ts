import _, { isEmpty } from 'lodash';
import moment from 'moment/moment';
import { ConnectionPool, TYPES } from 'mssql';

import { Env } from '@/libs/Env.mjs';
import type {
  EventRewards,
  IGuideWeb,
  IItemEventRewards,
  PromotionConfig
} from '@/types/adminTypes';
import type { NewsData } from '@/types/newsTypes';

interface PoolConfig {
  user: string;
  password: string;
  server: string;
  database: string;
  options: {
    instancename: string;
    encrypt?: boolean;
    trustedconnection: boolean;
    trustServerCertificate: boolean;
    providerName: string;
  };
  pool: {
    max: number;
    min: number;
    idleTimeoutMillis: number;
  };
}

const dbConfig: PoolConfig = {
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

export async function connectAndExecute(queryFunction: (pool: ConnectionPool) => Promise<void>) {
  let pool: ConnectionPool | undefined;
  try {
    pool = await new ConnectionPool(dbConfig).connect();
    await queryFunction(pool);
  } catch (error) {
    throw new Error('Failed to connect to the database', error.message);
  } finally {
    if (pool) {
      await pool.close();
    }
  }
}

export async function getProduct(pool: ConnectionPool) {
  try {
    const querry =
      "SELECT id,itemid,itemname,itemimages,itemprice,itemdescription FROM dbo.[9d_KTCItems] WHERE delete_flag ='0' ORDER BY updated_at DESC;";
    const result = await pool.request().query(querry);
    return result.recordset || null;
  } catch (error) {
    throw new Error('An internal server error occurred');
  }
}

export async function getUserInfoByUsername(pool: ConnectionPool, username: string) {
  try {
    const querry =
      'SELECT user_id, user_name, email, telephone,address,balance,isActivate,created_at, fullname FROM dbo.[9d_users] WHERE user_name = @username;';
    const result = await pool.request().input('username', TYPES.VarChar, username).query(querry);
    return result.recordset[0] || null;
  } catch (error) {
    throw new Error('An internal server error occurred');
  }
}

export async function addNews(pool: ConnectionPool, news: NewsData) {
  try {
    const { newsTitle, newsAscii, newsImages, newsType, newsDescriptions, newsContent } = news;
    const query = `INSERT INTO dbo.[9d_news] (news_title, news_ascii, news_images, type, news_descriptions, news_content, created_at, created_by, delete_flag) VALUES (@news_title, @news_ascii, @news_images, @type, @news_descriptions, @news_content, GETDATE(), @created_by, @delete_flag)`;
    const result = await pool
      .request()
      .input('news_title', TYPES.NVarChar, newsTitle)
      .input('news_ascii', TYPES.NVarChar, newsAscii)
      .input('news_images', TYPES.NVarChar, newsImages)
      .input('type', TYPES.Int, newsType)
      .input('news_descriptions', TYPES.NVarChar, newsDescriptions)
      .input('news_content', TYPES.NVarChar, newsContent)
      .input('created_by', TYPES.NVarChar, 'Admin')
      .input('delete_flag', TYPES.NVarChar, '0')
      .query(query);

    if (result.rowsAffected[0] === 1) {
      return { data: 'create successful' };
    }

    return null;
  } catch (error) {
    throw new Error('An internal server error occurred');
  }
}

export async function getNewsById(pool: ConnectionPool, id: string) {
  try {
    const querry = 'SELECT * FROM dbo.[9d_news] WHERE news_id = @id';
    const result = await pool.request().input('id', TYPES.VarChar, id).query(querry);
    if (result && result.recordset) {
      const news: any = result.recordset[0];
      return { ...news, created_at: news?.created_at.toISOString() };
    }
    return null;
  } catch (error) {
    throw new Error('An internal server error occurred');
  }
}

export async function getNewsFull(pool: ConnectionPool) {
  try {
    const querry = 'SELECT * FROM dbo.[9d_news] ORDER BY created_at DESC;';
    const result = await pool.request().query(querry);
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

export async function updateNewsById(pool: ConnectionPool, news: NewsData) {
  try {
    const { newsId, newsTitle, newsAscii, newsImages, newsType, newsDescriptions, newsContent } =
      news;
    const query = `
      UPDATE dbo.[9d_news]
      SET
        news_title = @news_title,
        news_ascii = @news_ascii,
        news_images = @news_images,
        type = @type,
        news_descriptions = @news_descriptions,
        news_content = @news_content,
        updated_at = GETDATE(),
        updated_by = @updated_by
      WHERE news_id = @news_id;
    `;
    const result = await pool
      .request()
      .input('news_title', TYPES.NVarChar, newsTitle)
      .input('news_ascii', TYPES.NVarChar, newsAscii)
      .input('news_images', TYPES.NVarChar, newsImages)
      .input('type', TYPES.Int, newsType)
      .input('news_descriptions', TYPES.NVarChar, newsDescriptions)
      .input('news_content', TYPES.NVarChar, newsContent)
      .input('updated_by', TYPES.NVarChar, 'Admin')
      .input('news_id', TYPES.NVarChar, newsId)
      .query(query);

    if (result.rowsAffected[0] === 1) {
      return { data: 'update successful' };
    }

    return null;
  } catch (error) {
    throw new Error('An internal server error occurred');
  }
}

export async function updateNewsDeleteFlag(pool: ConnectionPool, id: string, isDelete: number) {
  try {
    const query = `
      UPDATE dbo.[9d_news]
      SET delete_flag = @isDelete
      WHERE news_id = @id;
    `;
    const result: any = await pool
      .request()
      .input('id', TYPES.VarChar, String(id))
      .input('isDelete', TYPES.Bit, Number(isDelete))
      .query(query);
    // Kiểm tra xem có bản ghi nào bị ảnh hưởng hay không
    if (result && result.rowsAffected) {
      return result.rowsAffected[0] > 0; // Trả về true nếu cập nhật thành công
    }
    return false;
  } catch (error) {
    throw new Error('An internal server error occurred');
  }
}

export async function deleteNewsById(pool: ConnectionPool, id: string) {
  try {
    const query = `
      DELETE FROM dbo.[9d_news]
      WHERE news_id = @id;
    `;
    const result: any = await pool.request().input('id', TYPES.VarChar, String(id)).query(query);

    // Kiểm tra xem có bản ghi nào bị xóa hay không
    if (result && result.rowsAffected) {
      return result.rowsAffected[0] > 0; // Trả về true nếu xóa thành công
    }
    return false;
  } catch (error) {
    throw new Error('An internal server error occurred');
  }
}

export async function getAllProduct(pool: ConnectionPool) {
  try {
    const querry =
      'SELECT id,itemid,itemname,itemimages,itemprice,itemdescription,delete_flag FROM dbo.[9d_KTCItems] ORDER BY updated_at DESC;';
    const result = await pool.request().query(querry);
    return result.recordset || null;
  } catch (error) {
    throw new Error('An internal server error occurred');
  }
}

export async function updateItemDeleteFlag(pool: ConnectionPool, id: string, status: number) {
  try {
    const query = `
      UPDATE dbo.[9d_KTCItems]
      SET delete_flag = @status
      WHERE id = @id;
    `;
    const result: any = await pool
      .request()
      .input('id', TYPES.VarChar, String(id))
      .input('status', TYPES.Bit, Number(status))
      .query(query);
    // Kiểm tra xem có bản ghi nào bị ảnh hưởng hay không
    if (result && result.rowsAffected) {
      return result.rowsAffected[0] > 0; // Trả về true nếu cập nhật thành công
    }
    return false;
  } catch (error) {
    throw new Error('An internal server error occurred');
  }
}

export async function deleteItemById(pool: ConnectionPool, id: string) {
  try {
    const query = `
      DELETE FROM dbo.[9d_KTCItems]
      WHERE id = @id;
    `;
    const result: any = await pool.request().input('id', TYPES.VarChar, String(id)).query(query);

    // Kiểm tra xem có bản ghi nào bị xóa hay không
    if (result && result.rowsAffected) {
      return result.rowsAffected[0] > 0; // Trả về true nếu xóa thành công
    }
    return false;
  } catch (error) {
    throw new Error('An internal server error occurred');
  }
}

export async function addItemProduct(pool: ConnectionPool, item: any) {
  try {
    const {
      itemid,
      itemname,
      itemdescription,
      itemprice,
      itemimages,
      created_at,
      created_by,
      updated_at,
      updated_by,
      delete_flag
    } = item;

    const query = `INSERT INTO dbo.[9d_KTCItems] (itemid, itemname, itemdescription, itemprice, itemimages, created_at, created_by, updated_at, updated_by, delete_flag) 
    VALUES
    (@itemid, @itemname, @itemdescription, @itemprice, @itemimages, @created_at, @created_by, @updated_at, @updated_by, @delete_flag)
`;
    const result = await pool
      .request()
      .input('itemid', TYPES.NVarChar, itemid)
      .input('itemname', TYPES.NVarChar, itemname)
      .input('itemdescription', TYPES.NVarChar, itemdescription)
      .input('itemprice', TYPES.Int, itemprice)
      .input('itemimages', TYPES.NVarChar, itemimages)
      .input('created_at', TYPES.DateTime, created_at)
      .input('created_by', TYPES.NVarChar, created_by)
      .input('updated_at', TYPES.DateTime, updated_at)
      .input('updated_by', TYPES.NVarChar, updated_by)
      .input('delete_flag', TYPES.Bit, delete_flag)
      .query(query);
    if (result.rowsAffected[0] === 1) {
      return { data: 'create successful' };
    }

    return null;
  } catch (error) {
    throw new Error('An internal server error occurred');
  }
}

export async function countAllMoney(pool: ConnectionPool) {
  try {
    // const querry =
    //   'SELECT SUM( CASE WHEN discount_percentage = 100 THEN amount / 2 ELSE amount * (1 - discount_percentage / 100) END ) AS amount_total FROM dbo.[9d_transaction_bank];';

    const query = `SELECT
      discount_percentage,
        SUM(amount) AS total_amount
        FROM dbo.[9d_transaction_bank]
        GROUP BY discount_percentage
        ORDER BY discount_percentage;`;
    const result = await pool.request().query(query);
    if (result && !isEmpty(result.recordset)) {
      return result.recordset || null;
    }
    return null;
  } catch (error) {
    throw new Error('An internal server error occurred');
  }
}

export async function countAllUser(pool: ConnectionPool) {
  try {
    const querry = 'SELECT COUNT(*) AS user_count FROM dbo.[9d_users];';
    const result = await pool.request().query(querry);
    if (result && result.recordset) {
      return result.recordset[0] || null;
    }
    return null;
  } catch (error) {
    throw new Error('An internal server error occurred');
  }
}

export async function getAllTrans(pool: ConnectionPool) {
  try {
    // const querry = 'SELECT TOP 10 * FROM dbo.[9d_transaction_bank] ORDER BY create_at DESC';
    const query = `SELECT 
    *,
    (CAST(DATEDIFF(SECOND, '1970-01-01', create_at) AS BIGINT) * 1000) AS create_at_timestamp
    FROM dbo.[9d_transaction_bank]
    ORDER BY create_at DESC;`;
    const result = await pool.request().query(query);
    return result.recordset || null;
  } catch (error) {
    throw new Error('An internal server error occurred');
  }
}

export async function getAllListGiftCode(pool: ConnectionPool) {
  try {
    const querry = 'SELECT * FROM dbo.[Tbl_giftcode] ORDER BY create_at DESC;';
    const result = await pool.request().query(querry);
    if (result && !_.isEmpty(result.recordset)) {
      return result.recordset || null;
    }
    return null;
  } catch (error) {
    throw new Error('An internal server error occurred');
  }
}

export async function getGiftByGiftCode(pool: ConnectionPool, giftCode: string) {
  try {
    const querry = 'SELECT * FROM dbo.[Tbl_giftcode] WHERE gift_code = @giftCode';
    const result = await pool.request().input('giftCode', TYPES.VarChar, giftCode).query(querry);

    if (result && result.recordset.length > 0) {
      const giftcode = result.recordset[0];
      return { ...giftcode, create_at: giftcode?.create_at.toISOString() };
    }

    return null;
  } catch (error) {
    throw new Error('An internal server error occurred');
  }
}

export async function updateGiftDeleteFlag(pool: ConnectionPool, id: string, status: number) {
  try {
    const query = `
      UPDATE dbo.[Tbl_giftcode]
      SET delete_flag = @status
      WHERE item_id = @id;
    `;
    const result: any = await pool
      .request()
      .input('id', TYPES.VarChar, String(id))
      .input('status', TYPES.Bit, Number(status))
      .query(query);

    // Kiểm tra xem có bản ghi nào bị ảnh hưởng hay không
    if (result && result.rowsAffected) {
      return result.rowsAffected[0] > 0; // Trả về true nếu cập nhật thành công
    }
    return false;
  } catch (error) {
    throw new Error('An internal server error occurred');
  }
}

export async function deleteGiftById(pool: ConnectionPool, id: string) {
  try {
    const query = `
      DELETE FROM dbo.[Tbl_giftcode]
      WHERE item_id = @id;
    `;
    const result: any = await pool.request().input('id', TYPES.VarChar, String(id)).query(query);

    // Kiểm tra xem có bản ghi nào bị xóa hay không
    if (result && result.rowsAffected) {
      return result.rowsAffected[0] > 0; // Trả về true nếu xóa thành công
    }
    return false;
  } catch (error) {
    throw new Error('An internal server error occurred');
  }
}

export async function addMultipleGiftCodes(pool: ConnectionPool, item: any, listGift: string[]) {
  try {
    const { itemCode, expriedDate } = item;
    const create_at = new Date();
    const expried_date = new Date(expriedDate);

    const query = `
      INSERT INTO dbo.[Tbl_giftcode] ( gift_code, item_code, delete_flag, create_at, expried_date)
      VALUES ( @gift_code, @item_code, @delete_flag, @create_at, @expried_date)
    `;

    // Tạo mảng các Promise từ việc thêm từng gift code
    const promises = listGift.map(async (giftCode) => {
      const result = await pool
        .request()
        .input('gift_code', TYPES.NVarChar, giftCode)
        .input('item_code', TYPES.NVarChar, itemCode)
        .input('delete_flag', TYPES.Bit, 0)
        .input('create_at', TYPES.DateTime, create_at)
        .input('expried_date', TYPES.DateTime, expried_date)
        .query(query);

      if (result.rowsAffected[0] !== 1) {
        return null;
      }

      return { data: 'create successful' };
    });

    // Chờ đợi tất cả các Promise hoàn thành
    const results = await Promise.all(promises);

    // Kiểm tra xem có lỗi nào xuất hiện không
    if (results.includes(null)) {
      return null;
    }

    return { data: 'create successful' };
  } catch (error) {
    throw new Error('An internal server error occurred');
  }
}

export async function updateGiftCode(pool: ConnectionPool, item: any) {
  try {
    const { id, active_user, active_id } = item;
    const update_at = new Date();
    const query = `UPDATE dbo.[Tbl_giftcode] 
    SET
    active_id = @active_id,
    active_user = @active_user,
    update_at = @update_at,
    delete_flag = @delete_flag
    WHERE
    item_id = @id;`;

    const result: any = await pool
      .request()
      .input('id', TYPES.VarChar, String(id))
      .input('active_id', TYPES.VarChar, String(active_id))
      .input('active_user', TYPES.VarChar, String(active_user))
      .input('update_at', TYPES.DateTime, update_at)
      .input('delete_flag', TYPES.Bit, 1)
      .query(query);

    // Kiểm tra xem có bản ghi nào bị ảnh hưởng hay không
    if (result && result.rowsAffected) {
      return result.rowsAffected[0] > 0; // Trả về true nếu cập nhật thành công
    }
    return false;
  } catch (error) {
    throw new Error('An internal server error occurred');
  }
}

export async function getInfoByUsername(pool: ConnectionPool, username: string) {
  try {
    const querry = 'SELECT * FROM dbo.[9d_users] WHERE user_name = @username';
    const result = await pool.request().input('username', TYPES.VarChar, username).query(querry);
    return result.recordset || null;
  } catch (error) {
    throw new Error('An internal server error occurred');
  }
}

export async function createAndUpdateLinkDownload(pool: ConnectionPool, link: string) {
  try {
    const query = `
        DECLARE @TableExists BIT = 0;
        IF OBJECT_ID('dbo.config_link_download', 'U') IS NOT NULL
        BEGIN
            SET @TableExists = 1;
        END
        IF @TableExists = 0
        BEGIN
            CREATE TABLE dbo.config_link_download (
                id INT PRIMARY KEY IDENTITY(1,1),
                link NVARCHAR(MAX) NOT NULL,
                create_at DATETIME2 DEFAULT GETDATE(),
                update_at DATETIME2 DEFAULT GETDATE()
            );
            INSERT INTO dbo.config_link_download (link)
            VALUES (@link);
        END
        ELSE
        BEGIN
            UPDATE dbo.config_link_download
            SET link = @link,
            update_at = GETDATE();
        END`;

    const result = await pool.request().input('link', TYPES.NVarChar, link).query(query);
    return result.recordset || null;
  } catch (error) {
    throw new Error('An internal server error occurred');
  }
}

export async function getLinkDownload(pool: ConnectionPool) {
  try {
    const query = `
      IF OBJECT_ID('dbo.config_link_download', 'U') IS NOT NULL
      BEGIN
        SELECT TOP 1 link FROM dbo.config_link_download;
      END
      ELSE
      BEGIN
        SELECT NULL AS link;
      END`;

    const result = await pool.request().query(query);
    return result?.recordset[0] || null;
  } catch (error) {
    throw new Error('An internal server error occurred');
  }
}

export async function createAndUpdatePromotionConfig(
  pool: ConnectionPool,
  config: PromotionConfig
) {
  try {
    const query = `
        DECLARE @TableExists BIT = 0;
        IF OBJECT_ID('dbo.promotion_config', 'U') IS NOT NULL
        BEGIN
            SET @TableExists = 1;
        END
        IF @TableExists = 0
        BEGIN
            CREATE TABLE dbo.promotion_config (
                id INT PRIMARY KEY IDENTITY(1,1),
                min_amount INT NOT NULL,
                max_amount INT NOT NULL,
                discount_percentage INT NOT NULL,
                start_date DATE NOT NULL,
                end_date DATE NOT NULL,
                is_active BIT NOT NULL,
                create_at DATETIME2 DEFAULT GETDATE(),
                update_at DATETIME2 DEFAULT GETDATE()
            );
            INSERT INTO dbo.promotion_config (min_amount, max_amount, discount_percentage, start_date, end_date, is_active)
            VALUES (@minAmount, @maxAmount, @discountPercentage, @startDate, @endDate, @isActive);
        END
        ELSE
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
        END`;

    const result = await pool
      .request()
      .input('minAmount', TYPES.Decimal, config.minAmount)
      .input('maxAmount', TYPES.Decimal, config.maxAmount)
      .input('discountPercentage', TYPES.Decimal, config.discountPercentage)
      .input('startDate', TYPES.Date, config.startDate)
      .input('endDate', TYPES.Date, config.endDate)
      .input('isActive', TYPES.Bit, 1)
      .query(query);

    return result?.recordset || null;
  } catch (error) {
    throw new Error('An internal server error occurred');
  }
}

export async function createAndUpdateGuideWeb(pool: ConnectionPool, guide: IGuideWeb) {
  try {
    const checkTableQuery = `
      DECLARE @TableExists BIT = 0;
      IF OBJECT_ID('dbo.guide_web', 'U') IS NOT NULL
      BEGIN
        SET @TableExists = 1;
      END;
      SELECT @TableExists AS TableExists`;

    const tableCheckResult = await pool.request().query(checkTableQuery);
    const tableExists = tableCheckResult.recordset[0]?.TableExists === 1;

    if (!tableExists) {
      const createTableQuery = `
        CREATE TABLE dbo.guide_web (
          id INT PRIMARY KEY IDENTITY(1,1),
          title NVARCHAR(MAX) NOT NULL,
          content NVARCHAR(MAX) NOT NULL,
          type_guide NVARCHAR(2) NOT NULL,
          delete_flag BIT DEFAULT 0,
          create_at DATETIME2 DEFAULT GETDATE(),
          update_at DATETIME2 DEFAULT GETDATE()
        );
        INSERT INTO dbo.guide_web (title, content, type_guide) -- Thêm type_guide vào đây
        VALUES (@title, @content, @type_guide);`;

      const createTableResult = await pool
        .request()
        .input('title', TYPES.NVarChar, guide.title)
        .input('content', TYPES.NVarChar, guide.content)
        .input('type_guide', TYPES.NVarChar, guide.type_guide)
        .query(createTableQuery);

      return createTableResult?.recordset || null;
    }
    const updateTableQuery = `
        UPDATE dbo.guide_web
        SET 
          title = @title,
          content = @content,
          delete_flag = @delete_flag,
          update_at = GETDATE()
        WHERE type_guide = @type_guide;`;

    const updateTableResult = await pool
      .request()
      .input('title', TYPES.NVarChar, guide.title)
      .input('content', TYPES.NVarChar, guide.content)
      .input('delete_flag', TYPES.Bit, guide.delete_flag || false)
      .input('type_guide', TYPES.NVarChar, guide.type_guide)
      .query(updateTableQuery);

    return updateTableResult?.recordset || null;
  } catch (error) {
    throw new Error('An internal server error occurred');
  }
}

export async function getAllPromotionConfig(pool: ConnectionPool): Promise<any> {
  try {
    const query = `
      IF OBJECT_ID('dbo.promotion_config', 'U') IS NOT NULL
      BEGIN
      SELECT TOP 1 * FROM dbo.promotion_config 
      ORDER BY create_at DESC;
      END
      ELSE
      BEGIN
        SELECT NULL AS id;
      END
    `;

    const result = await pool.request().query(query);
    if (result && result?.recordset) {
      return result.recordset[0];
    }
    return null;
  } catch (error) {
    throw new Error('An internal server error occurred');
  }
}

export async function getUserBalanceHistory(pool: ConnectionPool): Promise<any> {
  try {
    // const query = `
    //   DECLARE @TableExists BIT = 0;
    //   IF OBJECT_ID('dbo.[9d_user_balance_history]', 'U') IS NOT NULL
    //   BEGIN
    //   SET @TableExists = 1;
    //   END
    //
    //   IF @TableExists = 0
    //   BEGIN
    // CREATE TABLE dbo.[9d_user_balance_history] (
    //     history_id INT PRIMARY KEY IDENTITY(1,1),
    //     user_id INT,
    //     user_name NVARCHAR(255),
    //     email NVARCHAR(255),
    //     telephone NVARCHAR(20),
    //     fullname NVARCHAR(255),
    //     old_balance INT,
    //     new_balance INT,
    //     transaction_type NVARCHAR(20),
    //     change_time DATETIME
    // );
    //
    // CREATE TRIGGER UserBalanceUpdate
    // ON dbo.[9d_users]
    // AFTER UPDATE
    // AS
    // BEGIN
    //     SET NOCOUNT ON;
    //
    //     IF (UPDATE(balance))
    //     BEGIN
    //         INSERT INTO dbo.[9d_user_balance_history] (
    //             user_id, user_name, email, telephone, fullname,
    //             old_balance, new_balance, transaction_type, change_time)
    //         SELECT
    //             i.user_id,
    //             i.user_name,
    //             i.email,
    //             i.telephone,
    //             i.fullname,
    //             d.balance AS old_balance,
    //             i.balance AS new_balance,
    //             CASE
    //                 WHEN i.balance > d.balance THEN 'credit'
    //                 WHEN i.balance < d.balance THEN 'debit'
    //                 ELSE NULL
    //             END AS transaction_type,
    //             GETDATE()
    //         FROM inserted i
    //         INNER JOIN deleted d ON i.user_id = d.user_id
    //         WHERE i.balance IS NOT NULL AND d.balance IS NOT NULL AND i.balance <> d.balance;
    //     END
    // END;
    // END
    // ELSE
    // BEGIN
    // SELECT * FROM dbo.[9d_user_balance_history] ORDER BY change_time DESC;
    // END
    // `;

    const query = `SELECT TOP 1000 
        *,
        (CAST(DATEDIFF(SECOND, '1970-01-01', change_time) AS BIGINT) * 1000) AS change_time_timestamp
      FROM dbo.[9d_user_balance_history] WHERE transaction_type='credit'
      ORDER BY change_time DESC;`;
    const result = await pool.request().query(query);
    if (result && result?.recordset) {
      return result.recordset;
    }
    return null;
  } catch (error) {
    throw new Error('An internal server error occurred');
  }
}

export async function createEventRewards(pool: ConnectionPool, event: EventRewards): Promise<any> {
  try {
    const checkTableQuery = `
      IF OBJECT_ID('dbo.[9d_events_rewards]', 'U') IS NULL
      BEGIN
        CREATE TABLE dbo.[9d_events_rewards] (
          event_id INT IDENTITY(1000,1) PRIMARY KEY,
          event_name NVARCHAR(255),
           start_time VARCHAR(50),
          end_time VARCHAR(50),
          background_image VARCHAR(255),
          type_event INT
        );
      END
      
      INSERT INTO dbo.[9d_events_rewards] (event_name, start_time, end_time, background_image, type_event)
      VALUES (@event_name, @start_time, @end_time, @background_image, @type_event);
    `;

    // Kiểm tra và tạo bảng Events
    const result = await pool
      .request()
      .input('event_name', TYPES.NVarChar(255), event.event_name)
      .input('start_time', TYPES.VarChar, event.start_time)
      .input('end_time', TYPES.VarChar, event.end_time)
      .input('background_image', TYPES.VarChar(255), event.background_image)
      .input('type_event', TYPES.Int, event.type_event)
      .query(checkTableQuery);

    return result.rowsAffected[0] === 1 || false;
  } catch (error) {
    throw new Error('An internal server error occurred');
  }
}

export async function getEventsByType(pool: ConnectionPool, typeEvent: number): Promise<any> {
  try {
    const query = `
      IF OBJECT_ID('dbo.[9d_events_rewards]', 'U') IS NULL
      BEGIN
        CREATE TABLE dbo.[9d_events_rewards] (
          event_id INT IDENTITY(1000,1) PRIMARY KEY,
          event_name NVARCHAR(255),
          start_time VARCHAR(50),
          end_time VARCHAR(50),
          background_image VARCHAR(255),
          type_event INT
        );
      END
      SELECT * FROM dbo.[9d_events_rewards]
      WHERE type_event = @type_event;
    `;

    const result = await pool.request().input('type_event', TYPES.Int, typeEvent).query(query);
    if (result && result?.recordset) {
      return result.recordset;
    }
    return null;
  } catch (error) {
    throw new Error('An error occurred while getting events by type.');
  }
}

// tạo item theo mốc quà
export async function createItemEventRewards(
  pool: ConnectionPool,
  event: IItemEventRewards
): Promise<boolean> {
  try {
    const checkTableQuery = `
      IF OBJECT_ID('dbo.[9d_items_events_rewards]', 'U') IS NULL
  BEGIN
    CREATE TABLE dbo.[9d_items_events_rewards] (
        reward_id INT IDENTITY(1,1) PRIMARY KEY,
        event_id INT,
        reward_name NVARCHAR(255),
        required_points INT,
        reward_description NVARCHAR(255),
        reward_image VARCHAR(255),
        reward_item_code INT, 
        FOREIGN KEY (event_id) REFERENCES dbo.[9d_events_rewards](event_id) ON DELETE CASCADE
    );
  END

  INSERT INTO dbo.[9d_items_events_rewards] (event_id, reward_name, required_points, reward_description, reward_item_code, reward_image)
  VALUES (@event_id, @reward_name, @required_points, @reward_description, @reward_item_code, @reward_image);

    `;

    // Thực hiện truy vấn để kiểm tra và tạo bảng EventRewards
    const result = await pool
      .request()
      .input('event_id', TYPES.Int, event.event_id)
      .input('reward_name', TYPES.NVarChar(255), event.reward_name)
      .input('required_points', TYPES.Int, event.required_points)
      .input('reward_description', TYPES.NVarChar(255), event.reward_description)
      .input('reward_item_code', TYPES.Int, event.reward_item_code)
      .input('reward_image', TYPES.VarChar, event.reward_image)
      .query(checkTableQuery);

    return result.rowsAffected[0] === 1 || false;
  } catch (error) {
    throw new Error('An internal server error occurred');
  }
}

export async function getAllEventReward(pool: ConnectionPool): Promise<any> {
  try {
    const query = `SELECT * FROM dbo.[9d_events_rewards] ORDER BY event_id ASC`;

    const result = await pool.request().query(query);

    return result.recordset;
  } catch (error) {
    throw new Error('An internal server error occurred');
  }
}

export async function getOnlyEventRewardByType(
  pool: ConnectionPool,
  eventType: number
): Promise<any> {
  try {
    const query = `SELECT * FROM dbo.[9d_events_rewards] WHERE type_event = @eventType`;

    const result = await pool
      .request()
      .input('eventType', TYPES.VarChar, String(eventType))
      .query(query);

    if (result && result.recordset) {
      return result.recordset[0] || null;
    }
    return null;
  } catch (error) {
    throw new Error('An internal server error occurred');
  }
}

export async function getAllItemEventReward(pool: ConnectionPool): Promise<any> {
  try {
    const query = `
      SELECT er.reward_id, er.event_id, er.reward_name, er.required_points, er.reward_image, er.reward_description, er.reward_item_code,
             e.event_name, e.type_event
      FROM dbo.[9d_items_events_rewards] er
      INNER JOIN dbo.[9d_events_rewards] e ON er.event_id = e.event_id
      ORDER BY er.event_id ASC, er.required_points ASC;
    `;

    const result = await pool.request().query(query);

    return result.recordset;
  } catch (error) {
    throw new Error('An internal server error occurred');
  }
}

export async function getEventRewardByType(
  pool: ConnectionPool,
  eventType: number,
  user_name: string
): Promise<any> {
  try {
    // const query = `
    //   SELECT er.reward_id, er.event_id, er.reward_name, er.required_points, er.reward_image, er.reward_description, er.reward_item_code,
    //    e.event_name, e.type_event
    //     FROM dbo.[9d_items_events_rewards] er
    //     INNER JOIN dbo.[9d_events_rewards] e ON er.event_id = e.event_id
    //     WHERE e.type_event = @eventType
    //     AND e.end_time > CAST(GETDATE() AS BIGINT);
    // `;
    const query = `
     SELECT
    er.reward_id,
    er.event_id,
    er.reward_name,
    er.required_points,
    er.reward_image,
    er.reward_description,
    er.reward_item_code,
    e.event_name,
    e.type_event,
    CASE
        WHEN EXISTS (
            SELECT 1
            FROM dbo.[9d_items_events_rewards_history] hr
            WHERE hr.user_name = @user_name
            AND hr.reward_id = er.reward_id
        ) THEN 'used'
        ELSE 'unused'
    END AS status
    FROM
    dbo.[9d_items_events_rewards] er
    INNER JOIN
    dbo.[9d_events_rewards] e ON er.event_id = e.event_id
    WHERE
    e.type_event = @eventType
     AND e.end_time > (CAST(DATEDIFF(SECOND, '1970-01-01', GETDATE()) AS BIGINT) * 1000)
     ORDER BY
    er.required_points ASC;
    `;

    const result = await pool
      .request()
      .input('eventType', TYPES.VarChar, String(eventType))
      .input('user_name', TYPES.VarChar, String(user_name))
      .query(query);

    return result.recordset;
  } catch (error) {
    throw new Error('An internal server error occurred');
  }
}

export async function deleteEventRewardsById(pool: ConnectionPool, id: string) {
  try {
    const query = `
      DELETE FROM dbo.[9d_events_rewards] WHERE event_id = @id;
    `;
    const result: any = await pool.request().input('id', TYPES.VarChar, String(id)).query(query);
    // Kiểm tra xem có bản ghi nào bị xóa hay không
    if (result && result.rowsAffected) {
      return result.rowsAffected[0] > 0; // Trả về true nếu xóa thành công
    }
    return false;
  } catch (error) {
    throw new Error('An internal server error occurred');
  }
}

export async function deleteItemEventRewardsById(pool: ConnectionPool, id: string) {
  try {
    const query = `
          DELETE FROM dbo.[9d_items_events_rewards] WHERE reward_id = @id;`;
    const result: any = await pool.request().input('id', TYPES.VarChar, String(id)).query(query);

    // Kiểm tra xem có bản ghi nào bị xóa hay không
    if (result && result.rowsAffected) {
      return result.rowsAffected[0] > 0; // Trả về true nếu xóa thành công
    }
    return false;
  } catch (error) {
    throw new Error('An internal server error occurred');
  }
}

export async function createHistoryItemEventRewards(
  pool: ConnectionPool,
  history: any
): Promise<boolean> {
  try {
    const checkTableQuery = `
      IF OBJECT_ID('dbo.[9d_items_events_rewards_history]', 'U') IS NULL
    BEGIN
     CREATE TABLE dbo.[9d_items_events_rewards_history] (
        history_id INT IDENTITY(1,1) PRIMARY KEY,
        reward_id INT,
        event_id INT,
        reward_item_code INT, 
        user_id VARCHAR(50),
        user_name NVARCHAR(255),
        created_at DATETIME
    );
    END
  INSERT INTO dbo.[9d_items_events_rewards_history] (reward_id,event_id,reward_item_code, user_id, user_name, created_at)
  VALUES
    (@reward_id,@event_id,@reward_item_code, @user_id, @user_name, GETDATE());
    `;

    // Thực hiện truy vấn để kiểm tra và tạo bảng EventRewards
    const result = await pool
      .request()
      .input('reward_id', TYPES.Int, Number(history.reward_id))
      .input('event_id', TYPES.Int, Number(history.event_id))
      .input('reward_item_code', TYPES.Int, Number(history.reward_item_code))
      .input('user_id', TYPES.VarChar, String(history.user_id))
      .input('user_name', TYPES.VarChar, String(history.user_name))
      .query(checkTableQuery);

    return result.rowsAffected[0] === 1 || false;
  } catch (error) {
    throw new Error('An internal server error occurred');
  }
}

export async function getHistoryEventRewardById(
  pool: ConnectionPool,
  user_name: string
): Promise<any> {
  try {
    const checkTableQuery = `
      IF OBJECT_ID('dbo.[9d_items_events_rewards_history]', 'U') IS NULL
    BEGIN
     CREATE TABLE dbo.[9d_items_events_rewards_history] (
        history_id INT IDENTITY(1,1) PRIMARY KEY,
        reward_id INT,
        event_id INT,
        reward_item_code INT, 
        user_id VARCHAR(50),
        user_name NVARCHAR(255),
        created_at DATETIME
    );
    END
   SELECT * FROM dbo.[9d_items_events_rewards_history] WHERE user_name = @user_name;
    `;
    const result = await pool
      .request()
      .input('user_name', TYPES.VarChar, user_name)
      .query(checkTableQuery);

    return result.recordset;
  } catch (error) {
    throw new Error('An internal server error occurred');
  }
}

export async function togglePromotionConfig(pool: ConnectionPool, id: number, isActive: boolean) {
  try {
    const query = `
      IF EXISTS (SELECT 1 FROM dbo.promotion_config WHERE id = @id)
      BEGIN
          UPDATE dbo.promotion_config
          SET is_active = @isActive, update_at = GETDATE()
          WHERE id = @id;
      END
      ELSE
      BEGIN
          THROW 50000, 'Promotion config not found', 1;
      END
    `;
    const result = await pool
      .request()
      .input('id', TYPES.Int, id)
      .input('isActive', TYPES.Bit, isActive ? 1 : 0)
      .query(query);

    return { success: true, result, message: 'Status updated successfully.' };
  } catch (error) {
    throw new Error(`Failed to update promotion config status: ${error.message}`);
  }
}
