
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import "./style/css/main.scss"
import 'bootstrap/dist/css/bootstrap.min.css';
import DashLayout from './components/layout/DashLayout';
import AllRoutes from './authentication/AllRoutes';
import Authenticator from './Auth';
function App() {
  return (
    <BrowserRouter>
      <Authenticator>
        <Routes>
          {AllRoutes.CommonRoutes.map(({ path, components }, key) => {
            return <Route key={key} path={path} element={components} />
          })}
          <Route path='/dashboard' element={<DashLayout />}>
            {AllRoutes.DashRoutes.map(({ path, components }, key) => {
              return <Route key={key} path={path} element={components} />
            })}
          </Route>
        </Routes>
      </Authenticator>
    </BrowserRouter>
  );
}
export default App;