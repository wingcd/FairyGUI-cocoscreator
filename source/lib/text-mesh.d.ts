/// <reference path="./cc.d.ts" />
declare module "TextMesh/types/IChar" {
    export interface IChar {
        code: string;
        /**
         * 左下，右下，左上，右上
         */
        uvs: Float32Array;
        glyphWidth: number;
        glyphHeight: number;
        glyphAdvance: number;
        glyphRight: number;
        glyphLeft: number;
        width: number;
        height: number;
        size: number;
        ascent: number;
        descent: number;
        /**
         * channel id[0,3]
         */
        cid: number;
    }
}
declare module "TextMesh/font/FontParser" {
    export type TMFontInfo = {
        id?: number;
        version?: string;
        font?: string;
        atlas?: string;
        charset?: string;
        fontFamily?: string;
        fontSize?: number;
        padding?: number;
        padTrim?: number;
        atlasWidth?: number;
        atlasHeight?: number;
        dynamic?: number;
        staticChannels?: number;
        underLineOffset?: number;
        keepUnlderLineSpace?: number;
        underLineThickness?: number;
        strikeOffset?: number;
        strikeThickness?: number;
        scriptThickness?: number;
        chars: {
            [code: string]: TMFCharInfo;
        };
    };
    export type TMFCharInfo = {
        channelID?: number;
        x?: number;
        y?: number;
        width?: number;
        height?: number;
        size?: number;
        glyphWidth?: number;
        glyphHeight?: number;
        glyphAdvance?: number;
        glyphLeft?: number;
        glyphRight?: number;
        ascent?: number;
        descent?: number;
    };
    export class FontParser {
        private static _sid;
        private static _fonts;
        static parse(uuid: string, data: string): TMFontInfo;
    }
}
declare module "TextMesh/font/Char" {
    import { IChar } from "TextMesh/types/IChar";
    import { TMFCharInfo, TMFontInfo } from "TextMesh/font/FontParser";
    export class Char implements IChar {
        static: boolean;
        code: string;
        /**
         * 左下，右下，左上，右上
         */
        uvs: Float32Array;
        glyphWidth: number;
        glyphHeight: number;
        glyphAdvance: number;
        glyphRight: number;
        glyphLeft: number;
        width: number;
        height: number;
        size: number;
        ascent: number;
        descent: number;
        /**
         * channel id[0,3]
         */
        cid: number;
        static fromTMFCharInfo(code: string, tmfFont: TMFontInfo, charInfo: TMFCharInfo): Char;
    }
    export type CharSet = {
        [code: string]: Char;
    };
}
declare module "TextMesh/label/types" {
    export enum ETextDirection {
        Horizontal = 0,
        Vertical = 1
    }
    export enum ETextHorizontalAlign {
        Left = 0,
        Center = 1,
        Right = 2
    }
    export enum ETextVerticalAlign {
        Top = 0,
        Middle = 1,
        Bottom = 2
    }
    /**
     * @en Enum for Overflow.
     *
     * @zh 文本超载类型。
     */
    export enum ETextOverflow {
        /**
         * @en None.
         *
         * @zh 此模式下，组件宽度是自动变化的
         */
        None = 0,
        /**
         * @en In CLAMP mode, when label content goes out of the bounding box, it will be clipped.
         *
         * @zh CLAMP 模式中，当文本内容超出边界框时，多余的会被截断。
         */
        Clamp = 1,
        /**
         * @en In SHRINK mode, the font size will change dynamically to adapt the content size.
         * This mode may takes up more CPU resources when the label is refreshed.
         *
         * @zh SHRINK 模式，字体大小会动态变化，以适应内容大小。这个模式在文本刷新的时候可能会占用较多 CPU 资源。
         */
        Shrink = 2,
        /**
         * @en In RESIZE_HEIGHT mode, you can only change the width of label and the height is changed automatically.
         *
         * @zh 在 RESIZE_HEIGHT 模式下，只能更改文本的宽度，高度是自动改变的。
         */
        ResizeHeight = 4
    }
    export enum EScriptType {
        None = 0,
        SuperScript = 1,
        SubScript = 2
    }
    export class Margin {
        onChanged: Function;
        private _left;
        private _right;
        private _top;
        private _bottom;
        get left(): number;
        set left(val: number);
        get right(): number;
        set right(val: number);
        get top(): number;
        set top(val: number);
        get bottom(): number;
        set bottom(val: number);
    }
}
declare module "TextMesh/label/StyleMapper" {
    import { EScriptType } from "TextMesh/label/types";
    export var StyleMapper: {
        tagMap: {
            br: string;
        };
        sup: {
            field: string;
            value: EScriptType;
        };
        sub: {
            field: string;
            value: EScriptType;
        };
        u: {
            field: string;
            value: boolean;
        };
        s: {
            field: string;
            value: boolean;
        };
        i: {
            field: string;
            value: boolean;
        };
        b: {
            field: string;
            value: number;
        };
        bg: {
            field: string;
            value: boolean;
        };
        "color-lt": {
            field: string;
        };
        "color-lb": {
            field: string;
        };
        "color-rt": {
            field: string;
        };
        "color-rb": {
            field: string;
        };
        color: {
            field: string;
            value: number;
            attributes: {
                lt: {
                    mapper: string;
                };
                lb: {
                    mapper: string;
                };
                rt: {
                    mapper: string;
                };
                rb: {
                    mapper: string;
                };
            };
        };
        "shadow-color": {
            field: string;
        };
        "shadow-x": {
            field: string;
        };
        "shadow-y": {
            field: string;
        };
        "shadow-blur": {
            field: string;
        };
        shadow: {
            field: string;
            value: number;
            attributes: {
                color: {
                    mapper: string;
                };
                x: {
                    mapper: string;
                };
                y: {
                    mapper: string;
                };
                blur: {
                    mapper: string;
                };
            };
        };
        "stroke-color": {
            field: string;
        };
        "stroke-blur": {
            field: string;
        };
        stroke: {
            field: string;
            attributes: {
                color: {
                    mapper: string;
                };
                blur: {
                    mapper: string;
                };
            };
        };
        "outline-color": {
            field: string;
        };
        "outline-blur": {
            field: string;
        };
        outline: {
            field: string;
            attributes: {
                color: {
                    mapper: string;
                };
                blur: {
                    mapper: string;
                };
            };
        };
        dilate: {
            field: string;
        };
        "background-color": {
            field: string;
        };
        background: {
            field: string;
            value: boolean;
            attributes: {
                color: {
                    mapper: string;
                };
            };
        };
        "mask-color": {
            field: string;
        };
        mask: {
            field: string;
            value: boolean;
            attributes: {
                color: {
                    mapper: string;
                };
            };
        };
        "font-size": {
            field: string;
        };
        font: {
            field: string;
            value: boolean;
            attributes: {
                size: {
                    mapper: string;
                };
            };
        };
    };
}
declare module "TextMesh/label/TextStyle" {
    import { Color } from "cc";
    import { TMFont } from "TextMesh/font/TMFont";
    import { EScriptType } from "TextMesh/label/types";
    export enum ECornerType {
        LT = 0,
        RT = 1,
        LB = 2,
        RB = 3
    }
    export class TextStyle {
        [key: string]: any;
        private _$color;
        private _$colorLT;
        private _$colorLB;
        private _$colorRT;
        private _$colorRB;
        private _$shadow;
        private _$shadowColor;
        private _$shadowX;
        private _$shadowY;
        private _$shadowBlur;
        private _$stroke;
        private _$strokeBlur;
        private _$strokeColor;
        private _$backgroundColor;
        private _$maskColor;
        private _$fontSize;
        private _$dilate;
        private _$scriptType;
        private _$strike;
        private _$strikeColor;
        private _$underline;
        private _$underlineColor;
        private _$italic;
        private _$background;
        private _$mask;
        private _tmFont;
        private _fontSize;
        private _dilate;
        private _background;
        private _mask;
        private _italic;
        private _scriptType;
        private _strike;
        private _strikeRGBA;
        private _underline;
        private _underlineRGBA;
        private _fillRGBA;
        private _enableColorLT;
        private _enableColorLB;
        private _enableColorRT;
        private _enableColorRB;
        private _colorLT;
        private _colorLB;
        private _colorRT;
        private _colorRB;
        private _strokeRGBA;
        private _shadowRGBA;
        private _backgroundRGBA;
        private _maskRGBA;
        private _stroke;
        private _strokeBlur;
        private _gamma;
        private _shadow;
        private _shadowBlur;
        private _shadowOffsetX;
        private _shadowOffsetY;
        private _realFontSize;
        constructor(tmFont?: TMFont);
        get font(): TMFont;
        set font(value: TMFont);
        get realFontSize(): number;
        reset(): void;
        clone(): TextStyle;
        copyFrom(from: TextStyle, onlyChanged?: boolean): this;
        static copy(from: TextStyle): TextStyle;
        private calcFontSize;
        private getColor;
        preset(): void;
        calculate(): void;
        private calcGamma;
        get fontSize(): number;
        setFontSize(fontSize: number, focus?: boolean): void;
        get shadow(): number;
        setShadow(value: number, focus?: boolean): void;
        get shadowOffsetX(): number;
        setShadowOffsetX(value: number, focus?: boolean): void;
        get shadowOffsetY(): number;
        setShadowOffsetY(value: number, focus?: boolean): void;
        get fillRGBA(): Color;
        /**
         * 设置文本颜色
         * @param color
         * @param focus 如果为false，且颜色未通过样式设置过时，才可以改变
         */
        setFillColor(color: Color, focus?: boolean): void;
        get enableColorLB(): boolean;
        set enableColorLB(value: boolean);
        get enableColorLT(): boolean;
        set enableColorLT(value: boolean);
        get enableColorRB(): boolean;
        set enableColorRB(value: boolean);
        get enableColorRT(): boolean;
        set enableColorRT(value: boolean);
        getFillColor(corner: ECornerType): Color;
        get colorLB(): Color;
        setColorLB(color: Color, focus?: boolean): void;
        get colorLT(): Color;
        setColorLT(color: Color, focus?: boolean): void;
        get colorRB(): Color;
        setColorRB(color: Color, focus?: boolean): void;
        get colorRT(): Color;
        setColorRT(color: Color, focus?: boolean): void;
        get strokeRGBA(): Color;
        setStrokeColor(color: Color, focus?: boolean): void;
        get shadowRGBA(): Color;
        setShadowColor(color: Color, focus?: boolean): void;
        get backgroundRGBA(): Color;
        setBackgroundColor(color: Color, focus?: boolean): void;
        get maskRGBA(): Color;
        setMaskColor(color: Color, focus?: boolean): void;
        get dilate(): number;
        setDilate(value: number, focus?: boolean): void;
        get stroke(): number;
        setStroke(value: number, focus?: boolean): void;
        get strokeBlur(): number;
        setStrokeBlur(value: number, focus?: boolean): void;
        get gamma(): number;
        get background(): boolean;
        setBackground(value: boolean, focus?: boolean): void;
        get mask(): boolean;
        setMask(value: boolean, focus?: boolean): void;
        get shadowBlur(): number;
        setShadowBlur(value: number, focus?: boolean): void;
        get italic(): boolean;
        setItalic(value: boolean, focus?: boolean): void;
        get scriptType(): EScriptType;
        setScriptType(value: EScriptType, focus?: boolean): void;
        get strike(): boolean;
        setStrike(value: boolean, focus?: boolean): void;
        get strikeRGBA(): Color;
        setStrikeColor(color: Color, focus?: boolean): void;
        get underline(): boolean;
        setUnderline(value: boolean, focus?: boolean): void;
        get underlineRGBA(): Color;
        setUnderlineColor(color: Color, focus?: boolean): void;
        private setAttributeFromObject;
        parseFromJson(json: object): void;
        parseFromJsonStr(style: string): void;
    }
}
declare module "TextMesh/label/LayoutTypes" {
    import { Node } from "cc";
    export class Clickable {
        name: string;
        value: string;
        start: number;
        end: number;
    }
    export enum ESlotType {
        Custom = 0,
        Image = 1,
        Prefab = 2
    }
    export const ImageTAG = "img";
    export const PrefabTAG = "pb";
    export const SlotTAG = "slot";
    export const SlotTypeMap: {};
    export function isSlotType(type: string): boolean;
    export enum ESlotSizeType {
        None = 0,
        HeightFirst = 1,
        WidthFirst = 2
    }
    export class Slot {
        index: number;
        type: ESlotType;
        tag: string;
        name: string;
        src: string;
        width: number;
        height: number;
        node: Node;
        dx: number;
        dy: number;
        fixed: boolean;
        sizeType: ESlotSizeType;
    }
}
declare module "TextMesh/vertex/ETMQuadType" {
    export enum ETMQuadType {
        Char = 0,
        UnderLine = 1,
        DeleteLine = 2,
        Background = 3,
        Mask = 4,
        Shadow = 5
    }
}
declare module "TextMesh/label/CharInfo" {
    import { TMFont } from "TextMesh/font/TMFont";
    import { Char } from "TextMesh/font/Char";
    import { TextStyle } from "TextMesh/label/TextStyle";
    import { Slot, Clickable } from "TextMesh/label/LayoutTypes";
    import { ETMQuadType } from "TextMesh/vertex/ETMQuadType";
    export class CharVertex {
        x: number;
        y: number;
        z: number;
        rx: number;
        ry: number;
        scale: number;
        rot: number;
        u: number;
        v: number;
        u1: number;
        v1: number;
        uw: number;
        vh: number;
        type: ETMQuadType;
    }
    export class CharInfo {
        index: number;
        font: TMFont;
        blendMode: number;
        char: Char;
        visible: boolean;
        style: TextStyle;
        /**
         * 顶点坐标：左下、右下、左上、右上
         */
        vertexData: CharVertex[];
        alpha: number;
        x: number;
        y: number;
        baseY: number;
        startY: number;
        rotate?: boolean;
        ascent: number;
        descent: number;
        realWidth: number;
        realHeight: number;
        fontSize: number;
        offsetX: number;
        offsetY: number;
        fixedY: number;
        w: number;
        h: number;
        glyphLeft: number;
        glyphRight: number;
        sw: number;
        sw1: number;
        cjk: boolean;
        scale: number;
        slot: Slot;
        click: Clickable;
        line: number;
        inline: number;
        visibleChar: boolean;
        shadowChar: CharInfo;
        addVertex(): CharVertex;
        copyFrom(charInfo: CharInfo): void;
        reset(): void;
    }
    export function putCharInfoToPool(charInfo: CharInfo): void;
    export function getCharInfoFromPool(): CharInfo;
}
declare module "TextMesh/types/IFontData" {
    import { Texture2D } from "cc";
    import { Char, CharSet } from "TextMesh/font/Char";
    import { ITMFont } from "TextMesh/types/ITMFont";
    import { GlyphInfo } from "./types";
    export interface IFontData {
        tmFont: ITMFont;
        texture: Texture2D;
        chars: CharSet;
        spaceSize: number;
        safePadding: number;
        initial(): void;
        getCharInfo(code: string, charRender?: (code: string, tmFont: ITMFont) => GlyphInfo): Char;
        getRoundLine(): Char;
        getRectLine(): Char;
        removeDynamicChar(code: string): void;
    }
}
declare module "TextMesh/types/ITMFont" {
    import { TTFFont } from "cc";
    import { Char } from "TextMesh/font/Char";
    import { IFontData } from "TextMesh/types/IFontData";
    export interface ITMFont {
        font: TTFFont;
        fontFamily: string;
        fontSize: number;
        padding: number;
        padTrim: boolean;
        textureWidth: number;
        textureHeight: number;
        staticChannels: number;
        fontData: IFontData;
        dynamic: boolean;
        underLineOffset?: number;
        keepUnlderLineSpace?: boolean;
        underLineThickness?: number;
        strikeOffset?: number;
        strikeThickness?: number;
        scriptThickness?: number;
        getCharInfo(code: string): Char;
        removeDynamicChar(code: string): void;
    }
}
declare module "TextMesh/font/TextureChannel" {
    import { ITMFont } from "TextMesh/types/ITMFont";
    import LRU from "lru-cache";
    import { SpaceInfo } from "../types/types";
    export class TextureChannel {
        private _tmFont;
        private _isDynamic;
        private _index;
        private _rowSize;
        private _colSize;
        private _capacity;
        private _size;
        private _lru;
        private _disposedSpaces;
        private _count;
        get index(): number;
        get isDynamic(): boolean;
        get count(): number;
        get rowSize(): number;
        get colSize(): number;
        get capacity(): number;
        get lru(): LRU<string, SpaceInfo>;
        constructor(tmFont: ITMFont, index: number, isDynamic: boolean, lru?: LRU<string, SpaceInfo>);
        isFull(): boolean;
        /**
         * 分配新的字符空位
         * @param code 字符编码
         * @returns 空位信息
         */
        spanEmptySpace(code: string): SpaceInfo;
    }
}
declare module "TextMesh/utils/CanvasPool" {
    export interface ISharedLabelData {
        canvas: HTMLCanvasElement;
        context: CanvasRenderingContext2D | null;
    }
    export class CanvasPool {
        static getInstance(): CanvasPool;
        pool: ISharedLabelData[];
        get(): ISharedLabelData;
        put(canvas: ISharedLabelData): void;
    }
}
declare module "TextMesh/utils/LetterRenderTexture" {
    import { ImageAsset, Texture2D } from "cc";
    export class LetterRenderTexture extends Texture2D {
        /**
         * @en
         * Init the render texture with size.
         * @zh
         * 初始化 render texture。
         * @param [width]
         * @param [height]
         * @param [string]
         */
        initWithSize(width: number, height: number, format?: number): void;
        /**
         * @en Draw a texture to the specified position
         * @zh 将指定的图片渲染到指定的位置上。
         * @param {Texture2D} image
         * @param {Number} x
         * @param {Number} y
         */
        drawTextureAt(image: ImageAsset, x: number, y: number): void;
    }
}
declare module "TextMesh/libs/tinysdf/index" {
    import { GlyphInfo } from "../../types/types";
    export default class TinySDF {
        buffer: number;
        cutoff: number;
        radius: number;
        canvas: HTMLCanvasElement;
        ctx: CanvasRenderingContext2D;
        size: number;
        gridOuter: Float64Array;
        gridInner: Float64Array;
        f: Float64Array;
        d: Float64Array;
        z: Float64Array;
        v: Uint16Array;
        middle: number;
        fontSize: number;
        fontFamily: string;
        fontWeight: string;
        fontStyle: string;
        cacheCanvas: boolean;
        trimBuffer: boolean;
        private antiAlis;
        private resolution;
        private canvasInst;
        private image;
        private texture;
        private supportGetData;
        constructor({ fontSize, buffer, radius, cutoff, fontFamily, fontWeight, fontStyle, cacheCanvas, trimBuffer, }?: {
            fontSize?: number;
            buffer?: number;
            radius?: number;
            cutoff?: number;
            fontFamily?: string;
            fontWeight?: string;
            fontStyle?: string;
            cacheCanvas?: boolean;
            trimBuffer?: boolean;
        });
        static calcuteFontSize(fontSize: number, buffer: number): number;
        setFontFamily(fontFamily: string): void;
        private _createCanvas;
        private beforeDraw;
        private afterDraw;
        draw(char: string, fontFamily?: string, measureText?: string, onDraw?: (canvas: HTMLCanvasElement, context: CanvasRenderingContext2D, width: number, height: number, sx: number, sy: number) => void, trimBuffer?: boolean): GlyphInfo;
        /**
         * 通过纹理读取制定区域的像素值
         * @param src 纹理
         * @param rect 区域，为空表示全部区域
         * @param buffer 返回数组
         * @returns 返回数组
         */
        private readTexturePixels;
        private round;
        private _trimBuffer;
    }
}
declare module "TextMesh/font/const" {
    export var CharConst: {
        RoundLine: string;
        RectLine: string;
        NoneChar: string;
        MeasureText: string;
    };
}
declare module "TextMesh/font/FontHelper" {
    import TinySDF from "TextMesh/libs/tinysdf/index";
    import { ITMFont } from "TextMesh/types/ITMFont";
    import { GlyphInfo } from "../types/types";
    export class FontHelper {
        private static _sdfs;
        static getSDF(tmFont: ITMFont): TinySDF;
        private static getFontFamily;
        static getKey(code: string, tmFont: ITMFont): string;
        static createSDFChar(code: string, tmFont: ITMFont): GlyphInfo;
        static getRoundLine(code: string, tmFont: ITMFont): GlyphInfo;
        static getRectLine(code: string, tmFont: ITMFont): GlyphInfo;
        static getNoneChar(code: string, tmFont: ITMFont): GlyphInfo;
    }
}
declare module "TextMesh/utils/Utils" {
    import { Rect, RenderTexture, Texture2D } from "cc";
    export class Utils {
        static readTexturePixels(src: RenderTexture | Texture2D, rect?: Rect, buffer?: Uint8Array): Uint8Array;
        static uploadData(target: RenderTexture | Texture2D, source: HTMLCanvasElement | HTMLImageElement | ArrayBufferView | ImageBitmap, rect?: Rect, level?: number, arrayIndex?: number): void;
        static until(condition: () => boolean): Promise<void>;
        static arrayBufferToString(buffer: ArrayBuffer, begin?: number): string;
    }
}
declare module "TextMesh/font/FontData" {
    import { Texture2D } from "cc";
    import { ITMFont } from "TextMesh/types/ITMFont";
    import { Char, CharSet } from "TextMesh/font/Char";
    import { IFontData } from "TextMesh/types/IFontData";
    import { TextureChannel } from "TextMesh/font/TextureChannel";
    import { GlyphInfo } from "../types/types";
    import { TMFontInfo } from "TextMesh/font/FontParser";
    export class FontData implements IFontData {
        private _tmFont;
        private _texture;
        private _letters;
        private _staticLetters;
        private _dynamicChannels;
        private _actualSize;
        private _buffer;
        private _fontRect;
        private _safePadding;
        get tmFont(): ITMFont;
        get texture(): Texture2D;
        get chars(): CharSet;
        get spaceSize(): number;
        get safePadding(): number;
        constructor(tmFont: ITMFont, texture?: Texture2D, channels?: TextureChannel[], tmfInfo?: TMFontInfo);
        initial(): void;
        private createDynamicChannels;
        removeDynamicChar(code: string): void;
        getRoundLine(): Char;
        getRectLine(): Char;
        getNoneChar(): Char;
        getCharInfo(code: string, charRender?: (code: string, tmFont: ITMFont) => GlyphInfo, thisRender?: any): Char;
        private clearChannel;
        private writeToTexture;
    }
}
declare module "TextMesh/utils/ResManger" {
    import { Asset } from "cc";
    export class ResManager {
        static preload(uuid: string, progress?: Function): Promise<unknown>;
        static loadAB(abName: string, progress?: Function): Promise<unknown>;
        static getBundle(abName?: string): import("cc").AssetManager.Bundle;
        static getByUUIDAsync<T = Asset>(uuid: string, type: typeof Asset): Promise<T>;
        static get<T>(abName: string, url: string | Array<string>, type: typeof Asset): T | T[];
        static getAsync<T>(abName: string, url: string | Array<string>, type: typeof Asset): Promise<any>;
        static load<T>(abName: string, url: string | Array<string>, type: typeof Asset, onProgress?: any): Promise<T | T[]>;
        static loadDir(abName: string, url: string | Array<string>, onProgress?: any): Promise<Asset[]>;
        /**
         * 编辑器下加载资源
         * @param url db://assets/
         */
        static editorLoad<T>(url: string): Promise<T>;
    }
}
declare module "TextMesh/font/TMFont" {
    import { Asset, BufferAsset, TextAsset, Texture2D, TTFFont } from "cc";
    import { Char } from "TextMesh/font/Char";
    import { IFontData } from "TextMesh/types/IFontData";
    import { ITMFont } from "TextMesh/types/ITMFont";
    import { TMFontInfo } from "TextMesh/font/FontParser";
    export class TMFont extends Asset implements ITMFont {
        private static _fontMap;
        private static _loadingMap;
        private _version;
        private _uid;
        private _font;
        private _fontFamily;
        private _fontData;
        private _fontSize;
        private _padding;
        private _atlasWidth;
        private _atlasHeight;
        private _staticChannels;
        private _dynamic;
        private _padTrim;
        private _underLineOffset;
        private _keepUnlderLineSpace;
        private _underLineThickness;
        private _strikeOffset;
        private _strikeThickness;
        private _scriptThickness;
        private _chars;
        get uid(): string;
        get font(): TTFFont;
        get fontFamily(): string;
        get fontSize(): number;
        get padding(): number;
        get textureWidth(): number;
        get textureHeight(): number;
        get dynamic(): boolean;
        get staticChannels(): number;
        get fontData(): IFontData;
        get underLineOffset(): number;
        get underLineThickness(): number;
        get keepUnlderLineSpace(): boolean;
        get strikeOffset(): number;
        /**
         * 删除线宽度（百分比：0-1）
         */
        get strikeThickness(): number;
        get scriptThickness(): number;
        get padTrim(): boolean;
        constructor();
        initial(font?: TTFFont, texture?: Texture2D, tmfInfo?: TMFontInfo): void;
        getCharInfo(code: string): Char;
        removeDynamicChar(code: string): void;
        private _loadFontInfo;
        private isNone;
        static deserializeAsync(data: string | TextAsset | ArrayBuffer | BufferAsset): Promise<TMFont>;
        static deserialize(data: string | TextAsset | ArrayBuffer | BufferAsset): TMFont;
    }
}
declare module "TextMesh/libs/hanzi/code" {
    export const DIANHAO = "\u3002\uFF0C\u3001\uFF0E\uFF1A\uFF1B\uFF01\u203C\uFF1F\u2047 .,;:~`?!";
    export const BIAOHAO = "\u300C\u300D\u300E\u300F\u201C\u201D\u2018\u2019\uFF08\uFF09()\u3010\u3011\u3016\u3017\u3014\u3015\uFF3B\uFF3D\uFF5B\uFF5D\u2E3A\u2014\u2026\u25CF\u2022\u2013\uFF5E~\uFF5E\uFF5E\u00B7\uFE4F\u300A\u300B\u3008\u3009\uFF3F/\uFF0F\\ {}[]()<>\"'";
    export const BIAODIAN: string;
    export const BIAODIANVALIDATEND = "\u3002\uFF0C\u3001\uFF0E\uFF1A\uFF1B\uFF01\u203C\uFF1F\u2047\u300D\u300F\u201D\u2019\uFF09\u3011\u3017\u3015\uFF3D\uFF5D\u300B\u3009 .,)!;]}'>\"?";
    export const BIAODIANVALIDATSTART = "\u300C\u300E\u201C\u2018\uFF08\u3010\u3016\u3014\uFF3B\uFF5B\u300A\u3008 ({['\"<";
    export const INCOMPRESSIBLE = "\u203C\u2047\u2E3A\u2014";
    export const COMPRESSLEFT = "\u300C\u300E\u201C\u2018\uFF08\u3010\u3016\u3014\uFF3B\uFF5B\u300A\u3008 ({['\"<";
    export const ALLBIAODIAN: string[];
    export const LINEBREAKING = " )]\uFF5D\u3015\u3009\u300B\u300D\u300F\u3011\u3019\u3017\u301F\u2019\u201D\uFF60\u00BB\u30FD\u30FE\u30FC\u30A1\u30A3\u30A5\u30A7\u30A9\u30C3\u30E3\u30E5\u30E7\u30EE\u30F5\u30F6\u3041\u3043\u3045\u3047\u3049\u3063\u3083\u3085\u3087\u308E\u3095\u3096\u31F0\u31F1\u31F2\u31F3\u31F4\u31F5\u31F6\u31F7\u31F8\u31F9\u31FA\u31FB\u31FC\u31FD\u31FE\u31FF\u3005\u303B\u2010\u30A0\u2013\u301C?!\u203C\u2047\u2048\u2049\u30FB\u3001%,.:;\u3002\uFF01\uFF1F\uFF3D\uFF09\uFF1A\uFF1B\uFF1D}\u00A2\u00B0\"\u2020\u2021\u2103\u3006\uFF05\uFF0C\uFF0E";
    export const LINELEADING = "([\uFF5B\u3014\u3008\u300A\u300C\u300E\u3010\u3018\u3016\u301D\u2018\u201C\uFF5F\u00AB$\u2014\u2026\u2025\u3033\u3034\u3035\uFF3B\uFF08{\u00A3\u00A5\"\u3005\u3007\uFF04\uFFE5\uFFE6#";
}
declare module "TextMesh/libs/hanzi/isCJK" {
    export function isCJK(text: any): any;
}
declare module "TextMesh/libs/phaser/TextStyle" {
    import { Measure } from "TextMesh/libs/phaser/MeasureText";
    export interface IText {
        width: number;
        height: number;
        updateText(): any;
    }
    export interface IFont {
        fontFamily?: string;
        fontSize?: string;
        fontStyle?: string;
    }
    export interface ITextStyle {
        fontFamily?: string;
        fontSize?: string;
        fontStyle?: string;
        backgroundColor?: string;
        color?: string;
        stroke?: string;
        strokeThickness?: number;
        shadowOffsetX?: number;
        shadowOffsetY?: number;
        shadowColor?: string;
        shadowBlur?: number;
        shadowStroke?: boolean;
        shadowFill?: boolean;
        align?: string;
        maxLines?: number;
        fixedWidth?: number;
        fixedHeight?: number;
        resolution?: number;
        rtl?: boolean;
        testString?: string;
        baselineX?: number;
        baselineY?: number;
        wordWrapWidth?: number;
    }
    export type TextStyleWordWrapCallback = (text: string, textObject: Text) => void;
    export class TextStyle {
        parent: IText;
        fontFamily?: string;
        fontSize?: string;
        fontStyle?: string;
        backgroundColor?: string;
        color?: string;
        stroke?: string;
        strokeThickness: number;
        shadowOffsetX?: number;
        shadowOffsetY?: number;
        shadowColor?: string;
        shadowBlur?: number;
        shadowStroke?: boolean;
        shadowFill?: boolean;
        align?: string;
        maxLines?: number;
        fixedWidth?: number;
        fixedHeight?: number;
        resolution?: number;
        rtl?: boolean;
        testString?: string;
        baselineX?: number;
        baselineY?: number;
        wordWrapWidth?: number;
        wordWrapCallback?: TextStyleWordWrapCallback;
        wordWrapCallbackScope?: any;
        wordWrapUseAdvanced?: boolean;
        metrics: Measure;
        private _font;
        constructor(text: IText, style?: any);
        setStyle(style?: ITextStyle, updateText?: boolean, setDefaults?: boolean): any;
        syncFont(canvas: HTMLCanvasElement, context: CanvasRenderingContext2D): void;
        syncStyle(canvas: HTMLCanvasElement, context: CanvasRenderingContext2D): void;
        syncShadow(context: CanvasRenderingContext2D, enabled: boolean): void;
        update(recalculateMetrics: any): any;
        setFont(font: IFont, updateText?: boolean): IText;
        setFontFamily(family: string): IText;
        setFontStyle(style: string): IText;
        setFontSize(size: string | number): IText;
        setTestString(string: string): any;
        setFixedSize(width: number, height: number): any;
        setBackgroundColor(color: string): any;
        setFillfunction(color: string): any;
        setColor(color: string): any;
        setResolution(value: number): any;
        setStroke(color: string, thickness: number): IText;
        setShadow(x: number, y?: number, color?: string, blur?: number, shadowStroke?: boolean, shadowFill?: boolean): any;
        setShadowOffset(x?: number, y?: number): any;
        setShadowColor(color?: string): any;
        setShadowBlur(blur?: number): any;
        setShadowStroke(enabled: boolean): any;
        setShadowFill(enabled: boolean): any;
        setWordWrapWidth(width: number, useAdvancedWrap?: boolean): any;
        setWordWrapCallback(callback: TextStyleWordWrapCallback, scope?: any): any;
        setAlign(align?: string): any;
        setMaxLines(max?: number): any;
        getTextMetrics(): Measure;
        destroy(): void;
    }
}
declare module "TextMesh/libs/phaser/MeasureText" {
    import { TextStyle } from "TextMesh/libs/phaser/TextStyle";
    export type Measure = {
        ascent: number;
        descent: number;
        fontSize: number;
    };
    export class MeasureText {
        static create(textStyle: TextStyle): Measure;
    }
}
declare module "TextMesh/font/FontUtils" {
    export function getStringArray(text: string): string[];
}
declare module "TextMesh/vertex/TMRenderData" {
    import { Color, IRenderData, Pool } from "cc";
    import { Char } from "TextMesh/font/Char";
    import { CharInfo } from "TextMesh/label/CharInfo";
    import { TextStyle } from "TextMesh/label/TextStyle";
    import { ETMQuadType } from "TextMesh/vertex/ETMQuadType";
    export class TMRenderData implements IRenderData {
        x: number;
        y: number;
        z: number;
        u: number;
        v: number;
        u1: number;
        v1: number;
        color: Color;
        textureId: number;
        stroke: number;
        strokeBlur: number;
        fill: number;
        strokeColor: Color;
        shadowColor: Color;
        shadow: number;
        shadowBlur: number;
        shadowOffsetX: number;
        shadowOffsetY: number;
        char: Char;
        type: ETMQuadType;
        style: TextStyle;
    }
    export var TMRenderDataPool: Pool<TMRenderData>;
    export type TMRenderDataArray = TMRenderData[];
    export class TMQuadRenderData {
        charInfo: CharInfo;
        type: ETMQuadType;
        startIndex: number;
        endIndex: number;
        length: number;
        height: number;
        maxHeight: number;
        reset(): void;
    }
    export var TMQuadRenderDataPool: Pool<TMQuadRenderData>;
    export var putTMQuadRenderDataToPool: (quad: TMQuadRenderData) => void;
}
declare module "TextMesh/vertex/VertexFormat" {
    import { gfx } from "cc";
    export const vfmtTMVertex: gfx.Attribute[];
}
declare module "TextMesh/types/ITypeSet" {
    import { Vec2 } from "cc";
    import { TextMeshLabel } from "TextMesh/label/TextMeshLabel";
    import { HitTestResult } from "./types";
    export interface ITypeSet {
        layout(comp: TextMeshLabel): LayoutResult;
        hitTest(comp: TextMeshLabel, screenPos: Vec2, accurate?: boolean): HitTestResult;
    }
    export type LayoutResult = {
        lines: number[][];
        maxWidth: number;
        maxHeight: number;
        linesHeight: number[];
        linesWidth: number[];
        lastMaxDescent: number;
    };
}
declare module "TextMesh/utils/Const" {
    export var ItalicSkewFactor: number;
    export var VertexMaxSize: number;
}
declare module "TextMesh/typeset/BaseTypeSet" {
    import { TextMeshLabel } from "TextMesh/label/TextMeshLabel";
    import { CharInfo } from "TextMesh/label/CharInfo";
    import { ITypeSet, LayoutResult } from "TextMesh/types/ITypeSet";
    import { Vec2 } from "cc";
    import { HitTestResult } from "../types/types";
    class AddtiveLineInfo {
        startIndex: number;
        lineLength: number;
        lineHeight: number;
        boundHeight: number;
        startY: number;
        existInLine: boolean;
        reset(): void;
    }
    type BeginUpdateHandler = (comp: TextMeshLabel, index: number, newLine: boolean) => void;
    type EndUpdateHandler = (comp: TextMeshLabel, index: number) => void;
    export class BaseTypeSet implements ITypeSet {
        protected hitTestResult: {
            result?: boolean;
            accurate?: boolean;
            charInfo?: CharInfo;
        };
        protected breakLineInfo: {
            lineIndex?: number;
            index?: number;
            lineHeight?: number;
            maxDescent?: number;
            maxAscent?: number;
            maxHeight?: number;
        };
        protected underLineInfo: AddtiveLineInfo;
        protected strikeInfo: AddtiveLineInfo;
        protected backgroundInfo: AddtiveLineInfo;
        protected maskInfo: AddtiveLineInfo;
        protected beginUpdateHandlers: BeginUpdateHandler[];
        protected endUpdateHandlers: EndUpdateHandler[];
        constructor();
        protected registUpdates(): void;
        hitTest(comp: TextMeshLabel, touchPos: Vec2): HitTestResult;
        layout(comp: TextMeshLabel): LayoutResult;
        protected reset(): void;
        protected getWidth(comp: TextMeshLabel, sidx: number, eidx: number): number;
        private calcLineInfo;
        /***********underline**************/
        private appendUnderLineData;
        protected updateUnderLineInBegin(comp: TextMeshLabel, index: number, newLine: boolean): void;
        protected updateUnderLineInEnd(comp: TextMeshLabel, index: number): void;
        /**************deleteline******************/
        private appendStrickData;
        protected updateStrickInBegin(comp: TextMeshLabel, index: number, newLine: boolean): void;
        protected updateStrickInEnd(comp: TextMeshLabel, index: number): void;
        /*************background*******************/
        private appendBackgroundData;
        protected updateBackgroundInBegin(comp: TextMeshLabel, index: number, newLine: boolean): void;
        protected updateBackgroundInEnd(comp: TextMeshLabel, index: number): void;
        /*************mask*******************/
        private appendMaskData;
        protected updateMaskInBegin(comp: TextMeshLabel, index: number, newLine: boolean): void;
        protected updateMaskInEnd(comp: TextMeshLabel, index: number): void;
    }
}
declare module "TextMesh/typeset/HorizontalTypeSet" {
    import { TextMeshLabel } from "TextMesh/label/TextMeshLabel";
    import { LayoutResult } from "TextMesh/types/ITypeSet";
    import { Vec2 } from "cc";
    import { HitTestResult } from "../types/types";
    import { BaseTypeSet } from "TextMesh/typeset/BaseTypeSet";
    export class HorizontalTypeSet extends BaseTypeSet {
        hitTest(comp: TextMeshLabel, touchPos: Vec2): HitTestResult;
        private processRTL;
        layout(comp: TextMeshLabel): LayoutResult;
        private updateGloabl;
        private updateInClampMode;
        private preProcessVertex;
        private calcNextBreakInfo;
        private getWidthExt;
        private updateInWarpMode;
        private updateInResizeHeightMode;
        private updateInResizeWidthMode;
        private updateInShrinkMode;
        private horizontalLayout;
        private verticalLayout;
        private layoutSlots;
    }
}
declare module "TextMesh/typeset/TypeSetFactory" {
    import { ITypeSet } from "TextMesh/types/ITypeSet";
    export class TypeSetFactory {
        private static _typeMap;
        private static _typeInsts;
        static regist(type: string, cst: Function): void;
        static get(type: string): ITypeSet;
    }
}
declare module "TextMesh/utils/dfs" {
    export default function dfs(node: any, defaultDepth?: number): any;
}
declare module "TextMesh/utils/UBBParser" {
    type ValueType = string | number | boolean;
    type TagType = "node" | "text" | "root";
    export class TagNode {
        type: TagType;
        name: string;
        value: ValueType;
        attributes: {
            [key: string]: ValueType;
        };
        text: string;
        children: TagNode[];
        _parent?: TagNode;
        _closed: boolean;
        constructor(name?: string);
    }
    export class UBBParser {
        private _text;
        private _root;
        private _currentNode;
        private _tagInfo;
        lastColor: string;
        lastSize: string;
        linkUnderline: boolean;
        linkColor: string;
        static inst: UBBParser;
        constructor();
        private exception;
        protected addTextNode(text: string): void;
        protected addNode(name: string, value: ValueType): void;
        protected addAttribute(name: string, value: ValueType): void;
        protected setNodeText(value: string): void;
        protected closeNode(name: string): boolean;
        private isValidChar;
        private getTagName;
        private getTagValue;
        private getAttribute;
        protected getText(startPos: number, tag_s: string, tag_e: string): number;
        protected getTail(startPos: number, tag_s: string, tag_e: string): number;
        parse(text: string, ubb?: boolean): TagNode;
    }
}
declare module "TextMesh/settings" {
    export var TextMeshSettings: {
        antiAlis: boolean;
        shadowScale: number;
        dilateScale: number;
    };
}
declare module "TextMesh/label/TextMeshAssembler" {
    import { Color, IAssembler, __private } from "cc";
    import { LayoutResult } from "TextMesh/types/ITypeSet";
    import { CharInfo } from "TextMesh/label/CharInfo";
    import { TextMeshLabel } from "TextMesh/label/TextMeshLabel";
    export class TextMeshAssembler implements IAssembler {
        static createData(comp: TextMeshLabel): any;
        static fillBuffers(comp: TextMeshLabel, renderer: __private._cocos_2d_renderer_i_batcher__IBatcher): void;
        private static _fillElementBuffers;
        private static updateUVs;
        private static _needCheckShdaow;
        private static _updateUVs;
        static updateColor(comp: TextMeshLabel, charInfo?: CharInfo, colors?: Color | Color[]): void;
        private static _updateColor;
        static updateColors(comp: TextMeshLabel): void;
        private static _updateColors;
        static updateOthers(comp: TextMeshLabel): void;
        private static _updateOthers;
        private static updateVertexData;
        private static appendShadowQuad;
        static refreshCharInfo(comp: TextMeshLabel, index: number, charInfo: CharInfo): void;
        private static _clipInfo;
        private static _clipX;
        private static _clipY;
        private static appendQuad;
        static refreshUnderlineInfo(comp: TextMeshLabel, index: number, layout: LayoutResult): void;
        static refreshStrikeInfo(comp: TextMeshLabel, index: number, layout: LayoutResult): void;
        private static getRectUVs;
        static refreshBackgroundInfo(comp: TextMeshLabel, index: number, layout: LayoutResult): void;
        static refreshMaskInfo(comp: TextMeshLabel, index: number, layout: LayoutResult): void;
        static updateRenderData(comp: TextMeshLabel, render: __private._cocos_2d_renderer_i_batcher__IBatcher): void;
    }
}
declare module "TextMesh/label/events" {
    import { CharInfo } from "TextMesh/label/CharInfo";
    export class EventClickChar {
        accurate?: boolean;
        charInfo?: CharInfo;
    }
    export const click_char_event: EventClickChar;
}
declare module "TextMesh/label/StyleManager" {
    import { TextStyle } from "TextMesh/label/TextStyle";
    export class StyleManager {
        static TMF_STYLE_CHANGED: string;
        private static _styles;
        private static _onStyleChanged;
        static removeAll(): void;
        static registByStyle(key: string, style: TextStyle): void;
        static registByStyles(key: string[], style: TextStyle[]): void;
        static registByKeyJson(key: string, style: string): void;
        static registByJson(styles: string): void;
        static getStyle(key: string): TextStyle;
    }
}
declare module "TextMesh/label/SlotConnector" {
    import { Component, Node } from 'cc';
    export class SlotConnector extends Component {
        labelNode: Node;
    }
}
declare module "TextMesh/font/FontManager" {
    import { BufferAsset, Component } from "cc";
    import { TMFont } from "TextMesh/font/TMFont";
    export class RegistFontInfo {
        private _fontName;
        get fontName(): string;
        set fontName(value: string);
        private _fontData;
        get fontData(): BufferAsset;
        set fontData(value: BufferAsset);
        private canLoad;
    }
    export class FontManager extends Component {
        private static _instance;
        static get instance(): FontManager;
        private _fontMap;
        private _loadingMap;
        private _registFontMap;
        private _registFonts;
        onLoad(): void;
        refresh(): void;
        private loadAllRegistFont;
        getFont(fontName: string): any;
        getFontAsync(fontName: string): Promise<TMFont>;
        loadFont(fontName: string, fontData?: BufferAsset): Promise<TMFont>;
        _loadFont(fontName: string): Promise<TMFont>;
        removeFont(fontName: string): void;
    }
}
declare module "TextMesh/label/TextMeshLabel" {
    import { Color, EventTouch, Material, Node, Texture2D, UIRenderer, UITransform, __private } from "cc";
    import { TMFont } from "TextMesh/font/TMFont";
    import { TMQuadRenderData } from "TextMesh/vertex/TMRenderData";
    import { ITypeSet, LayoutResult } from "TextMesh/types/ITypeSet";
    import { TextStyle } from "TextMesh/label/TextStyle";
    import { ETextDirection, ETextHorizontalAlign, ETextOverflow, ETextVerticalAlign, Margin } from "TextMesh/label/types";
    import { CharInfo } from "TextMesh/label/CharInfo";
    import { Slot, ESlotType } from "TextMesh/label/LayoutTypes";
    type SlotHandlerType = (comp: TextMeshLabel, slotNode: Node, slot: Slot) => void;
    export enum EDirtyFlag {
        None = 0,
        Text = 2,
        Style = 4,
        Layout = 8,
        Property = 16,
        All = 30
    }
    export class TextMeshLabel extends UIRenderer {
        static CHAR_CLICK_EVENT: string;
        private _slotCreateHandlers;
        private _saveTag;
        protected _fontName: string;
        protected _string: string;
        protected _rich: boolean;
        protected _direction: ETextDirection;
        protected _horizontalAlign: ETextHorizontalAlign;
        protected _verticalAlign: ETextVerticalAlign;
        protected _overflow: ETextOverflow;
        protected _multiline: boolean;
        protected _enableItalic: boolean;
        protected _enableUnderline: boolean;
        protected _enableStrike: boolean;
        protected _enableBackground: boolean;
        protected _enableMask: boolean;
        protected _lineSpace: number;
        protected _letterSpace: number;
        protected _enableColorRT: boolean;
        protected _colorRT: Color;
        protected _enableColorRB: boolean;
        protected _colorRB: Color;
        protected _enableColorLT: boolean;
        protected _colorLT: Color;
        protected _enableColorLB: boolean;
        protected _colorLB: Color;
        protected _backgroundColor: Color;
        protected _maskColor: Color;
        protected _strokeColor: Color;
        protected _shadow: number;
        protected _shadowOffsetX: number;
        protected _shadowOffsetY: number;
        protected _shadowBlur: number;
        protected _shadowColor: Color;
        protected _handleTouchEvent: boolean;
        protected _autoWarp: boolean;
        protected _lineHeight: number;
        protected _fixedLineHeight: boolean;
        protected _padding: Margin;
        protected _dilate: number;
        protected _stroke: number;
        protected _strokeBlur: number;
        protected _aspect: number;
        protected _charVisibleRatio: number;
        protected _equalWidth: boolean;
        protected _overlayTexture: Texture2D;
        protected _enableGlow: boolean;
        protected _glowColor: Color;
        protected _glowInner: number;
        protected _glowOuter: number;
        protected _glowPower: number;
        protected _breakWestern: boolean;
        private _style;
        private _clicks;
        private _slots;
        globalOffsetX: number;
        globalOffsetY: number;
        localOffsetX: number;
        localOffsetY: number;
        slotOffsetX: number;
        slotOffsetY: number;
        private _layoutResult;
        private _dirtyFlag;
        private _uiTransform;
        private _ready;
        get ready(): boolean;
        get slots(): Slot[];
        private incrSaveTag;
        get style(): TextStyle;
        get layoutResult(): LayoutResult;
        private _font;
        get font(): TMFont;
        /**
         * @en
         * Font name.
         *
         * @zh
         * 字体名称。
         */
        get fontName(): string;
        set fontName(value: string);
        private _loadFont;
        private _fontSize;
        /**
        * @en
        * font size
        *
        * @zh
        * 字体大小。
        */
        get fontSize(): number;
        set fontSize(val: number);
        private _underLineInfos;
        get underLineInfos(): TMQuadRenderData[];
        private _strikeInfos;
        get strikeInfos(): TMQuadRenderData[];
        private _backgroundInfos;
        get backgroundInfos(): TMQuadRenderData[];
        private _maskInfos;
        get maskInfos(): TMQuadRenderData[];
        private _charInfos;
        get charInfos(): CharInfo[];
        private _typeSet;
        get typeSet(): ITypeSet;
        set font(value: TMFont);
        slotsContainer: Node;
        /**
         * @en
         * Content string of label.
         *
         * @zh
         * 标签显示的文本内容。
         */
        get string(): string;
        set string(value: string);
        /**
        * @en
        * is rich lable
        *
        * @zh
        * 是否富文本。
        */
        get rich(): boolean;
        set rich(value: boolean);
        get multiline(): boolean;
        set multiline(value: boolean);
        get dilate(): number;
        set dilate(value: number);
        get color(): Color;
        set color(value: Color);
        get enableColorRT(): boolean;
        set enableColorRT(value: boolean);
        get colorRT(): Color;
        set colorRT(value: Color);
        get enableColorRB(): boolean;
        set enableColorRB(value: boolean);
        get colorRB(): Color;
        set colorRB(value: Color);
        get enableColorLT(): boolean;
        set enableColorLT(value: boolean);
        get colorLT(): Color;
        set colorLT(value: Color);
        get enableColorLB(): boolean;
        set enableColorLB(value: boolean);
        get colorLB(): Color;
        set colorLB(value: Color);
        get enableItalic(): boolean;
        set enableItalic(value: boolean);
        get enableUnderline(): boolean;
        set enableUnderline(value: boolean);
        get enableStrike(): boolean;
        set enableStrike(value: boolean);
        get enableBackground(): boolean;
        set enableBackground(value: boolean);
        get backgroundColor(): Color;
        set backgroundColor(value: Color);
        get enableMask(): boolean;
        set enableMask(value: boolean);
        get maskColor(): Color;
        set maskColor(value: Color);
        get autoWarp(): boolean;
        set autoWarp(value: boolean);
        get equalWidth(): boolean;
        set equalWidth(value: boolean);
        get fixedLineHeight(): boolean;
        set fixedLineHeight(value: boolean);
        get lineHeight(): number;
        set lineHeight(value: number);
        get horizontalAlign(): ETextHorizontalAlign;
        set horizontalAlign(value: ETextHorizontalAlign);
        get verticalAlign(): ETextVerticalAlign;
        set verticalAlign(value: ETextVerticalAlign);
        get overflow(): ETextOverflow;
        set overflow(value: ETextOverflow);
        get lineSpace(): number;
        set lineSpace(value: number);
        get letterSpace(): number;
        set letterSpace(value: number);
        get padding(): Margin;
        set padding(value: Margin);
        get stroke(): number;
        set stroke(value: number);
        get strokeBlur(): number;
        set strokeBlur(value: number);
        get strokeColor(): Color;
        set strokeColor(value: Color);
        get shadow(): number;
        set shadow(value: number);
        get shadowBlur(): number;
        set shadowBlur(value: number);
        get shadowOffsetX(): number;
        set shadowOffsetX(value: number);
        get shadowOffsetY(): number;
        set shadowOffsetY(value: number);
        get shadowColor(): Color;
        set shadowColor(value: Color);
        get aspect(): number;
        set aspect(value: number);
        get charVisibleRatio(): number;
        set charVisibleRatio(value: number);
        get overlayTexture(): Texture2D;
        set overlayTexture(value: Texture2D);
        get enableGlow(): boolean;
        set enableGlow(value: boolean);
        get glowColor(): Color;
        set glowColor(value: Color);
        get glowInner(): number;
        set glowInner(value: number);
        get glowOuter(): number;
        set glowOuter(value: number);
        get glowPower(): number;
        set glowPower(value: number);
        get breakWestern(): boolean;
        set breakWestern(value: boolean);
        get handleTouchEvent(): boolean;
        set handleTouchEvent(value: boolean);
        get uiTransform(): UITransform;
        get renderEntity(): __private._cocos_2d_renderer_render_entity__RenderEntity;
        onLoad(): void;
        onFocusInEditor(): void;
        private clearEditorSlots;
        private _onTMFLoaded;
        private _updateStyle;
        private _updateAllStyles;
        onEnable(): void;
        onDisable(): void;
        onDestroy(): void;
        private _addEventListeners;
        private _removeEventListeners;
        private _onEditorTMFChanged;
        protected _onTouchEnded(event: EventTouch): void;
        private _setLayer;
        protected _applyLayer(): void;
        protected _onAnchorChanged(): void;
        protected _onSizeChanged(): void;
        private _onTMFStyleChanged;
        protected _render(render: __private._cocos_2d_renderer_i_batcher__IBatcher): void;
        requestRenderData(drawInfoType?: number): any;
        getRenderElementCount(): number;
        getRenderElement(index: number): CharInfo;
        protected _flushAssembler(): void;
        /**
         * 修复合批问题
         * @param index
         * @returns
         */
        getRenderMaterial(index: number): Material | null;
        markForUpdateRenderData(enable?: boolean): void;
        updateRenderData(force?: boolean): void;
        setSlotCreateHandler(type: ESlotType, handler: SlotHandlerType): void;
        makeDirty(dirtyFlag: EDirtyFlag): void;
        private _updateOverlayTexture;
        private _updateGlow;
        private _updateMaterialProperties;
        updateMaterial(): void;
        private _applyFontTexture;
        private _updateLayout;
        forceUpdate(): void;
        private _updateText;
        _clearAdditions(): void;
        private _freeCharInfos;
        private _clearSlots;
        private _parse;
        private _parseSlot;
        /**
         * slot 格式：[包名|resources目录无需包名][://资源路径|资源路径]
         * @param slot
         * @param fontSize
         * @returns
         */
        private _createSlot;
        private _parseClick;
        private _parseRich;
        private _addCharInfo;
        lateUpdate(dt: number): void;
        get dirtyFlag(): EDirtyFlag;
        set dirtyFlag(value: EDirtyFlag);
        addDirtyFlag(flag: EDirtyFlag): void;
        clearDirtyFlag(): void;
        /**
         * 获取文本内容
         * @param index
         * @returns
         */
        getCharInfo(index: number): CharInfo;
        /**
         *
         * @param charInfo
         * @param colors 设置统一颜色，或者设置单个顶点
         * @returns
         */
        setCharColor(charInfo: CharInfo, colors?: Color | Color[]): void;
        /**
         * 设置文本偏移、旋转、缩放
         * @param charInfo
         * @param dx x偏移
         * @param dy y偏移
         * @param rotation 旋转角度，弧度
         * @param scale 缩放值
         * @returns
         */
        setCharTransform(charInfo: CharInfo, dx: number, dy: number, rotation: number, scale: number): void;
        setCustomMaterialByUUID(uuid: string): void;
        protected _canRender(): boolean;
    }
}
declare module "TextMesh/index" {
    export * from "TextMesh/font/TMFont";
    export * from "TextMesh/label/types";
    export * from "TextMesh/label/LayoutTypes";
    export * from "TextMesh/label/TextMeshLabel";
    export * from "TextMesh/label/events";
    export * from "TextMesh/utils/ResManger";
    export * from "TextMesh/utils/Utils";
    export * from "TextMesh/utils/UBBParser";
    export * from "TextMesh/label/CharInfo";
    export * from "TextMesh/settings";
}
declare module "TextMesh/label/TextMeshRenderData" {
    import { IRenderData, math } from "cc";
    export class TextMeshRenderData implements IRenderData {
        x: number;
        y: number;
        z: number;
        u: number;
        v: number;
        color: math.Color;
    }
}
declare module "TextMesh/types/ISlot" {
    import { TextMeshLabel } from "TextMesh/label/TextMeshLabel";
    export interface ISlot {
        name: string;
        src: string;
        width: number;
        height: number;
        layout(comp: TextMeshLabel, index: number): any;
    }
}
