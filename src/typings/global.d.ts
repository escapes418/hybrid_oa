declare interface ObjectConstructor {
    assign(target: any, ...sources: any[]): any;
}

declare interface IF_compelteMenu {
    path: string;
    // component: any; // 生命为Promise<any> 行不通
    hidden: boolean;
    redirect?: string;
}

declare namespace tony {
    export interface ITony {
        name: string;
    }
    interface ITony_inner {
        name: string;
    }
}
