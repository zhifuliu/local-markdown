export = models;

module models {
    export interface returnMsg {
        errCode: number,
        errMsg: any | UserMsg
    }

    export interface UserMsg {
        user: string,
        nickname: string,
        registerDateTime: number
    }

    export interface collection {
        url: string,
        title: string,
        oneLevelTag: string,
        twoLevelTag: string,
        remark: string,
        date: number,
        time: number
    }
}
