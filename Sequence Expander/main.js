/* 一个记号的格式(*为必填项):
   *[string]name:记号名称
    [string]author:记号作者,默认为"Someone"
    [string]description:记号简介
    [string]abbr:该记号的简写，可以在"mode"中输入该字符串直接切换到该记号，尽量不要重复
    [function]read(a,data):将输入转化为内部存储格式,默认为序列转化为列表("1,2,3"->[1,2,3])
    [function]write(a,data):将内部存储格式转化为字符串输出,默认为列表转化为序列([1,2,3]->"1,2,3")
    [function]compare(a,b,data):若a>b则返回1,若a<b则返回-1,若a=b则返回0,默认为字典序
    [function]isSucc(a,data):判断一个内部存储格式是否为后继序数,默认判断最后一位是否为1
   *[function]expand(a,fs,data):展开方式
   *[function]expandLimit(fs,data):表示法极限的展开方式
    [object]data:需要让用户额外提供的信息,将在"特殊设置"栏中增加候选框
        格式为name:[*type,*description,default]
        其中name为变量名，type为"text"(输入框)、"radio"(单选框)或"checkbox"(多选框)之一
        text的返回值为string,checkbox返回值为boolean,radio返回值为number,代表第几个选项(从1开始)
        default为初始值,如果type为text默认为0,radio默认为选第一个,checkbox默认为不选
        description是每个选项前的介绍,如果type为radio则为字符串数组,第一项为标题,后面每一项为每个选项前的标题
 */
//如果某些东西没做好且不想用默认值，可以填“placeholder”，但此时部分功能会被禁用
var mode1 = ''
var notations = []
var mode2 = 0
var data = {}
var reader = new FileReader()

reader.addEventListener('load', () => {
    let a = JSON.parse(reader.result)
    if (a.read != 'placeholder' && a.read!=undefined) a.read = new Function('a', 'data', a.read)
    if (a.write != 'placeholder' && a.write!=undefined) a.write = new Function('a', 'data', a.write)
    if (a.compare != 'placeholder' && a.compare!=undefined) a.compare = new Function('a', 'b', 'data', a.compare)
    if (a.isSucc != 'placeholder' && a.isSucc!=undefined) a.isSucc = new Function('a','data', a.isSucc)
    if (a.expand != 'placeholder' && a.expand!=undefined) a.expand = new Function('a', 'fs', 'data', a.expand)
    if (a.expandLimit != 'placeholder' && a.expandLimit!=undefined) a.expandLimit = new Function('fs','data', a.expandLimit)
    notations.push(a)
    updateNotation()
})

function fsChain(seq, i) {    //求一个纯序列的fs链
    seq = seq.split(',').map((x) => parseInt(x))
    mode1 = document.getElementById('mode').value
    let chain = [seq[1]]
    let test1 = notations[i].limit(seq[1], mode1)
    while (lexOrder(test1.split(',').map((x) => parseInt(x)), seq) != 0) {
        let j = 0
        while (lexOrder(notations[i].expand(test1, j, mode1).split(',').map((x) => parseInt(x)), seq) < 0) {
            ++j
        }
        chain.push(j)
        test1 = notations[i].expand(test1, j, mode1)
    }
    return chain
}
function changeSeqInfo(name, author) {    //修改序列信息
    document.getElementById('sequenceName').innerText = name
    document.getElementById('author').innerText = author
}
function changeMode() {    //通过输入切换模式
    mode1 = document.getElementById('mode').value
    let i = 0
    while (i < notations.length) {
        if (notations[i].abbr.length > 0 && notations[i].abbr == mode1.toUpperCase()) {
            if (!notations[i].hidden || (document.getElementById('output').value == notations[i].password)) {
                changeSeqInfo(notations[i].name, notations[i].author)
                changeNotation(i)
            }
            return i
        }
        ++i
    }
    changeSeqInfo('???', '???')
    return -1
}
function changeNotation(i) {    //根据按钮切换模式并更新设置
    if (!notations[mode2].hidden) document.getElementById("notation" + mode2).className = "notation"
    if (!notations[i].hidden) document.getElementById("notation" + i).className = "notation2"
    mode2 = i
    changeSeqInfo(notations[i].name, notations[i].author)
    document.getElementById("settings").innerHTML = ""
    for (let k in notations[i].data) {
        let lis = notations[i].data[k]
        let a
        switch (lis[0]) {
            case "text":
                if (lis[2] == null) lis[2] = 0
                a = (String(lis[1]) + "<input type='text' name='" + k + "' value='" + lis[2] + "' oninput='requestAnimationFrame(updateData)''><br>")
                document.getElementById("settings").innerHTML += a
                break;
            case "checkbox":
                a = (String(lis[1]) + "<input type='checkbox' name='" + k + "' onchange='updateData()'><br>")
                document.getElementById("settings").innerHTML += a
                break;
            case "radio":
                let l = lis[1].length - 1
                a = (String(lis[1][0]) + ':')
                for (let m = 1; m <= l; ++m) {
                    a += "<input type='radio' name='" + k + "' value=" + m + " onchange='updateData()'>" + lis[1][m]
                }
                a += "<br>"
                document.getElementById("settings").innerHTML += a
                break;
            default:
                break;
        }
    }
    for (let k in notations[i].data) {
        let lis = notations[i].data[k]
        switch (lis[0]) {
            case "checkbox":
                if (lis[2] == null) lis[2] = false
                document.forms["settings"][k].checked = Boolean(lis[2])
                break;
            case "radio":
                if (lis[2] == null) lis[2] = 1
                document.forms["settings"][k].value = lis[2]
                break;
            default:
                break;
        }
    }
    updateData()
}
function showList() {
    if (document.getElementById('select').innerText == 'Select') {
        document.getElementById('notationList').style.display = "block"
        setTimeout(() => { document.getElementById('notationList').style.height = '330px' }, 0)
        document.getElementById('select').innerText = 'Hide'
    } else {
        document.getElementById('notationList').style.height = '0px'
        setTimeout(() => { document.getElementById('notationList').style.display = 'none' }, 300)
        document.getElementById('select').innerText = 'Select'
    }
}
function updateData() {    //更新data变量
    data = {}
    for (let k in notations[mode2].data) {
        let k1 = document.forms.settings[k]
        if (k1.type == "checkbox") { data[k] = k1.checked }
        else if (k1.type == "text") { data[k] = k1.value }
        else if (k1[0] != null && (k1[0].type == "radio")) { data[k] = parseInt(k1.value) }
    }
}
function expand() {    //真正的展开
    document.getElementById('test').innerHTML = ''
    seq = document.getElementById('input').value
    fs = parseInt(document.getElementById('fsterm').value)
    mode1 = document.getElementById('mode').value
    //let i = changeMode()
    let j = mode2
    let out = [-1]
    if (seq == 'limit') {
        if (typeof (notations[j].expandLimit) == 'function') {
            out = notations[j].expandLimit(fs, data)
        } else {
            document.getElementById('output').value = 
                'You can\'t expand the limit of ' + notations[j].name + ' because expandLimit() is not implemented.'
            return
        }
    } else {
        if (typeof (notations[j].read) == 'function') {
            a = notations[j].read(seq, data)
            if (typeof (notations[j].expandLimit) == 'function') {
                out = notations[j].expand(a, fs, data)
            } else {
                document.getElementById('output').value =
                    'You can\'t expand ' + notations[j].name + ' because expand() is not implemented.'
                return
            }
        } else {
            document.getElementById('output').value = 
                'You can\'t expand ' + notations[j].name + 'in the expander because read() is not implemented.\n'+
                'But you can still expand this notation in the console.'
            return
        }
        
    }
    document.getElementById('output').value = notations[j].write(out, data)
}
function autoExpand() {    //自动展开
    if (document.getElementById('auto').checked) {
        setTimeout(expand, 10)
    }
}
function swap() {    //交换输入输出
    tmp = document.getElementById('input').value
    document.getElementById('input').value = document.getElementById('output').value
    document.getElementById('output').value = tmp
    autoExpand()
}
function clear1() {    //清空输入和输出
    document.getElementById('input').value = ''
    document.getElementById('output').value = ''
}
function updateNotation() {
    document.getElementById('nList').innerHTML = ''
    for (let i = 0; i < notations.length; ++i) {
        if (notations[i].mode == undefined) notations[i].mode = () => { return false }
        if (notations[i].author == undefined) notations[i].author = "Someone"
        if (notations[i].read == undefined) notations[i].read = seqtoArray
        if (notations[i].write == undefined) notations[i].write = arraytoSeq
        if (notations[i].compare == undefined) notations[i].compare = lexOrder
        if (notations[i].isSucc == undefined) notations[i].isSucc = stdIsSucc
        if (!notations[i].hidden) {
            document.getElementById('nList').innerHTML +=
                '<button id="notation' + i.toString() + '" class="notation" onclick="changeNotation(' + i.toString() + ')">'
                + notations[i].name + (notations[i].abbr.length > 0 ? (' (' + notations[i].abbr + ')') : '') + '</button>\n'
        }
    }
}
window.onload = () => {
    updateNotation()
    //document.getElementById('auto').checked = true
    document.getElementById('notationList').style.height = '0px'
    changeMode()
    autoExpand()
}
