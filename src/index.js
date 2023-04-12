//create audio for when player hits wall
const bonkAudio = new Audio("./audio/Bonk.mp3");
const congratsAudio = new Audio("./audio/Congrats.mp3")
//check if user has completed the game today
//
//get current board for the day
let currentBoardNum = "1";
//read JSON file to get current maze
//temporary json to use for testing
let boardJson = {"board":[
    [1,1,1,1,1,1,1,1,1,1,0,"E"],
        [1,0,0,0,0,1,0,1,1,1,0,1],
        [1,0,1,1,0,1,0,1,1,1,"H",1],
        [1,0,1,1,0,1,0,0,1,0,0,1],
        [1,0,0,0,0,1,1,0,0,0,1,1],
        [1,0,1,1,0,0,0,0,1,1,0,1],
        [1,0,1,1,0,1,1,"M",1,1,0,1],
        [1,0,1,1,0,0,0,0,0,0,0,1],
        [1,0,0,0,0,1,1,0,0,1,1,1],
        [1,0,1,1,0,1,1,1,1,1,0,1],
        [1,0,1,"L",0,0,0,0,0,0,0,0],
        [1,1,0,0,1,1,1,0,0,1,1,0],
        ["S",0,0,1,0,0,0,0,1,0,0,0]],
    "startX":0,
    "startY":12,
    "endX":11,
    "endY":0};
// $.getJSON("./data/mazes.json",
// function(data){ 
//     console.log(data);
//     currentBoard = data[currentBoardNum];
// });
// console.log(currentBoard);

//x value of the player 
let currX;
//y value of the player
let currY;
//current column position of the player
let currCol = boardJson.startY;
//current row position of the player
let currRow = boardJson.startX;

//start of game
drawBoard(boardJson.board);

function drawBoard(board){
    let startX = 0;
    let startY = 0;
    for(let row of board){
        startX = 0;
        startY += 5.5;
        for(let square of row){
            startX+= 5.5;
                d3.select("#mapG")
                    .append("rect")
                    .attr("value",square)
                    .attr("x",startX)
                    .attr("y",startY)
                    .attr("rx","0.5")
                    .attr("ry","0.5")
                    .attr("width","5")
                    .attr("height","5")
                    .style("fill",function(){
                        if(square == 0)
                            return "#eeeeee";
                        else if(square == 1)
                            return "#5b5b5b";
                        else if(square == "S")
                            return "Green";
                        else if(square == "L")
                            return "#3771ee";
                        else if(square == "M")
                            return "#ffa318";
                        else if(square == "H")
                            return "#f8383a"
                        else
                            return "black";
                    })
                    .style("opacity",0)
                    .transition()
                    .duration(startX*50)
                    .style("opacity",1);        
                }
    }
//x value of starting square
currX = d3.select("rect[value=S]")["_groups"][0][0].x.baseVal.value + 2.5;
//y value of starting square
currY = d3.select("rect[value=S]")["_groups"][0][0].y.baseVal.value + 2.5;

d3.select("#mapG")
        .append("circle")
        .attr("id","playerCircle")
        .attr("cx", currX)
        .attr("cy", currY)
        .attr("r","1.2")
        .style("fill","#8c8c8c")
        .style("opacity",0)
        .transition()
        .duration(1000)
        .style("opacity",1);
    
    //get users inputs on keyboard
    $(document).keypress(function(e){
        e.preventDefault();
        switch(e.key){
            case "a":
            case "ArrowLeft":
                if(!checkBoard(0,-1)){
                    return;
                }
                currX -= 5.5;
                break;
            case "d":
            case "ArrowRight":
                if(!checkBoard(0,1))
                    return;
                currX += 5.5;
                break;
            case "w":
            case "ArrowUp":
                if(!checkBoard(-1,0))
                    return;
                currY -= 5.5;
                break;
            case "s":
            case "ArrowDown":
                if(!checkBoard(1,0))
                    return;
                currY += 5.5;
                break;
        
        }
        d3.select("#playerCircle")
            .transition()
            .duration(200)
            .attr("cx",currX)
            .attr("cy",currY);
        zoom();
    });
    setTimeout(function(){
        zoom();
    },2000)
}

//checks if next move is a valid move the updates backend
function checkBoard(colAdd,rowAdd){
    //check if move is left right up down
    if(boardJson.board[currCol + colAdd] == undefined || 
        boardJson.board[currCol + colAdd][currRow + rowAdd] == undefined || 
        boardJson.board[currCol + colAdd][currRow + rowAdd] == 1){
        d3.select("#playerCircle")
                    .transition()
                    .duration(100)
                    .attr("cx", currX + rowAdd)
                    .attr("cy", currY + colAdd)
                    .transition()
                    .duration(100)
                    .attr("cx", currX)
                    .attr("cy", currY);
                    bonkAudio.play();
        return false
    }
    else {
        currCol = currCol + colAdd;
        currRow = currRow + rowAdd;

        if(boardJson.board[currCol][currRow] !== 0)
            d3.select("#playerCircle").style("fill","white")
        else
            d3.select("#playerCircle").style("fill","#8c8c8c")

        if(currCol == boardJson.endY && currRow == boardJson.endX)
            userWin();
        return true;
    }
    //then move
    //currentBoard[][]
}
//check to see if user has won the game
function userWin(){
    congratsAudio.play();
    alert("winner");
}
//zoom function to make sure game is zoomed in
function zoom() {
    d3.select("#mapG")
        .transition()
        .duration(750)
        .attr("transform", "translate(" + currX + "," + currY + ")scale(" + 3 + ")translate(" + -currX + "," + -currY + ")");
}