import React, { useState } from 'react';

interface Tab {
  label: string;
  content: React.ReactNode;
}

interface TabsProps {
  tabs: Tab[];
}

const Tabs: React.FC<TabsProps> = ({ tabs }) => {
  const [activeTab, setActiveTab] = useState(0);

  const containerStyle: React.CSSProperties = {
    width: '100%',
  };

  const tabListStyle: React.CSSProperties = {
    display: 'flex',
    borderBottom: '1px solid #ccc',
  };

  const tabStyle: React.CSSProperties = {
    padding: '10px 15px',
    cursor: 'pointer',
    borderBottom: '2px solid transparent',
  };

  const activeTabStyle: React.CSSProperties = {
    ...tabStyle,
    borderBottom: '2px solid #3498db',
    fontWeight: 'bold',
  };

  const contentStyle: React.CSSProperties = {
    padding: '20px 0',
  };

  return (
    <div style={containerStyle}>
      <div style={tabListStyle}>
        {tabs.map((tab, index) => (
          <div
            key={index}
            style={index === activeTab ? activeTabStyle : tabStyle}
            onClick={() => setActiveTab(index)}
          >
            {tab.label}
          </div>
        ))}
      </div>
      <div style={contentStyle}>{tabs[activeTab].content}</div>
    </div>
  );
};

export default Tabs;

