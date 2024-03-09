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
function writeKPHydra(hydra){
    return ('(' + (hydra.length > 1 ? hydra.slice(1).map(writeKPHydra).join('') : '') + ')')
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
function hydraSucc(h){    //判断hydra是否为后继
    return h[h.length-1].length<=1&&h[h.length-1][0]==0
}
function copyLifting(hydra, delta = 0, lb = 0) {    //带提升的复制
    //LPrSS Hydra中某一项提升当且仅当它大于坏根且从坏根到它的路上没有比坏根小的数
    return [hydra[0] + delta * (hydra[0] >= lb ? 1 : 0)].concat(hydra.slice(1).map((x) => { return copyLifting(x, (x[0] > lb ? delta : 0), lb) }))
}
function findTop2(h) {
    let a = h
    while (a.length > 1 && a[a.length - 1].length > 1) {
        a = a[a.length - 1]
    }
    return a
}
function expandHydra(h, fs, lifting = false) {    //展开Hydra
    h1 = copyArray(h)
    let stack = [h1]
    let a = h1
    while (a.length > 1) {
        a = a[a.length - 1]
        stack.push(a)
    }
    l = stack.length
    if (a[0] == 0) {    //末项为p0，直接展开
        let b = stack[l - 2]
        b.pop()
        if (l >= 3) {
            for (let i = 0; i < fs; ++i) {
                stack[l - 3].push(copyArray(b))
            }
        }
    } else {
        let j = l - 1
        while (stack[j][0] >= a[0]) {
            --j
        }
        let b = copyArray(stack[j])
        if (!lifting) {
            b[0] = a[0] - 1
        }
        let delta = (a[0] - b[0] - 1) * lifting
        let c = stack[l - 2]
        for (let i = 0; i < fs; ++i) {
            c[c.length - 1] = copyLifting(b, delta * (i + 1), b[0])
            c = findTop2(c)
        }
        c.pop()
    }
    return h1
}
function expandLMN(h, fs, n = 2) {    //展开LMN
    h1 = copyArray(h)
    let stack = [h1]
    let a = h1
    while (a.length > 1) {
        a = a[a.length - 1]
        stack.push(a)
    }
    l = stack.length
    if (a[0] == 0) {    //末项为p0，直接展开
        let b = stack[l - 2]
        b.pop()
        if (l >= 3) {
            for (let i = 0; i < fs; ++i) {
                stack[l - 3].push(copyArray(b))
            }
        }
    } else {
        let j = l - 1
        let thisLayer = a
        let layersFound = 0
        while (layersFound < n && j > 0) {    //向外找层
            --j
            if (compareHydra(stack[j], thisLayer) < 0) {
                thisLayer = stack[j]
                ++layersFound
            }
        }
        let x = copyArray(stack[j + 1])
        let c = stack[l - 2]
        for (let i = 0; i < fs; ++i) {
            c[c.length - 1] = copyArray(x)
            c = findTop2(c)
        }
        c.pop()
    }
    return h1
}
function writeHydra1(a) {
    l = writeHydra(a)
    return l.slice(3, l.length - 1)
}
function writeKPHydra1(a) {
    l = writeKPHydra(a)
    return l.slice(1, l.length - 1)
}

notations.push(
    {
        name:'Kirby-Paris Hydra',
        author: 'Laurie Kirby & Jeff Paris',
        abbr:'0H',
        description: '"0H":The Kirby-Paris Hydra Mode(p0(#+1)=p0(#)*ω, the limit is ε_0).',
        read:readHydra,
        write:writeKPHydra1,
        compare:compareHydra,
        isSucc:hydraSucc,
        expand(a,fs){return expandHydra(a,fs,false)},
        expandLimit(fs, _){
            let res = [0]
            for (let i = 1; i < fs + 1; ++i) {
                res = [0,res]
            }
            return [0,res]
        }
    }
)
notations.push(
    {
        name:'Buchholz Hydra',
        author: 'Buchholz?',
        abbr:'BH',
        description: '"BH":The Buchholz Hydra Mode(pk+1 finds pk and iterate, the limit is BO).',
        read:readHydra,
        write:writeHydra1,
        compare:compareHydra,
        isSucc:hydraSucc,
        expand(a,fs){return expandHydra(a,fs,false)},
        expandLimit(fs, _){
            let res = [fs]
            for (let i = 1; i < fs + 1; ++i) {
                res = [fs-i,res]
            }
            return [0,res]
        }
    }
)
notations.push(
    {
        name:'M Notation(Not Complete)' ,
        author: 'test_alpha0',
        abbr:'M',
        description: '"M":The M notation Mode(2-dropping hydra, the limit is SSO).',
        read:readHydra,
        write:writeHydra1,
        compare:compareHydra,
        isSucc:hydraSucc,
        expand(a,fs){return expandLMN(a,fs)},
        expandLimit(fs, _){
            let res = [1]
            for (let i = 0; i < fs ; ++i) {
                res = [1,res]
            }
            return [0,[0,[0,res]]]
        }
    }
)
notations.push(
    {
        name:'LPrSS Hydra',
        author: 'Someome',
        abbr:'LH',
        description: '"LH":The LPrSS Hydra Mode(pk finds px(x<k) but terms between them will "ascend", the limit is SDO).',
        read:readHydra,
        write:writeHydra1,
        compare:compareHydra,
        isSucc:hydraSucc,
        expand(a,fs){return expandHydra(a,fs,true)},
        expandLimit(fs, _){return [0,[0,[fs+1]]]}
    }
)