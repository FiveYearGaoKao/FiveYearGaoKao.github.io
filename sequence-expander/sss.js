//急序列和含非递归序数的-1-Y
//内部结构均化为括号形式
function expandSSS(seq,fs){
    //Code Inspired by Hyp_Cos
    if (seq[seq.length - 1] <= 0) {
        seq.pop()
        return seq
    }
    let l=seq.length-1
    let r=l
    while(seq[r]>=seq[l])--r
    let badRoot=r
    let badValue=seq[r]
    let subseq1=seq.slice(badRoot).map(x=>x-seq[badRoot])
    while(r>0){
        --r
        if(seq[r]<=badValue){
            badValue=Math.min(seq[r],badValue)
            let subseq2=seq.slice(r).map(x=>x-seq[r])
            if(lexOrder(subseq1,subseq2)>0)break 
        }
    }
    let res = new Array(l+1 + (l-r) * fs)
    seq[l]-=1
    let j = 0
    let count = 0
    let dif = seq[l] - seq[r]
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
function readSTPrSS(str){
    return normalizeSTPrSS(JSON.parse('['+str.replaceAll('(','[').replaceAll(')',']')+']'))
}
function writeSTPrSS(seq,data){
    res=(data.outputStyle==1)?normalizeSTPrSS(seq):readablizeSTPrSS(seq)
    return res.map(x=>(typeof(x)=='number'?x.toString():('('+writeSTPrSS(x,data)+')'))).join(',')
}
function compareSTPrSS(s1,s2){
    if(typeof(s1)=='number')s1=new Array(s1).fill(0)
    if(typeof(s2)=='number')s2=new Array(s2).fill(0)
    return lexOrder(s1,s2,null,compareSTPrSS)
}
function stprssSucc(x){
    let y=normalizeSTPrSS(x)
    return (y[y.length-1].length===0)
}
function stprssPredec(seq){    //前驱
    if(stprssSucc(seq)) return copyArray(seq.slice(0,seq.length-1))
}
function normalizeSTPrSS(seq){    //标准化
    return copyArray(typeof(seq)=='number'?new Array(seq).fill([]):seq.map(normalizeSTPrSS))
}
function readablizeSTPrSS(seq){    //可读化([0,0,...,0]=n)
    if(typeof(seq)=='number')return seq
    let res=seq.map(readablizeSTPrSS)
    if(res.every(x=>x===0))return res.length
    return res
}
function expandSTPrSS(seq,fs){
    seq=normalizeSTPrSS(seq)
    if (stprssSucc(seq)) {
        seq.pop()
        return seq
    }
    let last=seq
    let stack=[seq]
    while(!stprssSucc(last)){
        last=last[last.length-1]
        stack.push(last)
    }
    let n=stack.length-2
    let parent=stack[n].length-1
    while(compareSTPrSS(last,stack[n][parent])<=0){    //找父项
        if(parent>0){
            parent--
        }else{
            n--
            parent=stack[n].length-1
        }
    }
    let last2=stack[stack.length-2]
    last2[last2.length-1]=stprssPredec(last)
    let badPart=copyArray(stack[n].slice(parent+1))
    let dif=stack.length-2-n
    for(let i=0;i<fs;++i){
        for(let j=0;j<badPart.length;++j)last2.push(copyArray(badPart[j]))
        for(let j=0;j<dif;++j)last2=last2[last2.length-1]
    }
    return normalizeSTPrSS(seq)
}
notations.push(
    {
        name: 'Sudden Sequence System',
        author: 'Bashicu',
        abbr:'SSS',
        description: '"SSS":The Sudden Sequence System Mode(the limit is EBO).',
        expand:expandSSS,
        expandLimit(fs) {
            let res = []
            for (let i = 0; i <= fs ; ++i)res.push(i)
            return res
        }
    }
)
notations.push(
    {
        name: 'Transfinite -1-Y Sequence', 
        author: 'Someone',
        abbr:'T-1',
        description: '"T-1":Transfinite/Non-Recursive -1-Y Sequence Mode(the limit is EBO).',
        read: readSTPrSS,
        write: writeSTPrSS,
        compare: compareSTPrSS,
        isSucc: stprssSucc,
        expand: expandSTPrSS,
        expandLimit(fs, _) {
            let z=0
            for(let i=0;i<fs;++i)z=[z]
            return [0,z]
        },
        data:{
            outputStyle:['radio',['Output Style','Standard','Readable'],1]
        }
    }
)