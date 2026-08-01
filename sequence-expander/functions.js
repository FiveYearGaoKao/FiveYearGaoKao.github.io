//一些写记号时可能用得上的函数
function numCmp(n1,n2){    //比较两个数字的大小
    return (n1>n2)?1:(n1<n2?-1:0)
}
function fromGt(gt){    //从大于函数生成标准大小比较函数
    return function(n1,n2){
        return Number(gt(n1,n2))-Number(gt(n2,n1))
    }
}
function toGt(normal){  //从标准大小比较函数生成大于函数
    return function(n1,n2){return normal(n1,n2)==1}
}
function lexOrder(seq1, seq2, _data,compare=numCmp) {    //字典序比较，data一般来说空着就行
    for (let i = 0; i < seq1.length; ++i) {
        let a = seq1[i]
        let b = seq2[i]
        if (b == null) {
            return 1
        } else {
            let res=compare(a,b)
            if(res!=0){
                return res
            }
        }
    }
    return (seq2.length > seq1.length) ? -1 : 0
}
function arrayOrder(arr1,arr2,_data,compare=numCmp){    //线性数阵比较，先比较长度再按字典序比较
    let a=numCmp(arr1.length,arr2.length)
    return (a==0?lexOrder(arr1,arr2,_data,compare):a)
}
function seqtoArray(seq){    //序列转化为列表
    return seq.split(',').map((x) => parseInt(x) >= 0 ? parseInt(x) : 1)
}
function arraytoSeq(arr){    //列表转化为序列
    return arr.join(',')
}
function stdIsSucc(a){    //判断是否为后继
    return a[a.length-1]==1
}
function randInt(a,b){    //随机数
    return Math.floor(a+(b-a)*Math.random())
}
function copyArray(seq){    //复制树状数组
    return ((typeof(seq)=='number')?seq:seq.map(x=>copyArray(x)))
}
function isNumber(x){
    return (typeof(x)==='number')
}