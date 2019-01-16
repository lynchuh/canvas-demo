void function(){
  const canvas = $('#canvas')[0]
  const ASSISTANT_FUNCTION = {
    isTouchScreen: /(Android|iPhone|iPad|iPod|iOS)/i.test(navigator.userAgent) , //特性检查
    using:false,
    _usingEraser:false,
    _currentColor:'#000',
    _currentSize:2,
    controller(){
      this.initCanvasSize(canvas)
      !this.isTouchScreen && this.drawInPc(canvas)
      this.isTouchScreen && this.drawInTouchScreen(canvas)
      this.bindEvent()
    },
    initCanvasSize(canvas) {
      canvas.width = document.body.clientWidth
      canvas.height = document.body.clientHeight
      this.context = canvas.getContext('2d')
      this.initDrawBoard()
      this.context.strokeStyle = this.currentColor
      this.context.lineWidth = this.currentSize
    },
    initDrawBoard(){
      this.context.fillStyle = '#fff                                                                                                            '
      this.context.fillRect(0,0,document.body.clientWidth,document.body.clientHeight)
    },
    drawInPc(canvas) {
      canvas.onmousedown= this.touchtheScreen.bind(this)
      canvas.onmousemove = this.movingInScreen.bind(this)
      canvas.onmouseup = () =>this.using = false
    },
    drawInTouchScreen(canvas){
      canvas.ontouchstart = this.touchtheScreen.bind(this)
      canvas.ontouchmove = this.movingInScreen.bind(this)
      canvas.ontouchend = () => this.using = false
    },
    touchtheScreen(event) {
      this.using = true
      this.lastPoint = this.isTouchScreen ?
      { x:event.touches['0'].clientX,y:event.touches['0'].clientY } :
      { x:event.clientX,y:event.clientY }
    },
    movingInScreen(event){
      this.newPoint = this.isTouchScreen ?
      { x:event.touches['0'].clientX,y:event.touches['0'].clientY } :
      { x:event.clientX,y:event.clientY }
      this.using && this.usingEraser && this.clearUp()
      this.using && !this.usingEraser && this.drawing()
      this.lastPoint = this.newPoint
    },
    drawing(){
      this.context.beginPath()
      this.context.moveTo(this.lastPoint.x, this.lastPoint.y)
      this.context.lineTo(this.newPoint.x, this.newPoint.y)
      this.context.stroke()
      this.context.closePath()
    },
    clearUp(){
      this.context.strokeStyle = '#fff'
      this.context.lineWidth = 14
      this.drawing()
      this.context.strokeStyle = this.currentColor
      this.context.lineWidth = this.currentSize
    },
    bindEvent(){
      const $usingStatus = $('#usingStatus'),$pencolor = $('#pencolor'),$pensize = $('#pensize'),
        $clearAll = $('#clear'),$savePic = $('#save'),$closeImg=$('#closeImg')

      $usingStatus.on('click','SVG',(e)=>{
        const $targetElement = $(e.currentTarget),status=$targetElement.attr('data-status')
        $targetElement.addClass('active').siblings().removeClass('active')
        this.usingEraser = status === 'clear'
      })
      $pencolor.on('click','.colorStyle',(e)=>{
        const $targetElement = $(e.currentTarget),currentColor=$targetElement.attr('data-color')
        $targetElement.addClass('active').siblings().removeClass('active')
        this.currentColor = currentColor
      })
      $pensize.on('click','.widthStyle',(e)=>{
        const $targetElement = $(e.currentTarget),index = $targetElement.index()
        $targetElement.addClass('active').siblings().removeClass('active')
        this.currentSize = ( index + 1 ) * 2
      })
      $clearAll.on('click', ()=> this.initDrawBoard() )
      $savePic.on('click',() => {
        const img = canvas.toDataURL()
        if (this.isTouchScreen){
         $('#resultImg')[0].src= img
          imgWrapper = $('.result').addClass('active')
        }else{
          const a = document.createElement('a')
          a.href= img
          a.download = '我的画板'
          a.click()
        }
      })
      $closeImg.on('click',() => $('.result').removeClass('active'))
    },
  }
  Object.defineProperties(ASSISTANT_FUNCTION,{
    'currentColor':{
      get() { return this._currentColor },
      set(value){
        this.context.strokeStyle = value
        this._currentColor = value
      }
    },
    'currentSize':{
      get(){ return this._currentSize },
      set(value){
        this.context.lineWidth = value
        this._currentSize = value
      }
    },
    'usingEraser':{
      get(){return this._usingEraser},
      set(value){
        if(!value){
          this.context.lineWidth = this.currentSize
          this.strokeStyle = this.currentColor
        }
        this._usingEraser = value
      }
    }
  })
  document.addEventListener('touchmove',(e)=>e.preventDefault(),{passive: false})
  ASSISTANT_FUNCTION.controller()
}()
