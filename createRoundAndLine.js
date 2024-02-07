
import { sharedState } from './common.js';



// Description: 用于创建圆形
export function createRoundAndLine(svg, rects) {

  

  let currentRect = null;
  let currentPath = null;
  const arrowLength = 10; // 箭头长度的估计值，根据实际标记大小调整
  // 新参数，控制起点和终点的水平段长度
  let startHorizontalLength = 100; // 起点的水平长度
  let endHorizontalLength = 100; // 终点的水平长度

      // 绘制圆形
  rects.forEach(rect => {
    let id = rect.id.replace("rect-", "");
    sharedState.setElement(`rect-${id}`);
    sharedState.setElement(`rect1-right-${id}`);
    sharedState.setElement(`polygon-right-${id}`);
    sharedState.setElement(`right-anchor-${id}`);
    sharedState.setElement(`left-anchor-${id}`);
    drawCircles(rect);
    // 对于每个矩形，根据其relate5字段自动连接到其他矩形
    if (rect.relate5 && rect.relate5.length > 0) {
      rect.relate5.forEach(relatedId => {
        const relatedRect = rects.find(r => r.id === relatedId);
        if (relatedRect) {
          drawAutoCurve(rect, relatedRect);
        }
      });
    }
  });


  function drawCircles(rect) {
    let id = rect.id.replace("rect-", "");
    svg.append('circle')
      .attr('id', `circle-right-${id}`)
      .attr('class', `circle circle-right-${id}`)
      .attr('cx', rect.x + rect.width + 5)
      .attr('cy', rect.y + rect.height / 2)
      .attr('r', 5)
      .attr('fill', 'red')
      .call(d3.drag()
        .on('start', dragStarted_cycle)
        .on('drag', dragged_cycle)
        .on('end', dragEnded_cycle));
      sharedState.setElement(`circle-right-${id}`);
  }

  function drawAutoCurve(startRect, endRect) {
    const startX = startRect.x + startRect.width + 5;
    const startY = startRect.y + startRect.height / 2;
    const endX = endRect.x - arrowLength;
    const endY = endRect.y + endRect.height / 2;
    const pathData = `M ${startX},${startY} C ${startX + startHorizontalLength},${startY} ${endX - endHorizontalLength},${endY} ${endX},${endY}`;
    let pathId = `path-auto-${startRect.id.replace("rect-", "")}-${endRect.id.replace("rect-", "")}`;
    svg.append('path')
      .attr('d', pathData)
      .attr('id', pathId)
      .attr('marker-end', 'url(#arrow)')
      .style('fill', 'none')
      .style('stroke', 'blue');
      sharedState.setElement(`${pathId}`);
    // 保存路径和关联的矩形信息
    let startRectId = startRect.id.replace("rect-","");
    let endRectId = endRect.id.replace("rect-","");
    createPath(pathId, {id: startRectId, x: startX, y: startY}, {id: endRectId, x: endX, y: endY});
  }



  function dragStarted_cycle(event) {
    d3.select(this).raise(); // 确保被拖拽的元素在顶层
    currentPath = svg.append('path')
      .style('fill', 'none')
      .style('stroke', 'blue')
      .attr('d', '');
  }


  function dragged_cycle(event,circle) {
    const mouse = d3.pointer(event, svg.node()); // 获取相对于SVG的鼠标位置
    const x = mouse[0],
      y = mouse[1];
    const selectedElement = d3.select(this);
    if(sharedState.getCurrentRect()!=null && sharedState.getCurrentRect().attr &&  typeof sharedState.getCurrentRect().attr === "function"){
      console.log(sharedState.getCurrentRect().attr)
      const rect2X = parseInt(sharedState.getCurrentRect().attr('x')),
        rect2Y = parseInt(sharedState.getCurrentRect().attr('y')),
        rect2Height = parseInt(sharedState.getCurrentRect().attr('height'));

      // 计算第二个矩形左侧中点的Y坐标
      const rect2MidY = rect2Y + rect2Height / 2;

      // 检测鼠标是否位于第二个矩形上方
      if (x >= rect2X && x <= rect2X + sharedState.getCurrentRect().attr('width') && y >= rect2Y && y <= rect2Y + rect2Height) {
        // 鼠标位于第二个矩形上方时，曲线终点固定在矩形的左侧中点
        drawCurve(rect2X, rect2MidY, true,selectedElement);
      } else {
        // 鼠标不在第二个矩形上方，曲线终点跟随鼠标移动
        drawCurve(x, y, false,selectedElement);
      }
    }else{
      drawCurve(x, y, false,selectedElement);
    }

  }


  function drawCurve(x, y, fixed,circle) {

    currentRect = sharedState.getCurrentRect();

    console.log("drawCurve fixed="+fixed)
    const startX = parseInt(circle.attr('cx')),
      startY = parseInt(circle.attr('cy'));
    let endX = x,
      endY = y;
    if(currentRect!=null && currentRect.attr &&  typeof currentRect.attr === "function"){
      if (fixed) {
        // 如果终点固定，则计算第二个矩形左侧中点的坐标，并考虑箭头长度的调整
        const rect2X = parseInt(currentRect.attr('x')),
          rect2Y = parseInt(currentRect.attr('y')),
          rect2Height = parseInt(currentRect.attr('height'));
        endX = rect2X - arrowLength; // 考虑箭头长度的调整
        endY = rect2Y + rect2Height / 2;
      }
      if(circle.attr("id").replace("circle-right-","")==currentRect.attr("id")){
        console.log("circle.attr(id)="+circle.attr("id").replace("circle-right-","")+" currentRect.attr(id)="+currentRect.attr("id"))
        return;
      }
    }

    // 使用当前时间戳和Math.random()来生成一个唯一的随机数
    function generateUniqueRandomNumber() {
      return Date.now() + Math.floor(Math.random() * 1000000);
    }
    
    // 调用函数生成唯一随机数
    var uniqueRandomNumber = generateUniqueRandomNumber();


    // 构建路径数据字符串，包括起始和终止的水平长度调整
    const pathData = `M ${startX},${startY}
                      C ${startX + startHorizontalLength},${startY} ${endX - endHorizontalLength},${endY} ${endX},${endY}`;
    currentPath.attr('d', pathData)
      .attr('marker-end', 'url(#arrow)')
      .attr("startX",startX)
      .attr("startY",startY)
      .attr("endX",endX)
      .attr("endY",endY);
      sharedState.setPaths(currentPath);



  }


  function dragEnded_cycle(event) {
    currentRect = sharedState.getCurrentRect();
    const mouse = d3.pointer(event, svg.node()); // 获取鼠标位置，相对于SVG容器
    const x = mouse[0],
      y = mouse[1];
    if(currentRect!=null && currentRect.attr &&  typeof currentRect.attr === "function"){
      const rect2X = parseInt(currentRect.attr('x')),
        rect2Y = parseInt(currentRect.attr('y')),
        rect2Width = parseInt(currentRect.attr('width')),
        rect2Height = parseInt(currentRect.attr('height'));
      const selectedElement = d3.select(this);
      if(selectedElement.attr("id").replace("circle-right-","")==currentRect.attr("id")){
        currentPath.attr('d', '');
        currentPath = null;
        //console.log("circle.attr(id)="+circle.attr("id").replace("circle-right-","")+" currentRect.attr(id)="+currentRect.attr("id"))
        return;
      }
      // 判断鼠标释放时是否在第二个矩形上方
      if (x < rect2X || x > rect2X + rect2Width || y < rect2Y || y > rect2Y + rect2Height) {
        currentPath.attr('d', ''); // 不在第二个矩形上方，删除曲线
      }else{
        let circleid = selectedElement.attr("id").replace("circle-right-","");
        let rectid = currentRect.attr("id").replace("rect-","");
        let pathid = "path-"+circleid+"-"+rectid;
        currentPath.attr("id",pathid);
        createPath(pathid,{"id":circleid,"x":currentPath.attr("startX"),"y":currentPath.attr("startY")}, {"id":rectid,"x":currentPath.attr("endX"),"y":currentPath.attr("endY")});
      }
    }else{
      currentPath.attr('d', '');
    }
    currentPath = null;
    // 如果鼠标在第二个矩形上方，曲线保持不变
  }

  function createPath(pathid,startObject, endObject) {
    // 创建路径并获取其ID（此处为示例，需要根据实际情况生成或指定ID）
    //let pathId = 'path-' + Object.keys(pathAssociations).length;

      // 存储路径与起始/终点对象的关系
    sharedState.setPathAssociation(pathid, {
      start: startObject, // 起始对象的引用或标识符
      end: endObject // 终点对象的引用或标识符
    });
  
  }

}