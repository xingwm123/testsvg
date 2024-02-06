


export function createRelevanceLine(svg, rects) {
    
    
      // 绘制连接线
      rects.forEach(rect => {
        if(null != rect.subItemss && rect.subItemss.length > 0){
            rect.subItemss.forEach(childId => {
                const child = rects.find(n => n.id === childId);
                if (child) {
                  const startX = rect.x + rect.width / 2;
                  const startY = rect.y + rect.height;
                  const endX = child.x;
                  const endY = child.y + child.height / 2;
                  const pathD = `M ${startX} ${startY} V ${endY} H ${endX}`;
          
                  svg.insert('path', ":first-child")
                    .attr('d', pathD)
                    .attr('stroke', 'gray') // 设置线条颜色为灰色
                    .attr('stroke-width', 2) // 加粗线条，数值越大线条越粗
                    .attr('fill', 'none')
                    .attr('id', `path-${rect.id}-${child.id}`);
                }
              });
        }
      });
}