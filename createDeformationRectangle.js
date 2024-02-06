

import { updatePathPositions, updateLinks } from './circleDraggableRects.js'


export function createDeformationRectangle(svg, rects) {

    rects.forEach(rect => {
        let id = rect.id.replace("rect-", "");

        svg.append("rect")
            .attr("id", `right-anchor-${id}`)
            .attr("x", rect.x + rect.width - 3)
            .attr("y", rect.y)
            .attr("width", 6)
            .attr("height", rect.height)
            .style("fill", "black")
            .style("cursor", "ew-resize")
            .call(d3.drag().on("drag", function(event) { dragRightAnchor(event, rect); }));


        svg.append("rect")
            .attr("id", `left-anchor-${id}`)
            .attr("x", rect.x - 3)
            .attr("y", rect.y)
            .attr("width", 6)
            .attr("height", rect.height)
            .style("fill", "black")
            .style("cursor", "ew-resize")
            .call(d3.drag().on("drag", function(event) { dragLeftAnchor(event, rect); }));
        });


        function dragRightAnchor(event, rect) {
            var newWidth = Math.max(10, event.x - rect.x);
            rect.width = newWidth;
            d3.select(`#rect-${rect.id}`).attr("width", newWidth);
            updateRelatedElements(rect);
            updatePathPositions(rect.id.replace("rect-","")+"");
        }

        function dragLeftAnchor(event, rect) {
            var newWidth = Math.max(10, rect.x + rect.width - event.x);
            var newX = rect.x + rect.width - newWidth;
            rect.x = newX;
            rect.width = newWidth;
            d3.select(`#rect-${rect.id}`)
                .attr("x", newX)
                .attr("width", newWidth);
            updateRelatedElements(rect);
          updatePathPositions(rect.id.replace("rect-","")+"");
        }


        function updateRelatedElements(rect) {
            let id = rect.id.replace("rect-","")
              // 更新当前拖动的矩形的位置
              d3.select(`#right-anchor-${id}`).attr("x", rect.x + rect.width - 3);
              d3.select(`#left-anchor-${id}`).attr("x", rect.x - 3);
            d3.selectAll(`#${rect.id}`)
            .attr('x', rect.x)
            .attr('y', rect.y)
            .attr('width', rect.width)
            .attr('height', rect.height);

            d3.selectAll(`.circle-right-${id}`)
              .attr('cx', rect.x + rect.width+8) // 更新为矩形的右上角X坐标
              .attr('cy', rect.y + rect.height / 2); // 更新为矩形的中点Y坐标

              updateLinks(svg,rects)
        }

}

