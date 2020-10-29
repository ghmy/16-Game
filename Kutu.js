class Kutu{
    constructor(sayi, pos){ 
        this.sayi = sayi;
        this.pos = pos;
        this.x = 0;
        this.y = 0;
    }
    setPos(pos){
        this.pos = pos;
        this.setX(this.calcX(pos));
        this.setY(this.calcY(pos));
    }
    setX(x){
        this.x = x;
    }
    setY(y){
        this.y = y;
    }
    draw(){
        canvasContext.strokeStyle = 'white';
        canvasContext.lineWidth = 1;
        canvasContext.beginPath();
        canvasContext.rect(this.x, this.y, rectDim, rectDim);     
        canvasContext.stroke();

        canvasContext.fillStyle = 'white';
        canvasContext.font = "36px Arial";
        canvasContext.fillText(this.sayi, this.x + 3 * rectDim / 8, this.y + 5 * rectDim / 8);
        
    }
    calcX(id){
        return startX + rectDim * ((id - 1) % N);
    }
    calcY(id){
        return startY + rectDim * Math.floor((id - 1) / N);
    }
}