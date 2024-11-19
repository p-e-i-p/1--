function createUserList() {
  return {
    status: 0,
    data: [
      {
        token: 'Admin Token',
        _id: '5c3b297dea95883f340178b0',
        username: 'test1',
        name: '测试用户1',
        password: '1234',
        phone: '13112345678',
        role_id: '614441a3a8edad019bb0e114',
        create_time: 1632726464736,
        __v: 0,
        role: {
          _id: '614442aba8edad019bb0e12e',
          name: '管理员',
          menus: [
            '/home',
            '/user',
            '/role',
            '/school',
            '/majors',
            '/student',
            '/class',
          ],
          create_time: 1632726464736,
          auth_time: 1632726464736,
          auth_name: 'admin',
        },
      },
      {
        token: 'System Token',
        _id: '6c3b297dea95883f340178b0',
        username: 'admin',
        name: 'admin',
        password: 'admin',
        phone: '13112345678',
        create_time: 1632726464736,
        __v: 0,
        role: {
          menus: [],
        },
      },
    ],
  }
}

// 对外暴露一个数组，数组中包含登录和获取用户信息两个接口
export default [
  {
    // 登录接口
    url: '/mock/login',
    method: 'post',
    response: ({ body }) => {
      const { username, password } = body
      const checkUser = createUserList().data.find(
        (item) => item.username == username && item.password == password,
      )
      // 没有查阅到用户信息，需要返回登录失败
      if (!checkUser) {
        return { status: 1, msg: '用户名或密码错误' }
      }
      // 登录成功，返回查询到的用户token值
      const { token } = checkUser
      return { status: 0, data: { token } }
    },
  },
  {
    // 获取用户信息
    url: '/mock/user/info',
    method: 'get',
    // request参数：接收前端提交的数据
    response: (request) => {
      const token = request.headers.token
      const checkUser = createUserList().data.find(
        (item) => item.token == token,
      )
      // 没有查阅到用户信息，需要返回登录失败
      if (!checkUser) {
        return { status: 1, msg: '获取用户信息失败' }
      }
      // 返回成功，用户信息数据对象
      return { status: 0, data: { ...checkUser } }
    },
  },
]
