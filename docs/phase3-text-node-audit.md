# Phase 3: Text Node Logic — Audit

**Date:** 2026-05-03
**Scope:** TextNode dynamic sizing and variable handle functionality
**Files Audited:** `nodes/textNode.js`, `nodes/BaseNode.js`

---

## 1. Current Implementation

### Dynamic Width (lines 33-34)
```js
const longestLine = Math.max(...currText.split('\n').map(l => l.length), 10);
const dynamicWidth = Math.min(Math.max(longestLine * 8 + 80, 240), 560);
```
- Width calculated from longest line character count
- Multiplied by 8px per character
- Clamped between 240px and 560px

### Dynamic Height (lines 24-30)
```js
useEffect(() => {
  const ta = textareaRef.current;
  if (!ta) return;
  ta.style.height = 'auto';
  ta.style.height = `${ta.scrollHeight}px`;
}, [currText]);
```
- Textarea auto-grows with content
- Min height 56px set inline

### Variable Extraction (lines 21-22)
```js
const variables = [...new Set([...currText.matchAll(VARIABLE_REGEX)].map(m => m[1]))];
```
- Regex: `/\{\{([a-zA-Z_][a-zA-Z0-9_]*)\}\}/g`
- Captures valid JS variable names in `{{...}}`
- Extracts unique variable names only

### Variable Handles (lines 47-67)
```jsx
{variables.map((varName, i) => (
  <div key={varName}>
    <Handle
      type="target"
      position={Position.Left}
      id={`${id}-${varName}`}
      style={{ top: `${varHandlePositions[i]}%`, ... }}
      title={varName}
    />
    <span style={{ ...handleLabelStyle, left: 14, top: `calc(${varHandlePositions[i]}% - 7px)` }}>
      {varName}
    </span>
  </div>
))}
```

### Variable Chips (lines 96-114)
Shows extracted variables below textarea with `{{variable}}` format.

---

## 2. Issues Found

### Issue 1: Width Only Recalculates on Render (Medium)
The `dynamicWidth` is calculated but only applied via `minWidth` in `BaseNode`. If user types and longest line changes, width updates on re-render but no visual feedback until state settles.

**Fix:** Ensure state update triggers immediate re-render with new width.

### Issue 2: Handle Positioning Percentages Wrong (Medium)
`varHandlePositions` distributes handles across 30%-85% range based on variable count. But handles are rendered inside BaseNode which has:
- Header (approx 40px)
- Body with dynamic content

Handle `top: X%` is relative to the parent div (the whole node), but handles need to align with the body content area, not the header.

**Current:** `distributeVariableHandles` uses 30-85% range.
**BaseNode:** Standard handles use 20%-80% range.

### Issue 3: Handle Labels Offset (Low)
Labels use `calc(${varHandlePositions[i]}% - 7px)` for positioning, but with transform-based positioning should use same pattern as BaseNode.

### Issue 4: Variable Chips Styling (Low)
Chips show `{{variable}}` format which is redundant — should just show variable name since brackets are visible in textarea context.

### Issue 5: No Visual Feedback for Variable Creation (Low)
When user types `{{newVar}}`, no immediate visual cue that a handle will be created. Could add subtle highlight or preview.

---

## 3. Positive Findings

### Well-Structured Code
- Regex for variable extraction is correct and handles edge cases
- Unique variable extraction via Set
- Proper cleanup of refs
- Re-render triggers on text change

### Handle Distribution Logic
`distributeVariableHandles` function properly handles:
- 0 variables (empty array)
- 1 variable (centered at 55%)
- Multiple variables (evenly distributed)

### Syntax Highlighting Opportunity
Current implementation could be extended to highlight `{{...}}` patterns in textarea with different background color.

---

## 4. Verdict

| Requirement | Status | Notes |
|-------------|--------|-------|
| Width changes with text | ✅ | Calculated from longest line |
| Height changes with text | ✅ | Textarea auto-resizes |
| Variable handles created | ✅ | Dynamic handles from `{{var}}` |
| Variable label shown | ✅ | Handle labels and chips |
| Handle positioning correct | ⚠️ | Works but % offset from header |

**Overall Rating:** 8/10 — Core functionality works well. Handles created dynamically, width/height adjust. Main issue is handle positioning alignment with content area.

---

## 5. Recommended Fixes

1. **Increase handle position range** — Use 15%-90% instead of 30%-85% for better edge coverage
2. **Fix label positioning** — Use `transform: translateY(-50%)` consistent with BaseNode
3. **Simplify variable chips** — Show just `variableName` not `{{variable}}`
4. **Add syntax highlighting** — Style `{{...}}` patterns with subtle background
5. **Consider adding output handle** — Currently TextNode has `output` handle but no label changed from lowercase

---

## 6. Implementation Status

```
Feature                              Status
─────────────────────────────────────────────────────
Width based on longest line          ✅ Implemented
Height auto-resize                   ✅ Implemented
{{variable}} → Handle creation        ✅ Implemented
Handle positioning                   ⚠️ Works, could improve
Variable label display               ✅ Implemented
Variable chip display               ✅ Implemented
```

---

## 8. Changes Implemented

### Fix 1: Handle Position Range Expanded
Changed from 30%-85% to 15%-90% for better edge coverage:
```js
const start = 15;
const end = 90;
```

### Fix 2: Label Positioning Uses Transform
Now consistent with BaseNode using `transform: translateY(-50%)`:
```jsx
<span style={{
  ...inputHandleLabelStyle,
  top: `${varHandlePositions[i]}%`,
}}>
  {varName}
</span>
```

### Fix 3: Variable Chips Simplified
Removed redundant `{{...}}` brackets from chip display. Now shows:
- Label: "Inputs:"
- Chips: variable names only (e.g., `input`, `user`, `data`)

### Fix 4: Output Handle Capitalized
Changed from `label: 'output'` to `label: 'Output'` for consistency.

### Additional Improvements
- Created `DynamicTextarea` component with inline styles (no external refs needed)
- Width calculation improved: `maxLineLength * 9 + 100` (was 8 + 80)
- Max width increased to 600px (was 560)
- Chips now use `node-text-header` color for border/text
- Handle wrapper uses consistent absolute positioning

### Files Modified
| File | Changes |
|------|---------|
| `nodes/textNode.js` | Complete rewrite with fixes applied |

---

## 9. Build Status
✅ Compiled successfully. No warnings.