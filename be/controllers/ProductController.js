import Product from "../models/ProductModel.js";
import path from "path";

export const getProducts =
    async (req, res) => {
        try {
            const response = await Product.findAll()
            res.json(response)
        } catch (e) {
            console.error(e.message)
        }
    }

export const getProductById =
    async (req, res) => {
        try {
            const response = await Product.findOne({where: {id: req.param.id}})
            res.json(response)
        } catch (e) {
            console.error(e.message)
        }
    }

export const saveProduct = (req, res) => {
    if (req.files === null)
        return res.status(400).json({msg: 'No file uploaded.'})
    const name = req.body.title
    const file = req.files.file
    const fileSize = file.data.length
    const ext = path.extname(file.name)
    const fileName = file.md5 + ext
    const url = `${req.protocol}://${req.get("host")}/images/${fileName}`
    const allowedType = ['.png', '.jpg', '.jpeg']
    if (!allowedType.includes(ext.toLowerCase()))
        return res.status(422).json({msg: "Tipe gambar tidak valid, hanya boleh JPG/JPEG dan PNG."})
    if (fileSize > 2_000_000) // 2MB
        return res.status(422).json({msg: "Ukuran gambar tidak boleh lebih dari 2 MB."})
    file.mv(`./public/images/${fileName}`, async (error) => {
        if (error) return res.status(500).json({msg: error.message})
        try {
            await Product.create({
                name: name,
                image: fileName,
                url: url,
            })
            res.status(201).json({msg: "Produk berhasil ditambahkan."})
        } catch (e) {
            console.error(e.message)
        }
    })
}

export const updateProduct =
    async (req, res) => {

    }

export const deleteProduct =
    async (req, res) => {

    }
