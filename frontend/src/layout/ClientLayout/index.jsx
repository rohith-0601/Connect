import Navbar from '@/components/Navbar';
import React from 'react';
function UserLayout({children}) {
    return ( 
        <>
        <Navbar/>
        {children} 
        </>
     );
}

export default UserLayout;