1. user goes to pavics.ouranos.ca, logs in with dhuard (which has normal user permission)
2. Browse through existing projects, decides to create new one (My new project)
3. Goes into search interface and search for the ClimEx project, RCP4.5 experiment, daily resolution tasmin datasets.
4. Adds resulting dataset to workspace and saves the search criteria for later.
5. Visualize the dataset to check it makes sense. 
6. Clicks on one grid cell to plot the time series to check the temporal behavior
7. User wants to compute the spatial average over a couple of regions, goes to Process interface
8. Selects averager_WFS from FlyingPigeon provider
9. Enter inputs into form (I can't test how it works right now, but ideally you'd be able to click to select from files in the workspace, with support for multiple selection)
10. Enter region (either using the display or a menu selection) MRC-Cote Nord
11. Enter option parameters (mosaic True or False) At the moment, the form does not tell you what your choices are. If boolean, I'd expect a radio-button as the input device, if's there is only a limited choice, then a drop-down menu or check-boxes if max_values  > 1. That might not be realistic for the demo though. 
12. Launch process
13. Monitor execution
14. Display output on interface, save for later use in workspace.
15. Download resulting file to disk
