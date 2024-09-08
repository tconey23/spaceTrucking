import React from 'react'

const AccountSettings = ({loggedIn, credentials, displayName}) => {

  return (
    <div>
      {loggedIn && 
        <>
            <span>
                <i class="fi fi-br-wifi"></i>
                {loggedIn && <p>Online</p>}
            </span>

            <span>
                <i class="fi fi-sr-user"></i>
                {credentials && <p>{credentials[0]}</p>}
            </span>


            <span>
                <i class="fi fi-sr-lock"></i>
                <p>password</p>
            </span>

            <span>
                <i class="fi fi-sr-fighter-jet"></i>
                {displayName && <p>{displayName}</p>}
            </span>

            <span>
                <i class="fi fi-sr-trash"></i>
                <p>Delete Account</p>
            </span>

            
        </>
      }
    </div>
  )
}

export default AccountSettings
