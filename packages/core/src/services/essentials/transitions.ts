// Internal Imports
import { Service } from '../service';
import * as Configuration from '../../configuration';
import { Events } from './../../interfaces';
import { Tools } from '../../tools';

// D3 Imports
import { Transition, transition } from 'd3-transition';
import { selection } from 'd3-selection';

// D3 v7 compatibility: selection.transition(parentTransition) throws
// "transition X not found" when the parent transition has already ended,
// or "too late; already running" when a same-named transition is active.
// Patch to catch these errors and fall back to a new transition with the
// saved duration, so all 90+ call sites continue to work unchanged.
const selectionProto = selection.prototype;
const _originalTransition = selectionProto.transition;
selectionProto.transition = function (name?: any) {
	try {
		return _originalTransition.call(this, name);
	} catch (e) {
		const msg = e && (e as Error).message;
		const isTransitionError =
			msg &&
			(msg.indexOf('not found') !== -1 ||
				msg.indexOf('too late') !== -1);
		if (isTransitionError && name && name._savedDuration !== undefined) {
			return _originalTransition
				.call(this)
				.duration(name._savedDuration);
		}
		throw e;
	}
};

export class Transitions extends Service {
	pendingTransitions = {};
	// transitions: Transition<any, any, any, any>[];

	init() {
		this.services.events.addEventListener(Events.Model.UPDATE, () => {
			this.pendingTransitions = {};
		});
	}

	getTransition(
		name?: string,
		animate?: boolean
	): Transition<any, any, any, any> {
		if (this.model.getOptions().animations === false || animate === false) {
			return this.getInstantTransition(name);
		}

		const duration =
			Tools.getProperty(Configuration.transitions, name, 'duration') ||
			Configuration.transitions.default.duration;
		const t: any = transition(name).duration(duration);

		// Store duration for the D3 v7 fallback patch above
		t._savedDuration = duration;

		this.pendingTransitions[t._id] = t;
		t.on('end interrupt cancel', () => {
			delete this.pendingTransitions[t._id];
		});

		return t;
	}

	getInstantTransition(name?: string): Transition<any, any, any, any> {
		const t: any = transition(name).duration(0);

		// Store duration for the D3 v7 fallback patch above
		t._savedDuration = 0;

		this.pendingTransitions[t._id] = t;
		t.on('end interrupt cancel', () => {
			delete this.pendingTransitions[t._id];
		});

		return t;
	}

	getPendingTransitions() {
		return this.pendingTransitions;
	}
}
