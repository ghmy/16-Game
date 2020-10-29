var kutular = [];
var canvas, canvasContext, button, N, dim, bosluk, margins, hareketEdenKutu, oyunBitti, animating, framesPerSecond, marginId, AI, aiMarginIds;

const startX = 200;
const startY = 200;
const rectDim = 100;
const speed = 5;
const multipliers = [-1, 1, 1, -1];

window.onload = function() {

    /*N = prompt("Lütfen bulmaca boyutunu giriniz : ", 4);
    if (N == null || N == "") {
        N = 4;
    } 
    N = parseInt(N);*/
    N = 4;
    dim = N * N;
    margins = [1, -1, -N, N];
    bosluk = dim;
    aiMarginIds = [];

    canvas = document.getElementById('canvas');
    canvas.width = startX + rectDim * (N + 2);
    canvas.height = startY + rectDim * (N + 2);
	canvasContext = canvas.getContext('2d');
    canvasContext.font = "15px Arial";

    for(let i = 1; i < dim; i++){
        kutular.push(new Kutu(i, i));        
    }

    do{
        shuffle();
    }while(!isSolvable() || bitti());
        
    document.addEventListener("keydown", this.kontrol.bind(this));

    framesPerSecond = 60;
    animating = false;
    oyunBitti = false;
    AI = false;

    button = {
        x:300,
        y:50,
        width:200,
        height:50
    };

    //Binding the click event on the canvas
    canvas.addEventListener('click', function(evt) {
        var mousePos = getMousePos(canvas, evt);

        if (isInside(mousePos,button)) {
            AI = !AI;
            if(AI)
                aiMarginIds.length = 0;
        }   
    }, false);

	setInterval(function(){
        if(!oyunBitti){
            if(AI)
                setAIMovement();           
            if(animating)
                animate();                                      
            draw();                  
        }else{
            canvasContext.fillStyle = 'white';
            canvasContext.font = "60px Arial";
            canvasContext.fillText("Kazandınız!", 200, canvas.height - 100);
        }         
    }, 1000 / framesPerSecond);   
}

function getMousePos(canvas, event) {
    var rect = canvas.getBoundingClientRect();
    return {
        x: event.clientX - rect.left,
        y: event.clientY - rect.top
    };
}
//Function to check whether a point is inside a rectangle
function isInside(pos, rect){
    return pos.x > rect.x && pos.x < rect.x+rect.width && pos.y < rect.y+rect.height && pos.y > rect.y
}

function isSolvable(){
    var locations = getLocations();
    let invCount = getInvCount(locations);
 
    if (N & 1)
        return !(invCount & 1);
    else     
    {
        if (Math.floor((bosluk - 1) / N) & 1)
            return !(invCount & 1);
        else
            return invCount & 1;
    }
}

function shuffle(){
    var positions = [];

    for (var i = 1; i <= dim; i++) {
        positions.push(i);
    }
    for(let i = 0; i < dim - 2; i++){
        let j = i + Math.floor(Math.random() * (dim - i));
        let temp = positions[i];
        positions[i] = positions[j];
        positions[j] = temp; 
    }
    for(let i = 0; i < dim - 1; i++){      
        kutular[i].setPos(positions[i]);
    }
    bosluk = positions[dim - 1];
}

function kontrol() {
    let key = window.event;
    if(!animating && !AI){
        if (key.keyCode == 37) { // Sol
            marginId = 0;
            animating = true;
        }
        if (key.keyCode == 38) { // Yukarı
            marginId = 3;
            animating = true;
        }
        if (key.keyCode == 39) { // Sağ
            marginId = 1
            animating = true;
        }
        if (key.keyCode == 40) { // Aşağı
            marginId = 2;
            animating = true;
        }
        hareketEdenKutu = kutuGetir(bosluk + margins[marginId]);
        if(hareketEdenKutu == null)
            animating = false;
    }    
}

function draw(){
    drawBackground();
    drawButton();
    drawBoxes();
}

function drawBackground(){
    canvasContext.fillStyle = 'black';
	canvasContext.fillRect(0,0, canvas.width, canvas.height);
}

function drawButton(){
    canvasContext.strokeStyle = 'white';
    canvasContext.lineWidth = 1;
    canvasContext.beginPath();
    canvasContext.rect(button.x, button.y, button.width, button.height);     
    canvasContext.stroke();

    var text = "";
    if(!AI)
        text = "ÇÖZ";       
    else
        text = "BEN ÇÖZEYİM"

    canvasContext.fillStyle = 'white';
    canvasContext.font = "24px Arial";
    canvasContext.fillText(text, button.x + button.width / 12, button.y + 5 * button.height / 8);
}

function drawBoxes(){
    kutular.forEach(drawBox);
}

function drawBox(kutu){
    kutu.draw();
}

function animate(){
    if(checkBoundary()){
        if(marginId < 2) setX();
        else setY();        
    }else{
        animating = false;
    }
    if(bitti())
        oyunBitti = true;
}

function checkBoundary(){
    var conditions = [(bosluk - 1) % N != (N - 1), (bosluk - 1) % N != 0, bosluk > N, bosluk <= dim - N];
    return conditions[marginId];
}

function setX(){
    let newX = parseFloat((hareketEdenKutu.x + multipliers[marginId] * speed).toFixed(2));
    hareketEdenKutu.setX(newX);
    if(hareketEdenKutu.x == hareketEdenKutu.calcX(bosluk)){
        hareketEdenKutu.setPos(bosluk);
        bosluk = bosluk + margins[marginId];
        animating = false;
    }
}

function setY(){
    let newY = parseFloat((hareketEdenKutu.y + multipliers[marginId] * speed).toFixed(2));
    hareketEdenKutu.setY(newY);
    if(hareketEdenKutu.y == hareketEdenKutu.calcY(bosluk)){
        hareketEdenKutu.setPos(bosluk);
        bosluk = bosluk + margins[marginId];
        animating = false;
    }
}

function setAIMovement(){
    if(aiMarginIds.length == 0){
        var initialLocations = getLocations();
        aiMarginIds = arama(initialLocations);      
    }       

    if(aiMarginIds.length > 0 && !animating){
        marginId = aiMarginIds[0];
        aiMarginIds.shift();

        hareketEdenKutu = kutuGetir(bosluk + margins[marginId]);
        animating = hareketEdenKutu != null;
    }
}

function getLocations(){
    var locations = new Array(dim);
    for (let i = 0; i < dim - 1; i++)
    {
        locations[kutular[i].pos - 1] = kutular[i].sayi;
    }
    locations[bosluk - 1] = 0;
    return locations;
}

function bitti(){
    for(let i = 0; i < kutular.length; i++){
        if(kutular[i].sayi != kutular[i].pos)
            return false;
    }
    return true;
}

function kutuGetir(pos){
    for(let i = 0; i < dim - 1; i++){
        if(kutular[i].pos == pos)
            return kutular[i];
    }
    return null;
}