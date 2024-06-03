import React, { useState, useEffect } from "react";
import { ITab } from "models/tabs";
import { defaultTabs } from "helpers/tabs";
import { useNavigate } from "react-router-dom";

import AppTab from "components/Tabs/AppTab";

const Home: React.FC = () => {
  const navigate = useNavigate();
  const [tabs, setTabs] = useState<ITab[]>([]);

  const saveTabsToLocalStorage = (updatedTabs: ITab[]) => {
    localStorage.setItem("tabs", JSON.stringify(updatedTabs));
  };

  useEffect(() => {
    const storedTabs = localStorage.getItem("tabs");

    try {
      if (!storedTabs) {
        setTabs(defaultTabs);
        return;
      }
      const tabs = JSON.parse(storedTabs || "[]");
      setTabs(tabs);
    } catch (error) {
      console.error("Error parsing tabs:", error);
    }
  }, []);

  const tabRedirect = (id: number) => {
    const path = tabs.find((tab) => tab.id === id)?.path;

    if (path) {
      navigate(path);
    }
  };

  return (
    <div className="default-layout">
      <aside className="default-layout__sidebar"></aside>
      <div className="default-layout__wrapper">
        <header className="default-layout__header"></header>
        <AppTab
          tabs={tabs}
          updatedTabs={saveTabsToLocalStorage}
          clickEvent={tabRedirect}
        />
        <div className="default-layout__content">
          <main className="default-layout__card"></main>
        </div>
      </div>
    </div>
  );
};

export default Home;
