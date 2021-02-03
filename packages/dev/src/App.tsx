import React from "react";
import {
  Page,
  Nav,
  NavList,
  NavItem,
  PageSidebar,
  Avatar,
  Brand,
  PageHeader,
  PageHeaderTools,
  Button,
} from "@patternfly/react-core";
import imgBrand from "./assets/images/imgBrand.svg";
import imgAvatar from "./assets/images/imgAvatar.svg";
import { Link, useHistory, useRouteMatch } from "react-router-dom";
import Demos from "./Demos";
import "./App.css";
import {
  QuickStartDrawer,
  QuickStartContext,
  useValuesForQuickStartContext,
  i18n,
  useLocalStorage,
} from "@cloudmosaic/quickstarts";
import { allQuickStarts } from "./quickstarts-data/quick-start-test-data";

interface AppState {
  activeItem: number | string;
  isNavOpen: boolean;
}

const App: React.FunctionComponent = ({ children }) => {
  const history = useHistory();

  const [initialized, setInitialized] = React.useState(true);

  const [activeQuickStartID, setActiveQuickStartID] = useLocalStorage(
    "quickstartId",
    ""
  );

  const [allQuickStartStates, setAllQuickStartStates] = useLocalStorage(
    "quickstarts",
    {}
  );

  React.useEffect(() => console.log(activeQuickStartID), [activeQuickStartID]);
  React.useEffect(() => {
    // callback on state change
    console.log(allQuickStartStates);
  }, [allQuickStartStates]);

  const { pathname: currentPath } = window.location;
  const quickStartPath = "/quickstarts";

  const valuesForQuickstartContext = useValuesForQuickStartContext({
    activeQuickStartID,
    setActiveQuickStartID,
    allQuickStartStates,
    setAllQuickStartStates,
    allQuickStarts,
    footer: {
      showAllLink: currentPath !== quickStartPath,
      onShowAllLinkClick: () => history.push(quickStartPath),
    },
  });

  if (!initialized) return <div>Loading</div>;

  const AppToolbar = (
    <PageHeaderTools>
      <Avatar src={imgAvatar} alt="Avatar image" />
    </PageHeaderTools>
  );

  const AppHeader = (
    <PageHeader
      logo={<Brand src={imgBrand} alt="Patternfly Logo" />}
      headerTools={AppToolbar}
      showNavToggle
      isNavOpen
    />
  );

  const AppNav = (
    <Nav aria-label="Nav">
      <NavList>
        {Demos.map((demo, index) => (
          <NavItem itemId={index} key={demo.id}>
            <Link id={`${demo.id}-nav-item-link`} to={`/`}>
              {demo.name}
            </Link>
          </NavItem>
        ))}
        <NavItem>
          <Link to="/quickstarts">Quick Starts</Link>
        </NavItem>
      </NavList>
    </Nav>
  );

  const AppSidebar = <PageSidebar isNavOpen nav={AppNav} />;

  let match = useRouteMatch();
  debugger;

  return (
    <React.Suspense fallback={<div>Loading</div>}>
      <QuickStartContext.Provider value={valuesForQuickstartContext}>
        {/* <NestedApp /> */}
        <QuickStartDrawer>
          <Page header={AppHeader} sidebar={AppSidebar} isManagedSidebar>
            <Button variant="plain" onClick={() => i18n.changeLanguage("de")}>
              Change lng - DE
            </Button>
            <Button variant="plain" onClick={() => i18n.changeLanguage("en")}>
              Change lng - EN
            </Button>
            <Button
              onClick={() =>
                valuesForQuickstartContext.setActiveQuickStart(
                  "add-healthchecks"
                )
              }
            >
              Open quickstart
            </Button>
            {children}
          </Page>
        </QuickStartDrawer>
      </QuickStartContext.Provider>
    </React.Suspense>
  );
};
export default App;
