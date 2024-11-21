import moment from 'moment';
import { ConnectionPool, TYPES } from 'mssql';

import { Env } from '@/libs/Env.mjs';
import type { IProcedure } from '@/types/product';

const dbConfig = {
  user: Env.DATABASE_USERNAME || '',
  password: Env.DATABASE_PASSWORD || '',
  server: Env.DATABASE_URL || '',
  database: 'CIS_DB' || '',
  options: {
    instancename: 'SQLEXPRESS',
    trustedconnection: true,
    trustServerCertificate: true,
    providerName: 'System.Data.SqlClient',
    encrypt: false
  }
};

class DatabaseCis {
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

  public static async executeStoredProcedure(payload: IProcedure) {
    try {
      if (!this.pool || !this.pool.connected) {
        await this.connect();
      }
      const result = await this.pool!.request()
        .input('user_id', TYPES.VarChar(60), payload.user_id)
        .input('cart_itemCode', TYPES.Int, payload.cart_itemCode)
        .input('game_server', TYPES.TinyInt, 0)
        .input('is_present', TYPES.Int, 0)
        .input('present_rcv_id', TYPES.VarChar(60), '')
        .input('item_price', TYPES.Int, payload.item_price)
        .output('o_order_idx', TYPES.Int)
        .output('o_v_error', TYPES.Int)
        .execute('sp_9D_Purchase_Using_Me');
      if (result && result?.output) {
        if (result.output.o_v_error === 0) {
          return {
            order_idx: result.output.o_order_idx,
            v_error: result.output.o_v_error
          };
        }
      }
      return null;
    } catch (error) {
      throw new Error('An internal server error occurred');
    }
  }

  public static async getHistoryByUserName(payload: any) {
    try {
      if (!this.pool || !this.pool.connected) {
        await this.connect();
      }
      const result: any = await this.pool!.request()
        .input('currPage', TYPES.Int, payload.currPage)
        .input('recodperpage', TYPES.Int, payload.recodperpage)
        .input('Pagesize', TYPES.Int, payload.Pagesize)
        .input('UserName', TYPES.NVarChar(50), payload.UserName)
        .execute('spTB_HistoryList_V1');
      const historyList = result?.recordsets[0]; // Dữ liệu từ câu truy vấn SELECT trong stored procedure
      const totalRecords = result.returnValue; // Giá trị trả về từ EXEC spPhanTrangHistory_V1

      return {
        historyList,
        totalRecords
      };
    } catch (error) {
      throw new Error('An internal server error occurred');
    }
  }

  public static async getProduct() {
    try {
      if (!this.pool || !this.pool.connected) {
        await this.connect();
      }
      const querry = 'SELECT * FROM dbo.[Tbl_Item_List] WHERE item_status = 2 ORDER BY item_name';
      const result = await this.pool!.request().query(querry);
      return result.recordset || null;
    } catch (error) {
      throw new Error('An internal server error occurred');
    }
  }

  public static async getProductById(id: string) {
    try {
      if (!this.pool || !this.pool.connected) {
        await this.connect();
        const querry = 'SELECT * FROM dbo.[Tbl_Item_List] WHERE seq = @id AND item_status = 2';
        const result = await this.pool!.request()
          .input('id', TYPES.VarChar, String(id))
          .query(querry);
        return result.recordset || null;
      }
      const querry = 'SELECT * FROM dbo.[Tbl_Item_List] WHERE seq = @id AND item_status = 2';
      const result = await this.pool!.request()
        .input('id', TYPES.VarChar, String(id))
        .query(querry);
      return result.recordset || null;
    } catch (error) {
      throw new Error('An internal server error occurred');
    }
  }

  public static async getAllItems() {
    try {
      if (!this.pool || !this.pool.connected) {
        await this.connect();
      }
      const querry = 'SELECT * FROM dbo.[Tbl_Item_List] WHERE item_status=2 ORDER BY item_name';
      const result = await this.pool!.request().query(querry);
      return result.recordset || null;
    } catch (error) {
      throw new Error('An internal server error occurred');
    }
  }

  public static async addItem(item: any) {
    try {
      if (!this.pool || !this.pool.connected) {
        await this.connect();
      }
      const {
        item_category,
        item_code,
        item_price,
        item_day,
        item_quantity,
        item_status,
        item_name,
        item_description,
        item_image,
        key_word,
        is_present
      } = item;
      const result = await this.pool!.request()
        .input('item_category', TYPES.Int, item_category)
        .input('item_code', TYPES.Int, item_code)
        .input('item_price', TYPES.Int, item_price)
        .input('item_day', TYPES.Int, item_day)
        .input('item_quantity', TYPES.Int, item_quantity)
        .input('item_status', TYPES.Int, item_status)
        .input('item_name', TYPES.NVarChar(400), String(item_name))
        .input('item_description', TYPES.NVarChar(400), String(item_description))
        .input('item_image', TYPES.NVarChar(400), String(item_image))
        .input('key_word', TYPES.Char(20), String(key_word))
        .input('is_present', TYPES.Int, is_present)
        .execute('AddItem');
      return result || null;
    } catch (error) {
      throw new Error('An internal server error occurred');
    }
  }

  public static async deleteItemById(id: string) {
    try {
      if (!this.pool || !this.pool.connected) {
        await this.connect();
      }
      const query = `
      DELETE FROM dbo.[Tbl_Item_List]
      WHERE seq = @id;
    `;
      const result: any = await this.pool!.request()
        .input('id', TYPES.VarChar, String(id))
        .query(query);

      // Kiểm tra xem có bản ghi nào bị xóa hay không
      if (result && result.rowsAffected) {
        return result.rowsAffected[0] > 0; // Trả về true nếu xóa thành công
      }
      return false;
    } catch (error) {
      throw new Error('An internal server error occurred');
    }
  }

  // tam thoi dung the -- tinh chinh xu ly sau
  public static async exchangeGift(item: any) {
    try {
      if (!this.pool || !this.pool.connected) {
        await this.connect();
      }

      const { user_id, cart_itemCode, game_server, item_price } = item;

      const query = `
      DECLARE @order_idx INT
      DECLARE @v_error TINYINT
      DECLARE @is_present TINYINT

      SET XACT_ABORT ON
      SET NOCOUNT ON
      SET LOCK_TIMEOUT 2000

      SET @v_error = 0
      SET @is_present = 0

      BEGIN TRAN

      SELECT @order_idx = MAX(order_idx) FROM tbl_order_list WITH(NOLOCK)

      IF @order_idx IS NULL
        SET @order_idx = 1
      ELSE
        SET @order_idx = @order_idx + 1
      INSERT dbo.tbl_cash_inven 
      (item_code, item_user_id, item_server_code, item_present)
      VALUES
      (@cart_itemCode, @user_id, 0 ,@is_present)
      INSERT INTO [dbo].[Tbl_Order_List]
           ([order_idx]
           ,[order_item_code]
           ,[order_user_id]
           ,[order_game_server]
           ,[order_item_price]
           ,[order_input_date]
           ,[order_status]
           ,[order_game_input_date]
           ,[order_present]
           ,[present_receive_id])
          VALUES
           (@order_idx,@cart_itemCode,@user_id,0,0,GETDATE(),1,GETDATE(),0,0)

      SET @v_error = 1

      COMMIT TRAN`;

      const result = await this.pool!.request()
        .input('user_id', TYPES.VarChar, user_id)
        .input('cart_itemCode', TYPES.Int, cart_itemCode)
        .input('game_server', TYPES.TinyInt, game_server)
        .input('item_price', TYPES.Int, item_price)
        .query(query);

      if (result && result.recordset) {
        return result.recordset;
      }
      return null;
    } catch (error) {
      throw new Error('An internal server error occurred');
    }
  }

  public static async countBalanceUsedByUserName(
    userName: string,
    startTime: string,
    endTime: string
  ) {
    try {
      if (!this.pool || !this.pool.connected) {
        await this.connect();
      }
      const start_time = moment.unix(Number(startTime) / 1000).format('YYYY-MM-DD HH:mm:ss.SSS');
      const end_time = moment.unix(Number(endTime) / 1000).format('YYYY-MM-DD HH:mm:ss.SSS'); // Ngày hiện tại
      //   const query = `SELECT
      //     // oli.order_user_id,
      //     // SUM(il.item_price) AS total_spent
      //     // FROM
      //     // dbo.Tbl_Order_List oli
      //     // INNER JOIN
      //     // dbo.Tbl_Item_List il ON oli.order_item_code = il.item_code
      //     // WHERE
      //     // oli.order_user_id = @user_name
      //     // GROUP BY
      //     // oli.order_user_id;`;
      //   const query = `SELECT
      // oli.order_user_id,
      // SUM(il.item_price) AS total_spent
      // FROM
      // dbo.Tbl_Order_List oli
      // INNER JOIN
      // dbo.Tbl_Item_List il ON oli.order_item_code = il.item_code
      // WHERE
      // oli.order_user_id = @user_name
      // AND oli.order_input_date >= @start_date
      // AND oli.order_input_date < @end_date
      // GROUP BY
      // oli.order_user_id;`;
      const query = `SELECT
    SUM(order_item_price) AS total_spent
    FROM
    dbo.Tbl_Order_List
    WHERE
    order_user_id = @user_name
    AND order_input_date >= @start_date
    AND order_input_date < @end_date
    GROUP BY
    order_user_id;`;
      const result = await this.pool!.request()
        .input('user_name', TYPES.VarChar, userName)
        .input('start_date', TYPES.DateTime, start_time)
        .input('end_date', TYPES.DateTime, end_time)
        .query(query);
      if (result && result.recordset) {
        return result.recordset[0];
      }
      return null;
    } catch (error) {
      throw new Error('An internal server error occurred');
    }
  }

  public static async getAllItemsShopHistory() {
    try {
      if (!this.pool || !this.pool.connected) {
        await this.connect();
      }

      const querry = `SELECT 
    oli.order_idx,
    oli.order_user_id,
    oli.order_item_code,
    oli.order_input_date,
    (CAST(DATEDIFF(SECOND, '1970-01-01',oli.order_input_date) AS BIGINT) * 1000) AS order_input_date_timestamp,
    il.item_name,
    il.item_price
    FROM 
    dbo.Tbl_Order_List oli
    INNER JOIN 
    dbo.tbl_item_list il ON oli.order_item_code = il.item_code
    GROUP BY 
    oli.order_idx,oli.order_user_id, oli.order_item_code,oli.order_input_date, il.item_name, il.item_price
     ORDER by oli.order_input_date DESC`;
      const result = await this.pool!.request().query(querry);
      return result.recordset || null;
    } catch (error) {
      throw new Error('An internal server error occurred');
    }
  }
}

export default DatabaseCis;
