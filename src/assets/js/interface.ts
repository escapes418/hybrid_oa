
export interface HasChildren {
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
