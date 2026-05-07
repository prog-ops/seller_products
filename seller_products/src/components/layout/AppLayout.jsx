import { useState } from 'react';
import { Link, Outlet, useNavigate } from 'react-router-dom';
import { Layout, Menu, Button, Drawer, Typography, Space, Avatar } from 'antd';
import { MenuOutlined, ShopOutlined, PlusOutlined, LogoutOutlined, UserOutlined } from '@ant-design/icons';
import { useAuth } from '../../context/AuthContext';

const { Header, Content } = Layout;
const { Title } = Typography;

/**
 * AppLayout — layout utama aplikasi setelah login.
 * Menampilkan header dengan navigasi dan drawer sidebar.
 */
export default function AppLayout() {
    const [drawerOpen, setDrawerOpen] = useState(false);
    const { user, logout } = useAuth();
    const navigate = useNavigate();

    const handleLogout = () => {
        logout();
        navigate('/login');
    };

    const drawerMenuItems = [
        { key: 'list', icon: <ShopOutlined />, label: <Link to="/">Daftar Produk</Link> },
        { key: 'add', icon: <PlusOutlined />, label: <Link to="/add">Tambah Produk</Link> },
    ];

    return (
        <Layout style={{ minHeight: '100vh' }}>
            <Header
                style={{
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'space-between',
                    padding: '0 24px',
                    background: '#001529',
                    position: 'sticky',
                    top: 0,
                    zIndex: 100,
                }}
            >
                <Space>
                    <Button
                        type="text"
                        icon={<MenuOutlined />}
                        onClick={() => setDrawerOpen(true)}
                        style={{ color: '#fff', fontSize: 18 }}
                    />
                    <Title level={4} style={{ color: '#fff', margin: 0 }}>
                        Toko Produk Laris
                    </Title>
                </Space>

                <Space>
                    <Avatar icon={<UserOutlined />} size="small" />
                    <span style={{ color: '#ffffffb3' }}>{user?.username}</span>
                    <Button
                        type="text"
                        icon={<LogoutOutlined />}
                        onClick={handleLogout}
                        style={{ color: '#ff7875' }}
                    >
                        Logout
                    </Button>
                </Space>
            </Header>

            <Drawer
                title="Navigasi"
                placement="left"
                onClose={() => setDrawerOpen(false)}
                open={drawerOpen}
                width={260}
            >
                <Menu
                    mode="inline"
                    items={drawerMenuItems}
                    onClick={() => setDrawerOpen(false)}
                />
            </Drawer>

            <Content style={{ padding: '24px', background: '#f5f5f5', minHeight: 'calc(100vh - 64px)' }}>
                <Outlet />
            </Content>
        </Layout>
    );
}
