

import { initializeOrUpdateChart } from '../initializeOrUpdateChart.js';


document.addEventListener('DOMContentLoaded', function() {
    const svg = d3.select("svg");
    initializeOrUpdateChart(true);
  });
