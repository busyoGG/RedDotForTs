import { RedDotType } from "./RedDotManager";

export default class RedDot {
    /** 父节点 */
    private _parent:RedDot | null;
    /** 子节点 */
    private _children;
    /** 红点节点路径 */
    public _path: string;
    /** 红点数量 */
    private _dotNum;
    /** 是否展示红点 */
    private _isShow;
    /** 红点类型 */
    private _type:RedDotType;

    private _onRedDotChangedCallback: Function | null;

    public constructor(parent = null,type = RedDotType.Eternal) {
        this._parent = parent;
        this._children = {};
        this._dotNum = 0;
        this._isShow = false;
        this._type = type;
    }

    /**
     * 添加红点子节点
     * @param child 
     */
    public addChild(child: RedDot) {
        let path = child._path;
        if (!this._children[path]) {
            this._children[path] = child;
            child._parent = this;
            //子节点有展示红点 则该节点必展示红点
            if (child._isShow) {
                this._isShow = true;
            }
            //改变红点数量
            this.changeDotNum(child.getDotNum());
        } else {
            console.warn("红点节点重复添加：", path);
        }
    }

    /**
     * 获得所有子节点
     * @returns 
     */
    public getChildren(){
        return this._children;
    }

    /**
     * 是否展示红点
     * @returns 
     */
    public checkShow() {
        this._onRedDotChangedCallback && this._onRedDotChangedCallback(this._isShow);
    }

    /**
     * 改变红点数量
     * @param num 
     */
    public changeDotNum(num: number) {
        let defDotNum = this._dotNum;
        this._dotNum += num;
        //判断是否展示红点
        if (this._dotNum <= 0) {
            this._dotNum = 0;
            this._isShow = false;
        } else {
            if(num > 0){
                this._isShow = true;
            }else{
                if(this._type == RedDotType.Once){
                    this._dotNum = 0;
                    this._isShow = false;
                }
            }
        }
        //触发红点变化回调
        this._onRedDotChangedCallback && this._onRedDotChangedCallback(this._isShow);
        //父节点改变红点数量
        this._parent && this._parent.changeDotNum(this._isShow ? num : -defDotNum);
    }

    /**
     * 获得红点数量
     * @returns 
     */
    public getDotNum() {
        return this._dotNum;
    }
    /**
     * 设置红点变化回调
     * @param callback 
     */
    public onRedDotChanged(callback) {
        this._onRedDotChangedCallback = callback;
    }

    /**
     * 移除红点变化回调
     */
    public removeRedDotChange(){
        this._onRedDotChangedCallback = null;
    }
}