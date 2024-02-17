
3. 只有鼠标放在任务条边上的时候才出现黑色的拖动条，默认不要出现
4. 只有鼠标放在任务条边上的时候才出现红色的关联锚点，默认不要出现
5. 表格行拖动的时候，调整甘特图任务条的位置
6. 任务条前面显示名字的图标
7. 拖动移动位置的时候，左右分别显示开始日期和结束日期



1. 在页面上做了拖动任务之后，调用保存接口
2. 设置关联线，调用保存接口
9. 表格样式，换成已有项目的表格控件
8. 关联线要在任务条的下方穿过，z-index要在下层


1. 整合已有功能




1. 箭头左右，动态调整刻度和宽度。 3小时
15：13
// 更新比例尺的范围
xScale.range([newLeftMargin, newWidth - newRightMargin]);

// 选择坐标轴并重绘
svg.select('.axis')
   .call(d3.axisBottom(xScale));
// 创建一个时间比例尺
const xScale = d3.scaleTime()
  .domain([startDate, endDate]) // 设置比例尺的定义域为开始日期和结束日期
  .range([0, width]); // 设置比例尺的值域为SVG的宽度

// 获取相邻时间刻度之间的距离
const tickValues = xScale.ticks(); // 获取所有的刻度值
let distanceBetweenTicks = 0;
if (tickValues.length > 1) {
  distanceBetweenTicks = xScale(tickValues[1]) - xScale(tickValues[0]); // 计算相邻刻度的像素距离
}
总体思路：
获取相邻时间刻度之间的距离x，增加了多少个刻度y，总的增加的像素的数量就是x*y。
当前滚动的位置scrollLeft
offsetWidth，clientWidth。scrollWidth
只是要使用该元素的滚动属性（scrollHeight, scrollWidth, scrollTop, scrollLeft）
以及其客户区大小（clientHeight, clientWidth）。

offsetWidth = width+2*padding*+2*border
clientWidth = padding-left + width + padding-right

宽度增加


function getScrollbarWidth() {
    // 创建一个临时的div元素
    const outer = document.createElement('div');
    outer.style.visibility = 'hidden';
    outer.style.overflow = 'scroll'; // 强制它有滚动条
    document.body.appendChild(outer);

    // 创建一个内部div元素并添加到外部div中
    const inner = document.createElement('div');
    outer.appendChild(inner);

    // 计算滚动条的宽度（外部元素的宽度减去内部元素的宽度）
    const scrollbarWidth = outer.offsetWidth - inner.offsetWidth;

    // 清理：从文档中移除临时创建的元素
    document.body.removeChild(outer);

    return scrollbarWidth;
}

console.log(getScrollbarWidth()); // 输出滚动条的宽度

，在这个例子中，clientWidth实际上等于容器指定的宽度加上内边距的宽度，但因为滚动条通常出现在内部可视区域内部，所以实际可视内容的宽度可能会稍微小于计算出的clientWidth，如果考虑到滚动条的存在。但是，通常滚动条的宽度影响被忽略，因为clientWidth的定义就是不包括滚动条的。

1.1. 初始化的宽度，要计算出来，而不是固定写死。 2小时
SVG的宽度，由单个刻度的宽度，总的刻度数量来决定。 



2. 只有鼠标放在任务条边上的时候才出现黑色的拖动条，默认不要出现 2小时
默认隐藏，mouseover的时候才出现。 有个注意点就是鼠标放在锚点上，也要添加mouseover事件，而不是光在矩形上添加。 



3. 只有鼠标放在任务条边上的时候才出现红色的关联锚点，默认不要出现 2小时
有一个隐藏的透明层，在红点下方。 透明层加上mouseover和out，记得在红点上也要加上over和out事件，


4. 任务条前面显示名字的图标 1小时
// 添加图像作为图标
svg.append("image")
   .attr("x", 60) // 图标的x坐标，根据需要调整
   .attr("y", 30) // 图标的y坐标
   .attr("width", 20) // 图像的宽度
   .attr("height", 20) // 图像的高度
   .attr("xlink:href", "图标的URL"); // 图标的URL
   
 或者
 // 添加FontAwesome图标
        svg.append("text")
            .attr("x", 50) // 图标的x坐标，根据需要调整
            .attr("y", 50) // 图标的y坐标
            .text(function(d) { return '\uf2b9'; }) // FontAwesome图标的Unicode字符
            .style("font-family", 'FontAwesome') // 指定FontAwesome字体
            .style("font-size", "20px") // 图标大小
            .style("fill", "black"); // 图标颜色
			
不复杂，只要设置好位置即可



5. 拖动移动位置的时候，左右分别显示开始日期和结束日期  2小时
把startDate和endDate显示出来
5.1 鼠标放上去的时候、拖动的时候，日期显示出来。


5.5 删除图标
已完成控件。 



6. 关联线要在任务条的下方穿过，z-index要在下层  3小时



7. 拖动的时候， 只有拖放在整数天上才可以确认，如果不在整数天上，就自动挪到整数天上去。 3小时



8. 如果只有开始日期或者结束日期在刻度上，那么应该怎么显示矩形？ 



    let scale = sharedState.getxScale();
    let correspondingTime_start = scale.invert(d.x);
    let formattedTime_start = correspondingTime_start.toLocaleDateString('en-CA');

    let correspondingTime_end = scale.invert(d.x + d.width);
    let formattedTime_end = correspondingTime_end.toLocaleDateString('en-CA');

    svg.selectAll('#left-text-' + d.id)
      .attr("x", d.x - 100) // 图标的x坐标，根据需要调整
      .attr("y", d.y + 20) // 图标的y坐标
      .text(formattedTime_start) // FontAwesome图标的Unicode字符

    svg.selectAll('#right-text-' + d.id)
      .attr("x", d.x + d.width + 20) // 图标的x坐标，根据需要调整
      .attr("y", d.y + 20) // 图标的y坐标
      .text(formattedTime_end) // FontAwesome图标的Unicode字符
	  
    d3.select("#text-name-"+d.id.replace("rect-",""))
      .attr('x', d.x+10)




circleDraggableRects.js : 根据json画任务条，mouseover加上日期和左右的拖动条
createRoundAndLine.js  画圆形，画曲线，调用删除线的事件
createDeformationrectangle.js  矩形左右的调整矩形大小的黑线
timeController-xwm.js  控制画时间坐标轴



把 这个页面http://localhost:8000/projects/62568939010?view=tasklist 的列表放在时间线的左边。 

1. 仿照taskList\index.tsx重新写一个GantTaskList组件。
2. 如何获取到箭头的展开事件？
onExpand: (param: ExpandType) => MTableFuncs.onTaskExpand({ param, listParam: pageValues.listConditions })
/api/task/list
payload:"U2FsdGVkX1/9EmmqQIjsQydaXJLgV"
请求的时候会有加密。 

3. 

csix

import '@/static/iconfont2/iconfont.css'

src/pages/projectsDetail/Right/index.tsx  里面引用
 {activeKey === 'timeline-d3' && <MyTaskList projectId={projectId} taskTypes={typeOptions} onChangeDoneProcess={(p: number) => setProcess(p)} userId={userId} refreshList={refreshList}  />}

src/pages/tasks/timeline-d3/gantt/main.tsx 是MyTaskList


下午要解决问题 2月17号 14：07
1. 对齐问题. 3小时
	要将按钮相对父元素向上偏移5像素
	坐标轴top减少到37
	左边的表格头高度调整到60
	月份y调整到22
	

2. 滚动条问题 4小时
	右侧滚动条y向去掉，保留右侧x向滚动条
	总体保留y向滚动条，有更多任务的时候，可以看到更多任务
	
	
3. 数据源统一问题  4小时
4. 展开事件传递触发问题   4小时
5. 按钮的样式问题（调用之前的控件） 4小时
6. 红色原点隐藏  4小时
7. 蓝色的连线变成虚线 2小时
8. 红色当前线要变成绿色  10分钟
9. 左侧的表格去掉编号，收藏列，将展开按钮和图标与任务名称放同一列。
10. 左侧的表格的任务名称列，添加一个增加按钮
          const el = node.getElementsByClassName("gantt_tree_content")[0];
          el.addEventListener('click', function (event) {
            event.preventDefault()
            history.push(`/tasks/${task.id}`)
          })
          if (el) {
            el.innerHTML = `
              <span style="display: flex; align-items: center; justify-content: space-between;">
                <span class="icon-task"></span>
                <span style="font-size: 14px;cursor: pointer">${task.name}</span>
              </span>`;
          }
		  
		  


代码整理，8小时
