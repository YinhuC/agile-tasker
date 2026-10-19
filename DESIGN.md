---
name: agile tasker.
description: A kanban task manager whose every card is a printed production card travelling through a galvanised steel rack.
colors:
  stock-yellow: "#f2c230"
  stock-pale: "#fff9e0"
  stock-highlight: "#fae38a"
  sleeve-blue: "#bcd7f2"
  sleeve-deep: "#123150"
  signal-red: "#d7301f"
  signal-stamp: "#b02516"
  signal-deep: "#871b10"
  steel-mist: "#eef1f3"
  steel-ground: "#e4e9ec"
  steel-light: "#d6dde1"
  steel-perforation: "#c3cbd0"
  steel-rule: "#a6b0b6"
  steel-label: "#5f686e"
  steel-dim: "#42484d"
  ink: "#16181a"
  ink-soft: "#2c3034"
  ink-rule: "#50565b"
  paper: "#fbfbf8"
typography:
  display:
    fontFamily: "Archivo, \"Helvetica Neue\", Arial, sans-serif"
    fontSize: "clamp(5.5rem, 4rem + 6vw, 10rem)"
    fontWeight: 900
    lineHeight: 0.78
    letterSpacing: "-0.04em"
    fontVariation: "\"wdth\" 62"
    fontFeature: "\"tnum\""
  headline:
    fontFamily: "Archivo, \"Helvetica Neue\", Arial, sans-serif"
    fontSize: "clamp(2.5rem, 1.5rem + 3.4vw, 4.5rem)"
    fontWeight: 800
    lineHeight: 0.95
    letterSpacing: "-0.03em"
    fontVariation: "\"wdth\" 86"
  headline-section:
    fontFamily: "Archivo, \"Helvetica Neue\", Arial, sans-serif"
    fontSize: "clamp(2rem, 1.4rem + 2vw, 3.25rem)"
    fontWeight: 800
    lineHeight: 1
    letterSpacing: "-0.03em"
    fontVariation: "\"wdth\" 86"
  title:
    fontFamily: "Archivo, \"Helvetica Neue\", Arial, sans-serif"
    fontSize: "1.5rem"
    fontWeight: 800
    lineHeight: 1.1
    letterSpacing: "-0.02em"
    fontVariation: "\"wdth\" 86"
  body:
    fontFamily: "Archivo, \"Helvetica Neue\", Arial, sans-serif"
    fontSize: "16px"
    fontWeight: 400
    lineHeight: 1.55
  body-lede:
    fontFamily: "Archivo, \"Helvetica Neue\", Arial, sans-serif"
    fontSize: "18px"
    fontWeight: 400
    lineHeight: 1.55
  label:
    fontFamily: "Archivo, \"Helvetica Neue\", Arial, sans-serif"
    fontSize: "12px"
    fontWeight: 700
    lineHeight: 1.4
    letterSpacing: "0.08em"
  code:
    fontFamily: "\"Martian Mono\", ui-monospace, monospace"
    fontSize: "11px"
    fontWeight: 600
    lineHeight: 1.4
rounded:
  xs: "6px"
  sm: "10px"
  md: "14px"
  lg: "18px"
  xl: "24px"
  pill: "999px"
spacing:
  xs: "10px"
  sm: "12px"
  md: "16px"
  lg: "20px"
  xl: "32px"
components:
  button-ink:
    backgroundColor: "{colors.ink}"
    textColor: "{colors.stock-yellow}"
    rounded: "{rounded.pill}"
  button-ink-hover:
    backgroundColor: "{colors.ink-soft}"
    textColor: "{colors.stock-yellow}"
  button-filled:
    backgroundColor: "{colors.stock-yellow}"
    textColor: "{colors.ink}"
    rounded: "{rounded.pill}"
  button-outline:
    backgroundColor: "transparent"
    textColor: "{colors.ink}"
    rounded: "{rounded.pill}"
  button-light:
    backgroundColor: "{colors.paper}"
    textColor: "{colors.ink}"
    rounded: "{rounded.pill}"
  button-light-hover:
    backgroundColor: "{colors.stock-pale}"
    textColor: "{colors.ink}"
  button-subtle:
    backgroundColor: "transparent"
    textColor: "{colors.ink-soft}"
    rounded: "{rounded.pill}"
  input:
    backgroundColor: "{colors.paper}"
    textColor: "{colors.ink}"
    rounded: "{rounded.sm}"
  stock-card-yellow:
    backgroundColor: "{colors.stock-yellow}"
    textColor: "{colors.ink}"
    rounded: "{rounded.lg}"
    padding: "clamp(20px, 2.4vw, 32px)"
  stock-card-blue:
    backgroundColor: "{colors.sleeve-blue}"
    textColor: "{colors.ink}"
    rounded: "{rounded.lg}"
    padding: "16px 18px 18px"
  stock-card-white:
    backgroundColor: "{colors.paper}"
    textColor: "{colors.ink}"
    rounded: "{rounded.lg}"
    padding: "clamp(22px, 3vw, 32px)"
  task-card:
    backgroundColor: "{colors.paper}"
    textColor: "{colors.ink}"
    rounded: "{rounded.sm}"
    padding: "8px 12px 12px"
  list-column:
    backgroundColor: "{colors.steel-mist}"
    rounded: "{rounded.md}"
    padding: "8px"
    width: "300px"
  list-column-head:
    backgroundColor: "{colors.ink}"
    textColor: "{colors.paper}"
    rounded: "{rounded.sm}"
    padding: "6px 4px 6px 12px"
  slot-label:
    backgroundColor: "{colors.ink}"
    textColor: "{colors.paper}"
    rounded: "{rounded.sm}"
    padding: "10px 14px"
  modal-header:
    backgroundColor: "{colors.stock-yellow}"
    textColor: "{colors.ink}"
  nav-bar:
    backgroundColor: "{colors.ink}"
    textColor: "{colors.steel-light}"
    height: "64px"
---

# Design System: agile tasker.

## Overview

**Creative North Star: "The Production Card"**

Kanban means signal card. Every card in agile tasker is a printed production card slipped into a vinyl sleeve, and the whole site is the galvanised steel rack those cards travel through. The ground is pale steel with a pegboard of punched perforations; on it hang coloured card stocks (signal yellow, sleeve blue, white) printed in ink black, divided into fields by heavy 2px ink rules, each with a punched hole in the top right corner. Colour lives on the cards, never on the walls.

The system is dense and printed rather than airy and glossy. Hierarchy comes from rules, case and width, not from colour washes: Archivo is stretched and squeezed along its width axis (62% for the giant card number, 82 to 86% for headlines) and paired with Martian Mono for the small machine-printed codes. Depth is physical: cards carry a soft sheen and a cast shadow, holes are inset, button tags have a punched dot. Motion moves a card the way a hand would: it lifts, travels, lands, and gets stamped.

The world rejects the gradient SaaS hero with floating device mockups and the three-up feature-card grid. Product images are real captures of the running app with believable seed data: stills and one short recording, each set in an ink ScreenFrame (a labelled window or a phone bezel) on the rack. The frames come from the page, not the image, so a fresh capture drops straight in.

**Key Characteristics:**
- Steel pegboard ground; colour carried only by card stocks.
- Ink black print with 2px ink rules dividing printed fields.
- Punched holes on cards and a punched dot on every tag button.
- Archivo variable width for everything readable; Martian Mono only for IDs, counts and codes.
- Signal red reserved for the card in motion and the DONE stamp.
- Ink bands only for the header, footer and the Build section.

## Colors

A cool steel neutral ground, ink black print, two card stocks, and one rubber-stamp red that almost never appears.

### Primary
- **Signal Card Yellow** (stock-yellow): the printed production card. Hero card, Demo card, the yellow modal header strip, the filled button, the ink button's label, the wordmark's full stop, the active nav link, and the top rule of the Build section. Its paler steps are functional: Stock Pale is the hover of light buttons and the drop-target tint of a list; Stock Highlight is the input focus ring and text selection.

### Secondary
- **Sleeve Blue** (sleeve-blue): the secondary card stock. Project cards on the board and the Spec sheet card on the home page. Text that needs to be quieter on blue stock uses **Deep Sleeve** (sleeve-deep), never grey.

### Tertiary
- **Rubber-Stamp Red** (signal-red, signal-stamp, signal-deep): the 2.5px outline around a card while it is dragged or carried by scroll (signal-red), the rotated DONE stamp (signal-stamp), and error feedback: the error border on inputs (signal-stamp), error text (signal-deep), and error notifications.

### Neutral
- **Steel Ground** (steel-ground): the pegboard plate behind the hero, auth pages, Demo section, board grids and the project rack.
- **Steel Mist** (steel-mist): the page body and the plain steel band of the How section; also the fill of list columns.
- **Steel Perforation** (steel-perforation): the pegboard dots, card and column borders (1.5px), and resting dividers.
- **Steel Rule** (steel-rule): resting input border and scrollbar thumb.
- **Steel Light** (steel-light): nav and footer links on ink; outline buttons on ink.
- **Steel Label** (steel-label): placeholders and inactive scroll steps.
- **Steel Dim** (steel-dim): Mantine's dimmed text: task IDs, empty states, notes.
- **Ink** (ink): all print. Body text, headings, 2px rules, focus outlines, the header, footer, Build band, list heads and rack slot labels.
- **Ink Soft** (ink-soft): secondary print such as subtitles, descriptions and the ink button hover. **Ink Rule** (ink-rule) divides content on ink bands.
- **Paper** (paper): the theme white. White card stock, task cards, inputs, modals, and the light button.

### Named Rules
**The Stamp Rule.** Signal red marks exactly two things in the world: the one card that is moving right now (dragged on the board, or carried by scroll on the home page) and the DONE stamp it receives on landing. The only other use is functional error feedback. It is never decoration, never a button, never a heading, and a card at rest never wears it.

**The Card Carries Colour Rule.** The steel pegboard is the ground. Yellow and blue appear on cards, tags and strips that sit on the rack, not as full-bleed section backgrounds. The only full-bleed colour is ink: the header, the footer and the Build band.

## Typography

**Display Font:** Archivo, variable width 62 to 125 and weight 100 to 900 (with "Helvetica Neue", Arial)
**Body Font:** Archivo (same family)
**Label/Mono Font:** Martian Mono 400/600/700 (with ui-monospace)

**Character:** One family does the talking and changes its width to change its voice: condensed and heavy when it is a printed card number or headline, normal width for reading. Martian Mono is the stamping machine: tiny, tabular, used only for things a machine would print.

### Hierarchy
- **Display** (900, clamp 5.5rem to 10rem, line-height 0.78, width 62%, tabular numerals): the giant card number on the hero production card. One per page at most.
- **Headline** (800, clamp 2.5rem to 4.5rem, line-height 0.95, width 86%, -0.03em): page h1. The hero card title tightens to width 82% and the Demo title to 78% at up to 6rem.
- **Headline Section** (800, clamp 2rem to 3.25rem, line-height 1): section h2 such as "One card, three moves."
- **Title** (800, 1.5rem, line-height 1.1, -0.02em): h3, card titles, modal titles (1.35rem).
- **Body** (400, 16px, line-height 1.55): reading text, capped near 46 to 56ch. Ledes run at 18px.
- **Label** (700, 11 to 13px, 0.06 to 0.1em, uppercase): printed field labels on cards, input labels, list heads, rack slot labels, Build layer names.
- **Code** (Martian Mono 600, 11 to 12px): card IDs (#07), counts (03), step numbers (1/3), slot numbers.

### Named Rules
**The Machine Print Rule.** Martian Mono is only for IDs, counts and codes: values a machine would stamp. Never for headings, labels, body, buttons or decoration.

**The Width Is Voice Rule.** Emphasis comes from Archivo's width and weight axes and from ink rules, not from extra colours or a second display face.

## Layout

The page is a 12-column grid inside Mantine's xl container (`88em` breakpoint), with column gaps of clamp(16px, 2vw, 28px). The hero splits 6/6: the production card spans columns 1 to 6, the rack of screenshots spans 7 to 12 and tucks under the card by a negative margin. Secondary sections use asymmetric 5/7 or 6/5 two-column splits, collapsing to one column below md (62em).

Section padding scales with clamp, typically clamp(48px, 6vw, 96px) to clamp(72px, 9vw, 128px) vertically. Inside cards the rhythm is tight: 10 to 14px between fields, 18 to 24px between printed bands. The header is fixed at 64px, hides on scroll down and returns on scroll up.

Breakpoints: xxs 24em, xs 36em, sm 48em, md 62em, lg 75em, xl 88em. The board is a horizontally scrolling rack of 300px list columns; field grids drop from four columns to two below sm.

## Elevation & Depth

Depth is physical and layered: a card is a real object on a steel plate. Card stocks combine a 1px white top highlight (inset) with a cast shadow from the soft ink-tinted ladder, plus a faint diagonal sheen like a vinyl sleeve. Holes and the dot on tag buttons are inset shadows. Resting board cards sit at the lowest step; anything being moved jumps to the large step.

### Shadow Vocabulary
- **Resting** (`0 1px 2px rgba(22, 24, 26, 0.12)`): task cards and demo board cards at rest.
- **Hung** (shadow sm): project cards on the board.
- **Sleeved** (shadow md): screenshot sleeves, the How board, notifications.
- **Lifted** (shadow lg): production cards (yellow, blue, white) and any card or list while it is dragged.
- **Sheen** (`inset 0 1px 0 rgba(255, 255, 255, 0.55)`): the top highlight on every card stock.
- **Punched hole** (`inset 0 2px 3px rgba(22, 24, 26, 0.4)`): the 20px hole on card stocks.

### Named Rules
**The Lift Rule.** A card's shadow states its situation: resting, hung, or lifted. Dragging is the only thing that lifts a board card to the large shadow.

## Shapes

Corners are softly cut card stock, never sharp and never blobby: 10px for tasks, inputs and list heads; 14px for list columns and notes; 18px for production cards, sleeves and rack plates; 24px or a full pill for icon buttons and tag buttons. Borders are print: 2px ink rules divide fields and frame headers, 1.5px steel lines outline cards at rest, 1.5px ink outlines the modal and the light button. The recurring silhouettes are the punched circle (20px hole on cards, 0.5em dot on tags), the pegboard perforation grid (2px dots on a 28px pitch on page grounds, 1.8px on a 24px pitch inside racks), and the rotated rubber stamp (-9deg, 8px radius, 2.5px border).

## Components

### Buttons
Pill tags with a punched hole: tactile, printed, pressed in by a thumb.
- **Shape:** full pill (999px), weight 700, a 0.5em punched dot before the label (currentColor at 32% with an inset shadow) on filled, ink, outline, white and light variants.
- **Ink (primary on light ground):** ink fill with a yellow label, inset bottom shade. The primary action, such as "Open the demo board".
- **Filled:** signal yellow with ink label, used on ink bands (header "Try the demo").
- **Outline:** transparent with a 2px ink border; on ink bands it takes `color="steel.3"`.
- **Light:** paper fill with a 1.5px ink border; hover goes to Stock Pale.
- **Subtle:** transparent, ink-soft label, no dot. Icon buttons are subtle pills in ink.
- **Hover / Active:** background shifts over 150ms; pressing sinks the tag by 1px over 120ms on the out-expo curve.

### Cards / Containers
- **Production card (StockCard):** yellow, blue or white stock, 18px radius, sheen plus lifted shadow, optional 20px punched hole at top right (22px from the edge). Content is split into printed fields by 2px ink rules.
- **Task card:** paper, 10px radius, 1.5px steel border, resting shadow, a Martian Mono ID, 15px bold name. Hover darkens the border to ink.
- **List column:** Steel Mist fill, 14px radius, 300px wide, with an ink head strip carrying an uppercase name and a mono count. The drop zone tints Stock Pale while a card is over it.
- **Rack plate:** a pegboard panel (steel ground, 18px radius, 1.5px steel border) that holds a workspace's project cards or a project's lists.
- **Sleeve:** a translucent white (72%) panel with a steel border and the sleeved shadow; product screenshots always sit in one.

### Inputs / Fields
- **Style:** paper fill, 1.5px Steel Rule border, 10px radius, ink text, Steel Label placeholder. Labels are 12px bold uppercase at 0.08em.
- **Focus:** border goes to ink and a 3px Stock Highlight ring appears.
- **Error:** border Rubber-Stamp Red (signal-stamp), message in signal-deep.

### Navigation
- **Header:** a fixed 64px ink bar with the lowercase wordmark (yellow full stop), 15px semibold links in Steel Light that turn paper on hover and yellow when current. Links hide below md; sign in is an outline tag, the demo a filled yellow tag.
- **Footer:** ink band, 28px wordmark, links in Steel Light, an Ink Rule divider, muted fine print in Steel Rule.

### Modal
Paper body with a 1.5px ink outline and 18px radius, a yellow header strip closed by a 2px ink rule, title at 800 and width 86%, over a 50% ink overlay with a 2px blur.

### Travelling Card (signature)
On the home page a sticky three-list board runs for 240vh of scroll. Scroll progress picks the step; one yellow card (#07) travels To do, Doing, Done by shared layout animation (spring, stiffness 220, damping 28), wearing the red outline only while it moves. On landing in Done a red DONE stamp drops in from 1.8x scale over 350ms. Under reduced motion the section becomes static and shows the final state.

### Motion
Everything eases on one out-expo curve (cubic-bezier(0.16, 1, 0.3, 1)). Text rises 20px over 700ms; screenshots settle from 96% scale and 40px over 900ms; groups stagger by 80 to 120ms. Reveals play once as the element crosses 88% of the viewport. The hero screenshot layers follow the pointer with a soft spring. Motion respects the user's reduced-motion setting globally.

## Do's and Don'ts

### Do:
- **Do** put colour on cards: yellow stock for the primary card on a surface, blue for secondary cards, white for forms and tasks.
- **Do** divide printed fields with 2px ink rules and outline resting cards with 1.5px steel.
- **Do** give every action a pill tag with the punched dot; use the ink tag for the main action on light ground and the yellow filled tag on ink.
- **Do** set IDs, counts and codes in Martian Mono at 11 to 12px, zero-padded (#07, 03).
- **Do** show the real app: capture it with believable data, set each capture in a ScreenFrame on the rack, and play recordings only while they are on screen, never under reduced motion.
- **Do** keep copy honest: show only shipped features and disclose the free-tier cold start near the demo action.

### Don't:
- **Don't** use signal red for anything except the moving card, the DONE stamp and error feedback.
- **Don't** paint full-bleed yellow or blue section bands; the only full-bleed colour is ink for the header, footer and Build band.
- **Don't** use Martian Mono for headings, labels, buttons or body text.
- **Don't** build a gradient SaaS hero with floating device mockups or a three-up feature-card grid.
- **Don't** use em dashes in UI copy.
- **Don't** invent counts, testimonials, tiers or views that the product does not have.
