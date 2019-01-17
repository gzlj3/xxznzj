// 云函数入口文件
const cloud = require('wx-server-sdk')

cloud.init()
const db = cloud.database();

// 云函数入口函数
exports.main = async (event, context) => {
  const wxContext = cloud.getWXContext()
  let result = await db.collection('userb').field({ userType: true, nickName: true, avatarUrl: true, collid: true, yzhid: true, granted: true, grantedSjhm: true, config: true }).where({
    openId:'aaaaaaaa'
  }).get();
  console.log(result);

  return {
    event,
    openid: wxContext.OPENID,
    appid: wxContext.APPID,
    unionid: wxContext.UNIONID,
  }
}