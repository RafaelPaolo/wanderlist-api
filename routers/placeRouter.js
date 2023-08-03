import express from 'express';
import Place from '../models/placeModel.js';

const router = express.Router();

// ADD PLACE
router.post('/addPlace', async (req, res) => {
  try {
    const { user, place, fromDate, toDate } = req.body;

    const newPlace = new Place({
      user: user,
      place: place,
      fromDate: fromDate,
      toDate: toDate
    });

    const overlappingReservations = await Place.find({
      fromDate: { $lt: new Date(fromDate) },
      toDate: { $gt: new Date(toDate) }
    });
    

    await newPlace.save();

    res.status(201).json({
      message: 'New Place Added',
      data: newPlace
    });
  } catch (error) {
    res.status(500).send('Error in adding new Place');
  }
});


//SHOW PLACE 
router.get("/showPlace", async (req, res) => {

  const place = await Place.find();
  res.send({ data: place })

});


// GET ALL DATES
router.get('/dates', async (req, res) => {
  try {
    const dates = await Place.find({}, 'fromDate toDate');
    res.json({dates});
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Internal Server Error' });
  }
});

//DELETE PLACE
router.delete("/deletePlace/:id", async (req, res) => {
  try {
    const { id } = req.params;
    const deletedPlace = await Place.deleteOne({ _id: id });

    res.send({
      message: 'Delete Successful',
      data: deletedPlace,
    });
  } catch (error) {
    console.error('Error deleting Transaction', error)
  }
});

export default router;