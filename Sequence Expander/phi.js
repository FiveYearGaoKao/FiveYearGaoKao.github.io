//φ好————62XXY
//只做有限元的
//格式:φ用[1,x1,x2,...,xn]，+用[0,x1,x2,...,xn]
//其实φ符号可以不用，控制字符只有()和逗号，两个括号连写默认加号

function readPhi(str) {    //读取字符串
    let stack = [[0]]
    let tmp = 0 //用于存放十进制数字
    let i = 0
    let l = str.length
    while (i < l) {
        let a = str[i]
        let top = stack[stack.length - 1]
        if (a == '(') {
            if (top[0] == 1) {
                stack.push([0])
            }
            stack.push([1])
            tmp = 0
        } else if (a == ')' && stack.length > 1) {
            if (top[0] == 1) {
                top.push(tmp)
            } else {
                if (tmp > 0) top.push(tmp)
                k = stack.pop()
                stack[stack.length - 1].push(k)
            }
            k = stack.pop()
            stack[stack.length - 1].push(k)
            tmp = 0
        } else if (a == ',' && stack.length > 1) {
            if (top[0] == 1) {
                top.push(tmp)
            }
            else {
                k = stack.pop()
                if (tmp > 0) k.push(tmp)
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
    if (tmp > 0) stack[stack.length - 1].push(tmp)
    while (stack.length > 1) {
        k = stack.pop()
        stack[stack.length - 1].push(k)
    }
    return stack[0]
}
function writePhi(phi) {    //将phi函数化为字符串
    return typeof (phi) == 'number' ? phi.toString() :
        (phi[0] ? ('φ(' + phi.slice(1).map(writePhi).join(',') + ')') : phi.slice(1).map(writePhi).join('+'))
}
function phiSucc(phi) {    //判断phi函数是否为后继
    return typeof (phi) == 'number' ? (phi > 0) :
        (phi[0] ? (phi.length <= 2 && !phi[1]) : phiSucc(phi[phi.length - 1]))
}
function phiPredec(phi) {    //如果是后继，返回它的前驱
    if (typeof (phi) == 'number') return phi - 1
    let phi1 = normalizePhi(phi)
    if (phi1[0] == 1) return 0
    else {
        let l = phi1.length
        if (phi1[l - 1] == 1 || (phi1[l - 1].length == 2 && phi1[l - 1][1] == 0)) {
            phi1.pop()
        } else {
            phi1[l - 1] -= 1
        }
        if (phi1.length == 1) return 0
        return phi1
    }
}
function fpLevelCheck(p1,p2,n){    //判断p2能否折叠p1以第n位作参数的不动点
    for(let i=1;i<=n;++i){
        if(p2[p2.length-i]!==0)return false
    }
    let p11=copyArray(p1)
    p11[p11.length-n]=0
    p11[p11.length]
}

function normalizePhi(phi) {    //标准化，去除多余的前导0,同时将φ表达式中所有正整数用φ(0)*n代替
 /*   if(typeof(phi)=='number'){
        let res=new Array(phi+1)
        res[0]=0
        for(let i=1;i<phi+1;++i)res[i]=[1,0]
        return res
    }else{
        if(phi[0]===0){
            
        }else{

        }
    }*/
    if (typeof (phi) == 'number') return phi
    let res = [phi[0]]
    let hasNonzero = false
    for (let i = 1; i < phi.length; ++i) {
        let n = normalizePhi(phi[i])
        if (n !== 0 || hasNonzero) {
            res.push(n)
            hasNonzero = true
        }
    }
    if (res.length == 1) return phi[0]
    else return res
}
function expandPhi(phi, fs) {    //展开phi函数
    if (phi == 0) return 0
    if (phiSucc(phi)) return phiPredec(phi)    //后继
    else {    //极限
        phi = normalizePhi(phi)
        if (phi[0] == 0) {    //为若干个phi函数之和
            return [...phi.slice(0, phi.length - 1), expandPhi(phi[phi.length - 1], fs)]
        } else {    //一个phi函数
            let l = phi.length
            if (l == 2) {    //一元phi函数
                if (!phiSucc(phi[1])) {
                    return [1, expandPhi(phi[1], fs)]
                } else {
                    if (fs == 0) return 0
                    pred = phiPredec(phi[1])
                    if (pred == 0) return fs
                    else {
                        let res = [0]
                        for (let i = 0; i < fs; ++i) res.push([1, pred])
                        return res
                    }
                }
            } else {    //多元
                let j = l - 2
                let phi1 = normalizePhi(phi)
                while (phi[j] === 0) --j    //找到第一个不为0的项
                if (!phiSucc(phi[j])) {
                    if (phi[l-1]!==0&&!phiSucc(phi[l-1])) {
                        phi1[l-1]=expandPhi(phi[l-1], fs)
                    } else {
                        phi1[j] = expandPhi(phi[j], fs)
                        if(phi[l-1]!==0){
                            let phi2 = normalizePhi(phi)
                            phi2[l-1]=phiPredec(phi2[l-1])
                            phi1[l-1]=[0,phi2,1]
                        }
                    }
                } else {
                    if (phi[l-1]!==0&&!phiSucc(phi[l-1])) {
                        phi1[l-1]=expandPhi(phi[l-1], fs)
                    }else{
                        let iter = normalizePhi(phi)
                        iter[l-1]=0
                        iter[j]=phiPredec(iter[j])
                        if(phi[l-1]!==0){
                            phi1[l-1]=phiPredec(phi1[l-1])
                            phi1=[0,normalizePhi(phi1),1]
                        }else{
                            phi1=normalizePhi(iter)
                        }
                        for(let i=0;i<fs;++i){
                            let tmp=copyArray(iter)
                            tmp[j+1]=phi1
                            phi1=normalizePhi(tmp)
                        }
                    }
                }
                return normalizePhi(phi1)
            }
        }
    }
}
notations.push(
    {
        name: 'Veblen Function(finite variable)',
        author: 'Veblen',
        abbr:'V',
        description: '"V":The Veblen\'s φ Function Mode(the limit is SVO).',
        read: readPhi,
        write: writePhi,
        compare: 'placeholder',//TODO
        isSucc: phiSucc,
        expand: expandPhi,
        expandLimit(fs, _) {
            return new Array(fs+2).fill(0).fill(1,0,2)
        }
    }
)