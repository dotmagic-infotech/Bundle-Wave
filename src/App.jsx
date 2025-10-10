// React Imports
import { useContext, useState } from 'react';

// Shopify Imports
import { NavMenu } from '@shopify/app-bridge-react';

// Third Party Imports
import { Link, Navigate, Route, Routes } from 'react-router-dom'

// Css
import './App.css'

// Components
import Home from './pages/Home'
import BundleTable from './pages/Bundles/components/BundleTable';
import BundleList from './pages/Bundles/BundleList';
// import BundleListCopy from './pages/Bundles/BundleListCopyy';
import Analytics from './pages/Analytics/Analytics';
import BundleFixed from './pages/Bundles/components/BundleFixed';
import BundleMixMatch from './pages/Bundles/components/BundleMixMatch';
import BundleXY from './pages/Bundles/components/BundleXY';
import BundleVolume from './pages/Bundles/components/BundleVolume';
import Frequently from './pages/Bundles/components/Frequently';
import BundleAddons from './pages/Bundles/components/BundleAddons';
import Error404 from './components/Error404';
import Settings from './pages/Settings/Settings';
import Plans from './pages/Plans/Plans';
import CustomizeDesign from './pages/CustomizeDesign/CustomizeDesign';
import ContactPopup from "./components/ContactPopup/ContactPopup";

// Custom Component
import { useSessionToken } from './components/Session/SessionTokenProvider';
import { MetaContext } from './components/MetaDataContext/MetaDataProvider';
import NotAccess from './components/NotAccess';

function App() {

  // Hooks
  const token = useSessionToken();
  const { metaData } = useContext(MetaContext);

  // State
  const [showPopup, setShowPopup] = useState(false);

  const togglePopup = () => setShowPopup((prev) => !prev);

  if (!token) {
    return <div>Authentication failed or token not available.</div>;
  }

  return (
    <>
      <button className="contact-button" onClick={togglePopup}>
        Contact Us
      </button>

      <div className={`contact-popup-container ${showPopup ? "open" : ""}`}>
        {showPopup && <ContactPopup showPopup={showPopup}  onClose={() => setShowPopup(false)} />}
      </div>

      <NavMenu>
        <Link to="/" rel="home">Home</Link>
        <Link to="/bundles" rel='bundle'>Bundles</Link>
        <Link to="/customization/fixedbundle" rel='Customization'>Customization</Link>
        <Link to="/analytics" rel='Analytics'>Analytics</Link>
        <Link to="/settings" rel='settings'>Settings</Link>
        <Link to="/plans" rel='plans'>Subscription</Link>
      </NavMenu>

      <Routes>
        <Route path="/" element={<Navigate to="/home" replace />} />

        {/* Home Page */}
        <Route path="/home" element={<Home />} />

        {/* Bundle  */}
        <Route path="/bundles" element={<BundleTable />} />
        {/* <Route path="/bundlesList" element={<BundleListCopyy />} /> */}
        <Route path="/bundlesList" element={<BundleList />} />

        <Route path="/analytics" element={metaData?.analytics === "1" ? <Analytics /> : <NotAccess />} />
        <Route path="/customization/:name" element={metaData?.customization === "1" ? <CustomizeDesign /> : <NotAccess />} />

        <Route path="/bundlesList/fixed_bundle" element={<BundleFixed />} />
        <Route path="/bundlesList/fixed_bundle/edit/:id" element={<BundleFixed />} />

        <Route path="/bundlesList/mix-match" element={metaData?.bundle_permission?.bundle_mixmatch?.disabled === "1" ? <NotAccess /> : <BundleMixMatch />} />
        <Route path="/bundlesList/mix-match/edit/:id" element={metaData?.bundle_permission?.bundle_mixmatch?.disabled === "1" ? <NotAccess /> : <BundleMixMatch />} />

        <Route path="/bundlesList/buy_xy" element={metaData?.bundle_permission?.bundle_xy?.disabled === "1" ? <NotAccess /> : <BundleXY />} />
        <Route path="/bundlesList/buy_xy/edit/:id" element={metaData?.bundle_permission?.bundle_xy?.disabled === "1" ? <NotAccess /> : <BundleXY />} />

        <Route path="/bundlesList/volume_bundle" element={metaData?.bundle_permission?.bundle_volume?.disabled === "1" ? <NotAccess /> : <BundleVolume />} />
        <Route path="/bundlesList/volume_bundle/edit/:id" element={metaData?.bundle_permission?.bundle_volume?.disabled === "1" ? <NotAccess /> : <BundleVolume />} />

        <Route path="/bundlesList/addons_bundle" element={metaData?.bundle_permission?.bundle_addons?.disabled === "1" ? <NotAccess /> : <BundleAddons />} />
        <Route path="/bundlesList/addons_bundle/edit/:id" element={metaData?.bundle_permission?.bundle_addons?.disabled === "1" ? <NotAccess /> : <BundleAddons />} />

        <Route path="/bundlesList/frequently_bundle" element={metaData?.bundle_permission?.bundle_frequent?.disabled === "1" ? <NotAccess /> : <Frequently />} />
        <Route path="/bundlesList/frequently_bundle/edit/:id" element={metaData?.bundle_permission?.bundle_frequent?.disabled === "1" ? <NotAccess /> : <Frequently />} />

        {/* Settings */}
        <Route path="/settings" element={<Settings />} />

        {/* Plans */}
        <Route path="/plans" element={<Plans />} />

        {/* Wild Card */}
        <Route path="*" element={<Error404 />} />
      </Routes>
    </>
  );
}

export default App