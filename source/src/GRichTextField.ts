import { BitmapFont, Font, HorizontalTextAlignment, Label, Node, RichText, SpriteAtlas, SpriteFrame } from "cc";
import { PackageItemType, AutoSizeType } from "./FieldTypes";
import { GTextField } from "./GTextField";
import { PackageItem } from "./PackageItem";
import { UIConfig } from "./UIConfig";
import { UIPackage } from "./UIPackage";
import { toGrayedColor } from "./utils/ToolSet";
import { defaultParser } from "./utils/UBBParser";
import { ByteBuffer } from "./FairyGUI";

export class RichTextImageAtlas extends SpriteAtlas {

    public getSpriteFrame(key: string): SpriteFrame {
        let pi: PackageItem = UIPackage.getItemByURL(key);
        if (pi) {
            pi.load();
            if (pi.type == PackageItemType.Image)
                return <SpriteFrame>pi.asset;
            else if (pi.type == PackageItemType.MovieClip)
                return pi.frames[0].texture;
        }

        return super.getSpriteFrame(key);
    }

    public async getSpriteFrameAsync(key: string) {
        let pi: PackageItem = UIPackage.getItemByURL(key);
        if (pi) {
            await pi.loadAsync();
            if (pi.type == PackageItemType.Image)
                return <SpriteFrame>pi.asset;
            else if (pi.type == PackageItemType.MovieClip)
                return pi.frames[0].texture;
        }

        return super.getSpriteFrame(key);
    }
}

const imageAtlas: RichTextImageAtlas = new RichTextImageAtlas();

export class GRichTextField extends GTextField {
    private _bold: boolean;
    private _italics: boolean;
    private _underline: boolean;

    public linkUnderline: boolean;
    public linkColor: string;

    public constructor() {
        super();

        this._node.name = "GRichTextField";
        this._touchDisabled = false;
        this.linkUnderline = UIConfig.linkUnderline;
    }

    protected createRenderer() {
        super.createRenderer();
        this._label.richMode = true;
        this._label.imageAtlas = imageAtlas;
        this._label.slotSpriteFrameCreateHandler = this.getSpriteFrame.bind(this);
    }

    private getSpriteFrame(name: string): SpriteFrame | Promise<SpriteFrame> {
        if(UIConfig.enableDelayLoad) {
            return imageAtlas.getSpriteFrameAsync(name);
        }else{
            return imageAtlas.getSpriteFrame(name);
        }
    }

    public get align(): HorizontalTextAlignment {
        return this._label.horizontalAlign;
    }

    public set align(value: HorizontalTextAlignment) {
        this._label.horizontalAlign = value;
    }

    public get underline(): boolean {
        return this._underline;
    }

    public set underline(value: boolean) {
        if (this._underline != value) {
            this._underline = value;

            this.updateText();
        }
    }

    public get bold(): boolean {
        return this._bold;
    }

    public set bold(value: boolean) {
        if (this._bold != value) {
            this._bold = value;

            this.updateText();
        }
    }

    public get italic(): boolean {
        return this._italics;
    }

    public set italic(value: boolean) {
        if (this._italics != value) {
            this._italics = value;

            this.updateText();
        }
    }

    protected updateText(): void {
        var text2: string = this._text;

        if (this._templateVars)
            text2 = this.parseTemplate(text2);

        if (this._ubbEnabled) {
            defaultParser.linkUnderline = this.linkUnderline;
            defaultParser.linkColor = this.linkColor;

            text2 = defaultParser.parse(text2);
        }

        if (this._bold)
            text2 = "<b>" + text2 + "</b>";
        if (this._italics)
            text2 = "<i>" + text2 + "</i>";
        if (this._underline)
            text2 = "<u>" + text2 + "</u>";
        let c = this._color
        if (this._grayed)
            c = toGrayedColor(c);
        text2 = "<color=" + c.toHEX("#rrggbb") + ">" + text2 + "</color>";

        this._label.string = text2;
    }

    protected updateFont() {
        if(this._realFont instanceof Font) {
            this.assignFont(this._label, this._realFont);
            this._label.setMode(false, true);
        }else{
            this._label.fontName = this._realFont;
        }
    }

    protected updateFontColor() {
        this.assignFontColor(this._label, this._color);
    }

    protected updateFontSize() {
        super.updateFontSize();

        let fontSize: number = this._fontSize;
        let font: any = this._label.font;
        if (font instanceof BitmapFont) {
            if (!font.fntConfig.resizable)
                fontSize = font.fntConfig.fontSize;
        }

        this._label.fontSize = fontSize;
        this._label.lineHeight = fontSize + this._leading * 2;
    }
}