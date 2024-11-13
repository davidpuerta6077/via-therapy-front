import React, { useState } from "react";
import { Outlet, NavLink } from "react-router-dom";
import {
    FaBalanceScale,
    FaAngleRight,
    FaBars,
    FaUser
} from "react-icons/fa";

const Sidebar = () => {
    const [show, setShow] = useState(false);
    const [showSubMenu, setShowSubMenu] = useState(false);

    const openSubMenu = () => {
        setShowSubMenu(true);
    };

    const closeSubMenu = () => {
        setShowSubMenu(false);
    };

    const toggleSubMenu = () => {
        if (showSubMenu) {
            closeSubMenu();
        } else {
            openSubMenu();
        }
    };

    return (
        <main className={show ? "space-toggle" : null}>
            <header className={`header ${show ? "space-toggle" : null} shadow-left`}>
                <div className="header-toggle" onClick={() => setShow(!show)}>
                    <FaBars style={{ color: "black" }} />
                </div>
                <div className="header-cat">

                    <div
                        className="text-center justify-content-center d-block d-lg-none"
                        style={{ width: "100%" }}
                    >
                        <NavLink to={`/`}
                            className="">
                            <p>Logo</p>
                        </NavLink>
                    </div>
                </div>
                <div
                    className="justify-content-end"
                >
                    <NavLink to={`/`}
                        className="">
                        <p></p>
                    </NavLink>
                </div>
            </header>

            <aside className={`sidebar ${show ? "show" : null}`}>
                <nav className="nav">
                    <div>
                        <div className="nav-list">
                            <div>
                                <NavLink
                                    to={`/main`}
                                    className="nav-li"
                                    activeClassName="nav-li-active"
                                    title="Inicio"
                                >
                                    <FaBalanceScale className="nav-logo-icon" />
                                    <span className="nav-li-name">Inicio</span>
                                </NavLink>
                                <div
                                    className="nav-li"
                                    onClick={toggleSubMenu}
                                    title="Desplegable"
                                >
                                    <FaUser className="nav-logo-icon" />
                                    <span className="nav-li-name" activeClassName="nav-li-active">

                                        Modulos{" "}
                                        <FaAngleRight
                                            className={`nav-li-icon ${showSubMenu ? "rotate" : ""}`}
                                        />
                                    </span>
                                </div>
                                <div>
                                    {showSubMenu && (
                                        <div
                                            className={`submenu ${showSubMenu ? "show" : ""} shadow-blue-right`}
                                        >
                                            <NavLink
                                                to={`/client`}
                                                className="submenu-item"
                                                activeClassName="nav-li-active"
                                                onClick={closeSubMenu}
                                            >
                                                Postura
                                            </NavLink>
                                            <NavLink
                                                to={`/routines`}
                                                className="submenu-item"
                                                activeClassName="nav-li-active"
                                                onClick={closeSubMenu}
                                            >
                                                Rutinas
                                            </NavLink>
                                        </div>
                                    )}
                                </div>
                            </div>
                        </div>
                    </div>
                </nav>
            </aside>

            <Outlet />
        </main>
    );
};

export default Sidebar;
