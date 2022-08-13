import * as tf from '@tensorflow/tfjs-core';

import { Operations, Body, Tensor, BodyKind, TensorBody } from "./graph"

type Operation = (currentBody: Body, ...inputs: Body[]) => Body

type TensorOperation = (...inputs: Tensor[]) => tf.Tensor<tf.Rank>

export const tensorOperation = (f: TensorOperation): Operation => {
    return ({ uuid, node }: Body, ...inputs: Body[]): Body => {
        const tensors = inputs
            .filter(body => body.kind === BodyKind.TENSOR)
            .map(body => (body as TensorBody).value)
        const result = f(...tensors)
        return {
            kind: BodyKind.TENSOR,
            uuid: uuid,
            node: node,
            value: result.arraySync(),
            rank: result.rank,
            shape: result.shape,
            editable: false,
        }
    }
}

export const operations: Operations = {
    "number": {
        name: "number",
        inputs: [],
        body: 0,
        outputs: ["out"],
    },
    "abs": {
        name: "abs",
        inputs: ["x"],
        outputs: ["out"],
        operation: tensorOperation(tf.abs)
    },
    "acos": {
        name: "acos",
        inputs: ["x"],
        outputs: ["out"],
        operation: tensorOperation(tf.acos)
    },
    "acosh": {
        name: "acosh",
        inputs: ["x"],
        outputs: ["out"],
        operation: tensorOperation(tf.acosh)
    },
    "add": {
        name: "add",
        inputs: ["x", "y"],
        outputs: ["out"],
        operation: tensorOperation(tf.add)
    },
    "all": {
        name: "all",
        inputs: ["x"],
        outputs: ["out"],
        operation: tensorOperation(tf.all as TensorOperation)
    },
    "any": {
        name: "any",
        inputs: ["x"],
        outputs: ["out"],
        operation: tensorOperation(tf.any as TensorOperation)
    },
    "arg max": {
        name: "arg max",
        inputs: ["x"],
        outputs: ["out"],
        operation: tensorOperation(tf.argMax as TensorOperation)
    },
    "arg min": {
        name: "arg min",
        inputs: ["x"],
        outputs: ["out"],
        operation: tensorOperation(tf.argMin as TensorOperation)
    },
    "asin": {
        name: "asin",
        inputs: ["x"],
        outputs: ["out"],
        operation: tensorOperation(tf.asin)
    },
    "asinh": {
        name: "asinh",
        inputs: ["x"],
        outputs: ["out"],
        operation: tensorOperation(tf.asinh)
    },
    "atan": {
        name: "atan",
        inputs: ["x"],
        outputs: ["out"],
        operation: tensorOperation(tf.atan)
    },
    "atanh": {
        name: "atanh",
        inputs: ["x"],
        outputs: ["out"],
        operation: tensorOperation(tf.atanh)
    },
    "ceil": {
        name: "ceil",
        inputs: ["x"],
        outputs: ["out"],
        operation: tensorOperation(tf.ceil)
    },
    "clip": {
        name: "clip",
        inputs: ["x", "min", "max"],
        outputs: ["out"],
        operation: tensorOperation(tf.clipByValue as TensorOperation)
    },
    "complex": {
        name: "complex",
        inputs: ["real", "imag"],
        outputs: ["out"],
        operation: tensorOperation(tf.complex)
    },
    "concat": {
        name: "concat",
        inputs: ["x", "y"],
        outputs: ["out"],
        operation: tensorOperation((x, y) => tf.concat([x, y]))
    },
    "cos": {
        name: "cos",
        inputs: ["x"],
        outputs: ["out"],
        operation: tensorOperation(tf.cos)
    },
    "cosh": {
        name: "cosh",
        inputs: ["x"],
        outputs: ["out"],
        operation: tensorOperation(tf.cosh)
    },
    "cumsum": {
        name: "cumsum",
        inputs: ["x"],
        outputs: ["out"],
        operation: tensorOperation(tf.cumsum as TensorOperation)
    },
    "cumprod": {
        name: "cumprod",
        inputs: ["x"],
        outputs: ["out"],
        operation: tensorOperation(tf.cumprod as TensorOperation)
    },
    "diag": {
        name: "diag",
        inputs: ["x"],
        outputs: ["out"],
        operation: tensorOperation(tf.diag as TensorOperation)
    },
    "div": {
        name: "div",
        inputs: ["x", "y"],
        outputs: ["out"],
        operation: tensorOperation(tf.div)
    },
    "div no nan": {
        name: "div no nan",
        inputs: ["x", "y"],
        outputs: ["out"],
        operation: tensorOperation(tf.divNoNan)
    },
    "dot": {
        name: "dot",
        inputs: ["x", "y"],
        outputs: ["out"],
        operation: tensorOperation(tf.dot)
    },
    "elu": {
        name: "elu",
        inputs: ["x"],
        outputs: ["out"],
        operation: tensorOperation(tf.elu)
    },
    "erf": {
        name: "erf",
        inputs: ["x"],
        outputs: ["out"],
        operation: tensorOperation(tf.erf)
    },
    "equal": {
        name: "equal",
        inputs: ["x", "y"],
        outputs: ["out"],
        operation: tensorOperation(tf.equal)
    },
    "euclideanNorm": {
        name: "euclideanNorm",
        inputs: ["x"],
        outputs: ["out"],
        operation: tensorOperation(tf.euclideanNorm as TensorOperation)
    },
    "exp": {
        name: "exp",
        inputs: ["x"],
        outputs: ["out"],
        operation: tensorOperation(tf.exp)
    },
    "expm1": {
        name: "expm1",
        inputs: ["x"],
        outputs: ["out"],
        operation: tensorOperation(tf.expm1)
    },
    "eye": {
        name: "eye",
        inputs: ["size"],
        outputs: ["out"],
        operation: tensorOperation(tf.eye as TensorOperation)
    },
    "fill": {
        name: "fill",
        inputs: ["shape", "value"],
        outputs: ["out"],
        operation: tensorOperation(tf.fill as TensorOperation)
    },
    "floor": {
        name: "floor",
        inputs: ["x"],
        outputs: ["out"],
        operation: tensorOperation(tf.floor)
    },
    "floor div": {
        name: "floor div",
        inputs: ["x", "y"],
        outputs: ["out"],
        operation: tensorOperation(tf.floorDiv)
    },
    "gather": {
        name: "gather",
        inputs: ["x", "indices"],
        outputs: ["out"],
        operation: tensorOperation(tf.gather as TensorOperation)
    },
    "greater": {
        name: "greater",
        inputs: ["x", "y"],
        outputs: ["out"],
        operation: tensorOperation(tf.greater)
    },
    "greater equal": {
        name: "greater equal",
        inputs: ["x", "y"],
        outputs: ["out"],
        operation: tensorOperation(tf.greaterEqual)
    },
    "imag": {
        name: "imag",
        inputs: ["x"],
        outputs: ["out"],
        operation: tensorOperation(tf.imag)
    },
    "is finite": {
        name: "is finite",
        inputs: ["x"],
        outputs: ["out"],
        operation: tensorOperation(tf.isFinite)
    },
    "is inf": {
        name: "is inf",
        inputs: ["x"],
        outputs: ["out"],
        operation: tensorOperation(tf.isInf)
    },
    "is nan": {
        name: "is nan",
        inputs: ["x"],
        outputs: ["out"],
        operation: tensorOperation(tf.isNaN)
    },
    "leaky relu": {
        name: "leaky relu",
        inputs: ["x"],
        outputs: ["out"],
        operation: tensorOperation(tf.leakyRelu as TensorOperation)
    },
    "less": {
        name: "less",
        inputs: ["x", "y"],
        outputs: ["out"],
        operation: tensorOperation(tf.less)
    },
    "less equal": {
        name: "less equal",
        inputs: ["x", "y"],
        outputs: ["out"],
        operation: tensorOperation(tf.lessEqual)
    },
    "linspace": {
        name: "linspace",
        inputs: ["start", "stop", "num"],
        outputs: ["out"],
        operation: tensorOperation(tf.linspace as TensorOperation)
    },
    "log": {
        name: "log",
        inputs: ["x"],
        outputs: ["out"],
        operation: tensorOperation(tf.log)
    },
    "log1p": {
        name: "log1p",
        inputs: ["x"],
        outputs: ["out"],
        operation: tensorOperation(tf.log1p)
    },
    "log sigmoid": {
        name: "log sigmoid",
        inputs: ["x"],
        outputs: ["out"],
        operation: tensorOperation(tf.logSigmoid)
    },
    "log softmax": {
        name: "log softmax",
        inputs: ["x"],
        outputs: ["out"],
        operation: tensorOperation(tf.logSoftmax as TensorOperation)
    },
    "log sum exp": {
        name: "log sum exp",
        inputs: ["x"],
        outputs: ["out"],
        operation: tensorOperation(tf.logSumExp as TensorOperation)
    },
    "and": {
        name: "and",
        inputs: ["x", "y"],
        outputs: ["out"],
        operation: tensorOperation(tf.logicalAnd)
    },
    "not": {
        name: "not",
        inputs: ["x"],
        outputs: ["out"],
        operation: tensorOperation(tf.logicalNot)
    },
    "oneHot": {
        name: "oneHot",
        inputs: ["indices", "depth"],
        outputs: ["out"],
        operation: tensorOperation(tf.oneHot as TensorOperation)
    },
    "ones": {
        name: "ones",
        inputs: ["shape"],
        outputs: ["out"],
        operation: tensorOperation(tf.ones as TensorOperation)
    },
    "ones like": {
        name: "ones like",
        inputs: ["x"],
        outputs: ["out"],
        operation: tensorOperation(tf.onesLike)
    },
    "or": {
        name: "or",
        inputs: ["x", "y"],
        outputs: ["out"],
        operation: tensorOperation(tf.logicalOr)
    },
    "xor": {
        name: "xor",
        inputs: ["x", "y"],
        outputs: ["out"],
        operation: tensorOperation(tf.logicalXor)
    },
    "mat mul": {
        name: "mat mul",
        inputs: ["x", "y"],
        outputs: ["out"],
        operation: tensorOperation(tf.matMul as TensorOperation)
    },
    "max": {
        name: "max",
        inputs: ["x"],
        outputs: ["out"],
        operation: tensorOperation(tf.max as TensorOperation)
    },
    "maximum": {
        name: "maximum",
        inputs: ["x", "y"],
        outputs: ["out"],
        operation: tensorOperation(tf.maximum)
    },
    "minimum": {
        name: "minimum",
        inputs: ["x", "y"],
        outputs: ["out"],
        operation: tensorOperation(tf.minimum)
    },
    "min": {
        name: "min",
        inputs: ["x"],
        outputs: ["out"],
        operation: tensorOperation(tf.min as TensorOperation)
    },
    "mean": {
        name: "mean",
        inputs: ["x"],
        outputs: ["out"],
        operation: tensorOperation(tf.mean as TensorOperation)
    },
    "mod": {
        name: "mod",
        inputs: ["x", "y"],
        outputs: ["out"],
        operation: tensorOperation(tf.mod)
    },
    "mul": {
        name: "mul",
        inputs: ["x", "y"],
        outputs: ["out"],
        operation: tensorOperation(tf.mul)
    },
    "multinomial": {
        name: "multinomial",
        inputs: ["logits", "num samples"],
        outputs: ["out"],
        operation: tensorOperation(tf.multinomial as TensorOperation)
    },
    "neg": {
        name: "neg",
        inputs: ["x"],
        outputs: ["out"],
        operation: tensorOperation(tf.neg)
    },
    "not equal": {
        name: "not equal",
        inputs: ["x", "y"],
        outputs: ["out"],
        operation: tensorOperation(tf.notEqual)
    },
    "norm": {
        name: "norm",
        inputs: ["x"],
        outputs: ["out"],
        operation: tensorOperation(tf.norm as TensorOperation)
    },
    "outer product": {
        name: "outer product",
        inputs: ["x", "y"],
        outputs: ["out"],
        operation: tensorOperation(tf.outerProduct as TensorOperation)
    },
    "pow": {
        name: "pow",
        inputs: ["base", "exp"],
        outputs: ["out"],
        operation: tensorOperation(tf.pow)
    },
    "prelu": {
        name: "prelu",
        inputs: ["x", "alpha"],
        outputs: ["out"],
        operation: tensorOperation(tf.prelu)
    },
    "prod": {
        name: "prod",
        inputs: ["x"],
        outputs: ["out"],
        operation: tensorOperation(tf.prod as TensorOperation)
    },
    "range": {
        name: "range",
        inputs: ["start", "stop", "step"],
        outputs: ["out"],
        operation: tensorOperation(tf.range as TensorOperation)
    },
    "reciprocal": {
        name: "reciprocal",
        inputs: ["x"],
        outputs: ["out"],
        operation: tensorOperation(tf.reciprocal)
    },
    "real": {
        name: "real",
        inputs: ["x"],
        outputs: ["out"],
        operation: tensorOperation(tf.real)
    },
    "relu": {
        name: "relu",
        inputs: ["x"],
        outputs: ["out"],
        operation: tensorOperation(tf.relu)
    },
    "relu6": {
        name: "relu6",
        inputs: ["x"],
        outputs: ["out"],
        operation: tensorOperation(tf.relu6)
    },
    "reverse": {
        name: "reverse",
        inputs: ["x"],
        outputs: ["out"],
        operation: tensorOperation(tf.reverse as TensorOperation)
    },
    "round": {
        name: "round",
        inputs: ["x"],
        outputs: ["out"],
        operation: tensorOperation(tf.round)
    },
    "rsqrt": {
        name: "rsqrt",
        inputs: ["x"],
        outputs: ["out"],
        operation: tensorOperation(tf.rsqrt)
    },
    "selu": {
        name: "selu",
        inputs: ["x"],
        outputs: ["out"],
        operation: tensorOperation(tf.selu)
    },
    "sigmoid": {
        name: "sigmoid",
        inputs: ["x"],
        outputs: ["out"],
        operation: tensorOperation(tf.sigmoid)
    },
    "sign": {
        name: "sign",
        inputs: ["x"],
        outputs: ["out"],
        operation: tensorOperation(tf.sign)
    },
    "sin": {
        name: "sin",
        inputs: ["x"],
        outputs: ["out"],
        operation: tensorOperation(tf.sin)
    },
    "sinh": {
        name: "sinh",
        inputs: ["x"],
        outputs: ["out"],
        operation: tensorOperation(tf.sin)
    },
    "slice": {
        name: "slice",
        inputs: ["x", "begin", "size"],
        outputs: ["out"],
        operation: tensorOperation(tf.slice as TensorOperation)
    },
    "softplus": {
        name: "softplus",
        inputs: ["x"],
        outputs: ["out"],
        operation: tensorOperation(tf.softplus)
    },
    "sqrt": {
        name: "sqrt",
        inputs: ["x"],
        outputs: ["out"],
        operation: tensorOperation(tf.sqrt)
    },
    "square": {
        name: "square",
        inputs: ["x"],
        outputs: ["out"],
        operation: tensorOperation(tf.square)
    },
    "squared difference": {
        name: "squared difference",
        inputs: ["x", "y"],
        outputs: ["out"],
        operation: tensorOperation(tf.squaredDifference)
    },
    "sub": {
        name: "sub",
        inputs: ["x", "y"],
        outputs: ["out"],
        operation: tensorOperation(tf.sub)
    },
    "sum": {
        name: "sum",
        inputs: ["x"],
        outputs: ["out"],
        operation: tensorOperation(tf.sum as TensorOperation)
    },
    "step": {
        name: "step",
        inputs: ["x", "alpha"],
        outputs: ["out"],
        operation: tensorOperation(tf.step as TensorOperation)
    },
    "tan": {
        name: "tan",
        inputs: ["x"],
        outputs: ["out"],
        operation: tensorOperation(tf.tan)
    },
    "tanh": {
        name: "tanh",
        inputs: ["x"],
        outputs: ["out"],
        operation: tensorOperation(tf.tanh)
    },
    "tile": {
        name: "tile",
        inputs: ["x", "reps"],
        outputs: ["out"],
        operation: tensorOperation(((x, reps: number) => tf.tile(x, [reps])) as TensorOperation)
    },
    "transpose": {
        name: "transpose",
        inputs: ["x"],
        outputs: ["out"],
        operation: tensorOperation(tf.transpose as TensorOperation)
    },
    "where": {
        name: "where",
        inputs: ["condition", "true", "false"],
        outputs: ["out"],
        operation: tensorOperation(tf.where)
    },
    "zeros": {
        name: "zeros",
        inputs: ["shape"],
        outputs: ["out"],
        operation: tensorOperation(tf.zeros as TensorOperation)
    },
    "zeros like": {
        name: "zeros like",
        inputs: ["x"],
        outputs: ["out"],
        operation: tensorOperation(tf.zerosLike)
    },
}