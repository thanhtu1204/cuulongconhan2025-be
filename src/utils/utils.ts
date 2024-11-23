// Hàm tính toán MD5 hash
import * as crypto from 'crypto';
import iconv from 'iconv-lite';
import { get, set } from 'lodash';

const rateLimit = 50; // Number of allowed requests per minute

const rateLimiter: Record<string, number[]> = {};
const maxCacheSize = 100; // Số lượng timestamps tối đa cho mỗi địa chỉ IP

export function numberWithCommas(x: number): string {
  return x.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ',');
}

export function numberWithDot(x: number): string {
  if (!x) return '';
  return x.toString().replace(/\B(?=(\d{3})+(?!\d))/g, '.');
}

export function decodeCP1258(cp1258EncodedText: string): string {
  const buffer = Buffer.from(cp1258EncodedText, 'binary');
  return iconv.decode(buffer, 'win1258');
}

// Hàm tính toán MD5 hash
function getMD5(str: string): string {
  const md5 = crypto.createHash('md5');
  return md5.update(str, 'utf8').digest('hex');
}

// Hàm so sánh mật khẩu đã mã hóa với mật khẩu người dùng đã nhập
export function comparePasswords(inputPassword: string, hashedPassword: string): boolean {
  const inputPasswordHashed = getMD5(inputPassword);
  return inputPasswordHashed === hashedPassword;
}

export function hashPasswords(inputPassword: string) {
  return getMD5(inputPassword);
}

export const rateLimiterMiddleware = (ip: string) => {
  const now = Date.now();
  const windowStart = now - 60 * 1000; // 1 minute ago

  // Lấy timestamps từ cache
  const requestTimestamps = get(rateLimiter, ip, []);

  // Loại bỏ timestamps cũ hơn cacheTime
  const recentTimestamps = requestTimestamps.filter((timestamp) => timestamp > windowStart);

  // Giới hạn kích thước mảng timestamps
  if (recentTimestamps.length >= maxCacheSize) {
    recentTimestamps.splice(0, recentTimestamps.length - maxCacheSize);
  }

  // Cập nhật cache với timestamps mới
  set(rateLimiter, ip, recentTimestamps.concat(now));

  return recentTimestamps.length <= rateLimit;
};

export const rateLimiterMiddlewareByCount = (ip: string, limit: number) => {
  const now = Date.now();
  const windowStart = now - 60 * 1000; // 1 minute ago

  // Lấy timestamps từ cache
  const requestTimestamps = get(rateLimiter, ip, []);

  // Loại bỏ timestamps cũ hơn cacheTime
  const recentTimestamps = requestTimestamps.filter((timestamp) => timestamp > windowStart);

  // Giới hạn kích thước mảng timestamps
  if (recentTimestamps.length >= maxCacheSize) {
    recentTimestamps.splice(0, recentTimestamps.length - maxCacheSize);
  }

  // Cập nhật cache với timestamps mới
  set(rateLimiter, ip, recentTimestamps.concat(now));

  return recentTimestamps.length <= limit;
};

export function getCurrentDomain() {
  const parts = window.location.hostname.split('.');
  parts.shift();
  return parts.join('.');
}

export function findIdWithTransaction(text: string) {
  // Chuyển đổi chuỗi thành chữ hoa và loại bỏ các khoảng trắng
  const formattedText = text.toUpperCase().replace(/\s+/g, '');

  // Thực hiện kiểm tra với chuỗi đã được định dạng
  const data = formattedText.match(/NAP9D(\d+)CONHAN/);

  if (data) {
    return data[1];
  }

  return null;
}

export async function delay(ms: number) {
  return new Promise((resolve) => {
    setTimeout(resolve, ms);
  });
}

export function removeVietnamese(str: string) {
  // Bảng chữ cái tiếng Việt có dấu và không dấu
  if (str) {
    const withSigns: string = 'áàảãạăắằẳẵặâấầẩẫậéèẻẽẹêếềểễệóòỏõọôốồổỗộơớờởỡợúùủũụưứừửữựíìỉĩịýỳỷỹỵđ';
    const withoutSigns: string =
      'aaaaaaaaaaaaaaaaaeeeeeeeeeeeooooooooooooooooouuuuuuuuuuuiiiiiiiiiyyyyyd';

    // Thay thế các ký tự tiếng Việt có dấu bằng ký tự không dấu tương ứng
    for (let i: number = 0; i < withSigns.length; i += 1) {
      const regex: RegExp = new RegExp(withSigns[i] as string, 'g');
      str = str.replace(regex, withoutSigns[i] as string);
    }

    const slugifiedString: string = str.replace(/[\s/]/g, '-');
    return slugifiedString;
  }
  return '';
}

// gifcode

// Hàm tạo số ngẫu nhiên với độ dài lớn
function generateRandomNumber(length: number): number {
  return Math.floor(Math.random() * 10 ** length);
}

// Hàm tạo phần dạng chữ cái ngẫu nhiên
function generateRandomString(length: number): string {
  const characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789';
  let result = '';
  for (let i = 0; i < length; i += 1) {
    result += characters.charAt(Math.floor(Math.random() * characters.length));
  }
  return result;
}

function generateGiftCode(): string {
  const part1 = generateRandomString(4);
  const part2 = generateRandomString(4);
  const part3 = generateRandomString(4);
  const part4 = generateRandomNumber(4).toString().padStart(4, '0');
  // Chuyển đổi thành chữ in hoa
  return `${part1}-${part2}-${part3}-${part4}`.toUpperCase();
}

export function generateGiftCodeList(quantity: number): string[] {
  return Array.from({ length: quantity }, () => generateGiftCode());
}

export function isExpiredDate(expirationDate: string): boolean {
  const currentDateTime = new Date();

  const expirationDateTime = new Date(expirationDate);

  return currentDateTime > expirationDateTime;
}

export function calculateDiscount(promotion: any) {
  const currentDate = new Date();
  const startDate = new Date(promotion?.start_date);
  const endDate = new Date(promotion?.end_date);

  // Kiểm tra xem khuyến mãi có đang hoạt động không
  if (promotion?.is_active && currentDate >= startDate && currentDate <= endDate) {
    // Nếu đang trong thời gian khuyến mãi, tính tỉ lệ khuyến mãi
    return promotion;
  }
  // Nếu không đang trong thời gian khuyến mãi, hoặc khuyến mãi không hoạt động, trả về null
  return null;
}

function toVietNameseCash(so: string | number): string {
  if (so == null || so === '') {
    return '';
  }

  so = so.toString().replace(/[^0-9.]/g, '');

  if (Number(so) === 0 || so === '') {
    return '';
  }

  let chuoi = '';
  let hauto = '';

  do {
    const ty = Number(so) % 1000000000;
    so = Math.floor(Number(so) / 1000000000);

    if (so > 0) {
      chuoi = dochangtrieu(ty, true) + hauto + chuoi;
    } else {
      chuoi = dochangtrieu(ty, false) + hauto + chuoi;
    }

    hauto = ' tỷ';
  } while (so > 0);

  return chuoi;
}

function capitalizeFirstLetter(string: string): string {
  if (string.length > 1) {
    return string.charAt(0).toUpperCase() + string.slice(1);
  }

  return string;
}

function dochangtrieu(so: number, daydu: boolean): string {
  let chuoi = '';
  const trieu = Math.floor(so / 1000000);
  so %= 1000000;

  if (trieu > 0) {
    chuoi = `${docblock(trieu, daydu)} Triệu`;
    daydu = true;
  }

  const nghin = Math.floor(so / 1000);
  so %= 1000;

  if (nghin > 0) {
    chuoi += `${docblock(nghin, daydu)} Nghìn`;
    daydu = true;
  }

  if (so > 0) {
    chuoi += docblock(so, daydu);
  }

  return chuoi;
}

function docblock(so: number, daydu: boolean): string {
  let chuoi = '';
  const tram = Math.floor(so / 100);
  so %= 100;

  if (daydu || tram > 0) {
    chuoi = ` ${mangso[tram]} Trăm`;
    chuoi += dochangchuc(so, true);
  } else {
    chuoi = dochangchuc(so, false);
  }

  return chuoi;
}

function dochangchuc(so: number, daydu: boolean): string {
  let chuoi = '';
  const chuc = Math.floor(so / 10);
  const donvi = so % 10;

  if (chuc > 1) {
    chuoi = ` ${mangso[chuc]} Mươi`;

    if (donvi === 1) {
      chuoi += ' Mốt';
    }
  } else if (chuc === 1) {
    chuoi = ' Mười';

    if (donvi === 1) {
      chuoi += ' Một';
    }
  } else if (daydu && donvi > 0) {
    chuoi = ' Lẻ';
  }

  if (donvi === 5) {
    if (chuc === 0) {
      chuoi += ' năm';
    } else {
      chuoi += ' lăm';
    }
  } else if (donvi > 1 || (donvi === 1 && chuc === 0)) {
    chuoi += ` ${mangso[donvi]}`;
  }

  return chuoi;
}

// Assuming mangso is defined somewhere
const mangso = ['', 'Một', 'Hai', 'Ba', 'Bốn', 'Năm', 'Sáu', 'Bảy', 'Tám', 'Chín'];

// You can now use dochangtrieu, docblock, and dochangchuc functions as needed

export function amountToWord(amount: string): string {
  let aWord = '';

  if (amount && amount.length > 0) {
    const textAmount = amount.replace(/[^0-9]/g, '');

    aWord = capitalizeFirstLetter(`${toVietNameseCash(textAmount).toLowerCase().trim()} đồng`);
  }

  return aWord;
}
