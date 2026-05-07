import { Card, Row, Col, Spin, Empty, Alert, Button, Modal, Typography, message } from 'antd';
import { DeleteOutlined, ExclamationCircleOutlined } from '@ant-design/icons';
import { useProducts } from '../hooks/useProducts';
import api from '../api/axiosInstance';

const { Meta } = Card;
const { Title } = Typography;

/**
 * ProductList — menampilkan grid produk dengan loading, empty state,
 * dan fitur hapus dengan konfirmasi.
 */
export default function ProductList() {
    const { products, loading, error, refetch } = useProducts();

    /**
     * Menghapus produk setelah konfirmasi modal.
     * @param {number} id - Product ID
     * @param {string} name - Product name (untuk pesan konfirmasi)
     */
    const handleDelete = (id, name) => {
        Modal.confirm({
            title: 'Hapus Produk',
            icon: <ExclamationCircleOutlined />,
            content: `Apakah Anda yakin ingin menghapus "${name}"? Aksi ini tidak bisa dibatalkan.`,
            okText: 'Hapus',
            okType: 'danger',
            cancelText: 'Batal',
            onOk: async () => {
                try {
                    await api.delete(`/products/${id}`);
                    message.success('Produk berhasil dihapus.');
                    refetch();
                } catch (err) {
                    message.error(err.response?.data?.message || 'Gagal menghapus produk.');
                }
            },
        });
    };

    if (loading) {
        return (
            <div style={{ textAlign: 'center', padding: '80px 0' }}>
                <Spin size="large" tip="Memuat produk..." />
            </div>
        );
    }

    if (error) {
        return (
            <Alert
                type="error"
                message="Error"
                description={error}
                showIcon
                style={{ margin: 24 }}
                action={<Button onClick={refetch}>Coba Lagi</Button>}
            />
        );
    }

    return (
        <div>
            <Title level={3} style={{ marginBottom: 24 }}>Daftar Produk</Title>

            {products.length === 0 ? (
                <Empty description="Belum ada produk. Tambahkan produk pertama Anda!" />
            ) : (
                <Row gutter={[16, 16]}>
                    {products.map((product) => (
                        <Col xs={24} sm={12} md={8} lg={6} key={product.id}>
                            <Card
                                hoverable
                                cover={
                                    <img
                                        alt={product.name}
                                        src={product.url}
                                        style={{ height: 200, objectFit: 'cover' }}
                                        onError={(e) => {
                                            e.target.onerror = null;
                                            e.target.src =
                                                'https://dummyimage.com/400x300/ccc/000.jpg&text=No+Image';
                                        }}
                                    />
                                }
                                actions={[
                                    <Button
                                        type="text"
                                        danger
                                        icon={<DeleteOutlined />}
                                        onClick={() => handleDelete(product.id, product.name)}
                                        key="delete"
                                    >
                                        Hapus
                                    </Button>,
                                ]}
                            >
                                <Meta title={product.name} />
                            </Card>
                        </Col>
                    ))}
                </Row>
            )}
        </div>
    );
}
