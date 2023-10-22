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
function expandPrSS(seq, fs, lifting = false) {    //-1-Y、PrSS和LPrSS
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
function realexpand(seq, fs, mode) {
    seq = seq.split(',').map((x) => parseInt(x) > 0 ? parseInt(x) : 1)
    mode = parseInt(mode)
    return expandSmallY(seq, fs, mode).join(',')
}
notations.push(
    {
        'name': (_) => { return '-5-Y Sequence' },
        'author': 'Nobody',
        'mode': (mode) => { return mode == '-5' },
        'description': '"-5":The -5-Y Sequence Mode(It can\'t expand anything).',
        'expand': realexpand,
        'limit':(_,__)=>{return '-1'}
    }
)
notations.push(
    {
        'name': (_) => { return '-4-Y Sequence' },
        'author': 'Someone',
        'mode': (mode) => { return mode == '-4' },
        'description': '"-4":The -4-Y Sequence Mode(It can only expand sequences of "1"s, and the limit is ω).',
        'expand': realexpand,
        'limit':(fs,_)=>{return new Array(fs+1).fill('1').join(',')}
    }
)
notations.push(
    {
        'name': (_) => { return '-3-Y Sequence' },
        'author': 'Someone',
        'mode': (mode) => { return mode == '-3' },
        'description': '"-3":The -3-Y Sequence Mode(k+1=k,1,1,1,..., and the limit is ω^2).',
        'expand': realexpand,
        'limit':(fs,_)=>{return '1,'+(fs+1).toString()}
    }
)
notations.push(
    {
        'name': (_) => { return '-2-Y Sequence' },
        'author': 'Someone',
        'mode': (mode) => { return mode == '-2' },
        'description': '"-2":The -2-Y Sequence Mode(k+1=k,k,k,..., and the limit is ω^ω).',
        'expand': realexpand,
        'limit':(fs,_)=>{return '1,'+(fs+1).toString()}
    }
)
notations.push(
    {
        'name': (_) => { return 'Primitive Sequence System' },
        'author': 'Bashicu',
        'mode': (mode) => { return mode == 'P' },
        'description': '"P":The PrSS Mode(Primitive Sequence System, the limit is ε_0).',
        'expand': (seq, fs, _) => {
            seq = seq.split(',').map((x) => parseInt(x) > 0 ? parseInt(x) : 1)
            return expandPrSS(seq, fs, false).join(',')
        },
        'limit':(fs,_)=>{
            let res='1'
            for(let i=2;i<=fs+1;++i){
                res+=(','+i.toString())
            }
            return res
        }
    }
)
notations.push(
    {
        'name': (_) => { return 'Address Notation' },
        'author': 'Someone',
        'mode': (mode) => { return mode == '-1' },
        'description': '"-1":The -1-Y Sequence Mode(Also known as Address Notation, the limit is ε_0).',
        'expand': (seq, fs, _) => {
            seq = seq.split(',').map((x) => parseInt(x) > 0 ? parseInt(x) : 1)
            return expandPrSS(seq, fs, false).join(',')
        },
        'limit':(fs,_)=>{return '1,'+(fs+1).toString()}
    }
)
notations.push(
    {
        'name': (_) => { return 'Long Primitive Sequence System' },
        'author': 'Someone',
        'mode': (mode) => { return mode == 'L' },
        'description': '"L":The LPrSS Mode(Long PrSS, the limit is φ(ω,0)).',
        'expand': (seq, fs, _) => {
            seq = seq.split(',').map((x) => parseInt(x) > 0 ? parseInt(x) : 1)
            return expandPrSS(seq, fs, true).join(',')
        },
        'limit':(fs,_)=>{return '1,'+(fs+1).toString()}
    }
)
notations.push(
    {
        'name': (_) => { return 'Hyper Primitive Sequence System' },
        'author': 'Bashicu',
        'mode': (mode) => { return mode == 'H' },
        'description': '"H":The HPrSS Mode(Hyper PrSS, the limit is BO).',
        'expand': (seq, fs, _) => {
            seq = seq.split(',').map((x) => parseInt(x) > 0 ? parseInt(x) : 1)
            return expandHPrSS(seq,fs).join(',')
        },
        'limit':(fs,_)=>{return '1,'+(fs+1).toString()}
    }
)