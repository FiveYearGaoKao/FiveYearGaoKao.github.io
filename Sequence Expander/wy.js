//最重要的n-Y部分
//这里的序数都是从左数第n位为ω^n的
function ordPlus(ord1, ord2) {    //两个w进制数字的加法(ord1+ord2)
    res = new Array(Math.max(ord1.length, ord2.length)).fill(0)
    for (let i = res.length - 1; i >= 0; --i) {
        if (i >= ord2.length - 1 && i < ord1.length) {
            res[i] += ord1[i]
        }
        if (i <= ord2.length - 1) {
            res[i] += ord2[i]
        }
    }
    return res
}
function ordMinus(ord1, ord2) {    //两个w进制数字的减法(ord1-ord2)
    if (ord1.length < ord2.length) {
        return [-1]
    }
    t = true
    res = new Array(ord1.length).fill(0)
    for (let i = res.length - 1; i >= 0; --i) {
        if (t) {
            if (ord1[i] > ord2[i] || i >= ord2.length) {
                t = false
                res[i] = ord1[i] - (i < ord2.length ? ord2[i] : 0)
            } else {
                res.pop()
            }
        } else {
            res[i] = ord1[i]
        }
    }
    return res
}
function ordCmp(ord1, ord2) {    //两个w进制数字比大小
    if (ord1.length > ord2.length) {
        return 1
    } else {
        for (let i = ord2.length - 1; i >= 0; --i) {
            if (i >= ord1.length || ord2[i] > ord1[i]) {
                return -1
            }
            if (ord2[i] < ord1[i]) {
                return 1
            }
        }
        return 0
    }
}
function ordMin(ord1, ord2) {    //求两个w进制数字的最小值
    return (ordCmp(ord1, ord2) >= 0 ? ord2 : ord1)
}
function ordMax(ord1, ord2) {    //求两个w进制数字的最大值
    return (ordCmp(ord1, ord2) >= 0 ? ord1 : ord2)
}
function ord(n) {    //w^n
    res = new Array(n + 1).fill(0)
    res[n] = 1
    return res
}
class Node {    //山脉图的节点
    constructor(value, x, y) {
        this.value = value
        this.x = x
        this.y = y
        this.up = null
        this.down = null
        this.left = null
        this.right = []
        this.isMagma = false
    }
}
function connectH(n1, n2) {    //连一条从n1右上到n2的左腿
    n1.right.push(n2)
    n2.left = n1
}
function connectV(n1, n2) {    //连一条从n1下到n2的右腿
    if (n2.up != null) {
        n2.up.down = n1
    }
    n1.down = n2
    n2.up = n1
}
function connect(mt2, newNode, cd, tops, roots, i) {    //作出新边时的一整套连接操作
    if (ordCmp(newNode.y, [0]) == 0) {
        mt2[newNode.x] = newNode
    }
    connectH(cd, newNode)
    if (ordCmp(tops[i].y, newNode.y) >= 0) {
        connectV(newNode, roots[i])

    } else {
        connectV(newNode, tops[i])
    }
    tops[i] = newNode
}
function magma(node) {    //从一个节点开始，递归地作magma边
    for (let i = 0; i < node.right.length; ++i) {
        let nd = node.right[i].down
        if (nd != null && ordCmp(nd.y, node.y) == 0) {
            nd.isMagma = true
            magma(nd)
        }
    }
}
function findNode(nd, y, eq = true) {    //从某个节点开始往上找行标不大于y的最上元
    let x = nd
    while (x.up != null && ordCmp(x.up.y, y) + (eq ? 0 : 1) <= 0) {
        x = x.up
    }
    return x
}
function generateMountain(seq) {    //由序列生成基础山脉
    let mt = new Array(seq.length)
    for (let i = 0; i < seq.length; ++i) {
        let nd = new Node(seq[i], i, [0])
        let base = new Node(-1, i, [-1])
        mt[i] = nd
        connectV(nd, base)
        if (i > 0) {
            connectH(mt[i - 1].down, nd)
        }
    }
    return mt
}
function copyMountain(seq) {    //复制一份基础山脉
    let mt = new Array(seq.length)
    for (let i = 0; i < seq.length; ++i) {
        let nd = new Node(seq[i].value, i, [0])
        let base = new Node(-1, i, [-1])
        mt[i] = nd
        connectV(nd, base)
        if (i > 0) {
            connectH(mt[seq[i].left.x].down, nd)
        }
    }
    return mt
}
function drawMountain(seq, n = -1) {    //画山脉图
    mt = copyMountain(seq)
    for (let i = 0; i < seq.length; ++i) {
        let nd1 = mt[i]
        while (true) {
            let parent = nd1
            while (parent != null && parent.value >= nd1.value) {
                parent = parent.left
                while (parent != null && parent.up != null && (ordCmp(parent.up.y, nd1.y) <= 0)) {
                    parent = parent.up
                }
            }
            if (parent == null) {
                break
            } else {
                let dy = ordMinus(nd1.y, parent.y).length
                if (n >= 0) {
                    dy = Math.min(dy, n)
                    if (n != 0 && dy >= n) {
                        break
                    }
                }
                let newy = ordPlus(nd1.y, ord(dy))
                let newNode = new Node(nd1.value - parent.value, i, newy)
                connectH(parent, newNode)
                connectV(newNode, nd1)
                nd1 = newNode
            }
        }
    }
    return mt
}
function displayMountain(mt, debug = false) {    //可视化山脉
    let row = [0]
    let realRow = 0
    let running = true
    let idx = new Array(mt.length)
    let html = '<table>\n'
    for (let i = 0; i < mt.length; ++i) {
        idx[i] = mt[i]
    }
    let val = new Array(mt.length)
    while (running) {
        running = false
        let row0 = null
        let rowText = [...row].reverse().join(',')
        let res = "row " + rowText + ':'
        while (res.length < 16) {
            res += ' '
        }
        res += '\t'
        for (let i = 0; i < mt.length; ++i) {
            if (idx[i] == null || ordCmp(row, idx[i].y) < 0) {
                val[i] = 0
            } else {
                running = true
                val[i] = idx[i].value
                idx[i] = idx[i].up
            }
            if (idx[i] != null) {
                if (row0 != null) {
                    row0 = ordMin(row0, idx[i].y)
                } else {

                    row0 = idx[i].y
                }
            }
        }
        if (row0 == null) {
            row0 = ordPlus(row, [1])
        }
        row = row0
        res += val.join('\t')
        if (running) {
            html += "<tr>\n"
            html += ("<td class='a'>" + rowText + "</td>\n")
            for (let j = 0; j < val.length; ++j) {
                html += ("<td class='b" + (realRow % 2 == 0 ? 'e' : 'o') + "'>" + (val[j] == 0 ? '' : val[j].toString()) + "</td>\n")
            }
            html += "<tr>\n"
            if (debug) {
                console.log(res)
            }
        }
        ++realRow
    }
    html += '</table>'
    return html
}
function showMountain(mt, debug = false) {
    if (document.forms['settings']['mt'].value == '1') {
        document.getElementById('test').innerHTML += (displayMountain(mt, debug) + '\n<br>\n')
    }
}
function expandwYMountain(seq, fs, n = -1, debug = false) {    //展开序列
    let version = 0
    let mt1 = drawMountain(seq, n)
    let mt2
    showMountain(mt1, debug)
    if (seq[seq.length - 1].value <= 1) {
        seq.pop()
        mt2 = drawMountain(seq, n)
        showMountain(mt2, debug)
        return seq
    } else {
        seq[seq.length - 1].value -= 1
        mt2 = drawMountain(seq, n)
        let nd = mt1[seq.length - 1]
        let idx = new Array(seq.length)
        let iterate = false
        let diagonal
        let diagonal2
        for (let i = 0; i < seq.length; ++i) {
            nd = mt1[i]
            while (nd.up != null) {
                nd = nd.up
            }
            idx[i] = nd
        }
        if (n > 0) {
            diagonal = copyMountain(idx)
            if (idx[idx.length - 1].value > 1) {
                iterate = true
                diagonal2 = expandwYMountain(diagonal, fs, n)
            }
        }
        if (iterate) {
            bl = Math.round((diagonal2.length - seq.length) / fs)
            root = idx[seq.length - 1 - bl]
            top1 = new Node(1, seq.length - 1, ord(n))
        } else {
            let xd=mt2[idx.length-1]
            while(xd.up!=null){
                xd=xd.up
            }
            idx[idx.length-1]=xd
            root = nd.left    //根元素
            top1 = nd    //最上面的“顶元素”
        }
        bl = seq.length - 1 - root.x    //复制部分长度
        rc = []   //根列元素
        nd = mt2[root.x].down
        while (nd != null && ordCmp(root.y, nd.y) >= 0) {
            magma(nd)
            rc.push(nd)
            if (nd.up == null) {
                break
            }
            nd = nd.up
        }
        rc.push(top1)
        for (let i = 0; i < fs; ++i) {    //基本列递增
            dis = (i + 1) * bl    //本次“平移”的距离
            let nd = mt2[mt2.length - 1].down
            ir = 1
            yr = rc[ir].y
            ref = new Array(rc.length - 1)    //参考元素
            while (nd != null) {    //做出参考元素
                if (nd.up == null || (ordCmp(nd.up.y, yr) >= 0 || (n == 0)/*&& ((n >= 0) ? (ordCmp(nd.up.y, nyr) >= 0) : true)*/)) {
                    //这里曾经有一个bug，删掉注释中的一个括号就会把w-Y变成0-Y
                    ref[ir - 1] = nd
                    ++ir
                    if (ir >= rc.length) {
                        break
                    }
                    yr = rc[ir].y
                    nyr = ordPlus(rc[ir - 1].y, ord(n))
                }
                nd = nd.up
            }
            tops = new Array(bl)    //新增列的最顶元
            roots = new Array(bl)    //新增列的最底元
            buttoms = new Array(bl).fill(null)
            for (let j = 0; j < bl; ++j) {
                tops[j] = new Node(-1, mt2.length, [-1])
                roots[j] = new Node(-1, mt2.length, [-1])
                mt2.push(new Node(-2, mt2.length, [0]))
            }
            if (version == 1) {    //尝试减少计算量，但失败了
                for (let j = 0; j <= bl; ++j) {    //对于复制部分的每一列，进行操作
                    let nd = mt2[root.x + j].down
                    let cd = mt2[mt2.length - 1 - bl + j].down
                    let ir = 0
                    let thisRc = rc[ir]
                    let thisRef = ref[ir]
                    while (nd != null) {
                        if (j != 0) {
                            let nd1 = nd.up
                            while (nd1 != null && nd1.left.x < root.x) {    //可能需要补充第二类eruption边
                                let dy = ordMinus(nd1.y, thisRc.y)
                                let newNode = new Node(-1, cd.x, ordPlus(thisRef.y, dy))
                                connectH(nd1.left, newNode)
                                connectV(newNode, cd)
                                tops[j - 1] = newNode
                                nd1 = nd1.up
                            }
                        }
                        if (j != bl) {    //如果不是最后一行，就从该节点复制出边
                            for (let k = 0; k < nd.right.length; ++k) {    //遍历每一条左腿
                                let thisNode = nd.right[k]
                                let dx = thisNode.x - nd.x
                                if (thisNode.isMagma) {    //碰到magma元素，做出wildfire边
                                    let newNode = new Node(-1, thisNode.x + dis, [...thisNode.y])
                                    connect(mt2, newNode, cd, tops, roots, j + dx - 1)
                                } else {    //碰到非magma元素，做出第一类eruption边
                                    let dy = ordMinus(thisNode.y, thisRc.y)
                                    let newNode = new Node(-1, thisNode.x + dis, ordPlus(thisRef.y, dy))
                                    let md = cd
                                    while (md.up != null && md.up.y < newNode.y) {
                                        md = md.up
                                    }
                                    connect(mt2, newNode, md, tops, roots, j + dx - 1)
                                }
                                if (thisNode.down.isMagma) {    //下方为magma元素，做出magma边
                                    let md = cd
                                    while (ordCmp(md.y, thisRef.y) < 0) {    //对中间的所有元素进行循环
                                        let dy = ordMinus(md.up.y, md.y)
                                        for (let l = 0; l < dy.length; ++l) {
                                            let newNode = new Node(-1, thisNode.x + dis, ordPlus(thisNode.y, ord(l)))
                                            if (ordCmp(newNode.y, [0]) == 0) {
                                                mt2.push(newNode)
                                            }
                                            connect(mt2, newNode, md, tops, roots, j + dx - 1)
                                        }
                                        md = md.up
                                    }
                                }
                            }
                        }
                        nd = nd.up
                        if (nd == null) {
                            break
                        }
                        while (cd.up != null && ordCmp(cd.y, nd.y) < 0) {
                            cd = cd.up
                        }
                        if (nd.isMagma) {
                            ++ir
                            thisRc = rc[ir]
                            thisRef = ref[ir]
                        }
                    }
                    if (j != 0) {
                        while (cd.up != null) {
                            cd = cd.up
                        }
                        cd.value = 1
                        while (ordCmp(cd.y, [0]) > 0) {
                            cd.down.value = cd.value + cd.left.value
                            cd = cd.down
                        }
                    }
                }
            } else {    //尊重原著
                for (let j = 0; j < bl; ++j) {    //对于复制部分的每一列，进行操作
                    let nd = mt2[root.x + j + 1]
                    let ir = 0
                    let thisRc = rc[ir]
                    let thisRef = ref[ir]
                    while (nd != null) {
                        if (nd.isMagma) {
                            ++ir
                            thisRc = rc[ir]
                            thisRef = ref[ir]
                            //做出wildfire边
                            let thisNode = nd.left
                            let newLeft = findNode(mt2[thisNode.x + dis], nd.y, false)
                            let newRight = new Node(-1, nd.x + dis, nd.y)
                            connectH(newLeft, newRight)
                            connectV(newRight, tops[j])
                            tops[j] = newRight
                            if (ordCmp(newRight.y, [0]) == 0) {
                                mt2[nd.x + dis] = newRight
                            }
                            if (debug) {
                                console.log('wilefire')
                                displayMountain(mt2, debug)
                            }
                            if (nd.up != null) {    //作出magma边
                                let thisNode = nd.up.left
                                let newLeft = findNode(mt2[thisNode.x + dis], thisNode.y)
                                while (newLeft.up != null && ordCmp(newLeft.y, thisRef.y) < 0) {
                                    let dy = ordMinus(newLeft.up.y, newLeft.y).length
                                    for (let k = 0; k < dy; ++k) {
                                        let newRight = new Node(-1, nd.x + dis, ordPlus(newLeft.y, ord(k)))
                                        connectH(newLeft, newRight)
                                        connectV(newRight, tops[j])
                                        tops[j] = newRight
                                        if (ordCmp(newRight.y, [0]) == 0) {
                                            mt2[nd.x + dis] = newRight
                                        }
                                        if (debug) {
                                            console.log('magma')
                                            displayMountain(mt2, debug)
                                        }
                                    }
                                    newLeft = newLeft.up
                                }
                            }
                        } else {    //作出eruption边
                            let thisNode = nd.left
                            let dy = ordMinus(nd.y, thisRc.y)
                            let newRight = new Node(-1, nd.x + dis, ordPlus(thisRef.y, dy))
                            if (thisNode.x < root.x) {
                                newLeft = thisNode
                            } else {
                                newLeft = findNode(mt2[thisNode.x + dis], newRight.y, false)
                            }
                            connectH(newLeft, newRight)
                            connectV(newRight, tops[j])
                            tops[j] = newRight
                            if (ordCmp(newRight.y, [0]) == 0) {
                                mt2[nd.x + dis] = newRight
                            }
                            if (debug) {
                                console.log('eruption')
                                displayMountain(mt2, debug)
                            }
                        }
                        if (nd.up == null) {
                            break
                        } else {
                            nd = nd.up
                        }
                    }
                    let xd = tops[j]
                    if (iterate) {
                        xd.value = diagonal2[xd.x].value
                    } else {
                        xd.value = idx[root.x + j + 1].value
                    }
                    while (ordCmp(xd.y, [0]) > 0) {
                        xd.down.value = xd.value + xd.left.value
                        xd = xd.down
                    }
                    if (debug) {
                        console.log('fill')
                        displayMountain(mt2, debug)
                    }
                }
            }
        }
        if (debug) {
            console.log('end')
            console.log(mt2)
        }
        if (document.forms['settings']['mt'].value == '1') {
            document.getElementById('test').innerHTML += ('\n<br>\n' + displayMountain(mt2))
        }
        return mt2
    }
}
function expandwY(seq, fs, n = -1,debug=false) {
    let mt = generateMountain(seq)
    return expandwYMountain(mt, fs, n, debug).map((x) => x.value)
}