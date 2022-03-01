import React, { useState, useCallback, useEffect, Suspense } from "react";
import {
    BrowserRouter as Router,
    Redirect,
    Route,
    Switch,
} from "react-router-dom";

import MainNavigation from "./shared/components/Navigation/MainNavigation";
import LoadingSpinner from "./shared/components/UIElements/LoadingSpinner";
import { AuthContext } from "./shared/context/auth-context";

const Users = React.lazy(() => import("./user/pages/Users"));
const NewPlace = React.lazy(() => import("./places/pages/NewPlace"));
const UserPlaces = React.lazy(() => import("./places/pages/UserPlaces"));
const UpdatePlace = React.lazy(() => import("./places/pages/UpdatePlace"));
const Auth = React.lazy(() => import("./user/pages/Auth"));

let logoutTimer;

const App = () => {
    const [token, setToken] = useState(null);
    const [tokenExpirationDate, setTokenExpirationDate] = useState(null);
    const [userId, setUserId] = useState(false);

    const login = useCallback((uid, token, expirationDate) => {
        setToken(token);
        setUserId(uid);

        const tokenExpDate =
            expirationDate || new Date(new Date().getTime() + 12 * 3600 * 1000);

        setTokenExpirationDate(tokenExpDate);
        localStorage.setItem(
            "userData",
            JSON.stringify({
                userId: uid,
                token,
                expiration: tokenExpDate.toISOString(),
            })
        );
    }, []);
    const logout = useCallback(() => {
        setToken(null);
        setTokenExpirationDate(null);
        setUserId(null);
        localStorage.removeItem("userData");
    }, []);

    useEffect(() => {
        if (token && tokenExpirationDate) {
            const remainingTime =
                tokenExpirationDate.getTime() - new Date().getTime();
            logoutTimer = setTimeout(logout, remainingTime);
        } else {
            clearTimeout(logoutTimer);
        }
    }, [token, logout, tokenExpirationDate]);

    // 自动登录
    useEffect(() => {
        const storedData = JSON.parse(localStorage.getItem("userData"));
        if (
            storedData &&
            storedData.token &&
            new Date(storedData.expiration) > new Date()
        ) {
            login(
                storedData.userId,
                storedData.token,
                new Date(storedData.expiration)
            );
        }
    }, [login]);

    let routes = null;
    if (token) {
        routes = (
            <Switch>
                <Route path="/" exact>
                    <Users />
                </Route>
                <Route path="/:userId/places" exact>
                    <UserPlaces />
                </Route>
                <Route path="/places/new" exact>
                    <NewPlace />
                </Route>
                <Route path="/places/:placeId">
                    <UpdatePlace />
                </Route>
                <Redirect to="/" />
            </Switch>
        );
    } else {
        routes = (
            <Switch>
                <Route path="/" exact>
                    <Users />
                </Route>
                <Route path="/:userId/places" exact>
                    <UserPlaces />
                </Route>
                <Route path="/auth">
                    <Auth />
                </Route>
                <Redirect to="/auth" />
            </Switch>
        );
    }

    return (
        <AuthContext.Provider
            value={{
                isLoggedIn: !!token,
                token,
                userId,
                login: login,
                logout: logout,
            }}
        >
            <Router>
                <MainNavigation />
                <main>
                    <Suspense
                        fallback={
                            <div className="center">
                                <LoadingSpinner />
                            </div>
                        }
                    >
                        {routes}
                    </Suspense>
                </main>
            </Router>
        </AuthContext.Provider>
    );
};

export default App;
