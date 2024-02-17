import {createRoundAndLine} from './createRoundAndLine.js'

import {createRelevanceLine} from './relevanceLine.js'

import {sharedState} from './common.js';

import delLineEvent from './lineDel.js';

let currentRect = null;

let pathAssociations = {};

const arrowLength = 10; // 箭头长度的估计值，根据实际标记大小调整

let startHorizontalLength = 100; // 起点的水平长度
let endHorizontalLength = 100; // 终点的水平长度


export function createDraggableRects(svg, rects) {


  // 绘制矩形并应用拖动行为
  const rectSelection = svg.selectAll('rect')
    .data(rects)
    .enter().append('rect')
    .attr('id', d => d.id)//d => d.id)
    .attr('x', d => d.x)
    .attr('y', d => d.y)
    .attr('width', d => d.width)
    .attr('height', d => d.height)
    .attr('startDate', d => d.startDate)
    .attr('endDate', d => d.dueDate)
    .attr('fill', "#E3EBF1")
    .attr('stroke', 'black')
    .on('mouseover', function (event, d) {
      // 在mouseover事件中将当前矩形对象赋给全局变量
      sharedState.setCurrentRect(d3.select(this));
      currentRect = sharedState.getCurrentRect()
      svg.append("text")
        .attr("id", "left-text-" + d.id)
        .attr("x", d.x - 100) // 图标的x坐标，根据需要调整
        .attr("y", d.y + 20) // 图标的y坐标
        .text(currentRect.attr("startDate")) // FontAwesome图标的Unicode字符

      svg.append("text")
        .attr("id", "right-text-" + d.id)
        .attr("x", d.x + d.width + 20) // 图标的x坐标，根据需要调整
        .attr("y", d.y + 20) // 图标的y坐标
        .text(currentRect.attr("endDate")) // FontAwesome图标的Unicode字符
      const id = d.id.replace("rect-", "");
      svg.select("#left-anchor-"+id).style("display","block");
      svg.select("#right-anchor-"+id).style("display","block");

      console.log('Mouse is over the rectangle ' + d.id, " attr.x=" + currentRect.attr("x"));
    }).on('mouseout', function (event, d) {
      // 在mouseout事件中将currentRect设置为空
      sharedState.setCurrentRect(null);
      console.log('Mouse is out of the rectangle ' + d.id);
      svg.selectAll('#left-text-' + d.id).remove();
      svg.selectAll('#right-text-' + d.id).remove();
      const id = d.id.replace("rect-", "");
      svg.select("#left-anchor-"+id).style("display","none");
      svg.select("#right-anchor-"+id).style("display","none");

    });


  // 创建圆形
  createRoundAndLine(svg, rects);

  createRelevanceLine(svg, rects);


  rectSelection.call(d3.drag()
    .on('start', dragStarted)
    .on('drag', dragged)
    .on('end', dragEnded));



  rects.forEach(rect => {
    let id = rect.id.replace("rect-", "");
    const rectobj = svg.select("#" + rect.id);
    svg.append("text")
      .attr("id","text-name-"+id)
      .attr("x", parseInt(rectobj.attr("x"))+10) // 图标的x坐标，根据需要调整
      .attr("y", parseInt(rectobj.attr("y"))+20) // 图标的y坐标
      .text(rect.name) // FontAwesome图标的Unicode字符
      .style("font-size", "10px") // 图标大小
      .style("fill", "black"); // 图标颜色
  });


  function dragStarted(event, d) {
    d3.select(this).classed('active', true);
  }


  function dragged(event, d) {
    console.log("dragged....")
    d.x += event.dx;
    // 不更新 d.y，因此矩形不会在垂直方向上移动
    d3.select(this)
      .attr('x', d.x)
    // .attr('y', d.y); // 这行被注释掉或移除，因为我们不更新y坐标
    d3.select("#text-name-"+d.id.replace("rect-",""))
      .attr('x', d.x+10)
    // 保存矩形的新位置到本地存储
    localStorage.setItem(`${d.id}-x`, d.x);

    // 更新关联圆形的位置
    let id = d.id.replace("rect-", "");
    svg.selectAll(`.circle-right-${id}`)
      .attr('cx', d.x + d.width + 5) // 更新为矩形的右上角X坐标
      .attr('cy', d.y + d.height / 2); // Y坐标保持不变

    // 更新当前拖动的矩形的位置
    d3.select(this)
      .attr('x', d.x = event.x)
    // .attr('y', d.y); // 同样，不更新y坐标

    // 更新与当前矩形关联的活动矩形和拖拽控制点的位置
    svg.select(`#rect1-right-${id}`)
      .attr('x', d.x)
    // .attr('y', d.y); // 不需要更新y坐标
    var storedTriangleX2 = parseFloat(localStorage.getItem(`rect1-right-${id}-x`)); // 获取存储的数字并转换为浮点数
    var storedTriangleX = d.x - 6;
    if (localStorage.getItem(`rect1-right-${id}-x`)) {
      storedTriangleX = d.x + storedTriangleX2 - 6;
    }
    svg.select(`#polygon-right-${id}`)
      .attr("transform", "translate(" + (storedTriangleX) + ", " + (d.y + d.height) + ")");

    d3.select(`#right-anchor-${id}`).attr("x", d.x + d.width - 3); // y坐标保持不变
    d3.select(`#left-anchor-${id}`).attr("x", d.x - 3); // 同上

    updateText(svg,d);

    updatePathPositions(svg,id + "",false);

    updateLinks(svg, rects)


  }

  function dragEnded(event, d) {
    d3.select(this).classed('active', false);
    console.log("dragEnded...")
    let id = d.id.replace("rect-", "");
    updatePathPositions(svg,id + "",true);

  }


}

export function calculatePathD(svg,pathId,startObject, endObject,isend) {
  // 根据起始和终点对象的位置计算路径的"d"属性
  // 这里仅为示例，具体实现应根据起始和终点对象的实际位置来计算

  // const pathData = `M ${startX},${startY}
  //                   C ${startX + startHorizontalLength},${startY} ${endX - endHorizontalLength},${endY} ${endX},${endY}`;
  let startid = startObject.id;
  let endid = endObject.id;
  let start2 = d3.select("#circle-right-" + startid);
  if (!start2.empty()) {
    // let end2 = d3.select("#rect"+endid);
    //startObject = {"id":startid,"x":start2.attr("x"),"y":start2.attr("y")}
    //endObject = {"id":endid,"x":end2.attr("x"),"y":end2.attr("y")}

    let startX = parseInt(start2.attr('cx')),
      startY = parseInt(start2.attr('cy'));

    let endRect = d3.select("#rect-" + endid);
    const rect2X = parseInt(endRect.attr('x')),
      rect2Y = parseInt(endRect.attr('y')),
      rect2Height = parseInt(endRect.attr('height'));
    let endX = rect2X - arrowLength; // 考虑箭头长度的调整
    let endY = rect2Y + rect2Height / 2;
    let pathData = `M ${startX},${startY} C ${startX + startHorizontalLength},${startY} ${endX - endHorizontalLength},${endY} ${endX},${endY}`;
    d3.select('#' + pathId).attr('d', pathData);
    if(isend){
      // currentPath.attr("id",pathid);
      // createPath(pathid,{"id":circleid,"x":currentPath.attr("startX"),"y":currentPath.attr("startY")}, {"id":rectid,"x":currentPath.attr("endX"),"y":currentPath.attr("endY")});
      // delLineEvent(currentPath,svg,currentPath.attr("endX"),currentPath.attr("endY"))
      const id = pathId.replace("path-","");
      //close-hotrect-62569570942-62569570949
      d3.select("#close-btn-"+id).remove();
      d3.select("#close-line1-"+id).remove();
      d3.select("#close-line2-"+id).remove();
      d3.select("#close-hotrect-"+id).remove();
      delLineEvent( d3.select('#' + pathId),svg,endX,endY)
    }
     return pathData;
  } else {
    console.log("--------------------------------------------------------------------------------------start2 is empty");
  }

}


export function updatePathPositions(svg,objectId,isend) {
  pathAssociations = sharedState.getPathAssociations();
  // 根据被拖动对象的ID查找和更新所有关联的路径
  Object.entries(pathAssociations).forEach(([pathId, association]) => {
    if (association.start.id === objectId || association.end.id === objectId) {
      // 如果当前路径与被拖动的对象相关联，重新计算并更新路径
      let newPathD = calculatePathD(svg,pathId,association.start, association.end,isend);

    }
  });
}

export function updateText(svg,d){
  const id = d.id.replace("rect-", "");
  const rect = d3.select("#" + d.id);

  const x = rect.attr("x")
  const y = rect.attr("y")
  const width = rect.attr("width")
  console.log("updateText",x,width,id)

  let scale = sharedState.getxScale();
  let correspondingTime_start = scale.invert(x);
  let formattedTime_start = correspondingTime_start.toLocaleDateString('en-CA');

  let correspondingTime_end = scale.invert(parseInt(x) + parseInt(width));
  let formattedTime_end = correspondingTime_end.toLocaleDateString('en-CA');
  rect.attr("startDate",formattedTime_start);
  rect.attr("endDate",formattedTime_end);
  if(svg.select("#left-text-rect-" + id).empty()){
    svg.append("text")
      .attr("id", "left-text-rect-" + id)
      .attr("x", d.x - 100) // 图标的x坐标，根据需要调整
      .attr("y", d.y + 20) // 图标的y坐标
      .text(currentRect.attr("startDate")) // FontAwesome图标的Unicode字符
    svg.append("text")
      .attr("id", "right-text-rect-" + id)
      .attr("x", d.x + d.width + 20) // 图标的x坐标，根据需要调整
      .attr("y", d.y + 20) // 图标的y坐标
      .text(currentRect.attr("endDate")) // FontAwesome图标的Unicode字符
  }else{
    svg.selectAll('#left-text-rect-' + id)
      .attr("x", parseInt(x) - 100) // 图标的x坐标，根据需要调整
      .attr("y", parseInt(y) + 20) // 图标的y坐标
      .text(formattedTime_start) // FontAwesome图标的Unicode字符
    svg.selectAll('#right-text-rect-' + id)
      .attr("x", parseInt(x) + parseInt(width) + 20) // 图标的x坐标，根据需要调整
      .attr("y", parseInt(y) + 20) // 图标的y坐标
      .text(formattedTime_end) // FontAwesome图标的Unicode字符

  }

  const rectobj = svg.select("#rect-" + id);
  svg.select("#text-name-"+id)
    .attr("x", parseInt(rectobj.attr("x"))+10) // 图标的x坐标，根据需要调整
    .attr("y", parseInt(rectobj.attr("y"))+20) // 图标的y坐标
    //.text(rectobj.attr("name")) // FontAwesome图标的Unicode字符
    .style("font-size", "10px") // 图标大小
    .style("fill", "black"); // 图标颜色


}

// 用来更新连接线的函数
export function updateLinks(svg, rects) {
  rects.forEach(rect => {
    rect.subItemss.forEach(childId => {
      const child = rects.find(n => n.id === childId);
      if (child) {
        const startX = rect.x + rect.width / 2;
        const startY = rect.y + rect.height;
        const endX = child.x;
        const endY = child.y + child.height / 2;
        const pathD = `M ${startX} ${startY} V ${endY} H ${endX}`;
        svg.select(`#path-${rect.id}-${child.id}`).attr('d', pathD);
      }
    });
  });
}
