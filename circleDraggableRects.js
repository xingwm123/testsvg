
import { createRoundAndLine } from './createRoundAndLine.js'

import { sharedState } from './common.js';



export function createDraggableRects(svg, rects) {

    let currentRect = null;

    let pathAssociations = {};

    const arrowLength = 10; // 箭头长度的估计值，根据实际标记大小调整

    let startHorizontalLength = 100; // 起点的水平长度
    let endHorizontalLength = 100; // 终点的水平长度

    // 绘制矩形并应用拖动行为
    const rectSelection = svg.selectAll('rect')
    .data(rects)
    .enter().append('rect')
    .attr('id', d => d.id)//d => d.id)
    .attr('x', d => d.x)
    .attr('y', d => d.y)
    .attr('width', d => d.width)
    .attr('height', d => d.height)
    .attr('fill', d => d.fill)
    .attr('stroke', d => d.stroke)
    .on('mouseover', function (event, d) {
      // 在mouseover事件中将当前矩形对象赋给全局变量
      sharedState.setCurrentRect(d3.select(this));
      currentRect = sharedState.getCurrentRect()
      console.log('Mouse is over the rectangle ' + d.id," attr.x="+currentRect.attr    ("x"));
    }).on('mouseout', function (event, d) {
      // 在mouseout事件中将currentRect设置为空
      sharedState.setCurrentRect(null);
      console.log('Mouse is out of the rectangle ' + d.id);
    });


    // 创建圆形
    createRoundAndLine(svg, rects);


    rectSelection.call(d3.drag()
    .on('start', dragStarted)
    .on('drag', dragged)
    .on('end', dragEnded));


    function dragStarted(event, d) {
        d3.select(this).raise().classed('active', true);
      }


      function dragged(event, d) {
        d.x += event.dx;
        d.y += event.dy;
        d3.select(this)
          .attr('x', d.x)
          .attr('y', d.y);
      
        // 更新关联圆形的位置
        // svg.selectAll(`.circle-left-${d.id}`)
        //   .attr('cx', d.x-5) // 更新为矩形的左上角X坐标
        //   .attr('cy', d.y + d.height / 2); // 更新为矩形的中点Y坐标
        let id = d.id.replace("rect-","")
        svg.selectAll(`.circle-right-${id}`)
          .attr('cx', d.x + d.width+5) // 更新为矩形的右上角X坐标
          .attr('cy', d.y + d.height / 2); // 更新为矩形的中点Y坐标
      
      
          // 更新当前拖动的矩形的位置
        d3.select(this)
        .attr('x', d.x = event.x)
        .attr('y', d.y = event.y);
        
        
        // 更新与当前矩形关联的活动矩形和拖拽控制点的位置
        svg.select(`#rect1-right-${id}`)
          .attr('x', d.x)
          .attr('y', d.y);
          
        svg.select(`#polygon-right-${id}`)
          .attr("transform", "translate(" + (d.x - 6) + ", " + (d.y + d.height - 5) + ")");
      
      
        d3.select(`#right-anchor-${id}`).attr("x", d.x + d.width - 3).attr("y", d.y);
        d3.select(`#left-anchor-${id}`).attr("x", d.x - 3).attr("y", d.y);
      
        updatePathPositions(id+"");
      
      
        //2. 找到所有以这个矩形为终点的线
      
      
        //3. 更新线的位置
      
    }

    function updatePathPositions(objectId) {
      pathAssociations = sharedState.getPathAssociations();
      // 根据被拖动对象的ID查找和更新所有关联的路径
      Object.entries(pathAssociations).forEach(([pathId, association]) => {
        if (association.start.id === objectId || association.end.id === objectId) {
          // 如果当前路径与被拖动的对象相关联，重新计算并更新路径
          let newPathD = calculatePathD(association.start, association.end);
          d3.select('#' + pathId).attr('d', newPathD);
        }
      });
    }
  
    function calculatePathD(startObject, endObject) {
      // 根据起始和终点对象的位置计算路径的"d"属性
      // 这里仅为示例，具体实现应根据起始和终点对象的实际位置来计算
  
      // const pathData = `M ${startX},${startY}
      //                   C ${startX + startHorizontalLength},${startY} ${endX - endHorizontalLength},${endY} ${endX},${endY}`;
      let startid = startObject.id;
      let endid = endObject.id;
      let start2 = d3.select("#circle-right-"+startid);
      // let end2 = d3.select("#rect"+endid);
      //startObject = {"id":startid,"x":start2.attr("x"),"y":start2.attr("y")}
      //endObject = {"id":endid,"x":end2.attr("x"),"y":end2.attr("y")}
  
      let startX = parseInt(start2.attr('cx')),
        startY = parseInt(start2.attr('cy'));
  
      let endRect = d3.select("#rect-"+endid);
      const rect2X = parseInt(endRect.attr('x')),
        rect2Y = parseInt(endRect.attr('y')),
        rect2Height = parseInt(endRect.attr('height'));
      let endX = rect2X - arrowLength; // 考虑箭头长度的调整
      let endY = rect2Y + rect2Height / 2;
  
      let pathData = `M ${startX},${startY} C ${startX+ startHorizontalLength},${startY} ${endX - endHorizontalLength},${endY} ${endX},${endY}`;
      return pathData;
    }


    function dragEnded(event, d) {
        d3.select(this).classed('active', false);
      
      }



}