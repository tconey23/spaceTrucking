import React, { useEffect, useRef, useState } from 'react';
import { NavLink } from 'react-router-dom';
import { useSpring, animated, easings } from 'react-spring';
import AccountSettings from './AccountSettings';
import './SideBar.css';

const SideBar = ({ loggedIn, logRef, location, toggleSideBar, setToggleSideBar, handleLogout, credentials, displayName }) => {
  const sidebarRef = useRef(null);
  const [toggleAcct, setToggleAcct] = useState(false)

  // Animation for sidebar
  const sidebarAnimation = useSpring({
    left: toggleSideBar ? '0vw' : '-120vw',
    config: {
      duration: 1500,
      easing: easings.easeInOutCubic,
    },
  });

  // Handle clicks outside of the sidebar to close it
  useEffect(() => {
    const handleClickOutside = (e) => {
      if (sidebarRef.current && !sidebarRef.current.contains(e.target) && !e.target.className.includes('fi-sr-sidebar-flip') && !e.target.className.includes('fi-rr-user-skill-gear')) {
        setToggleSideBar(false);
        console.log(e.target.className)
      }
    };
    
    document.addEventListener('click', handleClickOutside);

    return () => {
      document.removeEventListener('click', handleClickOutside);
    };
  }, [setToggleSideBar]);

  const handleClickInside = (e) => {
    if (e.target.tagName === 'I' && !e.target.className.includes('fi-rr-user-skill-gear')) {
      setToggleSideBar(false);
    }
    if(e.target.className.includes('fi-rr-user-skill-gear')){
      setToggleAcct(true)
    }
  };

  useEffect(() => {
    console.log(credentials)
  }, [toggleSideBar])

  return (
    <animated.div
      ref={sidebarRef}
      style={sidebarAnimation}
      className="sidebar-menu-wrapper"
      onClick={handleClickInside}
    >
      <div className="link-container">
        {!loggedIn ? (
          <NavLink ref={logRef} className="login" to="/login">
            <i className="fi fi-bs-power"></i>
          </NavLink>
        ) : (
          <NavLink ref={logRef} className="logout" to="" onClick={handleLogout}>
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

        <a className="acct">
          <i class="fi fi-rr-user-skill-gear acct"></i>
        </a>
      </div>
      {toggleAcct && <div className='account_settings'>
        <div className='account-wrapper'>
          <AccountSettings displayName={displayName} loggedIn={loggedIn} credentials={credentials}/>
        </div>
      </div>}
    </animated.div>
  );
};

export default SideBar;
