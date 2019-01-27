// 云函数模板
// 部署：在 cloud-functions/login 文件夹右击选择 “上传并部署”

const cloud = require('wx-server-sdk')
// 初始化 cloud
cloud.init()
const db = cloud.database({
  env: 'car-9c91ad'
})
/**
 * 这个示例将经自动鉴权过的小程序用户 openid 返回给小程序端
 * 
 * event 参数包含小程序端调用传入的 data
 * 
 */
const MAX_LIMIT = 100
exports.main = async (event, context) => {
  // 获取 WX Context (微信调用上下文)，包括 OPENID、APPID、及 UNIONID（需满足 UNIONID 获取条件）
  const { subject, model, type } = event
  const { OPENID, UNIONID } = cloud.getWXContext()
  let dataType = ''
  if(subject === 1 && (model === 'c1' || model === 'c2')) {
    dataType = 'car_subjects'
  } else if (subject === 1 &&model === 'b1') {
    dataType = 'b1_subjects'
  } else if (subject === 1 && model === 'b1') {
    dataType = 'b1_subjects'
  } else if (subject === 1 && model === 'b2') {
    dataType = 'b2_subjects'
  } else if (subject === 1 && model === 'a1') {
    dataType = 'a1_subjects'
  } else if (subject === 1 && model === 'a2') {
    dataType = 'a2_subjects'
  } else if (subject === 4) {
    dataType = 'm4_subjects'
  }
 
  const subjectsCollection = db.collection(dataType)
  console.log('dataType:', dataType)
  const total = await subjectsCollection.count();
  const times = Math.ceil(total.total / 100);
  const tasks = []
  for (let i = 0; i < times; i++) {
    const promise = subjectsCollection.skip(i * MAX_LIMIT).limit(MAX_LIMIT).get();
    tasks.push(promise)
  }
  if (type === "order") {
    return (await Promise.all(tasks)).reduce((acc, cur) => ({
      data: acc.data.concat(cur.data),
      errMsg: acc.errMsg,
      total: total.total
    }))
  } else {
    console.log(await Promise.all(tasks))
    let results = await Promise.all(tasks)
    let lists = results.reduce((acc, cur) => ({
      data: acc.data.concat(cur.data),
    }))
    let questions = []
    for(let i = 0; i < 100; i++) {
      let index = Math.floor(Math.random() * lists.data.length)
      questions.push(lists.data[index])
    }
    return questions
  }
  
}
