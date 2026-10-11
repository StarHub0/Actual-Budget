import { dispatch } from "@lib/utilities/actual-api";
import { createLogger } from "@lib/utilities/logger";

const log = createLogger("calendar");

/** Actual tags the editor's overlay with this, so its closing can refresh the calendar. */
export const SCHEDULE_EDITOR = '[data-testid="schedule-edit-modal"]';

/** Opens Actual's own schedule editor, which saves (or not) on the user's say. */
export function editSchedule(id: string): void {
	dispatch("pushModal", { modal: { name: "schedule-edit", options: { id } } }).catch((e) =>
		log.warn("could not open the schedule editor", e),
	);
}
