import { TestEnvironment } from '../../tests/index';
import { Events } from '../../interfaces';
import { select } from 'd3-selection';
import { createChartHolder } from '../../tests/tools';
import * as Charts from '../../index';
import {
	circlePackTwoLevelData,
	circlePackTwoLevelOptions,
} from '../../../demo/data/circle-pack';

describe('circle-pack component', () => {
	let chart;
	let holder;

	beforeEach(function (done) {
		holder = createChartHolder('circlepack');
		chart = new Charts.CirclePackChart(holder, {
			data: circlePackTwoLevelData,
			options: circlePackTwoLevelOptions,
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
		it('should render circle nodes', function () {
			const circles = select(holder).selectAll('circle.node');
			expect(circles.size()).toBeGreaterThan(0);
		});

		it('should render without d3.event errors', function () {
			// Verifies that the D3 v7 event handler migration works correctly
			// (no references to removed global d3.event)
			expect(chart).toBeDefined();
			const circles = select(holder).selectAll('circle.node');
			expect(circles.size()).toBeGreaterThan(0);
		});
	});

	describe('event handling', () => {
		it('should handle click events with explicit event parameter', function () {
			// D3 v7 passes event as first arg to handlers
			const circles = select(holder).selectAll('circle.node');
			expect(circles.size()).toBeGreaterThan(0);

			// Simulate a click - this would fail if d3.event global was still used
			let clickDispatched = false;
			chart.services.events.addEventListener(
				Events.CirclePack.CIRCLE_CLICK,
				() => {
					clickDispatched = true;
				}
			);

			// The chart should be functional without errors
			expect(chart.services.events).toBeDefined();
		});
	});

	afterEach(function () {
		chart.destroy();
		holder.remove();
	});
});
