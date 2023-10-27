//Hydra应该不算序列记号(
//格式:pn(A1+A2+...+Am)=[n,A1,A2,...,Am]

function readHydra(str) {    //读取字符串
    let stack = []
    let tmp = 0
    let i = 0
    let l = str.length
    let res = [0]
    while (i < l) {
        let a = str[i]
        if (a == '(') {
            stack.push([tmp])
            tmp = 0
        } else if (a == ')') {
            k = stack.pop()
            if (stack.length == 0) {
                res.push(k)
            } else {
                stack[stack.length - 1].push(k)
            }
            tmp = 0
        } else {
            let code = str.charCodeAt(i) - 48
            if (code >= 0 && code <= 9) {
                tmp = tmp * 10 + code
            }
        }
        ++i
    }
    while (stack.length > 0) {
        k = stack.pop()
        if (stack.length == 0) {
            res.push(k)
        } else {
            stack[stack.length - 1].push(k)
        }
    }
    return res
}
function writeHydra(hydra) {    //将Hydra化为字符串
    return ('p' + hydra[0].toString() + '(' + (hydra.length > 1 ? hydra.slice(1).map(writeHydra).join('+') : '0') + ')')
}
function compareHydra(h1, h2) {    //Hydra比较
    if (h1[0] > h2[0]) {
        return 1
    } else if (h1[0] < h2[0]) {
        return -1
    } else {
        for (let j = 1; j < h1.length; ++j) {
            if (h2[j] == null) {
                return 1
            } else {
                let a = compareHydra(h1[j], h2[j])
                if (a != 0) {
                    return a
                }
            }
        }
        return (h1.length < h2.length ? -1 : 0)
    }
}
function copyHydra(hydra) {    //复制Hydra
    return [hydra[0]].concat(hydra.slice(1).map(copyHydra))
}
function copyLifting(hydra, delta = 0, lb = 0) {    //带提升的复制
    //LPrSS Hydra中某一项提升当且仅当它大于坏根且从坏根到它的路上没有比坏根小的数
    return [hydra[0]+delta*(hydra[0]>=lb?1:0)].concat(hydra.slice(1).map((x)=>{return copyLifting(x,(x[0]>lb?delta:0),lb)}))
}
function findTop2(h) {
    let a = h
    while (a.length > 1 && a[a.length - 1].length > 1) {
        a = a[a.length - 1]
    }
    return a
}
function expandHydra(h, fs, lifting = false) {    //展开Hydra
    h1 = copyHydra(h)
    let stack = [h1]
    let a = h1
    while (a.length > 1) {
        a = a[a.length - 1]
        stack.push(a)
    }
    l = stack.length
    if (a[0] == 0) {
        let b = stack[l - 2]
        b.pop()
        if (l >= 3) {
            for (let i = 0; i < fs; ++i) {
                stack[l - 3].push(copyHydra(b))
            }
        }
    } else {
        let j = l - 1
        while (stack[j][0] >= a[0]) {
            --j
        }
        let b = copyHydra(stack[j])
        if(!lifting){
            b[0] = a[0] - 1
        }
        let delta=(a[0]-b[0]-1)*lifting
        let c = stack[l - 2]
        for (let i = 0; i < fs; ++i) {
            c[c.length - 1] = copyLifting(b,delta*(i+1),b[0])
            c = findTop2(c)
        }
        c.pop()
    }
    return h1
}
function realexpandHydra(seq, fs, lifting) {
    h = readHydra(seq)
    l = writeHydra(expandHydra(h, fs,lifting))
    return l.slice(3, l.length - 1)
}
notations.push(
    {
        'name': (_) => { return '0-Hydra' },
        'author': 'Someone',
        'mode': (mode) => { return mode == '0H' },
        'description': '"0H":The 0-Hydra Mode(p0(#+1)=p0(#)*ω, the limit is ε_0).',
        'expand': realexpandHydra,
        'limit': (fs, _) => {
            let res = '0'
            for (let i = 0; i < fs + 1; ++i) {
                res = 'p0(' + res + ')'
            }
            return res
        }
    }
)
notations.push(
    {
        'name': (_) => { return 'Buchholz Hydra' },
        'author': 'Buchholz?',
        'mode': (mode) => { return mode == 'BH' },
        'description': '"BH":The Buchholz Hydra Mode(pk+1 finds pk and iterate, the limit is BO).',
        'expand': (seq,fs,_)=>realexpandHydra(seq,fs,false),
        'limit': (fs, _) => {
            let res = '0'
            for (let i = 0; i < fs + 1; ++i) {
                res = 'p' + (fs - i).toString() + '(' + res + ')'
            }
            return res
        }
    }
)
notations.push(
    {
        'name': (_) => { return 'LPrSS Hydra' },
        'author': 'Someome',
        'mode': (mode) => { return mode == 'LH' },
        'description': '"LH":The LPrSS Hydra Mode(pk finds px(x<k) but terms between them will "ascend", the limit is SDO).',
        'expand': (seq,fs,_)=>realexpandHydra(seq,fs,true),
        'limit': (fs, _) => {
            return 'p0(p'+(fs+1).toString()+'(0))'
        }
    }
)
