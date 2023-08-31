// @refresh reset

import { ActionIcon, Box, Paper, Tooltip } from "@mantine/core";
import React from "react";
import { useDisclosure } from "@mantine/hooks";
import { IconChevronLeft, IconChevronRight } from "@tabler/icons-react";

export const SidebarPanelContext = React.createContext<null | {
  collapsible: boolean;
  toggleCollapsed: () => void;
}>(null);

/** Root component for control panel. Parents a set of control tabs.
 * This could be refactored+cleaned up a lot! */
export default function SidebarPanel({
  children,
  collapsible,
}: {
  children: string | React.ReactNode;
  collapsible: boolean;
}) {
  const [collapsed, { toggle: toggleCollapsed }] = useDisclosure(false);

  const collapsedView = (
    <Box
      sx={(theme) => ({
        /* Animate in when collapsed. */
        position: "absolute",
        top: "0em",
        right: collapsed ? "0em" : "-3em",
        transitionProperty: "right",
        transitionDuration: "0.5s",
        transitionDelay: "0.25s",
        /* Visuals. */
        borderBottomLeftRadius: "0.5em",
        backgroundColor:
          theme.colorScheme == "dark"
            ? theme.colors.dark[5]
            : theme.colors.gray[2],
        padding: "0.5em",
      })}
    >
      <ActionIcon
        onClick={(evt) => {
          evt.stopPropagation();
          toggleCollapsed();
        }}
      >
        <Tooltip label={"Show sidebar"}>{<IconChevronLeft />}</Tooltip>
      </ActionIcon>
    </Box>
  );

  return (
    <SidebarPanelContext.Provider
      value={{
        collapsible: collapsible,
        toggleCollapsed: toggleCollapsed,
      }}
    >
      {collapsedView}
      {/* Using an <Aside /> below will break Mantine color inputs. */}
      <Paper
        shadow="lg"
        radius={0}
        sx={{
          width: collapsed ? 0 : "20em",
          overflow: "scroll",
          boxSizing: "border-box",
          transition: "width 0.5s 0s",
          zIndex: 300,
        }}
      >
        <Box
          sx={{
            width: "20em", // Prevent DOM reflow.
          }}
        >
          {children}
        </Box>
      </Paper>
    </SidebarPanelContext.Provider>
  );
}

/** Handle object helps us hide, show, and drag our panel.*/
SidebarPanel.Handle = function SidebarPanelHandle({
  children,
}: {
  children: string | React.ReactNode;
}) {
  const { toggleCollapsed, collapsible } =
    React.useContext(SidebarPanelContext)!;

  const collapseSidebarToggleButton = (
    <ActionIcon
      onClick={(evt) => {
        evt.stopPropagation();
        toggleCollapsed();
      }}
    >
      <Tooltip label={"Collapse sidebar"}>
        {<IconChevronRight stroke={1.625} />}
      </Tooltip>
    </ActionIcon>
  );

  return (
    <Box
      p="xs"
      sx={(theme) => ({
        backgroundColor:
          theme.colorScheme == "dark"
            ? theme.colors.dark[5]
            : theme.colors.gray[1],
        lineHeight: "1.5em",
        fontWeight: 400,
        position: "relative",
        zIndex: 1,
        alignItems: "center",
        display: "flex",
        flexDirection: "row",
      })}
    >
      {children}
      {collapsible ? collapseSidebarToggleButton : null}
    </Box>
  );
};
/** Contents of a panel. */
SidebarPanel.Contents = function SidebarPanelContents({
  children,
}: {
  children: string | React.ReactNode;
}) {
  return children;
};