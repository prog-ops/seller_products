import {useState} from "react";
import {useNavigate} from "react-router-dom";
import axios from "axios";

export default function ProductAdd(){
    const navigate = useNavigate()
    const [title, setTitle] = useState('')
    const [file, setFile] = useState('')
    const [preview, setPreview] = useState('')

    const loadImage = e => {
        const image = e.target.files[0]
        setFile(image)
        setPreview(URL.createObjectURL(image))
    }

    const saveProduct = async (e) => {
        e.preventDefault()
        const data = new FormData()
        data.append('file', file)
        data.append('title', title)
        try {
            await axios.post(
                'http://localhost:5000/products',
                data,
                {
                    headers: {'Content-type': 'multipart/form-data'}
                }
            );
            navigate('/')
        } catch (e) {
            console.error(e.message)
        }
    }

    return(
        <div className='columns is-centered mt-5'>
            <div className='column is-half'>
                <p className='h1'>Tambah Produk</p>
                <form onSubmit={saveProduct}>

                    <div className='field'>
                        <label className='label'>Nama</label>
                        <div className='control'>
                            <input
                                type='text'
                                className='input'
                                value={title}
                                onChange={e => setTitle(e.target.value)}
                                placeholder='Nama produk'
                            />
                        </div>
                    </div>

                    <div className='field'>
                        <label className='label'>Image</label>
                        <div className='control'>
                            <div className='file'>
                                <label className='file-label'>
                                    <input
                                        type='file'
                                        className='file-input'
                                        onChange={loadImage}
                                    />
                                    <span className='file-cta'>
                                        <span className='file-label'>Choose a file..</span>
                                    </span>
                                </label>
                            </div>
                        </div>
                    </div>

                    {preview ? (
                        <figure className='image is-128x128'>
                            <img src={preview} alt='Preview Image'/>
                        </figure>
                    ) : (
                        ""
                    )}

                    <div className='field'>
                        <div className='control'>
                            <button type='submit' className='button is-success'>
                                Save
                            </button>
                        </div>
                    </div>
                </form>
            </div>
        </div>
    )
}
