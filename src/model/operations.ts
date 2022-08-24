import * as tf from '@tensorflow/tfjs-core';
import { normalize } from '../normalize';

import { Operations, Body, Tensor, BodyKind, TensorBody, OperationKind, Function, TableBody, TextBody } from "./graph"

type TensorFunc = (...inputs: Tensor[]) => tf.Tensor<tf.Rank>

export const tensorFunc = (f: TensorFunc): Function => {
    return ({ uuid, node }: Body, ...inputs: Body[]): Body => {
        const tensors = inputs
            .filter(body => [BodyKind.TENSOR, BodyKind.NUMBER, BodyKind.TEXT, BodyKind.COLUMN].includes(body.kind))
            .map(body => (body as TensorBody).value)
        try {
            const result = f(...tensors)
            return {
                kind: BodyKind.TENSOR,
                uuid: uuid,
                node: node,
                value: result.arraySync(),
                rank: result.rank,
                shape: result.shape,
            }
        } catch (e) {
            return {
                kind: BodyKind.ERROR,
                uuid: uuid,
                node: node,
            }
        }
    }
}

export const scatter = ({ uuid, node }: Body, ...inputs: Body[]): Body => {
    const x = normalize((inputs[0] as TensorBody).value as number[], [10, 280])
    const y = normalize((inputs[1] as TensorBody).value as number[], [10, 280])
    return {
        kind: BodyKind.SCATTER,
        uuid: uuid,
        node: node,
        x,
        y,
    }
}

export const column = ({ uuid, node }: Body, ...inputs: Body[]): Body => {
    const name = (inputs[1] as TextBody).value
    const col = (inputs[0] as TableBody).value[name]
    if (col === undefined) {
        return {
            kind: BodyKind.ERROR,
            uuid: uuid,
            node: node,
        }
    } else {
        return {
            kind: BodyKind.COLUMN,
            uuid: uuid,
            node: node,
            name,
            value: col,
        }
    }
}

export const operations: Operations = {
    "number": {
        kind: OperationKind.NUMBER,
        name: "number",
        outputs: ["out"],
    },
    "text": {
        kind: OperationKind.TEXT,
        name: "text",
        outputs: ["out"],
    },
    "abs": {
        kind: OperationKind.TRANSFORM,
        name: "abs",
        inputs: ["x"],
        outputs: ["out"],
        func: tensorFunc(tf.abs)
    },
    "acos": {
        kind: OperationKind.TRANSFORM,
        name: "acos",
        inputs: ["x"],
        outputs: ["out"],
        func: tensorFunc(tf.acos)
    },
    "acosh": {
        kind: OperationKind.TRANSFORM,
        name: "acosh",
        inputs: ["x"],
        outputs: ["out"],
        func: tensorFunc(tf.acosh)
    },
    "add": {
        kind: OperationKind.TRANSFORM,
        name: "add",
        inputs: ["x", "y"],
        outputs: ["out"],
        func: tensorFunc(tf.add)
    },
    "all": {
        kind: OperationKind.TRANSFORM,
        name: "all",
        inputs: ["x"],
        outputs: ["out"],
        func: tensorFunc(tf.all as TensorFunc)
    },
    "any": {
        kind: OperationKind.TRANSFORM,
        name: "any",
        inputs: ["x"],
        outputs: ["out"],
        func: tensorFunc(tf.any as TensorFunc)
    },
    "arg max": {
        kind: OperationKind.TRANSFORM,
        name: "arg max",
        inputs: ["x"],
        outputs: ["out"],
        func: tensorFunc(tf.argMax as TensorFunc)
    },
    "arg min": {
        kind: OperationKind.TRANSFORM,
        name: "arg min",
        inputs: ["x"],
        outputs: ["out"],
        func: tensorFunc(tf.argMin as TensorFunc)
    },
    "asin": {
        kind: OperationKind.TRANSFORM,
        name: "asin",
        inputs: ["x"],
        outputs: ["out"],
        func: tensorFunc(tf.asin)
    },
    "asinh": {
        kind: OperationKind.TRANSFORM,
        name: "asinh",
        inputs: ["x"],
        outputs: ["out"],
        func: tensorFunc(tf.asinh)
    },
    "atan": {
        kind: OperationKind.TRANSFORM,
        name: "atan",
        inputs: ["x"],
        outputs: ["out"],
        func: tensorFunc(tf.atan)
    },
    "atanh": {
        kind: OperationKind.TRANSFORM,
        name: "atanh",
        inputs: ["x"],
        outputs: ["out"],
        func: tensorFunc(tf.atanh)
    },
    "ceil": {
        kind: OperationKind.TRANSFORM,
        name: "ceil",
        inputs: ["x"],
        outputs: ["out"],
        func: tensorFunc(tf.ceil)
    },
    "clip": {
        kind: OperationKind.TRANSFORM,
        name: "clip",
        inputs: ["x", "min", "max"],
        outputs: ["out"],
        func: tensorFunc(tf.clipByValue as TensorFunc)
    },
    "complex": {
        kind: OperationKind.TRANSFORM,
        name: "complex",
        inputs: ["real", "imag"],
        outputs: ["out"],
        func: tensorFunc(tf.complex)
    },
    "concat": {
        kind: OperationKind.TRANSFORM,
        name: "concat",
        inputs: ["x", "y"],
        outputs: ["out"],
        func: tensorFunc((x, y) => tf.concat([x, y]))
    },
    "cos": {
        kind: OperationKind.TRANSFORM,
        name: "cos",
        inputs: ["x"],
        outputs: ["out"],
        func: tensorFunc(tf.cos)
    },
    "cosh": {
        kind: OperationKind.TRANSFORM,
        name: "cosh",
        inputs: ["x"],
        outputs: ["out"],
        func: tensorFunc(tf.cosh)
    },
    "column": {
        kind: OperationKind.TRANSFORM,
        name: "column",
        inputs: ["table", "column"],
        outputs: ["data"],
        func: column
    },
    "cumsum": {
        kind: OperationKind.TRANSFORM,
        name: "cumsum",
        inputs: ["x"],
        outputs: ["out"],
        func: tensorFunc(tf.cumsum as TensorFunc)
    },
    "cumprod": {
        kind: OperationKind.TRANSFORM,
        name: "cumprod",
        inputs: ["x"],
        outputs: ["out"],
        func: tensorFunc(tf.cumprod as TensorFunc)
    },
    "diag": {
        kind: OperationKind.TRANSFORM,
        name: "diag",
        inputs: ["x"],
        outputs: ["out"],
        func: tensorFunc(tf.diag as TensorFunc)
    },
    "div": {
        kind: OperationKind.TRANSFORM,
        name: "div",
        inputs: ["x", "y"],
        outputs: ["out"],
        func: tensorFunc(tf.div)
    },
    "div no nan": {
        kind: OperationKind.TRANSFORM,
        name: "div no nan",
        inputs: ["x", "y"],
        outputs: ["out"],
        func: tensorFunc(tf.divNoNan)
    },
    "dot": {
        kind: OperationKind.TRANSFORM,
        name: "dot",
        inputs: ["x", "y"],
        outputs: ["out"],
        func: tensorFunc(tf.dot)
    },
    "elu": {
        kind: OperationKind.TRANSFORM,
        name: "elu",
        inputs: ["x"],
        outputs: ["out"],
        func: tensorFunc(tf.elu)
    },
    "erf": {
        kind: OperationKind.TRANSFORM,
        name: "erf",
        inputs: ["x"],
        outputs: ["out"],
        func: tensorFunc(tf.erf)
    },
    "equal": {
        kind: OperationKind.TRANSFORM,
        name: "equal",
        inputs: ["x", "y"],
        outputs: ["out"],
        func: tensorFunc(tf.equal)
    },
    "euclideanNorm": {
        kind: OperationKind.TRANSFORM,
        name: "euclideanNorm",
        inputs: ["x"],
        outputs: ["out"],
        func: tensorFunc(tf.euclideanNorm as TensorFunc)
    },
    "exp": {
        kind: OperationKind.TRANSFORM,
        name: "exp",
        inputs: ["x"],
        outputs: ["out"],
        func: tensorFunc(tf.exp)
    },
    "expm1": {
        kind: OperationKind.TRANSFORM,
        name: "expm1",
        inputs: ["x"],
        outputs: ["out"],
        func: tensorFunc(tf.expm1)
    },
    "eye": {
        kind: OperationKind.TRANSFORM,
        name: "eye",
        inputs: ["size"],
        outputs: ["out"],
        func: tensorFunc(tf.eye as TensorFunc)
    },
    "fill": {
        kind: OperationKind.TRANSFORM,
        name: "fill",
        inputs: ["shape", "value"],
        outputs: ["out"],
        func: tensorFunc(tf.fill as TensorFunc)
    },
    "floor": {
        kind: OperationKind.TRANSFORM,
        name: "floor",
        inputs: ["x"],
        outputs: ["out"],
        func: tensorFunc(tf.floor)
    },
    "floor div": {
        kind: OperationKind.TRANSFORM,
        name: "floor div",
        inputs: ["x", "y"],
        outputs: ["out"],
        func: tensorFunc(tf.floorDiv)
    },
    "gather": {
        kind: OperationKind.TRANSFORM,
        name: "gather",
        inputs: ["x", "indices"],
        outputs: ["out"],
        func: tensorFunc(tf.gather as TensorFunc)
    },
    "greater": {
        kind: OperationKind.TRANSFORM,
        name: "greater",
        inputs: ["x", "y"],
        outputs: ["out"],
        func: tensorFunc(tf.greater)
    },
    "greater equal": {
        kind: OperationKind.TRANSFORM,
        name: "greater equal",
        inputs: ["x", "y"],
        outputs: ["out"],
        func: tensorFunc(tf.greaterEqual)
    },
    "imag": {
        kind: OperationKind.TRANSFORM,
        name: "imag",
        inputs: ["x"],
        outputs: ["out"],
        func: tensorFunc(tf.imag)
    },
    "is finite": {
        kind: OperationKind.TRANSFORM,
        name: "is finite",
        inputs: ["x"],
        outputs: ["out"],
        func: tensorFunc(tf.isFinite)
    },
    "is inf": {
        kind: OperationKind.TRANSFORM,
        name: "is inf",
        inputs: ["x"],
        outputs: ["out"],
        func: tensorFunc(tf.isInf)
    },
    "is nan": {
        kind: OperationKind.TRANSFORM,
        name: "is nan",
        inputs: ["x"],
        outputs: ["out"],
        func: tensorFunc(tf.isNaN)
    },
    "leaky relu": {
        kind: OperationKind.TRANSFORM,
        name: "leaky relu",
        inputs: ["x"],
        outputs: ["out"],
        func: tensorFunc(tf.leakyRelu as TensorFunc)
    },
    "less": {
        kind: OperationKind.TRANSFORM,
        name: "less",
        inputs: ["x", "y"],
        outputs: ["out"],
        func: tensorFunc(tf.less)
    },
    "less equal": {
        kind: OperationKind.TRANSFORM,
        name: "less equal",
        inputs: ["x", "y"],
        outputs: ["out"],
        func: tensorFunc(tf.lessEqual)
    },
    "linspace": {
        kind: OperationKind.TRANSFORM,
        name: "linspace",
        inputs: ["start", "stop", "num"],
        outputs: ["out"],
        func: tensorFunc(tf.linspace as TensorFunc)
    },
    "log": {
        kind: OperationKind.TRANSFORM,
        name: "log",
        inputs: ["x"],
        outputs: ["out"],
        func: tensorFunc(tf.log)
    },
    "log1p": {
        kind: OperationKind.TRANSFORM,
        name: "log1p",
        inputs: ["x"],
        outputs: ["out"],
        func: tensorFunc(tf.log1p)
    },
    "log sigmoid": {
        kind: OperationKind.TRANSFORM,
        name: "log sigmoid",
        inputs: ["x"],
        outputs: ["out"],
        func: tensorFunc(tf.logSigmoid)
    },
    "log softmax": {
        kind: OperationKind.TRANSFORM,
        name: "log softmax",
        inputs: ["x"],
        outputs: ["out"],
        func: tensorFunc(tf.logSoftmax as TensorFunc)
    },
    "log sum exp": {
        kind: OperationKind.TRANSFORM,
        name: "log sum exp",
        inputs: ["x"],
        outputs: ["out"],
        func: tensorFunc(tf.logSumExp as TensorFunc)
    },
    "and": {
        kind: OperationKind.TRANSFORM,
        name: "and",
        inputs: ["x", "y"],
        outputs: ["out"],
        func: tensorFunc(tf.logicalAnd)
    },
    "not": {
        kind: OperationKind.TRANSFORM,
        name: "not",
        inputs: ["x"],
        outputs: ["out"],
        func: tensorFunc(tf.logicalNot)
    },
    "oneHot": {
        kind: OperationKind.TRANSFORM,
        name: "oneHot",
        inputs: ["indices", "depth"],
        outputs: ["out"],
        func: tensorFunc(tf.oneHot as TensorFunc)
    },
    "ones": {
        kind: OperationKind.TRANSFORM,
        name: "ones",
        inputs: ["shape"],
        outputs: ["out"],
        func: tensorFunc(tf.ones as TensorFunc)
    },
    "ones like": {
        kind: OperationKind.TRANSFORM,
        name: "ones like",
        inputs: ["x"],
        outputs: ["out"],
        func: tensorFunc(tf.onesLike)
    },
    "or": {
        kind: OperationKind.TRANSFORM,
        name: "or",
        inputs: ["x", "y"],
        outputs: ["out"],
        func: tensorFunc(tf.logicalOr)
    },
    "xor": {
        kind: OperationKind.TRANSFORM,
        name: "xor",
        inputs: ["x", "y"],
        outputs: ["out"],
        func: tensorFunc(tf.logicalXor)
    },
    "mat mul": {
        kind: OperationKind.TRANSFORM,
        name: "mat mul",
        inputs: ["x", "y"],
        outputs: ["out"],
        func: tensorFunc(tf.matMul as TensorFunc)
    },
    "max": {
        kind: OperationKind.TRANSFORM,
        name: "max",
        inputs: ["x"],
        outputs: ["out"],
        func: tensorFunc(tf.max as TensorFunc)
    },
    "maximum": {
        kind: OperationKind.TRANSFORM,
        name: "maximum",
        inputs: ["x", "y"],
        outputs: ["out"],
        func: tensorFunc(tf.maximum)
    },
    "minimum": {
        kind: OperationKind.TRANSFORM,
        name: "minimum",
        inputs: ["x", "y"],
        outputs: ["out"],
        func: tensorFunc(tf.minimum)
    },
    "min": {
        kind: OperationKind.TRANSFORM,
        name: "min",
        inputs: ["x"],
        outputs: ["out"],
        func: tensorFunc(tf.min as TensorFunc)
    },
    "mean": {
        kind: OperationKind.TRANSFORM,
        name: "mean",
        inputs: ["x"],
        outputs: ["out"],
        func: tensorFunc(tf.mean as TensorFunc)
    },
    "mod": {
        kind: OperationKind.TRANSFORM,
        name: "mod",
        inputs: ["x", "y"],
        outputs: ["out"],
        func: tensorFunc(tf.mod)
    },
    "mul": {
        kind: OperationKind.TRANSFORM,
        name: "mul",
        inputs: ["x", "y"],
        outputs: ["out"],
        func: tensorFunc(tf.mul)
    },
    "multinomial": {
        kind: OperationKind.TRANSFORM,
        name: "multinomial",
        inputs: ["logits", "num samples"],
        outputs: ["out"],
        func: tensorFunc(tf.multinomial as TensorFunc)
    },
    "neg": {
        kind: OperationKind.TRANSFORM,
        name: "neg",
        inputs: ["x"],
        outputs: ["out"],
        func: tensorFunc(tf.neg)
    },
    "not equal": {
        kind: OperationKind.TRANSFORM,
        name: "not equal",
        inputs: ["x", "y"],
        outputs: ["out"],
        func: tensorFunc(tf.notEqual)
    },
    "norm": {
        kind: OperationKind.TRANSFORM,
        name: "norm",
        inputs: ["x"],
        outputs: ["out"],
        func: tensorFunc(tf.norm as TensorFunc)
    },
    "outer product": {
        kind: OperationKind.TRANSFORM,
        name: "outer product",
        inputs: ["x", "y"],
        outputs: ["out"],
        func: tensorFunc(tf.outerProduct as TensorFunc)
    },
    "pow": {
        kind: OperationKind.TRANSFORM,
        name: "pow",
        inputs: ["base", "exp"],
        outputs: ["out"],
        func: tensorFunc(tf.pow)
    },
    "prelu": {
        kind: OperationKind.TRANSFORM,
        name: "prelu",
        inputs: ["x", "alpha"],
        outputs: ["out"],
        func: tensorFunc(tf.prelu)
    },
    "prod": {
        kind: OperationKind.TRANSFORM,
        name: "prod",
        inputs: ["x"],
        outputs: ["out"],
        func: tensorFunc(tf.prod as TensorFunc)
    },
    "range": {
        kind: OperationKind.TRANSFORM,
        name: "range",
        inputs: ["start", "stop", "step"],
        outputs: ["out"],
        func: tensorFunc(tf.range as TensorFunc)
    },
    "reciprocal": {
        kind: OperationKind.TRANSFORM,
        name: "reciprocal",
        inputs: ["x"],
        outputs: ["out"],
        func: tensorFunc(tf.reciprocal)
    },
    "real": {
        kind: OperationKind.TRANSFORM,
        name: "real",
        inputs: ["x"],
        outputs: ["out"],
        func: tensorFunc(tf.real)
    },
    "relu": {
        kind: OperationKind.TRANSFORM,
        name: "relu",
        inputs: ["x"],
        outputs: ["out"],
        func: tensorFunc(tf.relu)
    },
    "relu6": {
        kind: OperationKind.TRANSFORM,
        name: "relu6",
        inputs: ["x"],
        outputs: ["out"],
        func: tensorFunc(tf.relu6)
    },
    "reverse": {
        kind: OperationKind.TRANSFORM,
        name: "reverse",
        inputs: ["x"],
        outputs: ["out"],
        func: tensorFunc(tf.reverse as TensorFunc)
    },
    "round": {
        kind: OperationKind.TRANSFORM,
        name: "round",
        inputs: ["x"],
        outputs: ["out"],
        func: tensorFunc(tf.round)
    },
    "rsqrt": {
        kind: OperationKind.TRANSFORM,
        name: "rsqrt",
        inputs: ["x"],
        outputs: ["out"],
        func: tensorFunc(tf.rsqrt)
    },
    "scatter": {
        kind: OperationKind.TRANSFORM,
        name: "scatter",
        inputs: ["x", "y"],
        outputs: ["plot"],
        func: scatter
    },
    "selu": {
        kind: OperationKind.TRANSFORM,
        name: "selu",
        inputs: ["x"],
        outputs: ["out"],
        func: tensorFunc(tf.selu)
    },
    "sigmoid": {
        kind: OperationKind.TRANSFORM,
        name: "sigmoid",
        inputs: ["x"],
        outputs: ["out"],
        func: tensorFunc(tf.sigmoid)
    },
    "sign": {
        kind: OperationKind.TRANSFORM,
        name: "sign",
        inputs: ["x"],
        outputs: ["out"],
        func: tensorFunc(tf.sign)
    },
    "sin": {
        kind: OperationKind.TRANSFORM,
        name: "sin",
        inputs: ["x"],
        outputs: ["out"],
        func: tensorFunc(tf.sin)
    },
    "sinh": {
        kind: OperationKind.TRANSFORM,
        name: "sinh",
        inputs: ["x"],
        outputs: ["out"],
        func: tensorFunc(tf.sin)
    },
    "slice": {
        kind: OperationKind.TRANSFORM,
        name: "slice",
        inputs: ["x", "begin", "size"],
        outputs: ["out"],
        func: tensorFunc(tf.slice as TensorFunc)
    },
    "softplus": {
        kind: OperationKind.TRANSFORM,
        name: "softplus",
        inputs: ["x"],
        outputs: ["out"],
        func: tensorFunc(tf.softplus)
    },
    "sqrt": {
        kind: OperationKind.TRANSFORM,
        name: "sqrt",
        inputs: ["x"],
        outputs: ["out"],
        func: tensorFunc(tf.sqrt)
    },
    "square": {
        kind: OperationKind.TRANSFORM,
        name: "square",
        inputs: ["x"],
        outputs: ["out"],
        func: tensorFunc(tf.square)
    },
    "squared difference": {
        kind: OperationKind.TRANSFORM,
        name: "squared difference",
        inputs: ["x", "y"],
        outputs: ["out"],
        func: tensorFunc(tf.squaredDifference)
    },
    "sub": {
        kind: OperationKind.TRANSFORM,
        name: "sub",
        inputs: ["x", "y"],
        outputs: ["out"],
        func: tensorFunc(tf.sub)
    },
    "sum": {
        kind: OperationKind.TRANSFORM,
        name: "sum",
        inputs: ["x"],
        outputs: ["out"],
        func: tensorFunc(tf.sum as TensorFunc)
    },
    "stack": {
        kind: OperationKind.TRANSFORM,
        name: "stack",
        inputs: ["x", "y"],
        outputs: ["out"],
        func: tensorFunc((x, y) => tf.stack([x, y], 1))
    },
    "step": {
        kind: OperationKind.TRANSFORM,
        name: "step",
        inputs: ["x", "alpha"],
        outputs: ["out"],
        func: tensorFunc(tf.step as TensorFunc)
    },
    "tan": {
        kind: OperationKind.TRANSFORM,
        name: "tan",
        inputs: ["x"],
        outputs: ["out"],
        func: tensorFunc(tf.tan)
    },
    "tanh": {
        kind: OperationKind.TRANSFORM,
        name: "tanh",
        inputs: ["x"],
        outputs: ["out"],
        func: tensorFunc(tf.tanh)
    },
    "tile": {
        kind: OperationKind.TRANSFORM,
        name: "tile",
        inputs: ["x", "reps"],
        outputs: ["out"],
        func: tensorFunc(((x, reps: number) => tf.tile(x, [reps])) as TensorFunc)
    },
    "transpose": {
        kind: OperationKind.TRANSFORM,
        name: "transpose",
        inputs: ["x"],
        outputs: ["out"],
        func: tensorFunc(tf.transpose as TensorFunc)
    },
    "where": {
        kind: OperationKind.TRANSFORM,
        name: "where",
        inputs: ["condition", "true", "false"],
        outputs: ["out"],
        func: tensorFunc(tf.where)
    },
    "zeros": {
        kind: OperationKind.TRANSFORM,
        name: "zeros",
        inputs: ["shape"],
        outputs: ["out"],
        func: tensorFunc(tf.zeros as TensorFunc)
    },
    "zeros like": {
        kind: OperationKind.TRANSFORM,
        name: "zeros like",
        inputs: ["x"],
        outputs: ["out"],
        func: tensorFunc(tf.zerosLike)
    },
}