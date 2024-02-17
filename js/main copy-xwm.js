

import { initializeOrUpdateChart } from '../initializeOrUpdateChart-xwm.js';


document.addEventListener('DOMContentLoaded', function() {
    const svg = d3.select("svg");
    initializeOrUpdateChart(true);
  });
