import request from '@/utils/request'

export function getFileList(query) {
    return request({
        url: '/file/list',
        method: 'get',
        params: query
    })
}