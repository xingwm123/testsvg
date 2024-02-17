
import { sharedState } from './common.js';

export default function delLineEvent(line, svg, lineX2,lineY2){


  // 定义按钮的属性
  const btnWidth = 18;
  const btnHeight = 18;
  const btnX = lineX2-5; // 假设您想将按钮放在某个特定的X坐标
  const btnY = lineY2-10; // 假设您想将按钮放在某个特定的Y坐标
  const id = line.attr("id").replace("path-","");
  // 绘制红色矩形按钮
  const button = svg.append('rect')
    .attr("id","close-btn-"+id)
    .attr('x', btnX)
    .attr('y', btnY)
    .attr('width', btnWidth)
    .attr('height', btnHeight)
    .attr('fill', 'red')
    .attr("style","display:none")
    .attr('rx', 4) // 为矩形添加圆角
    .attr('ry', 4);

  // 在按钮中绘制白色交叉线
  const crossPadding = 3; // 交叉线与按钮边缘的内边距
  const cross = svg.append('g'); // 创建一个用来包含两条线的组
  cross.attr("style","display:none")
  // 绘制交叉线的第一条线
  cross.append('line')
    .attr("id","close-line1-"+id)
    .attr('x1', btnX + crossPadding)
    .attr('y1', btnY + crossPadding)
    .attr('x2', btnX + btnWidth - crossPadding)
    .attr('y2', btnY + btnHeight - crossPadding)
    .attr('stroke', 'white')
    .attr('stroke-width', 2);

  // 绘制交叉线的第二条线
  cross.append('line')
    .attr("id","close-line2-"+id)
    .attr('x1', btnX + crossPadding)
    .attr('y1', btnY + btnHeight - crossPadding)
    .attr('x2', btnX + btnWidth - crossPadding)
    .attr('y2', btnY + crossPadding)
    .attr('stroke', 'white')
    .attr('stroke-width', 2);

  line.on('mouseover', function() {
    // 显示删除图标前，确保它在SVG中的顺序最后，以显示在最上层

    button.style('display', 'block');
    cross.style("display","block")
  }).on('mouseout', function() {
    button.style('display', 'none');
    cross.style('display', 'none');
  });

  // 计算删除图标和热区矩形的位置
  const rectX = lineX2 - 8; // 微调以对齐矩形中心到线条末端
  const rectY = lineY2 - 8;
  const rectWidth = 10; // 矩形宽度
  const rectHeight = 10; // 矩形高度
  // 添加透明热区矩形
  const hotRect = svg.append('rect')
    .attr("id","close-hotrect-"+id)
    .attr('x', rectX)
    .attr('y', rectY)
    .attr('width', rectWidth)
    .attr('height', rectHeight)
    .style('fill', 'rgba(0,0,0,0)') // 透明填充
    .classed('hot-area', true);


  // 当鼠标悬停在热区矩形上时显示删除图标
  hotRect.on('mouseover', function() {
    button.style('display', 'block');
    cross.style("display","block")
  }).on('mouseout', function() {
    button.style('display', 'none');
    cross.style('display', 'none');
  });

  // 点击图标删除线
  hotRect.on('click', function() {
    line.remove(); // 删除线条
    let id = line.attr('id').replace("path-","");
    //delete relatedElements[id];//circleid+"-"+rectid
    sharedState.deleteRelatedElements(id);
    hotRect.remove();
    button.remove(); // 删除按钮
    cross.remove();
    d3.select(this).remove(); // 删除图标
  });
}
