import logo from "../assets/logo.png"
import { TfiHome, TfiAgenda , TfiNotepad, TfiBarChartAlt, TfiSettings, TfiLayers , TfiHelpAlt , TfiTruck , TfiGift , TfiWrite  } from "react-icons/tfi";
import { TbBowlSpoon , TbBrandCakephp , TbToolsKitchen3 } from "react-icons/tb";

const SidebarMenu = () => {
  return (
    <div className="menu">
      <div className="logo">
        <img src={logo} />
      </div>
      <nav>
        <ul>
          <li><TfiHome size={15} style={{ marginBottom: "-1%" , fontWeight: 700}}/> Dasboard</li>
          <li><TfiBarChartAlt  size={16} style={{ marginBottom: "-1%" , fontWeight: 700}}/> Reports</li>
          <li><TfiNotepad size={15} style={{ marginBottom: "-1%" , fontWeight: 700}}/> Orders</li>
          <li><TbBowlSpoon  size={18} style={{ marginBottom: "-1%" , fontWeight: 700}}/> Meals</li>
          <li><TbBrandCakephp size={15} style={{ marginBottom: "-1%" , fontWeight: 700}}/> Menu</li>
          <li className="active"><TbToolsKitchen3  size={15} style={{ marginBottom: "-1%" , fontWeight: 700}}/> Reservations</li>
          <li><TfiGift  size={15} style={{ marginBottom: "-0.5%" , fontWeight: 700}}/> Vouchers</li>
          <li><TfiTruck size={15} style={{ marginBottom: "-1%" , fontWeight: 700}}/> Suppliers</li>
        </ul>
        <ul>
          <li><TfiLayers size={15} style={{ marginBottom: "-1%" , fontWeight: 700}}/> App Settings</li>
          <li><TfiSettings size={15} style={{ marginBottom: "-1%" , fontWeight: 700}}/> General Settings</li>
          <li><TfiHelpAlt size={15} style={{ marginBottom: "-1%" , fontWeight: 700}}/> Support</li>
        </ul>
      </nav>
    </div>
  )
}

export default SidebarMenu