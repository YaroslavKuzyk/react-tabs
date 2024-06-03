import "assets/styles/modules/_tabs.scss";
import React from "react";

import { ITab } from "models/tabs";

import IconClose from "components/Icons/IconClose";

interface IProps {
  tabs: ITab[];
  handleClick: (tab: ITab) => void;
}

const AppTabPopoverList: React.FC<IProps> = ({ tabs, handleClick }) => {
  return (
    <>
      {tabs.map((tab, index) => (
        <div
          key={`hiddedn_${tab.id}_${index}`}
          className="app-tabs__popover-item"
          onClick={() => handleClick(tab)}
        >
          <div
            className="app-tabs__item-icon"
            dangerouslySetInnerHTML={{ __html: tab.icon }}
          />
          {tab.name}
          <div className="app-tabs__popover-close">
            <IconClose />
          </div>
        </div>
      ))}
    </>
  );
};

export default AppTabPopoverList;
