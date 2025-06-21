import { getAllCommunes, getAllRegions } from '../controllers/address.controller.js'
import express from 'express'

const AddressRouter = express.Router()

// SECTION GET
// ANCHOR Public get
// ANCHOR Private get
AddressRouter.get('/all-communes', getAllCommunes)
AddressRouter.get('/all-regions', getAllRegions)

export default AddressRouter
