// 后台处理返回状态
exports.REMOTE_SUCCESS = 0; // 处理成功
exports.REMOTE_ERROR = 1; // 处理错误

// 按钮点击动作(云函数端当作请求的action，和前端按钮点击动作不一定完全匹配)
exports.BUTTON_NONE = 0; // 无动作
exports.BUTTON_QUERYFY = 1; // 查询数据 
exports.BUTTON_ADDFY = 2; // 添加数据
exports.BUTTON_EDITFY = 3; // 编辑数据
exports.BUTTON_DELETEFY = 4; // 删除数据
exports.BUTTON_CB = 5; // 抄表
exports.BUTTON_MAKEZD = 6; // 创建帐单
exports.BUTTON_LASTZD = 7; // 查看/处理最近帐单
exports.BUTTON_QUERYSDB = 8; // 查询水电表
exports.BUTTON_QUERYMAKEZD = 9; // 查询创建帐单列表
exports.BUTTON_EXITFY = 10; // 退房
exports.BUTTON_HTQY = 11; // 合同签约
exports.BUTTON_SEARCH = 12; // 搜索列表选择入口
exports.BUTTON_SAVEDATA = 13; // 保存数据（含增加和修改）
exports.BUTTON_STUCHARGE = 14; // 学员充值


exports.getButtonActionInfo = buttonAction => {
  try {
    return ['', '查询数据', '添加数据', '编辑数据', '删除数据', '抄表', '出帐单', '查看/处理帐单', '', ''][
      buttonAction
    ];
  } catch (e) {
    return '';
  }
};

//用户管理 
exports.BUTTON_QUERYUSER = 100; // 查询用户数据
exports.BUTTON_REGISTERUSER = 101; // 注册用户
exports.BUTTON_SENDSJYZM = 102; // 发送手机验证码
exports.BUTTON_USERGRANT = 103; // 用户授权
exports.BUTTON_GRANTCODE = 110; // 插入授权码(POST)(或根据授权码查帐单数据(GET))
exports.USERTYPE_NONE = '0'; // 用户类型：未注册
exports.USERTYPE_FD = '1'; // 用户类型：机构管理员
exports.USERTYPE_ZK = '2'; // 用户类型：其它

//系统管理
exports.BUTTON_SYSCONFIG = 200; // 系统配置

// //租客操作
// exports.BUTTON_ZK_SEELASTZD = 200;  //租客查看帐单

//帐单类型
exports.ZDLX_HTZD = '0';  //合同帐单
exports.ZDLX_YJZD = '1';  //月结帐单
exports.ZDLX_TFZD = '2';  //退房帐单

//收租状态
exports.SFSZ_WJQ = '0'; //未结清;
exports.SFSZ_YJQ = '1'; //已结清;
exports.SFSZ_YJZ = '2'; //已结转;
exports.SFSZ_YTF = '3'; //已退房;
exports.getSfszInfo = sfsz => {
  return { '0': '未结清', '1': '已结清', '2': '已结转', '3': '已退房' }[sfsz];
}

// 异常信息
exports.EXCEPTION = {
  100: '用户未注册',
  101: '用户无权操作',
}

exports.globalRetuSuffix = '_retu';   //form编辑数据后的返回对象后缀
exports.codePreffix = '_code_';   //大字典数据代码字段名前缀
