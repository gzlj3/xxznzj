const results = require('results.js');
const utils = require('utils.js');
const cloud = require('wx-server-sdk')
const CONSTS = require('constants.js');
const commService = require('CommServices.js')
cloud.init({
  // env: config.conf.env, 
})
const db = cloud.database();
const _ = db.command;

/**
 * 查询大字典及搜索数据，入口参数：
 * searchType:搜索类型，匹配fmMetas中的搜索类型
 * searchData:查询数据对象{inputVal:输入的查询值}
 * appendCond:附加搜索条件{}
 * 返回当前搜索的结果列表数组，数组对象类型为：
 * {desc:中文描述，code:代码}
 */
exports.querySearchData = async (data,curUser) => {
  const { searchType, appendCond, searchData } = data;
  let result = [];
  console.log('queryseardata searchtype:', searchType,searchData,appendCond);
  if (searchType === 'staff') {
    result = await querySearchStaff(curUser, searchType, searchData, appendCond);
  } else if (searchType === 'class') {
    result = await querySearchClass(curUser, searchType, searchData, appendCond);
  } else if (searchType === 'signin') {
    result = await querySearchSignin(curUser, searchType, searchData, appendCond);
  } else if (searchType === 'charge') {
    result = await querySearchCharge(curUser, searchType, searchData, appendCond);
  }else{
    return results.getErrorResults('未确定的搜索类型！' + searchType);
  }
  // if (!utils.isEmpty(code) && result.length > 0) {
  //   return result[0].desc;
  // }
  return result;
}

const querySearchStaff = async (curUser, searchType, searchData, appendCond) => {
  const { yzhid, collid } = curUser;
  const tablename = 'staff';
  const colltable = commService.getTableName(tablename, collid)
  let result;
  let retResult = [];
  // console.log('querysearchstaff:', data, curUser);
  result = await commService.queryDocs(colltable, { yzhid,...appendCond });
  result.map(value => {
    const desc = value.name + ' ' + value.sfzh;
    const code = value.name;
    retResult.push({ desc, code });
  });
  return retResult;
}
const querySearchClass = async (curUser, searchType, searchData, appendCond) => {
  const { yzhid, collid } = curUser;
  const tablename = 'class';
  const colltable = commService.getTableName(tablename, collid)
  let result;
  let retResult = [];
  result = await commService.queryDocs(colltable, { yzhid,...appendCond });
  result.map(value => {
    const desc = value.bjmc;
    const code = value._id;
    retResult.push({ desc, code });
  });
  return retResult;
}
const querySearchSignin = async (curUser, searchType, searchData, appendCond) => {
  const { yzhid, collid } = curUser;
  const tablename = 'signin';
  const colltable = commService.getTableName(tablename, collid)
  let result;
  let retResult = [];
  result = await commService.queryDocs(colltable, { yzhid, ...appendCond });
  // console.log('query search result:',result);
  result.map(value => {
    const desc = `${value.lrsj}(${value.name?value.name:value.nickName})签到.`;
    const code = value._id;
    retResult.push({ desc, code });
  });
  return retResult;
}
const querySearchCharge = async (curUser, searchType, searchData, appendCond) => {
  const { yzhid, collid } = curUser;
  const tablename = 'charge';
  const colltable = commService.getTableName(tablename, collid)
  let result;
  let retResult = [];
  result = await commService.queryDocs(colltable, { yzhid, ...appendCond });
  // console.log('query search result:',result);
  result.map(value => {
    const desc = `${value.lrsj}(${value.name ? value.name : value.nickName})充值:${value.cs}次.`;
    const code = value._id;
    retResult.push({ desc, code });
  });
  return retResult;
}

/**
 * 根据code在大字典列表中查询描述,如果未查到，则返回当前代码
 */
exports.findDesc = (zdList, code) => {
  if(!zdList) return code;
  let desc = code;
  for(let i=0;i<zdList.length;i++){
    const value = zdList[i];
    if(value.code===code){
      desc = value.desc;
      break;
    }
  }
  return desc;
}