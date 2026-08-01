/**
 * Mahlo OCF的定义：
 * 1.ψM(0)=Ω
 * 2.ψM(a+1)=2 aft ψM(a)
 * 3.ψM(#&M)=x=>ψM(#&x)的容许点
 * 
 * 和Solarzone的分析器类似，使用[a,b,c]表示ψa(b)+c
 * 用Infinity表示Ω_(M+1)
 */
class Ordinal{
    constructor(level,arg=null,next=null){
        this.level=level;
        this.mahlo=false;
        this.arg=arg;
        this.next=next;
    }
}