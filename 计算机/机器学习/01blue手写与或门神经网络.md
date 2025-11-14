```js
const datas = [
    [[0, 0], 0],
    [[0, 1], 0],
    [[1, 0], 0],
    [[1, 1], 1]
]

const weights = [];
for (let i = 0; i < 3; i++) {
    weights[i] = Math.random() - 0.5;
}

function calcOutput(inputs) {
    let output = inputs[0] * weights[0] + inputs[1] * weights[1] + weights[2] * 1
    return sigmoid(output)
}
function sigmoid(x) {
    return 1 / (1 + Math.pow(Math.E, -x));
}


function errRate(output, expected) {
    return Math.abs(output - expected)
}

const errors = [];
const maxError = 20;
function calcError(err) {
    errors.push(err);
    if (errors.length > maxError) {
        errors.shift();
    }

    return errors.reduce((tmp, item) => tmp + item) / errors.length
}

const d = 0.000001;
const trainRate = 0.01 //有时候会一直在0.25% 可调整学习率
let times = 1;
const threshold = 0.0001
function train(inputs, expected) {
    let err = errRate(calcOutput(inputs), expected)
    const dw = []
    weights.forEach((w, i) => {
        weights[i] += d;
        let err2 = errRate(calcOutput(inputs), expected);
        dw[i] = (err2 - err) / d;
        weights[i] = w
    });
    weights.forEach((w, i) => {
        weights[i] -= dw[i] * trainRate;
    })
    let e = calcError(err);
    times++
    if (times % 5000 == 0) {
        console.log(`#${times} ${e}`)
    }
    return e <= threshold
}

for (let i = 0; ; i++) {
    let data = datas[i % datas.length];
    if (train(data[0], data[1]))
        break
}
console.log(weights)
```