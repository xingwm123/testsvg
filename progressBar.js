function createProgressBar(svg, id,rectX, rectY, rectWidth, rectHeight) {
    console.log(id)
    // 初始化绿色圆角矩形（已完成部分）
    var activeRect = svg.append("rect")
        .attr("x", rectX)
        .attr("y", rectY)
        .attr("width", 0)
        .attr("height", rectHeight)
        .attr("class", "active-rect")
        .call(d3.drag()
      .on('start', dragStarted_cycle) // 定义开始拖拽的行为
      .on('drag', dragged_cycle)
      .on('end', dragEnded_cycle)); // 定义开始拖拽的行为

    // 创建拉动三角形
    var dragHandle = svg.append("polygon")
        .attr("points", "0,10 10,10 5,0")
        .attr("transform", "translate(" + (rectX) + ", " + (rectY + rectHeight) + ")")
        .attr("class", "drag-handle")
        .call(d3.drag().on("drag", function(event) {
            dragMove(event, svg, rectX, rectY, rectWidth, rectHeight, activeRect, dragHandle);
        }));
}

function dragMove(event, svg, rectX, rectY, rectWidth, rectHeight, activeRect, dragHandle) {
    var pointer = d3.pointer(event, svg.node());
    var x = Math.max(rectX, Math.min(rectX + rectWidth, pointer[0]));

    dragHandle.attr("transform", "translate(" + (x - 6) + ", " + (rectY + rectHeight) + ")");
    activeRect.attr("width", x - rectX);

 
}