source code Cuulong cố nhân

dev by tumv https://www.facebook.com/tudevapp

- Update mục đích có tiếng việt

ALTER TABLE Tbl_Item_List
ADD item_description_en NVARCHAR(400) NULL, -- Cho phép NULL
item_title_en NVARCHAR(400) NULL; -- Cho phép NULL

- Sửa lai

-- S? d?ng ALTER VIEW ?? ch?nh s?a ??nh ngh?a c?a view thêm field vào view
-- update thêm các fiel nh? ác danh gong, money và ?n ??i v?i type gm != 0

ALTER VIEW dbo.VIEW_RANK_INFO
AS
SELECT dbo.ND_V01_Charac.unique_id, dbo.ND_V01_Charac.chr_name,   
dbo.ND_V01_CharacState.inner_level, dbo.ND_V01_CharacState.jin,   
dbo.ND_V01_Charac.party, dbo.ND_V01_Charac.class,   
dbo.ND_V01_CharacState.honor,
dbo.ND_V01_CharacState.gong,
dbo.ND_V01_CharacState.hiding AS hiding,
dbo.ND_V02_Elixir.money,
dbo.ND_V01_CharacState.level_rate,
dbo.ND_V01_CharacState.levelup_time
FROM dbo.ND_V01_Charac
INNER JOIN dbo.ND_V01_CharacState ON dbo.ND_V01_Charac.unique_id = dbo.ND_V01_CharacState.unique_id
INNER JOIN dbo.ND_V02_Elixir ON dbo.ND_V01_Charac.unique_id = dbo.ND_V02_Elixir.cuid
WHERE   (dbo.ND_V01_CharacState.hiding = 0 AND dbo.ND_V01_Charac.gm = 0)

-- fix cac loi cau hinh nhu inser link tai
