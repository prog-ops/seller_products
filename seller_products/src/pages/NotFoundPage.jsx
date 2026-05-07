import { useNavigate } from 'react-router-dom';
import { Button, Result } from 'antd';

/**
 * NotFoundPage — halaman 404 untuk route yang tidak ditemukan.
 */
export default function NotFoundPage() {
    const navigate = useNavigate();

    return (
        <div style={{
            minHeight: '100vh',
            display: 'flex',
            justifyContent: 'center',
            alignItems: 'center',
        }}>
            <Result
                status="404"
                title="404"
                subTitle="Halaman yang Anda cari tidak ditemukan."
                extra={
                    <Button type="primary" onClick={() => navigate('/')}>
                        Kembali ke Beranda
                    </Button>
                }
            />
        </div>
    );
}
