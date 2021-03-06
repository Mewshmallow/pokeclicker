abstract class SafariBody {
    grid: Array<Array<number>>;
    type: string;

    constructor() {

    }

    public getTileNeighbours(x: number, y: number) {
        let ret = Array<boolean>(4);//["N", "E", "S", "W"]
        let cross = Array<boolean>(4);//["NE", "SE", "SW", "NW"]
        if (x === 0) {
            ret[3] = false;
        } else {
            ret[3] = this.grid[y][x - 1] !== 0;
        }
        if (y === 0) {
            ret[0] = false;
        } else {
            ret[0] = this.grid[y - 1][x] !== 0;
        }
        if (x === this.grid[0].length - 1) {
            ret[1] = false;
        } else {
            ret[1] = this.grid[y][x + 1] !== 0;
        }

        if (y === this.grid.length - 1) {
            ret[2] = false;
        } else {
            ret[2] = this.grid[y + 1][x] !== 0 &&this.grid[y + 1][x] !== undefined;
        }

        if (ret.equals([true, true, true, true])) {
            cross[0] = this.grid[y - 1][x + 1] !== 0;
            cross[1] = this.grid[y + 1][x + 1] !== 0;
            cross[2] = this.grid[y + 1][x - 1] !== 0;
            cross[3] = this.grid[y - 1][x - 1] !== 0;
        }
        return {
            plus: ret,
            cross: cross
        };
    }

    //duplicated in DungeonMap
    public static shuffle(a) {
        let j, x, i;
        for (i = a.length; i; i--) {
            j = Math.floor(Math.random() * i);
            x = a[i - 1];
            a[i - 1] = a[j];
            a[j] = x;
        }
    }

    public maxY() {
        return this.grid.length;
    }

    public maxX() {
        let max = 0;
        for (let row of this.grid) {
            if (row.length > max) {
                max = row.length;
            }
        }
        return max;
    }
}


class SandBody extends SafariBody {
    edgeDetectCheck: number = 15;

    constructor(
        x: number = SandBody.randomInt(), 
        y: number = SandBody.randomInt(), 
        type: string = "sand"
    ) {
        super();
        this.type = type;
        this.grid = this.generateCube(x, y);

        this.edgeDetect();
    }

    static randomInt(): number {
        return Math.floor(Math.random() * 3) + 3;
    }

    private generateCube(sizeX: number, sizeY: number): Array<Array<number>> {
        let body = [];
        for (let i = 0; i < sizeY; i++) {
            let row = Array.apply(null, Array(sizeX)).map(Number.prototype.valueOf, 0);
            body.push(row);
        }

        let amount = this.type === 'fence' ? 20 : 4
        for (let i = 0; i<amount; i++){
            let x = Math.floor(Math.random()*(sizeX-2));
            let y = Math.floor(Math.random()*(sizeY-2));
            body = SandBody.addCube(x,y,body);
        }
        return body;
    }

    private static addCube(x: number, y: number, body: Array<Array<number>>): Array<Array<number>> {
        if (Math.random() >= 0.5){
            body[y+2][x] = 15;
            body[y+2][x+1] = 15;
            body[y][x+2] = 15;
            body[y+1][x+2] = 15;
            body[y+2][x+2] = 15;
        }
        body[y][x] = 15;
        body[y+1][x] = 15;
        body[y][x+1] = 15;
        body[y+1][x+1] = 15;
        return body;
    }

    private edgeDetect() {
        for (var i = 0; i < this.grid.length; i++) {
            for (var j = 0; j < this.grid[i].length; j++) {
                if (this.grid[i][j] === this.edgeDetectCheck) {
                    this.grid[i][j] = this.getNumber(this.getTileNeighbours(j, i));
                }
            }
        }
    }

    getNumber(neighbours): number {
        let plus = neighbours.plus;
        let cross = neighbours.cross;
        if(plus.equals([false, true, true, false])){
            return 11;
        }
        if(plus.equals([false, true, true, true])){
            return 12;
        }
        if(plus.equals([false, false, true, true])){
            return 13;
        }
        if(plus.equals([true, true, true, false])){
            return 14;
        }
        if(plus.equals([true, true, true, true])){
            if(!cross[0]){
                return 21;
            }
            if(!cross[1]){
                return 22;
            }
            if(!cross[2]){
                return 23;
            }
            if(!cross[3]){
                return 24;
            }
            return 15;
        }
        if(plus.equals([true, false, true, true])){
            return 16;
        }
        if(plus.equals([true, true, false, false])){
            return 17;
        }
        if(plus.equals([true, true, false, true])){
            return 18;
        }
        if(plus.equals([true, false, false, true])){
            return 19;
        }
        return 10;
    }
}


class FenceBody extends SandBody {
    edgeDetectCheck = 0;

    constructor() {
        super(7, 7, 'fence');
        this.openFence();
    }

    getNumber(neighbours): number {
        let plus = neighbours.plus;
        let cross = neighbours.cross;
        if(plus.equals([false, true, true, false])){
            return 25;
        }
        if(plus.equals([false, true, true, true])){
            return 26;
        }
        if(plus.equals([false, false, true, true])){
            return 27;
        }
        if(plus.equals([true, true, true, false])){
            return 28;
        }
        if(plus.equals([true, true, true, true])){
            if(!cross[0]){
                return 33;
            }
            if(!cross[1]){
                return 34;
            }
            if(!cross[2]){
                return 35;
            }
            if(!cross[3]){
                return 36;
            }
            return 10;
        }
        if(plus.equals([true, false, true, true])){
            return 29;
        }
        if(plus.equals([true, true, false, false])){
            return 30;
        }
        if(plus.equals([true, true, false, true])){
            return 31;
        }
        if(plus.equals([true, false, false, true])){
            return 32;
        }
        return 10;
    }

    private openFence() {
        let options = [26, 28, 29, 31];
        let pick = options[Math.floor(Math.random()*options.length)];
        for(let i = 0; i<this.grid.length; i++){
            for(let j = 0; j<this.grid[0].length; j++){
                if(this.grid[i][j] === pick){
                    this.grid[i][j] = 0;
                }
            }
        }
    }
}


class WaterBody extends SafariBody {
    constructor() {
        super();
        let x = Math.floor(Math.random() * 3) + 3;
        let y = Math.floor(Math.random() * 3) + 3;
        let body = [];
        for (let i = 0; i < y; i++) {
            let row = [];
            for (let j = 0; j < x; j++) {
                if (i === 0){
                    if( j === 0){
                        row.push(1);
                    } else if (j < x-1){
                        row.push(2)
                    } else if (j === x-1){
                        row.push(3)
                    }
                } else if (i < y - 1){
                    if( j === 0){
                        row.push(4);
                    } else if (j < x-1){
                        row.push(5)
                    } else if (j === x-1){
                        row.push(6)
                    }
                } else if (i === y - 1){
                    if( j === 0){
                        row.push(7);
                    } else if (j < x-1){
                        row.push(8)
                    } else if (j === x-1){
                        row.push(9)
                    }
                }
            }
            body.push(row);
        }

        this.grid = body;
        this.type = 'water';
    }
}

class GrassBody extends SafariBody {
    constructor() {
        super();
        let x = Math.floor(Math.random() * 3) + 4;
        let y = Math.floor(Math.random() * 3) + 4;
        let body = [];
        for (let i = 0; i < y; i++) {
            let row = [];
            for (let j = 0; j < x; j++) {
                if(j < x*2/3-1) {
                    row.push(10);
                } else {
                    row.push(0);
                }
            }
            SafariBody.shuffle(row);
            body.push(row);
        }

        this.grid = body;
        this.fillHoles();
        this.type = 'grass';
    }

    private fillHoles() {
        for(let i = 0; i<this.grid.length; i++){
            for(let j = 0; j<this.grid[0].length; j++){
                if(this.grid[i][j] === 0) {
                    if (i !== 0 && i !== this.grid.length - 1) {
                        if (this.grid[i - 1][j] === 10 && this.grid[i + 1][j] === 10) {
                            this.grid[i][j] = 10;
                        }
                    }
                }
            }
        }

        for(let i = 0; i<this.grid.length; i++){
            for(let j = 0; j<this.grid[0].length; j++){
                if(this.grid[i][j] === 0) {

                    if (j !== 0 && j !== this.grid[0].length - 1) {
                        if (this.grid[i][j-1] === 10 && this.grid[i][j+1] === 10) {
                            this.grid[i][j] = 10;
                        }
                    }
                }
            }
        }
    }
}

class TreeBody extends SafariBody {
    constructor() {
        super();
        this.grid = [[37,38,39],[40,41,42],[43,44,45],[46,47,48]];
        this.type = 'tree';
    }
}

Array.prototype.equals = function (array) {
    // if the other array is a falsy value, return
    if (!array)
        return false;

    // compare lengths - can save a lot of time
    if (this.length != array.length)
        return false;

    for (var i = 0, l=this.length; i < l; i++) {
        // Check if we have nested arrays
        if (this[i] instanceof Array && array[i] instanceof Array) {
            // recurse into the nested arrays
            if (!this[i].equals(array[i]))
                return false;
        }
        else if (this[i] != array[i]) {
            // Warning - two different object instances will never be equal: {x:20} != {x:20}
            return false;
        }
    }
    return true;
}

interface Array<T> {
    equals(array: Array<T>): boolean;
}
