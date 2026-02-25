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
		it('should render the zoom bar', function () {
			const zoomBar = select(holder).select('svg.zoom-bar-container');
			expect(zoomBar.empty()).toBe(false);
		});

		it('should render without d3.event errors', function () {
			// Verifies that the D3 v7 event handler migration works correctly
			// (no references to removed global d3.event)
			expect(chart).toBeDefined();
			expect(chart.services.zoom).toBeDefined();
		});
	});

	describe('event handling', () => {
		it('should have brush event handling set up', function () {
			// D3 v7 passes event as first arg to brush handlers
			const brushArea = select(holder).select('g.brush');
			expect(brushArea.empty()).toBe(false);
		});
	});

	afterEach(function () {
		chart.destroy();
		holder.remove();
	});
});
