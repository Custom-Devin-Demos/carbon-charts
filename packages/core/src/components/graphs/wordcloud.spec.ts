import { Events } from '../../interfaces';
import { select } from 'd3-selection';
import { createChartHolder } from '../../tests/tools';
import * as Charts from '../../index';
import { wordCloudData, wordCloudOptions } from '../../../demo/data/wordcloud';

describe('wordcloud component', () => {
	let chart;
	let holder;

	beforeEach(function (done) {
		holder = createChartHolder('wordcloud');
		chart = new Charts.WordCloudChart(holder, {
			data: wordCloudData,
			options: wordCloudOptions,
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
		it('should render word cloud text elements', function () {
			const texts = select(holder).selectAll('text');
			expect(texts.size()).toBeGreaterThan(0);
		});

		it('should render without errors', function () {
			// Verifies the chart renders successfully with D3 v7
			expect(chart).toBeDefined();
		});
	});

	afterEach(function () {
		chart.destroy();
		holder.remove();
	});
});
