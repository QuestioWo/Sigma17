/*
  Copyright Jim Carty © 2020

  This file is subject to the terms and conditions defined in file 'LICENSE.txt', which is part of this source code package.
*/

import React from 'react';

export const CustomToggle = React.forwardRef( ( { children, onClick }, ref ) => (
  <span 
    className='documentation-page-link'
    style={{ left : '50%', transform : 'translate( -50%, 0 )' }}
    ref={ref}
    onClick={ e => {
      e.preventDefault();
      onClick( e );
    } }>
    {children}
  </span>
) );

export const CustomMenu = React.forwardRef(
  ( { children, style, className, 'aria-labelledby': labeledBy }, ref ) => {
    return (
      <div
        ref={ref}
        style={style}
        className={className}
        >
        <ul className="list-unstyled">
          {children}
        </ul>
      </div>
    );
  },
);