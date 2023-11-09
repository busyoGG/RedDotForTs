import RedDot from "./RedDot";
export enum RedDotType {
    Eternal,
    Once
}

export default class RedDotManager {
    private static _instance:RedDotManager | null = null;
    /** 红点字典 */
    private _redDotDic = {};

    public static getInst(): RedDotManager {
        if (!this._instance) {
            this._instance = new RedDotManager();
        }
        return this._instance;
    }

    /**
     * 初始化红点树
     */
    public init() {
        let root = new RedDot(null, RedDotType.Eternal);
        root._path = "root";
        this._redDotDic["root"] = root;
    }

    /**
     * 注册红点
     * @param redDot 
     */
    public register(path: string, type: RedDotType = RedDotType.Eternal): RedDot {
        let leaf = this.getRedDot(path);
        
        if (!leaf) {
            let redDotPath = path.split("/");
            let index = 0;
            let curDic = this._redDotDic["root"] as RedDot;
            let subPath = "";

            while (index < redDotPath.length) {
                let child = curDic.getChildren()[redDotPath[index]];
                subPath += (index == 0 ? "" : "/") + redDotPath[index];
                if (!child) {
                    let newRedDot = new RedDot(null, type);
                    newRedDot._path = subPath;
                    curDic.addChild(newRedDot);
                    if (index == redDotPath.length - 1) {
                        leaf = newRedDot;
                    }
                    child = newRedDot;
                    this._redDotDic[subPath] = child;
                }

                curDic = child;
                index++;
            }
        }
        return leaf;
    }

    /**
     * 改变红点数据
     * @param path 
     * @param num 
     */
    public changeDotNum(path, num) {
        let redDot = this.getRedDot(path);
        if (redDot) {
            redDot.changeDotNum(num);
        } else {
            console.warn("不存在该红点", path);
        }
    }

    /**
     * 设置红点回调
     * @param path 
     * @param callback 
     */
    public setRedDotCallback(path,callback){
        let redDot = this.getRedDot(path);
        if(redDot){
            redDot.onRedDotChanged(callback);
        }
    }

    /**
     * 移除红点回调
     * @param path 
     */
    public removeRedDotCallback(path){
        let redDot = this.getRedDot(path);
        if(redDot){
            redDot.removeRedDotChange();
        }
    }

    /**
     * 获得红点
     * @param path 
     * @returns 
     */
    private getRedDot(path: string): RedDot {
        return this._redDotDic[path];
    }

    public getRoot() {
        return this._redDotDic["root"];
    }
}