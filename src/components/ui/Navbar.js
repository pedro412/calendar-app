import React from 'react';

const Navbar = () => {
  return (
    <div className="navbar navbar-dark bg-dark mb-4 px-3">
      <span className="navbar-brand">Pedro</span>

      <button className="btn btn-danger">
        <i className="fas fa-sign-out-alt"></i>
        <span> Salir</span>
      </button>
    </div>
  );
};

export default Navbar;
