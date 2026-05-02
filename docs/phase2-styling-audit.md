# Phase 2: Styling — Audit

**Date:** 2026-05-02
**Scope:** Frontend styling implementation
**Files Audited:** `tokens.css`, `submit.js`, `toolbar.js`, `draggableNode.js`, `ui.js`, `nodes/*.js`, `index.html`

---

## 1. Current State

### Design System (tokens.css)
- ✅ CSS custom properties (design tokens) defined
- ✅ Node type colors (9 types)
- ✅ Typography tokens (heading, body, mono fonts)
- ✅ Spacing, radius, shadow tokens
- ✅ Transitions defined
- ✅ Google Fonts imported (Copernicus, Inter, JetBrains Mono)
- ⚠️ Fonts may not load if "StyreneB" not available — fallback chain tested

### Component Styling

| Component | Status | Notes |
|-----------|--------|-------|
| BaseNode | ✅ Good | Solid headers, consistent body, handle labels |
| Toolbar | ✅ Good | Draggable nodes with left border accent |
| SubmitButton | ✅ Good | Stats chips + modal with backdrop blur |
| DraggableNode | ✅ Good | Hover states, left border accent |
| Canvas (ReactFlow) | ✅ Good | Dot grid, controls, minimap all styled |
| Input/Select/Textarea | ✅ Good | Focus states with accent glow |

### Global Styles (tokens.css)
- ✅ ReactFlow edge styling
- ✅ Node selection glow
- ✅ Controls/minimap styled
- ✅ Handle hover states
- ✅ Custom scrollbar
- ✅ Focus states for inputs
- ✅ Button base styles

---

## 2. Issues Found

### Issue 1: HTML Title/Theme Not Updated (Low)

[index.html](frontend/public/index.html) still shows:
- `title: "React App"` — generic
- `theme-color: #000000` — doesn't match app palette

**Fix:** Update to reflect pipeline canvas branding.

### Issue 2: Missing Inline CSS Animations (Medium)

[submit.js:167-170](frontend/src/submit.js#L167-L170) has inline spinner that references `@keyframes spin` but no keyframes defined in tokens.css.

```js
const spinnerStyle = {
  display: 'inline-block',
  animation: 'spin 1s linear infinite',
};
```

**Fix:** Add `@keyframes spin` to tokens.css or use CSS-in-JS alternative.

### Issue 3: No Dark Mode Support (Medium)

All styles assume light mode. VectorShift typically has dark mode toggle.

**Impact:** Limited to light mode only.

### Issue 4: Node Selection Uses !important (Low)

[tokens.css:146](frontend/src/tokens.css#L146):
```css
.react-flow__node.selected > div {
    box-shadow: var(--shadow-glow), var(--shadow-md) !important;
}
```

`!important` may cause conflicts with future hover effects.

### Issue 5: No Hover State for Node Bodies (Medium)

Nodes have hover transition in BaseNode but no explicit body hover style.

### Issue 6: Missing Loading Spinner Component (Medium)

[submit.js:44](frontend/src/submit.js#L44) uses text "⟳" as spinner — not consistent with Lucide icons used elsewhere.

**Fix:** Use `Loader2` or `Spinner` from Lucide.

---

## 3. Positive Findings

### Design Consistency
- All nodes use same header/body pattern via BaseNode
- Consistent border-radius (var(--radius-lg), var(--radius-md))
- Consistent padding (10-14px)
- All text uses CSS variables

### Accessibility Considerations
- Focus states defined for all inputs
- Cursor styles set appropriately
- Text contrast ratios appear good

### Code Organization
- Design tokens centralized in tokens.css
- No inline color values in components (except CSS variables)
- Shared styles exported from BaseNode

---

## 4. Verdict

| Requirement | Status | Notes |
|-------------|--------|-------|
| Appealing unified design | ✅ | Claude-inspired warm palette works |
| Consistent styling | ✅ | All nodes use BaseNode abstraction |
| Styled ReactFlow canvas | ✅ | Controls, minimap, edges all styled |
| Global styles defined | ✅ | tokens.css provides foundation |
| Component-level styles | ✅ | All components have consistent styling |

**Overall Rating:** 8/10 — Solid foundation. Design tokens work well. Main gaps: missing keyframes, no dark mode, title/theme not updated.

---

## 5. Changes Implemented

### Fix 1: HTML Branding Updated
- `index.html` title → "Canvas — Visual Workflow Builder"
- `theme-color` → `#faf9f5`
- Meta description updated

### Fix 2: Keyframes Added
Added to `tokens.css`:
```css
@keyframes spin { from { transform: rotate(0deg); } to { transform: rotate(360deg); } }
@keyframes fadeIn { from { opacity: 0; } to { opacity: 1; } }
@keyframes slideUp { from { opacity: 0; transform: translateY(8px); } to { opacity: 1; transform: translateY(0); } }
```

### Fix 3: Spinner Replaced
`submit.js` — replaced emoji spinner with Lucide `Loader2` component.

### Fix 4: Toolbar Completely Redesigned
New design with:
- Hexagon logo with Plus overlay
- Version tag (v1.0)
- Grouped node palette (IO, PROCESSING, LOGIC, UTILITY)
- Labels above each group
- Color badge indicator per node
- More compact, modern appearance

### Fix 5: Label Overlap Fixed
BaseNode handles now positioned with:
- Better spacing (20% to 80% range instead of 0% to 100%)
- Labels positioned using `transform: translateY(-50%)` for accurate centering
- Proper z-index for labels (zIndex: 1)
- Removed inline positioned spans, now using CSS transform

### Fix 6: Auto-Resizing Textareas
Created `AutoResizeTextarea` component in BaseNode that:
- Uses `useRef` + `useEffect` for auto-height
- Minimum height 40px
- Grows vertically with content
- Applied to all multiline inputs (API Request, Transform, Note, LLM nodes)

### Additional Improvements
- All handle labels capitalized (URL, Body, Response, etc.)
- Added URL field to API Request node
- Added System prompt textarea to LLM node
- Added Index name field to Vector Search node
- Note node minWidth increased to 200px

### Files Modified
| File | Changes |
|------|---------|
| `public/index.html` | Title, theme-color, description |
| `tokens.css` | Keyframes added |
| `submit.js` | Loader2 icon, removed unused spinnerStyle |
| `toolbar.js` | Complete redesign with groups |
| `draggableNode.js` | Color badge, compact design |
| `nodes/BaseNode.js` | Handle positioning, AutoResizeTextarea |
| `nodes/customNodes.js` | Auto-resize textareas, capitalized labels |
| `nodes/inputNode.js` | Capitalized label |
| `nodes/outputNode.js` | Capitalized label |
| `nodes/llmNode.js` | Added system prompt, AutoResizeTextarea |

---

## 6. Design System Summary

### Color Palette
- **Canvas:** `#faf9f5` (warm cream)
- **Primary:** `#cc785c` (terracotta)
- **Accent:** `#8b5cf6` (purple for LLM nodes)
- **Node Headers:** 9 unique colors per node type

### Typography
- **Headings:** Copernicus (serif)
- **Body:** Inter (sans-serif)
- **Code:** JetBrains Mono

### Spacing Scale
- xs: 4px, sm: 8px, md: 12px, lg: 16px, xl: 24px

### Border Radius
- sm: 6px, md: 8px, lg: 12px, xl: 16px

### Shadows
- xs: subtle 1px, sm: 1-3px, md: 4-12px, lg: 8-24px