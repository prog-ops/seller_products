import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Form, Input, Button, Card, Typography, message, Space } from 'antd';
import { UserOutlined, LockOutlined, ShopOutlined } from '@ant-design/icons';
import { useAuth } from '../context/AuthContext';

const { Title, Text, Link } = Typography;

/**
 * LoginPage — halaman login dengan panggilan API ke backend.
 */
export default function LoginPage() {
    const [loading, setLoading] = useState(false);
    const { login } = useAuth();
    const navigate = useNavigate();

    const handleSubmit = async (values) => {
        setLoading(true);
        try {
            await login(values.username, values.password);
            message.success('Login berhasil!');
            navigate('/');
        } catch (err) {
            message.error(err.response?.data?.message || 'Login gagal. Coba lagi.');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div
            style={{
                minHeight: '100vh',
                display: 'flex',
                justifyContent: 'center',
                alignItems: 'center',
                background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
            }}
        >
            <Card
                style={{
                    width: 400,
                    borderRadius: 12,
                    boxShadow: '0 20px 60px rgba(0,0,0,0.3)',
                }}
                bordered={false}
            >
                <Space direction="vertical" size="middle" style={{ width: '100%', textAlign: 'center' }}>
                    <ShopOutlined style={{ fontSize: 48, color: '#764ba2' }} />
                    <Title level={3} style={{ margin: 0 }}>Seller Dashboard</Title>
                    <Text type="secondary">Masuk untuk mengelola produk Anda</Text>
                </Space>

                <Form
                    layout="vertical"
                    onFinish={handleSubmit}
                    style={{ marginTop: 24 }}
                    requiredMark={false}
                >
                    <Form.Item
                        name="username"
                        rules={[{ required: true, message: 'Username wajib diisi' }]}
                    >
                        <Input
                            prefix={<UserOutlined />}
                            placeholder="Username"
                            size="large"
                        />
                    </Form.Item>

                    <Form.Item
                        name="password"
                        rules={[{ required: true, message: 'Password wajib diisi' }]}
                    >
                        <Input.Password
                            prefix={<LockOutlined />}
                            placeholder="Password"
                            size="large"
                        />
                    </Form.Item>

                    <Form.Item>
                        <Button
                            type="primary"
                            htmlType="submit"
                            block
                            size="large"
                            loading={loading}
                            style={{
                                background: 'linear-gradient(135deg, #667eea, #764ba2)',
                                border: 'none',
                                height: 48,
                                borderRadius: 8,
                            }}
                        >
                            Masuk
                        </Button>
                    </Form.Item>
                </Form>

                <Text type="secondary" style={{ display: 'block', textAlign: 'center', fontSize: 12 }}>
                    Default: admin / admin123
                </Text>
            </Card>
        </div>
    );
}
