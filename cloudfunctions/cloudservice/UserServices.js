const cloud = require('wx-server-sdk')
const commService = require('CommServices.js')
// const rp = require('request-promise')
const utils = require('utils.js');
const comm = require('comm.js');
const phone = require('phone.js');
const CONSTS = require('constants.js');
const config = require('config.js')
cloud.init({
  // env: config.conf.env,
})
const db = cloud.database();
const _ = db.command;

//检查权限，成功返回用户基本数据(userType,yzhid)
exports.checkAuthority = async(action,method,userInfo,data) => {

  const { openId } = userInfo;
  if ([CONSTS.BUTTON_QUERYUSER, CONSTS.BUTTON_REGISTERUSER, CONSTS.BUTTON_SENDSJYZM, CONSTS.BUTTON_USERLOGIN, CONSTS.BUTTON_USERPHONE].indexOf(action)>=0){
    //用户注册等基本操作不检查权限
    return { openId};
  }
  if ([CONSTS.BUTTON_LASTZD, CONSTS.BUTTON_HTQY].indexOf(action) >= 0 && method==='GET' && data && !utils.isEmpty(data.grantcode)) {
    //根据注册码查询帐单数据不检查权限
    return { openId};
  }
  if ([CONSTS.BUTTON_HTQY].indexOf(action) >= 0 && method === 'POST' && data && data.flag ==='savezkqm') {
    //合同签约上传租客签名不检查权限
    return { openId };
  }

  // throw utils.codeException(100);
  const db = cloud.database();
  const result = await commService.querySingleDoc('userb', { openId })
  // db.collection('userb').
  //       field({ userType: true, yzhid: true,sjhm:true,collid:true,granted:true,nickName:true,grantedSjhm:true }).where({
  //   openId
  // }).get();
  if(!result)
    throw utils.codeException(100);
  // let curUser = { userid: openId, ...result.data[0] };
  let curUser = result;
  if(utils.isEmpty(curUser.collid)) curUser.collid='';
  const { userType, yzhid, sjhm, collid} = curUser;
  if (utils.isEmpty(userType) || utils.isEmpty(yzhid) || utils.isEmpty(sjhm) || utils.isEmpty(openId))
    throw utils.codeException(101);

  // if ([CONSTS.BUTTON_ZK_SEELASTZD,].indexOf(action) >= 0) {
  //   //租客功能
  //   if(!commService.isZk(userType) && !commService.isZkFd(userType))
  //     throw utils.newException('你无权操作此功能！');
  // }

  // if(commService.isZk(userType)){
  //   if ([CONSTS.BUTTON_CB, CONSTS.BUTTON_MAKEZD, CONSTS.BUTTON_ADDFY, CONSTS.BUTTON_EDITFY, CONSTS.BUTTON_DELETEFY, CONSTS.BUTTON_EXITFY, CONSTS.BUTTON_USERGRANT, CONSTS.BUTTON_SYSCONFIG, CONSTS.BUTTON_GRANTCODE].indexOf(action) >= 0) {
  //     throw utils.codeException(101);
  //   }
  //   if ([CONSTS.BUTTON_LASTZD].indexOf(action) >= 0){
  //     if(method === 'POST') 
  //       throw utils.codeException(101);
  //     if (method === 'GET' && data && data.refreshzd==='1')  //先刷新帐单再提取数据
  //       throw utils.codeException(101);
  //   }
  //   if ([CONSTS.BUTTON_HTQY].indexOf(action) >= 0) {
  //     if (method === 'POST')
  //       throw utils.codeException(101);
  //     if (method === 'GET' && data && data.seeHouseHt !== '1')  //租客合同签约查询入口只能是查看合同
  //       throw utils.codeException(101);
  //   }
  // }  
  return curUser;
}

// exports.seeLastzd = async (curUser) => {
//   const { sjhm } = curUser;
//   console.log(sjhm);

//   const result = await commService.querySingleDoc('house', { dhhm:sjhm });
//   if (!result)
//     throw utils.newException('未查到你的租房数据，请找房东确认手机号是否输入正确！');
//   return {houseid:result._id}
// }

exports.decryptPhoneNumber = async (data,userInfo) => {
  var WXBizDataCrypt = require('./WXBizDataCrypt')
  const { openId } = userInfo;
  const { appId,phoneData } = data; 
  const result = await getSessionData(openId);
  if(!result)
    throw utils.newException('用户未登录！');
  var sessionKey = result.sessionKey;
  var encryptedData = phoneData.encryptedData;
  var iv = phoneData.iv;
  var pc = new WXBizDataCrypt(appId, sessionKey);
  var tempresult = pc.decryptData(encryptedData, iv);
  return tempresult;
}

exports.login = async (data) => {
  const { code,appId } = data;
  let result = await commService.querySingleDoc('global', { appId });
  if(!result)
    throw utils.newException('appId未配置！');
  const url = `https://api.weixin.qq.com/sns/jscode2session?appid=${appId}&secret=${result.appSecret}&js_code=${code}&grant_type=authorization_code`;

  result = await utils.requestUrl(url);
  if(result.openid){
    const loginTime = utils.currentTimeMillis();
    await getSessionData(result.openid);
    await setSessionData(result.openid, { sessionKey:result.session_key, loginTime });
    return { loginTime};
  }
  return result;
}

exports.sendSjyzm = async (data,userInfo) => {
  const { sjhm,yzhid } = data;
  const { openId } = userInfo;
  // console.log(sjhm);
  if(utils.isEmpty(sjhm) || sjhm.length!==11)
    throw utils.newException('手机号码非法！');
  //取上次发送的验证码数据
  const lastYzm = await getCachedSjyzm(openId);
  // console.log(lastYzm);
  if(lastYzm.isValid)
    throw utils.newException('上次发送的验证码还处于有效期，请稍候再发送！');

  //检查手机号是否已经注册
  let otherCond = {};
  if(!utils.isEmpty(yzhid)) otherCond = {yzhid};
  const result = await commService.querySingleDoc('userb',{...otherCond,sjhm});
  if(result)
    throw utils.newException('此手机号已经注册，如果非你本人操作，请联系管理员！');
  
  const yzm = utils.getRandom(6);
  const message="验证码："+yzm+",您正在注册极简出租，验证码2分钟内有效。";
  console.log(message);
  // try{ 
    await phone.sendPhoneMessage(sjhm,message);  //短信发送失败会抛出异常
  // }catch(e){
  //   console.log(e);
  // }
  //短信发送成功，则将验证码写入缓存
  const yzmCreateTime = utils.currentTimeMillis();
  // console.log(yzmCreateTime);
  await setSessionData(openId, { yzm, yzmCreateTime});
}

const setSessionData = async (openId,data) => {
  const db = cloud.database();
  const result = await db.collection('session').where({
    openId
  }).update({data});
  // console.log('setsessiondata');  
  // console.log(result);
  const updatedNum = result.stats.updated;
  if(updatedNum<1) throw utils.newException('会话数据写入错误!'); 
  return updatedNum;
}

const getSessionData = async (openId) => {
  const db = cloud.database();
  const result = await db.collection('session').where({
    openId
  }).get();
  // console.log('query session');
  // console.log(result);
  if (result && result.data.length > 0) {
    return result.data[0];
  }else{
    //插入一条会话记录
    commService.addDoc('session', { openId });
  }
  return {}
}

//取上次发送的验证码数据,返回验证码和有效状态
const getCachedSjyzm = async (openId)=>{
  const result = await getSessionData(openId);
  console.log(result); 
  const {yzm,yzmCreateTime} = result;
  if(!utils.isEmpty(yzm)){
    const current = utils.currentTimeMillis();
    // console.log(current);
    // console.log(current - yzmCreateTime);    
    const isValid = (current - yzmCreateTime) < (config.conf.yzmYxq*1000);
    return {yzm,isValid};
  }
  return {yzm:null,isValid:false}
}

//根据用户的openid查询用户表数据
const queryUser = async (userInfo) => {
  const {openId} = userInfo;
  let result = await commService.querySingleDoc('userb',{openId});
  return result;
  // const db = cloud.database();
  // console.log('queruser:', openId);
  // let result = await db.collection('userb').field({ userType: true, nickName:true,avatarUrl:true,collid:true,yzhid:true,granted:true,grantedSjhm:true,config:true}).where({
  //   openId
  // }).get();
  // if(result && result.data.length>0){
  //   result = result.data[0];
  //   // if(result.granted){
  //   //   result.rights = [...result.granted.rights];
  //   //   delete result.granted;
  //   // }
  //   // console.log('queryuser:', result);
  //   return result;
  // }
  // return null;
}
exports.queryUser = queryUser;


exports.grantUser = async (data, curUser) => {
  const { sjhm,rights } = data;
  const { yzhid:sourceYzhid,sjhm:sourceSjhm } = curUser;
  const userb = await commService.querySingleDoc('userb', { sjhm });
  if (!userb)
    throw utils.newException(`手机号(${sjhm})还未注册！`);
  if ((comm.isUserType1(curUser) || comm.isUserType3(curUser)) && !comm.isUserType3(userb)){
    //管理者和教职工只能授给教职工
    throw utils.newException(`只能授权给教职工！`);
  }
  if (comm.isUserType2(curUser) && !comm.isUserType2(userb)) {
    //家长只能授权给家长
    throw utils.newException(`只能授权给家长！`);
  }
  if (sourceSjhm === sjhm)
    throw utils.newException(`不能授权给本人！`);
  
  const oldGranted = userb.granted
  let newGranted = [];
  let found = false;
  let grantedState = '';
  if (oldGranted){
    oldGranted.map(value=>{
      if(!value) return;
      const {yzhid,sjhm} = value;
      // console.log('1:',yzhid,sourceYzhid);
      if (sourceSjhm===sjhm && sourceYzhid === yzhid){
        if (rights && rights.length > 0){
          //之前已经有授权，且本次有授权，则修改授权
          found = true;
          newGranted.push(getNewGrant(curUser,rights));
          grantedState = 'modify';
        }
      }else{
        newGranted.push(value);
      }
    })
  }
  if (!found){
    if (rights && rights.length>0){
      //新授权
      newGranted.push(getNewGrant(curUser, rights));
      grantedState = 'add';
    }else{
      //删除授权
      grantedState = 'delete';
    }
  }
  userb.granted = newGranted;
  // console.log('granted userb:',userb);
  userb.zhxgr = curUser.openId;
  userb.zhxgsj = utils.getCurrentTimestamp;
  let updatedNum = await commService.updateDoc('userb', userb);
  if(updatedNum===0){
    throw utils.newException('本次授权无修改！');  
  }else{
    //修改本次授权的手机号
    let {grantedSjhm} = curUser;
    if(!grantedSjhm) grantedSjhm = [];
    let newGrantedSjhm = [];
    let addFound  =false;
    for(let i=0;i<grantedSjhm.length;i++){
      // if (typeof (grantedSjhm[i]) === 'string'){
      //   //兼容处理,将之前授权的字串改为对象
      //   grantedSjhm[i] = { sjhm: grantedSjhm[i]};
      // };
      if (grantedState === 'delete' && sjhm === grantedSjhm[i].sjhm) continue;
      if ((grantedState === 'modify' || grantedState === 'add') && sjhm === grantedSjhm[i].sjhm) {
        addFound = true;
        grantedSjhm[i].rights = rights;
      }
      newGrantedSjhm.push(grantedSjhm[i]);
    }
    if (grantedState === 'add' && !addFound) {
      newGrantedSjhm.push({sjhm,rights});
    }
    // console.log('grantuser:',grantedState,newGrantedSjhm);
    // if(grantedState==='delete'){
    //   grantedSjhm.splice(grantedSjhm.indexOf(sjhm), 1)
    // } else if (grantedState === 'add') {
    //   if(!grantedSjhm.includes(sjhm)) grantedSjhm.push(sjhm);
    // }
    curUser.grantedSjhm = newGrantedSjhm; 
    curUser.zhxgsj = utils.getCurrentTimestamp();
    updatedNum = await commService.updateDoc('userb', curUser);
  }
  return await queryUser({ openId:curUser.openId });
}

const getNewGrant = (curUser,rights)=>{
//{"collid":null,"nickName":"馨馨","rights":['101','102','103']],"yzhid":"0598194113654221"}
  const { collid, nickName, yzhid,sjhm } = curUser;
  return {collid,nickName,yzhid,sjhm,rights};
}

exports.registerUser = async (data,userInfo) => {
  const { frontUserInfo,formObject} = data;
  const { openId } = userInfo;

  if (!formObject.canIUseWxPhoneNumber){
    //取上次发送的验证码数据
    const lastYzm = await getCachedSjyzm(openId);
    // console.log(lastYzm);
    if (!lastYzm.isValid)
      throw utils.newException('验证码已经失效！');
    if (lastYzm.yzm !== formObject.sjyzm)
      throw utils.newException('验证码不正确！');
  }

  const db = cloud.database();
  const lrsj = utils.getCurrentTimestamp();
  const zhxgsj = lrsj;
  let {yzhid,collid,orgname,name,sjhm} = formObject;
  // let orgcode = yzhid;
  let result
  if (commService.isFd(formObject.userType)) {
    //注册机构
    //检查机构名称是否存在
    result = await commService.querySingleDoc('userb', { orgname });
    if (result)
      throw utils.newException(`[${orgname}]已经被注册！`);
    yzhid = utils.yzhid();
    collid = utils.collid();
  }

  if (utils.isEmpty(yzhid) || utils.isEmpty(collid) || utils.isEmpty(orgname))
    throw utils.newException('注册参数有误！');

  const userb = {
    openId,
    yzhid,
    collid,
    nickName:frontUserInfo.nickName,
    avatarUrl: frontUserInfo.avatarUrl,
    userType:formObject.userType,
    // userData:frontUserInfo,
    sjhm,
    orgname,
    name,
    lrsj,
    zhxgsj
  }
  console.log('新用户注册：',userb);
  const userbid = await commService.addDoc('userb',userb);
  // if (commService.isFd(formObject.userType)){
    //房东注册，则创建新用户的集合表(新注册的时候不建表，新插入数据的时候建)
    // await db.createCollection('house_' + collid);
    // await db.createCollection('housefy_' + collid);
  // }

  //教职工注册完成，关联教职工头像数据
  const avatarUrl = userb.avatarUrl;
  if (commService.isZk(formObject.userType) && !utils.isEmpty(avatarUrl) && !utils.isEmpty(userb.sjhm)) {
    //检查教职工表是否存在
    let staff = await commService.querySingleDoc(commService.getTableName('staff',collid), { yzhid,sjhm });
    if (staff){
      //如果注册用户在机构职工表中存在，则修改注册用户类型为教职工
      await commService.updateDoc('userb',{_id:userbid,userType:CONSTS.USERTYPE3})
      //更新机构表职工头像
      staff.avatarUrl = avatarUrl;
      result = await commService.updateDoc(commService.getTableName( 'staff',collid), staff);
    }else{ 
      // 检查学员表
      let student = await commService.querySingleDoc(commService.getTableName('student', collid), { yzhid, sjhm });
      if (student) {
        //更新学员表头像
        student.avatarUrl = avatarUrl;
        result = await commService.updateDoc(commService.getTableName('student', collid), student);
      }
    }
  }
  
  return await queryUser({ openId});
}

exports.sysconfig = async (data, curUser) => {
  curUser.config = { ...curUser.config,...data};
  updatedNum = await commService.updateDoc('userb', curUser);
  return await queryUser({ openId: curUser.openId });
}

exports.grantcode = async (data, curUser) => {
  delete data.message;
  delete data.page;
  // console.log('grantcode:',data);
  return await commService.addDoc('grantcode',data);
}
