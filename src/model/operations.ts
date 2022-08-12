import * as tf from '@tensorflow/tfjs-core';

import { Operations, Tensor } from "./graph"

type Operation = (...inputs: Tensor[]) => tf.Tensor<tf.Rank>

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
        operation: tf.abs
    },
    "acos": {
        name: "acos",
        inputs: ["x"],
        outputs: ["out"],
        operation: tf.acos
    },
    "acosh": {
        name: "acosh",
        inputs: ["x"],
        outputs: ["out"],
        operation: tf.acosh
    },
    "add": {
        name: "add",
        inputs: ["x", "y"],
        outputs: ["out"],
        operation: tf.add
    },
    "all": {
        name: "all",
        inputs: ["x"],
        outputs: ["out"],
        operation: tf.all as Operation
    },
    "any": {
        name: "any",
        inputs: ["x"],
        outputs: ["out"],
        operation: tf.any as Operation
    },
    "arg max": {
        name: "arg max",
        inputs: ["x"],
        outputs: ["out"],
        operation: tf.argMax as Operation
    },
    "arg min": {
        name: "arg min",
        inputs: ["x"],
        outputs: ["out"],
        operation: tf.argMin as Operation
    },
    "asin": {
        name: "asin",
        inputs: ["x"],
        outputs: ["out"],
        operation: tf.asin
    },
    "asinh": {
        name: "asinh",
        inputs: ["x"],
        outputs: ["out"],
        operation: tf.asinh
    },
    "atan": {
        name: "atan",
        inputs: ["x"],
        outputs: ["out"],
        operation: tf.atan
    },
    "atanh": {
        name: "atanh",
        inputs: ["x"],
        outputs: ["out"],
        operation: tf.atanh
    },
    "ceil": {
        name: "ceil",
        inputs: ["x"],
        outputs: ["out"],
        operation: tf.ceil
    },
    "clip": {
        name: "clip",
        inputs: ["x", "min", "max"],
        outputs: ["out"],
        operation: tf.clipByValue as Operation
    },
    "complex": {
        name: "complex",
        inputs: ["real", "imag"],
        outputs: ["out"],
        operation: tf.complex
    },
    "concat": {
        name: "concat",
        inputs: ["x", "y"],
        outputs: ["out"],
        operation: (x, y) => tf.concat([x, y])
    },
    "cos": {
        name: "cos",
        inputs: ["x"],
        outputs: ["out"],
        operation: tf.cos
    },
    "cosh": {
        name: "cosh",
        inputs: ["x"],
        outputs: ["out"],
        operation: tf.cosh
    },
    "cumsum": {
        name: "cumsum",
        inputs: ["x"],
        outputs: ["out"],
        operation: tf.cumsum as Operation
    },
    "cumprod": {
        name: "cumprod",
        inputs: ["x"],
        outputs: ["out"],
        operation: tf.cumprod as Operation
    },
    "diag": {
        name: "diag",
        inputs: ["x"],
        outputs: ["out"],
        operation: tf.diag as Operation
    },
    "div": {
        name: "div",
        inputs: ["x", "y"],
        outputs: ["out"],
        operation: tf.div
    },
    "div no nan": {
        name: "div no nan",
        inputs: ["x", "y"],
        outputs: ["out"],
        operation: tf.divNoNan
    },
    "dot": {
        name: "dot",
        inputs: ["x", "y"],
        outputs: ["out"],
        operation: tf.dot
    },
    "elu": {
        name: "elu",
        inputs: ["x"],
        outputs: ["out"],
        operation: tf.elu
    },
    "erf": {
        name: "erf",
        inputs: ["x"],
        outputs: ["out"],
        operation: tf.erf
    },
    "equal": {
        name: "equal",
        inputs: ["x", "y"],
        outputs: ["out"],
        operation: tf.equal
    },
    "euclideanNorm": {
        name: "euclideanNorm",
        inputs: ["x"],
        outputs: ["out"],
        operation: tf.euclideanNorm as Operation
    },
    "exp": {
        name: "exp",
        inputs: ["x"],
        outputs: ["out"],
        operation: tf.exp
    },
    "expm1": {
        name: "expm1",
        inputs: ["x"],
        outputs: ["out"],
        operation: tf.expm1
    },
    "eye": {
        name: "eye",
        inputs: ["size"],
        outputs: ["out"],
        operation: tf.eye as Operation
    },
    "fill": {
        name: "fill",
        inputs: ["shape", "value"],
        outputs: ["out"],
        operation: tf.fill as Operation
    },
    "floor": {
        name: "floor",
        inputs: ["x"],
        outputs: ["out"],
        operation: tf.floor
    },
    "floor div": {
        name: "floor div",
        inputs: ["x", "y"],
        outputs: ["out"],
        operation: tf.floorDiv
    },
    "gather": {
        name: "gather",
        inputs: ["x", "indices"],
        outputs: ["out"],
        operation: tf.gather as Operation
    },
    "greater": {
        name: "greater",
        inputs: ["x", "y"],
        outputs: ["out"],
        operation: tf.greater
    },
    "greater equal": {
        name: "greater equal",
        inputs: ["x", "y"],
        outputs: ["out"],
        operation: tf.greaterEqual
    },
    "imag": {
        name: "imag",
        inputs: ["x"],
        outputs: ["out"],
        operation: tf.imag
    },
    "is finite": {
        name: "is finite",
        inputs: ["x"],
        outputs: ["out"],
        operation: tf.isFinite
    },
    "is inf": {
        name: "is inf",
        inputs: ["x"],
        outputs: ["out"],
        operation: tf.isInf
    },
    "is nan": {
        name: "is nan",
        inputs: ["x"],
        outputs: ["out"],
        operation: tf.isNaN
    },
    "leaky relu": {
        name: "leaky relu",
        inputs: ["x"],
        outputs: ["out"],
        operation: tf.leakyRelu as Operation
    },
    "less": {
        name: "less",
        inputs: ["x", "y"],
        outputs: ["out"],
        operation: tf.less
    },
    "less equal": {
        name: "less equal",
        inputs: ["x", "y"],
        outputs: ["out"],
        operation: tf.lessEqual
    },
    "linspace": {
        name: "linspace",
        inputs: ["start", "stop", "num"],
        outputs: ["out"],
        operation: tf.linspace as Operation
    },
    "log": {
        name: "log",
        inputs: ["x"],
        outputs: ["out"],
        operation: tf.log
    },
    "log1p": {
        name: "log1p",
        inputs: ["x"],
        outputs: ["out"],
        operation: tf.log1p
    },
    "log sigmoid": {
        name: "log sigmoid",
        inputs: ["x"],
        outputs: ["out"],
        operation: tf.logSigmoid
    },
    "log softmax": {
        name: "log softmax",
        inputs: ["x"],
        outputs: ["out"],
        operation: tf.logSoftmax as Operation
    },
    "log sum exp": {
        name: "log sum exp",
        inputs: ["x"],
        outputs: ["out"],
        operation: tf.logSumExp as Operation
    },
    "and": {
        name: "and",
        inputs: ["x", "y"],
        outputs: ["out"],
        operation: tf.logicalAnd
    },
    "not": {
        name: "not",
        inputs: ["x"],
        outputs: ["out"],
        operation: tf.logicalNot
    },
    "oneHot": {
        name: "oneHot",
        inputs: ["indices", "depth"],
        outputs: ["out"],
        operation: tf.oneHot as Operation
    },
    "ones": {
        name: "ones",
        inputs: ["shape"],
        outputs: ["out"],
        operation: tf.ones as Operation
    },
    "ones like": {
        name: "ones like",
        inputs: ["x"],
        outputs: ["out"],
        operation: tf.onesLike
    },
    "or": {
        name: "or",
        inputs: ["x", "y"],
        outputs: ["out"],
        operation: tf.logicalOr
    },
    "xor": {
        name: "xor",
        inputs: ["x", "y"],
        outputs: ["out"],
        operation: tf.logicalXor
    },
    "mat mul": {
        name: "mat mul",
        inputs: ["x", "y"],
        outputs: ["out"],
        operation: tf.matMul as Operation
    },
    "max": {
        name: "max",
        inputs: ["x"],
        outputs: ["out"],
        operation: tf.max as Operation
    },
    "maximum": {
        name: "maximum",
        inputs: ["x", "y"],
        outputs: ["out"],
        operation: tf.maximum
    },
    "minimum": {
        name: "minimum",
        inputs: ["x", "y"],
        outputs: ["out"],
        operation: tf.minimum
    },
    "min": {
        name: "min",
        inputs: ["x"],
        outputs: ["out"],
        operation: tf.min as Operation
    },
    "mean": {
        name: "mean",
        inputs: ["x"],
        outputs: ["out"],
        operation: tf.mean as Operation
    },
    "mod": {
        name: "mod",
        inputs: ["x", "y"],
        outputs: ["out"],
        operation: tf.mod
    },
    "mul": {
        name: "mul",
        inputs: ["x", "y"],
        outputs: ["out"],
        operation: tf.mul
    },
    "multinomial": {
        name: "multinomial",
        inputs: ["logits", "num samples"],
        outputs: ["out"],
        operation: tf.multinomial as Operation
    },
    "neg": {
        name: "neg",
        inputs: ["x"],
        outputs: ["out"],
        operation: tf.neg
    },
    "not equal": {
        name: "not equal",
        inputs: ["x", "y"],
        outputs: ["out"],
        operation: tf.notEqual
    },
    "norm": {
        name: "norm",
        inputs: ["x"],
        outputs: ["out"],
        operation: tf.norm as Operation
    },
    "outer product": {
        name: "outer product",
        inputs: ["x", "y"],
        outputs: ["out"],
        operation: tf.outerProduct as Operation
    },
    "pow": {
        name: "pow",
        inputs: ["base", "exp"],
        outputs: ["out"],
        operation: tf.pow
    },
    "prelu": {
        name: "prelu",
        inputs: ["x", "alpha"],
        outputs: ["out"],
        operation: tf.prelu
    },
    "prod": {
        name: "prod",
        inputs: ["x"],
        outputs: ["out"],
        operation: tf.prod as Operation
    },
    "range": {
        name: "range",
        inputs: ["start", "stop", "step"],
        outputs: ["out"],
        operation: tf.range as Operation
    },
    "reciprocal": {
        name: "reciprocal",
        inputs: ["x"],
        outputs: ["out"],
        operation: tf.reciprocal
    },
    "real": {
        name: "real",
        inputs: ["x"],
        outputs: ["out"],
        operation: tf.real
    },
    "relu": {
        name: "relu",
        inputs: ["x"],
        outputs: ["out"],
        operation: tf.relu
    },
    "relu6": {
        name: "relu6",
        inputs: ["x"],
        outputs: ["out"],
        operation: tf.relu6
    },
    "reverse": {
        name: "reverse",
        inputs: ["x"],
        outputs: ["out"],
        operation: tf.reverse as Operation
    },
    "round": {
        name: "round",
        inputs: ["x"],
        outputs: ["out"],
        operation: tf.round
    },
    "rsqrt": {
        name: "rsqrt",
        inputs: ["x"],
        outputs: ["out"],
        operation: tf.rsqrt
    },
    "selu": {
        name: "selu",
        inputs: ["x"],
        outputs: ["out"],
        operation: tf.selu
    },
    "sigmoid": {
        name: "sigmoid",
        inputs: ["x"],
        outputs: ["out"],
        operation: tf.sigmoid
    },
    "sign": {
        name: "sign",
        inputs: ["x"],
        outputs: ["out"],
        operation: tf.sign
    },
    "sin": {
        name: "sin",
        inputs: ["x"],
        outputs: ["out"],
        operation: tf.sin
    },
    "sinh": {
        name: "sinh",
        inputs: ["x"],
        outputs: ["out"],
        operation: tf.sin
    },
    "slice": {
        name: "slice",
        inputs: ["x", "begin", "size"],
        outputs: ["out"],
        operation: tf.slice as Operation
    },
    "softplus": {
        name: "softplus",
        inputs: ["x"],
        outputs: ["out"],
        operation: tf.softplus
    },
    "sqrt": {
        name: "sqrt",
        inputs: ["x"],
        outputs: ["out"],
        operation: tf.sqrt
    },
    "square": {
        name: "square",
        inputs: ["x"],
        outputs: ["out"],
        operation: tf.square
    },
    "squared difference": {
        name: "squared difference",
        inputs: ["x", "y"],
        outputs: ["out"],
        operation: tf.squaredDifference
    },
    "sub": {
        name: "sub",
        inputs: ["x", "y"],
        outputs: ["out"],
        operation: tf.sub
    },
    "sum": {
        name: "sum",
        inputs: ["x"],
        outputs: ["out"],
        operation: tf.sum as Operation
    },
    "step": {
        name: "step",
        inputs: ["x", "alpha"],
        outputs: ["out"],
        operation: tf.step as Operation
    },
    "tan": {
        name: "tan",
        inputs: ["x"],
        outputs: ["out"],
        operation: tf.tan
    },
    "tanh": {
        name: "tanh",
        inputs: ["x"],
        outputs: ["out"],
        operation: tf.tanh
    },
    "tile": {
        name: "tile",
        inputs: ["x", "reps"],
        outputs: ["out"],
        operation: ((x, reps: number) => tf.tile(x, [reps])) as Operation
    },
    "transpose": {
        name: "transpose",
        inputs: ["x"],
        outputs: ["out"],
        operation: tf.transpose as Operation
    },
    "where": {
        name: "where",
        inputs: ["condition", "true", "false"],
        outputs: ["out"],
        operation: tf.where
    },
    "zeros": {
        name: "zeros",
        inputs: ["shape"],
        outputs: ["out"],
        operation: tf.zeros as Operation
    },
    "zeros like": {
        name: "zeros like",
        inputs: ["x"],
        outputs: ["out"],
        operation: tf.zerosLike
    },
}