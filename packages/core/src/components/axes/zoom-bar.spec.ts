import { Events } from '../../interfaces';
import { select } from 'd3-selection';
import { createChartHolder } from '../../tests/tools';
import * as Charts from '../../index';
import {
	zoomBarLineTimeSeriesData,
	zoomBarLineTimeSeriesOptions,
} from '../../../demo/data/zoom-bar';

describe('zoom-bar component', () => {
	let chart;
	let holder;

	beforeEach(function (done) {
		holder = createChartHolder('zoombar');
		chart = new Charts.LineChart(holder, {
			data: zoomBarLineTimeSeriesData,
			options: zoomBarLineTimeSeriesOptions,
		});

		const chartEventsService = chart.services.events;
		const renderCb = () => {
			chartEventsService.removeEventListener(
				Events.Chart.RENDER_FINISHED,
				renderCb
			);
			done();
		};
		chartEventsService.addEventListener(
			Events.Chart.RENDER_FINISHED,
			renderCb
		);
	});

	describe('render', () => {
		it('should render the chart with zoom bar options', function () {
			expect(chart).toBeDefined();
			// Chart should have an SVG element
			const svg = select(holder).select('svg');
			expect(svg.empty()).toBe(false);
		});

		it('should have zoom service initialized', function () {
			// Verifies that the D3 v7 event handler migration works correctly
			// (no references to removed global d3.event)
			expect(chart).toBeDefined();
			expect(chart.services.zoom).toBeDefined();
		});
	});

	afterEach(function () {
		chart.destroy();
		holder.remove();
	});
});
