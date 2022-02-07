/**
 * 请求模块
 */
import axios from 'axios'
// 在非组件模块中获取 store 必须通过这种方式
// 这里单独加载 store，和在组件中 this.$store 一个东西
import store from '@/store'
import router from '@/router'
import { Toast } from 'vant'




const refreshTokenReq = axios.create({
    baseURL: 'http://api-toutiao-web.itheima.net',// 基础路径
})


const request = axios.create({
    baseURL: 'http://api-toutiao-web.itheima.net',
    timeout: 5000
    // headers: {
    //     'Content-Type': 'application/x-www-form-urlencoded'
    // }
    // transformResponse:[function(data){
    //     try {
    //         return JSONbig.parse(data)
    //     } catch (error) {
    //         console.log("转换失败",error);
    //         return data
    //     }
    // }]
})


// 请求拦截器  发请求之前，拦截器可以监测到
// Add a request interceptor
request.interceptors.request.use(function(config) {
    //config 配置对象 
    //Do something before request is sent
    const { user } = store.state
    if (user) {
        config.headers.Authorization = `Bearer ${user.token}`
    }
    // 处理完之后一定要把 config 返回，否则请求就会停在这里
    return config;
}, function (error) {
    // Do something with request error
    return Promise.reject(error)
  }
)


// 响应失败
request.interceptors.response.use((response) => {
    return response;
}, async function (error) {
    console.log(error.response);
    const status = error.response.status;
    if (status == 400) {
        // 参数错误
        Toast.fail('请求参数错误~')
    } else if (status == 401) {
        // token无效
        // 如果没有user 则跳转登录页重新登录
        // 有user  拿着刷新token去重新登录
        const {
            user
        } = store.state;
        if (!user || !user.token) {
            // 未登录 重新登录
            redirectLogin()
        } else {
            try {
                const {
                    data
                } = await refreshTokenReq({
                    url: '/app/v1_0/authorizations',
                    method: "PUT",
                    headers: {
                        Authorization: `Bearer ${user.refresh_token}`
                    }
                })
                user.token = data.data.token;
                store.commit('SETUSER', user);
                // 处理完usertoken 重新发起请求
                return request(error.config);
            } catch (error) {
                // 刷新失败 直接跳转登录页
                Toast.fail('登录验证失败，请重新登录~');
                store.state.user = null;
                store.commit('REMOVECACHEPAGE', 'layout');
                // redirectLogin()

            }
        }
    } else if (status == 403) {
        // 无权限
        Toast.fail('您没有权限~')
    } else if (status >= 500) {
        // 服务端异常
        Toast.fail('服务端出现异常~')
    }

    return Promise.reject(error)
})

function redirectLogin() {
    router.replace({
        name: 'login',
        query: {
            redirect: router.currentRoute.fullPath
        }
    })
}

// 导出
export default request;