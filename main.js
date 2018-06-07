!function(){
   var view={
    init:function(){
       return context = this.canvas.getContext('2d')
     },
    canvas:document.getElementById('canvas'),
    $tool: $('.usingstatus'),
    $pensize: $('.pensize'),
    $pencolor: $('.pencolor'),
    $clear: $('#clear'),
    $save: $('#save')
   }

   var controller={
    view: null,
    model:  null,
    using: null,//控制使用（绘画/橡皮擦）状态
    usingEraser: null,//控制橡皮擦状态
    $target: null,
    url: null,
    linkToSave: null,
    color: null,
    lastPoint: null,
    newPoint: null,
    location: null,
    newsize: null,
    currentColor: null,
    currentSize:null,

    init: function(view){
      this.view=view
      this.using=false
      this.usingEraser=false
      this.color={
        red: '#d81e06',
        blue: '#13227a',
        yellow: '#f4ea2a',
        black: '#000',
      }
      this.currentColor = this.color.black
      this.currentSize = 2


      this.preventScroll()
      this.autoSetSize()
      this.initScreen()
      this.bindEvents()
     },



     
    bindEvents :function(){
      var lastPoint = {x:undefined,y:undefined}
      console.log(document.body.ontouchstart)
      this.chooseClear()
      this.choosePenSize()
      this.choosePenColor()
      this.chooseTool()
      this.chooseSaveInPC()
      
      //特性检查
      if(document.body.ontouchstart !== undefined){
        //触屏设备
        this.drawInTouchscreen()
      }else{
         //mouuseEvent 非触屏设备 PC
        this.drawInPC()
         
      }
     }, 


     drawInPC :function(){
       console.log('我运行了')
      this.view.canvas.onmousedown = (mouseClients)=>{
        this.using = true
        this.location={
          x:mouseClients.clientX,
          y:mouseClients.clientY,
        }
        this.location.x = mouseClients.clientX
        this.location.y = mouseClients.clientY 
        
        this.lastPoint = {x: this.location.x , y: this.location.y}
        if(this.usingEraser){
            this.view.init().clearRect(this.location.x-3,this.location.y-3,10,10)
        }
      }
      this.view.canvas.onmousemove = (mouseClients)=>{
        if(this.using){
          this.location={
            x:mouseClients.clientX,
            y:mouseClients.clientY,
          }
          this.newPoint = {x: this.location.x , y: this.location.y}   //局部变量
            if(this.usingEraser){
              this.view.init().strokeStyle = '#fff'
              this.view.init().lineWidth = 8
              this.drawLine(this.lastPoint.x,this.lastPoint.y,this.newPoint.x,this.newPoint.y,)
            }else{
              this.drawLine(this.lastPoint.x,this.lastPoint.y,this.newPoint.x,this.newPoint.y)
            }
          this.lastPoint = this.newPoint
        }
      }
      this.view.canvas.onmouseup = ()=>{
        this.using = false
      }
     },
    drawInTouchscreen:function(){
      this.view.canvas.ontouchstart = (touchClients)=>{
        this.using = true
        this.location={
          x: touchClients.touches['0'].clientX,
          y: touchClients.touches['0'].clientY,
        }

        this.lastPoint = {x: this.location.x , y: this.location.y}
        if(this.usingEraser){
          this.view.init().clearRect(x-3,y-3,10,10)
        }
      }
      this.view.canvas.ontouchmove =(touchClients)=>{
        if(this.using){
          this.location={
            x: touchClients.touches['0'].clientX,
            y: touchClients.touches['0'].clientY,
          }
          this.newPoint = {x: this.location.x , y: this.location.y}
            if(this.usingEraser){
              this.view.init().strokeStyle = '#fff'
              this.view.init().lineWidth = 8
              this.drawLine(this.lastPoint.x,this.lastPoint.y,this.newPoint.x,this.newPoint.y,)
            }else{
              this.drawLine(this.lastPoint.x,this.lastPoint.y,this.newPoint.x,this.newPoint.y,)
            }
          this.lastPoint = this.newPoint
        }
      }
      this.view.canvas.ontouchend = (touchClients)=>{
        using = false
      }
    },
 
     //选择样式、工具
    choosePenSize :function(){
      this.view.$pensize.on('click','div',(e)=>{
        this.$target=$(e.currentTarget)
        this.$target.addClass('active').siblings().removeClass('active')
        this.currentSize = (this.$target.index()+1)*2
        this.view.init().lineWidth = this.currentSize 

      })
     },
    choosePenColor :function(){
      this.view.$pencolor.on('click','div',(e)=>{
        this.$target = $(e.currentTarget)
        this.$target.addClass('active').siblings().removeClass('active')
        this.view.init().strokeStyle = this.color[this.$target[0].id]
        this.currentColor = this.color[this.$target[0].id]
      })
     },

    chooseTool :function(){
      this.view.$tool.on('click','SVG',(e)=>{
        this.$target = $(e.currentTarget)
        this.$target.addClass('active').siblings().removeClass('active')
        if(this.$target[0].id === 'pen'){
          this.usingEraser = false
          this.view.init().strokeStyle = this.currentColor
          this.view.init().lineWidth = this.currentSize 
        }else{
          this.usingEraser = true
        }
      })
     },

    chooseClear :function(){
      this.view.$clear.on('click',()=>{
        this.initScreen()
      })
     },

    chooseSaveInPC :function(){
      this.view.$save.on('click',()=>{
        this.url = this.view.canvas.toDataURL("image/png")
        this.linkToSave = document.createElement('a')
        document.body.appendChild(this.linkToSave)
        this.linkToSave.href=this.url
        this.linkToSave.download = 'my pciture'
        this.linkToSave.click()
      })
     },
    
     //初始化屏幕
    initScreen :function(){
      this.view.init().fillStyle = '#fff'
      this.view.init().fillRect(0,0,this.view.canvas.width,this.view.canvas.height)
      this.view.init().strokeStyle = this.currentColor
      this.view.init().lineWidth = this.currentSize 
     },

     //PC端下自动适应屏幕
    initCanvasSize :function(){
      this.newsize={
        newWidth: document.body.clientWidth,
        newHeight: document.body.clientHeight
      }
      this.view.canvas.width = this.newsize.newWidth 
      this.view.canvas.height = this.newsize.newHeight
     },
    autoSetSize :function(){
      this.initCanvasSize()
      window.onresize = ()=>{
        this.initCanvasSize
      }
     }, 
     //这里是bindEvent
     drawLine:function(x1,y1,x2,y2){
        this.view.init().beginPath()
        this.view.init().moveTo(x1,y1)
        this.view.init().lineTo(x2,y2)
        this.view.init().stroke()
        this.view.init().closePath()
     },
     preventScroll:function(){
      document.body.addEventListener('touchmove', function(e) {
        e.preventDefault();
      })
     }
     
   }
   controller.init(view)
}.call()



















// var canvas = document.getElementById('canvas');
// var context = canvas.getContext('2d');

// autoSetSize(canvas)
// listenToUser(canvas)





// function autoSetSize(aaa){
//   setCanvasSize(aaa)
//   window.onresize = function(){
//     setCanvasSize(aaa)
//   }
// }
// function setCanvasSize(aaa){
//   var newWidth = document.body.clientWidth
//   var newHeight = document.body.clientHeight
//   aaa.width = newWidth 
//   aaa.height = newHeight
// }
// function clearScreen(){
//   context.fillStyle = '#fff'
//   context.fillRect(0,0,canvas.width,canvas.height)
// }










// function drawLine(x1,y1,x2,y2,){
//   context.beginPath()
//   context.moveTo(x1,y1)
//   context.lineTo(x2,y2)
//   context.stroke()
//   context.closePath()
// }
// function listenToUser(canvas){
//   var using = false 
//   var usingEraser = false
//   var lastPoint = {x:undefined,y:undefined} 
//   eraser.onclick = function(){
//     usingEraser =true
//     eraser.classList.add('active')
//     pen.classList.remove('active')
//   }
//   pen.onclick = function(){
//     usingEraser = false
//     pen.classList.add('active')
//     eraser.classList.remove('active')
//   }

//   clear.onclick = function(){
//     clearScreen()
//   }
//   save.onclick = function(){
//     var url = canvas.toDataURL();
//     var a = document.createElement('a')
//     document.body.appendChild(a)
//     a.href = url
//     a.download = 'my picture'
//     a.click()
//   }
//   clearScreen()
//  if(document.body.ontouchstart !== undefined){
//     canvas.ontouchstart = function(touchClients){
//       using = true
//       var x = touchClients.touches['0'].clientX
//       var y = touchClients.touches['0'].clientY 
//       lastPoint = {x:x,y:y}
//       if(usingEraser){
//           context.clearRect(x-3,y-3,10,10)
//       }
//     }
//     canvas.ontouchmove = function(touchClients){
//       if(using){
//         var x = touchClients.touches['0'].clientX
//         var y = touchClients.touches['0'].clientY 
//         var newPoint = {x:x,y:y}   
//           if(usingEraser){
//             context.strokeStyle = '#fff'
//             context.lineWidth = 8
//             drawLine(lastPoint.x,lastPoint.y,newPoint.x,newPoint.y,)
//           }else{
//             drawLine(lastPoint.x,lastPoint.y,newPoint.x,newPoint.y,)
//           }
//         lastPoint = newPoint
//       }
//     }
//     canvas.ontouchend = function(touchClients){
//       using = false
//     }
    
//   }else{
//     canvas.onmousedown = function(mouseClients){
//       using = true
//       var x = mouseClients.clientX
//       var y = mouseClients.clientY 
//       lastPoint = {x:x,y:y}
//       if(usingEraser){
//           context.clearRect(x-3,y-3,10,10)
//       }
//     }
//     canvas.onmousemove = function(mouseClients){
//       if(using){
//         var x = mouseClients.clientX 
//         var y = mouseClients.clientY
//         var newPoint = {x:x,y:y}   
//           if(usingEraser){
//             context.strokeStyle = '#fff'
//             context.lineWidth = 8
//             drawLine(lastPoint.x,lastPoint.y,newPoint.x,newPoint.y,)
//           }else{
//             drawLine(lastPoint.x,lastPoint.y,newPoint.x,newPoint.y)
//           }
//         lastPoint = newPoint
//       }
//     }
//     canvas.onmouseup = function(){
//       using = false
//     }
//   }
// }

