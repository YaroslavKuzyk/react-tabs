import "assets/styles/modules/_tabs.scss";
import React from "react";

import { ITab } from "models/tabs";

import IconPin from "components/Icons/IconPin";

interface IProps {
  tabs: ITab[];
  contextMenuId: number | null;
  nameIsVisible: boolean;
  toggleContextMenu: (event: React.MouseEvent, id: number) => void;
  handleClick: (tab: ITab) => void;
  onClickContextMenu: (id: number) => void;
  contextMenuLabel: string;
}

const AppTabList: React.FC<IProps> = ({
  tabs,
  contextMenuId,
  nameIsVisible,
  toggleContextMenu,
  handleClick,
  onClickContextMenu,
  contextMenuLabel,
}) => {
  return (
    <>
      {tabs.map((tab, index) => (
        <div
          key={`unpinned_${tab.id}_${index}`}
          className={`app-tabs__item ${
            tab.active ? "app-tabs__item--active" : ""
          }`}
          onContextMenu={(event) => toggleContextMenu(event, tab.id)}
          onClick={() => handleClick(tab)}
        >
          <div className="app-tabs__item-line"></div>
          <div
            className="app-tabs__item-icon"
            dangerouslySetInnerHTML={{ __html: tab.icon }}
          />
          {nameIsVisible ? tab.name : ""}
          {contextMenuId === tab.id && (
            <div
              onClick={() => onClickContextMenu(tab.id)}
              className="app-tabs__context"
            >
              <IconPin /> {contextMenuLabel}
            </div>
          )}
        </div>
      ))}
    </>
  );
};

export default AppTabList;
