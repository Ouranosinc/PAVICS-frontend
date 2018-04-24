1. User goes to pavics.ouranos.ca, logs in with dhuard (which has normal user permission, ie access to public files and services)
2. Browse through existing projects, selects existing project that has data for the ClimEx project, RCP4.5 experiment, daily resolution tasmin datasets (see basic story).
3. User goes to Data Processing interface in Scientific Workflows
4. Interface loads workflows stored in project
5. The interface lists existing workflows (if any) and the last entry is "Create new workflow", which is an input form.
6. There are no workflows in this project, so user has to create one.
7. User clicks on Create new workflow, enters new workflow name (ClimEx), presses Enter or "Create" button
8. Interface shows workflow editor, initialized with a simple barebones template including the name given by the user.
9. User enters a new workflow in the in the workflow editor (see climex workflow, but add typo to identifier or provider)
10. Clicks on Save
11. Interface warns of errors so user can correct them, workflow editor is still open
12. User corrects error, clicks Save
13. Interface shows success message "ClimEx workflow created."
14. User clicks on ClimEx workflow, interface opens configuration dialog
15. User enters workflow input (to be defined)
16. User clicks on Execute workflow
17. Interface notifies user that workflow has been launched and shows link to job monitor.

Optional
--------
18. User wants to create a new workflow derived from ClimEx workflow.
19. Clicks on Action menu of ClimEx workflow and selects Duplicate.
20. A new workflow appears in the workflow list, called Copy of <name of first workflow>.
21. User clicks on Action menu -> Edit to modify the workflow -> Save

Notes
-----
I think it would be helpful if workflows had an abstract field to describe what it does.


