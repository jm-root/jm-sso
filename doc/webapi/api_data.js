define({ "api": [
  {
    "group": "sso",
    "version": "0.0.1",
    "type": "get",
    "url": "/verifyCode/check",
    "title": "验证验证码",
    "name": "checkVerifyCode",
    "parameter": {
      "fields": {
        "Parameter": [
          {
            "group": "Parameter",
            "type": "String",
            "optional": false,
            "field": "key",
            "description": "<p>保存验证码的key</p>"
          },
          {
            "group": "Parameter",
            "type": "String",
            "optional": false,
            "field": "code",
            "description": "<p>验证码</p>"
          }
        ]
      }
    },
    "success": {
      "fields": {
        "Success 200": [
          {
            "group": "Success 200",
            "type": "Boolean",
            "optional": false,
            "field": "ret",
            "description": "<p>返回结果</p>"
          }
        ],
        "Error 200": [
          {
            "group": "Error 200",
            "type": "Number",
            "optional": false,
            "field": "err",
            "description": "<p>错误代码</p>"
          },
          {
            "group": "Error 200",
            "type": "String",
            "optional": false,
            "field": "msg",
            "description": "<p>错误信息</p>"
          }
        ]
      }
    },
    "examples": [
      {
        "title": "成功:",
        "content": "{\n  ret: true\n}",
        "type": "json"
      },
      {
        "title": "失败:",
        "content": "{\n  ret: false\n}",
        "type": "json"
      },
      {
        "title": "错误:",
        "content": "{\n  err: 错误代码\n  msg: 错误信息\n}",
        "type": "json"
      }
    ],
    "filename": "../lib/router/verifyCode.js",
    "groupTitle": "sso",
    "sampleRequest": [
      {
        "url": "http://localhost:20100/sso/verifyCode/check"
      }
    ]
  },
  {
    "group": "sso",
    "version": "0.0.1",
    "type": "get",
    "url": "/user",
    "title": "获取个人用户信息",
    "name": "getUser",
    "parameter": {
      "fields": {
        "Parameter": [
          {
            "group": "Parameter",
            "type": "String",
            "optional": true,
            "field": "token",
            "description": "<p>token</p>"
          }
        ]
      }
    },
    "success": {
      "fields": {
        "Success 200": [
          {
            "group": "Success 200",
            "type": "String",
            "optional": false,
            "field": "id",
            "description": "<p>id</p>"
          },
          {
            "group": "Success 200",
            "type": "String",
            "optional": true,
            "field": "uid",
            "description": "<p>uid</p>"
          },
          {
            "group": "Success 200",
            "type": "String",
            "optional": true,
            "field": "nick",
            "description": "<p>昵称</p>"
          },
          {
            "group": "Success 200",
            "type": "String",
            "optional": true,
            "field": "creator",
            "description": "<p>创建者id</p>"
          }
        ],
        "Error 200": [
          {
            "group": "Error 200",
            "type": "Number",
            "optional": false,
            "field": "err",
            "description": "<p>错误代码</p>"
          },
          {
            "group": "Error 200",
            "type": "String",
            "optional": false,
            "field": "msg",
            "description": "<p>错误信息</p>"
          }
        ]
      }
    },
    "examples": [
      {
        "title": "成功:",
        "content": "{\n  nick: 昵称,\n  creator: 创建者id,\n  id: id\n}",
        "type": "json"
      },
      {
        "title": "错误:",
        "content": "{\n  err: 错误代码\n  msg: 错误信息\n}",
        "type": "json"
      }
    ],
    "filename": "../lib/router/index.js",
    "groupTitle": "sso",
    "sampleRequest": [
      {
        "url": "http://localhost:20100/sso/user"
      }
    ]
  },
  {
    "group": "sso",
    "version": "0.0.1",
    "type": "get",
    "url": "/verifyCode",
    "title": "获取验证码",
    "name": "getVerifyCode",
    "parameter": {
      "fields": {
        "Parameter": [
          {
            "group": "Parameter",
            "type": "String",
            "optional": false,
            "field": "key",
            "description": "<p>保存验证码的key</p>"
          },
          {
            "group": "Parameter",
            "type": "Number",
            "optional": true,
            "field": "length",
            "description": "<p>长度</p>"
          },
          {
            "group": "Parameter",
            "type": "Number",
            "optional": true,
            "field": "expire",
            "description": "<p>过期时间,单位秒</p>"
          }
        ]
      }
    },
    "success": {
      "fields": {
        "Success 200": [
          {
            "group": "Success 200",
            "type": "String",
            "optional": false,
            "field": "code",
            "description": "<p>验证码</p>"
          },
          {
            "group": "Success 200",
            "type": "Number",
            "optional": false,
            "field": "time",
            "description": "<p>生成时间</p>"
          },
          {
            "group": "Success 200",
            "type": "Number",
            "optional": false,
            "field": "expire",
            "description": "<p>过期时间</p>"
          }
        ],
        "Error 200": [
          {
            "group": "Error 200",
            "type": "Number",
            "optional": false,
            "field": "err",
            "description": "<p>错误代码</p>"
          },
          {
            "group": "Error 200",
            "type": "String",
            "optional": false,
            "field": "msg",
            "description": "<p>错误信息</p>"
          }
        ]
      }
    },
    "examples": [
      {
        "title": "成功:",
        "content": "{\n  code: 验证码,\n  time: 生成时间,\n  expire: 过期时间\n}",
        "type": "json"
      },
      {
        "title": "错误:",
        "content": "{\n  err: 错误代码\n  msg: 错误信息\n}",
        "type": "json"
      }
    ],
    "filename": "../lib/router/verifyCode.js",
    "groupTitle": "sso",
    "sampleRequest": [
      {
        "url": "http://localhost:20100/sso/verifyCode"
      }
    ]
  },
  {
    "group": "sso",
    "version": "0.0.1",
    "type": "get",
    "url": "/isSignon",
    "title": "是否登录",
    "name": "isSignon",
    "parameter": {
      "fields": {
        "Parameter": [
          {
            "group": "Parameter",
            "type": "String",
            "optional": true,
            "field": "token",
            "description": "<p>token</p>"
          }
        ]
      }
    },
    "success": {
      "fields": {
        "Success 200": [
          {
            "group": "Success 200",
            "type": "Boolean",
            "optional": false,
            "field": "ret",
            "description": "<p>返回结果</p>"
          }
        ],
        "Error 200": [
          {
            "group": "Error 200",
            "type": "Number",
            "optional": false,
            "field": "err",
            "description": "<p>错误代码</p>"
          },
          {
            "group": "Error 200",
            "type": "String",
            "optional": false,
            "field": "msg",
            "description": "<p>错误信息</p>"
          }
        ]
      }
    },
    "examples": [
      {
        "title": "成功:",
        "content": "{\n  ret: true\n}",
        "type": "json"
      },
      {
        "title": "失败:",
        "content": "{\n  ret: false\n}",
        "type": "json"
      },
      {
        "title": "错误:",
        "content": "{\n  err: 错误代码\n  msg: 错误信息\n}",
        "type": "json"
      }
    ],
    "filename": "../lib/router/index.js",
    "groupTitle": "sso",
    "sampleRequest": [
      {
        "url": "http://localhost:20100/sso/isSignon"
      }
    ]
  },
  {
    "group": "sso",
    "version": "0.0.1",
    "type": "post",
    "url": "/signon",
    "title": "登录",
    "name": "signon",
    "parameter": {
      "fields": {
        "Parameter": [
          {
            "group": "Parameter",
            "type": "String",
            "optional": false,
            "field": "passwd",
            "description": "<p>密码</p>"
          },
          {
            "group": "Parameter",
            "type": "String",
            "optional": true,
            "field": "id",
            "description": "<p>id</p>"
          },
          {
            "group": "Parameter",
            "type": "String",
            "optional": true,
            "field": "uid",
            "description": "<p>uid</p>"
          },
          {
            "group": "Parameter",
            "type": "String",
            "optional": true,
            "field": "account",
            "description": "<p>账户</p>"
          },
          {
            "group": "Parameter",
            "type": "String",
            "optional": true,
            "field": "mobile",
            "description": "<p>手机号</p>"
          },
          {
            "group": "Parameter",
            "type": "String",
            "optional": true,
            "field": "email",
            "description": "<p>邮箱</p>"
          },
          {
            "group": "Parameter",
            "type": "Number",
            "optional": true,
            "field": "expire",
            "description": "<p>token过期时间(可选, 如果不填，采用系统默认值)</p>"
          }
        ]
      }
    },
    "success": {
      "fields": {
        "Success 200": [
          {
            "group": "Success 200",
            "type": "String",
            "optional": false,
            "field": "token",
            "description": "<p>token</p>"
          },
          {
            "group": "Success 200",
            "type": "String",
            "optional": false,
            "field": "id",
            "description": "<p>id</p>"
          },
          {
            "group": "Success 200",
            "type": "Number",
            "optional": false,
            "field": "expire",
            "description": "<p>token过期时间(单位秒, 0表示不过期)</p>"
          }
        ],
        "Error 200": [
          {
            "group": "Error 200",
            "type": "Number",
            "optional": false,
            "field": "err",
            "description": "<p>错误代码</p>"
          },
          {
            "group": "Error 200",
            "type": "String",
            "optional": false,
            "field": "msg",
            "description": "<p>错误信息</p>"
          }
        ]
      }
    },
    "examples": [
      {
        "title": "成功:",
        "content": "{\n  token: token,\n  id: id\n}",
        "type": "json"
      },
      {
        "title": "错误:",
        "content": "{\n  err: 错误代码\n  msg: 错误信息\n}",
        "type": "json"
      }
    ],
    "filename": "../lib/router/index.js",
    "groupTitle": "sso",
    "sampleRequest": [
      {
        "url": "http://localhost:20100/sso/signon"
      }
    ]
  },
  {
    "group": "sso",
    "version": "0.0.1",
    "type": "post",
    "url": "/signon_guest",
    "title": "游客登录",
    "name": "signon_guest",
    "parameter": {
      "fields": {
        "Parameter": [
          {
            "group": "Parameter",
            "type": "String",
            "optional": true,
            "field": "passwd",
            "description": "<p>密码</p>"
          },
          {
            "group": "Parameter",
            "type": "String",
            "optional": true,
            "field": "nick",
            "description": "<p>昵称</p>"
          },
          {
            "group": "Parameter",
            "type": "String",
            "optional": true,
            "field": "creator",
            "description": "<p>创建者id</p>"
          }
        ]
      }
    },
    "success": {
      "fields": {
        "Success 200": [
          {
            "group": "Success 200",
            "type": "String",
            "optional": false,
            "field": "token",
            "description": "<p>token</p>"
          },
          {
            "group": "Success 200",
            "type": "String",
            "optional": false,
            "field": "id",
            "description": "<p>id</p>"
          },
          {
            "group": "Success 200",
            "type": "String",
            "optional": true,
            "field": "nick",
            "description": "<p>昵称</p>"
          },
          {
            "group": "Success 200",
            "type": "String",
            "optional": true,
            "field": "creator",
            "description": "<p>创建者id</p>"
          }
        ],
        "Error 200": [
          {
            "group": "Error 200",
            "type": "Number",
            "optional": false,
            "field": "err",
            "description": "<p>错误代码</p>"
          },
          {
            "group": "Error 200",
            "type": "String",
            "optional": false,
            "field": "msg",
            "description": "<p>错误信息</p>"
          }
        ]
      }
    },
    "examples": [
      {
        "title": "成功:",
        "content": "{\n  nick: 昵称,\n  creator: 创建者id,\n  token: token,\n  id: id\n}",
        "type": "json"
      },
      {
        "title": "错误:",
        "content": "{\n  err: 错误代码\n  msg: 错误信息\n}",
        "type": "json"
      }
    ],
    "filename": "../lib/router/index.js",
    "groupTitle": "sso",
    "sampleRequest": [
      {
        "url": "http://localhost:20100/sso/signon_guest"
      }
    ]
  },
  {
    "group": "sso",
    "version": "0.0.1",
    "type": "get",
    "url": "/signout",
    "title": "注销",
    "name": "signout",
    "parameter": {
      "fields": {
        "Parameter": [
          {
            "group": "Parameter",
            "type": "String",
            "optional": true,
            "field": "token",
            "description": "<p>token</p>"
          }
        ]
      }
    },
    "examples": [
      {
        "title": "成功:",
        "content": "{\n}",
        "type": "json"
      },
      {
        "title": "错误:",
        "content": "{\n  err: 错误代码\n  msg: 错误信息\n}",
        "type": "json"
      }
    ],
    "filename": "../lib/router/index.js",
    "groupTitle": "sso",
    "sampleRequest": [
      {
        "url": "http://localhost:20100/sso/signout"
      }
    ],
    "success": {
      "fields": {
        "Error 200": [
          {
            "group": "Error 200",
            "type": "Number",
            "optional": false,
            "field": "err",
            "description": "<p>错误代码</p>"
          },
          {
            "group": "Error 200",
            "type": "String",
            "optional": false,
            "field": "msg",
            "description": "<p>错误信息</p>"
          }
        ]
      }
    }
  },
  {
    "group": "sso",
    "version": "0.0.1",
    "type": "post",
    "url": "/signup",
    "title": "注册",
    "name": "signup",
    "parameter": {
      "fields": {
        "Parameter": [
          {
            "group": "Parameter",
            "type": "String",
            "optional": true,
            "field": "passwd",
            "description": "<p>密码</p>"
          },
          {
            "group": "Parameter",
            "type": "String",
            "optional": true,
            "field": "account",
            "description": "<p>账户</p>"
          },
          {
            "group": "Parameter",
            "type": "String",
            "optional": true,
            "field": "mobile",
            "description": "<p>手机号</p>"
          },
          {
            "group": "Parameter",
            "type": "String",
            "optional": true,
            "field": "email",
            "description": "<p>邮箱</p>"
          },
          {
            "group": "Parameter",
            "type": "String",
            "optional": true,
            "field": "nick",
            "description": "<p>昵称</p>"
          },
          {
            "group": "Parameter",
            "type": "String",
            "optional": true,
            "field": "creator",
            "description": "<p>创建者id</p>"
          }
        ]
      }
    },
    "success": {
      "fields": {
        "Success 200": [
          {
            "group": "Success 200",
            "type": "String",
            "optional": false,
            "field": "id",
            "description": "<p>id</p>"
          }
        ],
        "Error 200": [
          {
            "group": "Error 200",
            "type": "Number",
            "optional": false,
            "field": "err",
            "description": "<p>错误代码</p>"
          },
          {
            "group": "Error 200",
            "type": "String",
            "optional": false,
            "field": "msg",
            "description": "<p>错误信息</p>"
          }
        ]
      }
    },
    "examples": [
      {
        "title": "成功:",
        "content": "{\n  id: id\n}",
        "type": "json"
      },
      {
        "title": "错误:",
        "content": "{\n  err: 错误代码\n  msg: 错误信息\n}",
        "type": "json"
      }
    ],
    "filename": "../lib/router/index.js",
    "groupTitle": "sso",
    "sampleRequest": [
      {
        "url": "http://localhost:20100/sso/signup"
      }
    ]
  },
  {
    "group": "sso",
    "version": "0.0.1",
    "type": "post",
    "url": "/user/ext",
    "title": "更新个人密码",
    "name": "updatePasswd",
    "parameter": {
      "fields": {
        "Parameter": [
          {
            "group": "Parameter",
            "type": "String",
            "optional": true,
            "field": "token",
            "description": "<p>token</p>"
          },
          {
            "group": "Parameter",
            "type": "String",
            "optional": true,
            "field": "newPasswd",
            "description": "<p>新密码</p>"
          }
        ]
      }
    },
    "examples": [
      {
        "title": "成功:",
        "content": "{\n}",
        "type": "json"
      },
      {
        "title": "错误:",
        "content": "{\n  err: 错误代码\n  msg: 错误信息\n}",
        "type": "json"
      }
    ],
    "filename": "../lib/router/index.js",
    "groupTitle": "sso",
    "sampleRequest": [
      {
        "url": "http://localhost:20100/sso/user/ext"
      }
    ],
    "success": {
      "fields": {
        "Error 200": [
          {
            "group": "Error 200",
            "type": "Number",
            "optional": false,
            "field": "err",
            "description": "<p>错误代码</p>"
          },
          {
            "group": "Error 200",
            "type": "String",
            "optional": false,
            "field": "msg",
            "description": "<p>错误信息</p>"
          }
        ]
      }
    }
  },
  {
    "group": "sso",
    "version": "0.0.1",
    "type": "post",
    "url": "/user",
    "title": "更新个人用户信息",
    "name": "updateUser",
    "parameter": {
      "fields": {
        "Parameter": [
          {
            "group": "Parameter",
            "type": "String",
            "optional": true,
            "field": "token",
            "description": "<p>token</p>"
          },
          {
            "group": "Parameter",
            "type": "String",
            "optional": true,
            "field": "nick",
            "description": "<p>昵称</p>"
          }
        ]
      }
    },
    "examples": [
      {
        "title": "成功:",
        "content": "{\n}",
        "type": "json"
      },
      {
        "title": "错误:",
        "content": "{\n  err: 错误代码\n  msg: 错误信息\n}",
        "type": "json"
      }
    ],
    "filename": "../lib/router/index.js",
    "groupTitle": "sso",
    "sampleRequest": [
      {
        "url": "http://localhost:20100/sso/user"
      }
    ],
    "success": {
      "fields": {
        "Error 200": [
          {
            "group": "Error 200",
            "type": "Number",
            "optional": false,
            "field": "err",
            "description": "<p>错误代码</p>"
          },
          {
            "group": "Error 200",
            "type": "String",
            "optional": false,
            "field": "msg",
            "description": "<p>错误信息</p>"
          }
        ]
      }
    }
  },
  {
    "group": "sso",
    "version": "0.0.1",
    "type": "post",
    "url": "/user/ext",
    "title": "更新个人扩展用户信息",
    "name": "updateUserExt",
    "parameter": {
      "fields": {
        "Parameter": [
          {
            "group": "Parameter",
            "type": "String",
            "optional": true,
            "field": "token",
            "description": "<p>token</p>"
          },
          {
            "group": "Parameter",
            "type": "String",
            "optional": true,
            "field": "key",
            "description": "<p>键</p>"
          }
        ]
      }
    },
    "examples": [
      {
        "title": "成功:",
        "content": "{\n}",
        "type": "json"
      },
      {
        "title": "错误:",
        "content": "{\n  err: 错误代码\n  msg: 错误信息\n}",
        "type": "json"
      }
    ],
    "filename": "../lib/router/index.js",
    "groupTitle": "sso",
    "sampleRequest": [
      {
        "url": "http://localhost:20100/sso/user/ext"
      }
    ],
    "success": {
      "fields": {
        "Error 200": [
          {
            "group": "Error 200",
            "type": "Number",
            "optional": false,
            "field": "err",
            "description": "<p>错误代码</p>"
          },
          {
            "group": "Error 200",
            "type": "String",
            "optional": false,
            "field": "msg",
            "description": "<p>错误信息</p>"
          }
        ]
      }
    }
  }
] });
