function arama(initialLocations){
    var head, empty;
    var hashSet = new Set();
    var queue = new minPQ();

    queue.ekle({parent : null, marginId : -1, heuristic : 0, locations : initialLocations, depth : 0 });

    while(!queue.bosMu()){
        head = queue.sil();
     
        // location eğer hedef ise bitiriyoruz
        if(isOver(head.locations)){
            let marginIds = [];
            var current = head;
            while(current.marginId != -1){
                marginIds.unshift(current.marginId);
                current = current.parent;
            }
            console.log(head.depth);
            return marginIds;
        }
             
        empty = getEmpty(head.locations);

        // Mümkün olan bütün yönler için 
        var conditions = [(empty - 1) % N != (N - 1), (empty - 1) % N != 0, empty > N, empty <= dim - N];

        // Sırasıyla Sol, sağ, aşağı, yukarı
        for(let i = 0; i < conditions.length; i++){
            if(conditions[i]){                 
                let newLocations = getNewLocations(head.locations, i);               
                let hashVal = hashCode(newLocations);
                if(!hashSet.has(hashVal)){
                    queue.ekle({ parent : head, marginId : i, heuristic : getHeuristicValue(newLocations, head.depth + 1), locations : newLocations, depth : head.depth + 1});
                    hashSet.add(hashVal);
                }                                                
            }
        }
    }
    return [];
}

function getNewLocations(locations, dir){
    var newLocations = [];
    for(let i = 0; i < locations.length; i++)
        newLocations.push(locations[i]);

    let empty = getEmpty(locations);    
    let dests = [ 1, -1, -N, N];
    newLocations[empty - 1] = newLocations[empty - 1 + dests[dir]];
    newLocations[empty - 1 + dests[dir]] = 0;
    return newLocations;
}

// Index 1 tabanlı
function getEmpty(locations){
    for(let i = 0; i < locations.length; i++){   
        if(locations[i] == 0)
            return i + 1;
    }
    return -1;
}

function hashCode(locations){
    let hash = 5381;
	for(let i = 0; i < locations.length; i++){
        hash = (hash * 33) ^ locations[i];
    }
	return hash;
}

// Heuristic Function
function getHeuristicValue(locations, depth){
    let invCount = getInvCount(locations)
    var totalDist = 0;
    for(let i = 0; i < locations.length; i++){
        if(locations[i] != 0){
            totalDist += getDist(locations[i], i + 1);
            if(locations[i] != i + 1)
                totalDist++;
        }           
    }       
    return totalDist + invCount + depth;
}

function isOver(locations){
    for(let i = 0; i < locations.length - 1; i++){
        if(locations[i] != i + 1)
            return false;
    }
    return true;
}

function getDist(val, pos){
    var rowDiff = Math.abs(Math.floor((val - 1) / N) - Math.floor((pos - 1) / N));
    var colDiff = Math.abs(Math.floor((val - 1) % N) - Math.floor((pos - 1) % N));
    return rowDiff + colDiff;
}

function getInvCount(locations)
{
    let inv_count = 0;
    for (let i = 0; i < dim - 1; i++)
    {
        for (let j = i + 1; j < dim; j++)
        {
            if (locations[i] > locations[j] && locations[j] != 0)
                inv_count++;
        }
    }
    return inv_count;
}