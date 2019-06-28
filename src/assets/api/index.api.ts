import axios from '@/assets/api/axios';
import config from '@/config/config';

var baseUrl = config.baseURL;
console.log(baseUrl, 'baseUrl');
var api = {
  baseApi: baseUrl,
  isBind: baseUrl + '/notify/isBind',
  bindOpenId: baseUrl + '/notify/bindOpenId',
  getValidateCode: baseUrl + '/notify/getValidateCode',
  login: baseUrl + '/notify/login',
  modifyPwd: baseUrl + '/user/modifyPwd', //APP用户服务-修改密码
  getLoginInfo: baseUrl + '/notify/getLoginInfo', //APP用户服务-修改密码
  getSubjects: baseUrl + '/flow/subInfo',
  editApproval: baseUrl + '/flow/expenseApply',
  getMysendList: baseUrl + '/flow/queryMyExpenseList',
  getNoApprList: baseUrl + '/flow/todo', //获取待办列表
  getAlrApprList: baseUrl + '/flow/historic', //获取已办列表
  getApprovalDetail: baseUrl + '/flow/flowdetail',
  completeTask: baseUrl + '/flow/completeTask',
  repealApply: baseUrl + '/flow/repealApply',
  queryDictInfo: baseUrl + '/flow/queryDictInfo',
  saveExpenseInfo: baseUrl + '/flow/saveExpenseInfo',
  startWorkFlow: baseUrl + '/flow/startWorkFlow',
  // repealApply: baseUrl + '/flow/repealApply',
  areaInfo: baseUrl + '/flow/areaInfo',
  repealTask: baseUrl + '/flow/repealTask',
  queryDemandInfo: baseUrl + '/demand/queryDemandInfo',
  demandImplemetApply: baseUrl + '/demand/demandImplemetApply',
  saveDemandImplementInfo: baseUrl + '/demand/saveDemandImplementInfo',
  queryMyDemandImplementOrMarketList: baseUrl + '/demand/queryMyDemandImplementOrMarketList',
  repealTaskDemanadImplementOrMarket: baseUrl + '/demand/repealTaskDemanadImplementOrMarket',
  startWorkFlowDemandImplement: baseUrl + '/demand/startWorkFlowDemandImplement',
  demandMarketApply: baseUrl + '/demand/demandMarketApply',
  flowDetailDemandImplementOrMarket: baseUrl + '/demand/flowDetailDemandImplementOrMarket',
  completeTaskDemandMarket: baseUrl + '/demand/completeTaskDemandMarket',
  saveDemandMarketInfo: baseUrl + '/demand/saveDemandMarketInfo',
  repealApplyDemandImplementOrMarket: baseUrl + '/demand/repealApplyDemandImplementOrMarket',
  completeTaskDemandImplement: baseUrl + '/demand/completeTaskDemandImplement',
  startWorkFlowDemandMarket: baseUrl + '/demand/startWorkFlowDemandMarket',
  save: baseUrl + '/work/save',
  monthList: baseUrl + '/work/monthList',
  dayList: baseUrl + '/work/dayList',
  escortEmployee: baseUrl + '/recpFlow/escortEmployee', //接待申请-查询陪客人员
  recpFlowRevencelist: baseUrl + '/recpFlow/recpFlowRevencelist', //接待申请-关联查询列表
  recpFlowDetail: baseUrl + '/recpFlow/recpFlowDetail', //接待申请-查询审批流程详情
  recpApply: baseUrl + '/recpFlow/recpApply', //接待申请-发起申请
  saveRecpFlowInfo: baseUrl + '/recpFlow/saveRecpFlowInfo', //接待申请-保存草稿
  queryMyRecpFlowList: baseUrl + '/recpFlow/queryMyRecpFlowList', //接待申请-查询列表
  recpFlowRepealApply: baseUrl + '/recpFlow/recpFlowRepealApply', //接待申请-删除单据
  recpFlowRepealTask: baseUrl + '/recpFlow/recpFlowRepealTask', //接待申请-删除单据
  recpFlowStartWorkFlow: baseUrl + '/recpFlow/recpFlowStartWorkFlow', //接待申请-草稿发起申请
  recpFlowCompleteTask: baseUrl + '/recpFlow/recpFlowCompleteTask', //接待申请-同意/驳回
  queryMyApplyCount: baseUrl + '/notify/queryMyApplyCount', //获取我的申请条数
  queryTodoCount: baseUrl + '/notify/queryTodoCount', //获取待办任务条数
  queryNotifyTotalCount: baseUrl + '/notify/queryNotifyTotalCount', //获取用户待办任务条数、申请条数、异常单数

  queryDict: baseUrl + '/commonInfo/queryDict', //APP公共信息管理服务-字典查询
  saveCustInfo: baseUrl + '/custInfo/saveCustInfo', //APP公共信息管理服务-字典查询
  custInfoList: baseUrl + '/custInfo/custInfoList', //APP客户资料管理-查询列表
  custInfoDetail: baseUrl + '/custInfo/custInfoDetail', //APP客户资料管理-客户信息详情查询
  custMaintenanceList: baseUrl + '/custInfo/custMaintenanceList', //APP客户维护管理-查询列表
  saveCustMaintenance: baseUrl + '/custInfo/saveCustMaintenance', //客户维护管理-保存列表
  flowRevencelist: baseUrl + '/commonInfo/flowRevencelist', //APP公共信息管理服务-关联查询列表
  orgAndUserInfo: baseUrl + '/commonInfo/orgAndUserInfo', //APP公共信息管理服务-关联查询列表

  custInfoListNum: baseUrl + '/custInfo/custInfoListNum', //客户资料管理-查询列表（数量）
  findCustLinkman: baseUrl + '/custInfo/findCustLinkman', //客户资料管理-维护管理-获取联系人信息
  custChangePick: baseUrl + '/custInfo/custChangePick', //客户资料管理-开放、捡入客户（1开放，2捡入）

  queryMyClueFlowList: baseUrl + '/custInfoClue/custInfoClueList', //线索管理-查询列表
  saveCustInfoClue: baseUrl + '/custInfoClue/saveCustInfoClue', //线索保存
  custInfoClueDetail: baseUrl + '/custInfoClue/custInfoClueDetail',
  queryLogList: baseUrl + '/employeeDaily/employeeDailyList',
  saveEmployeeDaily: baseUrl + '/employeeDaily/saveEmployeeDaily',
  employeeDailyDetail: baseUrl + '/employeeDaily/employeeDailyDetail',

  queryRelationResourcesApplyFlowList:
    baseUrl + '/resourcesApplyFlow/queryRelationResourcesApplyFlowList', //app端资源申请-查询关联列表 关联主题
  queryHandleEmployeeList: baseUrl + '/resourcesHandleFlow/queryHandleEmployeeList', //app端资源办理-查询指派人员信息
  resourcesHandleApply: baseUrl + '/resourcesHandleFlow/resourcesHandleApply', //app端资源办理-发起申请
  saveResourcesHandleInfo: baseUrl + '/resourcesHandleFlow/saveResourcesHandleInfo', //app端资源办理-保存草稿
  resourcesHandleFlowList: baseUrl + '/resourcesHandleFlow/resourcesHandleFlowList', //app端资源申请办理-查询列表
  resourcesHandleInfoDetail: baseUrl + '/resourcesHandleFlow/resourcesHandleInfoDetail', //app端资源办理-资源申请流程详细信息
  resourcesHandleFlowCompleteTask: baseUrl + '/resourcesHandleFlow/resourcesHandleFlowCompleteTask', //app端资源办理-同意
  deleteResourcesHandleInfo: baseUrl + '/resourcesHandleFlow/deleteResourcesHandleInfo', //app端资源办理-删除
  resourcesHandleFlowRepealTask: baseUrl + '/resourcesHandleFlow/resourcesHandleFlowRepealTask', //app端资源办理-撤销
  resourcesRelationHandleFlowList: baseUrl + '/resourcesHandleFlow/resourcesRelationHandleFlowList', //app端资源申请办理-关联列表

  MyResourcesApplyFlowList: baseUrl + '/resourcesApplyFlow/queryMyResourcesApplyFlowList', //资源申请列表
  resourcesApplyFlowDetail: baseUrl + '/resourcesApplyFlow/resourcesApplyFlowDetail', //资源申请详情
  resourcesApply: baseUrl + '/resourcesApplyFlow/resourcesApply', //app端资源申请-流程申请
  saveResourcesApplyInfo: baseUrl + '/resourcesApplyFlow/saveResourcesApplyInfo', //资源申请保存草稿
  queryResourcesApplyEmployeeList: baseUrl + '/resourcesApplyFlow/queryResourcesApplyEmployeeList',
  resourcesApplyCompleteTask: baseUrl + '/resourcesApplyFlow/resourcesApplyCompleteTask', //资源申请同意或者拒绝
  resourcesApplyFlowRepealTask: baseUrl + '/resourcesApplyFlow/resourcesApplyFlowRepealTask', //资源申请撤销
  deleteResourcesApplyFlow: baseUrl + '/resourcesApplyFlow/deleteResourcesApplyFlow', //资源申请撤销

  queryMyTravelFlowList: baseUrl + '/travelFlow/queryMyTravelFlowList',
  retravelFlowDetail: baseUrl + '/travelFlow/retravelFlowDetail', //出差详情
  travelFlowRepealApply: baseUrl + '/travelFlow/travelFlowRepealApply', //删除出差申请
  travelFlowRepealTask: baseUrl + '/travelFlow/travelFlowRepealTask', //撤销出差申请
  travelFlowCompleteTask: baseUrl + '/travelFlow/travelFlowCompleteTask', //同意或者拒绝出差申请

  querySubInfo: baseUrl + '/commonInfo/querySubInfo', // 获取科目字典信息(平行结构)
  // querySubInfolistForTravel: baseUrl + '/commonInfo/querySubInfolistForTravel', // 出差模块表单的科目字典(平行结构) -- 废弃
  querySubInfolistForSecond: baseUrl + '/commonInfo/querySubInfolistForSecond', // 报销科目字典(平行结构)
  findMessagePage: baseUrl + '/commonInfo/findMessagePage', //app公共信息管理服务-消息查询
  queryCustInfos: baseUrl + '/commonInfo/queryCustInfos',
  queryCompanyName: baseUrl + '/commonInfo/queryCompanyName', //企业名称-不带分页查询
  findRedCount: baseUrl + '/commonInfo/findRedCount', // 消息红点

  travelApply: baseUrl + '/travelFlow/travelApply', //app端出差申请-发起申请
  saveTravelFlowInfo: baseUrl + '/travelFlow/saveTravelFlowInfo', //app端出差申请-单据保存草稿

  findEmployeeStatusList: baseUrl + '/employeeStatus/findEmployeeStatusList', //APP员工状态-查询人员状态列表
  findProjectNode: baseUrl + '/employeeStatus/findProjectNode', //APP员工状态-查询节点信息
  saveEmployeeStatus: baseUrl + '/employeeStatus/saveEmployeeStatus', //APP员工状态-保存员工状态信息

  abnormalOrderCountByCompanyCode: baseUrl + '/company/abnormalOrderCountByCompanyCode', //app企业管理服务-异常单数量查询
  abnormalOrderListForOA: baseUrl + '/company/abnormalOrderListForOA', //app企业管理服务-异常单列表
  queryCommonLoadAddress: baseUrl + '/company/queryCommonLoadAddress', //app企业管理服务-查询企业常用装卸货地址
  stockOrderErrorListForOA: baseUrl + '/company/stockOrderErrorListForOA', //app企业管理服务-开票异常单列表

  queryContractTempletList: baseUrl + '/contractFlowNew/queryContractTempletList', //APP端合同申请-查询合同名称下拉列表
  queryContractConfig: baseUrl + '/contractFlowNew/queryContractConfig', //APP端合同申请-查询合同配置信息
  contractRepealTask: baseUrl + '/contractFlowNew/repealTask', //APP端合同申请-流程收回(撤销)
  contractRepealApply: baseUrl + '/contractFlowNew/repealApply', //APP端合同申请-删除
  contractFlowNewCompleteTask: baseUrl + '/contractFlowNew/contractFlowNewCompleteTask', //APP端合同申请-同意/驳回
  contractFlowDetail: baseUrl + '/contractFlowNew/contractFlowDetail', //APP端合同申请-查询审批流程详情
  queryPartyNameForContractBack: baseUrl + '/contractFlowNew/queryPartyNameForContractBack', //APP端合同申请-从合同公司信息获取合同方信息
  contractApplyNew: baseUrl + '/contractFlowNew/contractApplyNew', //APP端合同申请-申请
  queryMyContractFlowList: baseUrl + '/contractFlowNew/queryMyContractFlowList', //APP端合同申请-查询列表
  queryMainContractList: baseUrl + '/contractFlowNew/queryMainContractList', //APP端合同申请-主合同查询（关联主合同）

  contractHisDetail: baseUrl + '/contractHis/contractHisDetail', //APP合同归档服务-详情
  // changeContractHis: baseUrl + '/contractHis/changeContractHis', //APP合同归档服务-修改
  // contractHisAbandon: baseUrl + '/contractHis/contractHisAbandon', //APP合同归档服务-废弃
  // contractHisBatchMove: baseUrl + '/contractHis/contractHisBatchMove', //APP合同归档服务-负责人批量移动
  // contractHisChangeLider: baseUrl + '/contractHis/contractHisChangeLider', //APP合同归档服务-负责人修改记录查询
  contractHisList: baseUrl + '/contractHis/contractHisList', //APP合同归档服务-列表查询(带分页)
  // contractHisRenewal: baseUrl + '/contractHis/contractHisRenewal', //APP合同归档服务-续签
  // queryContractHis: baseUrl + '/contractHis/queryContractHis', //APP合同归档服务-列表查询(不带分页)
  // saveContractHis: baseUrl + '/contractHis/saveContractHis', //APP合同归档服务-提交(保存)
  changeReceipt: baseUrl + '/contractHis/changeReceipt', //APP合同归档服务-改变回执状态

  queryNeedFlowList: baseUrl + '/needFlow/queryNeedFlowList', //APP端协作-查询列表
  queryNeedLabel: baseUrl + '/needFlow/queryNeedLabel', //协作功能-标签列表
  queryNeedDetail: baseUrl + '/needFlow/queryDetail', //APP端协作-详情
  queryNeedType: baseUrl + '/needFlow/queryNeedType', //APP端协作-详情
  promoteProgress: baseUrl + '/needFlow/promoteProgress', //APP端协作-增加进度
  addNeedFlow: baseUrl + '/needFlow/addNeedFlow', //APP端协作-新增协作
  queryHisPrincipal: baseUrl + '/needFlow/queryHisPrincipal', //APP端协作-查看历史负责人
  addComment: baseUrl + '/needFlow/addComment', //APP端协作-新增评论
  queryCommentList: baseUrl + '/needFlow/queryCommentList', //APP端协作-评论列表
  queryHisProgress: baseUrl + '/needFlow/queryHisProgress', //APP端协作-历时进度
  setNextPrincipal: baseUrl + '/needFlow/setNextPrincipal',
  editParticipantList: baseUrl + '/needFlow/editParticipantList',
  queryCurParticipantList: baseUrl + '/needFlow/queryCurParticipantList', //查询当前参与人列表

  logFindPage: baseUrl + '/marketDaily/findPage', //市场日报-公共列表查询（市场、实施日报分页查询
  saveMarketDaily: baseUrl + '/marketDaily/saveMarketDaily', //市场日报-保存日报信息
  queryDailyCustMaintenance: baseUrl + '/marketDaily/queryDailyCustMaintenance', //查询当前登入人客户信息及最后一条维护记录
  getMarketDailyById: baseUrl + '/marketDaily/getMarketDailyById', //市场日报-详情页面
  getDailyCustMaintenance: baseUrl + '/marketDaily/getDailyCustMaintenance', //市场日报-查询客户维护信息（分页查询）
  saveImplyDaily: baseUrl + '/implyDaily/saveImplyDaily', //APP工作日志-保存实施工作日志
  queryProjectNodeList: baseUrl + '/implyDaily/queryProjectNodeList', //APP工作日志-项目节点列表-不带分页查询
  queryImplyDailyDetail: baseUrl + '/implyDaily/queryImplyDailyDetail', //APP工作日志-实施工作日志详情
  querySendToByUserId: baseUrl + '/marketDaily/querySendToByUserId', //APP工作日志-查询发送信息
  saveDailyComment: baseUrl + '/marketDaily/saveDailyComment', //WEB日报-保存评论
  queryDailyComment: baseUrl + '/marketDaily/queryDailyComment', //WEB日报-批阅查询

  queryDepts: baseUrl + '/projectInfo/queryDepts',

  saveProjectInfo: baseUrl + '/projectInfo/saveProjectInfo', //项目管理-保存项目信息
  saveUserNew: baseUrl + '/lucklyPerson/saveUserNew', //账号绑定
  queryUserIsBindForNew: baseUrl + '/lucklyPerson/queryUserIsBindForNew' //账号绑定
};
console.log(api);
export default api;
