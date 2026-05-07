import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Form, Input, Button, Card, Upload, Typography, message, Image, Space } from 'antd';
import { UploadOutlined, ArrowLeftOutlined } from '@ant-design/icons';
import api from '../api/axiosInstance';

const { Title } = Typography;

/**
 * ProductAdd — form untuk menambahkan produk baru.
 * Menggunakan Ant Design Form dan axios instance terpusat.
 */
export default function ProductAdd() {
    const navigate = useNavigate();
    const [file, setFile] = useState(null);
    const [preview, setPreview] = useState('');
    const [loading, setLoading] = useState(false);

    /**
     * Handle file selection — simpan file dan buat preview URL.
     */
    const handleFileChange = (info) => {
        const selectedFile = info.file.originFileObj || info.file;
        setFile(selectedFile);
        setPreview(URL.createObjectURL(selectedFile));
    };

    /**
     * Submit form — kirim data ke backend via multipart/form-data.
     */
    const handleSubmit = async (values) => {
        if (!file) {
            message.warning('Pilih gambar produk terlebih dahulu.');
            return;
        }

        setLoading(true);
        const formData = new FormData();
        formData.append('file', file);
        formData.append('title', values.title);

        try {
            await api.post('/products', formData, {
                headers: { 'Content-type': 'multipart/form-data' },
            });
            message.success('Produk berhasil ditambahkan!');
            navigate('/');
        } catch (err) {
            message.error(err.response?.data?.message || 'Gagal menambahkan produk.');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div style={{ maxWidth: 600, margin: '0 auto' }}>
            <Space style={{ marginBottom: 16 }}>
                <Button icon={<ArrowLeftOutlined />} onClick={() => navigate('/')}>
                    Kembali
                </Button>
            </Space>

            <Card>
                <Title level={3} style={{ marginBottom: 24 }}>Tambah Produk</Title>

                <Form layout="vertical" onFinish={handleSubmit} requiredMark={false}>
                    <Form.Item
                        label="Nama Produk"
                        name="title"
                        rules={[
                            { required: true, message: 'Nama produk wajib diisi' },
                            { max: 255, message: 'Nama produk maksimal 255 karakter' },
                        ]}
                    >
                        <Input placeholder="Masukkan nama produk" size="large" />
                    </Form.Item>

                    <Form.Item label="Gambar Produk">
                        <Upload
                            beforeUpload={() => false}
                            onChange={handleFileChange}
                            maxCount={1}
                            accept=".jpg,.jpeg,.png"
                            showUploadList={false}
                        >
                            <Button icon={<UploadOutlined />}>Pilih Gambar</Button>
                        </Upload>
                        <div style={{ marginTop: 4, fontSize: 12, color: '#888' }}>
                            Format: JPG, JPEG, PNG. Maks: 2 MB.
                        </div>
                    </Form.Item>

                    {preview && (
                        <Form.Item>
                            <Image
                                src={preview}
                                alt="Preview"
                                width={200}
                                style={{ borderRadius: 8 }}
                            />
                        </Form.Item>
                    )}

                    <Form.Item>
                        <Button
                            type="primary"
                            htmlType="submit"
                            size="large"
                            loading={loading}
                            block
                        >
                            Simpan Produk
                        </Button>
                    </Form.Item>
                </Form>
            </Card>
        </div>
    );
}
