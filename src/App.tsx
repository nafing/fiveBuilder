import {
  ActionIcon,
  AppShell,
  ColorScheme,
  ColorSchemeProvider,
  Group,
  Header,
  MantineProvider,
  Navbar,
  Title,
  Tooltip,
  UnstyledButton,
  createStyles,
  Stack,
  Text,
} from "@mantine/core";
import { useHotkeys, useLocalStorage } from "@mantine/hooks";
import {
  IconMoonStars,
  IconSun,
  IconArrowsMinimize,
  IconX,
  TablerIcon,
  IconHome2,
  IconGauge,
  IconDeviceDesktopAnalytics,
  IconFingerprint,
  IconCalendarStats,
  IconUser,
  IconSettings,
  IconLogout,
  IconSwitchHorizontal,
} from "@tabler/icons";
import React from "react";

import { ipcRenderer } from "electron";

import { AppContext } from "./hooks/ContextProvider";

const useStyles = createStyles((theme) => ({
  link: {
    width: 50,
    height: 50,
    borderRadius: theme.radius.md,
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    color:
      theme.colorScheme === "dark"
        ? theme.colors.dark[0]
        : theme.colors.gray[7],

    "&:hover": {
      backgroundColor:
        theme.colorScheme === "dark"
          ? theme.colors.dark[5]
          : theme.colors.gray[0],
    },
  },

  active: {
    "&, &:hover": {
      backgroundColor: theme.fn.variant({
        variant: "light",
        color: theme.primaryColor,
      }).background,
      color: theme.fn.variant({ variant: "light", color: theme.primaryColor })
        .color,
    },
  },
}));

interface NavbarLinkProps {
  icon: TablerIcon;
  label: string;
  active?: boolean;
  onClick?(): void;
}

function NavbarLink({ icon: Icon, label, active, onClick }: NavbarLinkProps) {
  const { classes, cx } = useStyles();
  return (
    <Tooltip label={label} position="right" transitionDuration={0}>
      <UnstyledButton
        onClick={onClick}
        className={cx(classes.link, { [classes.active]: active })}
      >
        <Icon stroke={1.5} />
      </UnstyledButton>
    </Tooltip>
  );
}

const mockdata = [
  { icon: IconGauge, label: "Dashboard" },
  { icon: IconCalendarStats, label: "Releases" },
  { icon: IconSettings, label: "Settings" },
];

const App = () => {
  const { state, setState } = React.useContext(AppContext);

  const [colorScheme, setColorScheme] = useLocalStorage<ColorScheme>({
    key: "mantine-color-scheme",
    defaultValue: "light",
    getInitialValueInEffect: true,
  });

  const toggleColorScheme = (value?: ColorScheme) =>
    setColorScheme(value || (colorScheme === "dark" ? "light" : "dark"));

  useHotkeys([["mod+J", () => toggleColorScheme()]]);

  const [active, setActive] = React.useState(0);

  const links = mockdata.map((link, index) => (
    <NavbarLink
      {...link}
      key={link.label}
      active={index === active}
      onClick={() => setActive(index)}
    />
  ));

  return (
    <ColorSchemeProvider
      colorScheme={colorScheme}
      toggleColorScheme={toggleColorScheme}
    >
      <MantineProvider
        theme={{
          colorScheme,
          fontFamily: "Lexend",
        }}
        withGlobalStyles
        withNormalizeCSS
      >
        <AppShell
          padding="xs"
          header={
            <Header p="xs" height={50} className="header">
              <Title order={4}>FiveM Script Manager</Title>
            </Header>
          }
          navbar={
            <Navbar width={{ base: 80 }} height={850} p="xs">
              <Navbar.Section grow>
                <Stack justify="center" spacing={0}>
                  {links}
                </Stack>
              </Navbar.Section>

              <Navbar.Section>
                <Stack justify="center" spacing={0}>
                  <NavbarLink
                    icon={colorScheme === "dark" ? IconSun : IconMoonStars}
                    label="Toggle color scheme"
                    onClick={() => {
                      toggleColorScheme();
                    }}
                  />
                  <NavbarLink
                    icon={IconArrowsMinimize}
                    label="Minimize"
                    onClick={() => {
                      ipcRenderer.send("minimize-me");
                    }}
                  />
                  <NavbarLink
                    icon={IconX}
                    label="Close"
                    onClick={() => {
                      ipcRenderer.send("close-me");
                    }}
                  />
                </Stack>
              </Navbar.Section>
            </Navbar>
          }
          styles={(theme) => ({
            main: {
              backgroundColor:
                theme.colorScheme === "dark"
                  ? theme.colors.dark[8]
                  : theme.colors.gray[0],
            },
          })}
        >
          {active === 0 ? (
            <Text>0</Text>
          ) : active === 1 ? (
            <Text>1</Text>
          ) : active === 2 && (
            <Text>Settings</Text>
          )}
        </AppShell>
      </MantineProvider>
    </ColorSchemeProvider>
  );
};

export default App;
