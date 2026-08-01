function expandPPS(seq,fs){
    let l=seq.length
    let lastTerm=seq[l-1]
    seq.pop()
    if(lastTerm<=0){
        return seq
    }else{
        let badPart=seq.slice(lastTerm)
        let asc=badPart.map(x=>x>=lastTerm?1:0)
        let badRoot=seq[lastTerm-1]
        let dif=l-lastTerm
        let last=badPart.some(x=>x==badRoot)?badRoot:lastTerm-1
        for(let i=1;i<=fs;++i){
            seq.push(last)
            for(let j=0;j<dif-1;++j){
                seq.push(badPart[j]+asc[j]*dif*i)
            }
        }
        return seq
    }
}
notations.push(
    {
        name: 'Parentes Predecessor Sequence',
        author:'318\'4',
        abbr:'PPS',
        description: '"PPS":The PPS Mode(The limit is unknown).',
        expand(a, fs) { return expandPPS(a, fs, true) },
        expandLimit(fs) {
            let res = []
            for (let i = 0; i <= fs; ++i)res.push(i)
            return res
        }
    }
)