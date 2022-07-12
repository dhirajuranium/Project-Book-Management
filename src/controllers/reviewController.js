//================ imports ===============================//

const bookModel = require("../models/bookModel");

const reviewModel = require("../models/reviewModel");

const validators = require("../validators/validator");

//================ POST /books/:bookId/review route handler ===============================//
const createReview = async function (req, res) {
  try {
    let bookId = req.params.bookId;

    if (!validators.isValidObjectId(bookId))
      return res.status(400).send({
        status: false,
        message: `The given bookId:${bookId} is not a valid book id`,
      });

    const bookDetail = await bookModel.findOne(
      {_id: bookId, isDeleted: false, }, 
      { ISBN : 0});

    if (!bookDetail) {
      return res
        .status(404)
        .send({ status: false, message: "Book not found!" });
    }

    let data = req.body


    if (!validators.isValidRequestBody(data))
      return res.status(400).send({
        status: false,
        message: "Invalid request body. Please provide review details.",
      });

    if(typeof(data.reviewedBy) == 'string'){
      if(data.reviewedBy.trim().length == 0){
          return res.status(400).send({
          status: false,
          message: "Provide the name of the reviewer"
        })
      }
    }

    if (!(validators.isValidField(data.review))) {
      return res.status(400).send({
        status: false,
        message: "Please provide the review"
      })
    }

    if (typeof (data.rating) != 'number' || (data.rating > 5 || data.rating < 1)) {
      return res.status(400).send({
        status: false,
        message: "Please input rating between 1-5 only"
      })
    }
    data["bookId"] = bookId
    data["reviewedAt"] = Date.now()

    await bookModel.findOneAndUpdate({ _id: bookId }, { $inc: { 'reviews': 1 } },{new :true})

    let reviewsData = await reviewModel.create(data)

    res.status(201).send({
      status: true,
      message: "Success",
      data: { ...bookDetail.toObject(), reviewsData}
    })

  }
  catch (error) {
    return res.status(500).send({ status: false, message: error.message });
  }
}

//================ PUT /books/:bookId/review/:reviewId route handler ===============================//

const updateReview = async function (req, res) {
  try {
    if (req.params.bookId == undefined)
      return res.status(400).send({ status: false, message: "bookId is required." });

    const bookId = req.params.bookId;

    if (!validators.isValidObjectId(bookId))
      return res.status(400).send({ status: false, message: "The given bookId is not a valid ObjectId." })

    let bookDetail = await bookModel.findOne(
      { _id: bookId, isDeleted: false },
      { ISBN :0 }
      );

    if (!bookDetail)
      return res.status(404).send({ status: false, message: "Book not found!" });

    if (req.params.reviewId === undefined)
      return res.status(400).send({ status: false, message: "Invalid request parameter. Please provide reviewId." });

    const reviewId = req.params.reviewId;

    if (!validators.isValidObjectId(reviewId))
      return res.status(400).send({ status: false, message: "The given reviewId is not a valid ObjectId." });

    let reviewExists = await reviewModel.findOne({ _id: reviewId, bookId, isDeleted: false });

    if (!reviewExists)
      return res.status(404).send({ status: false, message: "Review not found!" });

    if (!validators.isValidRequestBody(req.body))
      return res.status(400).send({ status: false, message: "Invalid request body. Please provide review details to be updated in request body." });

    let requestBody = req.body;

    let updatedReviewDetails = {};
    if('review' in requestBody){
      if(!validators.isValidField(requestBody.review)){
       return res.status(400).send({
          status : false,
          message : "Invalid request for review"
        })
      }
      updatedReviewDetails['review'] = requestBody.review
    }

      if('rating' in requestBody){
        if (typeof (requestBody.rating) != 'number' || (requestBody.rating > 5 || data.rating < 1)) {
          return res.status(400).send({
            status: false,
            message: "Please provide rating between 1-5 only"
          })
        }
        updatedReviewDetails['rating'] = requestBody.rating;
      }
      

      if('reviewedBy' in requestBody){
        if(!validators.isValidField(requestBody.reviewedBy)){
         return res.status(400).send({
            status : false,
            message : "Invalid request for reviewed By"
          })
        }
        updatedReviewDetails['reviewedBy'] = requestBody.reviewedBy;
      }
    

    let reviewsData = await reviewModel.findByIdAndUpdate(reviewId, updatedReviewDetails, { new: true });

    return res.status(200).send({ status: true, 
      message: "Success", 
      data: { ...bookDetail.toObject(), reviewsData}
    });
  }
  catch (error) {
    return res.status(500).send({ status: false, message: error.message });
  }
};


//================ DELETE /books/:bookId/review/:reviewId route handler ===============================//

const deleteReview = async function (req, res) {
  try {
    if (req.params.bookId == undefined)
      return res
        .status(400)
        .send({ status: false, message: "bookId is required." });

    const bookId = req.params.bookId;

    if (!validators.isValidObjectId(bookId))
      return res
        .status(400)
        .send({
          status: false,
          message: "The given bookId is not a valid ObjectId.",
        });

    let bookExists = await bookModel.findOne({ _id: bookId, isDeleted: false });

    if (!bookExists)
      return res
        .status(404)
        .send({ status: false, message: "Book not found!" });

    if (req.params.reviewId === undefined)
      return res
        .status(400)
        .send({
          status: false,
          message: "Invalid request parameter. Please provide reviewId.",
        });

    const reviewId = req.params.reviewId;

    if (!validators.isValidObjectId(reviewId))
      return res
        .status(400)
        .send({
          status: false,
          message: "The given bookId is not a valid ObjectId.",
        });

    let reviewAlreadyExists = await reviewModel.findOne({
      _id: reviewId,
      bookId,
      isDeleted: false,
    });

    if (!reviewAlreadyExists)
      return res
        .status(404)
        .send({ status: false, message: "Review not found!" });

    await reviewModel.findByIdAndUpdate(reviewId, {
      $set: { isDeleted: true },
    });

    await bookModel.findByIdAndUpdate(bookId, { $inc: { reviews: -1 } });

    return res
      .status(200)
      .send({ status: true, message: "Success" });
  } catch (error) {
    return res.status(500).send({ status: false, message: error.message });
  }
};

//================ exports ===============================//

module.exports = { createReview, updateReview, deleteReview };