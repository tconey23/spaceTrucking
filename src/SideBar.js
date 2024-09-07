import React, { useEffect } from 'react';
import { NavLink } from 'react-router-dom';
import { useSpring, animated, easings } from 'react-spring';
import './SideBar.css';

const SideBar = ({ loggedIn, logRef, location, toggleSideBar, setToggleSideBar }, handleLogout) => {

  const sidebarAnimation = useSpring({
    left: toggleSideBar ? '0vw' : '-120vw',
    config: {
      duration: 1500,
      easing: easings.easeInOutCubic,
    },
  });

  const handleClick = (e) => {
    console.log(e.target.tagName);
    if (e.target.tagName === 'I') {
      setToggleSideBar(false)
      console.log('Icon clicked, sidebar should close.');
    }
  };

  return (
    <animated.div style={sidebarAnimation} className="sidebar-menu-wrapper" onClick={handleClick}>
      <div  className="link-container">
        {!loggedIn && (
          <NavLink ref={logRef} className="login" to="/login">
            <i className="fi fi-bs-power"></i>
          </NavLink>
        )}
        {loggedIn && (
          <NavLink
            ref={logRef}
            className="logout"
            to=""
            onClick={handleLogout}
          >
            <i className="fi fi-bs-power"></i>
          </NavLink>
        )}
        {location.pathname !== '/home' && (
          <NavLink className="home" to="/home">
            <i className="fi fi-sr-home"></i>
          </NavLink>
        )}
        {location.pathname !== '/mycargo' && (
          <NavLink className="cargo" to="/mycargo">
            <i className="fi fi-br-forklift"></i>
          </NavLink>
        )}
        {location.pathname !== '/myfleet' && (
          <NavLink className="fleet" to="/myfleet">
            <i className="fi fi-sr-garage-car"></i>
          </NavLink>
        )}
      </div>
    </animated.div>
  );
};

export default SideBar;
