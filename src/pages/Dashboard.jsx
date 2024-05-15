import Content from "../components/Content"
import SidebarMenu from "../components/SidebarMenu"

const Dashboard = () => {
  return (
    <div className="wrapper">
      <SidebarMenu/>
      <Content/>    
    </div>
  )
}

export default Dashboard