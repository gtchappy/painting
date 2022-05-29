var http = require('http')
var fs = require('fs')
var url = require('url')
var port = process.argv[2]

if (!port) {
    console.log('请指定端口号好不啦？\nnode server.js 8888 这样不会吗？')
    process.exit(1)
}

var server = http.createServer(function (request, response) {
    var parsedUrl = url.parse(request.url, true)
    var pathWithQuery = request.url
    var queryString = ''
    if (pathWithQuery.indexOf('?') >= 0) { queryString = pathWithQuery.substring(pathWithQuery.indexOf('?')) }
    var path = parsedUrl.pathname
    var query = parsedUrl.query
    var method = request.method

    /******** 从这里开始看，上面不要看 ************/

    console.log('有个傻子发请求过来啦！路径（带查询参数）为：' + pathWithQuery)

    if (path === '/') {
        response.statusCode = 200
        response.setHeader('Content-Type', 'text/html;charset=utf-8')
        response.write(`

        <!DOCTYPE html>
        <html lang="en">
        
        <head>
            <meta charset="UTF-8">
            <meta http-equiv="X-UA-Compatible" content="IE=edge">
            <meta name="viewport" content="width=device-width, initial-scale=1.0">
            <title>画板</title>
            <link rel="stylesheet" href="/x">
        </head>
        
        <body style="overflow: hidden;">
            <canvas id="canvas" width="100" height="100"></canvas>
            <!-- <div id="canvas"> -->
            <!-- </div> -->
            <script>
        
                let canvas = document.getElementById("canvas");
                canvas.width = document.documentElement.clientWidth
                canvas.height = document.documentElement.clientHeight
                let ctx = canvas.getContext("2d");
                ctx.lineJoin = "round";
                // ctx.fillStyle = 'blue'
                ctx.strokeStyle = "blue";
                // ctx.lineCaps = "round";
                ctx.lineWidth = 10;
        
                let painting = false
                let last
                // 检测是否支持手机
                var isTouchDevice = 'ontouchstart' in document.documentElement;
                // console.log(isTouchDevice)
                // 检测是不是手机
                // ------------------------------s
                if (isTouchDevice) {
                    canvas.ontouchstart = (e) => {
                        let x = e.touches[0].clientX
                        let y = e.touches[0].clientY
                        last = [x, y]
                    }
                    canvas.ontouchmove = (e) => {
                        let x = e.touches[0].clientX
                        let y = e.touches[0].clientY
                        drawLine(last[0], last[1], x, y)
                        last = [x, y]
                    }
                }
                // -----------------------------------
                // 电脑
                else {
                    canvas.onmousedown = (e) => {
                        painting = true
                        last = [e.clientX, e.clientY]
                    }
        
                    canvas.onmousemove = (e) => {
                        if (painting === true) {
        
                            drawLine(last[0], last[1], e.clientX, e.clientY)
                            last = [e.clientX, e.clientY]
                        }
        
                    }
                    canvas.onmouseup = () => {
                        painting = false
                    }
                }
        
                function drawLine(x1, y1, x2, y2) {
                    ctx.beginPath();
                    ctx.moveTo(x1, y1);
                    ctx.lineTo(x2, y2);
                    ctx.closePath();
                    ctx.stroke();
                }
        
        
            </script>
        </body>
        
        </html>
    
    `)
        response.end()
    } else if (path === '/x') {
        response.statusCode = 200
        response.setHeader('Content-Type', 'text/css;charset=utf-8')
        response.write(`
        *{
            margin: 0;
            padding: 0;
            box-sizing: border-box;
        }
        
        #canvas{
            /* height: 100vh; */
            /* height: 100vw; */
            /* border: 1px solid black; */
            /* 默认是inline元素就有滚动条 */
            display: block;
        }
        
      

        body{
            overflow: hidden;
        }

    `)
        response.end()
    } else {
        response.statusCode = 404
        response.setHeader('Content-Type', 'text/html;charset=utf-8')
        response.write(`你输入的路径不存在对应的内容`)
        response.end()
    }

    /******** 代码结束，下面不要看 ************/
})

server.listen(port)
console.log('监听 ' + port + ' 成功\n请用在空中转体720度然后用电饭煲打开 http://localhost:' + port)
