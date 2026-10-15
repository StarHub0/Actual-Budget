import { Page } from "@lib/utilities/pages";
import {
	Banknote,
	ChartColumn,
	ClipboardList,
	Cog,
	FlaskConical,
	LayoutGrid,
	type LucideIcon,
	Settings,
	SlidersHorizontal,
	Tag,
	Users,
	Wrench,
} from "@lucide/svelte";

export const navItems = [
	{ label: "Budget", page: Page.Budget, icon: LayoutGrid },
	{ label: "Reports", page: Page.Reports, icon: ChartColumn },
	{ label: "Schedules", page: Page.Schedules, icon: ClipboardList },
];

export const settingsItem = { label: "Settings", page: Page.Settings, icon: Settings };

/** The pages Actual groups under Settings, in its order. */
export const settingsPages = [
	{ label: "Payees", page: Page.Payees, icon: Users },
	{ label: "Tags", page: Page.Tags, icon: Tag },
	{ label: "Rules", page: Page.Rules, icon: SlidersHorizontal },
	{ label: "Bank Sync", page: Page.BankSync, icon: Banknote },
];

export const settingsMenu = [
	{ label: "General", page: Page.Settings, icon: Wrench },
	...settingsPages,
];

/** Icons for Actual's settings nav (actualbudget/actual#9110), by its links' last path segment. */
export const settingsNavIcons: Record<string, LucideIcon> = {
	general: Wrench,
	schedules: ClipboardList,
	payees: Users,
	tags: Tag,
	rules: SlidersHorizontal,
	"bank-sync": Banknote,
	advanced: Cog,
	experimental: FlaskConical,
};
