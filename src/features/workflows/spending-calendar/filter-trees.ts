import {
	accountIconPicker,
	loadIconCache,
	type AccountIconData,
} from "@features/appearance/account-icon-picker";
import {
	loadAssignments,
	loadGroups,
	type AccountGroup,
} from "@features/workflows/sidebar/lib/groups";
import { applyOrder, loadAccountOrder } from "@features/workflows/sidebar/lib/order";
import type { Account, Category, CategoryGroup } from "@lib/types/actual-schema";
import { loadCurrentBudgetId } from "@lib/utilities/actual-api";
import { getValue } from "@lib/utilities/store";
import type { TreeSection } from "./FilterTree.svelte";

export type FilterAccount = Pick<Account, "id" | "name" | "type" | "offbudget" | "closed">;

/** ABT's sidebar icons, groups and order, so the account list reads like the sidebar. */
export interface AccountLayout {
	icons: Record<string, AccountIconData>;
	groups: Record<string, AccountGroup>;
	assignments: Record<string, string>;
	order: string[];
}

export async function loadAccountLayout(): Promise<AccountLayout> {
	const budgetId = await loadCurrentBudgetId();
	const [iconsOn, icons, groups, assignments, order] = await Promise.all([
		getValue(accountIconPicker.context.key, accountIconPicker.context.defaultValue),
		loadIconCache().catch(() => ({})),
		loadGroups(budgetId),
		loadAssignments(budgetId),
		loadAccountOrder(budgetId),
	]);
	return { icons: iconsOn ? icons : {}, groups, assignments, order };
}

export function accountSections(
	accounts: FilterAccount[],
	layout: AccountLayout,
	hideOffBudget: boolean,
): TreeSection<FilterAccount>[] {
	const open = applyOrder(
		accounts.filter((a) => !a.closed && !(hideOffBudget && a.offbudget)),
		layout.order,
	);
	const groupOf = (id: string) => layout.groups[layout.assignments[id]]?.id;

	return (["onbudget", "offbudget"] as const).map((kind) => {
		const inSection = open.filter((a) => a.offbudget === (kind === "offbudget"));
		return {
			id: kind,
			label: kind === "onbudget" ? "On Budget" : "Off Budget",
			items: inSection.filter((a) => !groupOf(a.id)),
			groups: Object.values(layout.groups)
				.filter((g) => g.section === kind)
				.sort((a, b) => a.order - b.order)
				.map((g) => ({
					id: g.id,
					label: g.label,
					items: inSection.filter((a) => groupOf(a.id) === g.id),
				})),
		};
	});
}

export function categorySections(
	groups: Pick<CategoryGroup, "id" | "name">[],
	categories: Pick<Category, "id" | "name" | "group">[],
): TreeSection[] {
	return groups.map((g) => ({
		id: g.id,
		label: g.name,
		items: categories.filter((c) => c.group === g.id),
		groups: [],
	}));
}
