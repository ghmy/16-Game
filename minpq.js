
class minPQ{
    constructor(){
        this.pq = [];
    }

    bosMu(){
        return this.pq.length === 0; 
    }

    ekle(val){
        this.pq.push(val);
        this.yukari(this.pq.length - 1);
    }

    ilk(){
        return this.pq[0];
    }

    sil(){
        if(this.pq.length == 0) return null;
        var val = this.pq[0];
        this.pq[0] = this.pq[this.pq.length - 1];
        this.pq.pop();
        this.asagi(0);
        return val;
    }

    asagi(id){
        var i = id;
        while(2 * i + 1 < this.pq.length){
            var replace = 2 * i + 1;
            if(2 * i + 2 < this.pq.length){
                if(this.pq[2 * i + 2].heuristic < this.pq[2 * i + 1].heuristic){
                    replace = 2 * i + 2;
                }
            }
            if(this.pq[i].heuristic > this.pq[replace].heuristic){
                var temp = this.pq[i];
                this.pq[i] = this.pq[replace];
                this.pq[replace] = temp;
                i = replace;
            }else{
                break;
            }
        }
    }

    yukari(id){
        var i = id;
        while(i > 0){
            var ustId = Math.floor((i - 1)/2);
            if(this.pq[ustId].heuristic > this.pq[i].heuristic){
                var temp = this.pq[i];
                this.pq[i] = this.pq[ustId];
                this.pq[ustId] = temp;
                i = ustId;
            }else{
                break;
            }
        }
    }
}