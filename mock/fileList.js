import Mock from 'mockjs'

const List = []
const count = 100

for (let i = 0; i < count; i++) {
    List.push(Mock.mock({
        ID: '@increment',
        Name: '@name',
        'Type|1': ['文件夹', '文本文档', '应用程序', 'WinRAR 压缩文件', 'WinRAR ZIP 压缩文件', 'Microsoft Excel 工作表',
            'Microsoft PowerPoint 演示文稿', 'Microsoft Word 文档'
        ],
        CreateTime: '@dateTime',
        CreateUser: '@first' + ' ' + '@last',
        Size: '@integer(100,1024)' + 'KB'
    }))
}

export default [{
    url: '/file/list',
    type: 'get',
    response: config => {
        const { id, name, type, created_time, size, page = 1, limit = 10, sort } = config.query

        let mockList = List.filter(item => {
            if (id && item.id.indexOf(id) < 0) return false
            if (name && item.name.indexOf(name) < 0) return false
            if (type && (type == 0 ? 'directory' : 'file') !== item.type) return false
            if (created_time && !item.created_time.includes(created_time)) return false
            return true
        })
        if (sort === '-id') {
            mockList = mockList.reverse()
        }
        const pageList = mockList.filter((item, index) => index < limit * page && index >= limit * (page - 1))
        return {
            code: 20000,
            data: {
                total: mockList.length,
                items: pageList
            }
        }
    }
}]