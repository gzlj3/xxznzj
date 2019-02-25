const cloud = require('wx-server-sdk')
const CONSTS = require('constants.js');
const utils = require('utils.js');
const config = require('config.js')
const rp = require('request-promise');

cloud.init({
  // env: config.conf.env,
})
const db = cloud.database();
const _ = db.command;
/**
 * 更新表的记录，返回更新成功的记录数
 */
const updateDoc = async (tableName, docObj) => {
  // if (utils.isEmptyObj(docObj))
  //   throw utils.newException('参数异常！');
  const db = cloud.database();
  const { _id } = docObj;
  delete docObj._id;
  const result = await db.collection(tableName).doc(_id).update({
    data: docObj
  });
  const updatedNum = result.stats.updated;
  if (updatedNum === 0) {
    console.log('updateDoc result failure:', _id, tableName, docObj, result);
    // throw utils.newException('更新数据失败！');
  } else {
    // console.log('updateDoc result success:', _id,tableName, docObj);    
  }
  return updatedNum;
}
exports.updateDoc = updateDoc;

/**
 * 删除表的记录，返回删除成功的记录数
 */
exports.removeDoc = async (tableName, _id) => {
  if (utils.isEmpty(_id))
    throw utils.newException('参数异常！');
  const db = cloud.database();
  const result = await db.collection(tableName).doc(_id).remove();
  const removedNum = result.stats.removed;
  return removedNum;
}

/**
 * 添加记录，返回添加成功的_ID，错误抛出异常
 */
exports.addDoc = async (tableName, docObj) => {
  const db = cloud.database();
  const result = await db.collection(tableName).add({
    data: docObj
  });
  if (!result || utils.isEmpty(result._id))
    throw new utils.newException('插入数据失败！');
  return result._id;
}

const querySingleDoc = async (tableName, whereObj) => {
  if (utils.isEmptyObj(whereObj))
    throw utils.newException('参数异常！');

  const db = cloud.database();
  const result = await db.collection(tableName).where(whereObj).get();
  if (result && result.data.length > 0)
    return result.data[0];
  return null;
}
exports.querySingleDoc = querySingleDoc;

exports.queryPrimaryDoc = async (tableName, _id) => {
  if(utils.isEmpty(_id)) return null;
  const db = cloud.database();
  const result = await db.collection(tableName).doc(_id).get();
  if (result) return result.data;
  return null;
}

/**
 * orderbyObj, 排序字段，格式可为：
 * 单字段排序[字段名,'asc'],多字段:[[fieldname,'asc'],[fieldname,'asc']]
 */
exports.queryDocs = async (tableName, whereObj,orderbyObj) => {
  if (utils.isEmptyObj(whereObj))
    throw utils.newException('参数异常！');
  const db = cloud.database();
  try {
    let coll = db.collection(tableName);
    if(orderbyObj && orderbyObj.length>0){
      //如果有排序字段
      if(!(orderbyObj[0] instanceof Array)){
        //排序字段无多个时，拼成多个排序字段情况
        orderbyObj = [orderbyObj];
      }
      orderbyObj.map(value=>{
        // console.log('order by:',value);
        coll = coll.orderBy(...value);
      })
    }
    const result = await coll.where(whereObj).get();
    // console.log('coll:',coll);
    // console.log('result:',result);
    if (result && result.data.length > 0)
     return result.data;
  } catch (e) {
    if (e.errCode !== -502005) {
      //如果是表不存在，则不抛出异常
      throw e;
    }
  }
  return null;
}

//是否为租客
exports.isZk = (userType) => {
  // console.log('iszk:', userType, utils.isEmpty(userType));
  if (utils.isEmpty(userType))
    throw utils.newException('用户身份判断异常！');
  return userType === CONSTS.USERTYPE_ZK;
}
//是否为房东
exports.isFd = (userType) => {
  if (utils.isEmpty(userType))
    throw utils.newException('用户身份判断异常！');
  return userType === CONSTS.USERTYPE_FD;
}
//是否为房东租客
// exports.isFdZk = (userType) => {
//   if (utils.isEmpty(userType))
//     throw utils.newException('用户身份判断异常！');
//   return userType === CONSTS.USERTYPE_FDZK;
// }

//查询所有房东collid
async function queryAllCollids() {
  const db = cloud.database();
  const result = await db.collection('userb').field({ collid: true, yzhid:true,nickName: true }).where({ userType: '1' }).get();
  // const result = await db.collection('userb').field({ collid: true, yzhid: true, nickName: true }).get();
  if (result && result.data.length > 0)
    return result.data;
  return null;
}
exports.queryAllCollids = queryAllCollids;

exports.updateAllDoc = async (tablename, whereObj, updateObj) => {
  if (utils.isEmptyObj(whereObj) || utils.isEmptyObj(updateObj))
    throw utils.newException('参数异常！');
  const collids = await queryAllCollids();
  if (!collids) return;
  let updatedNum = 0;
  let updatedCollids = [];
  for (let i = 0; i < collids.length; i++) {
    let collid = collids[i].collid;
    // if (utils.isEmpty(collid)) collid = '';
    // else collid = '_' + collid;
    if (updatedCollids.includes(collid)) continue;
    else{
      updatedCollids.push(collid);
    }
    try {
      const result = await db.collection(getTableName(tablename, collid)).where(whereObj).update({ data: updateObj });
      // console.log('updateAllDoc:', result, getTableName(tablename, collid),whereObj,updateObj);
      updatedNum += result.stats.updated;
    } catch (e) {
      //更新批表如果出错，暂不抛出异常
      console.log('updateAllDoc:', e);
    }
  }
  return updatedNum;
}

exports.queryAllDoc = async (tablename, whereObj) => {
  if (utils.isEmptyObj(whereObj))
    throw utils.newException('参数异常！');
  const collids = await queryAllCollids();
  if (!collids) return;
  console.log('collids:', collids);
  let resultList = [];
  for (let i = 0; i < collids.length; i++) {
    const { collid, nickName,yzhid } = collids[i];
    try {
      const newWhereObj = {yzhid,...whereObj};
      // console.log('query cond:', getTableName(tablename, collid),newWhereObj);
      result = await db.collection(getTableName(tablename, collid)).where(newWhereObj).get();
      if (result && result.data.length > 0) {
        resultList.push({ collid, nickName, sourceList: result.data });
      }
    } catch (e) {
      //批表查询如果出错，暂不抛出异常
      console.log('queryAllDoc:', e);
    }
  }
  return resultList;
}

const getTableName = (tableName, collid) => {
  if (utils.isEmpty(collid)) collid = '';
  else collid = '_' + collid;
  return tableName + collid;
}
exports.getTableName = getTableName;

const createGrantcode = (message, otherObj) => {
  const grantcode = utils.uuid(16);
  const createtime = utils.currentTimeMillis();
  return { message, grantcode, createtime, ...otherObj };
}
exports.createGrantcode = createGrantcode;

const queryGrantcode = async (grantcode,yxq,openId) => {
  let result = await querySingleDoc('grantcode', { grantcode });
  if (!result)
    throw utils.newException('授权码错误或已失效！');
  result.isValid = (utils.currentTimeMillis() - result.createtime < yxq);

  //检查用户是否已经注册系统
  const userb = await querySingleDoc('userb', { openId});
  result.registered = (userb !== null);

  return result;
}
exports.queryGrantcode = queryGrantcode;

/**
 * 查询fmMetas
 * fmName:如果不传入，则返回所有的fmMetas（对象）,如果有值，则返回指定fmName的表单描述(数组)
 */
exports.queryFmMetas = async (curUser,fmName) => {
  const { yzhid} = curUser;
  const colltable = 'fmMetas';
  let result;
  result = await querySingleDoc(colltable, { yzhid });
  if(!result){
    result = await querySingleDoc(colltable, { yzhid:'default' });
  }
  if(result){
    if(!utils.isEmpty(fmName)){
      return result.fmmetas[fmName];
    }
    return result.fmmetas;
  }
  return null;
}


exports.ocrSfz = async (sfzhCloudFileId) => {
  const token = await getAccessToken();
  const url = "http://api.weixin.qq.com/cv/ocr/idcard?type=photo&access_token=" + token;
  const res = await cloud.downloadFile({
    fileID: sfzhCloudFileId,
  })
  const buffer = res.fileContent;
  // console.log('ocrsfz:',sfzhCloudFileId,res.fileContent.length);
  const result = await utils.postFileData(url,buffer);
  return result;
}


const getAccessToken = async () => {
  let result = await querySingleDoc('global',{code:'AccessToken'});
  if(!result)
    throw utils.newException('获取AccessToken错误！');
  if (result.createtime && result.expires_in){
    if(utils.currentTimeMillis() - result.createtime <= result.expires_in*1000 - 120*1000){
      // console.log('return valid accesstoken!');
      return result.access_token;
    }
  }  
  const url = `https://api.weixin.qq.com/cgi-bin/token?grant_type=client_credential&appid=${result.appId}&secret=${result.appSecret}`;
  const token = await utils.requestUrl(url);
  if(utils.isEmpty(token.access_token))
    throw utils.newException(token.errmsg, token.errcode);
  result.createtime = utils.currentTimeMillis();
  result.access_token = token.access_token;
  result.expires_in = token.expires_in;
  const retu = await updateDoc('global',result);
  return result.access_token;
}
exports.getAccessToken = getAccessToken;

exports.testService = async (data) => {
  // const fileID = 'cloud://jjczwgl-test-2e296e.6a6a-jjczwgl-test-2e296e/1/fdqm/BIrpF.png'
  // const res = await cloud.downloadFile({
  //   fileID,
  // })
  // const buffer = res.fileContent;
  // console.log(buffer.length);
  // return buffer;
  //doc(undefined)
  //置为null, string：失败，number:成功
  //置为undefined
  // let sfhj = null, sdj = null, sbcds = null, ljfyff = null;
  // const result = await db.collection('house_1').doc('GVe1ZTXFeQ8zzHJG').update({ data: { sbcds, sdj, sfhj, ljfyff } });
  // console.log('test:', result);
  // return result;
}
