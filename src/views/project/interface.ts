export interface QUERYDICT {
    dict:Array<DIC_ITEM>
}
interface DIC_ITEM {
    name:string,
    type:string,
    value :string,
}

export interface APPLY_data {
    custInfoId: string, //归属客户
    id: string,
    impleLeaderId: string, //实施负责人
    marketLeaderId: string,//市场负责人 
    officeId: string,//归属部门 
    projectLeaderId: string,//项目负责人 
    projectName: string,//项目名称
    projectNodeReqs: Array<projectNodeReqs_ITEM>,
    holderCode: Array<any>
    projectType: string,
    remarks: string
}
interface projectNodeReqs_ITEM {
    lat: string,
    lng: string,
    nodeAddress: string,
    nodeId: string,
    nodeName: string,
}

export interface OPTION {
    api: string, //归属客户
    params: any,
    search: string,
    key: string,
    value: string,
}
export interface TREELIST {
    id?: string,
    pId?: string,
    name?: string,
    check?: string,
    children?: boolean,
    userInfo?:Array<UserInfo>
    mobile?: string,
    loginName?: string,
    loginFlag?: string,
    isNewRecord?: boolean,
    admin?: boolean,
}
interface UserInfo {
    name?: string,
    mobile?: string,
    loginName?: string,
    loginFlag?: string,
    isNewRecord?: boolean,
    id?: string,
    admin?: boolean,
}
export interface I_Dictionary {
    projectType: Array<I_Dictionary_Item>,
}
interface I_Dictionary_Item {
    key?: string,
    value?: string,
    type?: string,
    name?: string,
}