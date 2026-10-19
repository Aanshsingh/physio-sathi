import { Routes, Route } from 'react-router-dom'
import Layout from './components/common/Layout.jsx'
import Home from './components/pages/Home.jsx'
import ComingSoon from './components/pages/CommingSoon.jsx'

export default function App() {
  return (
    <Routes>
      <Route element={<Layout />}>
        <Route path="/" element={<Home />} />
        <Route path="/find" element={<ComingSoon title="Find a physio" step="Step 9" />} />
        <Route path="/equipment" element={<ComingSoon title="Equipment hub" step="Step 10" />} />
        <Route path="/planner" element={<ComingSoon title="Smart cost planner" step="Step 11" />} />
        <Route path="/assistant" element={<ComingSoon title="AI Sathi" step="Step 14" />} />
        <Route path="/nearby" element={<ComingSoon title="Nearby requests (demo view)" step="Step 13" />} />
        <Route path="*" element={<ComingSoon title="Page not found" step="" />} />
      </Route>
    </Routes>
  )
}
