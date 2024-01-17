import {useState} from 'react'
import {BrowserRouter, Link, Route, Router, Routes} from "react-router-dom";
import './App.css'
import ProductList from "./components/ProductList.jsx";
import ProductAdd from "./components/ProductAdd.jsx";
import {Button, Drawer, Menu} from "antd";

function App() {
    const [visible, setVisible] = useState(false);
    const showDrawer = () => {
        setVisible(true);
    };
    const onClose = () => {
        setVisible(false);
    };
    const handleLogout = () => {
        console.log('Logout clicked');
    };

    return (
        <BrowserRouter>
            <div>
                {/* Top Navigation Bar */}
                <Menu mode="horizontal" theme="dark">
                    <Menu.Item key="openDrawer" onClick={showDrawer}>
                        Open Drawer
                    </Menu.Item>
                    <Menu.Item key="logout" style={{ marginLeft: 'auto' }}>
                        <Button type="link" onClick={handleLogout}>
                            Logout
                        </Button>
                    </Menu.Item>
                </Menu>

                {/* Drawer */}
                <Drawer
                    title="Toko Produk Laris"
                    placement="left"
                    closable={false}
                    onClose={onClose}
                    visible={visible}>
                    <Menu mode="vertical" theme="dark" onClick={onClose}>
                        <Menu.Item key="productList">
                            <Link to="/">Product List</Link>
                        </Menu.Item>
                        <Menu.Item key="addProduct">
                            <Link to="/add">Add Product</Link>
                        </Menu.Item>
                    </Menu>
                </Drawer>

                {/*<div style={{marginLeft: 16}}>
                    <button onClick={showDrawer} style={{marginBottom: 16}}>
                        Open Drawer
                    </button>
                </div>*/}
                <Routes>
                    <Route path='/' element={<ProductList/>}/>
                    <Route path='/add' element={<ProductAdd/>}/>
                </Routes>
            </div>
        </BrowserRouter>
    )
}

export default App
