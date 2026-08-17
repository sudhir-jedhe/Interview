**Scenario:** A complex Navigation Drawer exists on every page of the app.
**Implementation:** Do not duplicate the drawer locators in every Page Object. Create a `NavigationDrawer` component class, and instantiate it as a property inside your other Page Objects.
