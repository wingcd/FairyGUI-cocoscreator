export interface IGRoot {
    inst: any;
}

export var Decls: { 
    GRoot?: IGRoot,
    GObject?: any,
 } = {};

export var constructingDepth: { n: number } = { n: 0 };