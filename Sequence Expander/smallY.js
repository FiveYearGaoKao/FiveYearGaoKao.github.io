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
            return -1
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
                r=parents[r]
            }
            seq[seq.length-1]-=1
            difs[seq.length-1]-=1
            res = new Array(seq.length + (seq.length - r - 1) * fs)
            j = 0
            count = 0
            for (let i = 0; i < res.length; ++i) {
                let k=parents[j]
                res[i] = difs[j]+(k>=0?res[(k<r?k:i+k-j)]:0)
                ++j
                if (j >= seq.length) {
                    j = r + 1
                }
            }
            return res
        }
    }
}