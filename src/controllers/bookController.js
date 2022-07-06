const mongoose = require('mongoose');

const regxDate = /^\d{4}\-(0[1-9]|1[012])\-(0[1-9]|[12][0-9]|3[01])$/

const validation = function (value) {
    if (typeof value === null || value === undefined) return false
    if (typeof value === 'string' && value.trim().length == 0) return false
    return true
}

const validObjectId = function (id) {
    if (mongoose.Types.ObjectId.isValid(id)) return true
    return false
}

const validJson = function (value) {
    if (object.keys(value).length == 0) return false
    return true
}

const createBook = async (req, res) => {

    try {


        const bookData = req.body
        if (!validJson(bookData)) return res.status(400).send({ status: false, messege: "Provide valid details" })

        const { title, excerpt, userId, ISBN, category, subcategory, releasedAt } = bookData

        if (!userId) return res.status(400).send({ status: false, messege: "userId must be present" })
        if (!validObjectId(userId)) return res.status(400).send({ status: false, messege: "userId must be valid" })

        const findUser = await Usermodel.findOne({ userId: userId })
        if (!findUser) return res.status(404).send({ status: false, messege: "user not found" })

        if (!title) return res.status(400).send({ status: false, messege: "title must be present" })
        if (!validation(title)) return res.status(400).send({ status: false, messege: "title should be valid" })

        if (!excerpt) return res.status(400).send({ status: false, messege: "excerpt must be present" })
        if (!validation(title)) return res.status(400).send({ status: false, messege: "excerpt should be valid" })

        if (!ISBN) return res.status(400).send({ status: false, messege: "ISBN must be present" })
        if (!validation(title)) return res.status(400).send({ status: false, messege: "ISBN should be valid" })

        if (!category) return res.status(400).send({ status: false, messege: "category must be present" })
        if (!validation(title)) return res.status(400).send({ status: false, messege: "category should be valid" })

        if (!subcategory) return res.status(400).send({ status: false, messege: "subcategory must be present" })
        if (!validation(title)) return res.status(400).send({ status: false, messege: "subcategory should be valid" })

        if (!releasedAt) return res.status(400).send({ status: false, messege: "subcategory must be present" })
        if (!regxDate.test(releasedAt)) return res.status(400).send({ status: false, messege: "releasedAt should be valid" })

        const book = await Bookmodel.create(bookData)

        res.status(201).send({ status: true, message: 'Success', data: book })
    }

    catch (error) {
        res.status(500).send({ status: false, message: error.message })
    }

}





const getBooks = async (req, res) => {

    try {

        const query = req.query

        if (!validJson(query) || !query.trim()) return res.status(400).send({ status: false, messege: "Provide valid details in query" })

        const bookDetails = await Bookmodel.find(query)
        if (!bookDetails) return res.status(404).send({ status: false, messege: "no data found" })

        const newBook = bookDetails.filter(n => { if (n.isDeleted == false) return n }).select({ title: 1, excerpt: 1, userId: 1, category: 1, reviews: 1, releasedAt: 1 }).sort({ title:1 })

        res.status(200).send({ status: true, message: 'Books list', data: newBook })

    }
    catch (error) {
        res.status(500).send({ status: false, message: error.message })
    }

}


const getBooksbyId = async (req, res) => {

    try {
        const bookId = req.params.bookId
        if (!bookId) return res.status(400).send({ status: false, messege: "bookId is required" })
        if (!validObjectId(bookId)) return res.status(400).send({ status: false, messege: "Provide valid bookId" })
        
        const bookDetails=await Bookmodel.find(bookId)
        const newBook = bookDetails.filter(n => { if (n.isDeleted == false) return n }).select({ title: 1, excerpt: 1, userId: 1, category: 1, reviews: 1, releasedAt: 1 }).sort({ title:1 })

        res.status(200).send({ status: true, message: 'Books list', data:newBook})

    }
    catch (error) {
        res.status(500).send({ status: false, message: error.message })
    }
}






const updateBook = async (req, res) => {

    try {

        const bookId = req.params.bookId
        if (!bookId) return res.status(400).send({ status: false, messege: "bookId is required" })
        if (!validObjectId(bookId)) return res.status(400).send({ status: false, messege: "Provide valid bookId" })

        const alert = await Bookmodel.findOne({ _id: bookId })
        if (!alert) return res.status(404).send({ status: false, messege: "no data found " })

        if (alert.isDeleted) return res.status(409).send({ status: false, messege: "this book is already deleted" })

        const data = req.body
        if (!validJson(data)) return res.status(400).send({ status: false, messege: "Provide valid details" })

        const { title, excerpt, releasedate, ISBN } = data

        const updateBook = await Bookmodel.findOneAndUpdate((bookId), { $set: { title: title, excerpt: excerpt, releasedate:releasedate,ISBN:ISBN } }, { new: true })

        res.status(200).send({ status: true, messege: "Success", data: updateBook })
    }
    catch (error) {
        res.status(500).send({ status: false, message: error.message })
    }

}






const deleteBook = async (req, res) => {

    try {

        const bookId = req.params.bookId
        if (!bookId) return res.status(400).send({ status: false, messege: "bookId is required" })
        if (!validObjectId(bookId)) return res.status(400).send({ status: false, messege: "Provide valid bookId" })

        const alert = await Bookmodel.findOne({ _id: bookId })
        if (!alert) return res.status(404).send({ status: false, messege: "no data found " })

        if (alert.isDeleted) return res.status(409).send({ status: false, messege: "this book is already deleted" })

        const deleteBook = await BookModel.findOneAndUpdate((bookId), { $set: { isDeleted: true, deletedAt: date } }, { new: true })
        res.status(200).send({ status: true, messege: "Success", data: updateBook })

    }
    catch (error) {
        res.status(500).send({ status: false, message: error.message })
    }
}





module.exports = { createBook, getBooks, getBooksbyId, updateBook, deleteBook }