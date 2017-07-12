let BaseErrCode = 1100;
export default {
    TokenKey: 'sso:token',
    Err: {
        FA_ADD_TOKEN: {
            err: BaseErrCode + 1,
            msg: 'Add Token Fail',
        },
        FA_CHECK_TOKEN: {
            err: BaseErrCode + 2,
            msg: 'Check Token Fail',
        },
        FA_DELETE_TOKEN: {
            err: BaseErrCode + 3,
            msg: 'Delete Token Fail',
        },
        FA_TOKEN_EXPIRED: {
            err: BaseErrCode + 4,
            msg: 'Token Expired',
        },
        FA_TOKEN_INVALID: {
            err: BaseErrCode + 5,
            msg: 'Invalid Token',
        },
        FA_TOUCH_TOKEN: {
            err: BaseErrCode + 6,
            msg: 'Touch Token Fail',
        },
        FA_PARSE_TOKEN: {
            err: BaseErrCode + 7,
            msg: 'Parse Token Fail',
        },
    },
};
