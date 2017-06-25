let ERRCODE = 1000;
export default {
    TokenKey: 'sso:token',
    Err: {
        FA_ADD_TOKEN: {
            err: ERRCODE++,
            msg: 'Add Token Fail',
        },
        FA_CHECK_TOKEN: {
            err: ERRCODE++,
            msg: 'Check Token Fail',
        },
        FA_DELETE_TOKEN: {
            err: ERRCODE++,
            msg: 'Delete Token Fail',
        },
        FA_TOKEN_EXPIRED: {
            err: ERRCODE++,
            msg: 'Token Expired',
        },
        FA_TOKEN_INVALID: {
            err: ERRCODE++,
            msg: 'Invalid Token',
        },
        FA_TOUCH_TOKEN: {
            err: ERRCODE++,
            msg: 'Touch Token Fail',
        },
        FA_PARSE_TOKEN: {
            err: ERRCODE++,
            msg: 'Parse Token Fail',
        },
    },
};
