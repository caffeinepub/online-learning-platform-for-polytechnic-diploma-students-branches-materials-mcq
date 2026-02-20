# Specification

## Summary
**Goal:** Build a responsive, minimal online learning platform for polytechnic diploma students with branch/semester/subject navigation, study resources (PDFs), MCQs, search, student login via Internet Identity, and an admin panel to manage content.

**Planned changes:**
- Create a modern, minimal, accessible UI theme and apply it across all pages with full responsiveness.
- Implement core pages and navigation: Home, Branch, Semester, Subject (Notes/Papers/MCQs/Syllabus), Search Results, Login/Register, and Admin Panel.
- Add data models and backend methods for branches, semesters, subjects, notes PDFs, question paper PDFs, MCQs, and syllabus overviews with stable persistence.
- Integrate Internet Identity authentication; create a user profile on first login and show logged-in state in the UI.
- Add admin role-based access control enforcing admin-only access to admin UI and backend mutations, including admin management (list/add/remove).
- Implement Notes and Question Papers modules with admin upload + metadata and student listing + PDF download.
- Implement MCQ browsing and a practice mode with answer capture and final score display.
- Implement syllabus overview display per subject with admin editing.
- Add global search across subjects, notes, papers, and MCQs with categorized results and navigation.
- Add loading/empty/error states and basic client-side caching to keep the app fast and avoid downloading PDFs until requested.
- Add and use static generated icons/illustrations for the seven branches on branch cards/headers.

**User-visible outcome:** Students can browse branches → semesters → subjects, download notes and past papers, read syllabus overviews, practice MCQs and see scores, and search across all content; admins can sign in and upload/manage PDFs, MCQs, and syllabus content via a protected admin panel.
