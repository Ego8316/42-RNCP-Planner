import { APITester } from "./APITester";
import "./index.css";
import { css } from "../styled-system/css";

import logo from "./logo.svg";
import reactLogo from "./react.svg";

export function App() {
    return (
        <div className="app">
            <div className="logo-container">
                <img src={logo} alt="Bun Logo" className="logo bun-logo" />
                <img src={reactLogo} alt="React Logo" className="logo react-logo" />
            </div>

            <h1
                className={css({
                    color: "orange.400",
                    fontWeight: "bold",
                    padding: "4",
                    backgroundColor: "blue.800",
                    borderRadius: "md",
                })}
            >
                Bun + React
            </h1>
            <p>
                Edit <code>src/App.tsx</code> and save to test HMR it works!
            </p>
            <APITester />
        </div>
    );
}

export default App;
