<script setup lang="ts">
import * as d3 from 'd3';
import { ref, onMounted, watch } from 'vue';

type DataItem = { label: string; value: number };

const props = withDefaults(
    defineProps<{
        data: DataItem[];
        height?: number;
        color?: string;
        fillColor?: string;
    }>(),
    {
        height: 220,
        color: 'var(--chart-1)',
        fillColor: 'var(--chart-1)',
    },
);

const container = ref<HTMLDivElement>();
const svgRef = ref<SVGSVGElement>();

function render() {
    if (!svgRef.value || !container.value || !props.data.length) return;

    const width = container.value.clientWidth;
    const height = props.height;
    const margin = { top: 12, right: 12, bottom: 28, left: 36 };

    const svg = d3.select(svgRef.value);
    svg.selectAll('*').remove();
    svg.attr('width', width).attr('height', height);

    const defs = svg.append('defs');
    const gradient = defs
        .append('linearGradient')
        .attr('id', 'area-gradient')
        .attr('x1', '0%')
        .attr('y1', '0%')
        .attr('x2', '0%')
        .attr('y2', '100%');
    gradient.append('stop').attr('offset', '0%').attr('stop-color', props.fillColor).attr('stop-opacity', 0.3);
    gradient.append('stop').attr('offset', '100%').attr('stop-color', props.fillColor).attr('stop-opacity', 0.02);

    const x = d3
        .scalePoint()
        .domain(props.data.map((d: DataItem) => d.label))
        .range([margin.left, width - margin.right]);

    const maxVal = d3.max(props.data, (d: DataItem) => d.value) ?? 1;
    const y = d3
        .scaleLinear()
        .domain([0, maxVal] as [number, number])
        .nice()
        .range([height - margin.bottom, margin.top]);

    // Grid lines
    svg.append('g')
        .attr('class', 'grid')
        .attr('transform', `translate(${margin.left},0)`)
        .call(
            d3
                .axisLeft(y)
                .ticks(4)
                .tickSize(-(width - margin.left - margin.right))
                .tickFormat(() => ''),
        )
        .call((g) => g.select('.domain').remove())
        .call((g) => g.selectAll('.tick line').attr('stroke', 'var(--border)').attr('stroke-dasharray', '3,3'));

    const line = d3
        .line<{ label: string; value: number }>()
        .x((d) => x(d.label)!)
        .y((d) => y(d.value))
        .curve(d3.curveMonotoneX);

    const area = d3
        .area<{ label: string; value: number }>()
        .x((d) => x(d.label)!)
        .y0(height - margin.bottom)
        .y1((d) => y(d.value))
        .curve(d3.curveMonotoneX);

    // Area fill
    svg.append('path')
        .datum(props.data)
        .attr('fill', 'url(#area-gradient)')
        .attr('d', area)
        .attr('opacity', 0)
        .transition()
        .duration(800)
        .attr('opacity', 1);

    // Line
    const path = svg
        .append('path')
        .datum(props.data)
        .attr('fill', 'none')
        .attr('stroke', props.color)
        .attr('stroke-width', 2.5)
        .attr('d', line);

    const totalLength = path.node()?.getTotalLength() || 0;
    path.attr('stroke-dasharray', totalLength)
        .attr('stroke-dashoffset', totalLength)
        .transition()
        .duration(1000)
        .attr('stroke-dashoffset', 0);

    // Dots
    svg.selectAll('.dot')
        .data(props.data)
        .enter()
        .append('circle')
        .attr('class', 'dot')
        .attr('cx', (d: DataItem) => x(d.label)!)
        .attr('cy', (d: DataItem) => y(d.value))
        .attr('r', 0)
        .attr('fill', 'var(--background)')
        .attr('stroke', props.color)
        .attr('stroke-width', 2)
        .transition()
        .duration(400)
        .delay((_, i) => i * 100 + 600)
        .attr('r', 4);

    // X axis
    svg.append('g')
        .attr('transform', `translate(0,${height - margin.bottom})`)
        .call(d3.axisBottom(x).tickSize(0))
        .call((g) => g.select('.domain').remove())
        .selectAll('text')
        .attr('fill', 'var(--muted-foreground)')
        .attr('font-size', '11px');

    // Y axis
    svg.append('g')
        .attr('transform', `translate(${margin.left},0)`)
        .call(d3.axisLeft(y).ticks(4).tickSize(0))
        .call((g) => g.select('.domain').remove())
        .selectAll('text')
        .attr('fill', 'var(--muted-foreground)')
        .attr('font-size', '11px');
}

onMounted(render);
watch(() => props.data, render, { deep: true });
</script>

<template>
    <div ref="container" class="w-full">
        <svg ref="svgRef" class="w-full"></svg>
    </div>
</template>
