import Mock from 'mockjs'

const data = Mock.mock({
  'items|30': [{
    id: '@increment()'  + 1,
    name: '@name',
    'group|1': ['admin','editor','visitor'],
    created_time: '@datetime',
  }]
})

export default [
  {
    url: '/vue-admin-template/user/list',
    type: 'get',
    response: config => {
      const {id,name,group,page=1,limit=10,sort} = config.query

      let mockList = data.items.filter(item => {
        if(id && item.id.indexOf(id) < 0) return false
        if(name && item.name.indexOf(name) < 0) return false
        if(group && (group == 0 ? 'admin' : (group == 1 ? 'editor' :(group == 2) ? 'visitor' : null)) !== item.group) return false
        return true
      })
      if(sort === '-id') {
        mockList = mockList.reverse()
      }
      const pageList = mockList.filter((item,index) => index < limit * page && index >= limit * (page - 1))
      return {
        code: 20000,
        data: {
          total: mockList.length,
          items: pageList
        }
      }
    }
  }
]
