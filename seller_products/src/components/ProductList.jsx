import {useEffect, useState} from "react";
import axios from "axios";

export default function ProductList(){
    const [products, setProducts] = useState([]);

    const [msg, setMsg] = useState('');

    const getProducts = async () => {
        try {
            const response = await axios.get('http://localhost:5000/products');
            setProducts(response.data);
        } catch (error) {
            console.error("Error fetching products:", error);
            setMsg("Gagal mengambil data produk. Pastikan Backend sudah berjalan di port 5000!");
        }
    }

    useEffect(() => {
        getProducts()
    }, []);

    return(
        <div className='container mt-5'>
            <p className='h1'>Daftar Produk</p>
            {msg && <div className="notification is-danger">{msg}</div>}
            <div className='columns is-multiline'>
                {products.map((product, index) => (
                    <div className='column is-one-quarter'>
                        <div className='card' key={index+''+product.url}>
                            <div className='card-image'>
                                <figure className='image is-4by3'>
                                    <img src={product.url}
                                         alt='Image placeholder'/>
                                </figure>
                            </div>
                            <div className='card-content'>
                                <div className='media'>
                                    <div className='media-content'>
                                        <p className='title is-4'>{product.name}</p>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    )
}
