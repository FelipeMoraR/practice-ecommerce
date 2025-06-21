import { sqDb } from '../config/db.config.js'
import Commune from '../models/commune.model.js'
import Region from '../models/region.model.js'
import { HttpError } from '../utils/customErrors.js'

export const getAllCommunes = async (req, res) => {
  try {
    const result = await sqDb.transaction(async () => {
      const allComunes = await Commune.findAll()
      if (!allComunes) throw new HttpError('No communes finded', 404)
      const comunesCleaned = allComunes.reduce((acc, comune) => {
        if (!comune) return acc
        if (!comune.dataValues) return acc
        const newComune = { id: comune.dataValues.id, name: comune.dataValues.name }
        acc.push(newComune)
        return acc
      }, [])

      return comunesCleaned
    })

    return res.status(200).send({ status: 200, data: result })
  } catch (error) {
    console.log('getAllCommunes: ', error)
    if (error instanceof HttpError) return res.status(error.statusCode).send({ status: error.statusCode, message: error.message })
    return res.status(500).send({ status: 500, message: 'Internal server error' })
  }
}

export const getAllRegions = async (req, res) => {
  try {
    const result = await sqDb.transaction(async () => {
      const allRegions = await Region.findAll()
      if (!allRegions) throw new HttpError('No Regions finded', 404)
      const regionsCleaned = allRegions.reduce((acc, region) => {
        if (!region) return acc
        if (!region.dataValues) return acc
        const newRegion = { id: region.dataValues.id, name: region.dataValues.name }
        acc.push(newRegion)
        return acc
      }, [])

      return regionsCleaned
    })

    return res.status(200).send({ status: 200, data: result })
  } catch (error) {
    console.log('getAllRegions: ', error)
    if (error instanceof HttpError) return res.status(error.statusCode).send({ status: error.statusCode, message: error.message })
    return res.status(500).send({ status: 500, message: 'Internal server error' })
  }
}
