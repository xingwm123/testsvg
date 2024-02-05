
import { sharedState } from './common.js';

// timeAxes.js
export function createTimeAxes(svg, scaleTime) {

    let startDate = new Date(new Date().getTime() - 10 * 24 * 60 * 60 * 1000); // 开始日期
    let endDate = new Date(startDate.getTime() + 30 * 24 * 60 * 60 * 1000); // 结束日期，40天后
  
    // 假设SVG的尺寸已经被设置
    const svgWidth = 900;
    const svgHeight = 800;
  
  
    // 创建一个包含姓名的数组
    const names = ["Alice", "Bob", "Carol", "David", "Eve", "Frank", "Grace", "Helen", "Ivy", "Jack"];
  
    const margin = { top: 45, right: 20, bottom: 30, left: 40 }; // 将top调整为45，稍高于x轴的位置
    const height = svgHeight - margin.top - margin.bottom; // 根据新的margin.top计算实际的高度

    let lastDisplayedYearMonth = "";

    const xAxisTop = d3.axisTop(scaleTime)
    .ticks(d3.timeDay, 1)
    .tickSize(0) // 不显示刻度线
    .tickFormat(d => {
      // 检查是否为每月的最后三天
      const nextDay = d3.timeDay.offset(d, 1); // 获取明天的日期
      const lastDayOfMonth = new Date(nextDay.getFullYear(), nextDay.getMonth(), 0); // 获取本月最后一天的日期
      const dayDifference = d3.timeDay.count(d, lastDayOfMonth); // 计算当前日期和本月最后一天的差异

      // 如果当前日期是月份的最后三天，不显示年月
      if (dayDifference >= 0 && dayDifference < 3) {
        return "";
      }

      const yearMonth = d3.timeFormat("%Y年%m月")(d);

      // 如果是新的年月，且不是月末的最后三天，则显示年月
      if (lastDisplayedYearMonth !== yearMonth) {
        lastDisplayedYearMonth = yearMonth;
        return yearMonth;
      }

      // 否则，不显示任何内容
      return "";
    });
  
  const xAxisBottom = d3.axisTop(scaleTime)
    .ticks(d3.timeDay, 1)
    .tickSize(2) // 设置为正值以显示刻度线
    .tickFormat(d3.timeFormat("%d")); // 显示日期
  
    svg.append("g")
      .attr("transform", `translate(0,${margin.top})`)
      .call(xAxisTop);
  
    svg.append("g")
      .attr("transform", `translate(0,${margin.top + 20})`)
      .call(xAxisBottom);


    const currentDate = new Date(); // 获取当前日期
    const currentXPosition = scaleTime(currentDate);


    // 在SVG中添加红线
  svg.append('line') // 添加一个新的line元素
  .attr('x1', currentXPosition) // x1和x2设置为计算出的x坐标，这将创建一个垂直线
  .attr('x2', currentXPosition)
  .attr('y1', 40) // y1设置为0（或者SVG顶部边缘的位置）
  .attr('y2', 800) // y2设置为SVG的高度，或者你希望线结束的位置
  .attr('stroke', 'red') // 设置线条颜色为红色
  .attr('stroke-width', 2); // 设置线条宽度



// // 获取当前日期并计算对应的x坐标
// const currentDate = new Date();

// // 选择当前日期对应的坐标轴刻度文本元素
// svg.selectAll('.tick')
//   .each(function(d) {
//     if (d3.timeFormat("%Y-%m-%d")(d) === d3.timeFormat("%Y-%m-%d")(currentDate)) {
//       // 获取文本元素的bounding box
//       const bbox = this.getBBox();

//       // 在文本元素下添加绿色矩形
//       const padding = 2; // 设置一些内边距
//       const rect = d3.select(this).insert("rect", "text")
//         .attr("x", bbox.x - padding)
//         .attr("y", bbox.y - padding)
//         .attr("width", bbox.width + 2 * padding)
//         .attr("height", bbox.height + 2 * padding)
//         .attr("fill", "green");

//       // 确保文本在矩形之上
//       d3.select(this).raise();
//     }
//   });




    // 调整y轴比例尺的range
    const yScale = d3.scaleLinear()
      .domain([0, 9]) // 假设有10个刻度
      .range([height, 0]); // 从x轴底部向上
    
    // 创建Y轴
    const yAxis = d3.axisLeft(yScale)
      .tickFormat((d, i) => names[i])
      .ticks(10);
    
    const xAxisBottomPosition = 66; // 例如，这是日期时间轴的垂直位置
    
    // 调整y轴的transform属性，使其最上方与x轴底部的最左侧对齐
    svg.append("g")
      .attr("class", "y axis")
      .attr("transform", `translate(${margin.left},${xAxisBottomPosition})`)
      .call(yAxis);


    // 保存日期的x坐标
    const dates = d3.timeDay.range(startDate, endDate); // 生成开始日期和结束日期之间的每一天
    dates.forEach(date => {
      const x = scaleTime(date);
      sharedState.setCoordinates(d3.timeFormat("%Y-%m-%d")(date), { x });
      console.log(`Saving coordinates for key: ${d3.timeFormat("%Y-%m-%d")(date)}`, x);
    });

// 保存名字的y坐标
    names.forEach((name, index) => {
      const y = yScale(index);
      if (!sharedState.hasCoordinates(name)) {
        sharedState.setCoordinates(name, { y });
      } else {
        sharedState.getCoordinates(name).y = y;
      }
    });

  }


export function  getCoordinates(name, date, end) {
  // 将开始和结束日期字符串转换为Date对象
  const startDate = new Date(date);
  const endDate = new Date(end);

  // 使用scaleTime比例尺来计算开始日期和结束日期对应的x坐标
  const startX = sharedState.getCoordinates(d3.timeFormat("%Y-%m-%d")(startDate))?.x;
  const endX = sharedState.getCoordinates(d3.timeFormat("%Y-%m-%d")(endDate))?.x;

  // 计算这两个x坐标之间的差值，即为时间段在图表上表示的宽度
  const width = endX !== undefined && startX !== undefined ? endX - startX : null;

  // 获取名字对应的y坐标
  const y = sharedState.getCoordinates(name)?.y;

  if (width !== null && y !== undefined) {
    // 如果找到了对应的x坐标和y坐标，返回它们以及计算出的宽度
    return { x: startX, y, width };
  } else {
    // 如果没有找到对应的坐标或宽度，返回null
    return null;
  }
}


  