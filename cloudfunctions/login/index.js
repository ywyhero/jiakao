// 云函数模板
// 部署：在 cloud-functions/login 文件夹右击选择
const cloud = require('wx-server-sdk')
// 初始化 cloud
cloud.init()
const db = cloud.database({
  env: 'car-9c91ad'
})
const carCollection = db.collection('users')


/**
 * 这个示例将经自动鉴权过的小程序用户 openid 返回给小程序端
 * 
 * event 参数包含小程序端调用传入的 data
 * 
 */
exports.main = async (event, context) => {
  // 可执行其他自定义逻辑
  // console.log 的内容可以在云开发云函数调用日志查看

  // 获取 WX Context (微信调用上下文)，包括 OPENID、APPID、及 UNIONID（需满足 UNIONID 获取条件）
  const { OPENID, UNIONID } = cloud.getWXContext()
  let user = await carCollection.where({ openId: OPENID }).get();
  if (user.data.length > 0) {
    return {
      code: 200000001,
      msg: '该用户已存在'
    }
  }
  const { nickName, country, gender, province, city } = event
  console.log(nickName, country, gender, province, city )
  try {

    await carCollection.add({
      data: {
        userId: OPENID,
        username: nickName,
        country: country,
        province: province,
        city: city,
        sex: gender === 1 ? '男' : '女'
      }
    })
    return {
      code: 200,
      data: {
        openId: OPENID,
        unionId: UNIONID
      }
    }
  } catch (e) {
    console.error(e)
  }
}
