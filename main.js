var canvas = document.getElementById('canvas');
var context = canvas.getContext('2d');
 autoSetSize(canvas)
 listenToMouse(canvas)


/***函数***/

/* 画圆圈
function drawCircle(x,y,radius){
  context.beginPath();
  context.arc(x,y,radius,0,Math.PI*2);
  context.stroke()
  context.closePath()
}
*/

function drawLine(x1,y1,x2,y2,a){
  context.beginPath()
  context.moveTo(x1,y1)
  context.lineWidth = 6 //线条粗细
  context.strokeStyle = a
  context.lineTo(x2,y2)
  context.stroke()
  context.closePath()
}

function autoSetSize(aaa){
  setCanvasSize(aaa)
  window.onresize = function(){
    setCanvasSize(aaa)
  }
}
function setCanvasSize(aaa){
  var newWidth = document.body.clientWidth
  var newHeight = document.body.clientHeight
  aaa.width = newWidth 
  aaa.height = newHeight
}



function listenToMouse(canvas){
  var using = false //创建Boolean变量控制使用（绘画/橡皮擦）状态，初始状态是false。
  var usingEraser = false//创建Boolean变量控制橡皮擦状态，初始状态是false。
  var lastPoint = {x:undefined,y:undefined} //创建全局变量，这样函数调用时在这个变量是存在的。
  eraser.onclick = function(){
    usingEraser =true
    eraser.classList.add('active')
    pen.classList.remove('active')
  }
  pen.onclick = function(){
    usingEraser = false
    pen.classList.add('active')
    eraser.classList.remove('active')
  }
  //特性检查
 if(document.body.ontouchstart !== undefined){
    //touchevent 触屏设备

    canvas.ontouchstart = function(touchClients){
      using = true
      var x = touchClients.touches['0'].clientX
      var y = touchClients.touches['0'].clientY 
      lastPoint = {x:x,y:y}
      if(usingEraser){
          context.clearRect(x-3,y-3,6,6)
      }
    }
    canvas.ontouchmove = function(touchClients){
      if(using){
        var x = touchClients.touches['0'].clientX
        var y = touchClients.touches['0'].clientY 
        var newPoint = {x:x,y:y}   //局部变量
          if(usingEraser){
            context.clearRect(x-3,y-3,6,6)
          }else{
            drawLine(lastPoint.x,lastPoint.y,newPoint.x,newPoint.y)
          }
        lastPoint = newPoint
      }
    }
    canvas.ontouchend = function(touchClients){
      using = false
    }
    
  }else{
     //mouuseEvent 非触屏设备
    canvas.onmousedown = function(mouseClients){
      using = true
      var x = mouseClients.clientX
      var y = mouseClients.clientY 
      lastPoint = {x:x,y:y}
      if(usingEraser){
          context.clearRect(x-3,y-3,6,6)
      }
    }
    canvas.onmousemove = function(mouseClients){
      if(using){
        var x = mouseClients.clientX 
        var y = mouseClients.clientY
        var newPoint = {x:x,y:y}   //局部变量
          if(usingEraser){
            context.clearRect(x-3,y-3,10,10)
          }else{
            drawLine(lastPoint.x,lastPoint.y,newPoint.x,newPoint.y)
          }
        lastPoint = newPoint
      }
    }
    canvas.onmouseup = function(){
      using = false
    }
  }
}