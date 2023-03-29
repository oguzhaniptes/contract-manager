import { Cell } from "ton-core";

export type FuncCompileResult = {
    lang: 'func';
    result: Cell;
};

export type TactCompileResult = {
    lang: 'tact';
    result: Map<string, Buffer>;
};

export type CompileResult = TactCompileResult | FuncCompileResult;

export function compileResultToCell(result: CompileResult): Cell {
    switch (result.lang) {
        case 'func':
            return result.result;
        case 'tact':
            let buf: Buffer | undefined = undefined;
            for (const [k, v] of result.result) {
                if (k.endsWith('.code.boc')) {
                    buf = v;
                    break;
                }
            }
            if (buf === undefined) {
                throw new Error('Could not find boc in tact compilation result');
            }
            return Cell.fromBoc(buf)[0];
    }
}