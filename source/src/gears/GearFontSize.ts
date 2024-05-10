import { ObjectPropID } from "../FieldTypes";
import { ByteBuffer } from "../utils/ByteBuffer";
import { GearBase } from "./GearBase";

export class GearFontSize extends GearBase {
    private _storage: { [index: string]: number };
    private _default: number = 0;

    protected init(): void {
        this._default = this._owner.getProp(ObjectPropID.FontSize);
        this._storage = {};
    }

    protected addStatus(pageId: string, buffer: ByteBuffer): void {
        if (!pageId)
            this._default = buffer.readInt();
        else
            this._storage[pageId] = buffer.readInt();
    }

    public apply(): void {
        this._owner._gearLocked = true;

        var data: any = this._storage[this._controller.selectedPageId];
        if (data !== undefined)
            this._owner.setProp(ObjectPropID.FontSize, data);
        else
            this._owner.setProp(ObjectPropID.FontSize, this._default);

        this._owner._gearLocked = false;
    }

    public updateState(): void {
        this._storage[this._controller.selectedPageId] = this._owner.getProp(ObjectPropID.FontSize);
    }

    public copyFrom(gg: GearFontSize): void {
        super.copyFrom(gg);
        
        this._default = gg._default;
        var data: any = gg._storage;
        for (var i in data) {
            this._storage[i] = data[i];
        }        
    }
}
