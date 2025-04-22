import React from "react";

const Sidebar = ({ logo, title, menuItems, isOpen, toggleSidebar }) => {
  return (
    <div className={`sidebar ${isOpen ? 'sidebar-open' : 'sidebar-closed'}`}>
      <div className="sidebar-header text-center">
        <img src={logo} alt="Logo" className="img-fluid" />
        {title && <p className="mt-2 mb-0">{title}</p>}
      </div>

      <div className="sidebar-menu">
        <ul className="nav flex-column">
          {menuItems.map((item, index) => (
            <li
              key={index}
              className={`nav-item ${item.marginTop ? "mt-3" : ""} ${
                item.marginTopLarge ? "mt-5" : ""
              }`}
            >
              <a href={item.href} className={`nav-link ${item.active ? "active" : ""}`}>
                <i className={`fas ${item.icon}`}></i> 
                <span className="menu-text">{item.text}</span>
                {item.badge && (
                  <span className={`badge ${item.badgeColor} float-end`}>
                    {item.badge}
                  </span>
                )}
              </a>
            </li>
          ))}
        </ul>
      </div>
      <button className="sidebar-toggle d-md-none" onClick={toggleSidebar}>
        <i className={`fas fa-${isOpen ? 'times' : 'bars'}`}></i>
      </button>
    </div>
  );
};

export default Sidebar;