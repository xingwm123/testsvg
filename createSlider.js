


export function createSlider(svg, rects){

    rects.forEach(rect => {
    
        console.log("rect.id="+rect.id)
        let id = rect.id.replace("rect-","")
        // 初始化绿色圆角矩形（已完成部分）
        var activeRect = svg.append("rect")
        .attr('id',`rect1-right-${id}`)
        .attr("x", rect.x)
        .attr("y", rect.y)
        .attr("width", 0)
        .attr("height", rect.height)
        .attr("class", "active-rect");
    
    
        var dragHandle = svg.append("polygon")
        .attr('id',`polygon-right-${id}`)
        .attr('class', `circle polygon-right-${id}`)
          .attr("points", "0,10 10,10 5,0")
          .attr("transform", "translate(" + (rect.x) + ", " + (rect.y + rect.height) + ")")
          .attr("class", "drag-handle")
          .call(d3.drag().on("drag", function(event) { dragMove(event, rect); }));  // 传递 rect 作为参数
    
          function dragMove(event, rect) {
            var pointer = d3.pointer(event, svg.node());
            var x = pointer[0];
          
            // 限制拖动范围在矩形内
            x = Math.max(rect.x, Math.min(rect.x + rect.width, x));
          
            // 更新三角形的位置
            dragHandle.attr("transform", "translate(" + (x - 6) + ", " + (rect.y + rect.height) + ")");
            
            // 更新活动进度的宽度
            var greenWidth = x - rect.x;
            activeRect.attr("width", greenWidth);
    
            var pointer = d3.pointer(event, svg.node());
            var x = pointer[0];
            x = Math.max(rect.x, Math.min(rect.x + rect.width, x));
          
            dragHandle.raise().attr("transform", "translate(" + (x - 6) + ", " + (rect.y + rect.height) + ")");
            activeRect.raise().attr("width", x - rect.x);
          }
    
      });


    

}