Autocomplete is a common question asked by many companies and encompasses many useful front end concepts and techniques that can be generalized to other front end system design questions. It is highly recommended to study this question well and thoroughly!

Question
Design an autocomplete UI component that allows users to enter a search term into a text box, a list of search results appears in a popup, and the user can select a result.

Some real-life examples where you might have seen this component in action:

Google's search bar on google.com where you see a list of primarily text-based suggestions.
Facebook's search input where you see a list of rich results. The results can be friends, celebrities, groups, pages, etc.

A back end API is provided that will return a list of results based on the search query.

Requirements
The component should be generic enough to be usable by different websites.
The input field UI and search results UI should be customizable.
Requirements exploration
These are questions you should be asking your interviewer to dive deeper into the problem and refine the requirements.

What kind of results should be supported?
Text, image, and media (image accompanied with text) are the most common types of results, but we cannot anticipate all the different kinds of results that users of the component will want to render.

What devices will this component be used on?
All possible devices: laptops, tablets, mobile, etc.

Do we need to support fuzzy search?
Not for the initial version. We can explore this if we have time.

Architecture

Input field UI
Handles user input and passes the user input to the controller.
Results UI (Popup)
Receives results from the controller and presents them to the user.
Handles user selection and informs the controller which input was selected.
Cache
Stores the results for previous queries so that the controller can check the cache before sending a request to the server.
Controller
The "brain" of the whole component, similar to the Controller in the Model View Controller (MVC) pattern. All the components in the system interact with this component.
Passes user input and results between components.
Fetches results from the server if the cache is empty for a particular query.
Conceptually, the controller sits at the center: it receives input from the field, consults the cache, falls back to the server on a miss, and pushes results into the popup while also writing responses back into the cache for future keystrokes.

Data model
Controller
Props/options exposed via the component API
Current search string
Cache
Initial results
Cached results
Refer to the section below for cache data model design
These are only the core fields that are needed for the basic functionality. More fields will be added as we dive deeper into specific topics below.

At a glance, the controller owns transient UI state (current input, active suggestion index, open/closed flag) while the cache owns persistent query history, keyed
