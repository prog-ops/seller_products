import {useState} from 'react'
import {BrowserRouter, Link, Route, Router, Routes} from "react-router-dom";
import './App.css'
import ProductList from "./components/ProductList.jsx";
import ProductAdd from "./components/ProductAdd.jsx";
import {Button, Drawer, Form, Input, Menu} from "antd";
import {MenuOutlined} from "@ant-design/icons";

const correctUsername = 'user';
const correctPassword = 'pass';

function App() {
    const [visible, setVisible] = useState(false);
    const [loggedIn, setLoggedIn] = useState(false);
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');

    const showDrawer = () => {
        setVisible(true);
    };
    const onClose = () => {
        setVisible(false);
    };

    const handleLogout = () => {
        setLoggedIn(false);
        setUsername('');
        setPassword('');
    };

    const handleLogin = () => {
        if (username === correctUsername && password === correctPassword) {
            setLoggedIn(true);
            onClose();
        } else {
            alert('Invalid username or password');
        }
    };

    return (
        <BrowserRouter>
            {loggedIn ? <div>
                {/* Top Navigation Bar */}
                <Menu mode="horizontal" theme="dark">
                    <Menu.Item key="openDrawer" onClick={showDrawer}>
                        <MenuOutlined />
                    </Menu.Item>
                    <Menu.Item key="logout" style={{marginLeft: 'auto'}}>
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
                    open={visible}>
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
            </div> : null}
            {!loggedIn ? (
                // Login Form
                <div style={{ maxWidth: 300, margin: '20px auto' }}>
                    <Form>
                        <Form.Item label="Username">
                            <Input
                                type="text"
                                value={username}
                                onChange={(e) => setUsername(e.target.value)}
                            />
                        </Form.Item>
                        <Form.Item label="Password">
                            <Input.Password
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                            />
                        </Form.Item>
                        <Form.Item>
                            <Button type="primary" onClick={handleLogin}>
                                Login
                            </Button>
                        </Form.Item>
                    </Form>
                </div>
            ) : null}
        </BrowserRouter>
    )
}

export default App
