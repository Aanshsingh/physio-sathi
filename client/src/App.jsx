import { Routes, Route } from 'react-router-dom'
import Layout from './components/common/Layout.jsx'
import Home from './components/pages/Home.jsx'
import Find from './components/pages/Find.jsx'
import Equipment from './components/pages/Equipment.jsx'
import ComingSoon from './components/common/ComingSoon.jsx'
import Planner from './components/pages/Planner.jsx'
import Assistant from './components/pages/Assistant.jsx'
import Nearby from './components/pages/Nearby.jsx'
import ProviderDetails from './components/pages/ProviderDetails.jsx'

export default function App() {
  return (
    <Routes>
      <Route element={<Layout />}>
        <Route path="/" element={<Home />} />
        <Route path="/find" element={<Find />} />
        <Route path="/providers/:id" element={<ProviderDetails />} />
        <Route path="/equipment" element={<Equipment />} />
        <Route path="/planner" element={<Planner />} />
        <Route path="/assistant" element={<Assistant />} />
        <Route path="/nearby" element={<Nearby />} />
        <Route path="*" element={<ComingSoon title="Page not found" step="" />} />
      </Route>
    </Routes>
  )
}
