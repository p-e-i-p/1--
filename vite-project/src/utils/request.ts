import axios from "axios";
import { ElMessage, ElLoading,ElNotification } from "element-plus";
// 引入用户小仓库
import useUserStore from "@/store/modules/user";
let request = axios.create({
    // baseURL:'/mock',
    baseURL: import.meta.env.VITE_APP_BASE_API,
    timeout: 5000,
});
// 获取最新的权限列表方法
const getMenus = () => {
    // 用户小仓库
    let userStore = useUserStore();
    // 当前登录用户所属角色id
    const roleId = userStore.user?.role_id;
    // 当前登录用户的权限列表
    const userMenus = userStore.user?.role?.menus;
    // 如果当前登录的用户是超管，就不用判断了
    if (userStore.user?.username == "admin") {
        return;
    }
    // 发送请求获取最新的权限列表，和仓库中存储的权限列表进行比对
    request({
        url: "/menus",
        method: "post",
        data: {
            roleId,
        },
    }).then((response) => {
        const resp = response;
        if (resp.status == 0) {
            // 存储最新的权限列表
            const menus = resp.data.menus;
            // 如果最新的权限列表长度和登录的用户权限列表长度相同
            if (menus.length == userMenus?.length) {
                // 再判断两个数组中的元素是否相同
                userMenus?.forEach((item:any) => {
                    // 只要当前登录用户的权限数组中的某个元素在最新权限数组中不存在，那么就代表被修改了
                    if (menus.indexOf(item) == -1) {
                        // 如果最新的权限列表长度和登录的用户权限列表长度不同，肯定被修改了
                        userStore.removeUser();
                        ElMessage({
                            message: "当前登录的用户权限被修改，请重新登录",
                            type: "warning",
                        });
                        //  跳转到登录页面
                        window.location.href = "/login";
                    }
                });
            } else {
                // 如果最新的权限列表长度和登录的用户权限列表长度不同，肯定被修改了
                userStore.removeUser();
                ElMessage({
                    message: "当前登录的用户权限被修改，请重新登录",
                    type: "warning",
                });
                //  跳转到登录页面
                window.location.href = "/login";
            }
        }
        return;
    });
};
const loading = {
    loadingInstance: null,
    open() {
        if (this.loadingInstance == null) {
            // @ts-ignore
            this.loadingInstance = ElLoading.service({
                text: "拼命加载中",
                target: ".main",
                background: "rgba(0,0,0,0.5)",
            });
        }
    },
    close() {
        if (this.loadingInstance != null) {
            // @ts-ignore
            this.loadingInstance.close();
        }
        this.loadingInstance = null;
    },
};

// 请求拦截器
request.interceptors.request.use(
    function (config) {
        // 请求拦截器中config对象包含headers可以将token放到这里，之后所有的请求都会携带请求头并且包含token
        config.headers.token = localStorage.getItem("b0415-token") || "";
        if (config.url != "/menus" && config.url != "/login") {
            getMenus();
            loading.open();
        }
        return config;
    },
    function (error) {
        // Do something with request error
        loading.close();
        return Promise.reject(error);
    }
);

// 响应拦截器
request.interceptors.response.use(
    function (response) {
        loading.close();
        if(response.data.status != 0){
            ElNotification({
                title: 'Error',
                message: response.data.msg,
                type: 'error',
              })
        }
        return response.data;
    },
    function (error) {
        loading.close();
        // 定义一个变量用来存储错误信息
        let msg = "";
        // 获取http状态码
        let status = error.response.status;
        switch (status) {
            case 401:
                msg = "token过期";
                break;
            case 403:
                msg = "无权访问";
                break;
            case 404:
                msg = "请求地址错误";
                break;
            case 500:
                msg = "服务器出现错误";
                break;

            default:
                msg = "无网络";
                break;
        }
        ElMessage.error(msg);
        return Promise.reject(error);
    }
);

//   将自己封装的axios对象对外暴露
export default request;
