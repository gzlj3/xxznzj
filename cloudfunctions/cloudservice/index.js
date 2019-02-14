// 云函数入口文件
const results = require('results.js');
const CONSTS = require('constants.js');
const services = require('FyglServices.js');
const commService = require('CommServices.js');
const selectService = require('SelectServices.js');
const userServices = require('UserServices.js');
const utils = require('utils.js');  
const phone = require('phone.js');  

// 云函数入口函数
/* event 参数对象：
{ action:页面触发动作
  data:  页面上传的数据
}
*/
exports.main = async (event, context) => {
  const { action, method, data,restData,userInfo} = event;
  if(!action) return results.getErrorResults('未指定操作！');
  console.log("action:"+action+"   method:"+method);
  console.log('event:',event);
  console.log('context:',context);
  
  try {
    //检查权限，成功则返回用户的基本数据
    const curUser = await userServices.checkAuthority(action, method,userInfo,data);
    
    // console.log('操作用户：', curUser);
    services.setUser(curUser);
    if (action === 300) {
      //测试发送模板消息
      // const result = await commService.getAccessToken(data);
      // return results.getSuccessResults(result);
      // return results.getSuccessResults(await utils.testRequest());
    }
    let result;
    switch(action){
      // case CONSTS.BUTTON_ZK_SEELASTZD:
      //   result = await userServices.seeLastzd(curUser);
      //   return results.getSuccessResults(result);
      case CONSTS.BUTTON_SEARCH:
        const { searchType } = data;
        if (method === 'GET') {
          result = await selectService.querySearchData(curUser,searchType);
          return results.getSuccessResults(result);
          // console.log('search:',coludSearchType);
          // if (searchType==='staff'){
          //   result = await services.querySearchStaff(data, curUser);
          //   return results.getSuccessResults(result);
          // } else if (searchType === 'class') {
          //   result = await services.querySearchClass(data, curUser);
          //   return results.getSuccessResults(result);
          // }
        }
        return results.getErrorResults('未确定的搜索类型！' + searchType);
      case CONSTS.BUTTON_HTQY:
        if (method === 'POST') { 
          result = await services.processHt(data,curUser);
        }else{ 
          result = await services.queryHtdata(data, curUser);
        }
        return results.getSuccessResults(result);
      case CONSTS.BUTTON_QUERYUSER:
        result = await userServices.queryUser(userInfo);
        let fmMetas=null;
        if(result){
          fmMetas = await commService.queryFmMetas(result);
        }
        return results.getSuccessResults({user:result,fmMetas});
      case CONSTS.BUTTON_REGISTERUSER:
        result = await userServices.registerUser(data,userInfo);
        return results.getSuccessResults(result);
      case CONSTS.BUTTON_USERGRANT:
        result = await userServices.grantUser(data, curUser);
        return results.getSuccessResults(result);
      case CONSTS.BUTTON_GRANTCODE:
        if(method==='POST'){ 
          result = await userServices.grantcode(data, curUser);
        // }else{
        //   result = await services.queryLastzdWithGrantcode(data, curUser);
          return results.getSuccessResults(result);
        }
      case CONSTS.BUTTON_SYSCONFIG  :
        result = await userServices.sysconfig(data, curUser);
        return results.getSuccessResults(result);
      case CONSTS.BUTTON_SENDSJYZM:
        result = await userServices.sendSjyzm(data,userInfo);
        return results.getSuccessResults(result);
      case CONSTS.BUTTON_QUERYFY:
        // console.log('queryfy');
          result = await services.queryDataList(data,curUser);
          return results.getSuccessResults(result);
      // case CONSTS.BUTTON_ADDFY:
      //   // console.log('addfy');
      //     // data.yzhid = curUser.yzhid;
      //     // data.lrr=curUser.openId;
      //     // data.lrsj=utils.getCurrentTimestamp();
      //     // data.zhxgr=curUser.openId;
      //     // data.zhxgsj=data.lrsj;
      //     result = await services.saveData(data,curUser);
      //     return results.getSuccessResults(result);
      //   break;
      // case CONSTS.BUTTON_EDITFY:
      //   console.log("editfy");
      //   // data.zhxgr=curUser.openId;
      //   // data.zhxgsj=utils.getCurrentTimestamp();       
      //   // const collid = restData && restData.length > 0 ? restData[0] : curUser.collid;
      //   // console.log('editfy',collid);
      //   result = await services.saveData(data,curUser);
      //   return results.getSuccessResults(result);
      case CONSTS.BUTTON_SAVEDATA :
        result = await services.saveData(data, curUser);
        return results.getSuccessResults(result);
      case CONSTS.BUTTON_STUCHARGE:
        //先保存充值数据
        let chargeid = await services.saveData(data, curUser);  
        try{
          //累加到学员表
          const {cs,parentid} = data.formObject;
          result = await services.updateStudentCs(curUser.collid,parentid,cs);
        }catch(e){
          //更新学员表次数失败，则删除之前保存完成的充值记录
          await commService.removeDoc(commService.getTableName('charge',curUser.collid),chargeid);
          throw e;
        }
        return results.getSuccessResults(result);
      case CONSTS.BUTTON_DELETEFY:
        console.log("deletefy");
        result = await services.deleteFy(data, curUser);
        result = await services.queryFyList(curUser);
        return results.getSuccessResults(result);
      case CONSTS.BUTTON_EXITFY:
        if (method === 'POST') {
          console.log("tffy");
          result = await services.tfFy(data, curUser);
        }else{
          console.log("exitfy");
          result = await services.exitFy(data, curUser);
        }
        result = await services.queryFyList(curUser);
        return results.getSuccessResults(result);
      case CONSTS.BUTTON_CB:
        if(method==='POST'){
          console.log("cb");
          result = await services.updateSdb(data,curUser);
        }else{
          console.log("querysdb:",data);
          result = await services.querySdbList(curUser,data);
          // result = result.data;
        }
        return results.getSuccessResults(result);
        break;
      case CONSTS.BUTTON_MAKEZD:
        if (method === 'POST') {
          const autoSendMessage = restData && restData.length>0?restData[0]:false;
          console.log("makezd autoSendMessage", autoSendMessage);
          result = await services.updateZdList(data, autoSendMessage,curUser);
        }else{
          console.log("querymakezd");
          result = await services.queryZdList(curUser,data);
        }
        return results.getSuccessResults(result);
      case CONSTS.BUTTON_LASTZD:
        if (method === 'POST') {
          console.log("post lastzd");
          result = await services.processQrsz(data,curUser);          
          // result = result.data;
        } else {
          console.log("querylastzd");
          result = await services.queryLastzdList(data, userInfo);
          // result = result.data;
        }
        return results.getSuccessResults(result);
      default:
        return results.getErrorResults('未确定动作！'+action);
    }
  } catch (e) {
    console.log(e);
    if(!e.code) e.code = e.errCode;
    // if (e.code === -502005 ) e.code = 900;
    return results.getErrorResults(e.message,e.code);
  }
}