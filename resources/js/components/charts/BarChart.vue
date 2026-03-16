<script setup lang="ts">
import * as d3 from 'd3';
import { ref, onMounted, watch } from 'vue';

type DataItem = { label: string; value: number };

const props = withDefaults(
    defineProps<{
        data: DataItem[];
        height?: number;
        color?: string;
        gradientFrom?: string;
        gradientTo?: string;
    }>(),
    {
        height: 220,
        color: 'var(--chart-1)',
        gradientFrom: 'var(--chart-1)',
        gradientTo: 'var(--chart-3)',
    },
);

const container = ref<HTMLDivElement>();
const svgRef = ref<SVGSVGElement>();

function render() {
    if (!svgRef.value || !container.value || !props.data.length) return;

    const width = container.value.clientWidth;
    const height = props.height;
    const margin = { top: 12, right: 8, bottom: 28, left: 36 };

    const svg = d3.select(svgRef.value);
    svg.selectAll('*').remove();
    svg.attr('width', width).attr('height', height);

    const defs = svg.append('defs');
    const gradient = defs
        .append('linearGradient')
        .attr('id', 'bar-gradient')
        .attr('x1', '0%')
        .attr('y1', '0%')
        .attr('x2', '0%')
        .attr('y2', '100%');
    gradient.append('stop').attr('offset', '0%').attr('stop-color', props.gradientFrom).attr('stop-opacity', 0.9);
    gradient.append('stop').attr('offset', '100%').attr('stop-color', props.gradientTo).attr('stop-opacity', 0.6);

    const x = d3
        .scaleBand()
        .domain(props.data.map((d: DataItem) => d.label))
        .range([margin.left, width - margin.right])
        .padding(0.35);

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

    // Bars with animation
    svg.selectAll('.bar')
        .data(props.data)
        .enter()
        .append('rect')
        .attr('class', 'bar')
        .attr('x', (d: DataItem) => x(d.label)!)
        .attr('width', x.bandwidth())
        .attr('y', height - margin.bottom)
        .attr('height', 0)
        .attr('rx', 4)
        .attr('ry', 4)
        .attr('fill', 'url(#bar-gradient)')
        .transition()
        .duration(600)
        .delay((_: DataItem, i: number) => i * 80)
        .attr('y', (d: DataItem) => y(d.value))
        .attr('height', (d: DataItem) => y(0) - y(d.value));

    // Value labels on bars
    svg.selectAll('.bar-label')
        .data(props.data)
        .enter()
        .append('text')
        .attr('class', 'bar-label')
        .attr('x', (d: DataItem) => x(d.label)! + x.bandwidth() / 2)
        .attr('y', (d: DataItem) => y(d.value) - 5)
        .attr('text-anchor', 'middle')
        .attr('fill', 'var(--muted-foreground)')
        .attr('font-size', '11px')
        .attr('font-weight', '500')
        .attr('opacity', 0)
        .text((d: DataItem) => d.value)
        .transition()
        .duration(400)
        .delay((_: DataItem, i: number) => i * 80 + 400)
        .attr('opacity', 1);

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
