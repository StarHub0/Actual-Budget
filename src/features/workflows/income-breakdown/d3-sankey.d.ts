// d3-sankey ships no types; this covers what the chart uses.
declare module "d3-sankey" {
	export interface SankeyNodeLayout {
		index: number;
		x0: number;
		x1: number;
		y0: number;
		y1: number;
		value: number;
	}

	export interface SankeyLinkLayout<N> {
		source: N;
		target: N;
		value: number;
		width: number;
		y0: number;
		y1: number;
	}

	export interface SankeyLayout<N, L> {
		(graph: { nodes: N[]; links: L[] }): {
			nodes: (N & SankeyNodeLayout)[];
			links: SankeyLinkLayout<N & SankeyNodeLayout>[];
		};
		nodeId(id: (node: N & SankeyNodeLayout) => string | number): this;
		nodeWidth(width: number): this;
		nodePadding(padding: number): this;
		nodeAlign(align: (node: SankeyNodeLayout, n: number) => number): this;
		extent(extent: [[number, number], [number, number]]): this;
	}

	export function sankey<N, L>(): SankeyLayout<N, L>;
	export function sankeyJustify(node: SankeyNodeLayout, n: number): number;
	export function sankeyLinkHorizontal(): (
		link: SankeyLinkLayout<SankeyNodeLayout>,
	) => string | null;
}
