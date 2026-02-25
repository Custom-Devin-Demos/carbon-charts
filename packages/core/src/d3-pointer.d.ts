// Augment d3-selection with D3 v7 pointer function (not in @types/d3-selection v1.x)
// pointer() replaces the removed d3.mouse() and d3.touch()
import 'd3-selection';

declare module 'd3-selection' {
	export function pointer(event: any, target?: any): [number, number];
}
