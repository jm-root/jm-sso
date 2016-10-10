module.exports = {
    TokenKey: 'sso_token',
    SequenceUserId: 'sso_user_id',
    VerifyCodeKey: 'sso_verifycode',
    VerifyCodeLength: 6,

    ERR: {
        OK: {
            err: 0,
            msg: '成功'
        },
        FAIL: {
            err: 1,
            msg: '失败'
        },

        FA_SYS: {
            err: 1000,
            msg: '系统错误'
        },

        FA_CREATE_USER_UID: {
            err: 1001,
            msg: '无法分配用户UID'
        },

        FA_PARAMS: {
            err: 2000,
            msg: '参数错误'
        },
        FA_NOT_EXIST: {
            err: 2001,
            msg: '用户不存在'
        },
        FA_PASSWD_ERROR: {
            err: 2002,
            msg: '密码错误'
        },
        FA_NOT_LOGIN: {
            err: 2003,
            msg: '未登录'
        },
        FA_USER_EXIST: {
            err: 2004,
            msg: '用户已存在'
        },
        FA_FIND_USER: {
            err: 2005,
            msg: '查找用户时发生系统错误'
        },
        FA_CREATE_USER: {
            err: 2006,
            msg: '创建用户时发生系统错误'
        },
        FA_USER_NOT_ACTIVE: {
            err: 2007,
            msg: '用户没有激活'
        },
        FA_USER_DELETED: {
            err: 2008,
            msg: '用户状态已删除'
        },
        FA_USER_NOT_VALID: {
            err: 2009,
            msg: '用户状态无效'
        },
        FA_UPDATE_USER: {
            err: 2010,
            msg: '更新用户时发生系统错误'
        },
        FA_SAVE_USER: {
            err: 2011,
            msg: '保存用户时发生系统错误'
        },
        FA_UPDATE: {
            err: 2011,
            msg: '保存用户时发生系统错误'
        },
        FA_SAVE_TOKEN: {
            err: 2020,
            msg: '保存TOKEN时发生系统错误'
        },
        FA_CHECK_TOKEN: {
            err: 2021,
            msg: '验证TOKEN时发生系统错误'
        },
        FA_DESTROY_TOKEN: {
            err: 2022,
            msg: '删除TOKEN时发生系统错误'
        },
        FA_TOKEN_EXPIRED: {
            err: 2023,
            msg: 'TOKEN已经过期'
        },
        FA_TOUCH_TOKEN: {
            err: 2024,
            msg: '延长TOKEN过期时间时发生系统错误'
        },
        FA_PARSE_TOKEN: {
            err: 2025,
            msg: '无法解析TOKEN'
        },
        FA_SAVE_VERIFYCODE: {
            err: 2030,
            msg: '保存验证码时发生系统错误'
        },
        FA_CHECK_VERIFYCODE: {
            err: 2031,
            msg: '验证验证码时发生系统错误'
        },
        FA_DESTROY_VERIFYCODE: {
            err: 2032,
            msg: '删除验证码时发生系统错误'
        },
        FA_VERIFYCODE_EXPIRED: {
            err: 2033,
            msg: '验证码已经过期'
        },
        FA_PARSE_VERIFYCODE: {
            err: 2034,
            msg: '无法解析验证码'
        },
        FA_CREATE_VERIFYCODE: {
            err: 2035,
            msg: '创建验证码时发生系统错误'
        }

    }
};
