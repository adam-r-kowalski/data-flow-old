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
    "div": {
        name: "div",
        inputs: ["x", "y"],
        outputs: ["out"],
        operation: tf.div
    },
    "elu": {
        name: "elu",
        inputs: ["x"],
        outputs: ["out"],
        operation: tf.elu
    },
    "equal": {
        name: "equal",
        inputs: ["x", "y"],
        outputs: ["out"],
        operation: tf.equal
    },
    "exp": {
        name: "exp",
        inputs: ["x"],
        outputs: ["out"],
        operation: tf.exp
    },
    "floor": {
        name: "floor",
        inputs: ["x"],
        outputs: ["out"],
        operation: tf.floor
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
        inputs: ["leaky relu"],
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
    "log": {
        name: "log",
        inputs: ["x"],
        outputs: ["out"],
        operation: tf.log
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
    "relu": {
        name: "relu",
        inputs: ["x"],
        outputs: ["out"],
        operation: tf.relu
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
    "sub": {
        name: "sub",
        inputs: ["x", "y"],
        outputs: ["out"],
        operation: tf.sub
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
    "where": {
        name: "where",
        inputs: ["condition", "true", "false"],
        outputs: ["out"],
        operation: tf.where
    }
}