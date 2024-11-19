# 项目描述

是基于vue3完成的RBAC学员管理系统，该项目主要针对学校学生、教师、班级、专业等进行统一管理的后台管理的使用平台，因为在校学生较多而且分布的班级和授课教师及学管比较杂，不方便信息查询以及维护，所以将所有学生及教师等集中到ige平台上方面快速查询信息

# 技术选型

vue3全家桶 省去复杂的节点操作，实现双向数据绑定，很多程度降低页面维护的难度
vueDevTools vue路由、组件、pinia中的信息和数据和状态
vueRouter 配置路由链接进行组件切换展示，配置子路由、路由传递参数、路由守卫进行拦截用户登录状态
vueLoader 打包.vue单文件组件
Vite 搭建项目基本结构
pinia 各模块数据存储统一管理，接口调用方法统一管理
typescript 数据类型、api、接口
pnpm 安装各种依赖
axios 手动封装、配置请求和响应的拦截器，主要用于loading效果开启和关闭、全局异常统一处理、当前登录用户所属角色权限被修改时强制退出重新登录、判断http状态码
es6 let const 箭头函数 promise async await 结构赋值 api（数组）
element-plus dropdown下拉菜单 form表单 navMenu导航菜单 table表格 pagination分页 message消息提示 upload图片上传。。。
babel 将es6语法代码转换为es5 防止浏览器不识别
eslint 语法检查和格式化
prettier 代码质量检查工具 格式化
stylelint css的lint工具 格式化css代码
husky 在每次git提交时自动格式化代码 防止代码格式不统一
commitlint 主要针对commit信息统一规范
mock 模拟数据
tonken 令牌
tinymce 富文本编辑器
echars 图表展示

# 项目开发流程

通过vite创建项目基本结构
项目配置
eslint
prettier
styelint
husky
commitlint
强制使用pnpm包管理工具
集成element-plus
src别名配置
环境常量配置
mock数据使用
封装axios
api接口统一管理
路由配置
登录管理
静态页面
表单校验
api文件夹中创建对应的模块 配置请求路径 创建登录链接后端接口方法
创建用户仓库 配置ts数据类型 数据存储 调用api接口的actions

# 项目难点

1.动态渲染左侧导航栏中的内容
更加当前登录的用户所属角色的权限进行动态渲染
创建数组用于存储全部导航栏要展示的数据（menuConfig.ts）
渲染之前先判断如果当前登录用户为admin则全部展示
判断当前要展示的菜单项是否为公开的isPublic
循环遍历menuConfig.ts中的数组，遍历的同时判断当前登录用户的权限列表（menus）中是否包含被遍历到的数组元素（item）中的index属性，一级菜单判断完毕之后再将拥有多级菜单的选项传入进行判断（hashAuth方法）
定义方法（getMenuNodes）判断如果hashAuth返回为true则代表要展示此项，将需要展示的选项添加到一个临时数组中，将这个数组进行返回
根据这个数组渲染页面中的菜单项 一级菜单使用el-menu-item 多级菜单使用el-sub-menu 并且进行递归处理2.图片上传
使用element-plus中的upload中的照片墙
action 上传图片的接口地址（注意拼接）
accept 接口文件类型
name 请求参数名
list-type 卡片样式
file-list 所以已上传图片数组
on-change 事件 文件状态改变时的钩子函数，添加文件，上传成功和失败时会自动调用 参数1：file 代表当前选择的图片（status状态、success成功、ready准备上传、fail失败），fileList已选中的图片3.富文本编辑器使用

# 项目中遇到的问题

1.设置角色权限时选择一级树形节点后再选择二级节点，会将最后一个一级节点删除掉
原因：在树形控件节点选中回调函数中判断如果有取消勾选会从数组中删除，由于选择二级控件时，会触发父级节点（students）取消勾选，所以判断时从数组删除元素，删除时是根据当前选项在数组中的索引，但是students在数组中并不存在，所以获取索引时返回-1 数组删除api如果第一个参数传入-1则代表从最后一个删除，所以会将已选择数组中的最后一个一级菜单项进行删除
解决办法：删除之前先判断如果要删除的元素索引存在（不为-1）在进行删除2.更换角色设置权限时，依然显示上一个的信息
原因：获取要设置权限的角色原有信息时在组件的onMounted中进行获取的（这个组件显示在弹窗中），设置完毕后将弹窗关闭，但是组件并没有销毁，所当为另外一个角色设置权限时不会重新调用onMounted方法，所以没有更新角色信息
解决方法：当弹窗关闭的时候将组件也进行销毁，利用v-if 引用为false时会将这组件节点从dom树中移除，下一次弹窗再展示时会重新加载此组件（onMounted钩子函数重新执行）从而获取到新的角色原有信息3.上传照片时，已选择2张，点击删除第1张的时候，其实真正删除的是第2张
原因：从filetList中删除的时候是通过图片名称（字符串）去查询在fileList中的索引，但是fileList中的每个元素是对象，所以返回的索引为-1
解决方法：将查询索引时使用filet.name（文件名称）换成file（文件对象）