/* 一个记号的格式:
    name:记号名称(以mode为参数函数,返回字符串)
    author:记号作者(字符串)
    mode:模式判断(以mode(字符串)为参数的函数,返回bool)
    description:记号简介(字符串)
    expand:展开方式(以seq(字符串),fs(正整数),mode(字符串)为参数的函数,返回字符串)(展开时，允许向"test"中输出山脉图等信息或者向控制台输出展开过程)
    limit:表示法极限的展开方式(以fs(正整数),mode(字符串)为参数的函数,返回字符串)
 */
mode1 = ''
notations = []
function changeSeqInfo(name, author) {    //修改序列信息
    document.getElementById('sequenceName').innerText = name
    document.getElementById('author').innerText = author
}
function showOutput(seq, debug = false) {    //输出
    if (debug) {
        console.log(seq)
    }
    document.getElementById('output').value = (seq.join(','))
}
function changeMode() {    //切换模式
    mode1 = document.getElementById('mode').value
    let match = false
    let i = 0
    while (i < notations.length) {
        if (notations[i].mode(mode1)) {
            changeSeqInfo(notations[i].name(mode1), notations[i].author)
            match = true
            return i
        }
        ++i
    }
    changeSeqInfo('???', '???')
    return -1
}
function expand() {    //真正的展开
    debug = document.getElementById('debug').checked
    document.getElementById('test').innerHTML = ''
    seq = document.getElementById('input').value
    fs = parseInt(document.getElementById('fsterm').value)
    mode1 = document.getElementById('mode').value
    let i = changeMode()
    if (i >= 0) {
        if (seq == 'limit') {
            document.getElementById('output').value = notations[i].limit(fs, mode1)
        } else {
            document.getElementById('output').value = notations[i].expand(seq, fs, mode1)
        }
    } else {
        document.getElementById('output').value = '-1'
    }
}
function autoExpand() {
    if (document.getElementById('auto').checked) {
        setTimeout(expand, 10)
    }
}
function swap() {
    tmp = document.getElementById('input').value
    document.getElementById('input').value = document.getElementById('output').value
    document.getElementById('output').value = tmp
    autoExpand()
}
window.onload = () => {
    for (let i = 0; i < notations.length; ++i) {
        document.getElementById('help').innerHTML += '<li>' + notations[i].description + '</li>\n'
    }
    document.forms['settings']['mt'].value = '1'
    document.getElementById('auto').checked = true
    document.getElementById('debug').checked = false
    changeMode()
    autoExpand()
}
