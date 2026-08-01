//格式:pn(...)=[n,...],A1+A2+...=[-1,A1,A2,...],A1xA2=[-2,A1,A2]

function writeTeH(teh){
    if(typeof(teh)==='number')return teh.toString()
    if(teh[0]===-1)return teh.slice(1).map(writeTeH).join('+')
    if(teh[0]===-2)return (writeTeH(teh[1])+'x'+'('+writeTeH(teh[2])+')')
    return ('p'+teh[0]+'('+writeTeH(teh[1])+')')
}

function compareTeH(t1,t2){

}

function expandTeH(t,fs){
    
}