
namespace fgui {

    export class Window extends GComponent {
        private _contentPane: GComponent;
        private _modalWaitPane: GObject;
        private _closeButton: GObject;
        private _dragArea: GObject;
        private _contentArea: GObject;
        private _frame: GComponent;
        private _modal: boolean;

        private _atlases: Array<Array<number>>;
        private _uiSources?: Array<IUISource>;
        private _inited?: boolean;
        private _loading?: boolean;

        protected _requestingCmd: number = 0;

        public bringToFontOnClick: boolean;

        public constructor() {
            super();
            this._atlases = new Array<Array<number>>();
            this._uiSources = new Array<IUISource>();
            this.bringToFontOnClick = UIConfig.bringWindowToFrontOnClick;

            this._node.on(Event.TOUCH_BEGIN, this.onTouchBegin_1, this, true);
        }

        public addUISource(source: IUISource): void {
            this._uiSources.push(source);
        }
        /**
         * atlases值是一个二维数组，元素为当前window在该元素索引对应的uiSource执行加载的包中所使用的纹理图集列表
         * @example [[0,1],[2]]，说明此windwo依赖了2个包，第一个包使用其中第0、第1张图集，第二包使用第2张图集
         */
        public get atlases(): number[][] { return this._atlases; }
        public set atlases(va: number[][]) { this._atlases = va; }

        public get loading(): boolean { return this._loading; }

        public set contentPane(val: GComponent) {
            if (this._contentPane != val) {
                if (this._contentPane)
                    this.removeChild(this._contentPane);
                this._contentPane = val;
                if (this._contentPane) {
                    this.addChild(this._contentPane);
                    this.setSize(this._contentPane.width, this._contentPane.height);
                    this._contentPane.addRelation(this, RelationType.Size);
                    this._frame = <GComponent>(this._contentPane.getChild("frame"));
                    if (this._frame) {
                        this.closeButton = this._frame.getChild("closeButton");
                        this.dragArea = this._frame.getChild("dragArea");
                        this.contentArea = this._frame.getChild("contentArea");
                    }
                }
            }
        }

        public get contentPane(): GComponent {
            return this._contentPane;
        }

        public get frame(): GComponent {
            return this._frame;
        }

        public get closeButton(): GObject {
            return this._closeButton;
        }

        public set closeButton(value: GObject) {
            if (this._closeButton)
                this._closeButton.offClick(this.closeEventHandler, this);
            this._closeButton = value;
            if (this._closeButton)
                this._closeButton.onClick(this.closeEventHandler, this);
        }

        public get dragArea(): GObject {
            return this._dragArea;
        }

        public set dragArea(value: GObject) {
            if (this._dragArea != value) {
                if (this._dragArea) {
                    this._dragArea.draggable = false;
                    this._dragArea.off(Event.DRAG_START, this.onDragStart_1, this);
                }

                this._dragArea = value;
                if (this._dragArea) {
                    this._dragArea.draggable = true;
                    this._dragArea.on(Event.DRAG_START, this.onDragStart_1, this);
                }
            }
        }

        public get contentArea(): GObject {
            return this._contentArea;
        }

        public set contentArea(value: GObject) {
            this._contentArea = value;
        }

        public show(): void {
            GRoot.inst.showWindow(this);
        }

        public showOn(root: GRoot): void {
            root.showWindow(this);
        }

        public hide(): void {
            if (this.isShowing)
                this.doHideAnimation();
        }

        public hideImmediately(): void {
            var r: GRoot = (this.parent instanceof GRoot) ? this.parent : null;
            if (!r)
                r = GRoot.inst;
            r.hideWindowImmediately(this);
        }

        public centerOn(r: GRoot, restraint?: boolean) {
            this.setPosition(Math.round((r.width - this.width) / 2), Math.round((r.height - this.height) / 2));
            if (restraint) {
                this.addRelation(r, RelationType.Center_Center);
                this.addRelation(r, RelationType.Middle_Middle);
            }
        }

        public toggleStatus(): void {
            if (this.isTop)
                this.hide();
            else
                this.show();
        }

        public get isShowing(): boolean {
            return this.parent != null;
        }

        public get isTop(): boolean {
            return this.parent && this.parent.getChildIndex(this) == this.parent.numChildren - 1;
        }

        public get modal(): boolean {
            return this._modal;
        }

        public set modal(val: boolean) {
            this._modal = val;
        }

        public bringToFront(): void {
            this.root.bringToFront(this);
        }

        public showModalWait(requestingCmd?: number): void {
            if (requestingCmd != null)
                this._requestingCmd = requestingCmd;

            if (UIConfig.windowModalWaiting) {
                if (!this._modalWaitPane)
                    this._modalWaitPane = UIPackage.createObjectFromURL(UIConfig.windowModalWaiting);

                this.layoutModalWaitPane();

                this.addChild(this._modalWaitPane);
            }
        }

        protected layoutModalWaitPane(): void {
            if (this._contentArea) {
                var pt: cc.Vec2 = this._frame.localToGlobal();
                pt = this.globalToLocal(pt.x, pt.y, pt);
                this._modalWaitPane.setPosition(pt.x + this._contentArea.x, pt.y + this._contentArea.y);
                this._modalWaitPane.setSize(this._contentArea.width, this._contentArea.height);
            }
            else
                this._modalWaitPane.setSize(this.width, this.height);
        }

        public closeModalWait(requestingCmd?: number): boolean {
            if (requestingCmd != null) {
                if (this._requestingCmd != requestingCmd)
                    return false;
            }
            this._requestingCmd = 0;

            if (this._modalWaitPane && this._modalWaitPane.parent)
                this.removeChild(this._modalWaitPane);

            return true;
        }

        public get modalWaiting(): boolean {
            return this._modalWaitPane && this._modalWaitPane.parent != null;
        }


        public init(): void {
            if (this._inited || this._loading)
                return;

            if (this._uiSources.length > 0) {
                this._loading = false;
                var cnt: number = this._uiSources.length;
                for (var i: number = 0; i < cnt; i++) {
                    var lib: IUISource = this._uiSources[i];
                    let ats: number[] = this._atlases[i];
                    if (!lib.loaded) {
                        lib.load(this.__uiLoadComplete, this, ats);
                        lib.failed = false;
                        lib.fail(this.__uiLoadFail, this);
                        // 当一个window所使用的纹理集已被包内其他window加载过时，会导致load全过程不会发起任何异步任务
                        // 这会最终导致AppWindow先执行hideWaitPanel，后执行showWaitPanel，且执行show时，该window实例的loading值为true
                        !this._inited && (this._loading = true);
                    }
                }
                // 在lib.load()同步执行的场景下，this._init为true，this._init()已经执行过
                // 这里不应重复执行
                if (!this._inited && !this._loading) {
                    this._init();
                }
            }
            else
                this._init();
        }

        protected onInit(): void {
        }

        protected onShown(): void {
        }

        protected onShowFail(): void {
            this.hideImmediately();
        }

        protected onHide(): void {
        }

        protected doShowAnimation(): void {
            this.onShown();
        }

        protected doHideAnimation(): void {
            this.hideImmediately();
        }

        private __uiLoadFail(): void {
            if (!this._loading) {
                return;
            }
            const cnt = this._uiSources.length;
            for (let i = 0; i < cnt; i++) {
                const lib = this._uiSources[i];
                if (lib.failed) {
                    this._loading = false;
                    this.onShowFail();
                    break;
                }
            }
        }

        private __uiLoadComplete(): void {
            var cnt: number = this._uiSources.length;
            for (var i: number = 0; i < cnt; i++) {
                var lib: IUISource = this._uiSources[i];
                if (!lib.succeed)
                    return;
            }

            this._loading = false;
            this._init();
        }

        private _init(): void {
            this._inited = true;
            this.onInit();

            if (this.isShowing)
                this.doShowAnimation();
        }

        public dispose(): void {
            if (this.parent)
                this.hideImmediately();

            super.dispose();
        }

        protected closeEventHandler(evt: cc.Event): void {
            this.hide();
        }

        protected onEnable(): void {
            super.onEnable();

            if (!this._inited)
                this.init();
            else
                this.doShowAnimation();
        }

        protected onDisable(): void {
            super.onDisable();

            this.closeModalWait();
            this.onHide();
        }

        private onTouchBegin_1(evt: cc.Event): void {
            if (this.isShowing && this.bringToFontOnClick)
                this.bringToFront();
        }

        private onDragStart_1(evt: Event): void {
            var original: fgui.GObject = fgui.GObject.cast(evt.currentTarget);
            original.stopDrag();

            this.startDrag(evt.touchId);
        }
    }
}