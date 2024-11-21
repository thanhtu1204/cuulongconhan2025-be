enum APIStatusCode {
  SUCCESS = 200,
  CREATED = 201,
  BAD_REQUEST = 400,
  UNAUTHORIZED = 401,
  FORBIDDEN = 403,
  NOT_FOUND = 404,
  RATE_LIMIT = 429,
  INTERNAL_SERVER = 500,
  ERR_BAD_REQUEST = 405
}

// Message lỗi bên trong API
const INNER_ERROR_MAPPING = {
  // import lỗi của từng feature vào đây
  'error.css.application.had.score': 'Lỗi lấy điểm'
};

// Lỗi Http

const API_ERROR_MAPPING = {
  [APIStatusCode.UNAUTHORIZED]: 'Hết phiên đăng nhập, vui lòng đăng nhập lại!',
  [APIStatusCode.FORBIDDEN]: 'Bạn không có quyền truy cập chức năng này!',
  [APIStatusCode.INTERNAL_SERVER]: 'Lỗi hệ thống. Hoặc không có kết nối mạng!',
  [APIStatusCode.RATE_LIMIT]: 'Vượt quá số lượt truy cập vui lòng thử lại',
  [APIStatusCode.ERR_BAD_REQUEST]: 'Lỗi hệ thống.'
};

export { API_ERROR_MAPPING, APIStatusCode, INNER_ERROR_MAPPING };
