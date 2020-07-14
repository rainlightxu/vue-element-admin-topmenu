import request from '@/utils/request'

export function getUserList(query) {
    return request({
        url:'/vue-admin-template/user/list',
        method:'get',
        params: query
    })
}