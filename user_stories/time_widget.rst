1. User goes to pavics.ouranos.ca, logs in with dhuard (which has normal user permission, ie access to public files and services)
2. User selects ClimEx project (I'm assuming there is already a ClimEx project with data in it (Project: ClimEx, Frequency: daily, Variable: tasmin).
3. User selects in workspace the daily tasmin dataset for the r1p1i1 realization
4. Clicks visualize, gridded dataset shows up on interface
5. User displays time slider
 - If there are long background computations before it becomes active, there should be a visual indication that something is happening -
6. User clicks forward to advance date by one day -> 1900-01-02
7. User clicks on year 1925 -> 1925-01-02
8. User clicks on month June -> 1925-01-02
(At the moment, the month slider also modifies the day. Is this the desired behavior? I kinda expected the month slider to only modify the month, and unless Blaise or Travis have argued otherwise, this is the behavior I'd recommend. The day can be set manually by entering it into the "Current Date" field. There is no way anyway to select accurately a given day with a mouse anyway.
9. User selects month of June and sets timestep to year
10. User clicks forward to advance date by one year
(The granularity and time stepping work like a charm! )
11. User sets granularity to month
12. User presses Play

I suggest tool tips for the time widget:
- First time step
- Step backward
- Play/Pause (Aesthetic suggestion: use the same button that would switch between play and pause)
- Step forward
- Last time step

