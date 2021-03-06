/**
 *用户相关请求模块
 */
import request from '@/utils/request'

//在非组件模块中获取 store 必须通过这种方式
//这里单独加载 store ，和在组件中 this.$store 一个东西 
import store from '@/store/'

/**
 *登录 / 注册
 */
 export const login = data => {
     return request ({
         method: 'POST',
         url: '/app/v1_0/authorizations',
         data
     })
 }

/**
 *获取短信验证码
 */
export const sendSms = mobile => {
    return request({
        method: 'GET',
        url: `/app/v1_0/sms/codes/${mobile}`
    })
}

// 获取用户的信息
// Path：  /app/v1_0/user
// Method： GET
export const getUserInfo = () => {
    return request({
        method: 'GET',
        url: '/app/v1_0/user'
    })
}