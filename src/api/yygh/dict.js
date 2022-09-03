import request from '@/utils/request'
const api_name = '/admin/cmn/dict'

export default {

  // 根据id查询下级列表
  dictList(id) {
    return request({
      url: `${api_name}/findChildData/${id}`,
      method: 'get'
    })
  }

}
