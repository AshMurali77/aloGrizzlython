import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import { Dashboard as Student } from "./components_student/Dashboard";
import { Dashboard as Institution } from "./components_institution/Dashboard";

function App() {
  return (
    <div className="App">
      <header className="App-header">
        <Router>
          <Routes>
            <Route path="/*" element={<Student />} />
            <Route
              path="/institution-one"
              element={<Institution number={"one"} />}
            />
            <Route
              path="/institution-two"
              element={<Institution number={"two"} />}
            />
          </Routes>
        </Router>
      </header>
    </div>
  );
}

export default App;
