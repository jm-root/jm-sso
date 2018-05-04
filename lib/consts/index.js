let BaseErrCode = 1100
module.exports = {
  TokenKey: 'sso:token', // 默认tokenKey
  TokenExpire: 7200, // 默认token过期时间
  Err: {
    FA_ADD_TOKEN: {
      err: BaseErrCode + 1,
      msg: 'Add Token Fail'
    },
    FA_VERIFY_TOKEN: {
      err: BaseErrCode + 2,
      msg: 'Verify Token Fail'
    },
    FA_DELETE_TOKEN: {
      err: BaseErrCode + 3,
      msg: 'Delete Token Fail'
    },
    FA_INVALID_TOKEN: {
      err: BaseErrCode + 4,
      msg: 'Invalid Token'
    },
    FA_TOUCH_TOKEN: {
      err: BaseErrCode + 5,
      msg: 'Touch Token Fail'
    }
  }
}
