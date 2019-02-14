const utils = require('utils.js');
const cloud = require('wx-server-sdk')
const CONSTS = require('constants.js');
const commService = require('CommServices.js')
cloud.init({
  // env: config.conf.env, 
})
const db = cloud.database();
const _ = db.command;

const querySearchStaff = async (curUser,code) => {
  //查询搜索数据入口
  const { yzhid, collid } = curUser;
  const tablename = 'staff';
  const colltable = commService.getTableName(tablename, collid)
  let result;
  let retResult = [];
  // console.log('querysearchstaff:', data, curUser);
  let codeCond = {};
  if (!utils.isEmpty(code)) {
    codeCond = { _id: code }
  }
  result = await commService.queryDocs(colltable, { yzhid,...codeCond });
  result.map(value => {
    const desc = value.name + ' ' + value.sfzh;
    const code = value.name;
    retResult.push({ desc, code });
  });
  return retResult;
}
const querySearchClass = async (curUser,code) => {
  //查询搜索数据入口
  const { yzhid, collid } = curUser;
  const tablename = 'class';
  const colltable = commService.getTableName(tablename, collid)
  let result;
  let retResult = [];
  let codeCond = {};
  if(!utils.isEmpty(code)){
    codeCond = {_id:code}
  }
  result = await commService.queryDocs(colltable, { yzhid,...codeCond });
  result.map(value => {
    const desc = value.bjmc;
    const code = value._id;
    retResult.push({ desc, code });
  });
  return retResult;
}

/**
 * 查询大字典数据，入口参数：
 * searchType:搜索类型，匹配fmMetas中的搜索类型
 * code：如果传入值，则返回此代码对应的中文描述，否则返回当前搜索的结果列表数组，数组对象类型为：
 * {desc:中文描述，code:代码}
 */
exports.querySearchData = async (curUser,searchType,code) => {
  let result = [];
  // console.log('queryseardata searchtype:', searchType);
  if (searchType === 'staff') {
    result = await querySearchStaff(curUser,code);
  } else if (searchType === 'class') {
    result = await querySearchClass(curUser,code);
  }
  if(!utils.isEmpty(code) && result.length>0){
    return result[0].desc;
  }
  return result;
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