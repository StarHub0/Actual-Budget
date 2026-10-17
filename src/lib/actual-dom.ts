/**
 * The hooks into Actual's DOM that ABT relies on, in one place: when an Actual update moves one,
 * this is the file to fix. Prefer test ids and structure over hashed classes and translated text.
 * No imports, so the smoke test (tests/smoke) can check these against a real Actual.
 */
export const byTestId = (id: string) => `[data-testid="${id}"]`;

/** A row in the budget table, a transaction table or a list page's table. */
export const ROW = byTestId("row");
/** Spreadsheet-backed values carry their cell's name, e.g. "budget202610!to-budget". */
export const CELL = "[data-cellname]";
/** List pages' tables (payees, rules, schedules, tags), not the transaction table. */
export const TABLE = byTestId("table");
/** Any modal, e.g. "schedule-edit-modal". */
export const MODAL = '[data-testid$="-modal"]';

// ── Titlebar and sidebar ────────────────────────────────────────────────

export const HELP_BUTTON = byTestId("help-menu-button");
export const NOTIFICATIONS_BUTTON = byTestId("notifications-button");
export const NOTIFICATIONS_COUNT = byTestId("notifications-unseen-count");
export const SIDEBAR_NAV = byTestId("sidebar-primary-buttons");
export const ALL_ACCOUNTS_BALANCE = byTestId("sidebar-all-accounts-balance");

// ── Budget page ─────────────────────────────────────────────────────────

export const BUDGET_TABLE = byTestId("budget-table");
export const BUDGET_SCROLLER = byTestId("budget-table-scroll-container");
/** The month card above the table: To Budget and its menu. */
export const BUDGET_SUMMARY = byTestId("budget-summary");
/** The table's header row of month totals. */
export const BUDGET_TOTALS = byTestId("budget-totals");
/** Only category rows have it, not group headers. */
export const CATEGORY_NAME = byTestId("category-name");
export const CATEGORY_ROW = `${ROW}:has(${CATEGORY_NAME})`;
/** A category's budgeted amount cell (holds the input while editing). */
export const BUDGETED_CELL = byTestId("budget");
/** A balance cell: a category's in the budget table, or a transaction table's running one. */
export const BALANCE_CELL = byTestId("balance");
/** Each shown month's column in the hidden native month picker. */
export const SELECTED_MONTH = byTestId("selected-budget-month");
export const SHOWN_MONTH = `${SELECTED_MONTH}[data-month]`;
/** A category's spent amount, and its button in the budget table. */
export const SPENT_CELL = byTestId("spent");
export const CATEGORY_SPENT = byTestId("category-month-spent");
/** A category row's amount cells, named "<sheet>!sum-amount-<id>" and "<sheet>!leftover-<id>". */
export const CATEGORY_AMOUNT_CELL = '[data-testid*="sum-amount-"], [data-testid*="leftover-"]';
/** The totals row's labels. */
export const BUDGET_TOTAL_LABELS =
	'[data-testid*="!total-budgeted"], [data-testid*="!total-spent"], [data-testid*="!total-leftover"]';
/** Spreadsheet balances: the sidebar's and accounts' (not balance queries) and categories'. */
export const SHEET_BALANCES =
	"span[data-testid^='__global!balance-']:not([data-testid^='__global!balance-query']), span[data-testid$='-balance']";
/** Envelope budgets' per-category amounts, e.g. "budget202610!sum-amount-<id>". */
export const ENVELOPE_AMOUNT = '[data-testid^="budget2"][data-testid*="!sum-amount-"]';

// ── Accounts and transaction tables ─────────────────────────────────────

export const ACCOUNT_NAME = byTestId("account-name");
export const ACCOUNT_BALANCE = byTestId("account-balance");
export const TRANSACTION_TABLE = byTestId("transaction-table");
export const TRANSACTION_ROW = `${TRANSACTION_TABLE} ${ROW}`;
export const TRANSACTION_HEADER = byTestId("transaction-table-header");
export const DATE_CELL = byTestId("date");
export const ACCOUNT_CELL = byTestId("account");
export const PAYEE_CELL = byTestId("payee");
export const NOTES_CELL = byTestId("notes");
/** A transaction's category cell ("Categorize" when it has none). */
export const CATEGORY_CELL = byTestId("category");
export const CLEARED_CELL = byTestId("cleared");
export const DEBIT_CELL = byTestId("debit");
export const CREDIT_CELL = byTestId("credit");
export const SELECT_CELL = byTestId("select");
/** A split transaction's parent row's category cell. */
export const GROUP_CELL = byTestId("group");
export const PAYMENT_CELL = byTestId("payment");
export const DEPOSIT_CELL = byTestId("deposit");

// ── Other pages ─────────────────────────────────────────────────────────

/** Dashboards and single reports alike. */
export const REPORTS_PAGE = byTestId("reports-page");
/** Each settings card list, one per settings page in newer Actual. */
export const SETTINGS = byTestId("settings");
export const SCHEDULE_EDITOR = byTestId("schedule-edit-modal");
export const AMOUNT_INPUT = byTestId("amount-input");
export const BANK_SYNC_PROVIDER = '[data-testid^="bank-sync-provider-"]';

// ── Mobile ──────────────────────────────────────────────────────────────

export const MOBILE_BUDGET_HEADER = byTestId("budget-table-header");
export const MOBILE_BUDGET_GROUPS = byTestId("budget-groups");
export const MOBILE_GROUP_ROW = byTestId("category-group-row");
export const MOBILE_CATEGORY_ROW = byTestId("category-row");
export const MOBILE_ACCOUNT_ROW = byTestId("account-list-item");
/** A budget card's heading text. */
export const MOBILE_HEADING_NAME = byTestId("name");

/**
 * What each page should have on a budget with a few accounts and Actual's default categories,
 * keyed by path. Anchors that need an open modal or an edit in progress aren't listed.
 */
export const PAGE_ANCHORS: Record<string, Record<string, string>> = {
	"/budget": {
		HELP_BUTTON,
		SIDEBAR_NAV,
		ALL_ACCOUNTS_BALANCE,
		BUDGET_TABLE,
		BUDGET_SCROLLER,
		BUDGET_SUMMARY,
		BUDGET_TOTALS,
		CATEGORY_ROW,
		BUDGETED_CELL,
		BALANCE_CELL,
		SHOWN_MONTH,
		CELL,
	},
	"/accounts": {
		ACCOUNT_NAME,
		ACCOUNT_BALANCE,
		TRANSACTION_TABLE,
		TRANSACTION_ROW,
		DATE_CELL,
		ACCOUNT_CELL,
		PAYEE_CELL,
		NOTES_CELL,
		CATEGORY_CELL,
		CLEARED_CELL,
		SELECT_CELL,
	},
	"/reports": { REPORTS_PAGE },
	"/schedules": { TABLE },
	"/payees": { TABLE },
	"/rules": { TABLE },
	"/settings": { SETTINGS },
};

/** The same, below Actual's mobile breakpoint. */
export const MOBILE_PAGE_ANCHORS: Record<string, Record<string, string>> = {
	"/budget": { MOBILE_BUDGET_HEADER, MOBILE_BUDGET_GROUPS, MOBILE_GROUP_ROW, MOBILE_CATEGORY_ROW },
	"/accounts": { MOBILE_ACCOUNT_ROW, ACCOUNT_NAME },
};
