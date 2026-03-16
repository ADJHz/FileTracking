<script setup lang="ts">
import * as d3 from 'd3';
import { ref, onMounted, watch, computed } from 'vue';

const props = withDefaults(
    defineProps<{
        data: { label: string; value: number }[];
        size?: number;
        thickness?: number;
        colors?: string[];
    }>(),
    {
        size: 200,
        thickness: 32,
        colors: () => [
            'var(--chart-1)',
            'var(--chart-2)',
            'var(--chart-3)',
            'var(--chart-4)',
            'var(--chart-5)',
        ],
    },
);

const svgRef = ref<SVGSVGElement>();

const total = computed(() => props.data.reduce((sum: number, d) => sum + d.value, 0));

function render() {
    if (!svgRef.value || !props.data.length) return;

    const size = props.size;
    const radius = size / 2;
    const innerRadius = radius - props.thickness;

    const svg = d3.select(svgRef.value);
    svg.selectAll('*').remove();
    svg.attr('width', size).attr('height', size);

    const g = svg.append('g').attr('transform', `translate(${radius},${radius})`);

    const pie = d3
        .pie<{ label: string; value: number }>()
        .value((d) => d.value)
        .sort(null)
        .padAngle(0.03);

    const arc = d3.arc<d3.PieArcDatum<{ label: string; value: number }>>().innerRadius(innerRadius).outerRadius(radius).cornerRadius(4);

    const arcs = g
        .selectAll('.arc')
        .data(pie(props.data))
        .enter()
        .append('path')
        .attr('class', 'arc')
        .attr('fill', (_, i) => props.colors[i % props.colors.length])
        .attr('opacity', 0.85)
        .each(function (d) {
            (this as any)._current = { startAngle: d.startAngle, endAngle: d.startAngle };
        });

    arcs.transition()
        .duration(800)
        .delay((_, i) => i * 100)
        .attrTween('d', function (d) {
            const interpolate = d3.interpolate((this as any)._current, d);
            (this as any)._current = interpolate(1);
            return (t: number) => arc(interpolate(t)) || '';
        })
        .attr('opacity', 1);

    // Center text
    g.append('text')
        .attr('text-anchor', 'middle')
        .attr('dy', '-0.1em')
        .attr('fill', 'var(--foreground)')
        .attr('font-size', '24px')
        .attr('font-weight', '700')
        .text(total.value);

    g.append('text')
        .attr('text-anchor', 'middle')
        .attr('dy', '1.4em')
        .attr('fill', 'var(--muted-foreground)')
        .attr('font-size', '11px')
        .text('Total');
}

onMounted(render);
watch(() => props.data, render, { deep: true });
</script>

<template>
    <div class="flex flex-col items-center gap-4">
        <svg ref="svgRef"></svg>
        <div class="flex flex-wrap justify-center gap-x-4 gap-y-1">
            <div v-for="(item, i) in data" :key="item.label" class="flex items-center gap-1.5 text-xs">
                <span class="inline-block h-2.5 w-2.5 rounded-full" :style="{ backgroundColor: colors[i % colors.length] }"></span>
                <span class="text-muted-foreground">{{ item.label }}</span>
                <span class="font-medium">{{ item.value }}</span>
            </div>
        </div>
    </div>
</template>
