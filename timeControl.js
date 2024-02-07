
import { sharedState } from './common.js';

import { initializeOrUpdateChart } from './initializeOrUpdateChart.js';

export function timeControl(svg , rects) {

  const margin = { top: 20, right: 20, bottom: 30, left: 20 };
  const width = +svg.attr('width') - margin.left - margin.right;
  const height = +svg.attr('height') - margin.top - margin.bottom;
  const container = document.querySelector('.svg-container');
  let startDate, endDate, months, chineseLocale, chineseTimeFormat;
  let xScale, xAxis;
  // 根据选中的视图类型更新图表
  function updateChart(viewType) {
    

    // 先清除之前的图表内容
    svg.selectAll('*').remove();

    switch (viewType) {
      case 'day':
        // ... 你的天视图逻辑 ...
        break;
      case 'week':
        svg.selectAll('*').remove();
        svg.selectAll('g.axis').remove(); // 移除已有的坐标轴
        svg.selectAll('.year-month-label').remove(); // 移除已有的年月标签
        // 定义两周时间段的开始和结束日期
        startDate = new Date(2024, 0, 26); // 月份是从0开始的，0代表一月
        endDate = new Date(2024, 1, 9); // 结束日期设置为两周后
        chineseLocale = d3.timeFormatLocale({
          "dateTime": "%a %b %e %X %Y",
          "date": "%Y/%-m/%-d",
          "time": "%H:%M:%S",
          "periods": ["上午", "下午"],
          "days": ["星期日", "星期一", "星期二", "星期三", "星期四", "星期五", "星期六"],
          "shortDays": ["周日", "周一", "周二", "周三", "周四", "周五", "周六"],
          "months": ["一月", "二月", "三月", "四月", "五月", "六月", "七月", "八月", "九月", "十月", "十一月", "十二月"],
          "shortMonths": ["1月", "2月", "3月", "4月", "5月", "6月", "7月", "8月", "9月", "10月", "11月", "12月"]
        });
        xScale = d3.scaleTime()
          .domain([startDate, endDate])
          .range([margin.left, width - margin.right]);
        chineseTimeFormat = chineseLocale.format("%a %d");
        xAxis = d3.axisTop(xScale)
          .ticks(d3.timeDay.every(1))
          .tickFormat(chineseTimeFormat); // 使用中文格式化函数
        svg.append('g')
          .attr('class', 'axis')
          .attr('transform', `translate(0,${margin.top+40})`)
          .call(xAxis);

// 添加月份标签
        months = xScale.ticks(d3.timeMonth.every(1));
        months.forEach(month => {
          svg.append('text')
            .attr('class', 'month-label')
            .attr('x', xScale(month))
            .attr('y', margin.top) // 适当调整y坐标值
            .text(chineseLocale.format('%Y年%m月')(month)); // 使用中文格式化函数
        });
        // 绘制轴和月份标签的函数
      function weekdrawAxis() {
        // 移除旧的轴和标签
        svg.selectAll('g.axis').remove();
        svg.selectAll('.month-label').remove();

        svg.selectAll('*').remove();
        svg.selectAll('g.axis').remove(); // 移除已有的坐标轴
        svg.selectAll('.year-month-label').remove(); // 移除已有的年月标签

        // 绘制新的轴
        const gX = svg.append('g')
          .attr('class', 'axis')
          .attr('transform', `translate(${margin.left},${margin.top + 40})`)
          .call(xAxis);

        // 设置周末日期的文本颜色
        gX.selectAll('.tick text')
          .style('fill', function(d) {
            return (d.getDay() === 0 || d.getDay() === 6) ? 'lightgrey' : 'black';
          });

        // 重新绘制月份标签
        xScale.ticks(d3.timeMonth.every(1)).forEach(function(month) {
          svg.append('text')
            .attr('class', 'month-label')
            .attr('x', xScale(month))
            .attr('y', margin.top)
            .text(chineseLocale.format('%Y年%m月')(month));
        });
      }
// 今天按钮事件处理器
        document.getElementById('today-button').addEventListener('click', function() {
          const today = new Date();
          const todayPosition = xScale(today);
          container.scrollLeft = todayPosition - container.clientWidth / 2 + margin.left;
          updateCoordinates(); // 更新坐标
          dateLine()
          initializeOrUpdateChart(false);
        });

// 向左滚动按钮事件处理器
        document.getElementById('scroll-left').addEventListener('click', function() {
          startDate.setDate(startDate.getDate() - 6); // 向左滚动一天
          endDate.setDate(endDate.getDate() - 6);
          xScale.domain([startDate, endDate]);
          weekdrawAxis();
          container.scrollLeft -= 100;
          updateCoordinates(); // 更新坐标
          dateLine()
          initializeOrUpdateChart(false);
        });

// 向右滚动按钮事件处理器
        document.getElementById('scroll-right').addEventListener('click', function() {
          startDate.setDate(startDate.getDate() + 6); // 向右滚动一天
          endDate.setDate(endDate.getDate() + 6);
          xScale.domain([startDate, endDate]);
          weekdrawAxis();
          container.scrollLeft += 100;
          updateCoordinates(); // 更新坐标
          dateLine()
          initializeOrUpdateChart(false);
        });
        weekdrawAxis();
        break;
      case 'month':
        svg.selectAll('*').remove();
        svg.selectAll('g.axis').remove(); // 移除已有的坐标轴
        svg.selectAll('.year-month-label').remove(); // 移除已有的年月标签
        // 定义40天时间段的开始和结束日期
        startDate = new Date();
        startDate.setDate(startDate.getDate() - startDate.getDay()); // 移到当前周的周日
        endDate = new Date(startDate);
        endDate.setDate(startDate.getDate() + 40); // 40天后

        // 创建x轴的时间比例尺
        xScale = d3.scaleTime()
          .domain([startDate, endDate])
          .range([0, width]);

        // 绘制x轴，每天显示一个刻度
        xAxis = d3.axisTop(xScale)
          .ticks(d3.timeDay.every(1))
          .tickFormat(d3.timeFormat('%d'))
          .tickSizeOuter(0);

        // 添加x轴到SVG，并设置周末刻度文字颜色
        const gXMonth = svg.append('g')
          .attr('class', 'axis')
          .attr('transform', `translate(${margin.left},${margin.top+40})`)
          .call(xAxis);

        gXMonth.selectAll('.tick text')
          .classed('weekend-text', d => d.getDay() === 0 || d.getDay() === 6);

        // 添加月份标签
        months = xScale.ticks(d3.timeMonth.every(1));
        months.forEach((month, i) => {
          gXMonth.append('text')
            .attr('class', 'month-label')
            .attr('x', xScale(month))
            .attr('y', margin.top) // 确保这个值将标签放在视图内
            .text(d3.timeFormat('%Y年%m月')(month));
        });

      function monthdrawAxis() {
        // 移除已有的轴和标签
        svg.selectAll('g.axis').remove();
        svg.selectAll('.month-label').remove();

        svg.selectAll('*').remove();
        svg.selectAll('g.axis').remove(); // 移除已有的坐标轴
        svg.selectAll('.year-month-label').remove(); // 移除已有的年月标签

        // Adjusted margin top to create space for month labels
        const axisTopMargin = margin.top + 20; // Add more space for month labels above the axis

        // Create new axis
        const gX = svg.append('g')
          .attr('class', 'axis')
          .attr('transform', `translate(${margin.left},${axisTopMargin})`)
          .call(xAxis);

        // Set the color for weekend text labels
        gX.selectAll('.tick text')
          .style('fill', function(d) {
            return (d.getDay() === 0 || d.getDay() === 6) ? 'lightgrey' : 'black';
          });

        // Add new month labels above the axis line
        xScale.ticks(d3.timeMonth.every(1)).forEach(function(month) {
          svg.append('text')
            .attr('class', 'month-label')
            .attr('x', xScale(month))
            .attr('y', margin.top - 10) // Adjust this value to move label above the axis
            .text(d3.timeFormat('%Y年%m月')(month));
        });
      }


        document.getElementById('today-button').addEventListener('click', function() {
          const today = new Date();
          const todayPosition = xScale(today);
          container.scrollLeft = todayPosition - container.clientWidth / 2 + margin.left;
          updateCoordinates(); // 更新坐标
          dateLine()
            initializeOrUpdateChart(false);
        });

        document.getElementById('scroll-left').addEventListener('click', function () {
          startDate.setDate(startDate.getDate() - 30); // 向左滚动一天
          endDate.setDate(endDate.getDate() - 30);
          xScale.domain([startDate, endDate]);
          monthdrawAxis();
          container.scrollLeft -= 100;
          updateCoordinates(); // 更新坐标
          dateLine()
            initializeOrUpdateChart(false);
        });

        document.getElementById('scroll-right').addEventListener('click', function () {
          startDate.setDate(startDate.getDate() + 30); // 向右滚动一天
          endDate.setDate(endDate.getDate() + 30);
          xScale.domain([startDate, endDate]);
          monthdrawAxis();
          container.scrollLeft += 100;
          updateCoordinates(); // 更新坐标
          dateLine()
            initializeOrUpdateChart(false);
        });
        monthdrawAxis();
        break;
      case 'quarter':
        svg.selectAll('*').remove();
        svg.selectAll('g.axis').remove(); // 移除已有的坐标轴
        svg.selectAll('.year-month-label').remove(); // 移除已有的年月标签

        // 设置开始和结束日期以覆盖半年的时间
        const today = new Date();
        startDate = new Date(today.getFullYear(), today.getMonth() - 6, 1); // 半年前的第一天
        endDate = new Date(today.getFullYear(), today.getMonth() + 6, 0); // 半年后的最后一天

        // 设置x轴的时间比例尺，覆盖半年时间
        xScale = d3.scaleTime()
          .domain([startDate, endDate])
          .range([0, width]);

        // 绘制坐标轴
      function quarterdrawAxis() {

        svg.selectAll('*').remove();
        svg.selectAll('g.axis').remove(); // 移除已有的坐标轴
        svg.selectAll('.year-month-label').remove(); // 移除已有的年月标签
        // 移除旧的轴和标签
        svg.selectAll('g.axis').remove();
        svg.selectAll('.month-label').remove();

        // 计算每7天一个刻度的值
        const everySevenDays = d3.utcDay.range(startDate, d3.utcDay.offset(endDate, 1)).filter(function(d) {
          return d.getUTCDay() === 1;
        });

        const xAxis = d3.axisBottom(xScale)
          .tickSizeInner(6)
          .tickSizeOuter(0)
          .tickPadding(10)
          .tickValues(everySevenDays) // 使用每7天的刻度值
          .tickFormat(d3.timeFormat('%-d')); // 仅格式化日期

        const gX = svg.append('g')
          .attr('class', 'axis')
          .attr('transform', `translate(0, ${height - 40})`)
          .call(xAxis);

        // 添加年月标签
        const firstDayOfMonths = xScale.ticks(d3.timeMonth);
        firstDayOfMonths.forEach((firstDayOfMonth) => {
          svg.append('text')
            .attr('class', 'year-month-label')
            .attr('x', xScale(firstDayOfMonth))
            .attr('y', margin.top + 40) // 适当调整y坐标值，使标签出现在时间轴上方
            .text(d3.timeFormat('%Y年%m月')(firstDayOfMonth))
            .attr('text-anchor', 'middle'); // 文本居中对齐
        });
      }

        quarterdrawAxis();
        container.scrollLeft = xScale(today) - container.offsetWidth / 2; // 滚动到今天

        document.getElementById('today-button').addEventListener('click', function () {
          container.scrollLeft = xScale(today) - container.offsetWidth / 2;
          updateCoordinates(); // 更新坐标
          dateLine()
            initializeOrUpdateChart(false);
        });

        document.getElementById('scroll-left').addEventListener('click', function () {
          startDate.setDate(startDate.getDate() - 90); // 向左滚动一天
          endDate.setDate(endDate.getDate() - 90);
          xScale.domain([startDate, endDate]);
          quarterdrawAxis();
          container.scrollLeft -= 100;
          updateCoordinates(); // 更新坐标
          dateLine()
            initializeOrUpdateChart(false);
        });

        document.getElementById('scroll-right').addEventListener('click', function () {
          startDate.setDate(startDate.getDate() + 90); // 向右滚动一天
          endDate.setDate(endDate.getDate() + 90);
          xScale.domain([startDate, endDate]);
          quarterdrawAxis();
          container.scrollLeft += 100;
          updateCoordinates(); // 更新坐标
          dateLine()
            initializeOrUpdateChart(false);
        });
        quarterdrawAxis();
        break;
    }

     // 保存日期的x坐标
  const dates = d3.timeDay.range(startDate, endDate); // 生成开始日期和结束日期之间的每一天
  dates.forEach(date => {
    const x = xScale(date);
    sharedState.setCoordinates(d3.timeFormat("%Y-%m-%d")(date), { x });
    console.log(`Saving coordinates for key: ${d3.timeFormat("%Y-%m-%d")(date)}`, x);
  });



  function generateUniqueRandomNumber() {
    return Date.now() + Math.floor(Math.random() * 1000000);
  }
  
  // 调用函数生成唯一随机数
  var uniqueRandomNumber = generateUniqueRandomNumber();

  function dateLine() {
    svg.selectAll('[id^="date-line-"]').remove();
    const currentDate = new Date();
    const currentXPosition = xScale(currentDate);

    // 在SVG中添加红色垂直线
    svg.append('line')
      .attr('x1', currentXPosition)
      .attr('x2', currentXPosition)
      .attr('y1', 40)
      .attr('y2', 800)
      .attr('stroke', 'red')
      .attr('stroke-width', 2)
      .attr('id', `date-line-${uniqueRandomNumber}`); // 添加唯一ID
  }

  const currentDate = new Date();
const currentXPosition = xScale(currentDate);
svg.selectAll('[id^="date-line-"]').remove();
// 在SVG中添加红色垂直线
svg.append('line')
  .attr('x1', currentXPosition)
  .attr('x2', currentXPosition)
  .attr('y1', 40)
  .attr('y2', 800)
  .attr('stroke', 'red')
  .attr('stroke-width', 2)
  .attr('id', `date-line-${uniqueRandomNumber}`); // 添加唯一ID

  }
  

  // 绑定下拉框事件
  document.getElementById('timeframe-select').addEventListener('change', function() {
    svg.selectAll('*').remove();
    svg.selectAll('g.axis').remove(); // 移除已有的坐标轴
    svg.selectAll('.year-month-label').remove(); // 移除已有的年月标签
    updateChart(this.value);
    rects.forEach(rect => {
      localStorage.removeItem(`${rect.id}-x`);
    });
    sharedState.clearCoordinates();
    updateCoordinates(); // 更新坐标
    initializeOrUpdateChart(false);
  });


  function updateCoordinates() {
    sharedState.clearCoordinates(); // 清除之前的坐标
    const dates = d3.timeDay.range(startDate, endDate); // 生成开始日期和结束日期之间的每一天
    dates.forEach(date => {
      const x = xScale(date); // 使用xScale来获取每个日期的x坐标
      sharedState.setCoordinates(d3.timeFormat("%Y-%m-%d")(date), { x }); // 更新sharedState中的坐标
      console.log(`Updating coordinates for key: ${d3.timeFormat("%Y-%m-%d")(date)}`, x);
    });
  }


  // 页面加载后初始化图表
  document.addEventListener("DOMContentLoaded", function() {
    updateChart('day'); // 根据需要调整初始视图
  });


  
}