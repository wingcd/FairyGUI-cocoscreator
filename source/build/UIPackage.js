var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
import { Asset, assetManager, AssetManager, AudioClip, BitmapFont, BufferAsset, dragonBones, ImageAsset, path, Rect, resources, Size, sp, SpriteFrame, Texture2D, Vec2 } from "cc";
var PathUtils = path;
import { ObjectType, PackageItemType } from "./FieldTypes";
import { constructingDepth } from "./GObject";
import { PackageItem } from "./PackageItem";
import { TranslationHelper } from "./TranslationHelper";
import { ByteBuffer } from "./utils/ByteBuffer";
import { PixelHitTestData } from "./event/HitTest";
import { UIConfig } from "./UIConfig";
export class UIPackage {
    constructor() {
        this._items = [];
        this._itemsById = {};
        this._itemsByName = {};
        this._sprites = {};
        this._dependencies = [];
        this._branches = [];
        this._branchIndex = -1;
    }
    static get branch() {
        return _branch;
    }
    static set branch(value) {
        _branch = value;
        for (var pkgId in _instById) {
            var pkg = _instById[pkgId];
            if (pkg._branches) {
                pkg._branchIndex = pkg._branches.indexOf(value);
            }
        }
    }
    static getVar(key) {
        return _vars[key];
    }
    static setVar(key, value) {
        _vars[key] = value;
    }
    static getById(id) {
        return _instById[id];
    }
    static getByName(name) {
        return _instByName[name];
    }
    /**
     * 注册一个包。包的所有资源必须放在resources下，且已经预加载。
     * @param path 相对 resources 的路径。
     */
    static addPackage(path) {
        let pkg = _instById[path];
        if (pkg)
            return pkg;
        let asset = resources.get(path, BufferAsset);
        if (!asset)
            throw "Resource '" + path + "' not ready";
        if (!asset._buffer)
            throw "Missing asset data.";
        pkg = new UIPackage();
        pkg._bundle = resources;
        pkg.loadPackage(new ByteBuffer(asset._buffer), path);
        assetManager.releaseAsset(asset);
        _instById[pkg.id] = pkg;
        _instByName[pkg.name] = pkg;
        _instById[pkg._path] = pkg;
        return pkg;
    }
    static loadPackage(...args) {
        let path;
        let onProgress;
        let onComplete;
        let bundle;
        if (args[0] instanceof AssetManager.Bundle) {
            bundle = args[0];
            path = args[1];
            if (args.length > 3) {
                onProgress = args[2];
                onComplete = args[3];
            }
            else
                onComplete = args[2];
        }
        else {
            path = args[0];
            if (args.length > 2) {
                onProgress = args[1];
                onComplete = args[2];
            }
            else
                onComplete = args[1];
        }
        let p = _instById[path];
        if (p) {
            onComplete === null || onComplete === void 0 ? void 0 : onComplete.call(this, null, p);
            return;
        }
        const delayLoad = UIConfig.enableDelayLoad;
        bundle = bundle || resources;
        bundle.load(path, Asset, onProgress, (err, asset) => {
            if (err) {
                if (onComplete != null)
                    onComplete(err, null);
                return;
            }
            let pkg = new UIPackage();
            pkg._bundle = bundle;
            let buffer = asset.buffer ? asset.buffer() : asset._nativeAsset;
            pkg.loadPackage(new ByteBuffer(buffer), path);
            assetManager.releaseAsset(asset);
            let cnt = pkg._items.length;
            let urls = [];
            let types = [];
            for (var i = 0; i < cnt; i++) {
                var pi = pkg._items[i];
                if (pi.type == PackageItemType.Atlas && !delayLoad || pi.type == PackageItemType.Sound) {
                    let assetType = ItemTypeToAssetType[pi.type];
                    urls.push(pi.file);
                    types.push(assetType);
                }
            }
            let total = urls.length;
            let lastErr;
            let taskComplete = (err, asset) => {
                total--;
                if (err)
                    lastErr = err;
                if (total <= 0) {
                    _instById[pkg.id] = pkg;
                    _instByName[pkg.name] = pkg;
                    if (pkg._path)
                        _instById[pkg._path] = pkg;
                    if (onComplete != null)
                        onComplete(lastErr, pkg);
                }
            };
            if (total > 0) {
                urls.forEach((url, index) => {
                    bundle.load(url, Asset, onProgress, taskComplete);
                });
            }
            else
                taskComplete(null, null);
        });
    }
    static removePackage(packageIdOrName, disposeAll = false) {
        var pkg = _instById[packageIdOrName];
        if (!pkg)
            pkg = _instByName[packageIdOrName];
        if (!pkg)
            throw "No package found: " + packageIdOrName;
        pkg.dispose(disposeAll);
        delete _instById[pkg.id];
        delete _instByName[pkg.name];
        if (pkg._path)
            delete _instById[pkg._path];
    }
    static createObject(pkgName, resName, userClass) {
        var pkg = UIPackage.getByName(pkgName);
        if (pkg)
            return pkg.createObject(resName, userClass);
        else
            return null;
    }
    static createObjectFromURL(url, userClass) {
        var pi = UIPackage.getItemByURL(url);
        if (pi)
            return pi.owner.internalCreateObject(pi, userClass);
        else
            return null;
    }
    static getItemURL(pkgName, resName) {
        var pkg = UIPackage.getByName(pkgName);
        if (!pkg)
            return null;
        var pi = pkg._itemsByName[resName];
        if (!pi)
            return null;
        return "ui://" + pkg.id + pi.id;
    }
    static getItemByURL(url) {
        var pos1 = url.indexOf("//");
        if (pos1 == -1)
            return null;
        var pos2 = url.indexOf("/", pos1 + 2);
        if (pos2 == -1) {
            if (url.length > 13) {
                var pkgId = url.substr(5, 8);
                var pkg = UIPackage.getById(pkgId);
                if (pkg != null) {
                    var srcId = url.substr(13);
                    return pkg.getItemById(srcId);
                }
            }
        }
        else {
            var pkgName = url.substr(pos1 + 2, pos2 - pos1 - 2);
            pkg = UIPackage.getByName(pkgName);
            if (pkg != null) {
                var srcName = url.substr(pos2 + 1);
                return pkg.getItemByName(srcName);
            }
        }
        return null;
    }
    static normalizeURL(url) {
        if (url == null)
            return null;
        var pos1 = url.indexOf("//");
        if (pos1 == -1)
            return null;
        var pos2 = url.indexOf("/", pos1 + 2);
        if (pos2 == -1)
            return url;
        var pkgName = url.substr(pos1 + 2, pos2 - pos1 - 2);
        var srcName = url.substr(pos2 + 1);
        return UIPackage.getItemURL(pkgName, srcName);
    }
    static setStringsSource(source) {
        TranslationHelper.loadFromXML(source);
    }
    loadPackage(buffer, path) {
        if (buffer.readUint() != 0x46475549)
            throw "FairyGUI: old package format found in '" + path + "'";
        this._path = path;
        buffer.version = buffer.readInt();
        var ver2 = buffer.version >= 2;
        var compressed = buffer.readBool();
        this._id = buffer.readString();
        this._name = buffer.readString();
        buffer.skip(20);
        var indexTablePos = buffer.position;
        var cnt;
        var i;
        var nextPos;
        var str;
        var branchIncluded;
        buffer.seek(indexTablePos, 4);
        cnt = buffer.readInt();
        var stringTable = new Array(cnt);
        buffer.stringTable = stringTable;
        for (i = 0; i < cnt; i++)
            stringTable[i] = buffer.readString();
        if (buffer.seek(indexTablePos, 5)) {
            cnt = buffer.readInt();
            for (i = 0; i < cnt; i++) {
                let index = buffer.readUshort();
                let len = buffer.readInt();
                stringTable[index] = buffer.readString(len);
            }
        }
        buffer.seek(indexTablePos, 0);
        cnt = buffer.readShort();
        for (i = 0; i < cnt; i++)
            this._dependencies.push({ id: buffer.readS(), name: buffer.readS() });
        if (ver2) {
            cnt = buffer.readShort();
            if (cnt > 0) {
                this._branches = buffer.readSArray(cnt);
                if (_branch)
                    this._branchIndex = this._branches.indexOf(_branch);
            }
            branchIncluded = cnt > 0;
        }
        buffer.seek(indexTablePos, 1);
        var pi;
        let pos = path.lastIndexOf('/');
        let shortPath = pos == -1 ? "" : path.substr(0, pos + 1);
        path = path + "_";
        cnt = buffer.readShort();
        for (i = 0; i < cnt; i++) {
            nextPos = buffer.readInt();
            nextPos += buffer.position;
            pi = new PackageItem();
            pi.owner = this;
            pi.type = buffer.readByte();
            pi.id = buffer.readS();
            pi.name = buffer.readS();
            buffer.readS(); //path
            pi.file = buffer.readS();
            buffer.readBool(); //exported
            pi.width = buffer.readInt();
            pi.height = buffer.readInt();
            switch (pi.type) {
                case PackageItemType.Image:
                    {
                        pi.objectType = ObjectType.Image;
                        var scaleOption = buffer.readByte();
                        if (scaleOption == 1) {
                            pi.scale9Grid = new Rect();
                            pi.scale9Grid.x = buffer.readInt();
                            pi.scale9Grid.y = buffer.readInt();
                            pi.scale9Grid.width = buffer.readInt();
                            pi.scale9Grid.height = buffer.readInt();
                            pi.tileGridIndice = buffer.readInt();
                        }
                        else if (scaleOption == 2)
                            pi.scaleByTile = true;
                        pi.smoothing = buffer.readBool();
                        break;
                    }
                case PackageItemType.MovieClip:
                    {
                        pi.smoothing = buffer.readBool();
                        pi.objectType = ObjectType.MovieClip;
                        pi.rawData = buffer.readBuffer();
                        break;
                    }
                case PackageItemType.Font:
                    {
                        pi.rawData = buffer.readBuffer();
                        break;
                    }
                case PackageItemType.Component:
                    {
                        var extension = buffer.readByte();
                        if (extension > 0)
                            pi.objectType = extension;
                        else
                            pi.objectType = ObjectType.Component;
                        pi.rawData = buffer.readBuffer();
                        Decls.UIObjectFactory.resolveExtension(pi);
                        break;
                    }
                case PackageItemType.Atlas:
                case PackageItemType.Sound:
                case PackageItemType.Misc:
                    {
                        pi.file = path + PathUtils.mainFileName(pi.file);
                        break;
                    }
                case PackageItemType.Spine:
                case PackageItemType.DragonBones:
                    {
                        pi.file = shortPath + PathUtils.mainFileName(pi.file);
                        pi.skeletonAnchor = new Vec2();
                        pi.skeletonAnchor.x = buffer.readFloat();
                        pi.skeletonAnchor.y = buffer.readFloat();
                        break;
                    }
            }
            if (ver2) {
                str = buffer.readS(); //branch
                if (str)
                    pi.name = str + "/" + pi.name;
                var branchCnt = buffer.readByte();
                if (branchCnt > 0) {
                    if (branchIncluded)
                        pi.branches = buffer.readSArray(branchCnt);
                    else
                        this._itemsById[buffer.readS()] = pi;
                }
                var highResCnt = buffer.readByte();
                if (highResCnt > 0)
                    pi.highResolution = buffer.readSArray(highResCnt);
            }
            this._items.push(pi);
            this._itemsById[pi.id] = pi;
            if (pi.name != null)
                this._itemsByName[pi.name] = pi;
            buffer.position = nextPos;
        }
        buffer.seek(indexTablePos, 2);
        cnt = buffer.readShort();
        for (i = 0; i < cnt; i++) {
            nextPos = buffer.readShort();
            nextPos += buffer.position;
            var itemId = buffer.readS();
            pi = this._itemsById[buffer.readS()];
            let rect = new Rect();
            rect.x = buffer.readInt();
            rect.y = buffer.readInt();
            rect.width = buffer.readInt();
            rect.height = buffer.readInt();
            var sprite = { atlas: pi, rect: rect, offset: new Vec2(), originalSize: new Size(0, 0) };
            sprite.rotated = buffer.readBool();
            if (ver2 && buffer.readBool()) {
                sprite.offset.x = buffer.readInt();
                sprite.offset.y = buffer.readInt();
                sprite.originalSize.width = buffer.readInt();
                sprite.originalSize.height = buffer.readInt();
            }
            else {
                sprite.originalSize.width = sprite.rect.width;
                sprite.originalSize.height = sprite.rect.height;
            }
            this._sprites[itemId] = sprite;
            buffer.position = nextPos;
        }
        if (buffer.seek(indexTablePos, 3)) {
            cnt = buffer.readShort();
            for (i = 0; i < cnt; i++) {
                nextPos = buffer.readInt();
                nextPos += buffer.position;
                pi = this._itemsById[buffer.readS()];
                if (pi && pi.type == PackageItemType.Image)
                    pi.hitTestData = new PixelHitTestData(buffer);
                buffer.position = nextPos;
            }
        }
    }
    dispose(force = false) {
        var cnt = this._items.length;
        for (var i = 0; i < cnt; i++) {
            var pi = this._items[i];
            pi.dispose(force);
        }
    }
    get id() {
        return this._id;
    }
    get name() {
        return this._name;
    }
    get path() {
        return this._path;
    }
    get dependencies() {
        return this._dependencies;
    }
    createObject(resName, userClass) {
        var pi = this._itemsByName[resName];
        if (pi)
            return this.internalCreateObject(pi, userClass);
        else
            return null;
    }
    internalCreateObject(item, userClass) {
        var g = Decls.UIObjectFactory.newObject(item, userClass);
        if (g == null)
            return null;
        constructingDepth.n++;
        g.constructFromResource();
        constructingDepth.n--;
        return g;
    }
    getItemById(itemId) {
        return this._itemsById[itemId];
    }
    getItemByName(resName) {
        return this._itemsByName[resName];
    }
    getItemAssetByName(resName) {
        var pi = this._itemsByName[resName];
        if (pi == null) {
            throw "Resource not found -" + resName;
        }
        return this.getItemAsset(pi);
    }
    getItemAsset(item) {
        switch (item.type) {
            case PackageItemType.Image:
                if (!item.decoded) {
                    item.decoded = true;
                    var sprite = this._sprites[item.id];
                    if (sprite) {
                        item.parent = sprite.atlas;
                        let atlasTexture = this.getItemAsset(sprite.atlas);
                        if (atlasTexture) {
                            let sf = new SpriteFrame();
                            sf.texture = atlasTexture;
                            sf.rect = sprite.rect;
                            sf.rotated = sprite.rotated;
                            sf.offset = new Vec2(sprite.offset.x - (sprite.originalSize.width - sprite.rect.width) / 2, -(sprite.offset.y - (sprite.originalSize.height - sprite.rect.height) / 2));
                            sf.originalSize = sprite.originalSize;
                            if (item.scale9Grid) {
                                sf.insetLeft = item.scale9Grid.x;
                                sf.insetTop = item.scale9Grid.y;
                                sf.insetRight = item.width - item.scale9Grid.xMax;
                                sf.insetBottom = item.height - item.scale9Grid.yMax;
                            }
                            item.asset = sf;
                        }
                    }
                    if (!UIConfig.autoReleaseAssets) {
                        item.addRef();
                    }
                }
                break;
            case PackageItemType.Atlas:
            case PackageItemType.Sound:
                if (!item.decoded) {
                    item.decoded = true;
                    item.asset = this._bundle.get(item.file, ItemTypeToAssetType[item.type]);
                    if (!item.asset)
                        console.log("Resource '" + item.file + "' not found");
                    else if (item.type == PackageItemType.Atlas) {
                        const asset = item.asset;
                        let tex = asset['_texture'];
                        if (!tex) {
                            tex = new Texture2D();
                            tex.name = asset.nativeUrl;
                            tex.image = asset;
                        }
                        item.asset = tex;
                    }
                    else {
                        item.asset = item.asset;
                    }
                    if (!UIConfig.autoReleaseAssets || item.type == PackageItemType.Sound) {
                        item.addRef();
                    }
                }
                break;
            case PackageItemType.Font:
                if (!item.decoded) {
                    item.decoded = true;
                    this.loadFont(item);
                    item.addRef();
                }
                break;
            case PackageItemType.MovieClip:
                if (!item.decoded) {
                    item.decoded = true;
                    this.loadMovieClip(item);
                    if (!UIConfig.autoReleaseAssets) {
                        item.addRef();
                    }
                }
                break;
            default:
                break;
        }
        return item.asset;
    }
    loadAssetAsync(bundle, path, type) {
        return __awaiter(this, void 0, void 0, function* () {
            return new Promise((resolve, reject) => {
                bundle.load(path, type, null, (err, asset) => {
                    if (err) {
                        reject(err);
                        return;
                    }
                    resolve(asset);
                });
            });
        });
    }
    getItemAssetAsync2(item) {
        return __awaiter(this, void 0, void 0, function* () {
            if (item.__loaded) {
                return item.asset;
            }
            switch (item.type) {
                case PackageItemType.Image:
                    if (!item.decoded) {
                        item.decoded = true;
                        var sprite = this._sprites[item.id];
                        if (sprite) {
                            item.parent = sprite.atlas;
                            let atlasTexture = yield this.getItemAssetAsync2(sprite.atlas);
                            if (atlasTexture) {
                                let sf = new SpriteFrame();
                                sf.texture = atlasTexture;
                                sf.rect = sprite.rect;
                                sf.rotated = sprite.rotated;
                                sf.offset = new Vec2(sprite.offset.x - (sprite.originalSize.width - sprite.rect.width) / 2, -(sprite.offset.y - (sprite.originalSize.height - sprite.rect.height) / 2));
                                sf.originalSize = sprite.originalSize;
                                if (item.scale9Grid) {
                                    sf.insetLeft = item.scale9Grid.x;
                                    sf.insetTop = item.scale9Grid.y;
                                    sf.insetRight = item.width - item.scale9Grid.xMax;
                                    sf.insetBottom = item.height - item.scale9Grid.yMax;
                                }
                                item.asset = sf;
                            }
                        }
                        item.__loaded = true;
                        if (!UIConfig.autoReleaseAssets) {
                            item.addRef();
                        }
                    }
                    break;
                case PackageItemType.Atlas:
                case PackageItemType.Sound:
                    if (!item.decoded) {
                        item.decoded = true;
                        item.asset = (yield this.loadAssetAsync(this._bundle, item.file, ItemTypeToAssetType[item.type]));
                        if (!item.asset)
                            console.log("Resource '" + item.file + "' not found");
                        else if (item.type == PackageItemType.Atlas) {
                            const asset = item.asset;
                            let tex = asset['_texture'];
                            if (!tex) {
                                tex = new Texture2D();
                                tex.name = asset.nativeUrl;
                                tex.image = asset;
                            }
                            item.asset = tex;
                        }
                        else {
                            item.asset = item.asset;
                        }
                        if (!UIConfig.autoReleaseAssets || item.type == PackageItemType.Sound) {
                            item.addRef();
                        }
                        item.__loaded = true;
                    }
                    break;
                case PackageItemType.Font:
                    if (!item.decoded) {
                        item.decoded = true;
                        yield this.loadFontAsync(item);
                        if (!UIConfig.autoReleaseAssets) {
                            item.addRef();
                        }
                        item.__loaded = true;
                    }
                    break;
                case PackageItemType.MovieClip:
                    if (!item.decoded) {
                        item.decoded = true;
                        yield this.loadMovieClipAsync(item);
                        item.__loaded = true;
                        if (!UIConfig.autoReleaseAssets) {
                            item.addRef();
                        }
                    }
                    break;
                default:
                    break;
            }
            let check = (done) => {
                if (!item.__loaded) {
                    setTimeout(() => {
                        check(done);
                    }, 10, this);
                }
                else {
                    done(true);
                }
            };
            yield new Promise((resolve, reject) => {
                check(resolve);
            });
            return item.asset;
        });
    }
    getItemAssetAsync(item, onComplete) {
        if (item.decoded) {
            onComplete(null, item);
            return;
        }
        if (item.loading) {
            item.loading.push(onComplete);
            return;
        }
        switch (item.type) {
            case PackageItemType.Spine:
                item.loading = [onComplete];
                this.loadSpine(item);
                break;
            case PackageItemType.DragonBones:
                item.loading = [onComplete];
                this.loadDragonBones(item);
                break;
            default:
                this.getItemAsset(item);
                onComplete(null, item);
                break;
        }
    }
    loadAllAssets() {
        var cnt = this._items.length;
        for (var i = 0; i < cnt; i++) {
            var pi = this._items[i];
            this.getItemAsset(pi);
        }
    }
    loadMovieClipAsync(item) {
        return __awaiter(this, void 0, void 0, function* () {
            var buffer = item.rawData;
            buffer.seek(0, 0);
            item.interval = buffer.readInt() / 1000;
            item.swing = buffer.readBool();
            item.repeatDelay = buffer.readInt() / 1000;
            buffer.seek(0, 1);
            var frameCount = buffer.readShort();
            item.frames = [];
            var spriteId;
            var sprite;
            for (var i = 0; i < frameCount; i++) {
                var nextPos = buffer.readShort();
                nextPos += buffer.position;
                let rect = new Rect();
                rect.x = buffer.readInt();
                rect.y = buffer.readInt();
                rect.width = buffer.readInt();
                rect.height = buffer.readInt();
                let addDelay = buffer.readInt() / 1000;
                let frame = { rect: rect, addDelay: addDelay, texture: null, altasPackageItem: null };
                spriteId = buffer.readS();
                if (spriteId != null && (sprite = this._sprites[spriteId]) != null) {
                    let atlasTexture = null;
                    atlasTexture = (yield this.getItemAssetAsync2(sprite.atlas));
                    frame.altasPackageItem = sprite.atlas;
                    if (atlasTexture) {
                        let sx = item.width / frame.rect.width;
                        let sf = new SpriteFrame();
                        sf.texture = atlasTexture;
                        sf.rect = sprite.rect;
                        sf.rotated = sprite.rotated;
                        sf.offset = new Vec2(frame.rect.x - (item.width - frame.rect.width) / 2, -(frame.rect.y - (item.height - frame.rect.height) / 2));
                        sf.originalSize = new Size(item.width, item.height);
                        frame.texture = sf;
                    }
                }
                item.frames.push(frame);
                buffer.position = nextPos;
            }
        });
    }
    loadMovieClip(item) {
        var buffer = item.rawData;
        buffer.seek(0, 0);
        item.interval = buffer.readInt() / 1000;
        item.swing = buffer.readBool();
        item.repeatDelay = buffer.readInt() / 1000;
        buffer.seek(0, 1);
        var frameCount = buffer.readShort();
        item.frames = Array(frameCount);
        var spriteId;
        var sprite;
        for (var i = 0; i < frameCount; i++) {
            var nextPos = buffer.readShort();
            nextPos += buffer.position;
            let rect = new Rect();
            rect.x = buffer.readInt();
            rect.y = buffer.readInt();
            rect.width = buffer.readInt();
            rect.height = buffer.readInt();
            let addDelay = buffer.readInt() / 1000;
            let frame = { rect: rect, addDelay: addDelay, texture: null, altasPackageItem: null };
            spriteId = buffer.readS();
            if (spriteId != null && (sprite = this._sprites[spriteId]) != null) {
                let atlasTexture = this.getItemAsset(sprite.atlas);
                frame.altasPackageItem = sprite.atlas;
                if (atlasTexture) {
                    let sx = item.width / frame.rect.width;
                    let sf = new SpriteFrame();
                    sf.texture = atlasTexture;
                    sf.rect = sprite.rect;
                    sf.rotated = sprite.rotated;
                    sf.offset = new Vec2(frame.rect.x - (item.width - frame.rect.width) / 2, -(frame.rect.y - (item.height - frame.rect.height) / 2));
                    sf.originalSize = new Size(item.width, item.height);
                    frame.texture = sf;
                }
            }
            item.frames[i] = frame;
            buffer.position = nextPos;
        }
    }
    loadFont(item) {
        var font = new BitmapFont();
        item.asset = font;
        font.fntConfig = {
            commonHeight: 0,
            fontSize: 0,
            kerningDict: {},
            fontDefDictionary: {}
        };
        let dict = font.fntConfig.fontDefDictionary;
        var buffer = item.rawData;
        buffer.seek(0, 0);
        let ttf = buffer.readBool();
        let canTint = buffer.readBool();
        let resizable = buffer.readBool();
        buffer.readBool(); //has channel
        let fontSize = buffer.readInt();
        var xadvance = buffer.readInt();
        var lineHeight = buffer.readInt();
        let mainTexture;
        var mainSprite = this._sprites[item.id];
        if (mainSprite)
            mainTexture = (this.getItemAsset(mainSprite.atlas));
        buffer.seek(0, 1);
        var bg;
        var cnt = buffer.readInt();
        for (var i = 0; i < cnt; i++) {
            var nextPos = buffer.readShort();
            nextPos += buffer.position;
            bg = {};
            var ch = buffer.readUshort();
            dict[ch] = bg;
            let rect = new Rect();
            bg.rect = rect;
            var img = buffer.readS();
            rect.x = buffer.readInt();
            rect.y = buffer.readInt();
            bg.xOffset = buffer.readInt();
            bg.yOffset = buffer.readInt();
            rect.width = buffer.readInt();
            rect.height = buffer.readInt();
            bg.xAdvance = buffer.readInt();
            bg.channel = buffer.readByte();
            if (bg.channel == 1)
                bg.channel = 3;
            else if (bg.channel == 2)
                bg.channel = 2;
            else if (bg.channel == 3)
                bg.channel = 1;
            if (ttf) {
                rect.x += mainSprite.rect.x;
                rect.y += mainSprite.rect.y;
            }
            else {
                let sprite = this._sprites[img];
                if (sprite) {
                    if (!mainSprite) {
                        mainSprite = sprite;
                    }
                    rect.set(sprite.rect);
                    bg.xOffset += sprite.offset.x;
                    bg.yOffset += sprite.offset.y;
                    if (fontSize == 0)
                        fontSize = sprite.originalSize.height;
                }
                if (bg.xAdvance == 0) {
                    if (xadvance == 0)
                        bg.xAdvance = bg.xOffset + bg.rect.width;
                    else
                        bg.xAdvance = xadvance;
                }
            }
            buffer.position = nextPos;
        }
        font.fontSize = fontSize;
        font.fntConfig.fontSize = fontSize;
        font.fntConfig.commonHeight = lineHeight == 0 ? fontSize : lineHeight;
        font.fntConfig.resizable = resizable;
        font.fntConfig.canTint = canTint;
        if (!mainTexture && mainSprite) {
            mainSprite.atlas.load();
            mainTexture = mainSprite.atlas.asset;
        }
        let spriteFrame = new SpriteFrame();
        spriteFrame.texture = mainTexture;
        font.spriteFrame = spriteFrame;
        font.onLoaded();
    }
    loadFontAsync(item) {
        return __awaiter(this, void 0, void 0, function* () {
            var font = new BitmapFont();
            item.asset = font;
            font.fntConfig = {
                commonHeight: 0,
                fontSize: 0,
                kerningDict: {},
                fontDefDictionary: {}
            };
            let dict = font.fntConfig.fontDefDictionary;
            var buffer = item.rawData;
            buffer.seek(0, 0);
            let ttf = buffer.readBool();
            let canTint = buffer.readBool();
            let resizable = buffer.readBool();
            buffer.readBool(); //has channel
            let fontSize = buffer.readInt();
            var xadvance = buffer.readInt();
            var lineHeight = buffer.readInt();
            let mainTexture;
            var mainSprite = this._sprites[item.id];
            if (mainSprite)
                mainTexture = (this.getItemAsset(mainSprite.atlas));
            buffer.seek(0, 1);
            var bg;
            var cnt = buffer.readInt();
            for (var i = 0; i < cnt; i++) {
                var nextPos = buffer.readShort();
                nextPos += buffer.position;
                bg = {};
                var ch = buffer.readUshort();
                dict[ch] = bg;
                let rect = new Rect();
                bg.rect = rect;
                var img = buffer.readS();
                rect.x = buffer.readInt();
                rect.y = buffer.readInt();
                bg.xOffset = buffer.readInt();
                bg.yOffset = buffer.readInt();
                rect.width = buffer.readInt();
                rect.height = buffer.readInt();
                bg.xAdvance = buffer.readInt();
                bg.channel = buffer.readByte();
                if (bg.channel == 1)
                    bg.channel = 3;
                else if (bg.channel == 2)
                    bg.channel = 2;
                else if (bg.channel == 3)
                    bg.channel = 1;
                if (ttf) {
                    rect.x += mainSprite.rect.x;
                    rect.y += mainSprite.rect.y;
                }
                else {
                    let sprite = this._sprites[img];
                    if (sprite) {
                        if (!mainSprite) {
                            mainSprite = sprite;
                        }
                        rect.set(sprite.rect);
                        bg.xOffset += sprite.offset.x;
                        bg.yOffset += sprite.offset.y;
                        if (fontSize == 0)
                            fontSize = sprite.originalSize.height;
                    }
                    if (bg.xAdvance == 0) {
                        if (xadvance == 0)
                            bg.xAdvance = bg.xOffset + bg.rect.width;
                        else
                            bg.xAdvance = xadvance;
                    }
                }
                buffer.position = nextPos;
            }
            font.fontSize = fontSize;
            font.fntConfig.fontSize = fontSize;
            font.fntConfig.commonHeight = lineHeight == 0 ? fontSize : lineHeight;
            font.fntConfig.resizable = resizable;
            font.fntConfig.canTint = canTint;
            if (mainSprite) {
                if (!mainTexture) {
                    yield mainSprite.atlas.loadAsync();
                    mainTexture = mainSprite.atlas.asset;
                }
                item.parent = mainSprite.atlas;
            }
            let spriteFrame = new SpriteFrame();
            spriteFrame.texture = mainTexture;
            font.spriteFrame = spriteFrame;
            font.onLoaded();
        });
    }
    loadSpine(item) {
        this._bundle.load(item.file, sp.SkeletonData, (err, asset) => {
            item.decoded = true;
            item.asset = asset;
            let arr = item.loading;
            delete item.loading;
            arr.forEach(e => e(err, item));
        });
    }
    loadDragonBones(item) {
        this._bundle.load(item.file, dragonBones.DragonBonesAsset, (err, asset) => {
            if (err) {
                item.decoded = true;
                let arr = item.loading;
                delete item.loading;
                arr.forEach(e => e(err, item));
                return;
            }
            item.asset = asset;
            let atlasFile = item.file.replace("_ske", "_tex");
            let pos = atlasFile.lastIndexOf('.');
            if (pos != -1)
                atlasFile = atlasFile.substr(0, pos + 1) + "json";
            this._bundle.load(atlasFile, dragonBones.DragonBonesAtlasAsset, (err, asset) => {
                item.decoded = true;
                item.atlasAsset = asset;
                let arr = item.loading;
                delete item.loading;
                arr.forEach(e => e(err, item));
            });
        });
    }
}
const ItemTypeToAssetType = {
    [PackageItemType.Atlas]: ImageAsset,
    [PackageItemType.Sound]: AudioClip
};
var _instById = {};
var _instByName = {};
var _branch = "";
var _vars = {};
export var Decls = {};
