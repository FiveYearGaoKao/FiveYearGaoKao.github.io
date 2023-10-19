mode1 = ''
function changeSeqInfo(name, author) {    //修改序列信息
    document.getElementById('sequenceName').innerText = name
    document.getElementById('author').innerText = author
}
function showOutput(seq,debug=false) {    //输出
    if (debug) {
        console.log(seq)
    }
    document.getElementById('output').value = (seq.join(','))
}
function changeMode() {    //切换模式
    mode1 = document.getElementById('mode').value
    switch (mode1) {
        case "-5":
            changeSeqInfo('-5-Y Sequence', 'Nobody')
            break;
        case "-4":
            changeSeqInfo('-4-Y Sequence', 'Someone')
            break;
        case "-3":
            changeSeqInfo('-3-Y Sequence', 'Someone')
            break;
        case "-2":
            changeSeqInfo('-2-Y Sequence', 'Someone')
            break;
        case "-1":
            changeSeqInfo('Address Notation', 'Someone')
            break;
        case "P":
            changeSeqInfo('Primitive Sequence System', 'Bashicu')
            break;
        case "L":
            changeSeqInfo('Long Primitive Sequence System', 'Someone')
            break;
        case "H":
            changeSeqInfo('Hyper Primitive Sequence System', 'Bashicu')
            break;
        case "B":
            changeSeqInfo('Bashicu Matrix System 4', 'Bashicu')
            break;
        case "IB":
            changeSeqInfo('Bashicu Matrix System 3.3', 'Bashicu')
            break;
        case "0":
            changeSeqInfo('0-Y Sequence', 'Yukito')
            break;
        case "1":
            changeSeqInfo('Y Sequence', 'Yukito')
            break;
        case "w":
            changeSeqInfo('ω-Y Sequence (weak magma)', 'Yukito')
            break;
        default:
            if (parseInt(mode1) > 0) {
                changeSeqInfo('D ' + parseInt(mode1).toString() + '-Y Sequence (weak magma)', 'Gomen520(?)')
                break
            }
            changeSeqInfo("???", "???")
            break;
    }
}
function expand() {    //真正的展开
    debug=document.getElementById('debug').checked
    document.getElementById('test').innerHTML = ''
    mode1 = document.getElementById('mode').value
    if (mode1 == "B" || mode1 == "IB") {
        seq = readMatrix(document.getElementById('input').value)
    } else {
        seq = document.getElementById('input').value.split(',').map((x) => parseInt(x) > 0 ? parseInt(x) : 1)
    }
    fs = parseInt(document.getElementById('fsterm').value)
    switch (mode1) {
        case "-5":
            showOutput(expandSmallY(seq, fs, -5),debug)
            break;
        case "-4":
            showOutput(expandSmallY(seq, fs, -4),debug)
            break;
        case "-3":
            showOutput(expandSmallY(seq, fs, -3),debug)
            break;
        case "-2":
            showOutput(expandSmallY(seq, fs, -2),debug)
            break;
        case "-1":
            showOutput(expandPrSS(seq, fs, false),debug)
            break;
        case "P":
            showOutput(expandPrSS(seq, fs, false),debug)
            break;
        case "L":
            showOutput(expandPrSS(seq, fs, true),debug)
            break;
        case "H":
            showOutput(expandHPrSS(seq, fs),debug)
            break;
        case "B":
            document.getElementById('output').value = writeMatrix(expandBMS(seq, fs, false))
            break;
        case "IB":
            document.getElementById('output').value = writeMatrix(expandBMS(seq, fs, true))
            break;
        case "w":
            showOutput(expandwY(seq, fs, -1,debug),debug)
            break;
        default:
            if (parseInt(mode1) >= 0) {
                let n = parseInt(mode1)
                showOutput(expandwY(seq, fs, n,debug),debug)
                break
            }
            showOutput([-1])
            break;
    }
    return
}
function autoExpand() {
    if (document.getElementById('auto').checked) {
        setTimeout(expand, 10)
    }
}
window.onload = () => {
    document.forms['settings']['mt'].value = '1'
    document.getElementById('auto').checked = true
    document.getElementById('debug').checked = false
    changeMode()
    autoExpand()
}
