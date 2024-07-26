import { Asset, assetManager, dragonBones, Rect, Sprite, SpriteFrame, Vec2 } from "cc";
import { Frame } from "./display/MovieClip";
import { PixelHitTestData } from "./event/HitTest";
import { PackageItemType, ObjectType } from "./FieldTypes";
import { UIContentScaler } from "./UIContentScaler";
import { UIPackage } from "./UIPackage";
import { ByteBuffer } from "./utils/ByteBuffer";
import { UIConfig } from "./UIConfig";
import { RefMannager } from "./RefManager";

export class PackageItem {
    public owner: UIPackage;
    public parent?: PackageItem;

    public type: PackageItemType;
    public objectType?: ObjectType;
    public id: string;
    public name: string;
    public width: number = 0;
    public height: number = 0;
    public file: string;
    public decoded?: boolean;
    public loading?: Array<Function>;
    public rawData?: ByteBuffer;
    public asset?: Asset;
    
    __loaded: boolean = false;

    public highResolution?: Array<string>;
    public branches?: Array<string>;

    //image
    public scale9Grid?: Rect;
    public scaleByTile?: boolean;
    public tileGridIndice?: number;
    public smoothing?: boolean;
    public hitTestData?: PixelHitTestData;

    //movieclip
    public interval?: number;
    public repeatDelay?: number;
    public swing?: boolean;
    public frames?: Array<Frame>;

    //componenet
    public extensionType?: any;

    //skeleton
    public skeletonAnchor?: Vec2;
    public atlasAsset?: dragonBones.DragonBonesAtlasAsset;

    private _ref: number = 0;
    public get ref(): number {
        return this._ref;
    }

    public constructor() {
    }

    public load(): Asset {
        return this.owner.getItemAsset(this);
    }

    public loadAsync() {
        return this.owner.getItemAssetAsync2(this);
    }

    public getBranch(): PackageItem {
        if (this.branches && this.owner._branchIndex != -1) {
            var itemId: string = this.branches[this.owner._branchIndex];
            if (itemId)
                return this.owner.getItemById(itemId);
        }

        return this;
    }

    public getHighResolution(): PackageItem {
        if (this.highResolution && UIContentScaler.scaleLevel > 0) {
            var itemId: string = this.highResolution[UIContentScaler.scaleLevel - 1];
            if (itemId)
                return this.owner.getItemById(itemId);
        }

        return this;
    }

    public toString(): string {
        return this.name;
    }

    public addRef(): void {
        this._ref++;
        this.parent?.addRef();

        this.asset?.addRef();
        switch (this.type) {
            case PackageItemType.Image:
                let asset = this.asset as SpriteFrame;
                if(asset.texture) {
                    asset.texture.addRef();
                }
                break;
            case PackageItemType.MovieClip:
                if (this.frames) {
                    for (var i: number = 0; i < this.frames.length; i++) {
                        var frame: Frame = this.frames[i];
                        if(frame.texture) {
                            frame.texture.addRef();
                        }

                        if(frame.altasPackageItem) {
                            frame.altasPackageItem.addRef();
                        }
                    }
                }
                break;
        }
    }

    public doRelease(): void {        
        switch (this.type) {
            case PackageItemType.MovieClip:
                if (this.frames) {
                    for (var i: number = 0; i < this.frames.length; i++) {
                        var frame: Frame = this.frames[i];
                        if(frame.texture) {
                            frame.texture.decRef(true);              

                            if(UIConfig.autoReleaseAssets) {
                                if(frame.texture.refCount==0) {                                    
                                    assetManager.releaseAsset(frame.texture);
                                }
                            }
                        }

                        if(frame.altasPackageItem) {
                            frame.altasPackageItem.decRef();
                        }
                    }
                }
                break;
        }

        if(UIConfig.autoReleaseAssets) {
            if(this.asset && this.asset.refCount==0) {
                assetManager.releaseAsset(this.asset);
            }

            if(this._ref==0) {
                this.__loaded = false;
                this.decoded = false;
                this.frames = null;
                this.asset = null;
                this.parent = null;
            }
        }
    }

    public decRef(): void {
        if (this._ref > 0) {
            this._ref--;
        }else{
            return;
        }
        
        this.parent?.decRef();
        this.asset?.decRef(false);

        if(this._ref <= 0) {
            RefMannager.deleteItem(this);
        }
    }

    public dispose(force: boolean = false): void {
        if (this.asset) {
            if(force) {
                assetManager.releaseAsset(this.asset);
            }else{
                this.asset.decRef(true);
            }
            this.asset = null;
        }
    }
}