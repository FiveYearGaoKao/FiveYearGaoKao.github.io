//各种矩阵的展开
function readMatrix(str) {    //从字符串读取矩阵
    s = str.substring(1, str.length - 1).split(')(')
    let l = s.length
    let rows = 1
    for (let i = 0; i < l; i++) {
        s[i] = s[i].split(',')
        rows = Math.max(rows, s[i].length)
    }
    for (let i = 0; i < l; i++) {
        for (let k = 0; k < rows; k++) {
            if (s[i].length <= k) {
                s[i].push(0)
            } else {
                s[i][k] = parseInt(s[i][k])
            }
        }
    }
    return s
}
function writeMatrix(mat) {    //矩阵化为字符串
    return '('+mat.map((x)=>{return x.join(',')}).join(')(')+')'
}
function expandBMS(s,fs,idealized=false){    //展开BMS
    let l=s.length
    let rows=s[0].length
    let parents=new Array(l)
    for(let i=0;i<l;i++){
        parents[i]=[]
    }
    for (let i = 0; i < rows; i++) {    // Calculate the parent
        for (let j = 0; j < l; j++) {
            let k = j
            while (k >= 0 && s[k][i] >= s[j][i]) {
                if (i == 0) {
                    k--
                } else {
                    k = parents[k][i - 1]
                }
            }
            parents[j].push(k)
        }
    }
    let res=[...s]
    res.pop()
    let x = -1
    while (s[l - 1][x+1] > 0) {
        x++
    }
    if (x>=0){    // Limit Ordinal, expand
        let badRoot = parents[l-1][x]
        let badLength = l-1-badRoot
        let ascValue = new Array(rows).fill(0)
        for(let i=0;i<x;i++){
            ascValue[i]=s[l-1][i]-s[badRoot][i]
        }
        let ascMat=new Array(badLength)
        for(let i=0;i<badLength;i++){    // Calculate the Ascension Value
            ascMat[i]=new Array(rows).fill(0)
        }
        for(let i=0;i<x;i++){    // Calculate the Ascension Matrix
            for(let j=0;j<badLength;j++){
                let k=j+badRoot
                while(k>badRoot+(idealized?1:0)){
                    k=parents[k][i]
                }
                ascMat[j][i]=((k==badRoot+(idealized?1:0))||(j==0)?1:0)
            }
        }console.log(ascMat)
        for(let i=1;i<=fs;i++){
            for(let j=badRoot;j<l-1;j++){
                let u=new Array(rows)
                for(let k=0;k<rows;k++){
                    u[k]=s[j][k]+ascValue[k]*i*ascMat[j-badRoot][k]
                }
                res.push(u)
            }
        }console.log(res)
    }
    return res
}
function expandCMS(s,fs){    //展开CMS
    //不会
}
function remove0(arr){    //去掉末尾的0
    let i=0
    while(i<arr.length&&arr[i]>0)++i
    return arr.slice(0,i)
}
function matrixOrder(a,b){    //比较两个矩阵
    return lexOrder(a,b,0,lexOrder(remove0(a),remove0(b)))
}
function matrixIsSucc(a){        //判断矩阵是否为后继
    return remove0(a[a.length-1]).length==0
}

notations.push(
    {
        name:'Bashicu Matrix System',
        author: 'Bashicu',
        abbr:'B',
        description: '"B":The BMS Mode(Bashicu Matrix System, the limit is SHO).',
        read:readMatrix,
        write:writeMatrix,
        compare:matrixOrder,
        isSucc:matrixIsSucc,
        expand(a, fs, data){return expandBMS(a,fs,data.idealized)},
        expandLimit(fs){return [new Array(fs+1).fill(0),new Array(fs+1).fill(1)]},
        data:{idealized:['checkbox','Remove "Upgrading Effect(probably wrong)"',false]}
    }
)
/*notations.push(
    {
        name:'Bashicu Matrix System 3.3',
        author: 'Bashicu',
        mode(mode){ return mode == 'IB' },
        description: '"IB":The IBMS Mode(BM3.3, the BMS "without upgrading", the limit is SHO).',
        read:readMatrix,
        write:writeMatrix,
        compare:matrixOrder,
        expand(a, fs){return expandBMS(a,fs,true)},
        expandLimit(fs){return [new Array(fs+1).fill(0),new Array(fs+1).fill(1)]}
    }
)*/