# Personal OS Portfolio

## Product goal

Build a colorful, project-centered personal portfolio designed as a
personal operating system.

Primary audience:
- recruiters
- engineers
- professional connections

The portfolio should communicate:
“Harsita is a creative engineer with the technical ability, intuition,
and imagination to bring a vision to life.”

## Visitor journey

1. Lock screen
2. Home screen with interactive widgets
3. Dock folders
4. Folder windows
5. Individual project windows

## Version-one scope

### Lock screen
- local time and date
- name
- role
- one-line introduction
- location
- placeholder profile visual
- swipe-up interaction
- click and keyboard fallback

### Home screen
- introduction widget
- technical skills widget
- design/product skills widget
- interests widget
- notes widget
- social/contact widget
- resume widget

### Dock
- Projects
- About
- Education
- Experience

### Folder behavior
- desktop: centered window
- mobile: full-screen sheet
- only one folder open at a time
- projects may open in a larger window above the Projects folder

## Visual direction

- candy-glass home screen
- soft editorial content windows
- bright and memorable
- green is the anchor color
- also use pink, coral, yellow, blue, purple, and cyan
- translucent surfaces
- rounded cards
- soft shadows
- restrained blur
- comfortable typography and contrast

Do not directly reproduce Apple branding or proprietary system icons.

## Motion

- use Motion for React from `motion/react`
- major transitions should be soft
- microinteractions may be slightly playful
- respect prefers-reduced-motion
- avoid distracting continuous animations

## Accessibility

- every gesture must have a click alternative
- support keyboard navigation
- use visible focus styles
- use semantic HTML
- maintain readable contrast
- avoid keyboard traps

## Engineering

- Next.js App Router
- TypeScript with strict types
- Tailwind CSS
- Motion for React
- Lucide React
- typed content files under `src/data`
- avoid `any`
- avoid unnecessary dependencies
- no database, authentication, CMS, Redux, or window-manager library
  without approval

## Development rules

- inspect existing files before making changes
- implement one phase at a time
- do not invent personal facts or project information
- use placeholder content when real information is unavailable
- run lint and type checks after implementation
- report files changed and unresolved issues