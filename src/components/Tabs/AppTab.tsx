import "assets/styles/modules/_tabs.scss";
import React, { useState, useEffect, useRef } from "react";
import { ReactSortable } from "react-sortablejs";
import { isMobile } from "react-device-detect";

import { ITab } from "models/tabs";

import AppTabList from "components/Tabs/AppTabList";
import AppTabPopoverList from "components/Tabs/AppTabPopoverList";
import IconChevron from "components/Icons/IconChevron";

interface IProps {
  tabs: ITab[];
  updatedTabs: (tabs: ITab[]) => void;
  clickEvent: (id: number) => void;
}

const AppTab: React.FC<IProps> = ({ tabs, updatedTabs, clickEvent }) => {
  const [pinnedTabs, setPinnedTabs] = useState<ITab[]>([]);
  const [unpinnedTabs, setUnpinnedTabs] = useState<ITab[]>([]);
  const [hiddenTabs, setHiddenTabs] = useState<ITab[]>([]);
  const [contextMenuId, setContextMenuId] = useState<number | null>(null);
  const [popover, setPopover] = useState<boolean>(false);

  const unpinnedTabsRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleClickOutside = () => {
      setContextMenuId(null);
    };

    document.addEventListener("click", handleClickOutside);

    return () => {
      document.removeEventListener("click", handleClickOutside);
    };
  }, []);

  useEffect(() => {
    const pinnedTabs = tabs.filter((tab) => tab.pinned);
    const unpinnedTabs = tabs.filter((tab) => !tab.pinned);

    setPinnedTabs(pinnedTabs);
    setUnpinnedTabs(unpinnedTabs);
  }, [tabs]);

  useEffect(() => {
    if (unpinnedTabs.length) {
      handleOverflow();
      emitTabs();
    }
  }, [unpinnedTabs, pinnedTabs]);

  const emitTabs = () => {
    const allTabs = [...pinnedTabs, ...unpinnedTabs, ...hiddenTabs];

    updatedTabs(allTabs);
  };

  const handleOverflow = () => {
    if (unpinnedTabsRef.current && !isMobile) {
      const { clientWidth, scrollWidth } = unpinnedTabsRef.current;

      if (scrollWidth > clientWidth) {
        const overflowedTabs = [...unpinnedTabs];
        const hiddenTab = overflowedTabs.pop();

        if (hiddenTab) {
          setHiddenTabs((prevHiddenTabs) => [...prevHiddenTabs, hiddenTab]);
          setUnpinnedTabs(overflowedTabs);
        }
      }
    }
  };

  const pinTab = (id: number) => {
    const updatedUnpinnedTabs = unpinnedTabs.filter((tab) => tab.id !== id);
    const pinnedTab = unpinnedTabs.find((tab) => tab.id === id);

    if (pinnedTab) {
      pinnedTab.pinned = true;
      setPinnedTabs((prevPinnedTabs) => [...prevPinnedTabs, pinnedTab]);
      setUnpinnedTabs(updatedUnpinnedTabs);
    }
  };

  const unpinTab = (id: number) => {
    const updatedPinnedTabs = pinnedTabs.filter((tab) => tab.id !== id);
    const unpinnedTab = pinnedTabs.find((tab) => tab.id === id);

    if (unpinnedTab) {
      unpinnedTab.pinned = false;
      setUnpinnedTabs((prevUnpinnedTabs) => [...prevUnpinnedTabs, unpinnedTab]);
      setPinnedTabs(updatedPinnedTabs);
    }
  };

  const toggleContextMenu = (event: React.MouseEvent, id: number) => {
    event.preventDefault();
    if (contextMenuId === id) {
      setContextMenuId(null);
    } else {
      setContextMenuId(id);
    }
  };

  const handleClick = (tab: ITab) => {
    const updatedTabs = [...pinnedTabs, ...unpinnedTabs];
    const activeTab = updatedTabs.find((t) => t.active);
    activeTab && (activeTab.active = false);
    tab.active = true;
    clickEvent(tab.id);
  };

  const onUnchoose = (/**Event*/ evt: any, tabs: ITab[]) => {
    const tab = tabs[evt.oldIndex as number];
    handleClick(tab);
  };

  return (
    <div className="app-tabs">
      <div className="app-tabs__list app-tabs__list--pinned">
        <ReactSortable
          list={pinnedTabs}
          setList={setPinnedTabs}
          className="app-tabs__list-sortable"
          delay={isMobile ? 200 : 0}
          onUnchoose={(evt) => onUnchoose(evt, unpinnedTabs)}
        >
          <AppTabList
            tabs={pinnedTabs}
            contextMenuId={contextMenuId}
            nameIsVisible={false}
            toggleContextMenu={toggleContextMenu}
            handleClick={handleClick}
            onClickContextMenu={unpinTab}
            contextMenuLabel="Unpin"
          />
        </ReactSortable>
      </div>
      <div
        ref={unpinnedTabsRef}
        className="app-tabs__list app-tabs__list--unpinned"
      >
        <ReactSortable
          list={unpinnedTabs}
          setList={setUnpinnedTabs}
          className={`app-tabs__list-sortable ${
            pinnedTabs?.length ? "app-tabs__list-sortable--divider" : ""
          }`}
          group={"shared"}
          delay={isMobile ? 200 : 0}
          onUnchoose={(evt) => onUnchoose(evt, unpinnedTabs)}
        >
          <AppTabList
            tabs={unpinnedTabs}
            contextMenuId={contextMenuId}
            nameIsVisible={true}
            toggleContextMenu={toggleContextMenu}
            handleClick={handleClick}
            onClickContextMenu={pinTab}
            contextMenuLabel="Pin"
          />
        </ReactSortable>
      </div>
      {hiddenTabs.length ? (
        <div
          className={`app-tabs__popover ${
            popover && "app-tabs__popover--active"
          }`}
        >
          <div
            onClick={() => setPopover(!popover)}
            className="app-tabs__popover-header"
          >
            <IconChevron />
          </div>
          {popover && (
            <div className="app-tabs__popover-body">
              <ReactSortable
                list={hiddenTabs}
                setList={setHiddenTabs}
                group={"shared"}
                delay={isMobile ? 200 : 0}
                onUnchoose={(evt) => onUnchoose(evt, unpinnedTabs)}
              >
                <AppTabPopoverList
                  tabs={hiddenTabs}
                  handleClick={handleClick}
                />
              </ReactSortable>
            </div>
          )}
        </div>
      ) : (
        ""
      )}
    </div>
  );
};

export default AppTab;
