# Live bank SMS

Enable SMS from **Scan messages** and allow SMS and notification permissions.
Existing installations with only inbox permission must enable SMS again to grant
the receive permission. Historical scans still use the existing review flow.

New completed bank messages run through the bundled parser in a queued Android
background worker. A confidently matched account is saved automatically. An
unknown account stays pending and shows **Create account**. Categories use the
resolved suggestion, then **Personal**, separately for income and expense.

The notification shows the bank logo and account on the left, a signed amount
on the right (green credits, red debits), and category artwork below. The bank
name is not repeated in the header and account detail. A **Category** pill
includes the resolved category icon and opens the shared transaction picker.
**Create account** is shown only for an unlinked SMS account, prefilling its bank,
currency, account type and suffix; saving links it for future SMS. The Android
notification shade closes when the picker opens, but the notification is not
cancelled. Picking a value updates it without another alert. Swiping a
notification away does not delete its transaction.

Notification headers use the short application label **Simple Money**, with
**Amount credited** / **Amount debited** as Android notification subtext.
The launcher and application icon is the wallet on a white adaptive tile
(`ic_launcher_wallet2`, built by `app/tool/generate_launcher_icons.py`); the
notification small icons use the bare transparent artwork, which Android
draws as a silhouette. ColorOS keeps the first icon it drew for a given icon
resource, so rename it (and the manifest references) whenever the icon
changes and a phone still shows the old one. The monochrome notification small icon remains
transparent too; a phone's System UI may still add its own icon mask/background.
Notification pills are 32dp high with 13sp labels and 16dp category artwork; the
bank logo is 28dp.

**Between my accounts** asks for the other account. For a debit, the SMS account
is the source; for a credit it is the destination. Matching debit/credit messages
share one transfer only with an exact reference, matching amount/currency,
opposite directions, matching account identities and timestamps within five
minutes. Missing or ambiguous references do not automatically merge messages.

When choosing the other account, messages with different or missing references
can appear in **Possible matching transaction**. Suggestions still require the
same amount/currency, opposite directions, the chosen accounts and the same
five-minute window. Select the specific entry and confirm **Combine as transfer**,
or choose **Keep separate**. Cancelling changes nothing. A late SMS can also be
attached to an existing transfer this way. Matches are revalidated when saved.

Processing respects the SMS enable switch. Android may defer background work;
force-stopping the app prevents SMS delivery until it is opened again.
Notification permission is independent of saving permission.

## Verification

Repository tests cover directional Personal fallback, deleted fallback recovery,
retry deduplication, account/category changes and balances, missing accounts,
transfer conversion and reversal, matching both SMS sides, late counterparts,
disabled processing, deletion and subsequent edits in the full editor.

The native receiver, notification layout and headless entry point compile in the
Android debug APK. Device acceptance checks still needed:

Notifications lead with a red outgoing / green incoming vector arrow and the
`Amount from Party` / `Amount to Party` title (or credited/debited
when the party is unknown). Expanded titles can wrap to two lines.
The bank logo, bank name and masked account are on the
second line; the category icon and name are on the third. Both secondary lines
use 18.7dp icons. All custom notification text, including buttons, uses 14sp.
Buttons are right-aligned. There is no separate right-side amount.
Transparent app artwork is enlarged within Android's
system-controlled header icon slot. The text-only action is
`Change category`; unmatched banks also offer `Create account`.

Selecting a category replaces the same notification with `Saved as Category`
and Undo. A recognized counterparty is remembered locally for future realtime
SMS of the same direction (normalized exact name). Missing parties and generic
transfer labels do not create rules; those confirmations only claim that this
transaction was updated. Undo restores the prior category and merchant rule,
without changing later payments or overwriting a newer correction. Confirmation
and undo state survive background engine/activity restarts.

Only the notification's `Change category` action opens the category picker.
The notification body (including a saved confirmation) opens the existing
transaction view sheet above an SMS transaction preview modal. Back dismisses
the transaction view and reveals that preview; it does not launch the category
picker. Pending messages without a ledger entry show the preview with account
creation available. Category edits from the transaction view also refresh the
saved confirmation and preserve the previous category for Undo.

1. Enable SMS and notifications; receive a completed transaction with the app
   foregrounded, backgrounded, and removed from Recents (not force-stopped).
2. Confirm exactly one ledger entry and the signed amount/bank/category icon.
3. Tap account and category separately; select values and reopen the shade to
   verify the same notification remains with updated values.
4. Try a credit, debit, unmatched account, denied notifications, and a multipart
   message. Verify OTP, failed, pending and promotional messages are ignored.
5. Select Between my accounts, then receive the opposite bank SMS with the same
   reference; confirm a single transfer and the two account balances.
