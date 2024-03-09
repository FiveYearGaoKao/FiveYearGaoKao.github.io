function expandSmallY(seq, fs, mode) {    //展开-5-Y~-2-Y
    if (mode > -5 && seq[seq.length - 1] <= 1) {
        seq.pop()
        return seq
    } else {
        if (mode > -4) {
            seq[seq.length - 1] -= 1
            b = seq[seq.length - 1]
            return seq.concat(new Array(fs).fill(mode > -3 ? b : 1))
        } else {
            return [-1]
        }
    }
}
function expandRidiculousY(seq,fs){    //展开奇异搞笑记号
    if(seq[seq.length-1]<=1){
        seq.pop()
        return seq
    }else{
        let l=seq.length
        let r=(seq[l-1]<=seq[l-2])?2:1
        let res=seq.concat(new Array(r*fs-1))
        res[l-1]=res[l-1]-1
        for(let i=0;i<r*fs;++i){
            res[l-1+i]=res[l-1-(i%r)]
        }
        return res
    }
}
function expandPrSS(seq, fs, lifting = false,forcedbr=null) {    //-1-Y、PrSS和LPrSS
    if (seq[seq.length - 1] <= 1) {
        seq.pop()
        return seq
    } else {
        seq[seq.length - 1] -= 1
        b = seq[seq.length - 1]
        r = seq.length - 2
        while (r >= 0 && seq[r] > b) {    //计算坏根
            --r
        }
        if (r < 0) {
            return -1
        }
        if(forcedbr>=0)r=forcedbr
        res = new Array(seq.length + (seq.length - r - 1) * fs)
        j = 0
        count = 0
        dif = (lifting ? b - seq[r] : 0)
        for (let i = 0; i < res.length; ++i) {
            res[i] = seq[j] + dif * count
            ++j
            if (j >= seq.length) {
                j = r + 1
                ++count
            }
        }
        return res
    }
}
function expandHPrSS(seq, fs) {    //HPrSS
    if (seq[seq.length - 1] <= 1) {
        seq.pop()
        return seq
    } else {
        let parents = new Array(seq.length)    //父项序列
        let difs = new Array(seq.length)    //阶差序列
        for (let i = 0; i < seq.length; ++i) {
            let j = i
            while (j >= 0 && seq[j] >= seq[i]) {
                --j
            }
            parents[i] = j
            difs[i] = j < 0 ? seq[i] : (seq[i] - seq[j])
        }
        if (difs[seq.length - 1] <= 1) {
            return expandPrSS(seq, fs)
        } else {
            let r = seq.length - 1
            while (difs[r] >= difs[seq.length - 1]) {
                r = parents[r]
            }
            seq[seq.length - 1] -= 1
            difs[seq.length - 1] -= 1
            res = new Array(seq.length + (seq.length - r - 1) * fs)
            j = 0
            count = 0
            for (let i = 0; i < res.length; ++i) {
                let k = parents[j]
                res[i] = difs[j] + (k >= 0 ? res[(k < r ? k : i + k - j)] : 0)
                ++j
                if (j >= seq.length) {
                    j = r + 1
                }
            }
            return res
        }
    }
}
function Randomexpand(seq,fs){    //随机展开
    if (seq[seq.length - 1] <= 1) {
        seq.pop()
        return seq
    } else {
        seq[seq.length - 1] -= 1
        b = seq[seq.length - 1]
        r = seq.length - 2
        while (r >= 0 && seq[r] > b) {    //计算坏根
            --r
        }
        if (r < 0) {
            return -1
        }
        res = new Array(seq.length + (seq.length - r - 1) * fs)
        j = 0
        count = 0
        dif = b - seq[r]
        quotient=b/seq[r]
        for (let i = 0; i < res.length; ++i) {
            res[i] = randInt(Math.max(1,seq[j]-dif*count),Math.max(seq[j]*Math.pow(quotient,count),seq[j] + dif * count))
            ++j
            if (j >= seq.length) {
                j = r + 1
                ++count
            }
        }
        return res
    }
}

notations.push(
    {
        hidden:true,
        password:'Ø',
        name: '-5-Y Sequence',
        author: 'Nobody',
        abbr:'-5',
        description: '"-5":The -5-Y Sequence Mode(It can\'t expand anything).',
        expand(a, fs) { return expandSmallY(a, fs, -5) },
        expandLimit() { return '-1' }
    }
)
notations.push(
    {
        hidden:true,
        password:'111111',
        name: '-4-Y Sequence',
        abbr:'-4',
        description: '"-4":The -4-Y Sequence Mode(It can only expand sequences of "1"s, and the limit is ω).',
        expand(a, fs) { return expandSmallY(a, fs, -4) },
        expandLimit(fs) { return new Array(fs + 1).fill(1) }
    }
)
notations.push(
    {
        name: '-3-Y Sequence',
        abbr:'-3',
        description: '"-3":The -3-Y Sequence Mode(k+1=k,1,1,1,..., and the limit is ω^2).',
        expand(a, fs) { return expandSmallY(a, fs, -3) },
        expandLimit(fs) { return [1, fs + 1] }
    }
)
notations.push(
    {
        name: '-2-Y Sequence',
        abbr:'-2',
        description: '"-2":The -2-Y Sequence Mode(k+1=k,k,k,..., and the limit is ω^ω).',
        expand(a, fs) { return expandSmallY(a, fs, -2) },
        expandLimit(fs) { return [1, fs + 1] }
    }
)
notations.push(
    {
        name: 'Extended -2-Y Sequence',
        author: 'FiveYearGaoKao',
        abbr:'ex-2',
        description: '"ex-2":The Extended -2-Y Sequence Mode(a,b+1=a,b,a,b,...if a>b, otherwise a,b+1=a,b,b,b,... The limit is ω^ω).',
        expand:expandRidiculousY,
        expandLimit(fs) { return [1, fs + 1] }
    }
)
notations.push(
    {
        name: 'Primitive Sequence System',
        author: 'Bashicu',
        abbr:'P',
        description: '"P":The PrSS Mode(Primitive Sequence System, the limit is ε_0).',
        expand(a, fs) { return expandPrSS(a, fs, false) },
        expandLimit(fs) {
            let res = []
            for (let i = 1; i <= fs + 1; ++i)res.push(i)
            return res
        }
    }
)
notations.push(
    {
        name: 'Address Notation',
        abbr:'-1',
        description: '"-1":The -1-Y Sequence Mode(Also known as Address Notation, the limit is ε_0).',
        expand(a, fs) { return expandPrSS(a, fs, false) },
        expandLimit(fs) { return [1, fs + 1] }
    }
)
notations.push(
    {
        name: 'Long Primitive Sequence System',
        abbr:'L',
        description: '"L":The LPrSS Mode(Long PrSS, the limit is φ(ω,0)).',
        expand(a, fs) { return expandPrSS(a, fs, true) },
        expandLimit(fs) { return [1, fs + 1] }
    }
)
notations.push(
    {
        name: 'Hyper Primitive Sequence System',
        author: 'Bashicu',
        abbr:'H',
        description: '"H":The HPrSS Mode(Hyper PrSS, the limit is BO).',
        expand: expandHPrSS,
        expandLimit(fs, _) { return [1, fs + 1] },
    }
)
notations.push(
    {
        hidden:true,
        password:'Play like you never did before',
        name: 'Random Sequence System',
        author: 'Random',
        abbr: 'RAN',
        description: '"RAN":The rAnD0m sEqUEn(e sYSτeM Mode, the limit is MH5IQ08/Pz8=',
        expand: Randomexpand,
        expandLimit(fs, _) { return [1, randInt(fs+1,3*fs+3)] },
    }
)